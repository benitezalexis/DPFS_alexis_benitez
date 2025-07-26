let express = require('express');

let router = express.Router();
let editProdutController = {
 // GET /
  index: (req, res) => {    
    res.render('products/editProduct', { error: null });
  },

}


module.exports = editProdutController