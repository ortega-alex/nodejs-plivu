const path = require('path');
const morgan = require('morgan');
const express = require('express');
const routes = require('../routers');
const cors = require("cors");
const { server_port } = require('./keys');

module.exports = app => {
    //setings 
    app.set('port', process.env.PORT || server_port.port);

    //midlewares
    app.use(morgan('dev'));
    app.use(cors())
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    //routes
    routes(app);

    //static file
    app.use('/public', express.static(path.join(__dirname, '../public')));

    return app;
}