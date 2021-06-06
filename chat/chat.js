const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const amqp = require('amqplib/callback_api')
const {
    addUser,
    removeUser,
    getUser,
    getUserInRoom,
    generatemsg
} = require('./utils')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    path: '/chatapp'
});

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
            channel.publish(exchange, '', Buffer.from('[chat app] [' + h + ":" + m + ":" + s + '] ' + message));
        })
        setTimeout(function () {
            connection.close();
        }, 500)
    })
}

io.on("connection", (socket) => {
    sendLog("new connection:")
    socket.on("join", ({
        username,
        room
    }, cb) => {
        const {
            error,
            user
        } = addUser({
            id: socket.id,
            username,
            room
        })
        if (error) {
            sendLog(error)
            return cb(error)
        }
        sendLog(user.username + ' connected to the room ' + user.room  + ' successfully!')
        socket.join(user.room)
        socket.emit("message", generatemsg("Welcome"))
        socket.broadcast.to(user.room).emit("message", generatemsg(`${user.username} has joined! :-)`))
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        cb()
    })

    socket.on("sendMessage", (msg, cb) => {
        const user = getUser(socket.id)
        const m = generatemsg(user.username, msg)
        sendLog(user.username + ' sent "' + msg + '" to room ' + user.room)
        io.to(user.room).emit("message", m)
        cb()
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {
            sendLog(user.username + 'has left room: ' + user.room)
            io.to(user.room).emit("message", generatemsg(`${user.username} has left! :-(`))
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })
})

server.listen(5000, () => {
    sendLog("Listening on port: " + 5000)
})