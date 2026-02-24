import db from "../config/db.js";
import jwt from "jsonwebtoken";
const otpStore = {}; // In-memory OTP store (phone: { otp, type, expires })

// Admin sign-in with OTP
export const AdminLoginRequest = async (req, res) => {
  try {
    const { phone, role } = req.body;

    // Database mein check karein ki user hai aur uska role 'admin' hai
    const [rows] = await db.query(
      "SELECT id, role FROM users WHERE phone = ? AND role = ?",
      [phone, role],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    // Role Strict Check: Agar role 'admin' nahi hai toh block karein
    if (rows[0].role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only administrators can login here.",
      });
    }

    // Generate 6 Digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store in memory (expires in 5 mins)
    otpStore[phone] = {
      otp,
      type: "ADMIN_LOGIN",
      expires: Date.now() + 5 * 60 * 1000,
    };

    // Logging for development (Sms gateway yaha integrate hoga)
    console.log(`\n--- ADMIN LOGIN OTP FOR ${phone}: ${otp} ---\n`);

    res.status(200).json({ message: "Admin OTP sent successfully" });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const AdminVerifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const session = otpStore[phone];

    // BYPASS LOGIC (Sirf testing ke liye)
    const isBypass = otp.toString() === "123456";

    // Validation: OTP match hona chahiye, type ADMIN_LOGIN hona chahiye aur expire nahi hona chahiye
    const isValidOtp =
      session &&
      session.type === "ADMIN_LOGIN" &&
      session.otp.toString() === otp.toString() &&
      Date.now() < session.expires;

    if (isBypass || isValidOtp) {
      // Fetch fresh admin details
      const [rows] = await db.query(
        "SELECT id, name, phone, email, role FROM users WHERE phone = ? AND role = 'admin'",
        [phone],
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Admin authentication failed." });
      }

      // Session delete karein
      if (session) delete otpStore[phone];

      // Generate Admin JWT Token
      const token = jwt.sign(
        {
          id: rows[0].id,
          name: rows[0].name,
          phone: rows[0].phone,
          role: rows[0].role, // isme 'admin' value hogi
        },
        process.env.JWT_SECRET || "admin_secret_key", // Admin ke liye alag secret bhi use kar sakte hain
        { expiresIn: "1d" }, // Admin session security ke liye chota rakhein (e.g. 1 day)
      );

      res.status(200).json({
        message: isBypass
          ? "Admin Login success (Bypass)"
          : "Admin Login success",
        token,
        role: rows[0].role,
      });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Admin Verify Error:", error);
    res.status(500).json({ message: "Admin verification failed" });
  }
};

