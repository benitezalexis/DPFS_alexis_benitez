const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/productos.json');
const pathCategorias = path.join(__dirname, '../data/categorias.json');
const pathSubcategorias = path.join(__dirname, '../data/subcategorias.json');
const pathPrecios = path.join(__dirname, '../data/precio_det.json');

// Funciones de lectura
const readData = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const readDataCategoria = () => JSON.parse(fs.readFileSync(pathCategorias, 'utf-8'));
const readDataSubCategoria = () => JSON.parse(fs.readFileSync(pathSubcategorias, 'utf-8'));
const readDataPrecio = () => JSON.parse(fs.readFileSync(pathPrecios, 'utf-8'));

// Funciones de escritura
const writeData = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
const writeDataPrecio = (data) => fs.writeFileSync(pathPrecios, JSON.stringify(data, null, 2), 'utf-8');

let productoController = {
  // GET /
  index: (req, res) => {
    const productos = readData();
    const categorias = readDataCategoria();
    const subcategorias = readDataSubCategoria();

    const productosConCategorias = productos.map(producto => {
      const categoria = categorias.find(c => c.id === producto.codCategoria);
      const subcategoria = subcategorias.find(sc => sc.id === producto.codSubCategoria);

      return {
        ...producto,
        descripcionCategoria: categoria ? categoria.descripcion : null,
        descripcionSubCategoria: subcategoria ? subcategoria.descripcion : null,
      };
    });

    res.json(productosConCategorias);
  },

  // GET /id/:id
  show: (req, res) => {
    const id = parseInt(req.params.id);
    const productos = readData();
    const categorias = readDataCategoria();
    const subcategorias = readDataSubCategoria();

    const producto = productos.find(p => p.codigo == id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const categoria = categorias.find(c => c.id === producto.codCategoria);
    const subcategoria = subcategorias.find(sc => sc.id === producto.codSubCategoria);

    res.json({
      ...producto,
      descripcionCategoria: categoria ? categoria.descripcion : null,
      descripcionSubCategoria: subcategoria ? subcategoria.descripcion : null,
    });
  },

  // POST /create
  store: (req, res) => {
    const productos = readData();
    const precios = readDataPrecio();

    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoPrecioId = precios.length > 0 ? precios[precios.length - 1].id + 1 : 1;

    const nuevo = {
      id: nuevoId,
      codigo: req.body.codigo,
    codCategoria:req.body.codCategoria,
    codSubCategoria:req.body.codSubCategoria,
    descripcion:req.body.descripcion,
    tipo:req.body.tipo,
    stock_actual: 100,
    stock_minimo: 10,
    visible:req.body.visible
    };

    const nuevoprecio = {
      id: nuevoPrecioId,
      precioCab: 1,
      codigo: req.body.codigo,
      precio: req.body.precio
    };

    productos.push(nuevo);
    precios.push(nuevoprecio);

    writeData(productos);
    writeDataPrecio(precios);

    res.status(201).json(nuevo);
  },

  // PUT /id/:id
  update: (req, res) => {
    const id = parseInt(req.params.id);
    const productos = readData();
    const precios = readDataPrecio();
    const categorias = readDataCategoria();
    const subcategorias = readDataSubCategoria();

    const indexProducto = productos.findIndex(p => p.id === id);
    if (indexProducto === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const codigoActual = productos[indexProducto].codigo;
    productos[indexProducto] = { ...productos[indexProducto], ...req.body };
    writeData(productos);

    const codigoParaBuscar = req.body.codigo || codigoActual;
    const indexPrecio = precios.findIndex(p => p.codigo == codigoParaBuscar);

    if (indexPrecio !== -1 && req.body.precio !== undefined) {
      precios[indexPrecio].precio = req.body.precio;
      writeDataPrecio(precios);
    }

    const categoria = categorias.find(c => c.id === req.body.codCategoria);
    const subcategoria = subcategorias.find(sc => sc.id === req.body.codSubCategoria);

    const productoConPrecio = {
      ...productos[indexProducto],
      precio: indexPrecio !== -1 ? precios[indexPrecio].precio : null,
      descripcionCategoria: categoria ? categoria.descripcion : null,
      descripcionSubCategoria: subcategoria ? subcategoria.descripcion : null,
    };

    res.json(productoConPrecio);
  },
// DELETE /id/:id
destroy: (req, res) => {
  const id = parseInt(req.params.id);
  let productos = readData();
  let precios = readDataPrecio();

  const indexProducto = productos.findIndex(p => p.id === id);
  if (indexProducto === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  // Eliminar producto
  const eliminado = productos.splice(indexProducto, 1)[0];
  writeData(productos);

  // Eliminar precio relacionado por código
  const indexPrecio = precios.findIndex(p => p.codigo === eliminado.codigo);
  let precioEliminado = null;
  if (indexPrecio !== -1) {
    precioEliminado = precios.splice(indexPrecio, 1)[0];
    writeDataPrecio(precios);
  }

  res.json({
    mensaje: 'Producto eliminado',
    producto: eliminado,
    precioEliminado: precioEliminado || null
  });
},


  // GET /search?busqueda=arroz
  showByDescription: (req, res) => {
    const { busqueda } = req.query;
    if (!busqueda) {
      return res.status(400).json({ error: 'Falta el parámetro "busqueda"' });
    }

    const productos = readData();
    const categorias = readDataCategoria();
    const subcategorias = readDataSubCategoria();
    const precios = readDataPrecio();

    const termino = busqueda.toLowerCase();

    const resultados = productos
      .filter(p =>
        p.descripcion?.toLowerCase().includes(termino) ||
        p.codigo?.toString().toLowerCase().includes(termino)
      )
      .slice(0, 10)
      .map(p => {
        const categoria = categorias.find(c => c.id === p.codCategoria);
        const subcategoria = subcategorias.find(sc => sc.id === p.codSubCategoria);
        const precio = precios.find(pr => pr.codigo === p.codigo);

        return {
          ...p,
          descripcionCategoria: categoria ? categoria.descripcion : null,
          descripcionSubCategoria: subcategoria ? subcategoria.descripcion : null,
          precio: precio ? precio.precio : null
        };
      });

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron productos' });
    }

    res.json(resultados);
  }
};

module.exports = productoController;
