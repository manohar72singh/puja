import db from "../config/db.js";
import pool from "../config/db.js";

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

export const homeORKathaPujaBookingDetails = async (req, res) => {
  try {
    const {
      puja_id,
      date,
      time,
      location,
      city,
      state,
      devoteeName,
      ticket_type,
      donations,
      bookingId,
    } = req.body;
    // console.log("Received Booking Data:", req.body);
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
      location,
      city || "N/A",
      state || "N/A",
      // 🔥 Temple booking me address NULL
      bookingId,
      // isTempleBooking
      //   ? null
      //   : `${location || "N/A"}, Pincode: ${pincode || "N/A"}`,

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

export const bookingDetails = async (req, res) => {
  try {
    const {
      puja_id,
      date,
      time,
      address,
      city,
      state,
      devoteeName,
      // pincode,
      ticket_type,
      donations,
      bookingId,
      total_price,
    } = req.body;
    console.log("Received Booking Data:", req.body);
    const userId = req.user.id;

    const formattedDate = date
      ? new Date(date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    // 👇 Important Logic Change
    const isTempleBooking = !!ticket_type;

    const query = `
      INSERT INTO puja_requests 
      (user_id, service_id, preferred_date, preferred_time, address, city, state, status, bookingId, ticket_type, donations, devotee_name,total_price) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?,?)
    `;

    const [result] = await db.query(query, [
      userId,
      puja_id,
      formattedDate,
      time || "Morning Slot",
      address,
      city || "N/A",
      state || "N/A",
      // 🔥 Temple booking me address NULL
      bookingId,
      // isTempleBooking
      //   ? null
      //   : `${location || "N/A"}, Pincode: ${pincode || "N/A"}`,

      isTempleBooking ? ticket_type : null,
      isTempleBooking ? donations || "None" : null,
      devoteeName || "User",
      total_price,
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

export const pindDan = async (req, res) => {
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

        p.price AS standard_price

      FROM services s

      LEFT JOIN temples t 
        ON s.id = t.service_id

      LEFT JOIN service_prices p 
        ON s.id = p.service_id 
        AND p.pricing_type = 'standard'

      WHERE s.puja_type = 'pind_dan'
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

export const PindDanSingle = async (req, res) => {
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

        p.price AS standard_price

      FROM services s

      LEFT JOIN temples t 
        ON s.id = t.service_id

      LEFT JOIN service_prices p 
        ON s.id = p.service_id 
        AND p.pricing_type = 'standard'

      WHERE s.id = ?
      `,
      [id],
    );

    res.status(200).json({
      success: true,
      data: rows[0] || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Booking cancel karne ka controller
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    // User ID ko verify karein (Agar aap req.user use kar rahe hain toh)
    const userId = req.user ? req.user.id : null;

    // Database query - dhyaan dein ki aapka table name 'puja_request' hi ho
    const [result] = await db.query("DELETE FROM puja_requests WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking nahi mili." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const postSupportQuery = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, subject, message } = req.body;

    const sql =
      "INSERT INTO support_queries (user_id, category, subject, message) VALUES (?, ?, ?, ?)";

    // mysql2/promise mein hum aise await use karte hain:
    const [result] = await pool.execute(sql, [
      userId,
      category,
      subject,
      message,
    ]);

    // Ab ye response frontend ko 100% milega
    return res.status(200).json({
      success: true,
      message: "Query Submitted Successfully",
      id: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database Error",
      error: error.message,
    });
  }
};

export const getUserSupportQueries = async (req, res) => {
  try {
    console.log("--- Fetching from DB ---");
    const userId = req.user.id;

    const sql =
      "SELECT * FROM support_queries WHERE user_id = ? ORDER BY created_at DESC";

    // Kyunki aapne 'mysql2/promise' use kiya hai, toh yahan await lagega
    // results ek array return karta hai jisme pehla element data hota hai
    const [results] = await pool.query(sql, [userId]);

    console.log("DB Success! Rows found:", results.length);

    return res.status(200).json(results);
  } catch (error) {
    console.error("DB Query Error:", error);
    return res.status(500).json({
      message: "Error fetching data",
      error: error.message,
    });
  }
};
