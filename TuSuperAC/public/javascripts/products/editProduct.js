    // RENDERIZAR VISTAS (NO SE UTILIZA PARA ESTE CASO)
    function renderTablaSubsecciones(subsecciones) {
      const tbody = document.getElementById("tablaSubsecciones");
      tbody.innerHTML = "";
      subsecciones.forEach((sub, index) => {
        const datalistId = `listaSeccionesSec_${index}`; // ID único para cada fila

        const row = document.createElement("tr");
        row.innerHTML = `
      <td><input type="text" class="form-control idCard" value="${sub.id}" disabled></td>
      <td>
        <input list="${datalistId}" class="form-control seccion-input listaSeccionesSecInp" value="${sub.codCategoria}) ${sub.descripcionCategoria}" ${sub.editable ? '' : 'disabled'}>
        <datalist id="${datalistId}" class="listaSeccionesSecdatalist"></datalist>
      </td>
      <td><input type="text" class="form-control" value="${sub.descripcion}" ${sub.editable ? '' : 'disabled'}></td>
      <td><input type="checkbox" class="form-check-input" ${sub.visible ? 'checked' : ''} disabled></td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editarFila(this)">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarFila(this)" data-sec='secSub'>Eliminar</button>
      </td>
    `;
        tbody.appendChild(row);
      });
    }

    function renderTablaSecciones(data) {
      const tbody = document.getElementById("tablaSecciones");
      tbody.innerHTML = "";
      data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td><input type="text" class="form-control idCard" value="${item.id}" disabled></td>
        <td><input type="text" class="form-control" value="${item.descripcion}" disabled></td>
          <td><input type="checkbox" class="form-check-input" ${item.visible ? 'checked' : ''} disabled></td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editarFila(this)">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarFila(this)" data-sec='sec'>Eliminar</button>
        </td>`;
        tbody.appendChild(row);
      });
    }
    function renderTablaProductos(productos) {
      const tbody = document.getElementById("tablaProductos");
      tbody.innerHTML = "";

      productos.forEach((prod, index) => {
        const datalistId = `listaSeccionesSecP_${index}`;
        const datalistIdSub = `listaSubSeccionesSecP_${index}`;

        const row = document.createElement("tr");
        row.innerHTML = `
      <td><input type="text" class="form-control idCard" value="${prod.id}" disabled></td>
      <td><input type="text" class="form-control codigoInput" value="${prod.codigo}" disabled></td>
      <td>
        <input list="${datalistId}" class="form-control listaSeccionesSecInp" value="${prod.codCategoria}) ${prod.descripcionCategoria}" ${prod.editable ? '' : 'disabled'}>
        <datalist id="${datalistId}" class="listaSeccionesSecdatalist"></datalist>
      </td>
      <td>
        <input list="${datalistIdSub}" class="form-control listaSubSeccionesSecInp" value="${prod.codSubCategoria}) ${prod.descripcionSubCategoria}" ${prod.editable ? '' : 'disabled'}>
        <datalist id="${datalistIdSub}" class="listaSeccionesSecdatalist"></datalist>
      </td>
      <td><input type="text" class="form-control descripcionInput" value="${prod.descripcion}" ${prod.editable ? '' : 'disabled'}></td>
      <td style="width: 9%;">
        <select class="form-control tipoSelect" ${prod.editable ? '' : 'disabled'}>
          <option value="Unit" ${prod.tipo === 'Unit' ? 'selected' : ''}>Unit</option>
          <option value="Kl" ${prod.tipo === 'Kl' ? 'selected' : ''}>Kl</option>
        </select>
      </td>
      <td><input type="text" class="form-control precioInput" value="${prod.precio}" ${prod.editable ? '' : 'disabled'}></td>
      <td><input type="checkbox" class="form-check-input visibleCheck" ${prod.visible ? 'checked' : ''} ${prod.editable ? '' : 'disabled'}></td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editarFila(this)">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarFila(this)" data-sec='pro'>Eliminar</button>
      </td>`;
        tbody.appendChild(row);
      });
    }



    // EDITAR FILAS
    function editarFila(btn) {
      const row = btn.closest("tr");
      const elementos = row.querySelectorAll("input, select");

      elementos.forEach(el => {
        if (el.classList.contains("idCard")) {
          el.disabled = true;
        } else {
          el.disabled = false;
        }

        // Marca la fila como activa para su posterior procesamiento
        el.dataset.estado = "activo";
      });
    }


    // ELIMINAR FILAS 
    function eliminarFila(btn) {
      const row = btn.closest("tr");
      if (!row) return;

      const sec = btn.dataset.sec || "";
      const primeraCelda = row.querySelector("td");
      if (!primeraCelda) return;

      const input = primeraCelda.querySelector("input");
      const id = parseInt(input?.value.trim() || "0", 10);

      let tabla = "";
      switch (sec) {
        case "sec":
          tabla = "category";
          break;
        case "secSub":
          tabla = "subCategory";
          break;
        case "pro":
          tabla = "products";
          break;
        default:
          console.warn("Sección desconocida:", sec);
          alert("No se puede eliminar: sección no válida.");
          return;
      }

      // Si tiene ID válido, intenta eliminar del servidor
      if (id > 0) {
        fetch(`http://localhost:3000/${tabla}/id/${id}`, {
          method: "DELETE"
        })
          .then(response => response.json())
          .then(data => {
            if (data.mensaje?.includes("eliminado")) {
              console.log(`✅ Se ha eliminado correctamente de ${tabla}`);
              row.remove();
            } else {
              console.warn("❌ No se pudo eliminar:", data.error || data);
              alert(`No se pudo eliminar: ${data.error || "Error desconocido"}`);
            }
          })
          .catch(error => {
            console.error("❌ Error al eliminar:", error);
            alert("Ocurrió un error al intentar eliminar.");
          });
      } else {
        // Si no tiene ID, solo se elimina de la tabla visualmente
        console.log("ℹ️ Fila sin ID en DB. Se elimina solo del DOM.");
        row.remove();
      }
    }
    function crearProducto() {
      const tbody = document.getElementById("tablaProductos");
      tbody.innerHTML = ""; // Limpia la tabla actual

      const idRandom = Math.floor(Math.random() * 100000);
      const datalistId = `listaSeccionesSecP_${idRandom}`;
      const datalistIdSub = `listaSubSeccionesSecP_${idRandom}`;

      const row = document.createElement("tr");
      row.innerHTML = `
    <td><input type="text" class="form-control idCard" value="0" disabled></td>
    <td><input type="text" class="form-control codigoInput" value=""></td>
    <td>
      <input list="${datalistId}" class="form-control listaSeccionesSecInp" value="">
      <datalist id="${datalistId}" class="listaSeccionesSecdatalist"></datalist>
    </td>
    <td>
      <input list="${datalistIdSub}" class="form-control listaSubSeccionesSecInp" value="">
      <datalist id="${datalistIdSub}" class="listaSeccionesSecdatalist"></datalist>
    </td>
    <td><input type="text" class="form-control descripcionInput" value=""></td>
    <td style="width: 9%;">
      <select class="form-control tipoSelect">
        <option value="Unit">Unit</option>
        <option value="Kl">Kl</option>
      </select>
    </td>
    <td><input type="text" class="form-control precioInput" value=""></td>
    <td><input type="checkbox" class="form-check-input visibleCheck"></td>
    <td>
      <button class="btn btn-sm btn-warning me-1" onclick="editarFila(this)">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="eliminarFila(this)" data-sec='pro'>Eliminar</button>
    </td>`;
      tbody.appendChild(row);
    }
   function buscarProductos() {
      const query = document.getElementById("busquedaProducto").value.toLowerCase();

      fetch(`http://localhost:3000/products/search?busqueda=${encodeURIComponent(query)}`)
        .then(async response => {
          const data = await response.json();

          if (!response.ok) {
            // Aquí ya tenés el JSON del error, como { error: "categoria no encontrado" }
            alert(data.mensaje || "Error en la búsqueda");
            console.warn("Error devuelto por la API:", data);
            return null; // evitar continuar
          }

          return data; // respuesta válida
        })
        .then(data => {
          console.log(data)
          if (data) {
            console.log("el data es : ", data);
            renderTablaProductos(data);
          } else {
            // Mostrar tabla vacía si no hay resultados
            renderTablaProductos([]);
          }
        })
        .catch(error => {
          console.error("Error al buscar secciones:", error);
          alert("Error de red o servidor.");
        });
    }
    function guardarProductos() {
      const tbody = document.getElementById("tablaProductos");
      const filas = tbody.querySelectorAll("tr");
      const registrosProcesables = [];

      filas.forEach(row => {
        const seccionInput = row.querySelector(".listaSeccionesSecInp:not([disabled])");
        if (!seccionInput) return;

        const id = parseInt(row.querySelector(".idCard").value.trim(), 10);
        const codigo = row.querySelector(".codigoInput")?.value.trim();
        const categoriaTexto = row.querySelector(".listaSeccionesSecInp")?.value.trim();
        const subCategoriaTexto = row.querySelector(".listaSubSeccionesSecInp")?.value.trim();
        const descripcion = row.querySelector(".descripcionInput")?.value.trim();
        const tipo = row.querySelector(".tipoSelect")?.value;
        const precio = parseFloat(row.querySelector(".precioInput")?.value.trim()) || 0;
        const visible = row.querySelector(".visibleCheck")?.checked ? 1 : 0;

        // Parsear categoría
        const partesCat = categoriaTexto.split(")");
        const codCategoria = partesCat.length > 1 ? parseInt(partesCat[0].trim(), 10) : null;
        const descripcionCategoria = partesCat.length > 1 ? partesCat[1].trim() : "";

        // Parsear subcategoría
        const partesSub = subCategoriaTexto.split(")");
        const codSubCategoria = partesSub.length > 1 ? parseInt(partesSub[0].trim(), 10) : null;
        const descripcionSubCategoria = partesSub.length > 1 ? partesSub[1].trim() : "";

        if (
          descripcion !== "" &&
          Number.isInteger(codCategoria) &&
          Number.isInteger(codSubCategoria)
        ) {
          registrosProcesables.push({
            id,
            codigo,
            codCategoria,
            codSubCategoria,
            descripcion,
            tipo,
            precio,
            visible
          });
        }
      });

      if (registrosProcesables.length === 0) {
        alert("No hay registros válidos para guardar o actualizar.");
        return;
      }

      const promesas = registrosProcesables.map(registro => {
        const {
          id, codigo, codCategoria, descripcionCategoria,
          codSubCategoria, descripcionSubCategoria,
          descripcion, tipo, precio, visible
        } = registro;

        const url = id > 0
          ? `http://localhost:3000/products/id/${id}`
          : `http://localhost:3000/products/create`;

        const method = id > 0 ? "PUT" : "POST";

        return fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            codigo,
            codCategoria,
            descripcionCategoria,
            codSubCategoria,
            descripcionSubCategoria,
            descripcion,
            tipo,
            precio,
            visible
          })
        })
          .then(response => {
            if (!response.ok) throw new Error(`Error al ${method === "POST" ? "crear" : "actualizar"} producto`);
            return response.json();
          })
          .then(data => {
            console.log(`✅ ${method === "POST" ? "Guardado" : "Actualizado"} con éxito:`, data);
            return { exito: true };
          })
          .catch(error => {
            console.error("❌ Error al procesar producto:", error);
            return { exito: false, error };
          });
      });

      Promise.all(promesas).then(resultados => {
        const exitos = resultados.filter(r => r.exito).length;
        const fallos = resultados.length - exitos;

        if (exitos > 0) {
          alert(`${exitos} producto(s) guardado(s) con éxito.`);
          tbody.innerHTML = ""; // Podés recargar desde API si querés
        }

        if (fallos > 0) {
          alert(`${fallos} producto(s) fallaron. Revisa la consola.`);
        }
      });
    }

  // FUNCIONALIDADES DE EVENTOS DE TECLADO -----------------------------------------------------------------------------------------    
    document.addEventListener('input', function (e) {
      if (e.target && e.target.classList.contains('listaSeccionesSecInp')) {
        const textoCompleto = e.target.value;

        const partes = textoCompleto.split(')');
        const descripcion = partes.length > 1 ? partes[1].trim() : textoCompleto.trim();

        if (descripcion === '') {
          return;
        }

        console.log('Solo descripción:', descripcion);

        fetch(`http://localhost:3000/category/search?busqueda=${encodeURIComponent(descripcion)}`)
          .then(async response => {
            const data = await response.json();

            if (!response.ok) {
              // alert(data.mensaje || "Error en la búsqueda");
              console.log(data.mensaje)
              return null;
            }

            return data;
          })
          .then(data => {
            if (data) {
              const datalistId = e.target.getAttribute('list');
              const datalist = document.getElementById(datalistId);

              if (!datalist) {
                console.warn(`No se encontró datalist con id "${datalistId}"`);
                return;
              }

              datalist.innerHTML = '';
              data.forEach(item => {
                const option = document.createElement('option');
                option.value = `${item.id}) ${item.descripcion}`;
                datalist.appendChild(option);
              });
            } else {
              renderTablaSecciones([]); // si esto es relevante para vos
            }
          })
          .catch(error => {
            console.error("Error al buscar secciones:", error);
            alert("Error de red o servidor.");
          });
      }


      if (e.target && e.target.classList.contains('listaSubSeccionesSecInp')) {
        const textoCompleto = e.target.value;

        const partes = textoCompleto.split(')');
        const descripcion = partes.length > 1 ? partes[1].trim() : textoCompleto.trim();

        if (descripcion === '') {
          return;
        }

        console.log('Solo descripción:', descripcion);

        fetch(`http://localhost:3000/subCategory/search?busqueda=${encodeURIComponent(descripcion)}`)
          .then(async response => {
            const data = await response.json();

            if (!response.ok) {
              // alert(data.mensaje || "Error en la búsqueda");
              console.log(data.mensaje)
              return null;
            }

            return data;
          })
          .then(data => {
            if (data) {
              const datalistId = e.target.getAttribute('list');
              const datalist = document.getElementById(datalistId);

              if (!datalist) {
                console.warn(`No se encontró datalist con id "${datalistId}"`);
                return;
              }

              datalist.innerHTML = '';
              data.forEach(item => {
                const option = document.createElement('option');
                option.value = `${item.id}) ${item.descripcion}`;
                datalist.appendChild(option);
              });
            } else {
              renderTablaSecciones([]); // si esto es relevante para vos
            }
          })
          .catch(error => {
            console.error("Error al buscar secciones:", error);
            alert("Error de red o servidor.");
          });
      }
    });
