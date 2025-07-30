let express = require('express');
let router = express.Router();

let categoryController = require('../controllers/categoryCardController')

//Aquí las rutas
router.get('/', categoryController.index);            // Obtener todos los categorias

module.exports = router;