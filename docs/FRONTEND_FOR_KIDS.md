# 🎨 ¡Hola! Soy tu página web de tareas 📝

Imagina que soy como una libreta mágica donde puedes apuntar todas las cosas que tienes que hacer. ¡Vamos a ver cómo funciono por dentro!

## 🦴 El esqueleto (`index.html`)

Piensa en mí como si fuera un cuerpo humano. El archivo `index.html` es mi **esqueleto**.

-   **Mi cabeza (`<head>`)**: Aquí guardo mi nombre ("TaskFlow Manager") y me pongo mis "accesorios", como los lentes para ver los iconos bonitos (eso es `Font Awesome`) y los enlaces a mi ropa (`styles/main.css` y `styles/components.css`).
-   **Mi cuerpo (`<body>`)**: Aquí está todo lo que puedes ver:
    -   Un **sombrero (`<header>`)** con mi título y botones para cambiar a modo oscuro o exportar tus tareas.
    -   Un **formulario (`<form>`)** que es como una hoja en blanco para que escribas nuevas tareas. ¡Puedes ponerles título, descripción, fecha y prioridad!
    -   Unos **filtros** para que puedas buscar tareas específicas, como si buscaras solo los cromos de color rojo.
    -   Unas **tarjetas de estadísticas** que te dicen cuántas tareas tienes en total, cuántas te faltan y cuántas has completado. ¡Como un marcador de un juego!
    -   Una **lista (`<div id="taskList">`)** donde aparecen todas las tareas que has escrito.
    -   Unos **pies (`<footer>`)** con información sobre mis creadores.

## 🧠 El cerebro (Los archivos de `scripts`)

Si el esqueleto es el cuerpo, los archivos de `scripts` son mi **cerebro**. ¡Hacen que todo se mueva y funcione!

-   **`taskManager.js` (El organizador de tareas)**: Este es el jefe de las tareas. Sabe cómo:
    -   **Guardar** tus tareas en una cajita mágica (se llama `localStorage`, ¡así no se pierden si cierras la página!).
    -   **Añadir** nuevas tareas a la lista.
    -   **Tachar** las tareas que ya has terminado.
    -   **Borrar** las que ya no necesitas.
-   **`app.js` (El director de orquesta)**: Este archivo es como el director de una orquesta. Le dice a todos qué hacer.
    -   Cuando haces clic en el botón "Agregar Tarea", él le dice al `taskManager` que guarde una nueva tarea.
    -   Cuando marcas una tarea como completada, él se encarga de que se vea tachada.
    -   ¡Está atento a todos los botones y menús para que hagan lo que tienen que hacer!
-   **`utils.js` (La caja de herramientas)**: Este archivo es como una caja de herramientas con cosas útiles. Por ejemplo, tiene una herramienta para que las fechas se vean bonitas ("Hoy", "Mañana", etc.) y otra para ponerle un color a cada prioridad.

## 🎨 La ropa (Los archivos de `styles`)

Los archivos de `styles` son mi **ropa**. ¡Hacen que me vea genial!

-   **`main.css` (El conjunto principal)**: Este es mi conjunto de ropa principal. Define los colores, el tipo de letra y el tamaño de todo. También tiene un "traje de noche" (el modo oscuro) para cuando apagas la luz.
-   **`components.css` (Los accesorios)**: Este archivo le da estilo a cada parte pequeña, como los botones, las tarjetas de las tareas y los menús. Se asegura de que cada tarea se vea como una tarjeta bonita y ordenada.

---

### En resumen:

-   **`index.html`**: Es el **esqueleto** que me da forma.
-   **`scripts`**: Es el **cerebro** que me hace inteligente y me permite recordar tus tareas.
-   **`styles`**: Es la **ropa** que me hace ver increíble.

¡Y así es como funciono! Soy tu ayudante para que nunca olvides lo que tienes que hacer. 😊
