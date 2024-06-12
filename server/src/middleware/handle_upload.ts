
import multer from 'multer';
import path from 'path'

const storage = multer.diskStorage({
    
  
    destination: function (req, file, cb) {
        
        console.log("Req : ", req.body)
        return cb(new Error(path.join(__dirname, "sheesh!")), path.join(__dirname,  `../../client/public/img/user_img/${req.body.user_type}`));
      
    },
    filename: function (req, file, cb) {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        return cb(null, originalName)
     
    },
  
  })

  const upload = multer({ storage: storage })

  export default upload