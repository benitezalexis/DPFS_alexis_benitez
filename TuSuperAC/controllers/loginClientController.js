

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const CLIENTES_PATH = path.join(__dirname, '../data/clientes.json');

let loginController = {
  formLogin: function (req, res) {
    res.render('users/loginClient', { error: null });
  },

  login: function (req, res) {


    const { email, password } = req.body;
    const clientes = JSON.parse(fs.readFileSync(CLIENTES_PATH, 'utf-8'));
    const cliente = clientes.find(c => c.email === email);

    if (!cliente) {
      return res.render('users/loginClient', { error: 'Usuario no encontrado' });
    }

    const match = bcrypt.compareSync(password, cliente.password);
 
    if (!match) {
      return res.render('users/loginClient', { error: 'Contraseña incorrecta' });
    }
    // Guardar datos útiles en la sesión
    req.session.usuario = {
      cod_cliente: cliente.cod_cliente,
      nombre: cliente.nombre_cliente,
      email: cliente.email
    };

    res.redirect('/');

  }

}


module.exports = loginController