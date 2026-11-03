# Explorador APOD integrado

Proyecto que reúne los aportes incluidos en los ZIP de Alexandra, Cristian, Felipe y Kendry.

## Funcionalidades integradas

- Interfaz en español con búsqueda de APOD por fecha y límites válidos.
- Mensajes de carga, validación y error, y presentación de imágenes o videos.
- Favoritos persistentes en el navegador, con acceso directo para volver a consultar una fecha.
- Estilos visuales de alto contraste, foco visible y contenido adaptable.

## Ejecución

Abre `index.html` mediante un servidor web local o publícalo como sitio estático. La aplicación consulta la API pública de NASA con `DEMO_KEY`, que tiene límites de uso compartido.

Los ZIP recibidos no incluían una clave API propia. Si se requiere más capacidad, se puede configurar una clave de NASA en `js/app.js`.
