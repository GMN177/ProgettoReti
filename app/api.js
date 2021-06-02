require('dotenv').config()

const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch');
const amqp = require('amqplib/callback_api');
const db = require('./db.js');

const router = express.Router()

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

/**
 * @api {get} /api/movie/:id
 * @apiName GetMovie
 * @apiGroup Movie
 *
 * @apiParam {String} id A Movie's id.
 *
 * @apiSuccess {String} title     Title of the Movie
 * @apiSuccess {String} overview  Overview of the Movie.
 * @apiSuccess {String} released  Released date of the Movie
 * @apiSuccess {String} runtime   Runtime of the Movie
 * @apiSuccess {String} trailer   Trailer of the Movie
 * 
 */
router.get('/api/movie/:id', function (req, res) {
    var id = req.params.id;
    sendLog("GET /api/movie with id=" + id);
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
                title: json[0].movie.title,
                overview: json[0].movie.overview,
                released: json[0].movie.released,
                runtime: json[0].movie.runtime,
                trailer: json[0].movie.trailer,
            })
        }).catch(err => {
            sendLog(err.message);
            res.status(500).json({
                error: err
            })
        })
})

/**
 * @api {get} /api/movie/mood/:mood
 * @apiName GetMovieFromMood
 * @apiGroup Movie
 *
 * @apiParam {String} mood A Movie's mood.
 *
 * @apiSuccess {String} id ID of the Movie
 * @apiSuccess {String} name  Name of the Movie.
 */
router.get("/api/movie/mood/:mood", function (req, res) {
    var mood = req.params.mood;
    sendLog('GET /api/movie/mood with mood=' + mood);
    db.query("SELECT id, name FROM movies WHERE mood = $1", [mood])
        .then(result => {
            var rindex = crypto.randomInt(result.length);
            var id = result[rindex].id;
            var name = result[rindex].name;
            res.json({
                id: id,
                name: name
            })
        }).catch(err => res.status(500).json({
            error: err.message
        }))
})

/**
 * @api {get} /api/movie/genre/:genre
 * @apiName GetMovieFromGenre
 * @apiGroup Movie
 *
 * @apiParam {String} genre A Movie's genre.
 *
 * @apiSuccess {String} id ID of the Movie
 * @apiSuccess {String} name  Name of the Movie.
 */
router.get("/api/movie/genre/:genre", function (req, res) {
    var genre = req.params.genre;
    sendLog('GET /api/movie/genre with gen=' + genre);
    db.query("SELECT id, name FROM movies WHERE gen = $1", [genre])
        .then(result => {
            var rindex = crypto.randomInt(result.length);
            var id = result[rindex].id;
            var name = result[rindex].name;
            res.json({
                id: id,
                name: name
            })
        }).catch(err => res.status(500).json({
            error: err.message
        }))
})

/**
 * @api {get} /api/genrelist
 * @apiName GetGenreList
 * @apiGroup Movie
 *
 * @apiSuccess {String[]} genrelist Genre list
 */
router.get("/api/genrelist", function (req, res) {
    res.json({
        genrelist: ["action", "adventure", "comedy", "crime", "documentary", "drama", "fantasy", "horror", "historical", "musical", "romance", "sci_fi", "war", "western"]
    })
})

/**
 * @api {get} /api/moodlist
 * @apiName GetMoodList
 * @apiGroup Movie
 *
 * @apiSuccess {String[]} moodlist Mood list
 */
router.get("/api/moodlist", function (req, res) {
    res.json({
        moodlist: ["happy", "sad", "lonely", "romantic", "fearless", "demotivated", "curious"]
    })
})

module.exports = router