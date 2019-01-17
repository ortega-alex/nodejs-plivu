const ctrl = {}
const pool = require("../config/db");
const plivo = require("../config/plivo");

ctrl.historico = async (req, res) => {
    const { de, hasta } = req.params;
    const historico = await pool.query(`SELECT twilio_numero.id_numero, 
                                            twilio_numero.numero, 
                                            twilio_numero.nombre, 
                                            twilio_numero.favorito, 
                                            twilio_numero.no_deseado, 
                                            twilio_numero.numero_salida, 
                                            twilio_numero.ultimo_leido, 
                                            twilio_numero.ultimo_tipo, 
                                            DATE_FORMAT(DATE_SUB(twilio_numero.ultimo_add_fecha, INTERVAL 6 HOUR), '%Y-%m%-%d %l:%i:%s') ultimo_add_fecha, 
                                            DATE_FORMAT(twilio_numero.add_fecha, '%Y-%m%-%d %l:%i:%s') add_fecha
                                        FROM   twilio_numero
                                        WHERE  twilio_numero.no_deseado = 'N'
                                        ORDER BY id_numero DESC, twilio_numero.ultimo_leido ASC, twilio_numero.ultimo_add_fecha DESC
                                        LIMIT ${de} , ${hasta}`);
    res.status(200).json(historico);
};

ctrl.noLeidos = async (req, res) => {
    const noleidos = await pool.query(`SELECT twilio_numero.id_numero, 
                                            twilio_numero.numero, 
                                            twilio_numero.nombre, 
                                            twilio_numero.favorito, 
                                            twilio_numero.no_deseado, 
                                            twilio_numero.numero_salida, 
                                            twilio_numero.ultimo_leido, 
                                            twilio_numero.ultimo_tipo, 
                                            DATE_FORMAT(DATE_SUB(twilio_numero.ultimo_add_fecha, INTERVAL 6 HOUR), '%Y-%m%-%d %l:%i:%s') ultimo_add_fecha, 
                                            DATE_FORMAT(twilio_numero.add_fecha, '%Y-%m%-%d %l:%i:%s') add_fecha
                                        FROM   twilio_numero
                                        WHERE  twilio_numero.no_deseado = 'N'
                                        AND    twilio_numero.ultimo_leido = 'N'
                                        AND    twilio_numero.ultimo_tipo = 'R'
                                        ORDER BY id_numero ASC, twilio_numero.ultimo_leido ASC, twilio_numero.ultimo_add_fecha ASC`);
    res.status(200).json(noleidos);
};

ctrl.chatxnumero = async (req, res) => {
    const { numero } = req.params;
    const chats = await pool.query(`SELECT id_twilio, texto, tipo, numero , DATE_FORMAT(DATE_SUB(add_fecha, INTERVAL 6 HOUR), '%l:%i %p %Y-%m%-%d') add_fecha, leido
                                    FROM   twilio   
                                    WHERE  numero = ?
                                    ORDER  BY  id_twilio ASC ` , [numero]);
    res.status(200).json(chats);
};

ctrl.editLeido = async (req, res) => {
    const { numero } = req.body;
    await pool.query(`UPDATE twilio_numero
                      SET    ultimo_leido = 'Y'    
                      WHERE  numero = ?` , [numero]);
    res.status(200).json({ message: "updating" });
};

ctrl.editChat = async (req, res) => {
    console.log(req.body);
    const { numero_salida, numero, texto } = req.body;
    //const mjs = await plivo.send(numero_salida, "+50251002326" , texto);
    await pool.query(`UPDATE twilio_numero
                      SET    ultimo_tipo = 'E'    
                      WHERE  numero = ?` , [numero]);
    await pool.query(`INSERT INTO twilio(numero, texto, tipo)
                      VALUES( ? , ? , 'E')` , [numero, texto]);
    res.status(200).json({ message: "updating" });
};

ctrl.setToken = async (req, res) => {
    const { token } = req.body;
    console.log(token)
    res.status(200).json({ message: "ok" })
};

module.exports = ctrl;