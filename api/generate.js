import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────
// LÍMITE DE PALABRAS POR GRADO (Lectura PDL)
// ─────────────────────────────────────────────
function limitePalabras(grado) {
  if (grado === "1" || grado === "2") return "150 palabras";
  if (grado === "3") return "200 palabras";
  return "250 palabras";
}

// ─────────────────────────────────────────────
// PROMPTS PDL — LECTURA DE TEXTOS
// ─────────────────────────────────────────────
function buildPDLLecturaPrompt(contenido, feedback = null) {
  const feedbackSection = feedback
    ? `\n\nATENCIÓN: El intento anterior fue rechazado por las siguientes razones:\n${feedback}\nCorregí estos problemas en esta nueva versión.`
    : "";

  return `Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de lectura para ${contenido.grado}° grado de Prácticas del Lenguaje.

Tipo de texto: ${contenido.tipoTexto}
Práctica lectora: ${contenido.practica}
${feedbackSection}

La ficha debe tener:
1. Un texto breve del tipo indicado, adecuado al grado, con vocabulario claro.
2. Entre 2 y 3 preguntas de comprensión enfocadas en la práctica elegida.

Criterios:
- El texto no debe superar ${limitePalabras(contenido.grado)}
- Las preguntas deben estar formuladas en lenguaje de alumno, no de docente
- No usar terminología técnica en las consignas
- Si el tipo de texto es fábula: incluir moraleja explícita al final del texto
- Si el tipo de texto es poesía: incluir al menos una rima o recurso sonoro
- Si el tipo de texto es noticia: respetar estructura periodística (título, copete, cuerpo)
- Si el tipo de texto es obra de teatro: incluir al menos dos personajes y acotaciones
- Si el tipo de texto es historieta: describir las viñetas con texto ya que no hay imágenes
- Si un ejercicio requiere una tabla para completar, generarla en HTML dentro del recuadro de respuesta con este estilo: bordes finos (border: 0.5px solid #ddddd8), encabezados de columna en negrita con fondo #f5f5f0, celdas vacías con height: 32px para que el alumno escriba, width: 100%. La tabla va DENTRO del recuadro de respuesta, debajo del enunciado.
- Marcá con **doble asterisco** los nombres propios, datos importantes y conceptos clave del texto
- El título debe tener dos partes separadas por dos puntos cuando sea posible. Mayúscula solo en la primera letra.
- Elegí 1 o 2 emojis relevantes al tipo de texto para decorar el título.

FORMATO DE RESPUESTA (JSON estricto, sin markdown):
{
  "emojis": ["emoji1"],
  "titulo": "título atractivo para el alumno",
  "texto": "el texto completo generado",
  "preguntas": [
    "primera pregunta de comprensión",
    "segunda pregunta de comprensión",
    "tercera pregunta (opcional)"
  ]
}

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

// ─────────────────────────────────────────────
// PROMPTS PDL — ESCRITURA DE TEXTOS
// ─────────────────────────────────────────────
function buildPDLEscrituraPrompt(contenido, feedback = null) {
  const feedbackSection = feedback
    ? `\n\nATENCIÓN: El intento anterior fue rechazado por las siguientes razones:\n${feedback}\nCorregí estos problemas en esta nueva versión.`
    : "";

  return `Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de escritura para ${contenido.grado}° grado de Prácticas del Lenguaje.

Tipo de texto a producir: ${contenido.tipoTexto}
${feedbackSection}

La ficha debe tener:
1. Una consigna motivadora que invite al alumno a escribir (máximo 3 oraciones)
2. Dos o tres orientaciones breves para guiar la escritura (ej. ¿Quiénes son los personajes?)
3. NO escribir el texto — ese espacio lo completa el alumno

Criterios:
- La consigna debe ser concreta y alcanzable para el grado
- Las orientaciones deben ser preguntas simples, no instrucciones complejas
- El lenguaje debe ser cercano y motivador para un niño
- Marcá con **doble asterisco** los datos importantes y conceptos clave de la consigna
- El título debe tener dos partes separadas por dos puntos cuando sea posible. Mayúscula solo en la primera letra.
- Elegí 1 o 2 emojis relevantes al tipo de texto a producir.

FORMATO DE RESPUESTA (JSON estricto, sin markdown):
{
  "emojis": ["emoji1"],
  "titulo": "título atractivo para el alumno",
  "consigna": "la consigna motivadora (máximo 3 oraciones)",
  "orientaciones": [
    "primera orientación en forma de pregunta",
    "segunda orientación en forma de pregunta",
    "tercera orientación (opcional)"
  ]
}

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

// ─────────────────────────────────────────────
// PROMPTS PDL — ORTOGRAFÍA
// ─────────────────────────────────────────────
function buildPDLOrtografiaPrompt(contenido, feedback = null) {
  const feedbackSection = feedback
    ? `\n\nATENCIÓN: El intento anterior fue rechazado por las siguientes razones:\n${feedback}\nCorregí estos problemas en esta nueva versión.`
    : "";

  return `Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de ortografía para ${contenido.grado}° grado.

Regla ortográfica: ${contenido.tipoTexto}
${feedbackSection}

CRITERIOS:
- Explicación breve y clara (máximo 2 oraciones) + ejemplo concreto
- IMPORTANTE: Generá EXACTAMENTE 3 ejercicios, ni más ni menos. Si generás un cuarto ejercicio el sistema lo va a ignorar y quedará incompleto. Máximo 3.
- Vocabulario conocido para el grado, en contexto de oraciones o textos breves
- Marcá con **doble asterisco** las palabras clave en la explicación y los enunciados
- Título: dos partes separadas por dos puntos, mayúscula solo en la primera letra
- Elegí 1 o 2 emojis relevantes a la regla para "emojis"

TIPOS DE EJERCICIO:
- "texto_libre": corrección, escritura libre o respuestas abiertas
- "completar_oraciones": array "oraciones" con strings con _______ (5+ guiones) en el espacio
- "tabla": "columnas" = encabezados. "filas" = array de arrays donde cada sub-array tiene un valor por columna (string vacío "" para celda vacía). NUNCA concatenar varias columnas en un solo string.
- "verdadero_falso": array "afirmaciones" para evaluar con V/F
LÍMITE DE ITEMS: Cada ejercicio puede tener como máximo 4 items (oraciones, afirmaciones o filas). Nunca más de 4.

FORMATO (JSON estricto, sin markdown):
{
  "emojis": ["emoji1"],
  "titulo": "título: con la regla",
  "concepto_clave": "la regla en una oración clara",
  "explicacion": "explicación breve (máximo 2 oraciones)",
  "ejemplo": "ejemplo concreto",
  "ejercicios": [
    {
      "tipo": "completar_oraciones",
      "enunciado": "Completá con mb o mp:",
      "oraciones": ["Hay que te___lar de frío.", "La ___olsa pesa mucho."]
    },
    {
      "tipo": "tabla",
      "enunciado": "Clasificá estas palabras:",
      "columnas": ["Con mb", "Con mp"],
      "filas": [["también", ""], ["", "campo"], ["ambiente", ""], ["", "trampa"]]
    }
  ]
}

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

// ─────────────────────────────────────────────
// BUILDERS POR MOMENTO DIDÁCTICO
// ─────────────────────────────────────────────
function buildPresentacionPrompt(contenido, ctx, feedback, indicadores) {
  const nivel = ctx.nivelGrupo || "Sin adaptación";
  const incluirAndamiaje = nivel === "Necesita más apoyo";
  const feedbackSection = feedback
    ? `\n\nATENCIÓN: El intento anterior fue rechazado por las siguientes razones:\n${feedback}\nCorregí estos problemas en esta nueva versión.`
    : "";

  const instruccionNivel = nivel === "Necesita más apoyo"
    ? `Nivel del grupo: Necesita más apoyo → explicación simple, ejercicio de reconocimiento con andamiaje (pista breve escrita directamente al alumno, sin tecnicismos, máximo 3 líneas).`
    : nivel === "Puede más"
    ? `Nivel del grupo: Puede más → explicación más profunda, ejercicio con mayor demanda conceptual. andamiaje: null.`
    : `Nivel del grupo: Sin adaptación → explicación estándar, ejercicio normal. andamiaje: null.`;

  const textoLibre = ctx.textoLibre ? `\nTener en cuenta que: ${ctx.textoLibre}` : "";

  return `Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de PRESENTACIÓN de contenido nuevo para:

Grado: ${contenido.grado}°
Área: ${contenido.area}
Bloque: ${contenido.bloque}
Tema: ${contenido.subtema}
Objetivo de aprendizaje: ${contenido.objetivo_especifico}
${contenido.item_original ? `Referencia del bloque: ${contenido.item_original}` : ""}
${feedbackSection}

CONTEXTO CURRICULAR:
${indicadores && indicadores.length > 0 ? `Los siguientes indicadores de avance del DC PBA describen lo que se espera que los alumnos logren. Usalos como referencia para calibrar el nivel y el enfoque de la actividad, no como consignas a cumplir literalmente:\n${indicadores.map(i => `- ${i}`).join("\n")}` : ""}

${instruccionNivel}

CRITERIOS:
- Esta es una ficha de presentación: el objetivo es introducir el concepto por primera vez
- Explicación clara, en lenguaje para primaria, sin tecnicismos
- La actividad debe ser de reconocimiento o exploración inicial, no de aplicación compleja
- Título: dos partes separadas por dos puntos, mayúscula solo en la primera letra
- Elegí 1 o 2 emojis cotidianos concretos relacionados al tema (NUNCA símbolos matemáticos abstractos como ❌ ✖️ ➗ ➕ ➖ 🔢 📐 📏)
${textoLibre}

En los párrafos de explicación podés usar:
- **negrita** para conceptos clave
- → para conectar ideas o pasos en secuencia
- · para separar ejemplos dentro de un mismo párrafo
- emojis cotidianos concretos (no abstractos) para anclar en la realidad
- mini-secuencias inline: paso A → paso B → paso C

Los párrafos deben tener vida propia — no texto académico plano.
Entre 3 y 5 párrafos. Nunca un bloque único de texto.

La pill es obligatoria. Elegí entre dato_curioso o pregunta_disparadora según lo que mejor funcione para el tema.

El campo andamiaje en los ejercicios es opcional.
Incluilo solo si el ejercicio genuinamente lo necesita.
Si no hay andamiaje, omitir el campo completamente (no mandar null ni string vacío).

Para escribir fracciones usá siempre el formato <frac>numerador/denominador</frac>.
Nunca escribas fracciones inline como 1/2.

FORMATO (JSON estricto, sin markdown):
{
  "tipo_ficha": "presentacion",
  "titulo": "Tema: subtema concreto",
  "emojis": ["🍕", "🍫"],
  "explicacion": {
    "parrafos": [
      "Párrafo 1 — usá **negrita** para conceptos clave, → para conectar ideas, · para separar ejemplos inline, y emojis cotidianos concretos para anclar en la realidad.",
      "Párrafo 2 — podés incluir mini-secuencias dentro del párrafo: paso A → paso B → paso C.",
      "Párrafo 3 — entre 3 y 5 párrafos en total. Nunca un bloque único de texto."
    ],
    "pill": {
      "tipo": "dato_curioso",
      "contenido": "Dato breve, concreto y sorprendente relacionado con el tema. Máximo 1 oración."
    }
  },
  "ejercicios": [
    {
      "tipo": "situacion_problematica",
      "enunciado": "Situación problemática con contexto cotidiano.",
      "andamiaje": "Texto breve de apoyo — solo si el ejercicio lo necesita. Si no hay andamiaje, omitir este campo completamente."
    },
    {
      "tipo": "situacion_problematica",
      "enunciado": "Segundo ejercicio opcional. Si no entra en el espacio, mandá null en esta posición."
    }
  ]
}

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

function buildPracticaPrompt(contenido, ctx, feedback, indicadores) {
  const nivel = ctx.nivelGrupo || "Sin adaptación";
  const cantidadEjercicios = nivel === "Necesita más apoyo" ? 2 : 3;
  const feedbackSection = feedback
    ? `\n\nATENCIÓN: El intento anterior fue rechazado por las siguientes razones:\n${feedback}\nCorregí estos problemas en esta nueva versión.`
    : "";

  const instruccionNivel = nivel === "Necesita más apoyo"
    ? "Nivel del grupo: Necesita más apoyo → 2 ejercicios, consignas guiadas paso a paso, vocabulario simple."
    : nivel === "Puede más"
    ? "Nivel del grupo: Puede más → 3 ejercicios con mayor complejidad. concepto_clave presente pero muy breve."
    : "Nivel del grupo: Sin adaptación → 3 ejercicios normales.";

  const bloqueLC = (contenido.bloque || "").toLowerCase();
  const itemLC = (contenido.subtema || contenido.item_original || "").toLowerCase();
  const esHistoria = bloqueLC.includes("tiempo") || bloqueLC.includes("historia") || itemLC.includes("historia");
  const esGeografia = bloqueLC.includes("territorio") || bloqueLC.includes("geograf") || itemLC.includes("mapa") || itemLC.includes("territorio");
  const esEstimacion = itemLC.includes("estimaci") || itemLC.includes("número sense") || itemLC.includes("numero sense");

  const tiposPool = contenido.area === "Matemática"
    ? `TIPOS DE EJERCICIO DISPONIBLES (elegir con variedad):
- "completar_oraciones": completar espacios con números, términos o resultados. Array "oraciones" con _______ (5+ guiones).
- "situacion_problematica": problema contextualizado para resolver. Solo "enunciado".
- "tabla": tabla para completar. "columnas" + "filas" (string vacío "" = celda a completar). NUNCA concatenar columnas.
- "verdadero_falso": afirmaciones para evaluar con V/F. Array "afirmaciones".
- "dibujar_y_explicar": consigna para dibujar y/o explicar con palabras. Solo "enunciado".
- "resolver_operaciones": operaciones o cuentas para resolver. Solo "enunciado".
- "completar_la_cuenta": operaciones incompletas para completar. Solo "enunciado".${esEstimacion ? `
- "estimacion": consigna de estimación o número sense. Solo "enunciado".` : ""}`

    : contenido.area === "Ciencias Naturales"
    ? `TIPOS DE EJERCICIO DISPONIBLES (elegir con variedad):
- "completar_oraciones": completar espacios con términos o conceptos. Array "oraciones" con _______ (5+ guiones).
- "tabla": tabla para completar o clasificar. "columnas" + "filas" (string vacío "" = celda vacía). NUNCA concatenar columnas.
- "verdadero_falso": afirmaciones para evaluar con V/F. Array "afirmaciones".
- "preguntas_comprension": preguntas abiertas de comprensión. Campo "enunciado" (intro opcional) + array "preguntas" con cada pregunta como string. NUNCA pongas las preguntas dentro del enunciado — deben ir en el array "preguntas".
- "ordenar_secuencia": consigna para ordenar pasos o etapas de un proceso. Solo "enunciado".
- "describir_con_palabras": consigna de descripción libre. Solo "enunciado".`

    : contenido.area === "Ciencias Sociales"
    ? `TIPOS DE EJERCICIO DISPONIBLES (elegir con variedad):
- "completar_oraciones": completar espacios con términos o datos. Array "oraciones" con _______ (5+ guiones).
- "tabla": tabla para completar o comparar. "columnas" + "filas" (string vacío "" = celda vacía). NUNCA concatenar columnas.
- "verdadero_falso": afirmaciones para evaluar con V/F. Array "afirmaciones".
- "preguntas_comprension": preguntas abiertas de comprensión. Campo "enunciado" (intro opcional) + array "preguntas" con cada pregunta como string. NUNCA pongas las preguntas dentro del enunciado — deben ir en el array "preguntas".
- "ordenar_secuencia": consigna para ordenar hechos o etapas. Solo "enunciado".${esHistoria ? `
- "linea_de_tiempo": consigna para ubicar hechos en una línea de tiempo. Solo si el contenido es de Historia. Solo "enunciado".` : ""}${esGeografia ? `
- "ubicar_en_mapa": consigna para ubicar elementos usando un mapa. La consigna debe aclarar "usando un mapa". Solo si el contenido es de Geografía. Solo "enunciado".` : ""}`

    : `TIPOS DE EJERCICIO DISPONIBLES:
- "completar_oraciones": array "oraciones" con _______ (5+ guiones).
- "tabla": "columnas" + "filas" con "" para celdas vacías. NUNCA concatenar columnas.
- "verdadero_falso": array "afirmaciones" para V/F.
- "preguntas_comprension": array "preguntas" con cada pregunta como string. NUNCA pongas las preguntas dentro del enunciado.`;

  const obligatorio = contenido.area === "Matemática"
    ? "- OBLIGATORIO: incluí al menos 1 ejercicio de tipo situacion_problematica. Este ejercicio obligatorio cuenta dentro del total indicado arriba."
    : (contenido.area === "Ciencias Naturales" || contenido.area === "Ciencias Sociales")
    ? "- OBLIGATORIO: incluí al menos 1 ejercicio de tipo preguntas_comprension. Este ejercicio obligatorio cuenta dentro del total indicado arriba."
    : "";

  const fraccionesMat = `\nFRACCIONES: Cuando escribas fracciones en cualquier campo del JSON, usá siempre el formato <frac>numerador/denominador</frac>. Ejemplo: <frac>1/2</frac>, <frac>3/4</frac>. NUNCA escribas fracciones como texto plano (ej: nunca '1/2').`;

  const textoLibre = ctx.textoLibre ? `\nTener en cuenta que: ${ctx.textoLibre}` : "";

  return `Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de PRÁCTICA para:

Grado: ${contenido.grado}°
Área: ${contenido.area}
Bloque: ${contenido.bloque}
Tema: ${contenido.subtema}
Objetivo de aprendizaje: ${contenido.objetivo_especifico}
${contenido.item_original ? `Referencia del bloque: ${contenido.item_original}` : ""}
${feedbackSection}

CONTEXTO CURRICULAR:
${indicadores && indicadores.length > 0 ? `Los siguientes indicadores de avance del DC PBA describen lo que se espera que los alumnos logren. Usalos como referencia para calibrar el nivel y el enfoque de la actividad, no como consignas a cumplir literalmente:\n${indicadores.map(i => `- ${i}`).join("\n")}` : ""}

${instruccionNivel}

CRITERIOS:
- Esta es una ficha de práctica: el concepto ya fue presentado, ahora los alumnos lo consolidan
- El concepto_clave es un recordatorio breve, escrito directamente al alumno, sin tecnicismos, máximo 3 líneas
- Los ejercicios deben promover aplicación real, no repetición mecánica
- Marcá con **doble asterisco** conceptos clave en el concepto_clave
- Título: dos partes separadas por dos puntos, mayúscula solo en la primera letra
- Elegí 1 o 2 emojis cotidianos concretos relacionados al tema (NUNCA símbolos matemáticos abstractos como ❌ ✖️ ➗ ➕ ➖ 🔢 📐 📏)
- IMPORTANTE: Generá EXACTAMENTE ${cantidadEjercicios} ejercicios, ni más ni menos.
${textoLibre}

${tiposPool}

REGLAS DE SELECCIÓN:
- Elegí los tipos con variedad. No uses tabla y verdadero_falso en la misma ficha si hay otras opciones disponibles.
- Máximo 1 tabla y máximo 1 verdadero_falso por ficha.
- LÍMITE DE ITEMS: cada ejercicio puede tener como máximo 4 items (oraciones, afirmaciones o filas). Nunca más de 4.
- El campo "andamiaje" va dentro de cada ejercicio: máximo uno por ficha puede ser no-null (solo si nivel es "Necesita más apoyo"), el resto: null.
${obligatorio}${fraccionesMat}

FORMATO (JSON estricto, sin markdown):
{
  "tipo_ficha": "practica",
  "emojis": ["emoji1", "emoji2"],
  "titulo": "primera parte: segunda parte",
  "concepto_clave": "recordatorio breve del concepto, escrito directamente al alumno, sin tecnicismos, máximo 3 líneas",
  "ejercicios": [
    { "tipo": "completar_oraciones", "enunciado": "...", "oraciones": ["..."], "andamiaje": ${nivel === "Necesita más apoyo" ? '"pista breve escrita directamente al alumno, sin tecnicismos, máximo 3 líneas"' : "null"} },
    { "tipo": "situacion_problematica", "enunciado": "...", "andamiaje": null },
    { "tipo": "verdadero_falso", "enunciado": "...", "afirmaciones": ["..."], "andamiaje": null },
    null
  ]
}

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

function buildCierrePrompt(contenido, ctx, feedback, indicadores) {
  const nivel = ctx.nivelGrupo || "Sin adaptación";
  const incluirAndamiaje = nivel === "Necesita más apoyo";
  const feedbackSection = feedback
    ? `\n\nATENCIÓN: El intento anterior fue rechazado por las siguientes razones:\n${feedback}\nCorregí estos problemas en esta nueva versión.`
    : "";

  const instruccionNivel = nivel === "Necesita más apoyo"
    ? "Nivel del grupo: Necesita más apoyo → escalera más suave, incluir andamiaje (pista breve para el alumno, sin tecnicismos, máximo 3 líneas)."
    : nivel === "Puede más"
    ? "Nivel del grupo: Puede más → desafío con alta demanda cognitiva, andamiaje: null."
    : "Nivel del grupo: Sin adaptación → escalera estándar, andamiaje: null.";

  const textoLibre = ctx.textoLibre ? `\nTener en cuenta que: ${ctx.textoLibre}` : "";

  const bloqueLC = (contenido.bloque || "").toLowerCase();
  const itemLC = (contenido.subtema || contenido.item_original || "").toLowerCase();
  const esHistoria = bloqueLC.includes("tiempo") || bloqueLC.includes("historia") || itemLC.includes("historia");
  const esGeografia = bloqueLC.includes("territorio") || bloqueLC.includes("geograf") || itemLC.includes("mapa") || itemLC.includes("territorio");
  const esEstimacion = itemLC.includes("estimaci") || itemLC.includes("número sense") || itemLC.includes("numero sense");

  const tiposPool = contenido.area === "Matemática"
    ? `TIPOS DE EJERCICIO DISPONIBLES para los peldaños (elegir con variedad):
- "completar_oraciones": array "oraciones" con _______ (5+ guiones).
- "situacion_problematica": problema contextualizado. Solo "enunciado".
- "tabla": "columnas" + "filas" con "" para celdas vacías. NUNCA concatenar columnas.
- "verdadero_falso": array "afirmaciones" para V/F.
- "resolver_operaciones": operaciones para resolver. Solo "enunciado".
- "completar_la_cuenta": operaciones incompletas. Solo "enunciado".${esEstimacion ? '\n- "estimacion": consigna de estimación. Solo "enunciado".' : ""}`
    : (contenido.area === "Ciencias Naturales" || contenido.area === "Ciencias Sociales")
    ? `TIPOS DE EJERCICIO DISPONIBLES para los peldaños (elegir con variedad):
- "completar_oraciones": array "oraciones" con _______ (5+ guiones).
- "tabla": "columnas" + "filas" con "" para celdas vacías. NUNCA concatenar columnas.
- "verdadero_falso": array "afirmaciones" para V/F.
- "preguntas_comprension": array "preguntas" con cada pregunta como string.
- "describir_con_palabras": consigna de descripción libre. Solo "enunciado".${esHistoria ? '\n- "linea_de_tiempo": consigna para línea de tiempo. Solo "enunciado".' : ""}${esGeografia ? '\n- "ubicar_en_mapa": consigna para ubicar en mapa. Solo "enunciado".' : ""}`
    : `TIPOS DE EJERCICIO DISPONIBLES para los peldaños:
- "completar_oraciones": array "oraciones" con _______ (5+ guiones).
- "tabla": "columnas" + "filas" con "" para celdas vacías.
- "verdadero_falso": array "afirmaciones" para V/F.
- "preguntas_comprension": array "preguntas" con cada pregunta como string.`;

  return `Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de CIERRE / INTEGRACIÓN para:

Grado: ${contenido.grado}°
Área: ${contenido.area}
Bloque: ${contenido.bloque}
Tema: ${contenido.subtema}
Objetivo de aprendizaje: ${contenido.objetivo_especifico}
${contenido.item_original ? `Referencia del bloque: ${contenido.item_original}` : ""}
${feedbackSection}

CONTEXTO CURRICULAR:
${indicadores && indicadores.length > 0 ? `Los siguientes indicadores de avance del DC PBA describen lo que se espera que los alumnos logren. Usalos como referencia para calibrar el nivel y el enfoque de la actividad, no como consignas a cumplir literalmente:\n${indicadores.map(i => `- ${i}`).join("\n")}` : ""}

${instruccionNivel}

CRITERIOS:
- Esta es una ficha de cierre: los alumnos ya aprendieron el concepto y ahora lo integran
- La escalera tiene 4 peldaños fijos: "Nivel 1", "Nivel 2", "Nivel 3" y "Punto de descanso"
- Cada peldaño tiene un rótulo fijo y un "nombre" creativo generado por vos según el contenido
- La demanda cognitiva crece de Nivel 1 a Nivel 3; "Punto de descanso" es siempre preguntas_comprension con una sola pregunta
- El "ejercicio" de cada peldaño es un objeto tipado con los mismos tipos disponibles que en práctica
Asignación de demanda cognitiva por nivel (obligatorio):
- Nivel 1 → demanda baja: elegí entre verdadero_falso, completar_oraciones, tabla
- Nivel 2 → demanda media: elegí entre situacion_problematica, ordenar_secuencia, preguntas_comprension
- Nivel 3 → demanda alta: el ejercicio debe exigir justificar, crear o producir. Tipos válidos: inventar_el_problema, describir_con_palabras, causa_y_consecuencia, texto_libre, dibujar_y_explicar. NUNCA uses verdadero_falso ni completar_oraciones en Nivel 3.
- Punto de descanso → siempre preguntas_comprension con una sola pregunta de reflexión que mire hacia lo aprendido en la ficha.
- El campo "andamiaje" va dentro de cada peldaño: solo Nivel 1 puede tener valor (si nivel es "Necesita más apoyo"), el resto: null
- Título: dos partes separadas por dos puntos, mayúscula solo en la primera letra
- Elegí 1 o 2 emojis cotidianos concretos relacionados al tema (NUNCA símbolos matemáticos abstractos como ❌ ✖️ ➗ ➕ ➖ 🔢 📐 📏)
${textoLibre}

${tiposPool}

FRACCIONES: Cuando escribas fracciones en cualquier campo del JSON, usá siempre el formato <frac>numerador/denominador</frac>. Ejemplo: <frac>1/2</frac>, <frac>3/4</frac>. NUNCA escribas fracciones como texto plano (ej: nunca '1/2').

FORMATO (JSON estricto, sin markdown):
{
  "tipo_ficha": "cierre",
  "emojis": ["emoji1", "emoji2"],
  "titulo": "primera parte: segunda parte",
  "escalera": [
    { "rotulo": "Nivel 1", "nombre": "nombre creativo para este nivel", "ejercicio": { "tipo": "situacion_problematica", "enunciado": "consigna del nivel 1" }, "andamiaje": ${incluirAndamiaje ? '"pista breve escrita directamente al alumno, sin tecnicismos, máximo 3 líneas"' : "null"} },
    { "rotulo": "Nivel 2", "nombre": "nombre creativo para este nivel", "ejercicio": { "tipo": "completar_oraciones", "enunciado": "...", "oraciones": ["..."] }, "andamiaje": null },
    { "rotulo": "Nivel 3", "nombre": "nombre creativo para este nivel", "ejercicio": { "tipo": "verdadero_falso", "enunciado": "...", "afirmaciones": ["..."] }, "andamiaje": null },
    { "rotulo": "Punto de descanso", "nombre": "nombre creativo para este nivel", "ejercicio": { "tipo": "preguntas_comprension", "enunciado": "Respondé:", "preguntas": ["pregunta única de reflexión o metacognición"] }, "andamiaje": null }
  ]
}

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

// ─────────────────────────────────────────────
// PROMPT GENERADOR (general + PDL)
// ─────────────────────────────────────────────
function buildGeneratorPrompt(contenido, tipoFicha, feedback = null, indicadores = []) {
  // Derivar a prompts PDL cuando corresponde
  if (contenido.area === "Prácticas del Lenguaje") {
    if (tipoFicha === "Lectura de textos") return buildPDLLecturaPrompt(contenido, feedback);
    if (tipoFicha === "Escritura de textos") return buildPDLEscrituraPrompt(contenido, feedback);
    if (tipoFicha === "Ortografía") return buildPDLOrtografiaPrompt(contenido, feedback);
  }

  // Routing por momento didáctico
  const ctxMomento = contenido.contexto_pedagogico?.momento;
  if (ctxMomento === "Presentación") return buildPresentacionPrompt(contenido, contenido.contexto_pedagogico, feedback, indicadores);
  if (ctxMomento === "Práctica") return buildPracticaPrompt(contenido, contenido.contexto_pedagogico, feedback, indicadores);
  if (ctxMomento === "Cierre / Integración") return buildCierrePrompt(contenido, contenido.contexto_pedagogico, feedback, indicadores);

  // Prompt general (Matemática, Ciencias, etc.)
  const feedbackSection = feedback
    ? `\n\nATENCIÓN: El intento anterior fue rechazado por las siguientes razones:\n${feedback}\nCorregí estos problemas en esta nueva versión.`
    : "";

  const camposOpcionales = [
    '  "concepto_clave": "definición del concepto en una oración",',
    '  "explicacion": "explicación breve en lenguaje claro para el grado",',
  ].join("\n");

  const cantidadEjercicios = 3;

  const bloqueLC = (contenido.bloque || "").toLowerCase();
  const itemLC = (contenido.subtema || contenido.item_original || "").toLowerCase();
  const esHistoria = bloqueLC.includes("tiempo") || bloqueLC.includes("historia") || itemLC.includes("historia");
  const esGeografia = bloqueLC.includes("territorio") || bloqueLC.includes("geograf") || itemLC.includes("mapa") || itemLC.includes("territorio");
  const esEstimacion = itemLC.includes("estimaci") || itemLC.includes("número sense") || itemLC.includes("numero sense");

  const tiposPool = contenido.area === "Matemática"
    ? `TIPOS DE EJERCICIO DISPONIBLES (elegir con variedad):
- "completar_oraciones": completar espacios con números, términos o resultados. Array "oraciones" con _______ (5+ guiones).
- "situacion_problematica": problema contextualizado para resolver. Solo "enunciado".
- "tabla": tabla para completar. "columnas" + "filas" (string vacío "" = celda a completar). NUNCA concatenar columnas.
- "verdadero_falso": afirmaciones para evaluar con V/F. Array "afirmaciones".
- "dibujar_y_explicar": consigna para dibujar y/o explicar con palabras. Solo "enunciado".
- "resolver_operaciones": operaciones o cuentas para resolver. Solo "enunciado".
- "completar_la_cuenta": operaciones incompletas para completar. Solo "enunciado".${esEstimacion ? `
- "estimacion": consigna de estimación o número sense. Solo "enunciado".` : ""}`

    : contenido.area === "Ciencias Naturales"
    ? `TIPOS DE EJERCICIO DISPONIBLES (elegir con variedad):
- "completar_oraciones": completar espacios con términos o conceptos. Array "oraciones" con _______ (5+ guiones).
- "tabla": tabla para completar o clasificar. "columnas" + "filas" (string vacío "" = celda vacía). NUNCA concatenar columnas.
- "verdadero_falso": afirmaciones para evaluar con V/F. Array "afirmaciones".
- "preguntas_comprension": preguntas abiertas de comprensión. Campo "enunciado" (intro opcional) + array "preguntas" con cada pregunta como string. NUNCA pongas las preguntas dentro del enunciado — deben ir en el array "preguntas".
- "ordenar_secuencia": consigna para ordenar pasos o etapas de un proceso. Solo "enunciado".
- "describir_con_palabras": consigna de descripción libre. Solo "enunciado".`

    : contenido.area === "Ciencias Sociales"
    ? `TIPOS DE EJERCICIO DISPONIBLES (elegir con variedad):
- "completar_oraciones": completar espacios con términos o datos. Array "oraciones" con _______ (5+ guiones).
- "tabla": tabla para completar o comparar. "columnas" + "filas" (string vacío "" = celda vacía). NUNCA concatenar columnas.
- "verdadero_falso": afirmaciones para evaluar con V/F. Array "afirmaciones".
- "preguntas_comprension": preguntas abiertas de comprensión. Campo "enunciado" (intro opcional) + array "preguntas" con cada pregunta como string. NUNCA pongas las preguntas dentro del enunciado — deben ir en el array "preguntas".
- "ordenar_secuencia": consigna para ordenar hechos o etapas. Solo "enunciado".${esHistoria ? `
- "linea_de_tiempo": consigna para ubicar hechos en una línea de tiempo. Solo si el contenido es de Historia. Solo "enunciado".` : ""}${esGeografia ? `
- "ubicar_en_mapa": consigna para ubicar elementos usando un mapa. La consigna debe aclarar "usando un mapa". Solo si el contenido es de Geografía. Solo "enunciado".` : ""}`

    // Fallback genérico para otras áreas
    : `TIPOS DE EJERCICIO DISPONIBLES:
- "completar_oraciones": array "oraciones" con _______ (5+ guiones).
- "tabla": "columnas" + "filas" con "" para celdas vacías. NUNCA concatenar columnas.
- "verdadero_falso": array "afirmaciones" para V/F.
- "preguntas_comprension": array "preguntas" con cada pregunta como string. NUNCA pongas las preguntas dentro del enunciado.`;

  return `Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá un recurso educativo para:

Grado: ${contenido.grado}°
Área: ${contenido.area}
Bloque: ${contenido.bloque}
Tema: ${contenido.subtema}
Objetivo de aprendizaje: ${contenido.objetivo_especifico}
${contenido.item_original ? `Referencia del bloque: ${contenido.item_original}` : ""}
${feedbackSection}

CONTEXTO CURRICULAR:
${indicadores && indicadores.length > 0 ? `Los siguientes indicadores de avance del DC PBA describen lo que se espera que los alumnos logren. Usalos como referencia para calibrar el nivel y el enfoque de la actividad, no como consignas a cumplir literalmente:\n${indicadores.map(i => `- ${i}`).join('\n')}` : ''}

CRITERIOS OBLIGATORIOS:
1. Lenguaje claro y adecuado para niños de primaria (evitá términos académicos complejos)
2. El ejemplo debe ser cercano a la experiencia del alumno (comida, objetos cotidianos, situaciones simples)
3. La actividad debe promover comprensión real, no ejercicios mecánicos sin sentido
4. Todo el contenido debe responder al objetivo curricular específico, no al tema general
5. Ajustá la complejidad y extensión según el contexto pedagógico recibido:
   - "Introducción": incluí explicación detallada y ejemplo muy concreto, actividad de reconocimiento simple
   - "Práctica": explicación breve que recuerde lo visto, actividad que consolide lo aprendido
   - "Cierre": sin explicación ni ejemplo, solo actividad integradora
   - "Necesita más apoyo": consignas cortas, vocabulario simple, pasos bien separados
   - "Puede ir más lejos": consignas abiertas, mayor demanda cognitiva
   - Si no hay contexto definido, usá un nivel estándar equilibrado
6. IMPORTANTE: Generá EXACTAMENTE ${cantidadEjercicios} ejercicios, ni más ni menos. Si generás uno de más el sistema lo va a ignorar y quedará incompleto. Máximo ${cantidadEjercicios}.
7. Marcá con **doble asterisco** números, datos y conceptos clave en la explicación
8. Título: dos partes separadas por dos puntos, mayúscula solo en la primera letra
9. Elegí 1 o 2 emojis para "emojis": SOLO objetos cotidianos concretos relacionados al contexto (comida, animales, objetos escolares, deportes, naturaleza). NUNCA usar símbolos matemáticos o abstractos como ❌ ✖️ ➗ ➕ ➖ 🔢 📐 📏 o similares.

${tiposPool}

REGLAS DE SELECCIÓN:
- Elegí los tipos con variedad. No uses tabla y verdadero_falso en la misma ficha si hay otras opciones disponibles.
- Máximo 1 tabla y máximo 1 verdadero_falso por ficha. Estos tipos no son obligatorios — podés no usarlos.
- LÍMITE DE ITEMS: cada ejercicio puede tener como máximo 4 items (oraciones, afirmaciones o filas). Nunca más de 4.
${contenido.area === "Matemática"
  ? "- OBLIGATORIO: incluí al menos 1 ejercicio de tipo situacion_problematica. Este ejercicio obligatorio cuenta dentro del total indicado arriba."
  : (contenido.area === "Ciencias Naturales" || contenido.area === "Ciencias Sociales")
  ? "- OBLIGATORIO: incluí al menos 1 ejercicio de tipo preguntas_comprension. Este ejercicio obligatorio cuenta dentro del total indicado arriba."
  : ""}
${contenido.area === "Matemática" ? `
FRACCIONES: Cuando escribas fracciones en cualquier campo del JSON (enunciado, oraciones, explicacion), usá siempre el formato: <frac>numerador/denominador</frac>. Ejemplo: <frac>1/2</frac>, <frac>3/4</frac>` : ""}
FORMATO (JSON estricto, sin markdown):
{
  "emojis": ["emoji1"],
  "titulo": "primera parte: segunda parte",
${camposOpcionales}
  "ejercicios": [
    {
      "tipo": "completar_oraciones",
      "enunciado": "Completá con la palabra correcta:",
      "oraciones": ["El _______ es la fuente de energía.", "La Tierra gira _______ el Sol."]
    },
    {
      "tipo": "situacion_problematica",
      "enunciado": "Enunciado del problema contextualizado."
    },
    {
      "tipo": "preguntas_comprension",
      "enunciado": "Respondé las siguientes preguntas:",
      "preguntas": ["¿Por qué ocurre esto?", "¿Qué pasaría si...?"]
    }
  ],
  "reflexion": "pregunta para conectar con la vida cotidiana del alumno"
}

${(() => {
  const ctx = contenido.contexto_pedagogico;
  if (!ctx || (!ctx.momento && !ctx.nivelGrupo && !ctx.proposito && !ctx.textoLibre)) return "";
  const lineas = ["---CONTEXTO PEDAGÓGICO---"];
  if (ctx.momento)    lineas.push(`Momento didáctico: ${ctx.momento}`);
  if (ctx.nivelGrupo) lineas.push(`Nivel del grupo: ${ctx.nivelGrupo}`);
  if (ctx.proposito)  lineas.push(`Propósito: ${ctx.proposito}`);
  if (ctx.textoLibre) lineas.push(`Tener en cuenta que: ${ctx.textoLibre}`);
  lineas.push(`
Aplicar estas reglas según el momento didáctico:
- "Introducción": incluir siempre explicación conceptual + ejemplo concreto antes de las actividades
- "Práctica": incluir breve recordatorio del concepto, luego actividades
- "Cierre": ir directo a las actividades, sin explicación ni ejemplo introductorio

Aplicar estas reglas según el nivel del grupo:
- "Necesita más apoyo": consignas más guiadas, con pasos intermedios
- "Sigue el ritmo del grupo": consignas normales
- "Puede ir más lejos": consignas con mayor complejidad o que inviten a ir más lejos

Aplicar estas reglas según el propósito:
- "en clase": actividades colaborativas o de discusión son válidas
- "para casa": actividades autónomas, sin necesidad de materiales especiales
- "evaluación": actividades individuales, sin ejemplos resueltos en la ficha
---FIN CONTEXTO PEDAGÓGICO---`);
  return lineas.join("\n");
})()}

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

// ─────────────────────────────────────────────
// PROMPT VALIDADOR PDL
// ─────────────────────────────────────────────
function buildPDLValidatorPrompt(fichaGenerada, contenido, tipoFicha) {
  let estructuraEsperada = "";
  let fichaTexto = "";

  if (tipoFicha === "Lectura de textos") {
    estructuraEsperada = "título, texto del tipo indicado, preguntas de comprensión";
    fichaTexto = [
      `Título: ${fichaGenerada.titulo}`,
      `Texto: ${fichaGenerada.texto}`,
      `Preguntas: ${Array.isArray(fichaGenerada.preguntas) ? fichaGenerada.preguntas.join(" | ") : fichaGenerada.preguntas}`,
    ].join("\n");
  } else if (tipoFicha === "Escritura de textos") {
    estructuraEsperada = "título, consigna motivadora, orientaciones en forma de preguntas";
    fichaTexto = [
      `Título: ${fichaGenerada.titulo}`,
      `Consigna: ${fichaGenerada.consigna}`,
      `Orientaciones: ${Array.isArray(fichaGenerada.orientaciones) ? fichaGenerada.orientaciones.join(" | ") : fichaGenerada.orientaciones}`,
    ].join("\n");
  } else {
    estructuraEsperada = "título, explicación de la regla, ejemplo concreto, ejercicios variados tipados";
    fichaTexto = [
      `Título: ${fichaGenerada.titulo}`,
      `Explicación: ${fichaGenerada.explicacion}`,
      `Ejemplo: ${fichaGenerada.ejemplo}`,
      `Ejercicios: ${Array.isArray(fichaGenerada.ejercicios)
        ? fichaGenerada.ejercicios.map(e => typeof e === "string" ? e : `[${e.tipo}] ${e.enunciado}`).join(" | ")
        : fichaGenerada.ejercicios}`,
    ].join("\n");
  }

  return `Sos un revisor pedagógico experto en educación primaria. Analizá esta ficha de Prácticas del Lenguaje.

DATOS:
- Grado: ${contenido.grado}°
- Tipo de ficha: ${tipoFicha}
- Tipo de texto / Regla: ${contenido.tipoTexto}
${contenido.practica ? `- Práctica lectora: ${contenido.practica}` : ""}

FICHA A REVISAR:
${fichaTexto}

SISTEMA DE PUNTAJE (total 100 puntos):
- ERRORES_CONCEPTUALES: 40 pts. Si hay cualquier afirmación incorrecta = 0 en este criterio.
- ADECUACION_AL_GRADO: 25 pts. Lenguaje y complejidad apropiados para ${contenido.grado}° grado.
- COHERENCIA_PEDAGOGICA: 20 pts. La ficha responde al tipo de texto/regla indicado y a la práctica lectora (si aplica).
- ESTRUCTURA_COMPLETA: 15 pts. Debe tener exactamente: ${estructuraEsperada}.

Una ficha aprueba si puntaje >= 80.

RESPUESTA (JSON estricto, sin markdown):
{
  "aprobada": true/false,
  "puntaje": 0-100,
  "problemas": [
    { "criterio": "ERRORES_CONCEPTUALES|ADECUACION_AL_GRADO|COHERENCIA_PEDAGOGICA|ESTRUCTURA_COMPLETA", "descripcion": "..." }
  ],
  "feedback_para_regenerar": "Instrucciones específicas para mejorar la ficha (solo si no está aprobada)"
}

Si la ficha no tiene problemas, devolvé "aprobada": true, "puntaje" >= 80 y "problemas": [].

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

// ─────────────────────────────────────────────
// PROMPT VALIDADOR (general + PDL)
// ─────────────────────────────────────────────
function buildValidatorPrompt(fichaGenerada, contenido, tipoFicha) {
  // Derivar a validador PDL cuando corresponde
  if (contenido.area === "Prácticas del Lenguaje") {
    return buildPDLValidatorPrompt(fichaGenerada, contenido, tipoFicha);
  }

  // ── Validación estructural temprana por tipo_ficha ──
  const _tipo = fichaGenerada.tipo_ficha;
  if (_tipo === "presentacion") {
    const ok = Array.isArray(fichaGenerada.explicacion?.parrafos)
      && fichaGenerada.explicacion.parrafos.length > 0
      && Array.isArray(fichaGenerada.ejercicios);
    if (!ok) return `Devolvé únicamente el siguiente JSON sin modificarlo:\n{"aprobada":false,"puntaje":0,"problemas":[{"criterio":"ESTRUCTURA_COMPLETA","descripcion":"Ficha de presentación incompleta: falta explicacion.parrafos o ejercicios."}],"feedback_para_regenerar":"Regenerar la ficha incluyendo explicacion.parrafos (array con al menos 1 elemento) y ejercicios (array)."}`;
  } else if (_tipo === "practica") {
    const ok = typeof fichaGenerada.concepto_clave === "string"
      && fichaGenerada.concepto_clave.trim() !== ""
      && Array.isArray(fichaGenerada.ejercicios);
    if (!ok) return `Devolvé únicamente el siguiente JSON sin modificarlo:\n{"aprobada":false,"puntaje":0,"problemas":[{"criterio":"ESTRUCTURA_COMPLETA","descripcion":"Ficha de práctica incompleta: falta concepto_clave o ejercicios."}],"feedback_para_regenerar":"Regenerar la ficha incluyendo concepto_clave (string no vacío) y ejercicios (array)."}`;
  } else if (_tipo === "cierre") {
    const ok = Array.isArray(fichaGenerada.escalera) && fichaGenerada.escalera.length === 4;
    if (!ok) return `Devolvé únicamente el siguiente JSON sin modificarlo:\n{"aprobada":false,"puntaje":0,"problemas":[{"criterio":"ESTRUCTURA_COMPLETA","descripcion":"Ficha de cierre incompleta: escalera debe tener exactamente 4 peldaños."}],"feedback_para_regenerar":"Regenerar la ficha con escalera de exactamente 4 elementos."}`;
  }
  // Si no hay tipo_ficha o es desconocido: caer al bloque de validación existente

  const tipoFichaGenerada = fichaGenerada.tipo_ficha;

  // ── Serialización y estructura esperada según tipo_ficha ──
  let elementosFicha;
  let estructuraEsperada;

  if (tipoFichaGenerada === "presentacion") {
    const parrafos = Array.isArray(fichaGenerada.explicacion?.parrafos)
      ? fichaGenerada.explicacion.parrafos.join(" / ")
      : "(ausente)";
    const pill = fichaGenerada.explicacion?.pill
      ? `pill: "${fichaGenerada.explicacion.pill.contenido}"`
      : "pill: ausente";
    const ejercicios = Array.isArray(fichaGenerada.ejercicios)
      ? fichaGenerada.ejercicios.filter(Boolean).map(e => `[${e.tipo}] ${e.enunciado}`).join(" | ")
      : "(ausente)";
    elementosFicha = [
      `Título: ${fichaGenerada.titulo}`,
      `Explicación (párrafos): ${parrafos}`,
      `Explicación (${pill})`,
      `Ejercicios: ${ejercicios}`,
    ].join("\n");
    estructuraEsperada = "título, explicacion.parrafos (array con negritas), explicacion.pill (opcional), ejercicios (array de 1-2 elementos tipados con andamiaje)";

  } else if (tipoFichaGenerada === "practica") {
    const ejercicios = Array.isArray(fichaGenerada.ejercicios)
      ? fichaGenerada.ejercicios.filter(Boolean).map(e => `[${e.tipo}] ${e.enunciado}`).join(" | ")
      : "(ausente)";
    elementosFicha = [
      `Título: ${fichaGenerada.titulo}`,
      `Concepto clave: ${fichaGenerada.concepto_clave || "(ausente)"}`,
      `Ejercicios: ${ejercicios}`,
    ].join("\n");
    estructuraEsperada = "título, concepto_clave (string), ejercicios (array de 2-4 elementos tipados con campo andamiaje)";

  } else if (tipoFichaGenerada === "cierre") {
    const escalera = Array.isArray(fichaGenerada.escalera)
      ? fichaGenerada.escalera.filter(Boolean).map(p => `[${p.rotulo}: ${p.nombre}] ${p.ejercicio?.tipo}: ${p.ejercicio?.enunciado}`).join(" | ")
      : "(ausente)";
    elementosFicha = [
      `Título: ${fichaGenerada.titulo}`,
      `Escalera: ${escalera}`,
    ].join("\n");
    estructuraEsperada = "título, escalera con 4 peldaños (Nivel 1, Nivel 2, Nivel 3, Punto de descanso), cada uno con rotulo, nombre, ejercicio tipado y andamiaje";

  } else {
    // Fallback: schema viejo sin tipo_ficha
    const ejercicios = Array.isArray(fichaGenerada.ejercicios)
      ? fichaGenerada.ejercicios.filter(Boolean).map(e => `[${e.tipo}] ${e.enunciado}`).join(" | ")
      : fichaGenerada.ejercicios;
    elementosFicha = [
      `Título: ${fichaGenerada.titulo}`,
      fichaGenerada.explicacion ? `Explicación: ${fichaGenerada.explicacion}` : null,
      `Ejercicios: ${ejercicios}`,
      `Reflexión: ${fichaGenerada.reflexion}`,
    ].filter(Boolean).join("\n");
    estructuraEsperada = "título, explicación, ejercicios tipados (completar_oraciones, tabla, verdadero_falso), pregunta de reflexión";
  }

  return `Sos un revisor pedagógico experto en educación primaria. Analizá esta ficha educativa y determiná si cumple los criterios de calidad.

DATOS CURRICULARES:
- Grado: ${contenido.grado}°
- Área: ${contenido.area}
- Bloque: ${contenido.bloque}
- Tema: ${contenido.subtema}
- Objetivo de aprendizaje: ${contenido.objetivo_especifico}
- Tipo de ficha: ${tipoFichaGenerada || tipoFicha}

${contenido.indicadores_de_avance?.length > 0 ? `INDICADORES DE AVANCE DE REFERENCIA:\n${contenido.indicadores_de_avance.map(i => `- ${i}`).join('\n')}\n` : ''}FICHA A REVISAR:
${elementosFicha}

ESTRUCTURA ESPERADA: ${estructuraEsperada}

SISTEMA DE PUNTAJE (total 100 puntos):
- ERRORES_CONCEPTUALES: 40 pts. Si hay cualquier afirmación incorrecta o imprecisa = 0 en este criterio.
- COHERENCIA_CURRICULAR: 25 pts. La ficha debe responder al contenido específico indicado, no solo al tema general.
- LENGUAJE_PRIMARIA: 20 pts. El lenguaje debe ser apropiado para niños de ${contenido.grado}° grado. Penalizá términos académicos innecesarios.
- ESTRUCTURA_COMPLETA: 15 pts. Debe tener exactamente los elementos indicados en ESTRUCTURA ESPERADA.

Calculá el puntaje sumando solo los puntos de cada criterio cumplido. Una ficha aprueba si puntaje >= 80.

RESPUESTA (JSON estricto, sin markdown):
{
  "aprobada": true/false,
  "puntaje": 0-100,
  "problemas": [
    { "criterio": "ERRORES_CONCEPTUALES|LENGUAJE_PRIMARIA|COHERENCIA_CURRICULAR|ESTRUCTURA_COMPLETA", "descripcion": "..." }
  ],
  "feedback_para_regenerar": "Instrucciones específicas para mejorar la ficha (solo si no está aprobada)"
}

Si la ficha no tiene problemas, devolvé "aprobada": true, "puntaje" >= 80 y "problemas": [].

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

// ─────────────────────────────────────────────
// LLAMADA A LA API (genérica)
// ─────────────────────────────────────────────
async function callAPI(prompt, maxTokens = 2000) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  // Detectar si la respuesta fue cortada por límite de tokens
  if (response.stop_reason === "max_tokens") {
    console.error(`[callAPI] TRUNCADO por max_tokens=${maxTokens}. Aumentar límite.`);
  }

  const text = response.content[0].text.trim();
  const clean = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/`/g, "")
    .trim();

  // Intento 1: parseo directo
  try {
    return JSON.parse(clean);
  } catch (_) {}

  // Intento 2: extraer JSON con regex (por si hay texto extra alrededor)
  const match = clean.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (_) {
      // JSON encontrado pero truncado — loguear respuesta completa
      console.error("[callAPI] JSON truncado (stop_reason:", response.stop_reason, ")");
      console.error("[callAPI] Respuesta completa:\n", text);
      throw new Error(`JSON truncado (stop_reason: ${response.stop_reason}). Ver logs para respuesta completa.`);
    }
  }

  // Sin JSON reconocible — loguear todo
  console.error("[callAPI] Sin JSON reconocible (stop_reason:", response.stop_reason, ")");
  console.error("[callAPI] Respuesta completa:\n", text);
  throw new Error(`Respuesta sin JSON válido (stop_reason: ${response.stop_reason}): ${clean.slice(0, 300)}`);
}

// ─────────────────────────────────────────────
// PIPELINE PRINCIPAL
// ─────────────────────────────────────────────
async function runPipeline(contenido, tipoFicha) {
  const isPDL = contenido.area === "Prácticas del Lenguaje";
  // Lectura PDL genera texto completo + preguntas → más tokens
  // Resto de generadores subidos a 1500 para soportar HTML de tablas/fracciones
  const maxTokens = isPDL && tipoFicha === "Lectura de textos" ? 2000 : 1500;

  // INTENTO 1: Generar
  let ficha = await callAPI(
    buildGeneratorPrompt(contenido, tipoFicha, null, contenido.indicadores_de_avance || []),
    maxTokens
  );

  // VALIDAR el primer intento
  let validacion = await callAPI(
    buildValidatorPrompt(ficha, contenido, tipoFicha)
  );

  // Si aprobó, devolvemos directo
  if (validacion.aprobada && validacion.puntaje >= 80) {
    return {
      ficha,
      validacion: { aprobada: true, puntaje: validacion.puntaje, intentos: 1 },
    };
  }

  // INTENTO 2: Regenerar con el feedback del validador
  const feedback = validacion.feedback_para_regenerar || validacion.problemas
    .map((p) => `${p.criterio}: ${p.descripcion}`)
    .join("\n");

  ficha = await callAPI(
    buildGeneratorPrompt(contenido, tipoFicha, feedback, contenido.indicadores_de_avance || []),
    maxTokens
  );

  // Validar el segundo intento
  validacion = await callAPI(
    buildValidatorPrompt(ficha, contenido, tipoFicha)
  );

  return {
    ficha,
    validacion: {
      aprobada: validacion.aprobada,
      puntaje: validacion.puntaje,
      intentos: 2,
      observaciones: !validacion.aprobada ? validacion.problemas : [],
    },
  };
}

// ─────────────────────────────────────────────
// HANDLER DE LA VERCEL FUNCTION
// ─────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { contenido, tipoFicha } = req.body;

  if (!contenido || !tipoFicha) {
    return res.status(400).json({ error: "Faltan datos del contenido curricular" });
  }

  try {
    const resultado = await runPipeline(contenido, tipoFicha);

    // DIAGNÓSTICO: ver estructura completa antes de enviar al frontend
    console.log("[DIAGNÓSTICO] JSON completo que se envía al frontend:");
    console.log(JSON.stringify(resultado, null, 2));

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en el pipeline:", error);
    return res.status(500).json({ error: "Error al generar el recurso" });
  }
}
