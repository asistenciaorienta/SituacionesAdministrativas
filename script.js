window.onload = function() {
  alert("Versión 3.00");
};

// Obtener la voz deseada
let vozElegida = null;
window.speechSynthesis.onvoiceschanged = () => {
  const voces = speechSynthesis.getVoices();
  vozElegida = voces.find(v => v.name.includes("Pablo") && v.lang === "es-ES");
};
let vozSeleccionada = null;

function cargarVoces() {
  const selector = document.getElementById("vozSelector");
  selector.innerHTML = ""; // Limpiar opciones previas

  const voces = speechSynthesis.getVoices().filter(v => v.lang === "es-ES");

  voces.forEach(voz => {
    const opcion = document.createElement("option");
    opcion.value = voz.name;
    opcion.textContent = voz.name;
    selector.appendChild(opcion);
  });

  // Si hay una voz guardada en localStorage, seleccionarla
  const guardada = localStorage.getItem("vozAvatar");
  if (guardada) {
    selector.value = guardada;
    vozSeleccionada = voces.find(v => v.name === guardada);
  } else {
    vozSeleccionada = voces[3]; // Por defecto, la primera
  }

  selector.addEventListener("change", () => {
    vozSeleccionada = voces.find(v => v.name === selector.value);
    localStorage.setItem("vozAvatar", selector.value);
  });
}

// Esperar a que las voces estén disponibles
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = cargarVoces;
}
document.getElementById("btnEscucharMuestra").addEventListener("click", () => {
  const muestra = new SpeechSynthesisUtterance("Hola, soy tu guía virtual. ¿Me escuchas bien?. ¡Perfecto!.");
  muestra.lang = "es-ES";

  if (vozSeleccionada) {
    muestra.voice = vozSeleccionada;
  }

  window.speechSynthesis.speak(muestra);
});
document.addEventListener("DOMContentLoaded", () => {
  cargarVoces(); // ✅ Ejecutar directamente al cargar
});
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxigLGGauWCphFL95VD5R0mWm5mM65_wuq5KhwWxyZmM8I8h5pJQ-nKzJ5u6DqpNJTvaw/exec";
function ayuda() {
  detenerHablaAvatar(); // ✅ detener habla al pulsar
  window.open("https://www.tupagina.com", "_blank");
}

function actualizarDisponibles() {
  const checkboxes = Array.from(document.querySelectorAll('#sugerenciasForm input[type="checkbox"]'));
  const labels = Array.from(document.querySelectorAll('#sugerenciasForm label'));

  // Seleccionados actualmente (checkbox checked)
  const seleccionados = checkboxes.filter(cb => cb.checked).map(cb => cb.value);

  // Si no hay seleccionados, activar todo y quitar clase disabled
  if (seleccionados.length === 0) {
    checkboxes.forEach(cb => {
      cb.disabled = false;
    });
    labels.forEach(label => {
      label.classList.remove('disabled');
    });
    return;
  }

  // Función para comprobar si una combinación válida contiene TODOS los seleccionados + candidato
  // Queremos que al marcar otro, la combinación sea una superconjunto de los seleccionados actuales + ese candidato
  function esCompatible(candidato) {
    // Por cada combinación válida
    return combinacionesValidas.some(comb => {
      // La combinación debe contener al candidato
      if (!comb.includes(candidato)) return false;

      // Y debe contener todos los seleccionados
      return seleccionados.every(sel => comb.includes(sel));
    });
  }

  // Recorremos todos checkboxes y deshabilitamos si no es compatible
  checkboxes.forEach(cb => {
    if (seleccionados.includes(cb.value)) {
      // Checkbox seleccionado: siempre habilitado
      cb.disabled = false;
      cb.parentElement.classList.remove('disabled');
    } else {
      // No seleccionado: habilitar solo si es compatible con la selección
      if (esCompatible(cb.value)) {
        cb.disabled = false;
        cb.parentElement.classList.remove('disabled');
      } else {
        cb.disabled = true;
        cb.parentElement.classList.add('disabled');
      }
    }
  });
}

