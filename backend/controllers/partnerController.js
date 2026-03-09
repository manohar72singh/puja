import db from "../config/db.js"; // <--- Sabse pehle ye check karein

// export const getMyAssignedPujas = async (req, res) => {
//   try {
//     const panditId = req.user.id;

//     const query = `
//       SELECT
//         b.*,
//         s.puja_name,
//         u.name AS customer_name,
//         u.phone AS customer_phone,
//         b.total_price AS price
//       FROM puja_requests b
//       LEFT JOIN services s ON b.service_id = s.id
//       LEFT JOIN users u ON b.user_id = u.id
//       WHERE b.pandit_id = ?
//       ORDER BY b.preferred_date ASC
//     `;

//     const [rows] = await db.query(query, [panditId]);

//     res.status(200).json({
//       success: true,
//       count: rows.length,
//       bookings: rows,
//     });
//   } catch (error) {
//     console.error("Pandit Fetch Error:", error.message);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };
export const getMyAssignedPujas = async (req, res) => {
  try {
    const panditId = req.user.id;

    const query = `
      SELECT 
        b.id,
        b.bookingId,
        b.preferred_date,
        b.preferred_time,
        b.status,
        b.address,
        b.city,
        b.state,
         b.samagrikit,
        b.total_price AS price,
        s.puja_name,
        s.puja_type,
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
      bookings: rows,
    });
  } catch (error) {
    console.error("Pandit Fetch Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const updatePanditProfile = async (req, res) => {
  try {
    const panditId = req.user.id;
    const { email, gotra, address } = req.body; // name and phone removed

    // 1️⃣ Update users table (only email & gotra)
    await db.query("UPDATE users SET email = ?, gotra = ? WHERE id = ?", [
      email,
      gotra,
      panditId,
    ]);

    // 2️⃣ Update addresses table (default address)
    if (address) {
      const [rows] = await db.query(
        "SELECT id FROM addresses WHERE user_id = ? AND is_default = 1",
        [panditId],
      );

      if (rows.length > 0) {
        // Update existing default address
        await db.query(
          `UPDATE addresses 
           SET address_line1 = ?, city = ?, state = ?, pincode = ?
           WHERE id = ?`,
          [
            address.address_line1,
            address.city,
            address.state,
            address.pincode,
            rows[0].id,
          ],
        );
      } else {
        // Insert new default address if none exists
        await db.query(
          `INSERT INTO addresses 
           (user_id, address_line1, city, state, pincode, address_type, is_default, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, 'home', 1, NOW(), NOW())`,
          [
            panditId,
            address.address_line1,
            address.city,
            address.state,
            address.pincode,
          ],
        );
      }
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Pandit Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPanditProfile = async (req, res) => {
  try {
    const panditId = req.user.id;

    // 1️⃣ Basic user info
    const [userRows] = await db.query(
      "SELECT id, name, phone, email, gotra FROM users WHERE id = ?",
      [panditId],
    );

    if (userRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = userRows[0];

    // 2️⃣ Default address from addresses table
    const [addressRows] = await db.query(
      `SELECT address_line1, city, state, pincode
   FROM addresses
   WHERE user_id = ?
   ORDER BY is_default DESC, id ASC
   LIMIT 1`,
      [panditId],
    );

    // Add address to user object (if exists)
    if (addressRows.length > 0) {
      user.address = addressRows[0]; // {address_line1, city, state, pincode}
    } else {
      user.address = null;
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Pandit Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markPujaComplete = async (req, res) => {
  try {
    const panditId = req.user.id;
    const bookingId = req.params.id;

    // Check booking belongs to this pandit
    const [rows] = await db.query(
      "SELECT id, status FROM puja_requests WHERE id = ? AND pandit_id = ?",
      [bookingId, panditId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (rows[0].status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Puja already completed",
      });
    }

    // Update status to completed
    await db.query(
      "UPDATE puja_requests SET status = 'completed', completed_at = NOW() WHERE id = ?",
      [bookingId],
    );

    res.json({
      success: true,
      message: "Puja completed successfully",
    });
  } catch (error) {
    console.error("Mark Complete Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
