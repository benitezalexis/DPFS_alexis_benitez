
  document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', function (e) {
      // Agregar producto al carrito
      if (e.target.closest('.agregarItem')) {
        const card = e.target.closest('.card');
        if (!card) return;

        const codigo = card.querySelector('.descProduct')?.dataset.codigo;
        const descripcion = card.querySelector('.descProduct')?.innerText.trim();
        const precioTexto = card.querySelector('.precioProduct')?.innerText.replace('.', '').replace(',', '');
        const tipo = card.querySelector('.tipoItem')?.value?.toLowerCase();
        const inputCantidad = card.querySelector('input[type="text"]:not(.tipoItem)');


        if (!codigo || !descripcion || !precioTexto || !tipo || !inputCantidad) return;

        console.log ("pasa por aqui")
        const precio = parseInt(precioTexto, 10);
        const paso = tipo === 'kl' ? 0.100 : 1.000;

        agregarProducto({
          orden: 1,
          codigo: codigo,
          descripcion: descripcion,
          cantidad: paso,
          tipo: tipo,
          precio: precio
        });

        // Actualiza el input de cantidad con el valor actual del carrito
        actualizarContador(card, codigo);
      }

      // Quitar producto del carrito
      if (e.target.closest('.restarItem')) {
        const card = e.target.closest('.card');
        if (!card) return;

        const codigo = card.querySelector('.descProduct')?.dataset.codigo;
        const tipo = card.querySelector('.tipoItem')?.value?.toLowerCase();
        if (!codigo || !tipo) return;

        const paso = tipo === 'kl' ? 0.100 : 1.000;

        quitarProducto({
          codigo: codigo,
          cantidad: paso
        });

        actualizarContador(card, codigo);
      }
    });

    function actualizarContador(card, codigo) {
      const inputCantidad = card.querySelector('input[type="text"]:not(.tipoItem)');
      const carrito = mostrarCarrito();
      const producto = carrito?.find(p => p.codigo === codigo);

      inputCantidad.value = producto ? parseFloat(producto.cantidad).toFixed(3) : '0.000';
    }

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
    }

    inicializarContadores();
  });
