

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USUARIOS_PATH = path.join(__dirname, '../data/usuarios.json');

let loginController = {
  formLogin: function (req, res) {
    res.render('users/loginAdmin', { error: null });
  },
  index: function (req, res) {
   const { email, password } = req.body;
  const usuarios = JSON.parse(fs.readFileSync(USUARIOS_PATH));
  const admin = usuarios.find(u => u.correo === email);

  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.render('loginAdmin', { error: 'Usuario o contraseña inválidos' });
  }

  req.session.admin = {
    id: admin.id,
    nombre: admin.nombre,
    tipo: admin.tipo
  };

     res.redirect('/');// o donde tengas el panel admin

  }

}


module.exports = loginController