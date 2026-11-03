dayjs.locale("es");

const fechaInput = document.getElementById("fecha");
const btnBuscar = document.getElementById("btnBuscar");
const error = document.getElementById("error");
const resultado = document.getElementById("resultado");
const listaFavoritos = document.getElementById("lista-favoritos");
const mensajeFavorito = document.getElementById("mensaje-favorito");
const btnFavorito = document.getElementById("btn-favorito");
const fechaMinima = "1995-06-16";
const fechaHoy = dayjs().format("YYYY-MM-DD");
let apodActual = null;
let solicitudId = 0;

fechaInput.max = fechaHoy;
fechaInput.value = fechaHoy;

function mostrarError(mensaje) {
  error.textContent = mensaje;
}

function validarFecha(fecha) {
  if (!fecha) {
    mostrarError("Por favor, selecciona una fecha.");
    return false;
  }
  if (fecha < fechaMinima) {
    mostrarError("La fecha debe ser igual o posterior al 16 de junio de 1995.");
    return false;
  }
  if (fecha > fechaHoy) {
    mostrarError("Debes elegir una fecha igual o anterior a hoy.");
    return false;
  }
  mostrarError("");
  return true;
}

function formatoFecha(fecha) {
  return dayjs(fecha).format("D [de] MMMM [de] YYYY");
}

function mostrarCarga() {
  resultado.innerHTML = "<p>Cargando información...</p>";
}

function mostrarAPOD(apod) {
  const titulo = document.createElement("h2");
  titulo.textContent = apod.title || "Foto astronómica del día";
  const fecha = document.createElement("p");
  fecha.textContent = formatoFecha(apod.date);
  const explicacion = document.createElement("p");
  explicacion.textContent = apod.explanation || "No hay descripción disponible.";
  resultado.replaceChildren(titulo, fecha);

  if (apod.media_type === "video") {
    const video = document.createElement("iframe");
    video.src = apod.url;
    video.title = apod.title || "Video astronómico del día";
    video.allowFullscreen = true;
    video.loading = "lazy";
    resultado.append(video);
  } else if (apod.url) {
    const imagen = document.createElement("img");
    imagen.src = apod.hdurl || apod.url;
    imagen.alt = apod.title || "Imagen astronómica del día";
    imagen.loading = "lazy";
    resultado.append(imagen);
  }
  resultado.append(explicacion);
}

async function cargarApod(fecha) {
  if (!validarFecha(fecha)) return;
  const id = ++solicitudId;
  apodActual = null;
  mensajeFavorito.textContent = "";
  mostrarCarga();
  try {
    const respuesta = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${encodeURIComponent(fecha)}`);
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.msg || "No fue posible consultar la NASA.");
    if (id !== solicitudId) return;
    apodActual = datos;
    mostrarAPOD(datos);
  } catch (e) {
    if (id !== solicitudId) return;
    resultado.replaceChildren();
    mostrarError("No se pudo cargar la foto. Revisa tu conexión e inténtalo de nuevo.");
    console.error(e);
  }
}

function leerFavoritos() {
  try {
    const datos = JSON.parse(localStorage.getItem("favoritos") || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardarFavoritos(favoritos) {
  try {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    return true;
  } catch {
    mensajeFavorito.textContent = "No se pudieron guardar los favoritos en este navegador.";
    return false;
  }
}

function mostrarFavoritos() {
  listaFavoritos.replaceChildren();
  leerFavoritos().forEach((favorito) => {
    const item = document.createElement("li");
    item.textContent = `${formatoFecha(favorito.date)} - ${favorito.title}`;
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    const abrir = () => cargarApod(favorito.date);
    item.addEventListener("click", abrir);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrir();
      }
    });
    listaFavoritos.append(item);
  });
}

function agregarFavorito() {
  if (!apodActual) {
    mensajeFavorito.textContent = "Aún no hay una APOD para guardar.";
    return;
  }
  const favoritos = leerFavoritos();
  if (favoritos.some((favorito) => favorito.date === apodActual.date)) {
    mensajeFavorito.textContent = "Esta APOD ya está en tus favoritos.";
    return;
  }
  favoritos.push({ date: apodActual.date, title: apodActual.title });
  if (guardarFavoritos(favoritos)) {
    mostrarFavoritos();
    mensajeFavorito.textContent = "¡Guardada en favoritos!";
  }
}

btnBuscar.addEventListener("click", () => cargarApod(fechaInput.value));
fechaInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") cargarApod(fechaInput.value);
});
btnFavorito.addEventListener("click", agregarFavorito);
mostrarFavoritos();
cargarApod(fechaHoy);
