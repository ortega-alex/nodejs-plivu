const ctrl = {}
const pool = require("../config/db");
//const plivo = require("../config/plivo");

ctrl.getPlivo_numeros = async (req, res) => {
    const numeros = await pool.query(`SELECT a.nombre , a.numero , a.predeterminado 
                                      FROM plivo_numero as a`);
    res.status(200).json(numeros);
}

ctrl.getNumeros = async (req, res) => {
    const { inicio, fin, favorito, otro } = req.body;
    var favoritos = [];
    var otros = [];
    const query = `SELECT twilio_numero.id_numero, 
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
                    WHERE  twilio_numero.no_deseado = 'N' AND twilio_numero.favorito = ?
                    ORDER BY twilio_numero.ultimo_leido ASC,  twilio_numero.ultimo_tipo DESC , twilio_numero.ultimo_add_fecha DESC
                    LIMIT ${inicio} , ${fin}`;
    if (favorito) {
        favoritos = await pool.query(query, ['Y']);
    }
    if (otro) {
        otros = await pool.query(query, ['N']);
    }
    res.status(200).json({ favoritos, otros });
};

ctrl.getNumero = async (req, res) => {
    const { search } = req.params;
    if (!search) return res.status(403).json({ err: "information is missing" });
    const query = `SELECT a.id_numero, 
                        a.numero, 
                        a.nombre, 
                        a.favorito, 
                        a.no_deseado, 
                        a.numero_salida, 
                        a.ultimo_leido, 
                        a.ultimo_tipo, 
                        DATE_FORMAT(DATE_SUB(a.ultimo_add_fecha, INTERVAL 6 HOUR), '%Y-%m%-%d %l:%i:%s') ultimo_add_fecha, 
                        DATE_FORMAT(a.add_fecha, '%Y-%m%-%d %l:%i:%s') add_fecha
                    FROM   twilio_numero as a , twilio as b 
                    WHERE  a.no_deseado = 'N'
                    AND    a.numero = b.numero
                    AND    ( b.numero LIKE '%${search}%' OR a.nombre LIKE '%${search}%' OR b.texto LIKE '%${search}%' )
                    GROUP BY id_numero`;

    const numeros = await pool.query(query);
    res.status(200).json(numeros);
}

ctrl.editLeido = async (req, res) => {
    const { numero } = req.body;
    if (!numero) return res.status(404).json({ err: "information is missing" });
    await pool.query(`UPDATE twilio_numero
                      SET    ultimo_leido = 'Y'    
                      WHERE  numero = ?` , [numero]);
    res.status(200).json({ message: "updating successfully" });
};

ctrl.setToken = async (req, res) => {
    const { token } = req.body;
    console.log(token)
    res.status(200).json({ message: "ok" })
};

ctrl.editFavorito = async (req, res) => {
    const { numero } = req.body;
    if (!numero) return res.status(404).json({ err: "information is missing" });
    const query = `UPDATE twilio_numero 
                   SET favorito = 'Y'
                   WHERE  numero = ?`;
    await pool.query(query, [numero]);
    res.status(200).json({ message: "updating successfully" });
};

ctrl.editDNC = async (req, res) => {
    const { numero } = req.body;
    if (!numero) return res.status(404).json({ err: "information is missing" });
    const query = `UPDATE twilio_numero 
                   SET no_deseado = 'Y'
                   WHERE  numero = ?`;
    await pool.query(query, [numero]);
    res.status(200).json({ message: "updating successfully" });
};

ctrl.editName = async (req, res) => {
    const { nombre, numero } = req.body;
    if (!nombre) return res.status(404).json({ err: "information is missing" });
    await pool.query(`UPDATE twilio_numero
                      SET nombre = ?
                      WHERE numero = ?` , [nombre, numero]);
    res.status(200).json({ message: "updating successfully" });
};

module.exports = ctrl;