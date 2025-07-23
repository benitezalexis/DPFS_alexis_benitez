
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/productos.json');
const categorias = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categorias.json'), 'utf-8'));
const subcategorias = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/subcategorias.json'), 'utf-8'));

// Función para leer el archivo
const readData = () => {
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData);
};

// Función para guardar datos
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};


let productoController = {
 // GET /
index: (req, res) => {
  const productos = readData();

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
    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

    const nuevo = {
      id: nuevoId,
      ...req.body
    };

    productos.push(nuevo);
    writeData(productos);
    res.status(201).json(nuevo);
  },

  // PUT /id/:id
  update: (req, res) => {
    const id = parseInt(req.params.id);
    const productos = readData();
    const index = productos.findIndex(p => p.codigo == id);

    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    productos[index] = { ...productos[index], ...req.body };
    writeData(productos);
    res.json(productos[index]);
  },

  // DELETE /id/:id
  destroy: (req, res) => {
    const id = parseInt(req.params.id);
    let productos = readData();
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const eliminado = productos.splice(index, 1)[0];
    writeData(productos);
    res.json({ mensaje: 'Producto eliminado', producto: eliminado });
  },
// GET /search?busqueda=arroz
showByDescription: (req, res) => {
  const { busqueda } = req.query;

  if (!busqueda) {
    return res.status(400).json({ error: 'Falta el parámetro "busqueda"' });
  }

  const productos = readData();
  const termino = busqueda.toLowerCase();

  const resultados = productos
    .filter(p =>
      p.descripcion?.toLowerCase().includes(termino) ||
      p.codigo?.toString().toLowerCase().includes(termino)
    )
    .slice(0, 10); // Limita a máximo 10 resultados

  if (resultados.length === 0) {
    return res.status(404).json({ mensaje: 'No se encontraron productos' });
  }

  res.json(resultados);
}
,

}


module.exports = productoController