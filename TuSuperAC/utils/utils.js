const fs = require('fs');
const path = require('path');

// Función para cargar JSON de un archivo
const cargarJson = (archivoRelativo) => {
  const fullPath = path.join(__dirname, archivoRelativo);
  if (!fs.existsSync(fullPath)) return [];
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
};

function generarCatalogoCompleto() {
  const categorias = cargarJson('../data/categorias.json');
  const subCategorias = cargarJson('../data/subCategorias.json');
  const productos = cargarJson('../data/productos.json');
  const precios = cargarJson('../data/precio_det.json');

  const catalogo = categorias.map((cat) => {
    const subCats = subCategorias
      .filter((sub) => sub.codCategoria === cat.id)
      .map((sub) => {
        const prods = productos
          .filter((prod) => prod.codSubCategoria === sub.id)
          .map((prod) => {
            const precio = precios.find((p) => p.codigo === prod.codigo);
            return {
              ...prod,
              precio: precio ? precio.precio : 0,
            };
          });

        return {
          ...sub,
          productos: prods,
        };
      });

    return {
      ...cat,
      subCategorias: subCats,
    };
  });

  return catalogo;
}

function obtenerProductosPorSubcategoria(idSubCategoria) {
  const productos = cargarJson('../data/productos.json');
  const precios = cargarJson('../data/precio_det.json');

  const resultado = productos
    .filter((prod) => prod.codSubCategoria === idSubCategoria)
    .map((prod) => {
      const precio = precios.find((p) => p.codigo === prod.codigo);
      return {
        ...prod,
        precio: precio ? precio.precio : 0,
      };
    });

  return resultado;
}

// ✅ Exportar funciones
module.exports = {
  generarCatalogoCompleto,
  obtenerProductosPorSubcategoria
};
