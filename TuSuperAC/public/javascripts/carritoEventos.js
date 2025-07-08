document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', function (e) {

    // 🔸 Solo modificar el input, sin tocar el carrito
    if (e.target.closest('.agregarItem')) {
      const contenedor = e.target.closest('.input-group');
      agregarItemBoton(contenedor);
    }

    if (e.target.closest('.restarItem')) {
      const contenedor = e.target.closest('.input-group');
      restarItemBoton(contenedor);
    }

    // 🔹 Agregar producto al carrito
// 🔹 Agregar producto al carrito pero del la vista del carrito/cobro
if (e.target.closest('.carritoAgregarItem')) {
  console.log('Agregar producto al carrito 555');

  const itemCard = e.target.closest('.itemCardCarrito');
  if (!itemCard) return;

  const codigo = itemCard.dataset.codigo;
  const descripcion = itemCard.querySelector('strong')?.innerText.trim();
  const cantidadActual = itemCard.querySelector('.cantidadItemActual')?.innerText.trim();
  const precioUnitarioTexto = itemCard.querySelector('.precioUniKl')?.innerText.trim();
  const tipoTexto = itemCard.querySelector('.tipoItem')?.value?.trim().toLowerCase();
  const iva = itemCard.querySelector('.ivaItem')?.dataset.iva;

  if (!codigo || !descripcion || !cantidadActual || !precioUnitarioTexto || !tipoTexto) return;

  const cantidad = (tipoTexto == 'kl' || tipoTexto == 'kg' ) ? '0.050' : '1.000'; // cantidad a sumar
  const precio = parseInt(precioUnitarioTexto.replace(/\D/g, ''), 10); // quitar puntos, Gs, etc.
  console.log('codigo:', codigo);
  console.log('descripcion:', descripcion);
  console.log('cantidadActual:', cantidad);
  console.log('tipoTexto:', tipoTexto);
  console.log('precio:', precio);
  agregarProducto({
    orden: 1,
    codigo,
    descripcion,
    cantidad,
    tipo: tipoTexto,
    precio,
    iva
  });

  // ✅ Opcional: actualizar cantidad visible directamente en el DOM
  if (tipoTexto == 'kl' ||tipoTexto == 'kg') {
    const nuevaCantidad = (parseFloat(cantidadActual) + 0.050).toFixed(3);
    itemCard.querySelector('.cantidadItemActual').innerText = nuevaCantidad;
    itemCard.querySelector('.cantidad-input').value = nuevaCantidad;
  } else {
    const nuevaCantidad = (parseFloat(cantidadActual) + 1).toFixed(3);
    itemCard.querySelector('.cantidadItemActual').innerText = nuevaCantidad;
    itemCard.querySelector('.cantidad-input').value = nuevaCantidad;
  }

  actualizarCarritoVisual();
  renderizarCarrito();
}

    // 🔹 Agregar producto al carrito
if (e.target.closest('.agregarCarritoItem')) {
  console.log('Agregar producto al carrito');
  const card = e.target.closest('.card');
  if (!card) return;

  const codigo = card.querySelector('.descProduct')?.dataset.codigo;
  const descripcion = card.querySelector('.descProduct')?.innerText.trim();
  const precioTexto = card.querySelector('.precioProduct')?.innerText.replace('.', '').replace(',', '');
  const tipo = card.querySelector('.tipoItem')?.value?.toLowerCase();
  const iva = card.querySelector('.ivaItem')?.dataset.iva;
  const inputCantidad = card.querySelector('input[type="text"]:not(.tipoItem)');

  if (!codigo || !descripcion || !precioTexto || !tipo || !inputCantidad) return;

  const precio = parseInt(precioTexto, 10);
  const cantidad = inputCantidad.value.trim(); // ✅ Se guarda como string, ejemplo: "0.100"

  agregarProducto({
    orden: 1,
    codigo,
    descripcion,
    cantidad,  // ✅ En formato "0.000"
    tipo,
    precio,
    iva
  });
  (tipo=='kl')?inputCantidad.value='0.100':inputCantidad.value='1.000';
  //actualizarContador(card, codigo);
  actualizarCarritoVisual();
}


    // 🔹 Quitar producto del carrito
// 🔹 Quitar producto del carrito
// 🔹 Quitar producto del carrito

if (e.target.closest('.eliminarItemCompleto')) {
  const itemCard = e.target.closest('.itemCardCarrito');
  if (!itemCard) return;

  const codigo = itemCard.dataset.codigo;
  const tipo = itemCard.querySelector('.tipoItem')?.value?.trim().toLowerCase();
  const cantidadActualTexto = itemCard.querySelector('.cantidadItemActual')?.innerText.trim();

  if (!codigo || !tipo || !cantidadActualTexto) return;

  const paso =( tipo === 'kl' || tipo === 'kg')? 0.050 : 1.000;

  const estadoItem = quitarProducto({ codigo, cantidad: paso },true);
  if (estadoItem === 'ult') {
    itemCard.remove();
  } 
  renderizarCarrito()
}


