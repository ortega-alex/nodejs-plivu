const express = require('express');
const config = require('./config/server');

const app = config(express());
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./config/socket')(io ,app);

http.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});