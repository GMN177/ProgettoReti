var ex = require("express");
//const { request } = require("node:http");
var requ = require("request");
var pgp = require("pg-promise")();
const dotenv = require('dotenv');

dotenv.config();

const cn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME, 
    user: process.env.DB_USER, 
    password: process.env.DB_PW
};

const db = pgp(cn);
var app = ex();
//app.use(ex.static("public"));

app.use(ex.urlencoded({
    extended: false
}));

app.use(ex.json());

app.get("/movie/genres", function (req, res) {
    var str = '';
    var gen = JSON.parse(req.query.genres);
    console.log(gen);
    for (var i = 0; i < gen.length; i++) {
        if (gen.length - 1 !== i) {
            str += "gen = '" + gen[i] + "' OR ";
        } else {
            str += "gen = '" + gen[i] + "'";
        }
    }
    console.log(str);
    db.query("SELECT id FROM movies WHERE " + str)
        .then(result => {
            //res.status(200).json(result)
            var rindex = Math.floor(Math.random() * (result.length - 1));
            var id = result[rindex].id;
            console.log(id);
            requ({
                method: 'GET',
                url: 'https://api.trakt.tv/search/imdb/' + id + '?extended=full',
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-version': '2',
                    'trakt-api-key': process.env.API_KEY
                }
            }, function (error, response, body) {
                if (response.statusCode === 200) {
                    console.log('Status:', response.statusCode);
                    //console.log('Headers:', JSON.stringify(response.headers));
                    console.log('Response:');
                    console.log(JSON.stringify(body, null, "\t"));
                    //console.log(body);
                }
                else{
                    console.log('404');
                }
            });
        })
        .catch(err => res.status(500).send(err.message))
    //query su db
    //get movie from API 
    //req.get("https://")
    //res.status(200).json(result)
    /*
    'https://api.trakt.tv/search/imdb/' + id + '?extended=full'
    https://api.trakt.tv/search/imdb/tt1104001
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': '[client_id]'*/
});

app.get("/movie/mood", function (req, res) {
    var mood = req.query.mood;
    console.log('getting mood: ' + mood);
    db.query("SELECT id FROM movies WHERE mood = $1", [mood])
        .then(result => {
            //res.status(200).json(result)
            var rindex = Math.floor(Math.random() * (result.length - 1));
            var id = result[rindex].id;
            console.log(id);
            requ({
                method: 'GET',
                url: 'https://api.trakt.tv/search/imdb/' + id + '?extended=full',
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-version': '2',
                    'trakt-api-key': process.env.API_KEY
                }
            }, function (error, response, body) {
                if (response.statusCode === 200) {
                    console.log('Status:', response.statusCode);
                    //console.log('Headers:', JSON.stringify(response.headers));
                    console.log('Response:');
                    console.log(JSON.stringify(body, null, "\t"));
                    res.send(body);
                    //console.log(body);
                }
                else{
                    console.log('404');
                }
            });
        })
        .catch(err => res.status(500).send(err.message))
});

app.listen(3001);