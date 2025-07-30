var express = require('express');
var router = express.Router();
const { generarCatalogoCompleto, obtenerProductosPorSubcategoria } = require('../utils/utils');

/* GET home page. */
router.get('/', function(req, res) {
const productosPromos = obtenerProductosPorSubcategoria(40); // Cambia el ID según la subcategoría deseada
const productosDestacados = obtenerProductosPorSubcategoria(39); // Cambia el ID según la subcategoría deseada
console.log("la session de usuario es:", req.session.usuario);
console.log("la session de admin es:", req.session.admin);

  res.render('index', {
    title: 'Tu Super Online',
    productosPromos,
    productosDestacados
  });});

module.exports = router;
