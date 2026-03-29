# tiza. — Spec de rediseño: Generador de fichas
**Versión:** 2.0  
**Fecha:** 31 de marzo de 2026  
**Para:** Claude Code  
**Archivo a reemplazar:** `Generador.jsx`  
**Objetivo:** Reemplazar el stepper multipantalla actual por un flujo de 4 pasos en una sola URL, con sidebar de preview en tiempo real.

---

## Resumen de cambios

| Antes | Después |
|-------|---------|
| 5 pasos en pantallas separadas | 4 pasos en una sola pantalla |
| Grado / Área / Bloque / Objetivo / Confirmar | Grado / Área / Contenido (acordeón) / Opciones+Generar |
| Sin buscador | Buscador directo en la parte superior |
| Checkboxes grises de bajo contraste | Toggles verdes con descripción |
| Sin sidebar | Sidebar con preview de ficha A4 en tiempo real |
| Botón volver inexistente | Botón "‹ volver" explícito en cada paso |
| Selecciones previas se pierden al volver | Chips de confirmación con botón "Cambiar" |

---

## Layout general (desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  navbar: logo tiza. + indicador paso + barra de progreso    │
├────────────────────────────────────┬────────────────────────┤
│                                    │                        │
│  MAIN (flex: 1)                    │  SIDEBAR (260px)       │
│  ─ Buscador                        │  ─ Preview ficha A4    │
│  ─ Chips confirmados               │  ─ Resumen selecciones │
│  ─ Botón volver                    │  ─ Badge DC PBA        │
│  ─ Paso activo                     │                        │
│                                    │                        │
└────────────────────────────────────┴────────────────────────┘
```

**Grid:** `display: grid; grid-template-columns: 1fr 260px`  
**Mobile (< 768px):** columna única, sidebar debajo del main

---

## Paleta de colores

| Token | Valor | Uso |
|-------|-------|-----|
| Verde oscuro | `#004733` | Navbar, botón generar, activos, chips confirmados |
| Verde acento | `#00c48c` | Hover estados, dot DC PBA, ticks, progress bar |
| Verde claro bg | `#E6FAF3` | Fondo ítem activo, toggle on, badge DC PBA |
| Verde claro border | `#5DCAA5` | Borde badge DC PBA |
| Verde texto | `#085041` | Texto badge DC PBA |
| Verde hover btn | `#00603d` | Hover botón generar |
| Fondo app | `#F0F4F2` | Background general |
| Fondo card | `#ffffff` | Cards, botones en reposo |
| Borde suave | `#D4E6DE` | Bordes generales |
| Borde hover | `#EBF2EE` | Divisores internos |
| Texto principal | `#004733` | Títulos, labels activos |
| Texto secundario | `#4a6b60` | Descripciones, subtítulos |
| Texto muted | `#6B8C7D` | Labels, placeholders |
| Texto deshabilitado | `#A0BDB5` | Chevrons, elementos inactivos |

---

## Componente: Navbar

```css
background: #004733;
padding: 14px 28px;
display: flex;
align-items: center;
justify-content: space-between;
position: sticky;
top: 0;
z-index: 10;
```

**Logo:** `font-family: Georgia, serif` NO — mantener Nunito 900 que ya existe. `font-size: 22px; color: #fff; letter-spacing: -1px`. La "ia" en `#00c48c`.

**Derecha del navbar:**
```
[Paso 1 de 4]  [████░░░░ barra progreso]
```
- Label: `font-size: 12px; color: #ffffff70`
- Barra: `width: 100px; height: 3px; background: #ffffff25; border-radius: 99px`
- Fill: `background: #00c48c; transition: width 0.45s cubic-bezier(.22,1,.36,1)`
- Progreso: paso 1 = 25%, paso 2 = 50%, paso 3 = 75%, paso 4 = 100%

---

## Componente: Buscador

Posicionado al tope del área main, antes de los pasos.

```css
display: flex;
align-items: center;
gap: 10px;
background: #fff;
border: 1.5px solid #D4E6DE;
border-radius: 12px;
padding: 10px 16px;
margin-bottom: 22px;
transition: border-color 0.15s;
/* focus-within: border-color: #00c48c */
```

**Placeholder:** `"Buscá directo: "fracciones 4to", "sistema digestivo 6to"..."`  
**Comportamiento:** al escribir, filtra contenidos del DC PBA y muestra resultados. Al seleccionar un resultado, carga el estado completo (grado + área + contenido) y salta directo al paso 4.  
**Fuente de datos:** mismo JSON `dc_pba_base_curricular_corregida.json` ya existente.

---

## Componente: Chips de confirmación

Aparecen encima del paso activo cuando se avanzó de ese paso. Muestran la selección confirmada con opción de cambiar.

