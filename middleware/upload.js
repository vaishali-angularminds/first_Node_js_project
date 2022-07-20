const multer = require('multer')

const storage = multer.diskStorage({
    
    destination: (req,res,cb) => {
        cb(null, "src/images");
    },
     filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
    }
)
const upload = multer({ 
    storage: storage ,
});
console.log(upload)

module.exports = upload