const { body } = require('express-validator');
const Cliente = require('../models').Cliente; // Ajusta si la ruta es distinta

module.exports = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('Debe tener al menos 2 caracteres'),

  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .custom(async (value) => {
      const existing = await Cliente.findOne({ where: { email: value } });
      if (existing) {
        throw new Error('El email ya está registrado');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('Debe tener al menos 8 caracteres')
    .matches(/[a-z]/).withMessage('Debe contener una letra minúscula')
    .matches(/[A-Z]/).withMessage('Debe contener una letra mayúscula')
    .matches(/\d/).withMessage('Debe contener un número')
    .matches(/[^A-Za-z0-9]/).withMessage('Debe contener un carácter especial'),
];
