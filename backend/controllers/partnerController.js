import db from "../config/db.js"; // <--- Sabse pehle ye check karein

export const getMyAssignedPujas = async (req, res) => {
  try {
    const panditId = req.user.id;

    const query = `
      SELECT 
        b.id,
        b.address,
        b.city,
        b.state,
        b.preferred_date,
        b.preferred_time,

        s.puja_name,

        u.name AS customer_name,
        u.phone AS customer_phone

      FROM puja_requests b

      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.user_id = u.id

      WHERE b.pandit_id = ?
      ORDER BY b.preferred_date ASC
    `;

    const [rows] = await db.query(query, [panditId]);

    res.status(200).json({
      success: true,
      count: rows.length,
      bookings: rows
    });

  } catch (error) {
    console.error("Pandit Fetch Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


export const getPanditProfile = async (req, res) => {
  try {
    const panditId = req.user.id;

    const [rows] = await db.query(
      "SELECT id, name, phone, email, gotra FROM users WHERE id = ?",
      [panditId]
    );

    res.json({
      success: true,
      user: rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
