const express = require('express');
const router = express.Router();
const twilio = require("../controllers/twilio");

module.exports = app => {

    router.get('/api/historico/:de/:hasta', twilio.historico);
    router.get('/api/noleidos', twilio.noLeidos);
    router.get('/api/chat/:numero', twilio.chatxnumero);
    router.put('/api/leido', twilio.editLeido);
    router.post('/api/chat', twilio.editChat);
    router.post('/api/token' , twilio.setToken);

    app.use(router);
};