const bcrypt = require('bcryptjs');
const db = require('../models');

// Corregido: los modelos deben coincidir con los nombres exportados por Sequelize
const Usuario = db.usuarios;
const Cliente = db.clientes;

const profileController = {
  // Mostrar perfil
  index: async (req, res) => {
    try {
      let tipo = null;
      let idUsuario = null;
      let usuarioD = null;

      if (req.session.usuario) {
        tipo = 'cliente';
        idUsuario = req.session.usuario.ruc_ci;
        usuarioD = await Cliente.findOne({ where: { ruc_ci: idUsuario } });
      } else if (req.session.admin) {
        tipo = 'usuario';
        idUsuario = req.session.admin.ruc_ci;
        usuarioD = await Usuario.findOne({ where: { ruc_ci: idUsuario } });
      } else {
        return res.redirect('/');
      }

      if (!usuarioD) {
        return res.status(404).render('users/profile', { error: 'Usuario no encontrado' });
      }

      res.render('users/profile', {
        error: null,
        usuarioD: usuarioD.dataValues,
        tipo
      });

    } catch (error) {
      console.error('Error en index:', error);
      res.status(500).render('users/profile', { error: 'Error interno del servidor' });
    }
  },

  // Actualizar perfil
  uploadLogo: async (req, res) => {
    try {
      const { nombre, ruc_ci, celular, email, passActual, passNew } = req.body;

      let tipo = null;
      let idUsuario = null;
      let usuarioD = null;

      if (req.session.usuario) {
        tipo = 'cliente';
        idUsuario = req.session.usuario.ruc_ci;
        usuarioD = await Cliente.findOne({ where: { ruc_ci: idUsuario } });
      } else if (req.session.admin) {
        tipo = 'usuario';
        idUsuario = req.session.admin.ruc_ci;
        usuarioD = await Usuario.findOne({ where: { ruc_ci: idUsuario } });
      } else {
        return res.status(403).json({ error: 'No autorizado.' });
      }

      if (!usuarioD) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      if (nombre) usuarioD.nombre = nombre;
      if (ruc_ci) usuarioD.ruc_ci = ruc_ci; // ⚠️ Ten cuidado si este campo es clave primaria
      if (celular) usuarioD.celular = celular;
      if (email) usuarioD.email = email;

      if (passActual && passNew) {
        const coincide = bcrypt.compareSync(passActual, usuarioD.password);
        if (!coincide) {
          return res.status(400).json({ error: 'La contraseña actual no es correcta.' });
        }
        usuarioD.password = bcrypt.hashSync(passNew, 10);
      }

      if (req.file) {
        const carpeta = tipo === 'cliente' ? 'clientesLogos' : 'usuariosLogos';
        usuarioD.logo = `/images/${carpeta}/${req.file.filename}`;
      }

      usuarioD.fecha_modificacion = new Date();

      await usuarioD.save();

      if (tipo === 'cliente') {
        req.session.usuario = usuarioD.dataValues;
      } else {
        req.session.admin = usuarioD.dataValues;
      }

      req.session.save(err => {
        if (err) {
          console.error('Error al guardar sesión:', err);
          return res.status(500).json({ error: 'Error al guardar sesión' });
        }

        res.json({
          message: 'Perfil actualizado correctamente.',
          logo: usuarioD.logo || null
        });
      });

    } catch (error) {
      console.error('Error en uploadLogo:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
};

module.exports = profileController;
