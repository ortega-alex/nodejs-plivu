let { client_plivo } = require("./keys");
let plivo = require('plivo');
let client = new plivo.Client(client_plivo.id, client_plivo.token);
let message = {};

message.send = async (number, destinatario, msj) => {
    await client.messages.create(
        number,
        destinatario,
        msj
    ).then(function(message_created) {
        console.log(message_created)
    });
};

module.exports = message;