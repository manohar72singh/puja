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

export const bookPuja = async(req,res) =>{
    try {
        // console.log(req.params);
        const {id} = req.params;
        const [data] = await db.query("SELECT * FROM services WHERE id = ?", [id]);
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({message:"Failed to book puja",
            error:error.message
        })
    }
}