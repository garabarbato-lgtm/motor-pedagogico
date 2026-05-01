# Motor Pedagógico PBA — Contexto del proyecto

## Qué es este proyecto

Sistema de IA que transforma objetivos curriculares del Diseño Curricular de la Provincia de Buenos Aires en recursos educativos concretos para docentes, estudiantes y familias.

Un docente selecciona grado, área y contenido → el sistema genera explicación + ejemplo + actividad lista para usar en el aula.

## Estado actual

**MVP en producción desde abril 2026** → [fichastiza.vercel.app](https://fichastiza.vercel.app)

**Stack en producción:**
- Frontend: React 18 + Vite
- Backend: Vercel Functions
- API: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- PDF: html2canvas + jsPDF
- Word: docx + file-saver
- Auth/DB: Supabase (Google login + fichas guardadas)
- Analytics: @vercel/analytics (inyectado en main.jsx)
- Animaciones: gsap
- Base curricular: dc_pba_base_curricular_corregida.json
- Iconos: @phosphor-icons/react + lucide-react
- Fuente: Lexend Deca

**Funcionalidades implementadas:**
- Flujo en 4 pasos: grado → área → contenido → ficha generada
- 4 tipos de ficha: Trabajo, Práctica, Cierre y Presentación
- Edición inline de todos los campos (modo Word con toolbar fija)
- Exportación PDF multi-página (html2canvas + jsPDF)
- Exportación Word (.docx) con diseño tiza
- Impresión directa (oculta toolbar y feedback button)
- Retry automático (1 vez) + mensajes de error diferenciados por tipo
- Botón de feedback flotante (Google Form)
- Landing con HowItWorks, AboutTiza y SloganSlider
- Onboarding primer uso (modal con localStorage, solo primera visita)
- Analytics básicos (Vercel Analytics, pageviews automáticos)
- Autenticación con Google (Supabase Auth)
- Biblioteca de fichas guardadas por docente (Supabase)

## Base de datos curricular

Archivo: dc_pba_base_curricular_corregida.json (251 registros)

Estructura de cada registro:
```json
{
  "id": "mat_g3_001",
  "area": "Matemática",
  "grado": "3",
  "bloque": "Operaciones con Números Naturales",
  "item_original": "Multiplicación: problemas en distintos sentidos",
  "objetivo": "Resolver problemas de multiplicación que involucran series proporcionales, organizaciones rectangulares y combinación de elementos, relacionando las distintas situaciones con la escritura multiplicativa",
  "tipo": "contenido"
}
```

### Áreas y bloques

**Matemática (121 registros)**
Bloques: Números Naturales · Operaciones con Números Naturales · Números Racionales · Medidas · Geometría · Espacio · Proporcionalidad

**Ciencias Naturales (55 registros)**
Bloques: Seres vivos · Materiales · El mundo físico · La Tierra y el universo

**Ciencias Sociales (37 registros)**
Bloques: Las sociedades a través del tiempo · Sociedades y territorios · Ciudadanía y participación

**Prácticas del Lenguaje (38 registros)**
Bloques: Lectura literaria · Escritura creativa · Lectura de textos informativos · Escritura de textos informativos · Ortografía y sistema de escritura · Medios y ciudadanía

## Prompt pedagógico validado

Este prompt genera recursos correctos. Usarlo siempre igual:

```
Sos un docente experto en didáctica de nivel primario de la Provincia de Buenos Aires.

Generá un recurso educativo breve para este contenido curricular:

Grado: [X]° año
Área: [X]
Bloque: [X]
Contenido: [X]
Objetivo de aprendizaje: [X]

El recurso debe tener esta estructura exacta en JSON:
{
  "titulo": "título claro y atractivo para el alumno",
  "explicacion": "explicación breve del concepto en lenguaje claro para primaria (3-4 oraciones)",
  "ejemplo": "un ejemplo concreto y cercano a la experiencia del alumno",
  "actividad": "una actividad significativa que invite a pensar, no mecánica"
}

Respondé SOLO con el JSON, sin texto adicional ni markdown.
```

Modelo: claude-sonnet-4-20250514 — max_tokens: 1000

## Backlog — Próximos pasos

Todo el backlog original está implementado. Próximas iteraciones posibles:

1. **Compartir ficha por link único** — Botón "Compartir" en Paso 4. Fase 1: encodar estado en URL (base64 o params). Fase 2: guardar por ID en Supabase (ya tiene auth).

2. **Analytics de eventos** — Los pageviews son automáticos con Vercel Analytics. Falta trackear eventos custom: ficha generada, PDF descargado, área seleccionada, Word descargado.

3. **Mejoras de la Biblioteca** — Búsqueda/filtro por área o grado. Previsualización sin salir de la lista.

4. **Compartir ficha con alumnos** — Link público (sin login) que carga la ficha en modo lectura.

## Decisiones pedagógicas — NO revertir sin consultar

- Criterio de contenidos: solo lo que un docente reconoce como algo que enseña en el aula
- Estructura del recurso: título + explicación breve + ejemplo concreto + actividad significativa
- PDL organizado por tipo de práctica (lectura, escritura, ortografía) en lugar de ámbitos del DC
- Ortografía en PDL especifica el tema exacto por grado (ej: tilde en hiato en 5°)
- Base: 435 registros limpios — no agregar sin validar contra el DC PBA

## Decisiones de UI — NO revertir sin consultar

- Paleta ficha: fondo `#ffffff`, acento `#00c48c`, texto `#0d1f1a`, muted `#555555`
- Pills/Andamiaje: sin formas ovaladas — solo recuadros, post-it, borde izquierdo, sombra o doble borde
- Espacio de respuesta por tipo de ejercicio:
  - Preguntas / texto libre → `LineasRespuesta`
  - Cuentas / dibujos / `situacion_problematica` / `resolver_operaciones` / `completar_la_cuenta` → `RecuadroRespuesta` (caja sin líneas)
  - Tablas y V/F → estructura inline, sin espacio adicional
- Iconos: @phosphor-icons/react (no emojis en toolbar)
- Botón PDF: verde `#00c48c`, no naranja
- FeedbackButton: clase CSS `feedback-button` para ocultarlo en impresión

## Notas técnicas

- API key de Claude: variable de entorno ANTHROPIC_API_KEY
- El JSON curricular se carga desde el repositorio (dc_pba_base_curricular_corregida.json)
- Modelo en producción: `claude-haiku-4-5-20251001` (api/generate.js, línea 957)
- Supabase URL/key: vars de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- Timeout Vercel Function: 55s con runPipeline
- GitHub: github.com/garabarbato-lgtm/motor-pedagogico
- No usar npm install -g @anthropic-ai/claude-code — método deprecado

PROTOCOLO DE DELEGACIÓN POR VOLUMEN (TOKEN SAVING)
Claude actúa como Arquitecto Principal de tiza. La delegación en Gemini no es obligatoria por tipo de tarea, sino por densidad de tokens y extensión de la respuesta.

1. CRITERIO DE DELEGACIÓN
Claude debe sugerir delegar a Gemini únicamente cuando la tarea sea extensa, repetitiva o de baja complejidad lógica, para preservar la ventana de contexto.

Tareas que hace Claude (No delegar):

Arquitectura de archivos y lógica de negocio (JS/TS).

Manejo de estados, hooks y conexión con base de datos.

Debugging de errores de sistema o rutas de API.

Cambios puntuales de estilo (1-10 líneas).

Tareas para Gemini (Delegar por volumen):

Estilos: Archivos CSS completos, configuraciones extensas de Tailwind o animaciones descriptivas.

Documentación: Generación de archivos README, manuales de uso para docentes o guías pedagógicas.

Contenido de tiza.: Generación de listas largas de ejercicios, problemas matemáticos o transcripción de Diseños Curriculares.

Boilerplate: Creación de múltiples componentes similares o estructuras HTML repetitivas.

2. ACCIÓN OBLIGATORIA PARA CLAUDE
Si Claude estima que la respuesta superará las 50-60 líneas de código o texto no lógico:

Notificar: Debe informar al usuario: "Esta tarea requiere un alto volumen de tokens. Sugiero delegar la generación a Gemini para optimizar el contexto".

Contextualizar: Debe proporcionar un prompt técnico breve para que el usuario lo copie en Gemini. Este prompt debe incluir:

Variables necesarias.

Formato de salida esperado.

Restricciones técnicas específicas para que el código sea compatible al volver.

### AUTOMATIZACIÓN: CLAUDE + GEMINI CLI

Claude tiene permiso para ejecutar comandos de terminal y debe usar el CLI de Gemini para tareas de "Carga Pesada".

**Instrucciones de ejecución:**
1. **Identificación:** Si la tarea es de volumen (CSS, Docs, Boilerplate), Claude no debe escribir el código él mismo.
2. **Ejecución Directa:** Claude debe construir el comando de terminal para Gemini.
   - Formato: `gemini "[instrucción]" > [archivo_destino]`
   - Ejemplo: Si el usuario pide CSS, Claude debe ejecutar: `gemini "Genera el CSS para este HTML: [código]" > styles.css`
3. **Revisión:** Una vez que Gemini genera el archivo, Claude debe leerlo (`cat [archivo]`) para verificar que la integración sea correcta.

**Restricción de seguridad:**
Claude siempre debe pedir confirmación al usuario antes de ejecutar el comando de terminal de Gemini.

---

## Reglas de comportamiento (Karpathy skills)

Fuente: https://github.com/forrestchang/andrej-karpathy-skills

Estas reglas reducen errores comunes de LLM al codear. Sesgo hacia cautela sobre velocidad. Para tareas triviales, usar criterio.

### 1. Pensar antes de codear
**No asumir. No ocultar confusión. Exponer tradeoffs.**

Antes de implementar:
- Explicitar supuestos. Si hay duda, preguntar.
- Si existen múltiples interpretaciones, presentarlas — no elegir en silencio.
- Si hay un enfoque más simple, decirlo. Empujar de vuelta cuando corresponda.
- Si algo no está claro, frenar. Nombrar la confusión. Preguntar.

### 2. Simplicidad primero
**Código mínimo que resuelva el problema. Nada especulativo.**

- Sin features fuera de lo pedido.
- Sin abstracciones para código de uso único.
- Sin "flexibilidad" o "configurabilidad" no solicitada.
- Sin manejo de errores para escenarios imposibles.
- Si escribís 200 líneas y podrían ser 50, reescribir.

Pregunta clave: "¿Un senior diría que esto está sobrecomplicado?" Si sí, simplificar.

### 3. Cambios quirúrgicos
**Tocar solo lo necesario. Limpiar solo el propio desorden.**

Al editar código existente:
- No "mejorar" código, comentarios o formato adyacente.
- No refactorizar lo que no está roto.
- Respetar el estilo existente, aunque uno lo haría distinto.
- Si se nota código muerto no relacionado, mencionarlo — no borrarlo.

Cuando los cambios dejan huérfanos:
- Eliminar imports/variables/funciones que TUS cambios dejaron sin uso.
- No remover código muerto preexistente salvo que lo pidan.

Test: cada línea cambiada debe trazar directamente al pedido del usuario.

### 4. Ejecución guiada por objetivos
**Definir criterios de éxito. Iterar hasta verificar.**

Transformar tareas en objetivos verificables:
- "Agregar validación" → "Escribir tests para inputs inválidos, luego hacerlos pasar"
- "Arreglar el bug" → "Escribir un test que lo reproduzca, luego hacerlo pasar"
- "Refactorizar X" → "Asegurar que los tests pasan antes y después"

Para tareas multi-paso, declarar un plan breve:
```
1. [Paso] → verificar: [check]
2. [Paso] → verificar: [check]
3. [Paso] → verificar: [check]
```

Criterios de éxito fuertes permiten iterar independientemente. Criterios débiles ("que funcione") requieren clarificación constante.

**Estas reglas funcionan si:** hay menos cambios innecesarios en los diffs, menos reescrituras por sobrecomplicación, y las preguntas aclaratorias aparecen antes de implementar, no después de equivocarse.