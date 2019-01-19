const ctrl = {};
const pool = require("../config/db");

ctrl.chatxnumero = async (req, res) => {
    const { numero } = req.params;
    const chats = await pool.query(`SELECT id_twilio, texto, tipo, numero , DATE_FORMAT(DATE_SUB(add_fecha, INTERVAL 6 HOUR), '%l:%i %p %Y-%m%-%d') add_fecha, leido
                                    FROM   twilio   
                                    WHERE  numero = ?
                                    ORDER  BY  id_twilio ASC ` , [numero]);
    res.status(200).json(chats);
};

ctrl.editChat = async (req, res) => {
    const { numero_salida, numero, texto } = req.body;
    //const mjs = await plivo.send(numero_salida, "+50251002326" , texto);
    await pool.query(`UPDATE twilio_numero
                      SET    ultimo_tipo = 'E'    
                      WHERE  numero = ?` , [numero]);
    await pool.query(`INSERT INTO twilio(numero, texto, tipo)
                      VALUES( ? , ? , 'E')` , [numero, texto]);
    res.status(200).json({ message: "updating" });
};

module.exports = ctrl;