// Añadir evento a cada checkbox para actualizar al cambiar
function anadirEventosCheck() {
  const checkboxes = document.querySelectorAll('#sugerenciasForm input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', actualizarDisponibles);
  });
}

// En tu función mostrarSugerencias, tras crear el formulario, llama a añadirEventosCheck()

function ocultar_resultado(){
  document.getElementById('resultado').classList.add('hidden');
}

function preguntarBorrado() {
  const textarea = document.getElementById('search-box');

  // Si el modal ya está abierto, no hacer nada
  const modalVisible = !document.getElementById('modal-borrar').classList.contains('hidden');
  if (modalVisible) return;

  // Si hay texto, mostrar el modal
  if (textarea.value.trim() !== '') {
    textarea.blur(); // Para evitar escribir mientras responde
    document.getElementById('modal-borrar').classList.remove('hidden');
  }
}
function confirmarBorrado() {
  const textarea = document.getElementById('search-box');
  textarea.value = '';
  cerrarModalBorrar();
}

function cerrarModalBorrar() {
  document.getElementById('search-box').focus();
  document.getElementById('modal-borrar').classList.add('hidden');
  document.getElementById('resultado').classList.add('hidden');
}

const urls = {
  "TIE": "/SituacionesAdministrativas/images/TIE.png",
  "Documento": "/SituacionesAdministrativas/images/resolucion.png",
  "Tarjeta Roja": "/SituacionesAdministrativas/images/Tarjeta_roja.png"
};

const conceptosClave = [
  "Art 50 TUE. Retirada Reino Unido",
  "Asilo / Apátrida / Desplazados o protección internacional",
  "Circunstancias excepcionales",
  "Estudio, prácticas o voluntariado",
  "Familiar de ciudadano de UE",
  "Ley 14/2013",
  "Menores",
  "Reagrupación familiar",
  "Residencia temporal que Autoriza a trabajar",
  "Residencia temporal que No Autoriza a trabajar",
  "Residencia Larga Duración",
  "Permiso de Residencia y Trabajo",
  "Visado búsqueda empleo",
  "Prestación sin autorización laboral"
];

const combinacionesValidas = [
  ["Asilo / Apátrida / Desplazados o protección internacional", "Residencia temporal que Autoriza a trabajar"],
  ["Asilo / Apátrida / Desplazados o protección internacional", "Residencia temporal que No Autoriza a trabajar"],
  ["Permiso de Residencia y Trabajo", "Residencia temporal que Autoriza a trabajar"],
  ["Permiso de Residencia y Trabajo", "Residencia temporal que No Autoriza a trabajar"],        
  ["Residencia Larga Duración", "Permiso de Residencia y Trabajo"],
  ["Asilo / Apátrida / Desplazados o protección internacional", "Residencia Larga Duración", "Permiso de Residencia y Trabajo"]
];

function gestionarSeleccion(seleccionado) {
  const opciones = ["TIE", "Resolución", "Tarjeta Roja", "Solicitud", "TASA", "NIE"];
  const sinSubopciones = ["Solicitud", "TASA", "NIE"];

  // Ocultar todas las subopciones y limpiar selecciones previas
  opciones.forEach(opcion => {
    const subDiv = document.getElementById(`subopciones-${opcion}`);
    if (subDiv) {
      subDiv.style.display = "none";
      const radios = subDiv.querySelectorAll('input[type="radio"]');
      radios.forEach(r => r.checked = false);
    }
  });

  // Mostrar solo si tiene subopciones
  const seleccion = seleccionado.value;
  if (!sinSubopciones.includes(seleccion)) {
    const sub = document.getElementById(`subopciones-${seleccion}`);
    if (sub) sub.style.display = "flex";
  }
}

