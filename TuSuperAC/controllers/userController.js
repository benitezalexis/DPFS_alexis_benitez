const db = require('../models');
const Usuario = db.usuarios;

const usuariosController = {
  // GET /usuarios
  index: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // GET /usuarios/:ruc_ci
  show: async (req, res) => {
    try {
      const { ruc_ci } = req.params;
      const usuario = await Usuario.findOne({ where: { ruc_ci } });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(usuario);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // GET /usuarios/paginados?page=1
getPaginated: async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // CAMBIO AQUÍ
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Usuario.findAndCountAll({
      limit,
      offset,
      order: [['nombre', 'ASC']],
    });

    res.json({
      totalRegistros: count,
      totalPaginas: Math.ceil(count / limit),
      paginaActual: page,
      usuarios: rows
    });

  } catch (error) {
    console.error('Error al paginar usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

};

module.exports = usuariosController;
