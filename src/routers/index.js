const express = require('express');
const router = express.Router();
const message = require("../controllers/message");

module.exports = app => {

    router.get('/api/message', message.get);

    app.use(router);
};