const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'log_my_work_DEV',
        resource_type: 'raw',
        format: 'pdf', // Explicitly set format
        allowed_formats: ['pdf'],
        type: 'upload',
        access_mode: 'public', // This should work
        public_id: (req, file) => {
            let name = file.originalname.replace(/\s+/g, '_');
            if (!name.endsWith('.pdf')) {
              name += '.pdf';
            }
            return name;
        },
    },
});

module.exports = {
    cloudinary,
    storage,
};