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

export const bookingDetails = async(req,res) =>{
    try{
        console.log(req.body)
    }catch(error){

    }
}