```css
/* Chip */
display: flex;
align-items: center;
gap: 10px;
background: #fff;
border: 0.5px solid #D4E6DE;
border-radius: 10px;
padding: 9px 14px;
cursor: pointer;
margin-bottom: 6px;
/* hover: border-color: #00c48c; background: #F8FDFB */
```

**Estructura interna:**
```
[●✓]  GRADO          [Cambiar]
      4° grado
```

- Dot: `width: 18px; height: 18px; border-radius: 50%; background: #004733; color: #00c48c; font-size: 10px`
- Label superior: `font-size: 10px; color: #6B8C7D; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em`
- Valor: `font-size: 13px; color: #004733; font-weight: 500`
- Pill "Cambiar": `font-size: 11px; color: #A0BDB5; background: #F0F4F2; padding: 2px 8px; border-radius: 99px`
- Hover pill "Cambiar": `background: #004733; color: #00c48c`

**Separador después de chips:** `height: 0.5px; background: #D4E6DE; margin: 14px 0`

---

## Componente: Botón volver

```css
display: flex;
align-items: center;
gap: 4px;
font-size: 12px;
color: #6B8C7D;
background: none;
border: none;
cursor: pointer;
padding: 0 0 14px;
/* hover: color: #004733 */
/* visible solo desde paso 2 en adelante */
```

Texto: `‹ volver`

---

## Paso 1 — Grado

**Pregunta:** `"¿Con qué grado trabajamos hoy?"`  
**Subtítulo:** `"Elegí el año de la primaria"`  
**Tipografía pregunta:** `font-family: Georgia, serif; font-size: 21px; font-weight: 400; color: #004733; letter-spacing: -0.02em`

**Grilla de grados:** `grid-template-columns: repeat(3, 1fr); gap: 8px`

### Botón de grado

```css
/* Reposo */
background: #fff;
border: 1.5px solid #D4E6DE;
border-radius: 14px;
padding: 18px 10px;
display: flex; flex-direction: column; align-items: center; gap: 4px;
transition: all 0.18s;

/* Hover */
border-color: #00c48c;
background: #F0FBF7;
transform: translateY(-2px);

/* Activo */
border-color: #004733;
border-width: 2px;
background: #004733;
transform: translateY(-2px);
```

**Número de grado:**
```css
font-family: Georgia, serif;
font-size: 28px;
font-weight: 700;
color: #004733; /* activo: #ffffff */
line-height: 1;
```

**Texto ciclo:**
```css
font-size: 9px;
color: #6B8C7D; /* activo: #00c48c */
text-align: center;
line-height: 1.4;
```

**Contenido de los botones:**
| Botón | Número | Ciclo |
|-------|--------|-------|
| 1 | 1° | Unidad Pedagógica |
| 2 | 3° | Primer ciclo |
| 3 | 4° | Segundo ciclo |
| 4 | 5° | Segundo ciclo |
| 5 | 6° | Segundo ciclo |
| 6 | 7° | Segundo ciclo |

**Comportamiento:** al hacer clic avanza automáticamente al paso 2 después de 240ms (para que el estado activo sea visible brevemente).

---

## Paso 2 — Área

**Pregunta:** `"¿Qué área trabajamos?"` + subtítulo dinámico: `"{grado} · elegí la materia"`  
**Grilla:** `grid-template-columns: 1fr 1fr; gap: 8px`

### Tarjeta de área

```css
/* Base */
border-radius: 14px;
padding: 16px;
cursor: pointer;
display: flex; align-items: flex-start; gap: 12px;
transition: all 0.18s;
border: 1.5px solid transparent;

/* Hover */
transform: translateY(-2px);
filter: brightness(0.96);

/* Activo */
border-width: 2px;
border-color: #004733;
```

**Colores por área:**
| Área | Fondo reposo | Borde reposo |
|------|-------------|--------------|
| Matemática | `#E8F0FF` | `#C5D5FF` |
| Prácticas del Lenguaje | `#FFF0E8` | `#FFD5B8` |
| Cs. Naturales | `#E8FFF4` | `#B8FFDC` |
| Cs. Sociales | `#FEF9E0` | `#FDE98A` |

**Ícono:** `font-size: 22px`  
**Nombre área:** `font-size: 13px; font-weight: 600; color: #004733`  
**Descripción:** `font-size: 11px; color: #4a6b60; line-height: 1.4`

**Contenido:**
| Área | Ícono | Descripción |
|------|-------|-------------|
| Matemática | 🔢 | Números, geometría, medidas |
| Prácticas del Lenguaje | 📖 | Lectura, escritura, oralidad |
| Cs. Naturales | 🔬 | Seres vivos, cuerpo, materiales |
| Cs. Sociales | 🌍 | Historia, geografía, sociedad |

**Comportamiento:** al hacer clic avanza al paso 3 después de 240ms.

---

