const express = require('express');
const router = express.Router();
const validarProducto = require('../validator/productsValidator');
const validarErrores = require('../validator/validarErrores');


const productController = require('../controllers/productController');

// Rutas RESTful
router.get('/', productController.index);            // Obtener todos los productos
router.post('/create',validarProducto, validarErrores, productController.store);     // Crear nuevo producto
router.get('/id/:id', productController.show);        // Obtener un producto por ID
router.get('/search', productController.showByDescription);// Obtener un producto por descripción
router.put('/id/:id', productController.update);      // Actualizar un producto por ID
router.delete('/id/:id', productController.destroy);  // Eliminar un producto por ID
router.get('/paginados/:page', productController.getPaginated);

// 🚀 Nuevas rutas
router.get('/categoriasConSubcategorias', productController.getCategoriasConSubcategorias);
router.get('/productosFiltrados', productController.getProductosFiltrados);
module.exports = router;
