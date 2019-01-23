const push = require('./push');

module.exports = function (io, app) {

  io.on('connection', (socket) => {
    socket.on('set-numero', (numero) => {
      socket.numero = numero;
      console.log("new", numero)
      io.emit('numero-changed', { event: numero });
    });
  });

  app.get("/api/new/:numero/:text", async (req, res) => {
    const { numero , text  } = req.params;

    push.notification( numero , text );

    io.emit('numero-changed', { event: numero });
    res.status(200).json({ message: "ok", numero: numero })
  });
}