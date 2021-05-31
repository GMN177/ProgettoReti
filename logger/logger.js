#!/usr/bin/env node

const amqp = require('amqplib')

amqp.connect('amqp://rabbitmq')
    .then(connection => {
        connection.createChannel()
            .then(channel => {
                var exchange = 'logs'
                channel.assertExchange(exchange, 'fanout', {
                    durable: false
                }).then(
                    channel.assertQueue('', {
                        exclusive: true
                    }).then(q => {
                        var today = new Date()
                        var h = today.getHours()
                        var m = today.getMinutes()
                        var s = today.getSeconds()
                        console.log('[' + h + ":" + m + ":" + s + ']' + " Starting logger session", q.queue)
                        channel.bindQueue(q.queue, exchange, '')
                        channel.consume(q.queue, function (msg) {
                            if (msg.content) {
                                console.log("%s", msg.content.toString())
                            }
                        }, {
                            noAck: true
                        })
                    })
                )
            })
    })
/*
amqp.connect('amqp://rabbitmq', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'logs';
        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });
        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            console.log('[' + h + ":" + m + ":" + s + ']' + " Starting logger session", q.queue)
            channel.bindQueue(q.queue, exchange, '')
            channel.consume(q.queue, function (msg) {
                if (msg.content) {
                    console.log("%s", msg.content.toString())
                }
            }, {
                noAck: true
            })
        })
    })
})*/