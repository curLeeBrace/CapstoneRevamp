
import { Request, Response } from 'express';
import AccountSchema from '../../db_schema/AccountSchema';
import {deleteFile} from "../../middleware/g_driveUpload";

export const delete_Acc = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  try {
    const account = await AccountSchema.findById(accountId).exec();
    if (!account)return res.status(404).json({ message: 'Account not found' });
    

    const {user_type, img_name, img_id} = account;
    const path  = `./public/img/user_img/${user_type}/${img_name}`;




    if(await deleteFile(img_id)){
      await AccountSchema.deleteOne({_id : account._id}).exec();
      return res.status(200).json({ message: 'Account successfully deleted' });
    } else {
      return res.status(404).send("Failed to delete account!");
    }
   
    

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






























// const delete_img = (filePath:string) : "sucsess" | "failed"=> {
  
//   let info : "sucsess" | "failed" = "failed";

//   if (fs.existsSync(filePath)) {

//       info = "sucsess";
//       fs.unlink(filePath, (err) => {
//         if (err) throw err;
//         console.log("File Deleted!");
//       });

    

//   }

//   return info;


// }