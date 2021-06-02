require('dotenv').config();

var expr = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser')
const path = require('path');
const engine = require('ejs');
const fetch = require("node-fetch");
const cors = require('cors');
const amqp = require('amqplib/callback_api');

const api = require('./api.js')
const db = require('./db.js')

const app = expr();

app.use(expr.urlencoded({
    extended: false
}));

app.use(expr.json());

app.use(cookieParser());

app.use(cors());

app.engine('html', engine.__express);
app.set('views', path.join(__dirname, 'ProgettoLTW-main'));
app.set('view engine', 'html');

app.use('/api', api)

function sendLog(message) {
    console.log(message)
    amqp.connect('amqp://rabbitmq', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
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
            channel.publish(exchange, '', Buffer.from('[app server] [' + h + ":" + m + ":" + s + '] ' + message));
        })
        setTimeout(function () {
            connection.close();
        }, 500)
    })
}

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

app.get("/movie/genres", function (req, res) {
    var str = '';
    var gen = JSON.parse(req.query.genres);
    sendLog('GET /movie/genres with gen=' + gen);
    for (var i = 0; i < gen.length; i++) {
        if (gen.length - 1 !== i) {
            str += "gen = '" + gen[i] + "' OR ";
        } else {
            str += "gen = '" + gen[i] + "'";
        }
    }
    db.query("SELECT id, name FROM movies WHERE " + str)
        .then(result => {
            var rindex = crypto.randomInt(result.length);
            var id = result[rindex].id;
            var name = result[rindex].name;
            res.send({
                id: id,
                name: name
            })
        }).catch(err => res.status(500).send(err.message))
})


app.get("/movie/mood", function (req, res) {
    var mood = req.query.mood;
    sendLog('GET /movie/mood with mood=' + mood);
    db.query("SELECT id, name FROM movies WHERE mood = $1", [mood])
        .then(result => {
            var rindex = crypto.randomInt(result.length);
            var id = result[rindex].id;
            var name = result[rindex].name;
            res.send({
                id: id,
                name: name
            })
        }).catch(err => res.status(500).send(err.message))
})

app.get('/movie', function (req, res) {
    var id = req.query.id;
    sendLog("GET /MoviePage with id=" + id);
    var url = 'https://api.trakt.tv/search/imdb/' + id + '?extended=full';
    sendLog("Requesting trakt api...")
    fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': process.env.TRAKTV_API_KEY
            }
        }).then(result => result.json())
        .then(json => {
            sendLog("Request to trakt went fine!");
            sendLog(json[0].movie.title);
            res.json({
                img: "moviesposters/" + json[0].movie.title.replace(/ /g, '_'),
                id: id,
                titolo: json[0].movie.title,
                trama: json[0].movie.overview,
                released: json[0].movie.released,
                runtime: json[0].movie.runtime,
                trailer: json[0].movie.trailer,
                country: json[0].movie.country,
                raiting: json[0].movie.rating,
                homepage: json[0].movie.homepage,
                language: json[0].movie.language
            })
        }).catch(err => {
            sendLog(err.message);
            res.status(500).json({
                error: err
            })
        })
})

app.post('/movie/save', function (req, res) {
    const id = req.body.id;
    const title = req.body.title;
    sendLog("POST /movie/save");
    sendLog("Saving " + title + "in users_movies");
    db.query("SELECT email FROM tokens where token=$1", [req.cookies['AuthToken']])
        .then(result1 => {
            const email = result1[0].email
            sendLog("Saving movie into users_movies...");
            db.query("INSERT into users_movies VALUES($1,$2,$3)", [email, title, id])
                .then(result => {
                    sendLog("Movie inserted correcly!");
                    res.json({
                        success: 'true'
                    })
                }).catch(err => {
                    if (err.code === '23505') {
                        sendLog("Movie already in users_movies");
                        res.json({
                            success: 'duplicato'
                        })
                    } else {
                        sendLog("Error: " + err);
                        res.json({
                            success: 'false'
                        })
                    }
                })
        }).catch(err => {
            sendLog("Error: " + err);
            res.json({
                success: 'false'
            })
        })
})

app.get('/remove', function (req, res) {
    const title = req.query.title.replace(/_/g, ' ');
    db.query("SELECT email FROM tokens where token=$1", [req.cookies['AuthToken']])
        .then(result1 => {
            const email = result1[0].email;
            db.query("DELETE FROM users_movies WHERE email=$1 AND title=$2", [email, title])
                .then(result => {
                    renderizzaProfilo(req, res, "", "");
                }).catch(err => {
                    res.send("Server error");
                })
        }).catch(err => {
            sendLog(err);
            res.send("Server error");
        })
});

