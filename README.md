# Mini Theory of Change (React + Tailwind)

Vista interactiva basada en React + Tailwind que implementa un “Mini Theory of Change” con los módulos: Reason, People, Assumptions, Direct Outcomes, Indirect Outcomes, Ultimate Impact y un botón de guardado (estado local, sin backend).

Este repositorio cumple los criterios de aceptación descritos en el reto, priorizando accesibilidad, mantenibilidad y UX responsiva.

## Tecnologías
- React (Vite)
- TailwindCSS
- Heroicons (outline/solid)

## Requisitos previos
- Node.js >= 16
- npm o yarn (se asume npm en los comandos)

## Instalación
```bash
npm install
```

## Desarrollo (hot reload)
```bash
npm run dev
```
Abrir la URL que muestra Vite (por defecto http://localhost:5173).

## Build de producción
```bash
npm run build
```
El artefacto queda en `dist/`.

Para previsualizar el build localmente:
```bash
npm run preview
```

## Estructura relevante
- src/App.jsx: composición de la vista, estado raíz y barra de guardado.
- src/components/
  - ReasonTextarea.jsx: textarea con helper y contador N/250.
  - TagsInput.jsx: entrada de tags con accesibilidad y atajos.
  - AssumptionsTable.jsx: tabla editable con CRUD, pills de certeza y paginación (5 por página).
  - DirectOutcomes.jsx: acordeón con Outcomes y Suboutcomes (CRUD + Show more/Less).
  - EditableList.jsx: listas editables (Indirect/Ultimate) con Show more/Less.
  - SaveBar.jsx: botón de guardado (solo habilitado cuando hay cambios).
- src/index.css: reglas globales (cards, scroll invisible, estilos).
- tailwind.config.js, postcss.config.js, vite.config.js: configuración de tooling.

## Criterios de aceptación (Checklist)
- Cards con altura fija y scroll invisible
  - Todas las cards usan un body con altura fija (`h-64`) y `overflow-auto` con scrollbars ocultas (clase `scroll-hidden`).
  - Show more/Less desplaza el contenido interno sin cambiar la altura de la card.
- Reason
  - Textarea con placeholder, helper visible y contador N/250.
  - Focus ring visible y label asociado (accesible).
- People
  - Add each participant type and press Enter.
  - No se permiten duplicados (case-insensitive).
- Assumptions
  - Tabla con columnas: Description, Certainty, Actions.
  - CRUD inline: Enter guarda, Esc cancela; blur NO guarda.
  - Certainty como select con pills de color.
  - Paginación cliente (5 filas por página) con Prev/Next y resumen.
- Direct outcomes
  - Acordeón por outcome, iconos neutrales.
  - CRUD para outcomes y suboutcomes (Enter/Esc; blur NO guarda).
  - Show more/Less del listado de outcomes usa scroll interno.
- Indirect / Ultimate
  - Listas editables; muestran 3 ítems y permiten Show more/Less con scroll interno.
- Save
  - Botón en bottom-right, deshabilitado cuando no hay cambios (estado “dirty”).
  - Al guardar: imprime JSON consolidado en consola, muestra “Saved!”, persiste snapshot local (localStorage) y resetea “dirty”.
- Responsive
  - Layout responsive para móvil, tablet y desktop (grid adaptativa y estilos fluidos).
- Accesibilidad
  - Focus rings visibles, `aria-label` en botones de iconos, labels asociados a inputs/textarea.

## Cómo probar manualmente
1. Reason
   - Escribir texto y verificar el contador (N/250) y el focus ring.
2. People (Tags)
   - Escribir un tag y pulsar Enter → se añade.
   - Pulsar × en un tag → se elimina.
   - Con input vacío, pulsar Backspace → elimina el último tag.
   - Intentar añadir un duplicado (mayúsculas/minúsculas distintas) → no se añade.
3. Assumptions
   - Añadir una fila escribiendo en “Add new assumption…” y Enter o botón Add.
   - Editar una fila con ✏, pulsar Enter para guardar o Esc para cancelar.
   - Cambiar la certeza con el select y ver la pill de color.
   - Usar Prev/Next y comprobar que son 5 filas por página.
4. Direct Outcomes
   - Añadir un outcome con el input inferior (Enter).
   - Expandir un outcome, añadir suboutcomes (Enter), editar y eliminar suboutcomes.
   - Editar el título del outcome con ✏ (Enter/Esc).
   - Usar Show more/Less para la lista de outcomes, verificando que la card no cambia de altura.
5. Indirect / Ultimate
   - Añadir ítems (Enter), editar (Enter/Esc) y eliminar.
   - Usar Show more/Less y comprobar scroll interno.
6. Save
   - Realizar cambios en cualquier sección → el botón Save se habilita.
   - Pulsar Save → ver JSON consolidado en consola, alerta “Saved!” y que el botón vuelve a deshabilitarse.
   - Refrescar la página → los datos persisten desde localStorage.

## Decisiones de diseño / UX
- Scroll interno y altura fija en cards para mantener el layout estable.
- Íconos neutrales (sin lógica de color) en Direct Outcomes, como se solicita.
- Accesibilidad reforzada con labels, aria-labels y focus rings.
- Paginación en Assumptions para listas largas (5/pg) acorde a requisitos.

## Calidad y mantenibilidad
- Componentes modulares con responsabilidades claras.
- Nombres de variables y props autoexplicativos.
- Sin dependencias innecesarias.
- Almacenamiento local opcional para mejorar la experiencia durante revisión.

## Scripts disponibles
- `npm run dev`: entorno de desarrollo con hot reload.
- `npm run build`: compila el proyecto para producción.
- `npm run preview`: sirve el build localmente para verificación.

## Notas
- No hay backend; el guardado es solo en memoria/localStorage.
- Las capturas o prototipos se tomaron como guía; se favoreció UX clara y responsiva sobre el pixel-perfect.
