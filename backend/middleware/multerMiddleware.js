const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error("Invalid mime-type");
    if (isValid) {
      err = null;
    }
    cb(err, "backend/images");
  },
  filename: (req, file, cb) => {
    const mime = MIME_TYPE_MAP[file.mimetype];
    const name = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, name + '-' + Date.now() + '.' + mime);
  }
});

module.exports = multer({storage: multerStorage}).single("image");