app.get("/OAuthTrakttv", (req, res) => {
    sendLog("GET /OAuthTrakttv");
    if (req.cookies['TraktToken']) renderizzaProfilo(req, res, 'Already linked to Trakt.tv')
    else {
        db.query('SELECT trakt_token FROM trakt_tokens JOIN tokens ON trakt_tokens.email = tokens.email WHERE tokens.token = $1', [req.cookies['AuthToken']])
            .then(result => {
                if (result.length === 0) {
                    sendLog("Authorizing user...");
                    res.redirect('https://trakt.tv/oauth/authorize?response_type=code&client_id=' + process.env.TRAKTV_API_KEY + '&redirect_uri=http://localhost/callback');
                } else {
                    res.cookie('TraktToken', result[0].trakt_token);
                    renderizzaProfilo(req, res, 'Already linked to Trakt.tv')
                }
            }).catch(err => {
                sendLog('ERROR!!!!!')
                sendLog(err)
                renderizzaProfilo(req, res, "Something gone wrong")
            })
    }
})

app.get('/callback', (req, res) => {
    var code = req.query.code;
    sendLog('GET /callback with code=' + code);
    fetch('https://api.trakt.tv/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
                client_id: process.env.TRAKTV_API_KEY,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uri: 'http://localhost/callback',
                grant_type: 'authorization_code'
            })
        }).then(result => result.json())
        .then(json => {
            var TraktToken = json.access_token;
            var RefreshToken = json.refresh_token;
            sendLog('User authorized with token=' + TraktToken);
            db.query('SELECT email FROM tokens WHERE token = $1', [req.cookies['AuthToken']])
                .then(result => {
                    db.query('INSERT INTO trakt_tokens VALUES ($1, $2, $3)', [result[0].email, TraktToken, RefreshToken])
                        .then(() => {
                            res.cookie('TraktToken', TraktToken);
                            renderizzaProfilo(req, res, "Trakt.tv account linked correctly");
                        }).catch(renderizzaProfilo(req, res, "Something went wrong"))
                }).catch(renderizzaProfilo(req, res, "Something went wrong"))
        }).catch(err => {
            sendLog(err.message);
            res.status(500).json({
                error: err
            })
        })
    /*
    requ({
        method: 'POST',
        url: 'https://api.trakt.tv/oauth/token',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            client_id: process.env.TRAKTV_API_KEY,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: 'http://localhost/callback',
            grant_type: 'authorization_code'
        })
    }, function (error, response, body) {
        var TraktToken = JSON.parse(body).access_token;
        var RefreshToken = JSON.parse(body).refresh_token;
        sendLog('User authorized with token=' + TraktToken);
        db.query('SELECT email FROM tokens WHERE token = $1', [req.cookies['AuthToken']])
            .then(result => {
                db.query('INSERT INTO trakt_tokens VALUES ($1, $2, $3)', [result[0].email, TraktToken, RefreshToken])
                    .then(result1 => {
                        res.cookie('TraktToken', TraktToken);
                        renderizzaProfilo(req, res, "Trakt.tv account linked correctly");
                    }).catch(err => renderizzaProfilo(req, res, "Something gone wrong"))
            }).catch(err => renderizzaProfilo(req, res, "Something gone wrong"))
    })*/
})

app.post('/addToTrakt', (req, res) => {
    sendLog("POST /addToTrakt");
    sendLog("Adding to Trakt.tv whatchlist");
    if (req.cookies['AuthToken'] === undefined) {
        sendLog("User need to login");
        res.json({
            success: false
        })
    } else if (req.cookies['TraktToken']) {
        fetch('https://api.trakt.tv/sync/watchlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.cookies['TraktToken'],
                'trakt-api-version': '2',
                'trakt-api-key': process.env.API_KEY
            },
            body: JSON.stringify({
                movies: [{
                    ids: {
                        imdb: req.query.imdbId
                    }
                }]
            })
        }).then(json => {
            sendLog("Movie added to trakt");
            res.json({
                success: true
            })
        }).catch(err => {
            sendLog(err.message);
            res.status(500).json({
                error: err
            })
        })
        /*
        requ({
            method: 'POST',
            url: 'https://api.trakt.tv/sync/watchlist',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.cookies['TraktToken'],
                'trakt-api-version': '2',
                'trakt-api-key': process.env.API_KEY
            },
            body: JSON.stringify({
                movies: [{
                    ids: {
                        imdb: req.query.imdbId
                    }
                }]
            })
        }, function (error, response, body) {
            res.json({
                success: true
            })
            sendLog("Movie added to trakt");
        })*/
    } else {
        sendLog("User needs to link Trakt.tv");
        res.json({
            success: false
        })
    }
});

