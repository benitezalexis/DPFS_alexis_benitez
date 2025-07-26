let express = require('express');
let router = express.Router();

let categoryController = require('../controllers/categoryController')

//Aquí las rutas
router.get('/', categoryController.index);            // Obtener todos los categorias
router.post('/create', categoryController.store);     // Crear nuevo categoria
router.get('/id/:id', categoryController.show);        // Obtener un categoria por ID
router.get('/search', categoryController.showByDescription);// Obtener un categoria por descripción
router.put('/id/:id', categoryController.update);      // Actualizar un categoria por ID
router.delete('/id/:id', categoryController.destroy);  // Eliminar un categoria por ID

module.exports = router;