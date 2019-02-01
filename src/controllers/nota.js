const ctrl = {};
const pool = require('../config/db');

ctrl.getNotas = async (req, res) => {
    const strQuery = `SELECT a.id_panel,
                            b.numero,
                            DATE_FORMAT(a.fecha_recordatorio, '%Y-%m-%d') fecha_recordatorio,
                            DATE_FORMAT(a.fecha_recordatorio, '%H:%i') hora_recordatorio,
                            a.texto ,
                            b.nombre
                        FROM   panel_nota AS a
                        LEFT JOIN twilio_numero AS b ON a.numero = b.numero    
                        ORDER BY id_panel DESC`;
    await pool.query(strQuery, (err, notas) => {
        if (err) return res.status(500).json({ message: err });
        res.status(200).json(notas);
    });
};

ctrl.getNota = async (req, res) => {
    const { numero } = req.params;
    if (!numero) return res.status(404).json({ err: "information is missing" });
    const strQuery = `SELECT id_panel,
                            DATE_FORMAT(panel_nota.fecha_recordatorio, '%Y-%m-%d') fecha_recordatorio,
                            DATE_FORMAT(panel_nota.fecha_recordatorio, '%H:%i') hora_recordatorio,
                            texto
                        FROM   panel_nota  
                        WHERE numero = ? 
                        ORDER BY id_panel DESC`;
    await pool.query(strQuery, [numero], (err , notas) => {
        if (err) return res.status(500).json({ message: err });
        res.status(200).json(notas);
    });
};

ctrl.setNota = async (req, res) => {
    const { texto, fecha, numero } = req.body;
    if (!texto || !numero || !fecha) return res.status(404).json({ messge: "information is missing" });
    const strQuery = `INSERT INTO panel_nota 
                        (numero, fecha_recordatorio, texto)
                      VALUES(? ,? ,?)`;
    await pool.query(strQuery, [numero, fecha, texto], (err) => {
        if (err) return res.status(500).json({ message: err });
        res.status(200).json({ message: "note registered successfully" });
    });
};

ctrl.editNota = async (req, res) => {
    const { nombre, texto, id_panel, numero } = req.body;
    if (!texto || !id_panel) return res.status(404).json({ messge: "information is missing" });
    const respuesta  = { message : null , err : false};
    var strQuery = null;
    if (nombre && numero) {
        strQuery = `UPDATE twilio_numero
                    SET nombre = ?
                    WHERE numero = ?`;
        await pool.query(strQuery, [nombre, numero]).catch((err) => {
            respuesta.err = true;
            respuesta.message = err;
        });
    }
    strQuery = `UPDATE panel_nota
                SET texto = ? 
                WHERE id_panel = ?`;
    await pool.query(strQuery, [texto, id_panel]).catch((err) => {
        respuesta.err = true;
        respuesta.message = err;
    });
    if (respuesta.err) return res.status(500).json({message : respuesta.message});
    res.status(200).json({ message: "note updated successfully" });
};

ctrl.deleteNota = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).json({ messge: "information is missing" });
    const strQuery = `DELETE FROM panel_nota
                        WHERE id_panel = ?`;
    await pool.query(strQuery, [id], (err) => {
        if (err) return res.status(500).json({ message: err });
        res.status(200).json({ message: "note removed" });
    });
};

module.exports = ctrl;