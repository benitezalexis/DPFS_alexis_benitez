let express = require('express');
let router = express.Router();

let loginAdminController = require('../controllers/loginAdminController')

//Aquí las rutas

router.get('/', loginAdminController.formLogin);
router.post('/', loginAdminController.index);
module.exports = router;