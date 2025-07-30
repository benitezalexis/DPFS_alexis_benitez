const bcrypt = require('bcryptjs');
const db = require('../models');
const Cliente = db.clientes; // nombre del modelo según tu configuración

let loginController = {
  formLogin: function (req, res) {
    res.render('users/loginClient', { error: null });
  },

  login: async function (req, res) {
    const { email, password } = req.body;

    try {
      const cliente = await Cliente.findOne({ where: { email } });

      if (!cliente) {
        return res.render('users/loginClient', { error: 'Usuario no encontrado' });
      }

      const match = bcrypt.compareSync(password, cliente.password);
      if (!match) {
        return res.render('users/loginClient', { error: 'Contraseña incorrecta' });
      }

      req.session.usuario = {
        nombre: cliente.nombre,
        direccion: cliente.direccion,
        ruc_ci: cliente.ruc_ci,
        email: cliente.email,
        celular: cliente.celular,
        logo: cliente.logo,
      };

      res.redirect('/');

    } catch (error) {
      console.error(error);
      res.render('users/loginClient', { error: 'Error interno, intenta nuevamente.' });
    }
  }
};

module.exports = loginController;
