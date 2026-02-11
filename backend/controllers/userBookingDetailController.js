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
    console.log(userId);

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
    console.log(bookings);
    

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

export const getPartnerBookingDetails = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware

    const [bookings] = await db.execute(
      `
      SELECT
        b.id,
        b.puja_name,
        b.puja_date,
        b.puja_time,
        b.price,
        b.status,

        u.name AS user_name,
        u.phone AS user_phone,

        CONCAT(
          ua.address_line, ', ',
          ua.city, ', ',
          ua.state, ' - ',
          ua.pincode
        ) AS address

      FROM booking_details b
      INNER JOIN users u 
        ON u.id = b.user_id

      LEFT JOIN user_addresses ua 
        ON ua.user_id = u.id 
       AND ua.is_default = 1

      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings, // 👈 ALWAYS ARRAY
    });

  } catch (error) {
    console.error("getPartnerBookingDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
    });
  }
};

export const updateBookingStatusController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // validation
    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "BookingId and status are required",
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // update status
    const [result] = await db.execute(
      `
      UPDATE booking_details
      SET status = ?
      WHERE id = ?
      `,
      [status, bookingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
    });

  } catch (error) {
    console.error("updateBookingStatusController error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

