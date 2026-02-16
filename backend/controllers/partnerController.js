import db from "../config/db.js"; // <--- Sabse pehle ye check karein

// export const getAvailableHomePujas = async (req, res) => {
//   try {
//     // Ab 'db' defined hai, toh query chal jayegi
//     const query = `
//       SELECT 
//         b.id, b.address, b.city, b.state, b.preferred_date, b.preferred_time, b.status,
//         s.puja_name, s.puja_type,
//         u.name as user_name, u.phone as user_phone
//       FROM puja_requests b
//       LEFT JOIN services s ON b.service_id = s.id
//       LEFT JOIN users u ON b.user_id = u.id
//       WHERE (b.address NOT LIKE '%Ticket:%' OR b.address IS NULL)
//       AND b.status = 'pending'
//       ORDER BY b.preferred_date ASC
//     `;
//     const [rows] = await db.query(query);
//     res.status(200).json({ success: true, bookings: rows });
//   } catch (error) {
//     console.error("Duniya Khatam Error:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


export const getAvailableHomePujas = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.address,
        b.city,
        b.state,
        b.preferred_date,
        b.preferred_time,
        b.status,

        s.puja_name,
        s.puja_type,

        u.name AS user_name,
        u.phone AS user_phone,

        sp.price AS standard_price

      FROM puja_requests b

      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.user_id = u.id

      LEFT JOIN service_prices sp 
        ON s.id = sp.service_id 
        AND sp.pricing_type = 'standard'

      WHERE b.status = 'pending'

      ORDER BY b.preferred_date ASC
    `;

    const [rows] = await db.query(query);

    res.status(200).json({
      success: true,
      bookings: rows
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const updateBookingStatus = async (req, res) => {
  const { bookingId, action } = req.body; // action: 'accepted' or 'declined'
  const panditId = req.user?.id;

  if (!panditId) {
    return res.status(401).json({ success: false, message: "Unauthorized: No Pandit ID" });
  }

  try {
    // 1. Pehle main table (puja_requests) ka status badlo
    await db.query("UPDATE puja_requests SET status = ? WHERE id = ?", [action, bookingId]);

    // 2. Phir assignment table mein entry dalo
    // DHAYAN DEIN: Agar table ka naam 'PK' nahi hai, toh yahan 'request_assignments' likhein
    const sql = `
      INSERT INTO request_assignments (request_id, pandit_id, status) 
      VALUES (?, ?, ?)
    `;

    await db.query(sql, [bookingId, panditId, action]);

    res.status(200).json({ success: true, message: `Puja ${action} successfully!` });

  } catch (error) {
    // Ye message aapke backend terminal (VS Code) mein print hoga
    console.error("UPDATE ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Pandit ki apni accepted pujas fetch karna
// export const getMyAcceptedPujas = async (req, res) => {
//   const panditId = req.user.id;
//   try {
//     const query = `
//       SELECT 
//         b.id, b.address, b.city, b.preferred_date, b.preferred_time, b.status,
//         s.puja_name, u.name as user_name, u.phone as user_phone
//       FROM puja_requests b
//       JOIN request_assignments ra ON b.id = ra.request_id
//       LEFT JOIN services s ON b.service_id = s.id
//       LEFT JOIN users u ON b.user_id = u.id
//       WHERE ra.pandit_id = ? AND ra.status = 'accepted'
//       ORDER BY b.preferred_date ASC
//     `;
//     const [rows] = await db.query(query, [panditId]);
//     res.status(200).json({ success: true, bookings: rows });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


export const getMyAcceptedPujas = async (req, res) => {
  const panditId = req.user.id;

  try {
    const query = `
      SELECT 
        b.id,
        b.address,
        b.city,
        b.state,
        b.preferred_date,
        b.preferred_time,
        b.status,

        s.puja_name,
        s.puja_type,

        u.name AS user_name,
        u.phone AS user_phone,

        sp.price AS standard_price

      FROM puja_requests b

      JOIN request_assignments ra ON b.id = ra.request_id
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.user_id = u.id

      LEFT JOIN service_prices sp 
        ON s.id = sp.service_id 
        AND sp.pricing_type = 'standard'

      WHERE ra.pandit_id = ?
      AND ra.status = 'accepted'

      ORDER BY b.preferred_date ASC
    `;

    const [rows] = await db.query(query, [panditId]);

    // console.log(rows)

    res.status(200).json({
      success: true,
      bookings: rows
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
