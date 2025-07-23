
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/categorias.json');

// Función para leer el archivo
const readData = () => {
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData);
};

// Función para guardar datos
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};


let categoriaController = {
 // GET /
  index: (req, res) => {
    const categorias = readData();
    res.json(categorias);
  },

  // GET /id/:id
  show: (req, res) => {
    const id = parseInt(req.params.id);
    const categorias = readData();
    const categoria = categorias.find(p => p.id == id);

    if (!categoria) {
      return res.status(404).json({ error: 'categoria no encontrado' });
    }

    res.json(categoria);
  },

  // POST /create
  store: (req, res) => {
    const categorias = readData();
    const nuevoId = categorias.length > 0 ? categorias[categorias.length - 1].id + 1 : 1;

    const nuevo = {
      id: nuevoId,
      ...req.body
    };

    categorias.push(nuevo);
    writeData(categorias);
    res.status(201).json(nuevo);
  },

  // PUT /id/:id
  update: (req, res) => {
    const id = parseInt(req.params.id);
    const categorias = readData();
    const index = categorias.findIndex(p => p.id == id);

    if (index === -1) {
      return res.status(404).json({ error: 'categoria no encontrado' });
    }

    categorias[index] = { ...categorias[index], ...req.body };
    writeData(categorias);
    res.json(categorias[index]);
  },

  // DELETE /id/:id
  destroy: (req, res) => {
    const id = parseInt(req.params.id);
    let categorias = readData();
    const index = categorias.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'categoria no encontrado' });
    }

    const eliminado = categorias.splice(index, 1)[0];
    writeData(categorias);
    res.json({ mensaje: 'categoria eliminado', categoria: eliminado });
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
      p.id?.toString().toLowerCase().includes(termino)
    )
    .slice(0, 10); // Limita a máximo 10 resultados

  if (resultados.length === 0) {
    return res.status(404).json({ mensaje: 'No se encontraron productos' });
  }

  res.json(resultados);
}
  ,

}


module.exports = categoriaController