## Paso 3 — Contenido (acordeón)

**Pregunta dinámica:** `"¿Qué contenido de {área}?"`  
**Subtítulo:** `"Diseño Curricular PBA · elegí el bloque y el objetivo"`  
**Fuente de datos:** `dc_pba_base_curricular_corregida.json`

### Bloque del acordeón

```css
/* Contenedor */
background: #fff;
border: 0.5px solid #D4E6DE;
border-radius: 12px;
overflow: hidden;
margin-bottom: 6px;

/* Header del bloque */
display: flex; align-items: center; justify-content: space-between;
padding: 12px 16px;
cursor: pointer;
font-size: 13px; font-weight: 500; color: #004733;
min-height: 44px;
transition: background 0.12s;

/* Header hover */
background: #F0FBF7;

/* Header abierto */
background: #E6FAF3;
border-bottom: 0.5px solid #D4EEE3;
```

**Chevron:** `font-size: 12px; color: #A0BDB5; transition: transform 0.2s`  
**Chevron abierto:** `transform: rotate(90deg); color: #00c48c`

**Solo un bloque abierto a la vez.** Al abrir uno, se cierran los demás.

### Ítem de objetivo dentro del acordeón

```css
padding: 10px 16px 10px 28px;
font-size: 13px;
color: #4a6b60;
cursor: pointer;
border-top: 0.5px solid #EBF2EE;
min-height: 44px; /* accesibilidad táctil */
display: flex; justify-content: space-between; align-items: center;
line-height: 1.4;
transition: background 0.1s;

/* Hover */
background: #F0FBF7;
color: #004733;

/* Activo */
background: #E6FAF3;
color: #004733;
font-weight: 500;
```

**Tick de confirmación:** `font-size: 12px; color: #00c48c` — visible solo cuando activo.

**Comportamiento:** al hacer clic en un objetivo avanza al paso 4 después de 260ms.

---

## Paso 4 — Opciones y generar

**Pregunta:** `"Últimos detalles"`  
**Subtítulo:** `"¿Qué querés que incluya la ficha?"`

### Toggle de opciones

```css
/* Contenedor */
display: flex; align-items: flex-start; gap: 14px;
background: #fff;
border: 0.5px solid #D4E6DE;
border-radius: 12px;
padding: 14px 16px;
cursor: pointer;
margin-bottom: 8px;
transition: all 0.15s;

/* Hover */
border-color: #00c48c;
background: #F8FDFB;

/* Estado ON */
border-color: #004733;
background: #E6FAF3;
```

**Toggle switch:**
```css
width: 40px; height: 22px;
border-radius: 99px;
background: #D4E6DE; /* ON: #004733 */
position: relative;
transition: background 0.2s;
```

**Dot del toggle:**
```css
position: absolute; top: 3px; left: 3px;
width: 16px; height: 16px;
border-radius: 50%;
background: #fff;
transition: transform 0.2s;
/* ON: transform: translateX(18px) */
```

**Título del toggle:** `font-size: 13px; font-weight: 500; color: #004733`  
**Descripción del toggle:** `font-size: 12px; color: #6B8C7D; line-height: 1.5`

**Opciones:**
1. **Incluir explicación del tema** — *"Agrega un párrafo explicativo antes de las actividades"*
2. **Incluir ejemplo concreto** — *"Agrega un ejemplo cercano a la experiencia del alumno"*

Ambas activadas por defecto.

### Botón Generar ficha

```css
width: 100%;
padding: 15px;
background: #004733;
color: #ffffff;
border: none;
border-radius: 12px;
font-size: 15px;
font-weight: 600;
cursor: pointer;
letter-spacing: -0.2px;
margin-top: 16px;
transition: all 0.18s;

/* Hover */
background: #00603d;
transform: translateY(-1px);

/* Active */
transform: scale(0.98);
```

Texto: `"Generar ficha ✦"`

**Nota debajo del botón:**  
`font-size: 12px; color: #6B8C7D; text-align: center; margin-top: 8px`  
Texto: `"Tarda unos segundos · Alineada al Diseño Curricular PBA"`

---

## Componente: Sidebar — Preview de ficha

### Estructura general

```css
background: #fff;
border-left: 0.5px solid #D4E6DE;
padding: 20px;
display: flex; flex-direction: column; gap: 12px;
```

### Mini hoja A4

Simula visualmente la ficha que se va a generar. Se actualiza en tiempo real con cada selección.

```css
/* Contenedor hoja */
background: #fff;
border-radius: 8px;
border: 0.5px solid #D4E6DE;
overflow: hidden;
box-shadow: 0 2px 8px rgba(0,70,50,0.08);
```

**Header de la hoja:**
```css
background: #004733;
padding: 8px 12px;
```

