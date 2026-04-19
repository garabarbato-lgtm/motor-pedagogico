YOLO mode is enabled. All tool calls will be automatically approved.
YOLO mode is enabled. All tool calls will be automatically approved.
# 🟢 tiza. — Manual Maestro del Proyecto
> **Última actualización:** 19 de abril de 2026  
> **Estado:** En producción (`fichastiza.vercel.app`)

---

## 1. ¿Qué es tiza.? + Stack + Branding

**tiza.** es una aplicación web que genera fichas educativas con IA para docentes de primaria de la Provincia de Buenos Aires, alineadas rigurosamente al **Diseño Curricular PBA 2018 (DC PBA)**.  
**Diferencial clave:** El DC PBA está embebido como una base de datos estructurada. El docente selecciona un objetivo curricular real; la IA no "alucina" el contenido pedagógico, lo calibra según la norma oficial.

### Stack Técnico
- **Frontend:** React + Vite + Tailwind CSS.
- **Backend:** Vercel Functions (Node.js).
- **IA:** Anthropic API — **Claude Haiku** (generación veloz) y **Sonnet** (validación y mejoras complejas).
- **Infraestructura:** Vercel (`maxDuration: 60` para evitar timeouts).

### Identidad Visual (Branding)
- **Nombre:** `tiza.` (siempre minúsculas con punto).
- **Tipografía:** Logo en `Nunito 900`, cuerpo y app en `Lexend`.
- **Paleta de Colores:**
    - **Verde Primario:** `#004733` (fondo tiza oscuro).
    - **Verde Acento:** `#00c48c` (usado en las letras "ia" del logo y botones principales).
    - **Acento Cálido:** `#F5A623` (alertas, recordatorios y secciones de "Pizarrón").
    - **Fondo App:** `#F5F5F5` | **Texto:** `#2B2B2B` | **Bordes:** `#D9D9D9`.

---

## 2. Estado actual del producto

El sistema se encuentra operativo y validado por docentes en entorno real.

- **Fuente de Verdad Curricular:** `dc_pba_base_curricular_corregida.json` (435 registros con indicadores de avance).
- **Flujo de Usuario:** 4 pasos integrados en una sola pantalla con **Sidebar de preview A4 en tiempo real**.
- **Generación Estructurada:** Respuestas de IA en JSON que permiten edición inline ("click-to-edit") antes de la descarga.
- **Validación:** Pipeline con scoring automático (umbral de calidad: 80/100).
- **Tipos de ejercicio:** `completar_oraciones`, `tabla`, `verdadero_falso`, `situacion_problematica`, `ordenar_secuencia`, entre otros.
- **Reglas específicas:** Fracciones siempre en formato HTML vertical (`<frac>`), nunca inline ("1/2").

---

## 3. Spec de fichas por tipo (Presentación / Práctica / Cierre)

Toda ficha generada debe pertenecer a una de estas tres categorías pedagógicas, ajustando sus proporciones y contenido:

### Estructura Común
- **Encabezado (15%):** Título con dos emojis cotidianos, campos de Nombre, Fecha y Grado.
- **Andamiaje ("Recordá"):** Recuadro al margen derecho con tips o conceptos breves. La IA decide su aparición según la complejidad.
- **Márgenes A4:** 0.5–1cm. Footer con etiquetas curriculares y marca tiza.

### A. Ficha de Presentación
- **Propósito:** Introducir un tema nuevo.
- **Distribución:** Explicación (65%) | Ejercicios (35%).
- **Contenido:** Varios párrafos con conceptos clave en **negrita**. Incluye "Pills" laterales (datos curiosos o preguntas disparadoras).
- **Ejercicios:** Uno obligatorio (Situación problemática en Matemática, Pregunta abierta en Ciencias).

### B. Ficha de Práctica
- **Propósito:** Consolidar conocimientos previos.
- **Distribución:** Explicación breve (15%) | Ejercicios (70%).
- **Contenido:** Recuadro verde compacto con un recordatorio conceptual.
- **Ejercicios:** 3 a 4 actividades. Incluye al menos una consigna de reflexión integrada.

### C. Ficha de Cierre
- **Propósito:** Evaluación y síntesis.
- **Distribución:** Ejercicios en escalera (85%).
- **Estructura:** 4 peldaños de dificultad creciente:
    - **Nivel 1:** Baja demanda (V/F, tablas).
    - **Nivel 2:** Media demanda (Problemas, secuencias).
    - **Nivel 3:** Alta demanda (Justificar, crear).
    - **Nivel 4:** Reflexión ("Punto de descanso").

