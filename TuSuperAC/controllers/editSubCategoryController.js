let express = require('express');

let router = express.Router();
let editSubCategoryController = {
 // GET /
  index: (req, res) => {    
    res.render('products/editSubCategory', { error: null });
  },

}


module.exports = editSubCategoryController