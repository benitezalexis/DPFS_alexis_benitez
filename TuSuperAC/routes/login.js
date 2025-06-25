let express = require('express');
let router = express.Router();

let loginController = require('../controllers/loginController')

//Aquí las rutas
router.get('/', loginController.index);
router.get('/id/:id', loginController.show);
router.get('/productnew', loginController.create);
router.post('/create', loginController.store);
router.get('/results',loginController.search);


module.exports = router;