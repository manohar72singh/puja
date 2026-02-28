import db from "../config/db.js";

export const getContributionsByService = async (req, res) => {
  try {
    // console.log("inside");

    const { serviceId } = req.params;

    const [service] = await db.execute(
      "SELECT puja_type FROM services WHERE id = ?",
      [serviceId],
    );

    if (!service.length) {
      return res.status(404).json({ message: "Service not found" });
    }

    const pujaType = service[0].puja_type;

    let query = "SELECT * FROM contribution_types WHERE is_active = 1";

    // If NOT home or katha, remove Samagri Kit
    if (!["home_puja", "katha"].includes(pujaType)) {
      query += " AND name != 'Samagri Kit'";
    }

    const [contributions] = await db.execute(query);

    // console.log(contributions);

    res.json({ success: true, data: contributions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
