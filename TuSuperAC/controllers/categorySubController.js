
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/subCategorias.json');
const categorias = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categorias.json'), 'utf-8'));

// Función para leer el archivo
const readData = () => {
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData);
};

// Función para guardar datos
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};


let subCategoriaController = {
 // GET /
index: (req, res) => {
  const productos = readData();

  const productosConCategorias = productos.map(producto => {
    const categoria = categorias.find(c => c.id === producto.codCategoria);

    return {
      ...producto,
      descripcionCategoria: categoria ? categoria.descripcion : null,
  
    };
  });

  res.json(productosConCategorias);
},


  // GET /id/:id
show: (req, res) => {
  const id = parseInt(req.params.id);
  const productos = readData();
  const producto = productos.find(p => p.id == id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const categoria = categorias.find(c => c.id === producto.codCategoria);
  
  res.json({
    ...producto,
    descripcionCategoria: categoria ? categoria.descripcion : null,
  });
},


  // POST /create
  store: (req, res) => {
    const subCategorias = readData();
    const nuevoId = subCategorias.length > 0 ? subCategorias[subCategorias.length - 1].id + 1 : 1;

    const nuevo = {
      id: nuevoId,
      ...req.body
    };

    subCategorias.push(nuevo);
    writeData(subCategorias);
    res.status(201).json(nuevo);
  },

  // PUT /id/:id
  update: (req, res) => {
    const id = parseInt(req.params.id);
    const subCategorias = readData();
    const index = subCategorias.findIndex(p => p.id == id);

    if (index === -1) {
      return res.status(404).json({ error: 'categoria no encontrado' });
    }

    subCategorias[index] = { ...subCategorias[index], ...req.body };
    writeData(subCategorias);
    res.json(subCategorias[index]);
  },

  // DELETE /id/:id
  destroy: (req, res) => {
    const id = parseInt(req.params.id);
    let subCategorias = readData();
    const index = subCategorias.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'categoria no encontrado' });
    }

    const eliminado = subCategorias.splice(index, 1)[0];
    writeData(subCategorias);
    res.json({ mensaje: 'categoria eliminado', categoria: eliminado });
  },
  
// GET /search?busqueda=arroz
showByDescription: (req, res) => {
  const { busqueda } = req.query;

  if (!busqueda) {
    return res.status(400).json({ error: 'Falta el parámetro "busqueda"' });
  }

  const subCategorias = readData(); // Array de subcategorías
  const termino = busqueda.toLowerCase();

  // Filtrar subcategorías
  const resultados = subCategorias
    .filter(p =>
      p.descripcion?.toLowerCase().includes(termino) ||
      p.id?.toString().toLowerCase().includes(termino)
    )
    .slice(0, 10) // Limitar a 10 resultados
    .map(p => {
      const categoria = categorias.find(c => c.id === p.codCategoria);
      return {
        ...p,
        descripcionCategoria: categoria ? categoria.descripcion : null
      };
    });

  if (resultados.length === 0) {
    return res.status(404).json({ mensaje: 'No se encontraron subcategorías' });
  }

  res.json(resultados);
}

  ,

}


module.exports = subCategoriaController