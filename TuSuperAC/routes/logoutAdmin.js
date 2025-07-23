let express = require('express');
let router = express.Router();

let logoutAdminController = require('../controllers/logoutAdminController')

//Aquí las rutas
router.get('/', logoutAdminController.index);


module.exports = router;