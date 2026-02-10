import db from "../config/db.js";

export const userBookingDetailController = async (req, res) => {
  try {
    const userId = req.user.id; // token middleware se

    const [rows] = await db.execute(
      `SELECT 
        u.name,
        u.gotra,
        ua.address_line,
        ua.city,
        ua.state,
        ua.pincode
      FROM users u
      LEFT JOIN user_addresses ua 
        ON ua.user_id = u.id AND ua.is_default = 1
      WHERE u.id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const bookings = async (req, res) => {

  try {
    const userId = req.user.id;

    const {
      puja_name,
      puja_date,
      puja_time,
      price
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO booking_details 
       (user_id, puja_name, puja_date, puja_time, price, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, puja_name, puja_date, puja_time, price]
    );

    res.status(201).json({
      success: true,
      bookingId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
};

export const getAllBookingDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Booking details (single / multiple bookings)
    const [bookings] = await db.execute(
      `
      SELECT 
        b.id,
        b.puja_name,
        b.price,
        b.puja_time,
        b.puja_date
      FROM booking_details b
      WHERE b.user_id = ?
      `,
      [userId]
    );

    if (!bookings.length) {
      return res.status(404).json({ message: "No booking found" });
    }

    // 2️⃣ User info
    const [[user]] = await db.execute(
      `SELECT id, name FROM users WHERE id = ?`,
      [userId]
    );

    // 3️⃣ All addresses
    const [addresses] = await db.execute(
      `
      SELECT address_line, city, state, pincode
      FROM user_addresses
      WHERE user_id = ?
      `,
      [userId]
    );

    res.status(200).json({
      user,
      bookings,
      addresses
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
