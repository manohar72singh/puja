import db from "../config/db.js";

// Admin Dashboard Stats show all activities
export const getDashboardStats = async (req, res) => {
  try {
    const [[stats]] = await db.execute(`
      SELECT
        (SELECT COUNT(*) FROM puja_requests) as totalBookings,
        (SELECT COUNT(*) FROM puja_requests WHERE status='pending') as totalPendingBookings,
        (SELECT COUNT(*) FROM puja_requests WHERE status='accepted') as totalAcceptedBookings,
        (SELECT COUNT(*) FROM puja_requests WHERE status='declined') as totalCancelledBookings,
        (SELECT COUNT(*) FROM puja_requests WHERE status='completed') as totalCompletedBookings,
        (SELECT COUNT(*) FROM users WHERE role='user') as totalUsers,
        (SELECT COUNT(*) FROM users WHERE role='pandit') as totalPandits,
        (
          SELECT SUM(sp.price)
          FROM puja_requests pr
          JOIN service_prices sp ON pr.service_id = sp.service_id
          WHERE pr.status='completed'
        ) as totalRevenue
    `);

    res.json({
      success: true,
      ...stats,
      totalRevenue: stats.totalRevenue || 0,
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
      "SELECT id, name, email, phone, role, created_at FROM users WHERE role='user' ORDER BY created_at DESC"
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
      [id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
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
        message: "Admin cannot delete himself"
      });
    }

    await db.execute(
      "DELETE FROM users WHERE id=?",
      [id]
    );

    res.json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// filter users by role for admin dashboard
export const filtarUsers = async (req, res) => {
  try {
    const {types} = req.params;

    const [users] = await db.execute(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE role=? ORDER BY created_at DESC",
      [types]
    );
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "Users not found" });
    }
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
}

//===================================================================
// pandit management, CRUD operations of pandit
//========================================================================


export const getAllPandits = async (req, res) => {
  try {
    const [pandits] = await db.execute(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE role='pandit' ORDER BY created_at DESC"
    )} catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