function evaluarDocumento() {
  const seleccionPrincipal = document.querySelector('input[name="documento"]:checked');
  const aclaracionesSinSubopciones = {
    NIE: "Has seleccionado NIE. Este documento no requiere subopciones y se gestiona directamente.",
    Solicitud: "Has seleccionado Solicitudes y/o Resguardos. Aquí puedes iniciar trámites relacionados sin necesidad de especificar estado.",
    TASA: "Has seleccionado TASA. Este apartado corresponde al pago de tasas y no requiere subopciones."
  };

  if (!seleccionPrincipal) {
    mostrarModal("Selecciona una opción.");
    return;
  }

  const valorPrincipal = seleccionPrincipal.value;
  const sinSubopciones = ["Solicitud", "TASA", "NIE"];
  let subValor = null;

  if (!sinSubopciones.includes(valorPrincipal)) {
    if (valorPrincipal === "TIE") {
      subValor = document.querySelector('input[name="estado-TIE"]:checked')?.value;
    } else if (valorPrincipal === "Resolución") {
      subValor = document.querySelector('input[name="estado-Resolución"]:checked')?.value;
    } else if (valorPrincipal === "Tarjeta Roja") {
      subValor = document.querySelector('input[name="estado-Tarjeta"]:checked')?.value;
    }

    if (!subValor) {
      mostrarModal("Selecciona una sub-opción.");
      return;
    }
  }

  // Mostrar manual si está en vigor
  if (valorPrincipal === "TIE" && subValor === "En Vigor") {
    presentarAvatar("TIE");
  } else if (valorPrincipal === "Resolución" && subValor === "En Vigor") {
    presentarAvatar("Documento");
  } else if (valorPrincipal === "Tarjeta Roja" && subValor === "En Vigor") {
    presentarAvatar("Tarjeta Roja");
  } else {
    document.getElementById("formulario_No_Comunitario").classList.add("hidden");
    document.getElementById("mensaje-aclaratorio").classList.remove("hidden");
    let texto;
    if (sinSubopciones.includes(valorPrincipal)) {
      texto = aclaracionesSinSubopciones[valorPrincipal] || `Has seleccionado: ${valorPrincipal}.`;
    } else {
      texto = `Has seleccionado: ${valorPrincipal} - ${subValor}. Aquí aparecerá la aclaración correspondiente.`;
    }
    document.getElementById("contenido-aclaratorio").textContent = texto;
  }
}

function mostrarModal(mensaje) {
  document.getElementById("modal-texto").textContent = mensaje;
  document.getElementById("mi-modal").classList.remove("hidden");
}

function cerrarModal() {
  document.getElementById("mi-modal").classList.add("hidden");
}

function mostrarFormularioComunitario() {
  document.getElementById("pagina_inicial").classList.add("hidden");
  document.getElementById("Doc_Necesaria_Comunitario").classList.remove("hidden");
}      

function mostrarFormularioNoComunitario() {
  document.getElementById("pagina_inicial").classList.add("hidden");
  document.getElementById("formulario_No_Comunitario").classList.remove("hidden");
}

async function mostrarManual(tipo) {
  localStorage.setItem("tipoDocumento", tipo);         
  //Si el usuario dice que necesita ayuda entonces:
  const texto = document.getElementById("textoAvatar");
  let mensaje = "";
  switch (tipo) {
    case "TIE":
      mensaje = "Este es el procedimiento para una TIE en vigor. Asegúrate de tener todos los documentos.";
      moverAvatar(100, 100);
      break;
    case "Documento":
      mensaje = "Con una resolución en vigor, estos son los pasos que debes seguir.";
      moverAvatar(200, 100);
      break;
    case "Tarjeta Roja":
      mensaje = "La Tarjeta Roja permite ciertos trámites. Aquí te explico cómo proceder.";
      moverAvatar(150, 200);
      break;
  }
  hablarYEscribir(mensaje);
}

function moverAvatar(top, left) {
  const avatar = document.getElementById("avatarFlotante");
  avatar.style.top = `${top}px`;
  avatar.style.left = `${left}px`;
}

