const db = require('../models');
const Producto = db.productos;
const Categoria = db.categorias;
const SubCategoria = db.subcategorias;
const PrecioDeb = db.precio_det;

let productoController = {
  // GET /
  index: async (req, res) => {
    try {
      const productos = await Producto.findAll();
      const categorias = await Categoria.findAll();
      const subcategorias = await SubCategoria.findAll();
      const precios = await PrecioDeb.findAll();

      const productosConDatos = productos.map(p => {
        const categoria = categorias.find(c => c.id === p.codCategoria);
        const subcategoria = subcategorias.find(sc => sc.id === p.codSubCategoria);
        const precio = precios.find(pr => pr.codigo === p.codigo);

        return {
          ...p.toJSON(),
          descripcionCategoria: categoria ? categoria.descripcion : null,
          descripcionSubCategoria: subcategoria ? subcategoria.descripcion : null,
          precio: precio ? precio.precio : null
        };
      });

      res.json(productosConDatos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos', detalle: error.message });
    }
  },

  // GET /id/:id
  show: async (req, res) => {
    const id = req.params.id; // Aquí parece que usas código para buscar
    try {
      const producto = await Producto.findOne({ where: { codigo: id } });
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const categoria = await Categoria.findByPk(producto.codCategoria);
      const subcategoria = await SubCategoria.findByPk(producto.codSubCategoria);
      const precio = await PrecioDeb.findOne({ where: { codigo: producto.codigo } });

      res.json({
        ...producto.toJSON(),
        descripcionCategoria: categoria ? categoria.descripcion : null,
        descripcionSubCategoria: subcategoria ? subcategoria.descripcion : null,
        precio: precio ? precio.precio : null
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar producto', detalle: error.message });
    }
  },
   // GET /productos/paginados/1
getPaginated: async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // ✅ CAMBIO: ahora lee desde req.params
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Producto.findAndCountAll({
      limit,
      offset,
      order: [['descripcion', 'ASC']], // Cambiá 'nombre' por otro campo si es necesario
    });

    res.json({
      totalRegistros: count,
      totalPaginas: Math.ceil(count / limit),
      paginaActual: page,
      productos: rows
    });

  } catch (error) {
    console.error('Error al paginar productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

  ,

  // POST /create
  store: async (req, res) => {
    try {
      const {
        codigo,
        codCategoria,
        codSubCategoria,
        descripcion,
        tipo,
        visible,
        precio
      } = req.body;

      // Crear producto con valores iniciales para stock_actual y stock_minimo
      const nuevoProducto = await Producto.create({
        codigo,
        codCategoria,
        codSubCategoria,
        descripcion,
        tipo,
        stock_actual: 100,
        stock_minimo: 10,
        visible
      });

      // Crear precio relacionado
      const nuevoPrecio = await PrecioDeb.create({
        precioCab: 1,  // si es fijo o modificar según corresponda
        codigo,
        precio
      });

      res.status(201).json(nuevoProducto);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear producto', detalle: error.message });
    }
  },

  // PUT /id/:id
  update: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await producto.update(req.body);

      // Actualizar precio si viene en body
      if (req.body.precio !== undefined) {
        const precio = await PrecioDeb.findOne({ where: { codigo: req.body.codigo || producto.codigo } });
        if (precio) {
          await precio.update({ precio: req.body.precio });
        } else {
          // Si no existe precio, crear uno nuevo
          await PrecioDeb.create({
            precioCab: 1,
            codigo: req.body.codigo || producto.codigo,
            precio: req.body.precio
          });
        }
      }

      const categoria = await Categoria.findByPk(producto.codCategoria);
      const subcategoria = await SubCategoria.findByPk(producto.codSubCategoria);
      const precio = await PrecioDeb.findOne({ where: { codigo: producto.codigo } });

      res.json({
        ...producto.toJSON(),
        precio: precio ? precio.precio : null,
        descripcionCategoria: categoria ? categoria.descripcion : null,
        descripcionSubCategoria: subcategoria ? subcategoria.descripcion : null,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar producto', detalle: error.message });
    }
  },

  // DELETE /id/:id
  destroy: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Borrar precio relacionado
      const precio = await PrecioDeb.findOne({ where: { codigo: producto.codigo } });
      if (precio) {
        await precio.destroy();
      }

      await producto.destroy();

      res.json({
        mensaje: 'Producto eliminado',
        producto: producto.toJSON(),
        precioEliminado: precio ? precio.toJSON() : null
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar producto', detalle: error.message });
    }
  },

  // GET /search?busqueda=arroz
  showByDescription: async (req, res) => {
    const { busqueda } = req.query;
    if (!busqueda) {
      return res.status(400).json({ error: 'Falta el parámetro "busqueda"' });
    }

    try {
      const productos = await Producto.findAll({
        where: db.Sequelize.or(
          db.Sequelize.where(
            db.Sequelize.fn('LOWER', db.Sequelize.col('descripcion')),
            'LIKE',
            `%${busqueda.toLowerCase()}%`
          ),
          db.Sequelize.where(
            db.Sequelize.cast(db.Sequelize.col('codigo'), 'CHAR'),
            'LIKE',
            `%${busqueda}%`
          )
        ),
        limit: 10
      });

      if (productos.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron productos' });
      }

      const categorias = await Categoria.findAll();
      const subcategorias = await SubCategoria.findAll();
      const precios = await PrecioDeb.findAll();

      const resultados = productos.map(p => {
        const categoria = categorias.find(c => c.id === p.codCategoria);
        const subcategoria = subcategorias.find(sc => sc.id === p.codSubCategoria);
        const precio = precios.find(pr => pr.codigo === p.codigo);

        return {
          ...p.toJSON(),
          descripcionCategoria: categoria ? categoria.descripcion : null,
          descripcionSubCategoria: subcategoria ? subcategoria.descripcion : null,
          precio: precio ? precio.precio : null
        };
      });

      res.json(resultados);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda', detalle: error.message });
    }
  },
  // GET /categorias-con-subcategorias
getCategoriasConSubcategorias: async (req, res) => {
  try {
     // Solo categorías visibles
    const categorias = await Categoria.findAll({
      where: { visible: 1 },
      attributes: ['id', 'descripcion']
    });

    // Solo subcategorías visibles
    const subcategorias = await SubCategoria.findAll({
      where: { visible: 1 },
      attributes: ['id', 'descripcion', 'codCategoria']
    });


    const resultado = categorias.map(cat => {
      const subCats = subcategorias
        .filter(sc => sc.codCategoria === cat.id)
        .map(sc => ({
          id: sc.id,
          descripcion: sc.descripcion
        }));

      return {
        idCategoria: cat.id,
        descripcion: cat.descripcion,
        subCategorias: subCats
      };
    });

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías y subcategorías', detalle: error.message });
  }
}
,
// GET /productos-filtrados?categoria=1&subcategoria=2
getProductosFiltrados: async (req, res) => {
  const { categoria, subcategoria } = req.query;

  try {
    const whereClause = {};
    if (categoria) whereClause.codCategoria = categoria;
    if (subcategoria) whereClause.codSubCategoria = subcategoria;

    const productos = await Producto.findAll({ where: whereClause });

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron productos con esos filtros' });
    }

    const categorias = await Categoria.findAll();
    const subcategorias = await SubCategoria.findAll();
    const precios = await PrecioDeb.findAll();

    const resultados = productos.map(p => {
      const categoria = categorias.find(c => c.id === p.codCategoria);
      const subcategoria = subcategorias.find(sc => sc.id === p.codSubCategoria);
      const precio = precios.find(pr => pr.codigo === p.codigo);

      return {
        ...p.toJSON(),
        descripcionCategoria: categoria ? categoria.descripcion : null,
        descripcionSubCategoria: subcategoria ? subcategoria.descripcion : null,
        precio: precio ? precio.precio : null
      };
    });

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar productos', detalle: error.message });
  }
}

};

module.exports = productoController;
