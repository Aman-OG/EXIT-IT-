const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getMaterials, getMaterialById, uploadMaterial, updateMaterial, deleteMaterial, downloadCourse, searchMaterials, reorderMaterials } = require('./materials.controller');
const bookmarksCtrl = require('./bookmarks.controller');
const { protect, adminOnly } = require('../middleware/auth');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
      if (!fs.existsSync('uploads/')){ fs.mkdirSync('uploads/'); }
      cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) { 
      cb(null, Date.now() + '-' + file.originalname.replace(/\\|\\s+/g, "_")) 
  }
});
const upload = multer({ storage: storage });

router.get('/search', protect, searchMaterials);
router.get('/course/:courseId', protect, getMaterials);
router.get('/download-course/:courseId', protect, downloadCourse);
router.delete('/bookmarks/:bookmarkId', protect, bookmarksCtrl.deleteBookmark);
router.delete('/highlights/:highlightId', protect, bookmarksCtrl.deleteHighlight);
router.get('/:id/bookmarks', protect, bookmarksCtrl.getBookmarks);
router.post('/:id/bookmarks', protect, bookmarksCtrl.addBookmark);
router.get('/:id/highlights', protect, bookmarksCtrl.getHighlights);
router.post('/:id/highlights', protect, bookmarksCtrl.addHighlight);
router.get('/:id', protect, getMaterialById);
router.patch('/reorder', protect, adminOnly, reorderMaterials);
router.put('/:id', protect, adminOnly, updateMaterial);
router.delete('/:id', protect, adminOnly, deleteMaterial);
router.post('/upload', protect, adminOnly, upload.single('file'), uploadMaterial);

module.exports = router;
