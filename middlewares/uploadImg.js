// Upload Foto
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD,
  api_key: process.env.KEY,
  api_secret: process.env.SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Immagini Prodotti',
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

//   Export

module.exports = upload;
