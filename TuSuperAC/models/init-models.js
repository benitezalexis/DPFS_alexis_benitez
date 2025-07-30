var DataTypes = require("sequelize").DataTypes;
var _categorias = require("./categorias");
var _clientes = require("./clientes");
var _precio_cab = require("./precio_cab");
var _precio_det = require("./precio_det");
var _productos = require("./productos");
var _subcategorias = require("./subcategorias");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var categorias = _categorias(sequelize, DataTypes);
  var clientes = _clientes(sequelize, DataTypes);
  var precio_cab = _precio_cab(sequelize, DataTypes);
  var precio_det = _precio_det(sequelize, DataTypes);
  var productos = _productos(sequelize, DataTypes);
  var subcategorias = _subcategorias(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  productos.belongsTo(categorias, { as: "codCategoria_categoria", foreignKey: "codCategoria"});
  categorias.hasMany(productos, { as: "productos", foreignKey: "codCategoria"});
  subcategorias.belongsTo(categorias, { as: "codCategoria_categoria", foreignKey: "codCategoria"});
  categorias.hasMany(subcategorias, { as: "subcategoria", foreignKey: "codCategoria"});
  precio_det.belongsTo(precio_cab, { as: "precioCab_precio_cab", foreignKey: "precioCab"});
  precio_cab.hasMany(precio_det, { as: "precio_dets", foreignKey: "precioCab"});
  productos.belongsTo(subcategorias, { as: "codSubCategoria_subcategoria", foreignKey: "codSubCategoria"});
  subcategorias.hasMany(productos, { as: "productos", foreignKey: "codSubCategoria"});

  return {
    categorias,
    clientes,
    precio_cab,
    precio_det,
    productos,
    subcategorias,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
