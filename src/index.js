const express = require('express');
const config = require('./config/server');

const pool = require('./config/db');
const app = config(express());
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./config/socket')(io);

app.get("/api/new" , async (req , res) => {
    const games = await pool.query(`SELECT * FROM games`);
    io.emit('users-changed', { user: "alex web", event: games });   
    res.status("200").json("ok")
})

http.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});