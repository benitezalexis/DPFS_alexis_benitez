let express = require('express');

let router = express.Router();
let editCategoryController = {
 // GET /
  index: (req, res) => {    
    res.render('products/editCategory', { error: null });
  },

}


module.exports = editCategoryController