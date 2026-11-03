dayjs.locale("es");
console.log(dayjs().format("D [de] MMMM [de] YYYY"));



// DOM //

const fechaInput = document.getElementById("fecha");
const btnBuscar  = document.getElementById("btnBuscar");
const error      = document.getElementById("error");
const resultado  = document.getElementById("resultado");


// Función N° 1: Error //

function mostrarError(mensaje) {
         error.textContent = mensaje;

         setTimeout(() => {
         error.textContent = "";
        }, 3000); // 3 Segundos //

}

// Función N° 2: Tiempo de Espera //

function mostrarCarga() {
         resultado.innerHTML = "<p>Cargando información...</p>"; // Mensaje de espera //

}

// Función N° 3: Validaciones //

function validarFecha(fecha) {

         const fechaMinima = dayjs("1995-06-16");

                // Validar si no seleccionó fecha //
                if (!fecha) {
                        mostrarError("Por favor, selecciona una fecha.");
                        return false;
                }

                // Validar fechas futuras //
                if (dayjs(fecha).isAfter(dayjs())) {
                        mostrarError("Debes elegir una fecha igual o anterior a hoy.");
                        return false;
                }

                // Validar fecha mínima APOD // 
                if (dayjs(fecha).isBefore(fechaMinima)) {
                        mostrarError("La fecha debe ser posterior al 16 de junio de 1995");
                        return false;
                }

                return true;
}

// Función N° 4: Evento Botón Buscar //

btnBuscar.addEventListener("click", () => {

          const fecha = fechaInput.value;

                if (!validarFecha(fecha)) {
                        return;
                }

mostrarCarga();

console.log("Fecha válida:", fecha);

});

// Función N° 5: Mostrar APOD //
// Nota Importante: esta función  recibe una APOD y la muestra en pantalla //

function mostrarAPOD(apod) {

        resultado.innerHTML = `
                <h2>${apod.title}</h2>

                <p>
                ${dayjs(apod.date).format("DD [de] MMMM [de] YYYY")}
                </p>

                <img src="${apod.hdurl}" alt="${apod.title}" />

                <p>${apod.explanation}</p>
`;
}




