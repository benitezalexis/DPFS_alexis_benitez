const db = require('../models');
const SubCategoria = db.subcategorias;
const Categoria = db.categorias;

let subCategoriaController = {
  // GET /
  index: async (req, res) => {
    try {
      const subCategorias = await SubCategoria.findAll();
      // Agregar descripción de categoría
      const categorias = await Categoria.findAll();

      const resultado = subCategorias.map(sc => {
        const cat = categorias.find(c => c.id === sc.codCategoria);
        return {
          ...sc.toJSON(),
          descripcionCategoria: cat ? cat.descripcion : null
        };
      });

      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener subcategorías', detalle: error.message });
    }
  },

  // GET /id/:id
  show: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const subCategoria = await SubCategoria.findByPk(id);
      if (!subCategoria) {
        return res.status(404).json({ error: 'Subcategoría no encontrada' });
      }

      const categoria = await Categoria.findByPk(subCategoria.codCategoria);
      res.json({
        ...subCategoria.toJSON(),
        descripcionCategoria: categoria ? categoria.descripcion : null
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar subcategoría', detalle: error.message });
    }
  },

  // POST /create
  store: async (req, res) => {
    try {
      const nuevaSubCategoria = await SubCategoria.create(req.body);
      res.status(201).json(nuevaSubCategoria);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear subcategoría', detalle: error.message });
    }
  },

  // PUT /id/:id
  update: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const subCategoria = await SubCategoria.findByPk(id);
      if (!subCategoria) {
        return res.status(404).json({ error: 'Subcategoría no encontrada' });
      }

      await subCategoria.update(req.body);
      res.json(subCategoria);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar subcategoría', detalle: error.message });
    }
  },

  // DELETE /id/:id
  destroy: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const subCategoria = await SubCategoria.findByPk(id);
      if (!subCategoria) {
        return res.status(404).json({ error: 'Subcategoría no encontrada' });
      }

      await subCategoria.destroy();
      res.json({ mensaje: 'Subcategoría eliminada', subCategoria });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar subcategoría', detalle: error.message });
    }
  },

  // GET /search?busqueda=algo
  showByDescription: async (req, res) => {
    const { busqueda } = req.query;
    if (!busqueda) {
      return res.status(400).json({ error: 'Falta el parámetro "busqueda"' });
    }

    try {
      const resultados = await SubCategoria.findAll({
        where: db.Sequelize.or(
          db.Sequelize.where(
            db.Sequelize.fn('LOWER', db.Sequelize.col('descripcion')),
            'LIKE',
            `%${busqueda.toLowerCase()}%`
          ),
          db.Sequelize.where(
            db.Sequelize.cast(db.Sequelize.col('id'), 'CHAR'),
            'LIKE',
            `%${busqueda}%`
          )
        ),
        limit: 10
      });

      if (resultados.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron subcategorías' });
      }

      // Agregar descripcionCategoria
      const categorias = await Categoria.findAll();
      const resultadosConCategoria = resultados.map(sc => {
        const cat = categorias.find(c => c.id === sc.codCategoria);
        return {
          ...sc.toJSON(),
          descripcionCategoria: cat ? cat.descripcion : null
        };
      });

      res.json(resultadosConCategoria);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda', detalle: error.message });
    }
  }
};

module.exports = subCategoriaController;