- Tags (grado/área/contenido): pills pequeños que pasan de gris vacío a `#00c48c` al completarse
- Título: `font-size: 11px; font-weight: 600; color: #fff` — se actualiza con la selección

**Estados del título:**
| Estado | Texto |
|--------|-------|
| Sin elegir | `"Tu ficha aparece acá"` (italic, opaco) |
| Grado elegido | `"{grado} grado"` |
| Área elegida | `"{área} · {grado}"` |
| Contenido elegido | `"{contenido}"` (el objetivo seleccionado) |

**Cuerpo de la hoja — bloques de sección:**

Cada bloque tiene:
- Header: número + nombre de sección
- Body: representación visual del contenido (líneas = texto, cajitas = espacios para completar)

```
Estado oculto (sin contenido elegido): opacity: 0.18; filter: grayscale(1)
Estado visible (con contenido elegido): opacity: 1; colores activos
```

| Bloque | Número | Nombre | Representación visual |
|--------|--------|--------|-----------------------|
| Explicación | 1 | Explicación | 3 líneas horizontales verdes |
| Ejemplo | 2 | Ejemplo | 1 cajita verde |
| Actividad | 3 | Actividad | 1 línea + 3 cajitas en fila + 1 línea |
| Reflexión | 4 | Reflexión | 2 líneas horizontales |

**Los bloques Explicación y Ejemplo se ocultan si sus toggles están desactivados en el paso 4.**

**Renumeración automática:** si se desactiva "Explicación", los números del resto bajan (Actividad pasa a ser 1, etc).

### Resumen de selecciones

```css
background: #F0F4F2;
border-radius: 12px;
padding: 12px 14px;
```

Tres filas: Grado / Área / Contenido  
- Clave: `font-size: 11px; color: #6B8C7D`  
- Valor: `font-size: 11px; color: #004733; font-weight: 500`  
- Valor vacío: `color: #C4D9D0; font-weight: 400; font-style: italic`

### Badge DC PBA

```css
display: flex; align-items: center; gap: 8px;
font-size: 12px; color: #085041;
background: #E6FAF3;
border: 0.5px solid #5DCAA5;
border-radius: 10px;
padding: 9px 12px;
cursor: pointer;
/* hover: opacity: 0.8 */
```

- Dot: `width: 6px; height: 6px; border-radius: 50%; background: #00c48c`
- Texto: `"Alineado al Diseño Curricular PBA 2018 ↗"`
- Link: abre el PDF oficial del DC PBA en nueva pestaña

---

## Lógica de estado

```js
const state = {
  grado: null,        // ej: "4°"
  gradoCiclo: null,   // ej: "Segundo ciclo"
  area: null,         // ej: "Matemática"
  bloque: null,       // ej: "Números racionales" (interno, no mostrado al usuario)
  objetivo: null,     // ej: "Reconocer fracciones equivalentes"
  incluirExplicacion: true,
  incluirEjemplo: true,
  paso: 1
};

// Reseteos en cascada:
// Al cambiar grado → resetear area, bloque, objetivo
// Al cambiar area → resetear bloque, objetivo
// Al cambiar bloque/objetivo → resetear solo objetivo

// Avance automático:
// Elegir grado → goTo(2) después de 240ms
// Elegir area → goTo(3) después de 240ms
// Elegir objetivo → goTo(4) después de 260ms

// Buscador:
// Al seleccionar resultado → cargar grado+area+bloque+objetivo en state → goTo(4)
```

---

## Animación de transición entre pasos

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Aplicar en cada nuevo paso activo */
animation: fadeUp 0.32s cubic-bezier(.22, 1, .36, 1) both;
```

---

## Conexión con API existente

El estado final del paso 4 debe mapear a la estructura que ya recibe `api/generate.js`:

```js
{
  contenido: {
    grado: state.grado,          // "4"
    area: state.area,            // "Matemática"
    bloque: state.bloque,        // "Números racionales"
    item: state.objetivo,        // "Reconocer fracciones equivalentes"
    contexto_pedagogico: `Incluir explicación: ${state.incluirExplicacion}. Incluir ejemplo: ${state.incluirEjemplo}.`
  },
  tipoFicha: "Ficha de trabajo"
}
```

---

## Notas de implementación

- Todos los ítems de acordeón deben tener `min-height: 44px` (mínimo táctil)
- El sidebar usa `position: sticky; top: 80px` en desktop
- En mobile (< 768px): el sidebar se mueve debajo del área principal
- Los datos de bloques y objetivos vienen de `dc_pba_base_curricular_corregida.json` — mismo JSON que ya usa el generador actual
- El buscador filtra sobre los campos `item` y `bloque` del JSON, opcionalmente también `area`
- Mantener las animaciones de entrada existentes (`fadeUp`) para consistencia

---

*Spec generada el 31 de marzo de 2026 — tiza. update mayor*
