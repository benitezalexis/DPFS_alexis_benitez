const CARRITO_KEY = 'carrito';

/**
 * Formatea número a string con 3 decimales exactos (ej: "0.100")
 * @param {number} num
 * @returns {string}
 */
function formatearCantidad(num) {
  return parseFloat(num).toFixed(3);
}

/**
 * Agrega un producto al carrito
 * @param {Object} producto - Debe contener: codigo, descripcion, cantidad, precio, tipo
 * @returns {boolean}
 */
function agregarProducto(producto) {
  if (!producto || !producto.codigo || !producto.cantidad) return false;

  let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');

  const index = carrito.findIndex(p => p.codigo === producto.codigo);

  if (index !== -1) {
    // Sumar cantidad actual + nueva, y formatear como string con 3 decimales
    const cantidadActual = parseFloat(carrito[index].cantidad);
    const cantidadNueva = parseFloat(producto.cantidad);
    carrito[index].cantidad = formatearCantidad(cantidadActual + cantidadNueva);
  } else {
    // Asignar orden según longitud actual
    producto.orden = carrito.length + 1;
    producto.cantidad = formatearCantidad(producto.cantidad); // ← aquí la cantidad entra ya como string
    carrito.push(producto);
  }

  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  return true;
}

/**
 * Quita cantidad de un producto del carrito
 * @param {Object} producto - Debe contener: codigo y cantidad a restar
 * @returns {boolean}
 */
function quitarProducto(producto) {
  if (!producto || !producto.codigo || !producto.cantidad) return false;

  let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');

  const index = carrito.findIndex(p => p.codigo === producto.codigo);
  if (index === -1) return false;

  const cantidadActual = parseFloat(carrito[index].cantidad);
  const cantidadARestar = parseFloat(producto.cantidad);
  const nuevaCantidad = cantidadActual - cantidadARestar;

  if (nuevaCantidad <= 0) {
    carrito.splice(index, 1); // eliminar producto del carrito
  } else {
    carrito[index].cantidad = formatearCantidad(nuevaCantidad);
  }

  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  return true;
}

/**
 * Devuelve el carrito actual desde localStorage
 * @returns {Array|false}
 */
function mostrarCarrito() {
  const data = localStorage.getItem(CARRITO_KEY);
  if (!data) return false;

  const carrito = JSON.parse(data);
  return Array.isArray(carrito) ? carrito : false;
}
