var expr = require('express');
const NodeCouchDb = require('node-couchdb');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const path = require('path');
var engine = require('ejs');

dotenv.config();

var app = expr();

app.engine('html', engine.__express);
app.set('views', path.join(__dirname, 'ProgettoLTW-main'));
app.set('view engine', 'html');

const couch = new NodeCouchDb({
    host: '127.0.0.1',
    protocol: 'http',
    port: process.env.DB_PORT,
    auth: {
        user: process.env.DB_USER,
        pass: process.env.DB_PW
    }
})

app.use(expr.urlencoded({
    extended: false
}));

app.use(cookieParser());

app.use(expr.static(path.join(__dirname, './ProgettoLTW-main')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
});

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
});

app.get('/login', function (req, res) {
    if (req.cookies['AuthToken']) {
        couch.get("tokens", req.cookies['AuthToken'])
            .then(({
                data,
                headers,
                status
            }) => {
                couch.get("users", data.email)
                    .then(({
                        data,
                        headers,
                        status
                    }) => {
                        res.render('profiloprova', {
                            utente: data.username
                        });
                    })
                    .catch(err => {
                        res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
                    });
            })
            .catch(err => {
                res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
            });
    } else res.render('login');
});


app.get('/signup', function (req, res) {
    if (req.cookies['AuthToken']) res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
    else {
        res.render('signup');
    }
});

app.post('/signup', function (req, res) {

    var email = req.body.email;
    var username = req.body.username;
    var salt = crypto.randomBytes(8).toString('hex');
    if (req.body.password !== req.body.repeatpassword) {
        res.render('signup', {
            message: 'Le password non coincidono'
        })
    } else {
        var password = getHashedPassword(req.body.password + salt);
        couch.insert("users", {
            _id: email,
            email: email,
            username: username,
            password: password,
            salt: salt
        }).then(({
            data,
            headers,
            status
        }) => {
            res.render('signup', {
                message: 'Registrazione effettuata correttamente'
            })
            // data is json response
            // headers is an object with all response headers
            // status is statusCode number
        }).catch(err => {
            //res.send("email già esistente, scegline un'altra!");
            console.log(err.message);
            res.render('signup', {
                message: 'Email già esistente'
            })
        });
    }
});

app.get('/login', function (req, res) {
    if (req.cookies['AuthToken']) res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));
    else {
        res.render('login');
    }
});


app.post('/login', function (req, res) {
    // fare controllo email
    var email = req.body.email;
    console.log('logging in... ' + email);
    couch.get("users", email).then(({
        data,
        headers,
        status
    }) => {
        if (data.password === getHashedPassword(req.body.password + data.salt)) {
            const authToken = generateAuthToken();
            couch.insert("tokens", {
                _id: authToken,
                email: email
            }).then(({
                data,
                headers,
                status
            }) => {
                console.log("token inserito correttamente");
                if (req.body.remember === "on") {
                    res.cookie('AuthToken', authToken, {
                        maxAge: 864000000 * 30
                    });
                } else {
                    res.cookie('AuthToken', authToken);
                }
                res.sendFile(path.join(__dirname, './ProgettoLTW-main/index.html'));

            }).catch(err => {
                res.render('login', {
                    message: 'Errore Server: ' + err.message
                })
                //res.send("errore server: " + err.message);
            });
        } else {
            //res.send('password errata!');
            res.render('login', {
                message: 'Password Errata'
            })

        }
        // data is json response
        // headers is an object with all response headers
        // status is statusCode number
    }).catch(err => {
        //res.send('e-mail o password errata ( Viva gli oranghi! )');
        //res.send(err.message);
        res.render('login', {
            message: 'E-mail o password errata'
        })
    });
});

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex')
}

app.listen(process.env.SERVER_PORT, function () {
    console.log('listening on port: ' + process.env.SERVER_PORT)
});