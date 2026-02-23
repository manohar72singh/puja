import db from '../config/db.js'; // .js extension zaroori hai agar type: module hai

// 1. Saare mandir ki basic list
export const getMandirList = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, location, about, image_url_1 FROM mandir');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Data fetch karne mein error", error: err.message });
    }
};

// 2. Specific mandir ki details ID ke zariye
export const getMandirDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM mandir WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Mandir nahi mila" });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Details fetch karne mein error", error: err.message });
    }
};