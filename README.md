# Explorador APOD integrado

Proyecto integrado con aportes de Alexandra, Cristian, Felipe y Kendry. Los comentarios en `index.html`, `css/styles.css` y `js/app.js` señalan los requisitos de la guía que atiende cada bloque.

## Mapa de la guía

- **Preparación NPM (pasos 2.1-2.4):** `package.json` declara Day.js; `package-lock.json` fija la versión; `.gitignore` excluye `node_modules/`.
- **Carga de Day.js (paso 2.5):** `index.html` carga la librería y el idioma español desde `node_modules` antes de `js/app.js`.
- **APOD al abrir (funcionalidad 1):** `js/app.js`, `cargarApod(fechaHoy)`.
- **Buscar por fecha y validar (funcionalidad 2):** `index.html` y `js/app.js`, `validarFecha` y el evento de búsqueda.
- **Favoritos persistentes (funcionalidad 3):** `js/app.js`, `leerFavoritos`, `guardarFavoritos`, `mostrarFavoritos` y `agregarFavorito`.
- **Presentación adaptable:** `css/styles.css`.

## Ejecutar

En una terminal dentro de la carpeta del proyecto, ejecuta `npm install` para crear `node_modules/`. Después abre `index.html` con Live Server o un servidor local. El proyecto consulta los endpoints públicos APOD de NASA descritos en la guía, sin API key.
