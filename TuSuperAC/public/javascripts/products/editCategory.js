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
            console.log("Respuesta del servidor:", data);
            if (data.mensaje?.includes("eliminado")) {
              console.log(`✅ Se ha eliminado correctamente de ${tabla}`);
              row.remove();
              if ((data.mensaje) && data?.mensaje == "Categoría eliminada") {
                alert("Categoría eliminada correctamente.");
                row.remove();
              }
              console.warn("❌ No se pudo eliminar:", data.error || data);
              //alert(`No se pudo eliminar: ${data.error || "Error desconocido"}`);
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

    // FUNCIONALIDADES DE CREACION DE REGISTROS-----------------------------------------------------------------------------
    function crearSeccion() {
      const tbody = document.getElementById("tablaSecciones");

      // Eliminar todos los registros actuales de la tabla
      tbody.innerHTML = "";

      // Crear nueva fila
      const row = document.createElement("tr");
      row.innerHTML = `
    <td><input type="text" class="form-control idCard" value="0" data-estado="activo" disabled></td>
    <td><input type="text" class="form-control" value=""></td>
    <td><input type="checkbox" class="form-check-input"  ></td>
    <td>
      <button class="btn btn-sm btn-warning me-1" onclick="editarFila(this)">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="eliminarFila(this)" data-sec='sec'>Eliminar</button>
    </td>
  `;

      // Agregar la nueva fila a la tabla
      tbody.appendChild(row);
    }
 // FUNCIONALIDADES DE BUSQUEDA -----------------------------------------------------------------------------------------
    function buscarSecciones() {
      const query = document.getElementById("busquedaSeccion").value.toLowerCase();

      fetch(`http://localhost:3000/category/search?busqueda=${encodeURIComponent(query)}`)
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
          if (data) {
            renderTablaSecciones(data);
          } else {
            // Mostrar tabla vacía si no hay resultados
            renderTablaSecciones([]);
          }
        })
        .catch(error => {
          console.error("Error al buscar secciones:", error);
          alert("Error de red o servidor.");
        });
    }
     // FUNCIONALIDADES DE GUARDADO -----------------------------------------------------------------------------------------
    function guardarSecciones() {
      //  const filas = document.querySelectorAll("#tablaSecciones  tr");

      const tbody = document.getElementById("tablaSecciones"); // Asegurate que el id sea correcto
      const filas = tbody.querySelectorAll("tr");

      const registrosProcesables = [];

      // Paso 1: Validar y recolectar registros con data-estado="activo"
      filas.forEach(row => {
        const inputs = row.querySelectorAll("input");

        const inputActivo = Array.from(inputs).find(input => input.dataset.estado === "activo");
        if (!inputActivo) return;

        const idInput = inputs[0];
        const descInput = inputs[1];
        const checkboxInput = inputs[2];

        const id = parseInt(idInput.value.trim(), 10);
        const descripcion = descInput.value.trim();
        const visible = checkboxInput.checked ? 1 : 0;

        if (descripcion !== "") {
          registrosProcesables.push({ id, descripcion, visible });
        }
      });

      if (registrosProcesables.length === 0) {
        alert("No hay registros válidos para guardar o actualizar.");
        return;
      }

      // Paso 2: Crear un array de promesas
      const promesas = registrosProcesables.map(registro => {
        const { id, descripcion, visible } = registro;

        const url =
          id > 0
            ? `http://localhost:3000/category/id/${id}`  // Actualizar
            : "http://localhost:3000/category/create";   // Crear

        const method = id > 0 ? "PUT" : "POST";

        return fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ descripcion, visible })
        })
          .then(response => {
            if (!response.ok) throw new Error(`Error al ${method === "POST" ? "crear" : "actualizar"} sección`);
            return response.json();
          })
          .then(data => {
            console.log(`${method === "POST" ? "Guardado" : "Actualizado"} con éxito:`, data);
            return { exito: true };
          })
          .catch(error => {
            console.error("Error al procesar sección:", error);
            return { exito: false, error };
          });
      });

      // Paso 3: Esperar a que todas las promesas terminen
      Promise.all(promesas).then(resultados => {
        const exitos = resultados.filter(r => r.exito).length;
        const fallos = resultados.length - exitos;

        if (exitos > 0) {
          alert(`${exitos} sección(es) ${exitos === 1 ? "procesada" : "procesadas"} con éxito.`);

          document.getElementById("tablaSecciones").innerHTML = "";
        }

        if (fallos > 0) {
          alert(`${fallos} sección(es) tuvieron errores al guardar/actualizar. Ver consola.`);

        }
      });
    }
 