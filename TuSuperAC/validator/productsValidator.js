const { body } = require('express-validator');

const validarProducto = [
  body('codigo')
    .notEmpty().withMessage('El código es obligatorio'),

  body('codCategoria')
    .isInt().withMessage('La categoría debe ser un número entero'),

  body('codSubCategoria')
    .isInt().withMessage('La subcategoría debe ser un número entero'),

  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria'),

  body('tipo')
    .isIn(['Unid', 'unid', 'kl']).withMessage('Tipo inválido'),

  body('visible')
    .isBoolean().withMessage('Visible debe ser true o false'),

  body('precio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0')
];

module.exports = validarProducto;
