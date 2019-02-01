const ctrl = {};
const pool = require("../config/db");
const plivo = require("../config/plivo");

ctrl.chatxnumero = async (req, res) => {
    const { numero } = req.params;
    if (!numero) return res.status(404).json({ err: "information is missing" });
    const strQuery = `SELECT id_twilio, texto, tipo, numero , DATE_FORMAT(DATE_SUB(add_fecha, INTERVAL 6 HOUR), '%l:%i %p %Y-%m%-%d') add_fecha, leido
                        FROM   twilio   
                        WHERE  numero = ?
                        ORDER  BY  id_twilio ASC`;
    await pool.query(strQuery, [numero], (err, chats) => {
        if (err) return res.status(500).json({ message: err });
        res.status(200).json(chats);
    });
};

ctrl.editChat = async (req, res) => {
    const { numero_salida, numero, texto } = req.body;
    if (!numero_salida || !numero || !texto) return res.status(404).json({ message: "information is missing" });
    const respuesta = { message: null, err: false };
    var strQuery = null;
    await plivo.send(numero_salida, numero, texto);
    strQuery = `UPDATE twilio_numero
                        SET    ultimo_tipo = 'E'    
                        WHERE  numero = ?`;
    await pool.query(strQuery, [numero]).catch((err) => {
        respuesta.message = err;
        respuesta.err = true;
    });
    if (respuesta.err) return res.status(500).json({ message: respuesta.message });

    strQuery = `INSERT INTO twilio(numero, texto, tipo)
                VALUES( ? , ? , 'E')`;
    await pool.query(strQuery, [numero, texto]).catch((err) => {
        respuesta.message = err;
        respuesta.err = true;
    });
    if (respuesta.err) return res.status(500).json({ message: respuesta.message });
    res.status(200).json({ message: "updating successfully" });
};

module.exports = ctrl;