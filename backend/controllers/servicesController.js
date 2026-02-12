import db from '../config/db.js';

export const allServices = async(req,res) =>{
    try{
        const [services] = await db.query("SELECT * FROM services");
        res.status(200).json(services)
    }catch(error){
        res.status(500).json({message:"Failed to fetch services",
            error:error.message
        })
    }
}