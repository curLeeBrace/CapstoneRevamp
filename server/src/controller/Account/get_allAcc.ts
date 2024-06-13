import { Request, Response } from "express";
import AccountSchema from '../../db_schema/AccountSchema';
import path from 'path';
import fs from 'fs';

const get_allAcc = async (req: Request, res: Response): Promise<Response> => {
  try {
    const accs = await AccountSchema.find({}).exec();
    
    if (accs.length > 0) {
      const all_acc = accs.map(acc => {
        let img_url = null;
        
        if (acc.img_name) {
          const imgPath = path.join(__dirname, '..', '..', 'client', 'public', 'img', 'user_img', `${acc.user_type}`, acc.img_name);
          // Check if the file exists
          if (fs.existsSync(imgPath)) {
            img_url = `/img/user_img/${acc.user_type}/${acc.img_name}`;
          }
        }

        return {
          _id: acc._id,
          email: acc.email,
          f_name: acc.f_name,
          m_name: acc.m_name,
          l_name: acc.l_name,
          address: {
            brgy_name: acc.address.brgy_name,
            municipality_name: acc.address.municipality_name
          },
          lgu_municipality: {
            municipality_name: acc.lgu_municipality.municipality_name,
            municipality_code: acc.lgu_municipality.municipality_code,
            province_code: acc.lgu_municipality.province_code
          },
          img_name: acc.img_name,
          img_url, // Include the image URL
          user_type: acc.user_type,
          verified: acc.verified
        };
      });

      return res.status(200).json(all_acc);
    }

    return res.status(204).json({ message: "No accounts found" });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { get_allAcc };