const {
    google
} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];


const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const client_id = process.env.GOOGLE_CLIENT_ID;
const redirect_uris = ['http://localhost/googleCallback'];

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

app.get("/OAuthGoogle", (req, res) => {
    sendLog("POST /OAuthGoogle");
    if (req.cookies['GoogleToken']) renderizzaProfilo(req, res, 'Already linked to Google')
    else {
        db.query('SELECT google_token FROM google_tokens JOIN tokens ON google_tokens.email = tokens.email WHERE tokens.token = $1', [req.cookies['AuthToken']])
            .then(result => {
                if (result.length === 0) {
                    const authUrl = oAuth2Client.generateAuthUrl({
                        access_type: 'offline',
                        scope: SCOPES,
                    });
                    res.redirect(authUrl);
                } else {
                    res.cookie('GoogleToken', result[0].google_token);
                    oAuth2Client.setCredentials({
                        refresh_token: JSON.parse(result[0].google_token).refresh_token
                    });
                    renderizzaProfilo(req, res, 'Already linked to Google')
                }
            }).catch(err => {
                sendLog('ERROR!!!!!')
                sendLog(err)
                renderizzaProfilo(req, res, "Something gone wrong")
            })
    }
})

app.get("/googleCallback", (req, res) => {
    sendLog('google callback');
    var code = req.query.code
    oAuth2Client.getToken(code, (err, GoogleToken) => {
        if (err) return console.error('Error retrieving access token', err);
        db.query('SELECT email FROM tokens WHERE token = $1', [req.cookies['AuthToken']])
            .then(result => {
                db.query('INSERT INTO google_tokens VALUES ($1, $2)', [result[0].email, GoogleToken])
                    .then(result1 => {
                        res.cookie('GoogleToken', GoogleToken);
                        oAuth2Client.setCredentials({
                            refresh_token: GoogleToken.refresh_token
                        });
                        renderizzaProfilo(req, res, "Google account linked correctly");
                    }).catch(err => renderizzaProfilo(req, res, "Something gone wrong"))
            }).catch(err => renderizzaProfilo(req, res, "Something gone wrong"))
    })
})

app.post('/createEvent', (req, res) => {
    if (req.cookies['AuthToken'] === undefined) {
        sendLog('User need to login');
        renderizzaProfilo(req, res, 'You need to login first')
    } else if (req.cookies['GoogleToken']) {
        oAuth2Client.setCredentials({
            refresh_token: JSON.parse(decodeURI(req.cookies['GoogleToken'])).refresh_token
        })
        var startd = new Date();
        startd.setHours(19, 0, 0, 0);
        var endd = new Date();
        endd.setHours(21, 0, 0, 0);
        var event = {
            'summary': req.query.title + ' Watch Party',
            'location': 'Home',
            'description': 'Have fun watching ' + req.query.title,
            'start': {
                'dateTime': startd,
                'timeZone': 'Europe/Rome',
            },
            'end': {
                'dateTime': endd,
                'timeZone': 'Europe/Rome',
            },
            'reminders': {
                'useDefault': false,
                'overrides': [{
                        'method': 'email',
                        'minutes': 24 * 60
                    },
                    {
                        'method': 'popup',
                        'minutes': 10
                    }
                ]
            }
        };
        const calendar = google.calendar({
            version: 'v3',
            auth: oAuth2Client
        });
        calendar.events.insert({
            auth: oAuth2Client,
            calendarId: 'primary',
            resource: event,
        }, function (err, event) {
            if (err) {
                sendLog('There was an error contacting the Calendar service: ' + err);
                renderizzaProfilo(req, res, 'There was an error contacting the Calendar service');
                return;
            }
            sendLog('Event created');
            renderizzaProfilo(req, res, 'Your watch party has been created!');
        })
    } else {
        sendLog('User needs to link Google Account');
        renderizzaProfilo(req, res, 'You need to link your Google account first!');
    }
})

app.listen(3001, () => {
    sendLog('Listening on port: ' + 3001);
});