const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Rutas RESTful
router.get('/', userController.index);            // Obtener todos los usuario
router.get('/ruc_ci/:ruc_ci', userController.show);        // Obtener un usuario por ID
router.get('/paginados/:page', userController.getPaginated);        // Obtener un usuario por ID
module.exports = router;
