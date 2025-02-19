


import multer from 'multer';

// Set up multer for file upload
export const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!') as any, false);
    }
  },
  limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1 MB
});
