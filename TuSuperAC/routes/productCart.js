let express = require('express');
let router = express.Router();

let productCartController = require('../controllers/productCartController')

//Aquí las rutas
router.get('/', productCartController.index);
router.get('/cod/:cod', productCartController.show);
router.get('/productnew', productCartController.create);
router.post('/create', productCartController.store);
router.get('/results',productCartController.search);


module.exports = router;