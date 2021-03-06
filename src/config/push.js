const FCM = require('fcm-node');
const { push_notification } = require('./keys');
const fcm = new FCM(push_notification.services);
const push = {};

push.notification = (numero , text) => {

    var message = {
        to: push_notification.token,
        //collapse_key: 'your_collapse_key',

        notification: {
            title: numero,
            body: text
        },

        data: {
            message: text,
            title: numero
        }
    };

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

module.exports = push; 