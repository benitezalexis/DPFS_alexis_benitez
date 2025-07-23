let express = require('express');
let router = express.Router();

let categoryController = require('../controllers/categoryController')

//Aquí las rutas
router.get('/', categoryController.index);            // Obtener todos los productos
router.post('/create', categoryController.store);     // Crear nuevo producto
router.get('/id/:id', categoryController.show);        // Obtener un producto por ID
router.put('/id/:id', categoryController.update);      // Actualizar un producto por ID
router.delete('/id/:id', categoryController.destroy);  // Eliminar un producto por ID

module.exports = router;