let express = require('express');
let router = express.Router();

let loginClientController = require('../controllers/loginClientController')

//Aquí las rutas
router.get('/', loginClientController.formLogin);
router.post('/', loginClientController.login);
module.exports = router;