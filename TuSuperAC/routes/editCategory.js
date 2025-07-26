let express = require('express');
let router = express.Router();
const {  requireAdmin } = require('../middleware/auth');

let editCategoryController = require('../controllers/editCategoryController')

//Aquí las rutas
router.get('/', requireAdmin,editCategoryController.index);         // Obtener todos los categorias
module.exports = router;