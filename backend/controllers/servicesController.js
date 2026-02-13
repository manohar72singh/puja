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

export const bookPuja = async (req, res) => {
  try {
    // console.log(req.params);
    const { id } = req.params;
    // const [data] = await db.query("SELECT * FROM services WHERE id = ?", [id]);
    const [data] = await db.query(`
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
      WHERE s.id = ?
      `, [id]);
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to book puja", error: error.message });
  }
};


export const bookingDetails = async (req, res) => {
  try {
    const {
      puja_id,
      date,
      time,
      location, // Home puja ke liye zaruri hai
      city,
      state,
      devoteeName,
      pincode,
      ticket_type, // Temple puja ke liye
      donations    // Temple puja ke liye
    } = req.body;

    const userId = req.user.id;

    // Smart Address Logic: Check karein ki Temple puja hai ya Home puja
    let fullAddress = "";
    if (ticket_type) {
      // Temple Puja format
      fullAddress = `Ticket: ${ticket_type} | Donations: ${donations || 'None'} | Devotee: ${devoteeName || 'User'}`;
    } else {
      // Home Puja format (Location missing hone par empty string rakhega)
      fullAddress = `${location || 'N/A'}, Pincode: ${pincode || 'N/A'}, Devotee: ${devoteeName || 'User'}`;
    }

    // Query mein table ka naam 'puja_requests' hi rakhein jo aapne bataya tha
    const query = `
      INSERT INTO puja_requests 
      (user_id, service_id, preferred_date, preferred_time, address, city, state, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    // Query execute karein
    const [result] = await db.query(query, [
      userId,
      puja_id,
      date || new Date().toISOString().split('T')[0],
      time || 'Morning Slot',
      fullAddress,
      city || 'N/A',
      state || 'N/A'
    ]);

    res.status(201).json({
      success: true,
      message: "Booking successfully stored!",
      bookingId: result.insertId
    });

  } catch (error) {
    console.error("Database Error Detail:", error); // Terminal mein error check karein
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message
    });
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Token se mil rahi user id

    // getUserBookings function mein query ko update karein
    const query = `
      SELECT 
        b.*, 
        s.puja_name, 
        s.image_url, 
        s.puja_type 
      FROM puja_requests b
      JOIN services s ON b.service_id = s.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `;

    const [rows] = await db.query(query, [userId]);

    res.status(200).json({
      success: true,
      bookings: rows
    });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ success: false, message: "Bookings fetch nahi ho payi" });
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

