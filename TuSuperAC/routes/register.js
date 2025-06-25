let express = require('express');
let router = express.Router();

let registerController = require('../controllers/registerController')

//Aquí las rutas
router.get('/', registerController.index);
router.get('/id/:id', registerController.show);
router.get('/productnew', registerController.create);
router.post('/create', registerController.store);
router.get('/results',registerController.search);


module.exports = router;