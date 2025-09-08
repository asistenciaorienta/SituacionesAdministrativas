window.onload = function() {
  alert("Versión 2.24");
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
    vozSeleccionada = voces[0]; // Por defecto, la primera
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

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxigLGGauWCphFL95VD5R0mWm5mM65_wuq5KhwWxyZmM8I8h5pJQ-nKzJ5u6DqpNJTvaw/exec";
function ayuda() {
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
  const opciones = ["TIE", "Resolución", "Tarjeta Roja", "NIE"];
  
  // Ocultar todas las subopciones y limpiar selecciones previas
  opciones.forEach(opcion => {
    const subDiv = document.getElementById(`subopciones-${opcion}`);
    if (subDiv) {
      subDiv.style.display = "none";
      const radios = subDiv.querySelectorAll('input[type="radio"]');
      radios.forEach(r => r.checked = false);
    }
  });

  // Mostrar solo las subopciones correspondientes
  const seleccion = seleccionado.value;
  const sub = document.getElementById(`subopciones-${seleccion}`);
  if (sub) sub.style.display = "flex";
}

function evaluarDocumento() {
  const seleccionPrincipal = document.querySelector('input[name="documento"]:checked');
  if (!seleccionPrincipal) {
    mostrarModal("Selecciona una opción.");
    return;
  }

  const valorPrincipal = seleccionPrincipal.value;
  let subValor = null;

  // Detectar subvalor según el documento principal
  if (valorPrincipal === "TIE") {
    subValor = document.querySelector('input[name="estado-TIE"]:checked')?.value;
  } else if (valorPrincipal === "Resolución") {
    subValor = document.querySelector('input[name="estado-Resolución"]:checked')?.value;
  } else if (valorPrincipal === "Tarjeta Roja") {
    subValor = document.querySelector('input[name="estado-Tarjeta"]:checked')?.value;
  } else if (valorPrincipal === "NIE") {
    subValor = document.querySelector('input[name="estado-NIE"]:checked')?.value;
  }

  if (!subValor) {
    mostrarModal("Selecciona una sub-opción.");
    return;
  }

  // Mostrar manual si está en vigor
  if (valorPrincipal === "TIE" && subValor === "En Vigor") {
    mostrarManual("TIE");
  } else if (valorPrincipal === "Resolución" && subValor === "En Vigor") {
    mostrarManual("Documento");
  } else if (valorPrincipal === "Tarjeta Roja" && subValor === "En Vigor") {
    mostrarManual("Tarjeta Roja");
  } else {
    // Mostrar aclaración
    document.getElementById("formulario_No_Comunitario").classList.add("hidden");
    document.getElementById("mensaje-aclaratorio").classList.remove("hidden");
    document.getElementById("contenido-aclaratorio").textContent = `Has seleccionado: ${valorPrincipal} - ${subValor}. Aquí aparecerá la aclaración correspondiente.`;
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
  document.getElementById("nacionalidad-page").classList.add("hidden");
  document.getElementById("Doc_Necesaria_Comunitario").classList.remove("hidden");
  document.getElementById("titulo").classList.add("hidden");
}      

function mostrarFormularioNoComunitario() {
  document.getElementById("nacionalidad-page").classList.add("hidden");
  document.getElementById("formulario_No_Comunitario").classList.remove("hidden");
  document.getElementById("titulo").classList.add("hidden");
}

async function mostrarManual(tipo) {
  localStorage.setItem("tipoDocumento", tipo);        
  document.getElementById("formulario_No_Comunitario").classList.add("hidden"); 
  document.getElementById("manualImg").src = urls[tipo];
  document.getElementById("manual").classList.remove("hidden");

  // Mostrar avatar flotante
  const avatar = document.getElementById("avatarFlotante");
  avatar.classList.remove("hidden");

  // Esperar a que el avatar se cargue
  if (!window.avatarIniciado) {
    await iniciarAvatarLive2D();
    window.avatarIniciado = true;
  } 
  
  // Iniciar Live2D si no está iniciado
 // if (!window.avatarIniciado) {
 //   iniciarAvatarLive2D(); // Tu función existente
   // window.avatarIniciado = true;
  //}

  // Mostrar texto explicativo
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
  texto.textContent = mensaje;
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
  document.getElementById("nacionalidad-page").classList.remove("hidden");
  document.getElementById("titulo").classList.remove("hidden");
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
  document.getElementById("nacionalidad-page").classList.remove("hidden");
  document.getElementById("titulo").classList.remove("hidden");
}

function volverNoComunitario() {
  document.getElementById("manual").classList.add("hidden");  
  document.getElementById("mensaje-aclaratorio").classList.add("hidden");
  document.getElementById("formulario_No_Comunitario").classList.remove("hidden");
  //document.getElementById("avatarLive2D").classList.add("hidden");
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

    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "resultado-item";
      card.innerHTML = `
        <p><strong>Código:</strong> ${item.codigo}</p>
        <p><strong>Autorización:</strong> ${item.autoriza}</p>
        <p><strong>Modalidad:</strong> ${item.modalidad}</p>
        <p><strong>Observaciones:</strong> ${item.observaciones}</p>
        <p><strong>Documentación:</strong> ${item.documento}</p>
        <hr>
      `;
      contenedor.appendChild(card);
    });
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
      resizeTo: canvas,
      transparent: true
  });
  const modelPath = "modelo010925_2/modelo010925_2.model3.json"; // Ajusta la ruta si es necesario
  let nextBlink = Date.now() + (2000 + Math.random() * 3000);
  let blinking = false;
  let blinkStep = 0;

  let talking = false;
  let mouthValue = -1;
  let mouthSpeed = 0.08;
  let nextMouthChange = Date.now() + 500;

  const paramBrowLeft = "ParametroCejaIzquierda";
  const paramBrowRight = "ParametroCejaDerecha";
  let browLeft = 0, browRight = 0;
  let browTargetLeft = 0, browTargetRight = 0;
  let nextBrowChange = Date.now() + 600;
  const browLerp = 0.05;

  function lerp(a, b, t) { return a + (b - a) * t; }
  
