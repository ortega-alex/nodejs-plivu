const mysql = require('promise-mysql');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {

    if (err) {
        console.log("err", err.toString());
    }

    if (connection) connection.release();
    console.log('DB is Connected');
    return
});

module.exports = pool;