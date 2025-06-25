let express = require('express');
let router = express.Router();

let aboutController = require('../controllers/aboutController')

//Aquí las rutas
router.get('/', aboutController.index);
router.get('/id/:id', aboutController.show);
router.get('/productnew', aboutController.create);
router.post('/create', aboutController.store);
router.get('/results',aboutController.search);


module.exports = router;