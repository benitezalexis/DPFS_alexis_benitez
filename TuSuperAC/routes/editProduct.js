let express = require('express');
let router = express.Router();
const {  requireAdmin } = require('../middleware/auth');

let editProductController = require('../controllers/editProductController')

//Aquí las rutas
router.get('/',requireAdmin, editProductController.index);        // Obtener todos los productos
module.exports = router;