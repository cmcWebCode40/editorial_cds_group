const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require("cookie-parser");
const session = require('cookie-session');
const mustacheExpress = require('mustache-express');
const config = require('../config');

const createTables = require('./createtables');
const flashMessage = require('./flashres');
const { permission} = require("./auth")

module.exports = function (app) {

    if (!config.jwtPass) {
        console.error(`FATAL ERROR: jwtPass is not set.`);
        process.exit(1);
    }


    // create tables
    createTables();

    app.use(cookieParser())

    // flash messages
    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    }));
    app.use(flash());
    app.use(flashMessage);

    // body parser    
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // template engine
    app.engine('html', mustacheExpress());
    app.set('view engine', 'html');

    // static files
    app.use(express.static('./public'));

    // user permission
    app.use(permission);
}