function hablarAvatar(texto) {
  const speech = new SpeechSynthesisUtterance(texto);
  speech.lang = "es-ES";
 
  if (vozSeleccionada) {
    speech.voice = vozSeleccionada;
  } else {
    console.warn("No se encontró la voz Elegida. Usando la predeterminada.");
  }  
  speech.onstart = () => {
    if (window.avatarTalking) window.avatarTalking();
  };
  speech.onend = () => {
    if (window.avatarSilencio) window.avatarSilencio();
  };
  window.speechSynthesis.speak(speech);
}

function mostrarFormulario() {
  detenerHablaAvatar(); // ✅ detener habla al pulsar
  document.getElementById("manual").classList.add("hidden");
  document.getElementById("formulario").classList.remove("hidden");
}
function volverInicioDesdeFormulario() {
  document.getElementById("search-box").value = "";
  document.getElementById("formulario").classList.add("hidden");
  document.getElementById("manual").classList.remove("hidden");
  document.getElementById("buscarBtn").classList.remove("hidden");
}
function volverInicio() {
  detenerHablaAvatar(); // ✅ detener habla al pulsar
  document.getElementById("pagina_inicial").classList.remove("hidden");
  document.getElementById("formulario").classList.add("hidden");
  document.getElementById("manual").classList.add("hidden");
  document.getElementById("Doc_Necesaria_Comunitario").classList.add("hidden");
  document.getElementById("formulario_No_Comunitario").classList.add("hidden");
  document.getElementById("manual").classList.add("hidden");  
  document.getElementById("mensaje-aclaratorio").classList.add("hidden");  
}
function volverNacionalidad() {
  document.getElementById("Doc_Necesaria_Comunitario").classList.add("hidden");
  document.getElementById("formulario_No_Comunitario").classList.add("hidden");
  document.getElementById("pagina_inicial").classList.remove("hidden");
}

function volverNoComunitario() {
  detenerHablaAvatar(); // ✅ detener habla al pulsar
  document.getElementById("manual").classList.add("hidden");  
  document.getElementById("mensaje-aclaratorio").classList.add("hidden");
  document.getElementById("formulario_No_Comunitario").classList.remove("hidden");
  document.getElementById("avatarFlotante").classList.add("hidden");
}