//  PIXI.live2d.Live2DModel.from(modelPath).then(model => {
//    model.scale.set(0.25);
//    model.x = (canvas.clientWidth - model.width * model.scale.x) / 2;
//    model.y = (canvas.clientHeight - model.height * model.scale.y) / 2;
//    app.stage.addChild(model);

  PIXI.live2d.Live2DModel.from(modelPath).then(model => {
    model.scale.set(0.15); // Ajusta según el tamaño real del modelo
    model.anchor.set(0.5); // Centra el modelo
    model.x = app.renderer.width / 2;
    model.y = app.renderer.height / 2;
    app.stage.addChild(model);

    // Estado inicial
    model.internalModel.coreModel.setParameterValueById("ParametroParpadeo", 0);
    model.internalModel.coreModel.setParameterValueById("ParametroAtencion", -30.0);
    model.internalModel.coreModel.setParameterValueById("Parametromoverpierna", -30.0);
    model.internalModel.coreModel.setParameterValueById("ParametroMouthOpen", 0.0);
    model.internalModel.coreModel.setParameterValueById("ParametroMouthSpeak", -1.0);

  app.ticker.add(() => {
      const now = Date.now();

      // Parpadeo
      if (!blinking && now >= nextBlink) {
        blinking = true;
        blinkStep = 1;
        nextBlink = now + 50;
        model.internalModel.coreModel.setParameterValueById("ParametroParpadeo", 0.5);
      } else if (blinking && now >= nextBlink) {
        if (blinkStep === 1) {
          blinkStep = 2;
          nextBlink = now + 50;
          model.internalModel.coreModel.setParameterValueById("ParametroParpadeo", 1);
        } else if (blinkStep === 2) {
          blinkStep = 3;
          nextBlink = now + 50;
          model.internalModel.coreModel.setParameterValueById("ParametroParpadeo", 0);
        } else {
          blinking = false;
          blinkStep = 0;
          nextBlink = now + (2000 + Math.random() * 3000);
        }
      }

      // Habla
      if (talking) {
        model.internalModel.coreModel.setParameterValueById("ParametroMouthOpen", 1.0);

        if (now >= nextMouthChange) {
          mouthSpeed = (Math.random() * 0.15) + 0.05;
          if (Math.random() < 0.5) mouthSpeed *= -1;
          nextMouthChange = now + (200 + Math.random() * 700);

          const base = (Math.random() * 2 - 1) * 60;
          const tilt = (Math.random() * 2 - 1) * 20;
          browTargetLeft = base + tilt;
          browTargetRight = base - tilt;
          nextBrowChange = now + (600 + Math.random() * 800);
        }

        mouthValue += mouthSpeed;
        if (mouthValue > 1) { mouthValue = 1; mouthSpeed *= -1; }
        if (mouthValue < -1) { mouthValue = -1; mouthSpeed *= -1; }
        model.internalModel.coreModel.setParameterValueById("ParametroMouthSpeak", mouthValue);
      } else {
        model.internalModel.coreModel.setParameterValueById("ParametroMouthSpeak", -1.0);
        model.internalModel.coreModel.setParameterValueById("ParametroMouthOpen", 0.0);
        browTargetLeft = 0;
        browTargetRight = 0;
      }

      browLeft = lerp(browLeft, browTargetLeft, browLerp);
      browRight = lerp(browRight, browTargetRight, browLerp);
      model.internalModel.coreModel.setParameterValueById(paramBrowLeft, browLeft);
      model.internalModel.coreModel.setParameterValueById(paramBrowRight, browRight);
    });
    // Guardar referencia global para control externo
    window.avatarModel = model;
    window.avatarTalking = () => { talking = true; };
    window.avatarSilencio = () => { talking = false; };
    resolve();
    }).catch(err => {
        console.error("Error al cargar el modelo:", err);
        reject(err);
    });
  });
}


                     
function hablarYEscribir(texto) {
  const speech = new SpeechSynthesisUtterance(texto);
  speech.lang = "es-ES";
  if (vozSeleccionada) speech.voice = vozSeleccionada;

  const contenedor = document.getElementById("textoAvatar");
  contenedor.textContent = "";

  // Fragmentar texto por palabras
  //const palabras = texto.split(" "); //mostrar palabras
  const letras = texto.split("");  //mostrar letras
  let i = 0;

  // Mostrar palabra por palabra
  //const intervalo = setInterval(() => {
  //  contenedor.textContent += palabras[i] + " ";
  //  i++;
  //  if (i >= palabras.length) clearInterval(intervalo);
  //}, 300); // Ajusta el ritmo aquí (300ms por palabra es fluido)

  // Mostrar letra por letra
  const intervalo = setInterval(() => {
    contenedor.textContent += letras[i];
    i++;
    if (i >= letras.length) clearInterval(intervalo);
  }, 50); // velocidad por letra

  // Activar movimiento de boca
  speech.onstart = () => {
    if (window.avatarTalking) window.avatarTalking();
  };
  speech.onend = () => {
    if (window.avatarSilencio) window.avatarSilencio();
  };
  window.speechSynthesis.speak(speech);
}