// Admin Dashboard Stats show all activities
export const getDashboardStats = async (req, res) => {
  try {
    const [[stats]] = await db.execute(`
      SELECT
        (SELECT COUNT(*) FROM puja_requests) as totalBookings,

        (SELECT COUNT(*) FROM puja_requests 
         WHERE DATE(created_at) = CURDATE()) as todayBookings,

        (SELECT COUNT(*) FROM puja_requests 
         WHERE status='pending') as totalPendingBookings,

        (SELECT COUNT(*) FROM puja_requests 
         WHERE status='accepted') as totalAcceptedBookings,

        (SELECT COUNT(*) FROM puja_requests 
         WHERE status='declined') as totalCancelledBookings,

        (SELECT COUNT(*) FROM puja_requests 
         WHERE status='completed') as totalCompletedBookings,

        (SELECT COUNT(*) FROM users 
         WHERE role='user') as totalUsers,

        (SELECT COUNT(*) FROM users 
         WHERE role='pandit') as totalPandits,

        -- Total Revenue
        (
          SELECT COALESCE(SUM(sp.price), 0)
          FROM puja_requests pr
          JOIN service_prices sp 
            ON pr.service_id = sp.service_id
          WHERE pr.status='completed'
        ) as totalRevenue,

        -- Today Revenue (Based on completed_at)
        (
          SELECT COALESCE(SUM(sp.price), 0)
          FROM puja_requests pr
          JOIN service_prices sp 
            ON pr.service_id = sp.service_id
          WHERE pr.status='completed'
          AND DATE(pr.completed_at) = CURDATE()
        ) as todayRevenue
    `);

    // Recent Bookings (Last 5)
    const [recentBookings] = await db.execute(`
      SELECT 
        pr.id,
        pr.bookingId,
        pr.status,
        pr.created_at,
        u.name AS user_name,
        u.phone,
        s.puja_name,
        sp.price
      FROM puja_requests pr
      JOIN users u ON pr.user_id = u.id
      JOIN services s ON pr.service_id = s.id
      LEFT JOIN service_prices sp ON pr.service_id = sp.service_id
      ORDER BY pr.created_at DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      ...stats,
      totalRevenue: stats.totalRevenue || 0,
      todayRevenue: stats.todayRevenue || 0,
      recentBookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// Admin Dashboard show monthly growth chart
export const getMonthlyGrowthChart = async (req, res) => {
  try {
    const [rows] = await db.execute(`
  SELECT 
    DATE_FORMAT(CONCAT(year, '-', monthNumber, '-01'), '%b %Y') as month,
    totalBookings,
    totalRevenue
  FROM (
    SELECT 
      YEAR(pr.created_at) as year,
      MONTH(pr.created_at) as monthNumber,
      COUNT(pr.id) as totalBookings,
      SUM(
        CASE 
          WHEN pr.status = 'completed' 
          THEN sp.price 
          ELSE 0 
        END
      ) as totalRevenue
    FROM puja_requests pr
    LEFT JOIN service_prices sp 
      ON pr.service_id = sp.service_id
    WHERE pr.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY YEAR(pr.created_at), MONTH(pr.created_at)
  ) as monthlyData
  ORDER BY year, monthNumber
`);

    const months = [];
    const bookings = [];
    const revenue = [];

    rows.forEach((row) => {
      months.push(row.month);
      bookings.push(row.totalBookings);
      revenue.push(Number(row.totalRevenue || 0));
    });

    res.json({
      success: true,
      months,
      bookings,
      revenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// User Management, CRUD Operations of User
//========================================================================

// Get all users for admin dashboard
export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, name, email, phone, role, created_at
      FROM users
      WHERE role='user'
    `;

    const params = [];

    // if (search && search.trim() !== "") {
    //   query += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
    //   params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    // }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // ⚠️ IMPORTANT: remove placeholders for limit/offset

    const [users] = await db.execute(query, params);

    res.json({
      success: true,
      users,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// create new user for admin dashboard (optional, since users can sign up themselves)
export const createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    await db.execute(
      `INSERT INTO users (name, email, phone, role)
       VALUES (?, ?, ?, 'user')`,
      [name, email, phone],
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
// Get Single user details for admin dashboard
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [[user]] = await db.execute(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id=?",
      [id],
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// Update user details for admin dashboard
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    // Collect fields dynamically
    let fields = [];
    let values = [];

    if (name !== undefined) {
      fields.push("name=?");
      values.push(name);
    }

    if (email !== undefined) {
      fields.push("email=?");
      values.push(email);
    }

    if (phone !== undefined) {
      fields.push("phone=?");
      values.push(phone);
    }

    if (role !== undefined) {
      fields.push("role=?");
      values.push(role);
    }

    // If no field provided
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    // Add id at the end for WHERE clause
    values.push(id);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id=?`;

    await db.execute(query, values);

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete user for admin dashboard
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete himself",
      });
    }

    await db.execute("DELETE FROM users WHERE id=?", [id]);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// filter users by role for admin dashboard
export const filtarUsers = async (req, res) => {
  try {
    const { types } = req.params;

    const [users] = await db.execute(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE role=? ORDER BY created_at DESC",
      [types],
    );
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Users not found" });
    }
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

//===================================================================
// pandit management, CRUD operations of pandit
//========================================================================

export const getAllPandits = async (req, res) => {
  try {
    const [pandits] = await db.execute(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE role='pandit' ORDER BY created_at DESC",
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

//================= Service Management, CRUD operations of service =========================

// Get all services for admin dashboard with filter and search

// export const getAllServices = async (req, res) => {
//   try {
//     const { puja_type, search } = req.query;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const offset = (page - 1) * limit;

//     let whereClause = `WHERE 1=1`;
//     const params = [];

//     if (puja_type) {
//       whereClause += ` AND puja_type = ?`;
//       params.push(puja_type);
//     }

//     if (search) {
//       whereClause += ` AND puja_name LIKE ?`;
//       params.push(`%${search}%`);
//     }

//     // ✅ Total Count (ONLY services table)
//     const [countResult] = await db.query(
//       `SELECT COUNT(*) as total FROM services ${whereClause}`,
//       params,
//     );

//     const totalServices = countResult[0].total;
//     const totalPages = Math.ceil(totalServices / limit);

//     // ✅ Get paginated services FIRST
//     const [services] = await db.query(
//       `SELECT * FROM services
//        ${whereClause}
//        ORDER BY created_at DESC
//        LIMIT ? OFFSET ?`,
//       [...params, limit, offset],
//     );

//     const serviceIds = services.map((s) => s.id);

//     let prices = [];

//     if (serviceIds.length > 0) {
//       const [priceRows] = await db.query(
//         `SELECT * FROM service_prices
//          WHERE service_id IN (?)`,
//         [serviceIds],
//       );
//       prices = priceRows;
//     }

//     // ✅ Group prices
//     const finalServices = services.map((service) => ({
//       ...service,
//       prices: prices.filter((p) => p.service_id === service.id),
//     }));

//     res.json({
//       success: true,
//       currentPage: page,
//       totalPages,
//       totalServices,
//       services: finalServices,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false });
//   }
// };
export const getAllServices = async (req, res) => {
  try {
    const { puja_type, search, status } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    let whereClause = `WHERE 1=1`;
    const params = [];

    // ✅ Puja Type Filter
    if (puja_type) {
      whereClause += ` AND puja_type = ?`;
      params.push(puja_type);
    }

    // ✅ Search Filter
    if (search) {
      whereClause += ` AND puja_name LIKE ?`;
      params.push(`%${search}%`);
    }

    // ✅ Status Filter (NEW)
    if (status && status !== "all") {
      whereClause += ` AND status = ?`;
      params.push(status);
    }

    // ✅ Total Count
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM services ${whereClause}`,
      params,
    );

    const totalServices = countResult[0].total;
    const totalPages = Math.ceil(totalServices / limit);

    // ✅ Paginated Data
    const [services] = await db.query(
      `SELECT * FROM services
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    res.json({
      success: true,
      currentPage: page,
      totalPages,
      totalServices,
      services,
    });
  } catch (error) {
    console.error("Get Services Error:", error);
    res.status(500).json({ success: false });
  }
};

// Get single service details for admin dashboard
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        s.*,
        sp.id AS price_id,
        sp.pricing_type,
        sp.price
      FROM services s
      LEFT JOIN service_prices sp 
        ON s.id = sp.service_id
      WHERE s.id = ?
    `,
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const service = {
      id: rows[0].id,
      puja_name: rows[0].puja_name,
      puja_type: rows[0].puja_type,
      description: rows[0].description,
      image_url: rows[0].image_url,
      created_at: rows[0].created_at,
      prices: rows
        .filter((r) => r.price_id)
        .map((r) => ({
          price_id: r.price_id,
          pricing_type: r.pricing_type,
          price: r.price,
        })),
    };

    res.json({ success: true, service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// Create new service for admin dashboard
export const createService = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { puja_name, puja_type, description } = req.body;
    const prices = JSON.parse(req.body.prices || "[]");

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO services (puja_name, puja_type, description, image_url)
       VALUES (?, ?, ?, ?)`,
      [puja_name, puja_type, description, image_url],
    );

    const serviceId = result.insertId;

    for (let price of prices) {
      await connection.query(
        `INSERT INTO service_prices (service_id, pricing_type, price)
         VALUES (?, ?, ?)`,
        [serviceId, price.pricing_type, price.price],
      );
    }

    await connection.commit();

    res.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false });
  } finally {
    connection.release();
  }
};

// Update service details for admin dashboard
export const updateService = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    let { puja_name, puja_type, description, prices } = req.body;

    if (typeof prices === "string") {
      prices = JSON.parse(prices);
    }

    await connection.beginTransaction();

    let image_url = null;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    if (image_url) {
      await connection.query(
        `UPDATE services 
         SET puja_name=?, puja_type=?, description=?, image_url=? 
         WHERE id=?`,
        [puja_name, puja_type, description, image_url, id],
      );
    } else {
      await connection.query(
        `UPDATE services 
         SET puja_name=?, puja_type=?, description=? 
         WHERE id=?`,
        [puja_name, puja_type, description, id],
      );
    }

    await connection.query(`DELETE FROM service_prices WHERE service_id=?`, [
      id,
    ]);

    if (Array.isArray(prices)) {
      for (let price of prices) {
        await connection.query(
          `INSERT INTO service_prices (service_id, pricing_type, price)
           VALUES (?, ?, ?)`,
          [id, price.pricing_type, price.price],
        );
      }
    }

    await connection.commit();

    res.json({ success: true, message: "Service updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false });
  } finally {
    connection.release();
  }
};

// Delete service for admin dashboard
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM service_prices WHERE service_id=?`, [id]);
    await db.query(`DELETE FROM services WHERE id=?`, [id]);

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

//===== Booking Services=========

// Get all bookings for admin dashboard with filter and search
// GET /admin/bookings?status=pending
// GET /admin/bookings?date=2026-02-23
// GET /admin/bookings?search=BK123
// GET /admin/bookings?page=1&limit=10

export const getAllBookings = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        pr.id,
        pr.bookingId,
        pr.status,
        pr.preferred_date,
        pr.preferred_time,

        u.name AS user_name,
        u.phone AS user_phone,

        s.puja_name,
        s.puja_type,

        -- ✅ Pandit Name (Safe)
        COALESCE(p.name, 'Not Assigned') AS pandit_name,

        sp.price

      FROM puja_requests pr

      LEFT JOIN users u ON pr.user_id = u.id
      LEFT JOIN services s ON pr.service_id = s.id
      LEFT JOIN users p ON pr.pandit_id = p.id

      -- ✅ No duplication price join
      LEFT JOIN (
         SELECT service_id, MIN(price) as price
         FROM service_prices
         GROUP BY service_id
      ) sp ON pr.service_id = sp.service_id

      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += ` AND pr.status=?`;
      params.push(status);
    }

    if (date) {
      query += ` AND pr.preferred_date=?`;
      params.push(date);
    }

    if (search) {
      query += ` AND pr.bookingId LIKE ?`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY pr.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);

    res.json({
      success: true,
      bookings: rows,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// get single booking details for admin dashboard
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        pr.*,
        u.name AS user_name,
        u.email,
        u.phone,
        s.puja_name,
        s.puja_type,
        p.name AS pandit_name,
        sp.price
      FROM puja_requests pr
      LEFT JOIN users u ON pr.user_id = u.id
      LEFT JOIN services s ON pr.service_id = s.id
      LEFT JOIN users p ON pr.pandit_id = p.id
      LEFT JOIN service_prices sp 
        ON pr.service_id = sp.service_id
        AND pr.ticket_type = sp.pricing_type
      WHERE pr.id=?
    `,
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      booking: rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// today booking details
export const getTodayBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        pr.*,
        u.name AS user_name,
        s.puja_name,
        sp.price
      FROM puja_requests pr
      LEFT JOIN users u ON pr.user_id = u.id
      LEFT JOIN services s ON pr.service_id = s.id
      LEFT JOIN service_prices sp 
        ON pr.service_id = sp.service_id
        AND pr.ticket_type = sp.pricing_type
      WHERE DATE(pr.completed_at)=CURDATE()
      ORDER BY pr.completed_at DESC
    `);

    res.json({
      success: true,
      totalTodayBookings: rows.length, // ✅ count added
      bookings: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
