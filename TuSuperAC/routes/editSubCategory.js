let express = require('express');
let router = express.Router();
const {  requireAdmin } = require('../middleware/auth');

let editSubCategoryController = require('../controllers/editSubCategoryController')

//Aquí las rutas
router.get('/',requireAdmin, editSubCategoryController.index);          // Obtener todos los subcategorias
module.exports = router;