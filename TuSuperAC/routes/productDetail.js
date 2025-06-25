let express = require('express');
let router = express.Router();

let productDetailController = require('../controllers/ProductDetailController')

//Aquí las rutas
router.get('/', productDetailController.index);
router.get('/cod/:cod', productDetailController.show);
router.get('/productnew', productDetailController.create);
router.post('/create', productDetailController.store);
router.get('/results',productDetailController.search);


module.exports = router;