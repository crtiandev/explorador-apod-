<div align="center">

# 🌌 Explorador APOD

### El universo tiene una nueva historia cada día. Descúbrela.

Aplicación web para explorar la **Astronomy Picture of the Day (APOD)** de NASA, buscar publicaciones por fecha y guardar tus favoritas.

[✨ Funcionalidades](#-qué-puedes-hacer) · [🚀 Inicio rápido](#-inicio-rápido) · [👥 Integrantes](#-integrantes)

</div>

---

## ✨ ¿Qué puedes hacer?

- **Ver la APOD de hoy:** al abrir la página se carga automáticamente la publicación más reciente.
- **Explorar otra fecha:** elige un día desde el **16 de junio de 1995** hasta hoy. La app valida la fecha antes de consultar a NASA.
- **Disfrutar imágenes y videos:** muestra la imagen con su título, fecha en español y explicación. Para los videos, presenta una vista previa y un enlace para verlos en NASA.
- **Guardar tus favoritos ⭐:** conserva la fecha y el título en el almacenamiento local del navegador. Los favoritos siguen disponibles al volver a abrir la página en el mismo navegador; selecciona uno para cargar esa APOD.
- **Recibir mensajes claros:** verás avisos mientras se carga el contenido y mensajes en pantalla si la fecha no es válida o no hay una publicación.

## 🪐 ¿Cómo funciona?

1. La página carga **Day.js** y su configuración en español.
2. Al iniciar, `app.js` consulta la APOD del día usando la API pública de [NASA Science](https://science.nasa.gov/apod/).
3. Al buscar una fecha, valida que esté dentro del rango permitido y solicita la publicación correspondiente.
4. La respuesta se presenta en la página. Si NASA no tiene una APOD para ese día, se informa sin romper la aplicación.
5. Los favoritos se serializan como JSON en `localStorage`, por eso permanecen después de recargar la página en ese navegador.

La aplicación usa los endpoints públicos de APOD de NASA y no requiere una clave API.

## 🚀 Inicio rápido

Necesitas **Node.js y npm**. Desde la carpeta del proyecto, instala las dependencias:

```bash
npm install
```

Después abre `index.html` con **Live Server** desde Visual Studio Code, o sírvelo con cualquier servidor web local. La página carga Day.js desde `node_modules`, por lo que debes ejecutar `npm install` antes de abrirla.

## 🧰 Tecnologías

- **HTML5** para la estructura de la aplicación.
- **CSS3 y Bootstrap 5** para el diseño adaptable.
- **JavaScript** para las búsquedas, las peticiones asíncronas y la interacción con la página.
- **Day.js** para validar y presentar fechas en español.
- **NASA APOD API** para consultar las publicaciones astronómicas.
- **`localStorage` y JSON** para guardar los favoritos en el navegador.
- **npm** para instalar y administrar Day.js.

## 📁 Estructura del proyecto

```text
explorador-apod/
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── index.html
├── package.json
├── package-lock.json
└── .gitignore
```

## 🚀 Link del Deploy
[https://crtiandev.github.io/explorador-apod-/](https://crtiandev.github.io/explorador-apod-/)

## 👥 Integrantes

Proyecto colaborativo del **Grupo 6 — Generation Colombia**:

- **Felipe Ortiz Gamboa**
- **Alexandra Vanessa del Valle Aragón**
- **Kendry Y. Vargas Gaviria**
- **Cristian David Veléz Ramírez**

## 💫 Créditos

Las imágenes, los videos y sus explicaciones pertenecen a sus autores y se consultan desde **NASA Astronomy Picture of the Day**. Este proyecto es una experiencia educativa de exploración; no está afiliado oficialmente con NASA.