if (e.target.closest('.eliminarItemCard')) {
  const itemCard = e.target.closest('.itemCardCarrito');
  if (!itemCard) return;

  const codigo = itemCard.dataset.codigo;
  const tipo = itemCard.querySelector('.tipoItem')?.value?.trim().toLowerCase();
  const cantidadActualTexto = itemCard.querySelector('.cantidadItemActual')?.innerText.trim();

  if (!codigo || !tipo || !cantidadActualTexto) return;

  const paso =( tipo === 'kl' || tipo === 'kg')? 0.050 : 1.000;

  const estadoItem = quitarProducto({ codigo, cantidad: paso });

  console.log('estadoItem:', estadoItem);
  console.log('tipo:', tipo);
  console.log('paso:', paso);
  console.log('codigo:', codigo);

  if (estadoItem === 'ult') {
    itemCard.remove();
  } else if (estadoItem === true) {
    // Recalcular cantidad desde el DOM (ya fue actualizada en el localStorage por quitarProducto)
    const nuevaCantidadTexto = itemCard.querySelector('.cantidadItemActual')?.innerText.trim();
    const cantidadActual = parseFloat(parseFloat(nuevaCantidadTexto).toFixed(3));
    const nuevaCantidad = cantidadActual - paso;

    const nuevaCantidadFormateada = Math.max(0, nuevaCantidad).toFixed(3);
    itemCard.querySelector('.cantidadItemActual').innerText = nuevaCantidadFormateada;
    itemCard.querySelector('.cantidad-input').value = nuevaCantidadFormateada;
  }

  actualizarCarritoVisual();
  renderizarCarrito()
}




  });

  // ✅ Función para solo aumentar cantidad en input
  function agregarItemBoton(contenedor) {
    const inputCantidad = contenedor.querySelector('input[type="text"]:not(.tipoItem)');
    const inputTipo = contenedor.querySelector('.tipoItem');

    let valor = parseFloat(inputCantidad.value);
    const tipo = inputTipo.value.trim().toLowerCase();

    if (tipo === 'kl') {
      valor += 0.050;
    } else if (tipo === 'unid') {
      valor += 1.000;
    }

    inputCantidad.value = valor.toFixed(3);
  }

  // ✅ Función para solo restar cantidad en input
  function restarItemBoton(contenedor) {
    const inputCantidad = contenedor.querySelector('input[type="text"]:not(.tipoItem)');
    const inputTipo = contenedor.querySelector('.tipoItem');

    let valor = parseFloat(inputCantidad.value);
    const tipo = inputTipo.value.trim().toLowerCase();

    if (tipo === 'kl') {
      valor = Math.max(0.100, valor - 0.050);
    } else if (tipo === 'unid') {
      valor = Math.max(1.000, valor - 1.000);
    }

    inputCantidad.value = valor.toFixed(3);
  }

  // ✅ Actualiza el contador de un producto específico
  function actualizarContador(card, codigo) {
    const inputCantidad = card.querySelector('input[type="text"]:not(.tipoItem)');
    const carrito = mostrarCarrito();
    const producto = carrito?.find(p => p.codigo === codigo);

    inputCantidad.value = producto ? parseFloat(producto.cantidad).toFixed(3) : '0.000';
  }

  // ✅ Inicializa todos los contadores de productos
  function inicializarContadores() {
    const carrito = mostrarCarrito();
    if (!carrito) return;

    document.querySelectorAll('.card').forEach(card => {
      const codigo = card.querySelector('.descProduct')?.dataset.codigo;
      const producto = carrito.find(p => p.codigo === codigo);
      const inputCantidad = card.querySelector('input[type="text"]:not(.tipoItem)');
      if (producto && inputCantidad) {
        inputCantidad.value = parseFloat(producto.cantidad).toFixed(3);
      }
    });

    actualizarCarritoVisual();
  }

  // ✅ Actualiza el badge del carrito
  function actualizarCarritoVisual() {
    const carrito = mostrarCarrito();
    const badge = document.querySelector('.cart-badge');

    if (!badge) return;

    if (carrito && carrito.length > 0) {
      const totalItems = carrito.length; // productos únicos
      badge.textContent = totalItems;
      badge.style.display = 'inline-block';

      // Animación simple
      badge.classList.remove('cart-badge-anim');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('cart-badge-anim');
    } else {
      badge.textContent = '0';
      badge.style.display = 'none';
    }
  }

  // Inicializa al cargar
  inicializarContadores();
});