### Niveles de Diferenciación
- **Con más apoyo:** Consignas cortas, vocabulario simple, más andamiaje, menos ítems.
- **Puede ir más lejos:** Consignas abiertas, mayor demanda de justificación, sin andamiaje.

---

## 4. Auditoría UX Pendiente (Problemas Críticos)

1. **Inflación de Flujo:** El usuario percibe 5 pantallas aunque la landing promete 3.
2. **Bucle de Redundancia:** El sistema a veces pide confirmar una categoría que ya fue seleccionada (ej. seleccionar Ciencias y luego volver a confirmar Ciencias).
3. **Dispersión en Desktop:** En pantallas grandes, los elementos están muy alejados (ping-pong visual). Se recomienda un layout de columnas progresivas.
4. **Fricción de Puntería:** Iconos de edición (lápices) muy pequeños para dispositivos táctiles.
5. **Aprovechamiento del Sidebar:** El menú lateral está subutilizado; debería mostrar el "Resumen de Configuración" activo.

---

## 5. Features Futuras (Roadmap)

### Motor de Secuencias Didácticas (MSD)
Generación de trayectorias completas (3 a 6 clases) con:
- **Planificación:** Fundamentación técnica para directivos.
- **Guía Docente:** Consignas de intervención y qué preguntar en clase.
- **Pizarrón:** Texto síntesis para que el alumno copie en la carpeta.
- **Exportación:** Pack unificado en PDF.

### Otras Mejoras
- **Exportación a DOCX:** Crítico para que el docente edite en Word antes de imprimir en la escuela.
- **PDL con Texto Externo:** El docente sube un fragmento de texto y la IA genera actividades de lectura/escritura sobre él.
- **Biblioteca:** Guardado de fichas con score alto para reutilización.

---

## 6. Cómo trabajamos + Backlog

### Metodología de Co-Dev
1. **Diego:** Define decisiones pedagógicas, de producto y branding.
2. **Claude (Chat):** Actúa como arquitecto, redacta specs y diseña prompts.
3. **Claude Code (Terminal):** Implementa el código en el repositorio.
4. **REGLA DE ORO:** Los prompts para Claude Code **siempre** deben ser revisados por Diego antes de su ejecución.
5. **Localización:** Siempre español rioplatense (voseo), moneda `$`, contexto de Buenos Aires, Argentina.

### Backlog Priorizado
> Última sincronización con Notion: 19/04/2026

**Infraestructura (bloqueante)**
- [ ] **Manejo de errores de API y timeouts** — Toast amigable + retry automático 1 vez antes de mostrar error.
- [ ] **Sistema de autenticación (Supabase Auth)** — Login Google/email. Prerrequisito bloqueante para la Biblioteca.

**Motor Pedagógico**
- [ ] **Pills de Momento didáctico y Nivel del grupo** — Inyectar contexto pedagógico en el prompt (reemplaza toggles Explicación/Ejemplo).
- [ ] **Indicadores de avance en el prompt** — Ya están en el JSON, falta inyectarlos como referencia en generate.js.

**UI/UX**
- [ ] **Botón de feedback post-generación** — FAB en Paso 4, oculto durante descarga PDF. Guarda en Notion/Sheets vía webhook.
- [ ] **Onboarding primer uso** — Tooltip o pantalla de bienvenida, solo primera visita.
- [ ] **Compartir ficha por link único** — Botón "Compartir" en Paso 4.

**Output**
- [ ] **Exportación DOCX** — Crítico (pedido por Chori): ficha → Word → dirección → fotocopiadora.
- [ ] **PDF full-width en todos los tipos de ficha** — Asegurar que Práctica, Cierre y Presentación exporten bien.

**Features futuras**
- [ ] **Biblioteca de fichas** — Requiere auth. Guardado de fichas con score > 80.
- [ ] **Analytics básicos** — Qué grados/áreas se usan más, fichas por día.
- [ ] **Secuenciador de clases** — 3 a 6 clases encadenadas con planificación, guía docente y pizarrón.
- [ ] **PDL con texto externo** — El docente sube un fragmento, la IA genera actividades sobre él.
