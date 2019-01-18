const push = require('./push');
const pool = require('./db');

module.exports = function (io, app) {
  
  io.on('connection', (socket) => {
    socket.on('set-numero', (numero) => {
      socket.numero = numero;
      console.log("new", numero)
      io.emit('numero-changed', { event: numero });
    });
  });

  app.get("/api/new/:numero", async (req, res) => {
    const { numero } = req.params;

    push.notification();

    io.emit('numero-changed', { event: numero });
    res.status(200).json({ message: "ok", numero: numero })
  });
}