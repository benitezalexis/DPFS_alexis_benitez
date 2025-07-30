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
                    if ((data.mensaje) ) {
                alert("Producto eliminado correctamente.");
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

function crearSubseccion() {
  const tbody = document.getElementById("tablaSubsecciones");
  // Eliminar todos los registros actuales de la tabla
  tbody.innerHTML = "";

  const row = document.createElement("tr");
  const datalistId = `listaSeccionesSec_${Math.floor(Math.random() * 100000)}`; // ID único para cada fila

  row.innerHTML = `
      <td><input type="text" class="form-control idCard" disabled data-estado='activo' value='0'></td>
     <td>       <input list="${datalistId}" class="form-control seccion-input listaSeccionesSecInp" value="" >
        <datalist id="${datalistId}" class="listaSeccionesSecdatalist"></datalist></td>
      <td><input type="text" class="form-control"></td>
      <td><input type="checkbox" class="form-check-input"></td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editarFila(this)">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarFila(this)" data-sec='secSub'>Eliminar</button>
      </td>`;
  tbody.appendChild(row);
}
function buscarSubsecciones() {
  const query = document.getElementById("busquedaSubseccion").value.toLowerCase();

  fetch(`http://localhost:3000/subCategory/search?busqueda=${encodeURIComponent(query)}`)
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
        renderTablaSubsecciones(data);
      } else {
        // Mostrar tabla vacía si no hay resultados
        renderTablaSubsecciones([]);
      }
    })
    .catch(error => {
      console.error("Error al buscar secciones:", error);
      alert("Error de red o servidor.");
    });
}
function guardarSubsecciones() {
  const tbody = document.getElementById("tablaSubsecciones"); // Asegurate que el id sea correcto
  const filas = tbody.querySelectorAll("tr");
  const registrosProcesables = [];

  console.log("Total de filas detectadas:", filas.length);

  filas.forEach(row => {
    const inputs = row.querySelectorAll("input");

    // Solo procesar la fila si hay al menos un input con data-estado="activo"
    const inputActivo = Array.from(inputs).find(input => input.dataset.estado === "activo");
    if (!inputActivo) return;

    const idInput = inputs[0];
    const categoriaInput = inputs[1];
    const descripcionInput = inputs[2];
    const checkboxInput = inputs[3];

    const id = parseInt(idInput.value.trim(), 10);
    const categoriaTexto = categoriaInput.value.trim(); // ej: "2) BAZAR"
    const visible = checkboxInput.checked ? 1 : 0;

    // Extraer codCategoria y descripcionCategoria
    const partes = categoriaTexto.split(")");
    const codCategoria = partes.length > 1 ? parseInt(partes[0].trim(), 10) : null;
    const descripcionCategoria = partes.length > 1 ? partes[1].trim() : "";

    const descripcion = descripcionInput.value.trim();

    console.log("Fila procesada:");
    console.log("  → Descripción:", descripcion);
    console.log("  → codCategoria:", codCategoria);

    if (descripcion !== "" && Number.isInteger(codCategoria)) {
      registrosProcesables.push({
        id,
        codCategoria,
        descripcion,
        visible
      });
    }
  });

  if (registrosProcesables.length === 0) {
    console.log("⚠️ No hay registros válidos para procesar.");
    alert("No hay registros válidos para guardar o actualizar.");
    return;
  }

  const promesas = registrosProcesables.map(registro => {
    const { id, codCategoria, descripcionCategoria, descripcion, visible } = registro;

    const url = id > 0
      ? `http://localhost:3000/subcategory/id/${id}` // Actualizar
      : "http://localhost:3000/subcategory/create";  // Crear

    const method = id > 0 ? "PUT" : "POST";

    console.log(`📤 Enviando ${method === "POST" ? "creación" : "actualización"}:`, registro);

    return fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        codCategoria,
        descripcionCategoria,
        descripcion,
        visible
      })
    })
      .then(response => {
        if (!response.ok) throw new Error(`Error al ${method === "POST" ? "crear" : "actualizar"} subsección`);
        return response.json();
      })
      .then(data => {
        console.log(`✅ ${method === "POST" ? "Guardado" : "Actualizado"} con éxito:`, data);
        return { exito: true };
      })
      .catch(error => {
        console.error("❌ Error al procesar subsección:", error);
        return { exito: false, error };
      });
  });

  Promise.all(promesas).then(resultados => {
    const exitos = resultados.filter(r => r.exito).length;
    const fallos = resultados.length - exitos;

    if (exitos > 0) {
      alert(`${exitos} subsección(es) ${exitos === 1 ? "procesada" : "procesadas"} con éxito.`);
      tbody.innerHTML = ""; // Limpia la tabla después
    }

    if (fallos > 0) {
      alert(`${fallos} subsección(es) tuvieron errores. Ver consola para más detalles.`);
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



});

