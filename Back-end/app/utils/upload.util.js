const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 100 * 1024 * 1024},
    // fileFilter: (req, file, callback) => {
    //     if(
    //         file.mimetype === "image/png" || 
    //         file.mimetype === "image/jpg"
    //     ) {
    //         callback(null, true);
    //     } else{
    //         console.log("Chi co jpg and png duoc cho phep");
    //         callback(null, false);
    //     }
    // }
});

module.exports = upload;