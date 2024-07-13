import fs from 'fs';
import {google} from 'googleapis'
// import dotenv from 'dotenv';
// dotenv.config();
import api_key from "../../api_key.json"
const SCOPE = ['https://www.googleapis.com/auth/drive'];


async function authorize(){
    let jwtClient;

    try {

        jwtClient = new google.auth.JWT(
            api_key.client_email,
            "",
            api_key.private_key,
            SCOPE
        );
   
        await jwtClient.authorize();


        
    } catch (error) {
        console.log("AUTH ERROR :", error)
    }
   
    return jwtClient;
}


async function uploadFile(auth:any, filePath:any, fileName:any, mimeType:any, pardentFolder_ids : string[], res:any) {
    const drive = google.drive({ version: 'v3', auth });
    let fileID = "";
    const fileMetaData = {
        name: fileName,    
        parents: pardentFolder_ids // A folder ID to which file will get uploaded
    }
    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath),
    };
    

    try {
        
    } catch (error) {
        console.log("File Upload : ", error);
        res.status(500).send('Error uploading file');
    }
    //upload file to gdrive
    const create_file = await drive.files.create(
      {
        requestBody : fileMetaData,
        media: media,
        fields: 'id,webViewLink,webContentLink',
      }

    );
    if(create_file) {
        fileID = create_file.data.id as string;
        //change permission to anyone..
       await drive.permissions.create({
            fileId: fileID,
            requestBody: {
                role : 'reader',
                type: 'anyone',
            },
        });

        if (fs.existsSync(filePath)) {
            console.log('File path exists');
              fs.unlink(filePath, (err) => {
                if (err) throw err;
                console.log("File Deleted!");
              });
          }

    }   
    
  
    return fileID

  }


  const deleteFile = async (fileID:string) =>{
    let del_sucsess = false;
    try {
        const auth = await authorize();
        const drive = google.drive({ version: 'v3', auth });
        if(auth) {
            await drive.files.delete({fileId : fileID}) 
            del_sucsess = true
        }

    } catch (error) {
        del_sucsess = false
        console.log("DELETE FILE : ", error)
    }

    return del_sucsess;
  }


  export {authorize, uploadFile, deleteFile}
