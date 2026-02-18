import db from "../config/db.js";


// Customer care ke pass All Booking Show hogi

export const getAllPujaRequests = async (req, res) => {
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
        u.phone AS user_phone
      FROM puja_requests b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE (b.address NOT LIKE '%Ticket:%' OR b.address IS NULL)
      AND b.status = 'pending'
      ORDER BY b.preferred_date ASC
    `;

    const [rows] = await db.query(query);

    res.status(200).json({
      success: true,
      count: rows.length,
      bookings: rows
    });

  } catch (error) {
    console.error("CustomerCare Fetch Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const getFilterPujaRequests = async (req, res) => {
  try {

    const statsQuery = `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status='accepted' THEN 1 ELSE 0 END) AS accepted,
        SUM(CASE WHEN status='declined' THEN 1 ELSE 0 END) AS declined,
        SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed
      FROM puja_requests
    `;

    const [stats] = await db.query(statsQuery);

    res.status(200).json({
      success: true,
      stats: stats[0],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};



// customer care ke pass booking accept ya decline karne ka option hoga, 
// aur uske baad wo pandit ko assign kar sakta hai.
// Iske liye ek API banayenge jisme booking ID aur action (accept/decline) bhejna hoga. 
// Phir us action ke hisaab se database update karenge.

// Accept decline API
export const updatePujaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["accepted", "declined", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    // Step 1: Get current status
    const [rows] = await db.query(
      "SELECT status FROM puja_requests WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    const currentStatus = rows[0].status;

    // Step 2: Validate transition according to your diagram
    let isValidTransition = false;

    if (currentStatus === "pending" && 
        (status === "accepted" || status === "declined")) {
      isValidTransition = true;
    }

    if (currentStatus === "accepted" && status === "completed") {
      isValidTransition = true;
    }

    if (!isValidTransition) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${currentStatus} to ${status}`
      });
    }

    // Step 3: Update status
    await db.query(
      "UPDATE puja_requests SET status = ? WHERE id = ?",
      [status, id]
    );

    return res.status(200).json({
      success: true,
      message: `Puja request ${status} successfully`
    });

  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
