const bcrypt = require('bcryptjs');
const db = require('../models');
const Usuario = db.usuarios; // o el nombre exacto que exporta tu modelo de usuarios

let loginController = {
  formLogin: function (req, res) {
    res.render('users/loginAdmin', { error: null });
  },

  index: async function (req, res) {
    const { email, password } = req.body;

    try {
      const admin = await Usuario.findOne({ where: { email } });

      if (!admin) {
        return res.render('users/loginAdmin', { error: 'Usuario o contraseña inválidos' });
      }

      const passwordCorrecta = bcrypt.compareSync(password, admin.password);

      if (!passwordCorrecta) {
        return res.render('users/loginAdmin', { error: 'Usuario o contraseña inválidos' });
      }

      req.session.admin = {
        nombre: admin.nombre,
        tipo: admin.tipo,
        email: admin.email,
        direccion: admin.direccion,
        ruc_ci: admin.ruc_ci,
        celular: admin.celular,
        logo: admin.logo,
      };

      res.redirect('/'); // o la ruta de tu panel admin

    } catch (error) {
      console.error(error);
      res.render('users/loginAdmin', { error: 'Error interno, intenta nuevamente.' });
    }
  }
};

module.exports = loginController;
