const express = require('express');
const router = express.Router();

const registerController = require('../controllers/ClientController');
const validateCliente = require('../validator/validateClient');

// Rutas
router.get('/', registerController.index);
router.post('/create', validateCliente, registerController.store);
router.get('/id/:id', registerController.show);
// Otras rutas comentadas...

module.exports = router;
