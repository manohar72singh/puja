import db from "../config/db.js";

export const getServicesByType = async (req, res) => {
  try {
    const { type } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
          s.id,
          s.puja_name,
          s.puja_type,
          s.description,
          s.image_url,

          MAX(CASE WHEN p.pricing_type = 'standard' THEN p.price END) AS standard_price,
          MAX(CASE WHEN p.pricing_type = 'single' THEN p.price END) AS single_price,
          MAX(CASE WHEN p.pricing_type = 'couple' THEN p.price END) AS couple_price,
          MAX(CASE WHEN p.pricing_type = 'family' THEN p.price END) AS family_price

      FROM services s
      LEFT JOIN service_prices p ON s.id = p.service_id
      WHERE s.puja_type = ?
      GROUP BY s.id
    `,
      [type],
    );

    res.status(200).json({
      success: true,
      services: rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// export const bookPuja = async (req, res) => {
//   try {
//     // console.log(req.params);
//     const { id } = req.params;
//     // const [data] = await db.query("SELECT * FROM services WHERE id = ?", [id]);
//     const [data] = await db.query(
//       `
//         SELECT
//           s.id,
//           s.puja_name,
//           s.puja_type,
//           s.description,
//           s.image_url,

//           MAX(CASE WHEN p.pricing_type = 'standard' THEN p.price END) AS standard_price,
//           MAX(CASE WHEN p.pricing_type = 'single' THEN p.price END) AS single_price,
//           MAX(CASE WHEN p.pricing_type = 'couple' THEN p.price END) AS couple_price,
//           MAX(CASE WHEN p.pricing_type = 'family' THEN p.price END) AS family_price

//       FROM services s
//       LEFT JOIN service_prices p ON s.id = p.service_id
//       WHERE s.id = ?
//       `,
//       [id],
//     );
//     res.status(200).json(data);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to book puja", error: error.message });
//   }
// };

// export const bookingDetails = async (req, res) => {
//   try {
//     const {
//       puja_id,
//       date,
//       time,
//       location, // Home puja ke liye zaruri hai
//       city,
//       state,
//       devoteeName,
//       pincode,
//       ticket_type, // Temple puja ke liye
//       donations, // Temple puja ke liye
//       bookingId,
//     } = req.body;
//     console.log("Received Booking Details:", req.body); // Debugging ke liye
//     const userId = req.user.id;

//     // Format date for MySQL
//     const formattedDate = date
//       ? new Date(date).toISOString().split("T")[0]
//       : new Date().toISOString().split("T")[0];

//     // Smart Address Logic: Check karein ki Temple puja hai ya Home puja
//     let fullAddress = "";

//     if (ticket_type) {
//       // Temple Puja format
//       fullAddress = `Ticket: ${ticket_type} | Donations: ${donations || "None"} | Devotee: ${devoteeName || "User"}`;
//     } else {
//       // Home Puja format (Location missing hone par empty string rakhega)
//       fullAddress = `${location || "N/A"}, Pincode: ${pincode || "N/A"}, Devotee: ${devoteeName || "User"}`;
//     }

//     // Query mein table ka naam 'puja_requests' hi rakhein jo aapne bataya tha
//     const query = `
//       INSERT INTO puja_requests
//       (user_id, service_id, preferred_date, preferred_time, address, city, state, status, bookingId)
//       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
//     `;

//     // Query execute karein
//     const [result] = await db.query(query, [
//       userId,
//       puja_id,
//       // date || new Date().toISOString().split('T')[0],
//       formattedDate,
//       time || "Morning Slot",
//       fullAddress,
//       city || "N/A",
//       state || "N/A",
//       bookingId,
//     ]);

//     res.status(201).json({
//       success: true,
//       message: "Booking successfully stored!",
//       bookingId: result.insertId,
//     });
//   } catch (error) {
//     console.error("Database Error Detail:", error); // Terminal mein error check karein
//     res.status(500).json({
//       success: false,
//       message: "Server Error: " + error.message,
//     });
//   }
// };

// export const getUserBookings = async (req, res) => {
//   try {
//     const userId = req.user.id; // Token se mil rahi user id

//     // getUserBookings function mein query ko update karein
//     const query = `
//       SELECT
//         b.*,
//         s.puja_name,
//         s.image_url,
//         s.puja_type
//       FROM puja_requests b
//       JOIN services s ON b.service_id = s.id
//       WHERE b.user_id = ?
//       ORDER BY b.created_at DESC
//     `;

//     const [rows] = await db.query(query, [userId]);
//     console.log("Fetched Bookings for User ID", userId, ":", rows); // Debugging ke liye
//     // console.log();

//     res.status(200).json({
//       success: true,
//       bookings: rows,
//     });
//   } catch (error) {
//     console.error("Fetch Bookings Error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Bookings fetch nahi ho payi" });
//   }
// };

export const bookPuja = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        s.id,
        s.puja_name,
        s.puja_type,
        s.description,
        s.image_url,

        MAX(CASE WHEN p.pricing_type = 'standard' THEN p.price END) AS standard_price,
        MAX(CASE WHEN p.pricing_type = 'single' THEN p.price END) AS single_price,
        MAX(CASE WHEN p.pricing_type = 'couple' THEN p.price END) AS couple_price,
        MAX(CASE WHEN p.pricing_type = 'family' THEN p.price END) AS family_price

      FROM services s
      LEFT JOIN service_prices p 
        ON s.id = p.service_id

      WHERE s.id = ?

      GROUP BY 
        s.id,
        s.puja_name,
        s.puja_type,
        s.description,
        s.image_url
      `,
      [id],
    );

    res.status(200).json(rows[0] || null);
  } catch (error) {
    console.error("Book Puja Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch puja",
    });
  }
};

export const bookingDetails = async (req, res) => {
  try {
    const {
      puja_id,
      date,
      time,
      location,
      city,
      state,
      devoteeName,
      pincode,
      ticket_type,
      donations,
      bookingId,
    } = req.body;

    const userId = req.user.id;

    const formattedDate = date
      ? new Date(date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    // 👇 Important Logic Change
    const isTempleBooking = !!ticket_type;

    const query = `
      INSERT INTO puja_requests 
      (user_id, service_id, preferred_date, preferred_time, address, city, state, status, bookingId, ticket_type, donations, devotee_name) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      userId,
      puja_id,
      formattedDate,
      time || "Morning Slot",

      // 🔥 Temple booking me address NULL
      isTempleBooking
        ? null
        : `${location || "N/A"}, Pincode: ${pincode || "N/A"}`,

      city || "N/A",
      state || "N/A",
      bookingId,

      isTempleBooking ? ticket_type : null,
      isTempleBooking ? donations || "None" : null,
      devoteeName || "User",
    ]);

    res.status(201).json({
      success: true,
      message: "Booking successfully stored!",
      bookingId: result.insertId,
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        b.*,

        COALESCE(
          CASE 
            WHEN s.puja_type = 'temple_puja' 
              THEN t.address
            ELSE b.address
          END
        ) AS final_address,

        s.puja_name, 
        s.image_url, 
        s.puja_type

      FROM puja_requests b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN temples t ON b.service_id = t.service_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `;

    const [rows] = await db.query(query, [userId]);

    res.status(200).json({
      success: true,
      bookings: rows,
    });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Bookings fetch nahi ho payi",
    });
  }
};

export const templePuja = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id AS service_id,
        s.puja_name,
        s.puja_type,
        s.description,
        s.image_url,
        s.created_at AS service_created_at,

        t.id AS temple_id,
        t.about,
        t.address,
        t.dateOfStart,
        t.created_at AS temple_created_at,

        MAX(CASE WHEN p.pricing_type = 'standard' THEN p.price END) AS standard_price,
        MAX(CASE WHEN p.pricing_type = 'single' THEN p.price END) AS single_price,
        MAX(CASE WHEN p.pricing_type = 'couple' THEN p.price END) AS couple_price,
        MAX(CASE WHEN p.pricing_type = 'family' THEN p.price END) AS family_price

      FROM services s

      LEFT JOIN temples t 
        ON s.id = t.service_id

      LEFT JOIN service_prices p 
        ON s.id = p.service_id

      WHERE s.puja_type = 'temple_puja'

      GROUP BY s.id, t.id
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const templePujaSingle = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `
      SELECT 
        s.id AS service_id,
        s.puja_name,
        s.puja_type,
        s.description,
        s.image_url,
        s.created_at AS service_created_at,

        t.id AS temple_id,
        t.about,
        t.address,
        t.dateOfStart,
        t.created_at AS temple_created_at,

        MAX(CASE WHEN p.pricing_type = 'standard' THEN p.price END) AS standard_price,
        MAX(CASE WHEN p.pricing_type = 'single' THEN p.price END) AS single_price,
        MAX(CASE WHEN p.pricing_type = 'couple' THEN p.price END) AS couple_price,
        MAX(CASE WHEN p.pricing_type = 'family' THEN p.price END) AS family_price

      FROM services s

      LEFT JOIN temples t 
        ON s.id = t.service_id

      LEFT JOIN service_prices p 
        ON s.id = p.service_id

      WHERE s.id = ?

      GROUP BY s.id, t.id
    `,
      [id],
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
