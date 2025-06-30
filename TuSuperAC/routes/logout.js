let express = require('express');
let router = express.Router();

let logoutController = require('../controllers/logoutController')

//Aquí las rutas
router.get('/', logoutController.index);


module.exports = router;