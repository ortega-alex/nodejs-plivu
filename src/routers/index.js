const express = require('express');
const router = express.Router();
const { Numero, Chat, Nota } = require("../controllers/");

module.exports = app => {

    router.post('/token', Numero.setToken);
    router.get('/plivonumeros', Numero.getPlivo_numeros);
    router.get('/numeros/:search', Numero.getNumero);
    router.post('/numeros', Numero.getNumeros);
    router.put('/numeros', Numero.editLeido);
    router.put('/favorito', Numero.editFavorito);
    router.put('/nodeseado', Numero.editDNC);
    router.put('/nombre', Numero.editName);

    router.get('/chat/:numero', Chat.chatxnumero);
    router.put('/chat', Chat.editChat);

    router.get('/nota', Nota.getNotas);
    router.get('/nota/:numero', Nota.getNota);
    router.post('/nota', Nota.setNota);
    router.put('/nota', Nota.editNota);
    router.delete('/nota/:id', Nota.deleteNota);

    app.use('/api', router);
};