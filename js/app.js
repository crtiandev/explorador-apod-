dayjs.locale("es");

//Referencias del DOM.
const fechaInput = document.getElementById("fecha");
const btnBuscar = document.getElementById("btnBuscar");
const error = document.getElementById("error");
const resultado = document.getElementById("resultado");
const listaFavoritos = document.getElementById("lista-favoritos");
const mensajeFavorito = document.getElementById("mensaje-favorito");
const btnFavorito = document.getElementById("btn-favorito");

// Rango permitido.
const fechaMinima = "1995-06-16";
const fechaHoy = dayjs().format("YYYY-MM-DD");
let apodActual = null;
let solicitudId = 0;
fechaInput.min = fechaMinima;
fechaInput.max = fechaHoy;
fechaInput.value = fechaHoy;

function mostrarError(mensaje) {
    error.textContent = mensaje;
}

// impedir fecha incorrecta.
function validarFecha(fecha) {
    if (!fecha) {
        mostrarError("Por favor, selecciona una fecha.");
        return false;
    }
    if (dayjs(fecha).isBefore(dayjs(fechaMinima), "day")) {
        mostrarError("La fecha debe ser igual o posterior al 16 de junio de 1995.");
        return false;
    }
    if (dayjs(fecha).isAfter(dayjs(fechaHoy), "day")) {
        mostrarError("Debes elegir una fecha igual o anterior a hoy.");
        return false;
    }
    mostrarError("");
    return true;
}

// fecha en español con Day.js.
function formatoFecha(fecha) {
    return dayjs(fecha).format("D [de] MMMM [de] YYYY");
}

// Mostrar carga del proceso.
function mostrarCarga() {
    resultado.innerHTML = "<p>Cargando...</p>";
}

// título, fecha, imagen o video, y explicación de la APOD.
function mostrarAPOD(apod) {
    const titulo = document.createElement("h2");
    titulo.textContent = apod.title || "Foto astronómica del día";
    const fecha = document.createElement("p");
    fecha.textContent = formatoFecha(apod.date);


    const explicacion = document.createElement("p");
    const textoExplicacion = document.createElement("template");
    textoExplicacion.innerHTML = apod.explanation || "No hay descripción disponible.";
    textoExplicacion.content.querySelectorAll("script, style, iframe, object, embed").forEach((nodo) => nodo.remove());
    textoExplicacion.content.querySelectorAll("*").forEach((nodo) => {
        [...nodo.attributes].forEach((atributo) => {
            if (atributo.name.toLowerCase().startsWith("on") || (atributo.name === "href" && /^\s*javascript:/i.test(atributo.value))) {
                nodo.removeAttribute(atributo.name);
            }
        });
    });
    explicacion.append(textoExplicacion.content.cloneNode(true));
    resultado.replaceChildren(titulo, fecha);

    if (apod.media_type === "video") {
        // Guía, video APOD: usar hdurl como vista previa y enlazar a la publicación NASA.
        if (apod.hdurl) {
            const vistaPrevia = document.createElement("img");
            vistaPrevia.src = apod.hdurl;
            vistaPrevia.alt = `Vista previa del video: ${apod.title || "APOD"}`;
            vistaPrevia.loading = "lazy";
            resultado.append(vistaPrevia);
        }
        const enlaceVideo = document.createElement("a");
        enlaceVideo.href = apod.permalink;
        enlaceVideo.target = "_blank";
        enlaceVideo.rel = "noopener noreferrer";
        enlaceVideo.textContent = "Ver el video en NASA";
        if (apod.permalink) resultado.append(enlaceVideo);
    } else if (apod.hdurl) {
        const imagen = document.createElement("img");
        imagen.src = apod.hdurl;
        imagen.alt = apod.title || "Imagen astronómica del día";
        imagen.loading = "lazy";
        resultado.append(imagen);
    }
    resultado.append(explicacion);
}

// fetch + async/await + try/catch contra la API APOD indicada.
async function cargarApod(fecha) {
    if (!validarFecha(fecha)) return;
    const id = ++solicitudId;
    apodActual = null;
    mensajeFavorito.textContent = "";
    mostrarCarga();
    const esHoy = fecha === fechaHoy;
    const fechaApi = dayjs(fecha).format("YYMMDD");
    const url = esHoy
        ? "https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=1"
        : `https://science.nasa.gov/wp-json/wp/v2/apod-basic/${fechaApi}`;
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            if (respuesta.status === 404) throw new Error("No hay APOD para esa fecha.");
            throw new Error("No fue posible consultar la NASA.");
        }
        const datos = await respuesta.json();
        const apod = esHoy ? datos[0] : datos;
        if (!apod) throw new Error("No hay APOD para esa fecha.");
        if (id !== solicitudId) return;
        apodActual = apod;
        mostrarAPOD(apod);
    } catch (e) {
        if (id !== solicitudId) return;
        resultado.replaceChildren();
        mostrarError(e.message === "No hay APOD para esa fecha."
            ? e.message
            : "No se pudo cargar la foto. Revisa tu conexión e inténtalo de nuevo.");
        console.error(e);
    }
}

// localStorage + JSON.parse con lista vacía y manejo de datos inválidos.
function leerFavoritos() {
    try {
        const datos = JSON.parse(localStorage.getItem("favoritos") || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

// Guardar únicamente fecha y título serializados como JSON.
function guardarFavoritos(favoritos) {
    try {
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        return true;
    } catch {
        mensajeFavorito.textContent = "No se pudieron guardar los favoritos en este navegador.";
        return false;
    }
}

// Reconstruir la lista al abrir o recargar la página; clic vuelve a cargar APOD.
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

// Validación de duplicados.
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

// Interacción de click y teclado.
btnBuscar.addEventListener("click", () => cargarApod(fechaInput.value));
fechaInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") cargarApod(fechaInput.value);
});
// Guardar APOD.
btnFavorito.addEventListener("click", agregarFavorito);

mostrarFavoritos();
cargarApod(fechaHoy);
