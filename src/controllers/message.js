const ctrl = {}
const pool = require("../config/db");
const plivo = require("../config/plivo");

ctrl.get = async (req, res) => {
    const games = await pool.query("SELECT * FROM games");
    res.json({ games })
};

ctrl.set = async (req, res) => {
    const { numero, destino, msj } = req.body;
    const message = await plivo.send(numero, destino, msj);
    res.status(200).json(message)
}

module.exports = ctrl;