const CARRITO_KEY = 'carrito';
// Formateador reutilizable
const formatter = new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 });
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
function quitarProducto(producto, eliminarItem = false) {
  if (!producto || !producto.codigo || !producto.cantidad) return false;

  const carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
  const index = carrito.findIndex(p => p.codigo === producto.codigo);
  if (index === -1) return false;

  const cantidadActual = parseFloat(carrito[index].cantidad);
  const cantidadARestar = parseFloat(producto.cantidad);
  const nuevaCantidad = cantidadActual - cantidadARestar;

  if (nuevaCantidad <= 0.050 || eliminarItem) {
    carrito.splice(index, 1);
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    return 'ult';
  } else {
    carrito[index].cantidad = nuevaCantidad.toFixed(3);
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    return true;
  }
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



function renderizarCobros() {
  const carrito = mostrarCarrito();
  const subtotalElem = document.querySelector('.subtotal-valor');
  const ivaElem = document.querySelector('.iva-valor');
  const totalElem = document.querySelector('.total-valor');

  const iva10Elem = document.querySelector('.iva10-valor');
  const iva5Elem = document.querySelector('.iva5-valor');
  const exentaElem = document.querySelector('.exenta-valor');
  const gravadaSinIvaElem = document.querySelector('.gravada-siniva-valor');

  let subtotal = 0;
  let ivaTotal = 0;

  let base10 = 0;
  let base5 = 0;
  let baseExenta = 0;

  if (!carrito || carrito.length === 0) {
    const cero = '0 Gs';
    [subtotalElem, ivaElem, totalElem, iva10Elem, iva5Elem, exentaElem, gravadaSinIvaElem].forEach(el => {
      if (el) el.textContent = cero;
    });
    return;
  }

  carrito.forEach(producto => {
    const cantidad = parseFloat(producto.cantidad);
    const precio = parseFloat(producto.precio);
    const ivaPorcentaje = parseFloat(producto.iva || 0);
    const totalProducto = cantidad * precio;
    subtotal += totalProducto;
    console.log(`Producto: ${producto.descripcion}, Cantidad: ${cantidad}, Precio: ${precio}, IVA: ${ivaPorcentaje}, Total: ${totalProducto}`);
    // Clasificar por tipo de IVA
    if (ivaPorcentaje == 10) {
      base10 += totalProducto / 1.10;
    } else if (ivaPorcentaje == 5) {
      base5 += totalProducto / 1.05;
    } else {
      baseExenta += totalProducto;
    }
  });

  // Calcular IVA a partir de la base imponible
  const iva10 = base10 * 0.10;
  const iva5 = base5 * 0.05;
  ivaTotal = iva10 + iva5;

  const baseGravada = base10 + base5;

  const total = subtotal;

  const formatter = new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 });

  if (subtotalElem) subtotalElem.textContent = `${formatter.format(subtotal)} Gs`;
  if (ivaElem) ivaElem.textContent = `${formatter.format(ivaTotal)} Gs`;
  if (totalElem) totalElem.textContent = `${formatter.format(total)} Gs`;

  if (iva10Elem) iva10Elem.textContent = `${formatter.format(iva10)} Gs`;
  if (iva5Elem) iva5Elem.textContent = `${formatter.format(iva5)} Gs`;
  if (exentaElem) exentaElem.textContent = `${formatter.format(baseExenta)} Gs`;
  if (gravadaSinIvaElem) gravadaSinIvaElem.textContent = `${formatter.format(baseGravada)} Gs`;
}




// Función para cargar el contenido del carrito en el DOM
function renderizarCarrito() {
  const carrito = mostrarCarrito();
  const contenedor = document.querySelector('.carrito-scroll');

  if (!contenedor) return;
  contenedor.innerHTML = ''; // Limpia contenido

  if (!carrito || carrito.length === 0) {
    contenedor.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío</p>';
    renderizarCobros(); // También limpiamos los montos
    return;
  }

  carrito.forEach(producto => {
    const { codigo, descripcion, cantidad, tipo, precio, iva } = producto;
    const tipoTexto = tipo === 'kl' ? 'Kg' : 'Unid';

    // Calcular el total por producto
    const cantidadNum = parseFloat(cantidad);
    const precioNum = parseFloat(precio);
    const totalProducto = cantidadNum * precioNum;

    const precioFormateado = formatter.format(precioNum);
    const totalProductoFormateado = formatter.format(totalProducto);

    const itemHTML = `
      <div class="d-flex mb-3 border-bottom pb-2 align-items-start itemCardCarrito" data-codigo="${codigo}">
        <img src="https://arete.com.py/userfiles/images/productos/224/${codigo}.jpg" class="me-3" alt="${descripcion}" style="width: 80px; height: auto;">
        
        <div class="flex-grow-1">
          <strong>${descripcion}</strong>
          <p class="mb-1 text-muted small">Código: ${codigo}</p>
          <div><span class='cantidadItemActual'>${cantidad}</span> x <span class='precioUniKl'>${precioFormateado}</span> Gs </div>
       
          </div>

        <div class="ms-3" style="min-width: 250px;">
          <div class="input-group mb-2" style="max-width: 250px;">
            <button class="btn btn-warning eliminarItemCard" type="button">
              <i class="bi bi-dash-lg"></i>
            </button>
            <input type="text" class="form-control text-center cantidad-input" min="${(tipoTexto === 'Kg') ? '0.100' : '1.000'}" value="${cantidad}" readonly>
            <input type="text" class="form-control text-center bg-light tipoItem" value="${tipoTexto}" disabled>
            <input type="hidden" class="ivaItem" data-iva="${iva}" value="${iva}">
            <button class="btn btn-warning carritoAgregarItem" type="button">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>

          <div class="text-end">
          <div style='margin-left:20px'>Total: ${totalProductoFormateado} </div>
            <label class="text-muted small">IVA: <span class="ivaItemValor">${iva}%</span></label>
            <button class="btn btn-sm btn-danger eliminarItemCompleto">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML('beforeend', itemHTML);
  });

  renderizarCobros(); // ⚠️ Recalcular montos del resumen
}


