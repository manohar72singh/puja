import db from "../config/db.js";

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
    const [users] = await db.execute(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE role='user' ORDER BY created_at DESC",
    );

    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
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
export const getAllServices = async (req, res) => {
  try {
    const { puja_type, search } = req.query;

    let query = `
      SELECT 
        s.id,
        s.puja_name,
        s.puja_type,
        s.description,
        s.image_url,
        s.created_at,
        sp.id AS price_id,
        sp.pricing_type,
        sp.price
      FROM services s
      LEFT JOIN service_prices sp 
        ON s.id = sp.service_id
      WHERE 1=1
    `;

    const params = [];

    if (puja_type) {
      query += ` AND s.puja_type = ?`;
      params.push(puja_type);
    }

    if (search) {
      query += ` AND s.puja_name LIKE ?`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY s.created_at DESC`;

    const [rows] = await db.query(query, params);

    // 🔥 Group pricing under each service
    const grouped = {};

    rows.forEach((row) => {
      if (!grouped[row.id]) {
        grouped[row.id] = {
          id: row.id,
          puja_name: row.puja_name,
          puja_type: row.puja_type === "temple_puja" ? "event" : row.puja_type,
          description: row.description,
          image_url: row.image_url,
          created_at: row.created_at,
          prices: [],
        };
      }

      if (row.price_id) {
        grouped[row.id].prices.push({
          price_id: row.price_id,
          pricing_type: row.pricing_type,
          price: row.price,
        });
      }
    });

    res.json({
      success: true,
      totalServices: Object.keys(grouped).length,
      services: Object.values(grouped),
    });
  } catch (error) {
    console.error(error);
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
    const { puja_name, puja_type, description, image_url, prices } = req.body;

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

    res.json({ success: true, message: "Service created successfully" });
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
    const { puja_name, puja_type, description, image_url, prices } = req.body;

    await connection.beginTransaction();

    await connection.query(
      `UPDATE services 
       SET puja_name=?, puja_type=?, description=?, image_url=? 
       WHERE id=?`,
      [puja_name, puja_type, description, image_url, id],
    );

    await connection.query(`DELETE FROM service_prices WHERE service_id=?`, [
      id,
    ]);

    for (let price of prices) {
      await connection.query(
        `INSERT INTO service_prices (service_id, pricing_type, price)
         VALUES (?, ?, ?)`,
        [id, price.pricing_type, price.price],
      );
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
    const { status, date, search, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        pr.*,
        u.name AS user_name,
        u.phone AS user_phone,
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
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(query, params);

    res.json({
      success: true,
      page: Number(page),
      count: rows.length,
      bookings: rows,
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
      WHERE DATE(pr.created_at)=CURDATE()
      ORDER BY pr.created_at DESC
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
