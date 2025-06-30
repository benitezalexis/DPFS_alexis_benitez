const CARRITO_KEY = 'carrito';

/**
 * Agrega un producto al carrito
 * @param {Object} producto - Debe contener: nombre_producto, codigo, cantidad, precio_unit, tipo
 * @returns {boolean} - true si se agregó o actualizó correctamente
 */
function agregarProducto(producto) {
  if (!producto || !producto.codigo || !producto.cantidad) return false;

  let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');

  const index = carrito.findIndex(p => p.codigo === producto.codigo);

  if (index !== -1) {
    carrito[index].cantidad += producto.cantidad;
  } else {
    // Asignar orden según longitud actual
    producto.orden = carrito.length + 1;
    carrito.push(producto);
  }

  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  return true;
}

/**
 * Quita cantidad de un producto del carrito
 * @param {Object} producto - Debe contener: codigo y cantidad a restar
 * @returns {boolean} - false si no existe, true si se actualiza o elimina
 */
function quitarProducto(producto) {
  if (!producto || !producto.codigo || !producto.cantidad) return false;

  let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');

  const index = carrito.findIndex(p => p.codigo === producto.codigo);

  if (index === -1) return false;

  carrito[index].cantidad -= producto.cantidad;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  return true;
}

/**
 * Devuelve el carrito actual
 * @returns {Array|false} - El array del carrito o false si no existe
 */
function mostrarCarrito() {
  const data = localStorage.getItem(CARRITO_KEY);
  if (!data) return false;

  const carrito = JSON.parse(data);
  return Array.isArray(carrito) ? carrito : false;
}
