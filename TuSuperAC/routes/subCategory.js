const express = require('express');
const router = express.Router();

const subControllerController = require('../controllers/categorySubController');

// Rutas RESTful
router.get('/', subControllerController.index);            // Obtener todos los subControlleros
router.post('/create', subControllerController.store);     // Crear nuevo subControllero
router.get('/id/:id', subControllerController.show);        // Obtener un subControllero por ID
router.get('/search', subControllerController.showByDescription);// Obtener un categoria por descripción
router.put('/id/:id', subControllerController.update);      // Actualizar un subControllero por ID
router.delete('/id/:id', subControllerController.destroy);  // Eliminar un producto por ID

module.exports = router;
