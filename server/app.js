'use strict';

module.exports = (rootDir) => {
    const cookieParser = require('cookie-parser')
    const express = require('express')
    const app = express()
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    const routes = require('./routes')
    const multer = require('multer')
    var upload = multer()

    mongoose.connect(process.env.MONGO_URL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })

    mongoose.connection.on('connected', function () {
        console.log('Mongoose successfully connected.')
    })

    mongoose.connection.on('error', function (err) {
        console.log('Mongoose connection error: ' + err)
    })

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose was disconnected')
    })

    mongoose.set('useFindAndModify', false);

    // App Use
    // io.on('connection', function (socket) {
    //     console.log('connected');
    // });
    app.use(cookieParser(process.env.COOKIE_SECRET))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(upload.any())
    app.use('/api', routes)

    app.use((err, req, res, next) => {
        if (err) {
            return res.status(403).send({ success: false, error: err.message })
        }
        next()
    })
    
    return app;
}