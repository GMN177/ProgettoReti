var expr = require('express');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const path = require('path');
var engine = require('ejs');
var pgp = require("pg-promise")();
var cors = require('cors');
var amqp = require('amqplib/callback_api');

dotenv.config();

const cn = {
    host: process.env.DB_HOST,
    port: 5432,
    database: 'progetto_reti',
    user: 'postgres',
    password: process.env.DB_PW
};

const db = pgp(cn);

var app = expr();

app.use(cors())

app.engine('html', engine.__express);
app.set('views', path.join(__dirname, 'ProgettoLTW-main'));
app.set('view engine', 'html');

app.use(expr.urlencoded({
    extended: false
}));

app.use(cookieParser());

app.use(expr.static(path.join(__dirname, './ProgettoLTW-main')));

function sendLog(message) {
    console.log(message)
    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function(error1, channel) {
          if (error1) {
            throw error1;
          }
          var exchange = 'logs';
          var today = new Date();
          var h = today.getHours();
          var m = today.getMinutes();
          var s = today.getSeconds();
          channel.assertExchange(exchange, 'fanout', {
            durable: false
          });
          channel.publish(exchange, '', Buffer.from('[main server] [' + h + ":" + m + ":" + s + '] ' + message));
          //console.log(" [x] Sent %s", message);
        });
        setTimeout(function() {
          connection.close();
          //process.exit(0);
        }, 500);
      })
}

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
});

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
});

app.get('/signup', function (req, res) {
    sendLog("GET /signup");
    if (req.cookies['AuthToken']) res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
    else {
        res.render('signup');
    }
});

app.post('/signup', function (req, res) {
    var email = req.body.email;
    var username = req.body.username;
    var salt = crypto.randomBytes(8).toString('hex');
    sendLog("POST /signup with email="+email+" and username="+username);
    if(req.body.password.length < 8){
        res.render('signup', {
            message: 'Password must be at least 8 characters'
        })
    }
    if (req.body.password !== req.body.repeatpassword) {
        res.render('signup', {
            message: "Passwords don't match"
        })
    } else {
        var password = getHashedPassword(req.body.password + salt);
        sendLog("Inserting user "+username+" into users");
        db.query('INSERT INTO users VALUES ($1, $2, $3, $4)', [email, username, password, salt])
            .then(result => {
                res.render('login', {
                    message: "Account created correctly. Log in to proceed!"
                })
            })
            .catch(err => {
                sendLog(err.message);
                res.render('signup', {
                    message: 'Email already exists'
                })
            })
    }
});

app.get('/profilo', renderizzaProfilo);

function renderizzaProfilo(req, res, message, cookie) {
    if (!cookie) cookie = req.cookies['AuthToken']
    db.query('SELECT username, tokens.email FROM tokens, users WHERE tokens.email=users.email AND tokens.token = $1', [cookie])
        .then(result => {
            db.query('SELECT title FROM users_movies WHERE email = $1', [result[0].email])
                .then(result1 => {
                    prof = {
                        message: message,
                        utente: result[0].username,
                        movie1: undefined,
                        movie1encoded: undefined,
                        movie2: undefined,
                        movie2encoded: undefined,
                        movie3: undefined,
                        movie3encoded: undefined,
                        movie4: undefined,
                        movie4encoded: undefined
                    }
                    for (var i = 1; i <= result1.length; i++) {
                        prof["movie" + i.toString()] = result1[i - 1].title.replace(/ /g, '_');
                        prof["movie" + i.toString() + "encoded"] = encodeURI(result1[i - 1].title.replace(/ /g, '_'));
                    }
                    res.render('profilo', prof);
                }).catch(err => {
                    sendLog('select 2 error:', err)
                    res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
                })
        }).catch(err => {
            sendLog('select 1 error:', err)
            res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
        })

}

app.get('/login', function (req, res) {
    sendLog("GET /login")
    if (req.cookies['AuthToken']) renderizzaProfilo(req, res);
    else res.render('login')
});

app.post('/login', function (req, res) {
    var email = req.body.email;
    sendLog("POST /login");
    sendLog(email + " is logging in");
    db.query('SELECT username, password, salt FROM users WHERE email= $1', [email])
        .then(result1 => {
            if (result1[0].password === getHashedPassword(req.body.password + result1[0].salt)) {
                const authToken = generateAuthToken();
                sendLog("Inserting cookie into tokens...");
                db.query('INSERT INTO tokens VALUES ($1, $2)', [email, authToken])
                    .then(result2 => {
                        sendLog("Cookie inserted!");
                        if (req.body.remember === "on") {
                            res.cookie('AuthToken', authToken, {
                                maxAge: 864000000 * 30
                            });
                        } else {
                            res.cookie('AuthToken', authToken);
                        }
                        renderizzaProfilo(req, res, undefined, authToken);
                    })
                    .catch(err => {
                        res.render('login', {
                            message: 'Server error: ' + err.message
                        })
                    })
            } else {
                res.render('login', {
                    message: 'Wrong password'
                })
            }
        })
        .catch(err => {
            res.render('login', {
                message: 'Wrong e-mail or password'
            })
        })
});

app.post('/logout', function (req, res) {
    var authToken = req.cookies['AuthToken'];
    sendLog("POST /logout");
    db.query('DELETE FROM tokens where token = $1', [authToken])
        .then(result => {
            sendLog("Cookie deleted from tokens");
            res.clearCookie('AuthToken');
            res.clearCookie('TraktToken');
            res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
        })
        .catch(err => {
            res.sendFile(path.join(__dirname, './ProgettoLTW-main/profilo.html'));
        })
});

app.all('*', (req, res) => {
    res.status(404).send('Resource not found')
})

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex')
};

app.listen(3002, () => {
    sendLog('Listening on port: ' + 3002)
})