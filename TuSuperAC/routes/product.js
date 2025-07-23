const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

// Rutas RESTful
router.get('/', productController.index);            // Obtener todos los productos
router.post('/create', productController.store);     // Crear nuevo producto
router.get('/id/:id', productController.show);        // Obtener un producto por ID
router.get('/search', productController.showByDescription);// Obtener un producto por descripción
router.put('/id/:id', productController.update);      // Actualizar un producto por ID
router.delete('/id/:id', productController.destroy);  // Eliminar un producto por ID

module.exports = router;