function mostrarResultado(data) {
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = ""; // Limpiar resultados anteriores

  if (!data || data.length === 0) {
    const ayuda = document.createElement("p");
    ayuda.innerHTML = `
      <p style="text-align: center;">No se encontró nada. Si necesitas ayuda, puedes clicar en: 
      <button class="btn-small" onclick="mostrarSugerencias()">Mostrar sugerencias</button></p>
    `;
    contenedor.appendChild(ayuda);
    return;
  }

  // Crear tabla
  const tabla = document.createElement("table");

  // Cabecera
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Código</th>
        <th>Autorización</th>
        <th>Modalidad</th>
        <th>Observaciones</th>
        <th>Documentación</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const cuerpo = tabla.querySelector("tbody");

  // Filas
  data.forEach(item => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.codigo || ""}</td>
      <td>${(item.autoriza || "").replace(/\n/g, "<br>")}</td>
      <td>${(item.modalidad || "").replace(/\n/g, "<br>")}</td>
      <td>${(item.observaciones || "").replace(/\n/g, "<br>")}</td>
      <td> ${item.documento
          ? `<a href="${item.documento}" target="_blank" rel="noopener noreferrer">Ver PDF</a>`
          : "No disponible"}
      </td>

    `;
    cuerpo.appendChild(fila);
  });

  contenedor.appendChild(tabla);
}


function mostrarSugerencias() {
  const panel = document.getElementById("sugerenciasPanel");
  const form = document.getElementById("sugerenciasForm");

  // Mostrar el panel con animación (quita clase hidden y añade visible con delay)
  panel.classList.remove("hidden");
  setTimeout(() => panel.classList.add("visible"), 100);

  // Dividir conceptos en dos columnas de 7 elementos
  const primeraColumna = conceptosClave.slice(0, 7);
  const segundaColumna = conceptosClave.slice(7, 14);

  // Crear contenido HTML para ambas columnas dentro del formulario
  const col1HTML = primeraColumna.map(c =>
    `<label><input type="checkbox" name="concepto" value="${c}"> ${c}</label>`
  ).join("");

  const col2HTML = segundaColumna.map(c =>
    `<label><input type="checkbox" name="concepto" value="${c}"> ${c}</label>`
  ).join("");

  // Insertar el contenido en el formulario (sugerenciasForm)
  form.innerHTML = `
    <div class="columna-izq">${col1HTML}</div>
    <div class="columna-der">${col2HTML}</div>
  `;
  anadirEventosCheck();
  actualizarDisponibles();  
}

function ocultarSugerencias() {
  const panel = document.getElementById("sugerenciasPanel");
  panel.classList.remove("visible");
  setTimeout(() => panel.classList.add("hidden"), 600);
}

function mostrarAyudaConceptos() {
  const container = document.getElementById("resultado");
  const lista = conceptosClave.map(c => `<li>${c}</li>`).join("");
  container.innerHTML = `
    <h3 style="color: #007A33;">Conceptos que puedes utilizar:</h3>
    <ul style="text-align: left; max-width: 700px; margin: 20px auto; font-size: 16px; line-height: 1.6;">
      ${lista}
    </ul>
    <div style="text-align: center; margin-top: 20px;">
      <button class="btn-small" onclick="document.getElementById('resultado').classList.add('hidden');">← Ocultar ayuda</button>
    </div>`;
}


// 🔎 Nueva función buscar()
async function buscar() {
const searchText = document.getElementById("search-box").value.trim();
const opcionesMarcadas = []; // si usas checkboxes en sugerencias, aquí se pasan

if (!searchText) {
  mostrarModal("Por favor, introduce un texto para buscar.");
  return;
}

document.getElementById("loader").style.display = "block";
document.getElementById("resultado").classList.add("hidden");

try {
  const response = await fetch(WEBAPP_URL, {
    method: "POST",
    body: JSON.stringify({ searchText, opcionesMarcadas })
  });

  if (!response.ok) throw new Error("Error en la petición");

  const data = await response.json();
  mostrarResultado(data);

} catch (err) {
  console.error(err);
  mostrarModal("Error al conectar con el servidor.");
} finally {
  document.getElementById("loader").style.display = "none";
  document.getElementById("resultado").classList.remove("hidden");
}
}

// Reemplazamos onclick del botón Buscar
document.getElementById("buscarBtn").onclick = () => {
ocultar_resultado();
buscar();
};

// Modificamos buscarDesdeSugerencias()
function buscarDesdeSugerencias() {
const checkboxes = document.querySelectorAll('#sugerenciasForm input[type="checkbox"]:checked');
const seleccionados = Array.from(checkboxes).map(cb => cb.value);

if (seleccionados.length === 0) {
  alert("Debes seleccionar al menos un concepto.");
  return;
}

let conceptoBusqueda = null;

if (seleccionados.length === 1) {
  conceptoBusqueda = seleccionados[0];
} else {
  for (const combinacion of combinacionesValidas) {
    const esSubconjunto = seleccionados.every(sel => combinacion.includes(sel));
    if (esSubconjunto) {
      conceptoBusqueda = combinacion[0];
      break;
    }
  }
  if (!conceptoBusqueda) {
    alert("La combinación seleccionada no es válida.");
    return;
  }
}

document.getElementById("search-box").value = conceptoBusqueda;
buscar();
ocultarSugerencias();
}

function iniciarAvatarLive2D() {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById("live2dCanvas");
    const app = new PIXI.Application({
      view: canvas,
      autoStart: true,
      transparent: true,
      width: 300,
      height: 400
    });
    // Guarda la app globalmente para poder redimensionar después
    window.avatarApp = app;
    const modelPath = "modelo010925_2/modelo010925_2.model3.json";
    PIXI.live2d.Live2DModel.from(modelPath)
      .then(model => {
        // 1) Configuración inicial
        const core = model.internalModel.coreModel;
        const ID_BLINK = "ParametroParpadeo";
        const ID_ATT = "ParametroAtencion";
        const ID_LEG  = "Parametromoverpierna";
        const ID_MOPEN = "ParametroMouthOpen";
        const ID_MSPEAK = "ParametroMouthSpeak";
        const ID_BROW_L = "ParametroCejaIzquierda";
        const ID_BROW_R = "ParametroCejaDerecha";
        model.scale.set(0.15);
        model.anchor.set(0.5);
        model.x = app.renderer.width  / 2;
        model.y = app.renderer.height / 2;
        app.stage.addChild(model);
        // valores iniciales
        core.setParameterValueById(ID_BLINK,   0);
        core.setParameterValueById(ID_ATT,    -30);
        core.setParameterValueById(ID_LEG,    -30);
        core.setParameterValueById(ID_MOPEN,   0);
        core.setParameterValueById(ID_MSPEAK, -1);
        // 2) Parpadeo con timers en lugar de ticker
        function scheduleBlink() { setTimeout(() => blinkPhase(1), 2000 + Math.random()*3000);}
        function blinkPhase(step) {
          if (step === 1) {
            core.setParameterValueById(ID_BLINK, 0.5);
            setTimeout(() => blinkPhase(2), 50);
          } else if (step === 2) {
            core.setParameterValueById(ID_BLINK, 1.0);
            setTimeout(() => blinkPhase(3), 50);
          } else {
            core.setParameterValueById(ID_BLINK, 0);
            scheduleBlink();
          }
        }
        scheduleBlink();
        // 3) Lógica de habla y cejas
        let talking = false;
        let mouthValue = -1;
        let browLeft = 0, browRight = 0;
        let browTargetL = 0, browTargetR = 0;
        const BROW_LERP = 0.05;
        let mouthInterval = null;
        function startTalking() {
          if (mouthInterval) clearInterval(mouthInterval);
          talking = true;
          core.setParameterValueById(ID_MOPEN, 1);
          // empezamos siempre en 1
          mouthValue = 1;
          mouthInterval = setInterval(() => {
            // alternar de 1 a -1 y viceversa
            mouthValue *= -1;
            //const speed = ((Math.random()*0.15)+0.05)*(Math.random()<0.5 ? -1 : 1);
            //mouthValue = Math.max(-1, Math.min(1, mouthValue + speed));
            core.setParameterValueById(ID_MSPEAK, mouthValue);
            // actualizar objetivos de cejas
            const base = (Math.random()*2 - 1)*60;
            const tilt = (Math.random()*2 - 1)*20;
            browTargetL = base + tilt;
            browTargetR = base - tilt;
          }, 150);
        }
        function stopTalking() {
          talking = false;
          clearInterval(mouthInterval);
          core.setParameterValueById(ID_MOPEN, 0);
          core.setParameterValueById(ID_MSPEAK, -1);
          browTargetL = browTargetR = 0;
        }
        // 4) ticker solo para suavizar cejas y aplicar estado de habla
        app.ticker.add(delta => {
          // se suavizan las cejas
          browLeft  += (browTargetL - browLeft) * BROW_LERP * delta;
          browRight += (browTargetR - browRight) * BROW_LERP * delta;
          core.setParameterValueById(ID_BROW_L, browLeft);
          core.setParameterValueById(ID_BROW_R, browRight);

          // asegurar que la boca refleje talking
          if (!talking) {
            // no repetir si ya está en reposo
            core.setParameterValueById(ID_MSPEAK, -1);
          }
        });
        // 5) Exponer controles externos
        window.avatarModel    = model;
        window.avatarTalking  = startTalking;
        window.avatarSilencio = stopTalking;
        resolve();
      })
      .catch(err => {
        console.error("Error al cargar el modelo:", err);
        reject(err);
      });    
  });
}

async function presentarAvatar(tipo) {
  localStorage.setItem("tipoDocumento", tipo); // Guardamos el tipo para usarlo después
  const avatar = document.getElementById("avatarFlotante");
  document.getElementById("formulario_No_Comunitario").classList.add("hidden"); 
  document.getElementById("manualImg").src = urls[tipo];
  document.getElementById("manual").classList.remove("hidden");  
  const contenedor = document.getElementById("avatarFlotante");
  const burbujas = contenedor.querySelectorAll(".burbujaRespuesta");
  burbujas.forEach(burbuja => burbuja.remove()); // ✅ eliminar burbujas si/no si está activo
  
  avatar.classList.remove("hidden");
  avatar.classList.add("avatar-rebote"); // animación de entrada

  // Esperar a que el avatar esté cargado si es la primera vez
  if (!window.avatarIniciado) {
    await iniciarAvatarLive2D();
    window.avatarIniciado = true;
  }
  else {
    iniciarAvatarLive2D();
    window.avatarIniciado = true;
  }
  // Mostrar y hablar el mensaje
  hablarYEscribir("¡Hola! Soy tu asistente virtual. ¿Necesitas ayuda con tu trámite?");

  setTimeout(() => {
    mostrarBotonesAyuda()
  }, 2000); // Espera a que termine de hablar

  setTimeout(() => {  // Limpiar clase de animación para permitir futuras repeticiones
    avatar.classList.remove("avatar-rebote");
  }, 700);
}

async function responderAyuda(necesitaAyuda) {
  detenerHablaAvatar(); // ✅ detener habla al pulsar
  const contenedor = document.getElementById("avatarFlotante");
  const burbujas = contenedor.querySelectorAll(".burbujaRespuesta");
  const avatar = document.getElementById("avatarFlotante");
  const canvas = document.getElementById("live2dCanvas");
  avatar.classList.remove("avatar-esquina");

  if (necesitaAyuda) {
    clearTimeout(window.avatarInactividadTimer);
    // ✅ El usuario quiere ayuda → eliminar burbujas
    burbujas.forEach(burbuja => burbuja.remove());

    await hablarYEscribir("¡Perfecto! Te muestro el procedimiento paso a paso."); // ✅ espera a que termine
    const tipo = localStorage.getItem("tipoDocumento");
    if (tipo) {
      mostrarManual(tipo);
    } else {
      hablarYEscribir("Ups, no tengo claro qué documento estás tramitando.");
    }
  } else {
    clearTimeout(window.avatarInactividadTimer);
    // El usuario no quiere ayuda → eliminar botones y el avatar es reactivo a la pulsación
    burbujas.forEach(burbuja => burbuja.remove()); // ✅ eliminar ambos
    detenerHablaAvatar(); // ✅ detener habla al pulsar
    hablarYEscribir("De acuerdo, si necesitas ayuda más adelante, pulsa sobre mí.")
      .then(() => {
        // ✅ oculta el cuadro con estilo
        const texto = document.getElementById("textoAvatar");
        texto.classList.add("ocultoDeslizado"); 
        activarReactivacionAvatar(); // ✅ registrar el clic solo después de hablar
        // ✅ Mover avatar a la esquina superior izquierda
        moverAvatar(10, 10);
        minimizarAvatar(0.3);
      });
  }
}

function activarReactivacionAvatar() {
  const avatar = document.getElementById("avatarFlotante");
  const canvas = document.getElementById("live2dCanvas");

  if (!avatar.dataset.reactivacionActiva) {
    const reactivarAyuda = () => {
      window.avatarReactivo = false;
      avatar.removeEventListener("click", reactivarAyuda);
      delete avatar.dataset.reactivacionActiva;
      restaurarAvatar();
      document.getElementById("textoAvatar").classList.remove("ocultoDeslizado");
      hablarYEscribir("¿Quieres que te ayude con tu trámite?")
        .then(() => {
          mostrarBotonesAyuda();
        });
    };
    avatar.addEventListener("click", reactivarAyuda);
    avatar.dataset.reactivacionActiva = "true";
    window.avatarReactivo = true;
  }
}

function hablarYEscribir(texto) {
  return new Promise(resolve => {
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = "es-ES";
    if (vozSeleccionada) speech.voice = vozSeleccionada;

    const contenedor = document.getElementById("textoAvatar");
    contenedor.textContent = "";

    let intervalo; // para el tipeo
    let bocaAbierta = false;

    speech.onstart = () => {
      if (window.avatarTalking) window.avatarTalking();

      // tipeo sincronizado con inicio de la voz
      const letras = texto.split("");
      let i = 0;
      intervalo = setInterval(() => {
        contenedor.textContent += letras[i];
        i++;
        if (i >= letras.length) clearInterval(intervalo);
      }, 50);
    };

    // 🔑 cada vez que el motor empieza una palabra/fonema
    speech.onboundary = event => {
      if (event.name === "word" || event.name === "sentence") {
        if (window.avatarModel) {
          bocaAbierta = !bocaAbierta;
          const valor = bocaAbierta ? 1 : -1;
          window.avatarModel.internalModel.coreModel.setParameterValueById("ParametroMouthSpeak", valor);
        }
      }
    };

    speech.onend = () => {
      if (window.avatarSilencio) window.avatarSilencio();
      if (intervalo) clearInterval(intervalo);
      resolve();
    };

    window.speechSynthesis.speak(speech);
  });
}


function detenerHablaAvatar() {
  window.speechSynthesis.cancel(); // ✅ Detiene cualquier discurso activo
  if (window.avatarSilencio) window.avatarSilencio(); // ✅ Detiene animación de boca
}

function mostrarBotonesAyuda() {
  const contenedor = document.getElementById("avatarFlotante");
  const btnSi = document.createElement("button");
  btnSi.textContent = "Sí";
  btnSi.className = "burbujaRespuesta";
  btnSi.style.top = "345px";
  btnSi.style.left = "70px";
  btnSi.onclick = () => responderAyuda(true);

  const btnNo = document.createElement("button");
  btnNo.textContent = "No";
  btnNo.className = "burbujaRespuesta";
  btnNo.style.top = "345px";
  btnNo.style.left = "170px";
  btnNo.onclick = () => responderAyuda(false);

  contenedor.appendChild(btnSi);
  contenedor.appendChild(btnNo);
  window.avatarInactividadTimer = setTimeout(() => {
    minimizarAvatarPorInactividad();
  }, 15000); // 15 segundos
}

function minimizarAvatarPorInactividad() {
  minimizarAvatar(0.3);
  const texto = document.getElementById("textoAvatar");
  texto.textContent = "";
  texto.classList.add("ocultoDeslizado");
  // Activar modo reactivo si el usuario lo pulsa después
  activarReactivacionAvatar();
}

function minimizarAvatar(scale) {
  const avatar = document.getElementById("avatarFlotante");
  // 1) Clase sobre el propio id → permite CSS más específica
  avatar.classList.add("avatar-minimizado");
  // 2) Escala y reposiciona el modelo
  if (window.avatarModel) {
    window.avatarModel.scale.set(scale);
    //window.avatarModel.x = width  / 2;
    //window.avatarModel.y = height / 2;
  }
}

function restaurarAvatar() {
  const avatar = document.getElementById("avatarFlotante");
  const canvas = document.getElementById("live2dCanvas");
  avatar.classList.remove("avatar-minimizado");
  // ahora sí, actualizamos la resolución de dibujo y escala del modelo
  canvas.width  = 300;
  canvas.height = 400;
  window.avatarApp.renderer.resize(300, 400);
  window.avatarModel.scale.set(0.15);
  window.avatarModel.x = 300/2;
  window.avatarModel.y = 400/2;
  
  document.getElementById("textoAvatar").classList.remove("ocultoDeslizado");
}
