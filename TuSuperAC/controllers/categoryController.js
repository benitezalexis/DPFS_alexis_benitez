const db = require('../models'); // Asegurate de tener un index.js que exporta los modelos
const Categoria = db.categorias; // Modelo generado por sequelize-auto

let categoriaController = {
  // GET /
  index: async (req, res) => {
    try {
      const categorias = await Categoria.findAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener categorías', detalle: error.message });
    }
  },

  // GET /id/:id
  show: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar categoría', detalle: error.message });
    }
  },

  // POST /create
  store: async (req, res) => {
    try {
      const nueva = await Categoria.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear categoría', detalle: error.message });
    }
  },

  // PUT /id/:id
  update: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      await categoria.update(req.body);
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar categoría', detalle: error.message });
    }
  },

  // DELETE /id/:id
  destroy: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      await categoria.destroy();
      res.json({ mensaje: 'Categoría eliminada', categoria });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar categoría', detalle: error.message });
    }
  },

  // GET /search?busqueda=algo
  showByDescription: async (req, res) => {
    const { busqueda } = req.query;
    if (!busqueda) {
      return res.status(400).json({ error: 'Falta el parámetro "busqueda"' });
    }

    try {
      const resultados = await Categoria.findAll({
        where: db.Sequelize.or(
          db.Sequelize.where(db.Sequelize.fn('LOWER', db.Sequelize.col('descripcion')), 'LIKE', `%${busqueda.toLowerCase()}%`),
          db.Sequelize.where(db.Sequelize.cast(db.Sequelize.col('id'), 'CHAR'), 'LIKE', `%${busqueda}%`)
        ),
        limit: 10
      });

      if (resultados.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron categorías' });
      }

      res.json(resultados);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda', detalle: error.message });
    }
  }
};

module.exports = categoriaController;
