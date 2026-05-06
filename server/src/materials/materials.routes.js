const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getMaterials, getMaterialById, uploadMaterial, updateMaterial, deleteMaterial, downloadCourse } = require('./materials.controller');
const { protect, adminOnly } = require('../middleware/auth');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
      // Ensure the uploads directory exists
      if (!fs.existsSync('uploads/')){
          fs.mkdirSync('uploads/');
      }
      cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) { 
      // Generate a collision-resistant native filename string
      cb(null, Date.now() + '-' + file.originalname.replace(/\\|\\s+/g, "_")) 
  }
});
const upload = multer({ storage: storage });

router.get('/course/:courseId', protect, getMaterials);
router.get('/download-course/:courseId', protect, downloadCourse);
router.get('/:id', protect, getMaterialById);
router.put('/:id', protect, adminOnly, updateMaterial);
router.delete('/:id', protect, adminOnly, deleteMaterial);
// Only administrators can mutate University file repositories!
router.post('/upload', protect, adminOnly, upload.single('file'), uploadMaterial);

module.exports = router;
