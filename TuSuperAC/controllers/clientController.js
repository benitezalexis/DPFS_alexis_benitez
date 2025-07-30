const db = require('../models');
const { validationResult } = require('express-validator');

const Cliente = db.clientes;
const bcrypt = require('bcryptjs');

let clientController = {
  index: function (req, res) {
    let movieList = ['Rocky', 'Batman', 'Barbie', 'Iron Man'];
    return res.render('users/clientRegister', { title: 'Movies', listaPelis: movieList });
  },
  show: function (req, res) {
    //  return res.send(`Estamos en el detalle de la película: ${req.params.id}`)
  },
  // POST /clientes
  store: async (req, res) => {
    try {
/*      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }*/

      const { nombre, email, celular, ruc_ci, password, direccion } = req.body;

      // Validaciones mínimas (podés extenderlo)
      if (!nombre || !email || !ruc_ci || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      // Verificar si ya existe
      const existe = await Cliente.findOne({ where: { ruc_ci } });
      if (existe) {
        return res.status(409).json({ error: 'Cliente ya registrado' });
      }

      // Hashear contraseña
      const passwordHash = bcrypt.hashSync(password, 10);
      let cod_cliente = ruc_ci;
      const nuevoCliente = await Cliente.create({
        cod_cliente,
        nombre,
        email,
        celular,
        ruc_ci,
        password: passwordHash,
        direccion,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      });

      res.status(201).json({ mensaje: 'Cliente creado exitosamente', cliente: nuevoCliente });

    } catch (error) {
      console.error('Error al crear cliente:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
  search: function (req, res) {
    //  let seachTerm = req.query.search;// El seach es el name del input en el formulario
    //  return res.render('searchResults',{title:"Resultados de búsqueda",seachTerm:seachTerm})
  }
}


module.exports = clientController