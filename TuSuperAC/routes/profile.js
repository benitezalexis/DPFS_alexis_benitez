const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../middleware/upload'); // <- el archivo de arriba

router.get('/', profileController.index);

// Middleware `upload.single('logo')` para manejar la subida
router.post('/upload', upload.single('logo'), profileController.uploadLogo);

module.exports = router;
