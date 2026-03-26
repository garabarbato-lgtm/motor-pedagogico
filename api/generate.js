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
- Marcá con **doble asterisco** los nombres propios, datos importantes y conceptos clave del texto
- El título debe estar en mayúscula normal (solo la primera letra de la primera palabra en mayúscula, no todo en mayúsculas)

FORMATO DE RESPUESTA (JSON estricto, sin markdown):
{
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
- El título debe estar en mayúscula normal (solo la primera letra de la primera palabra en mayúscula)

FORMATO DE RESPUESTA (JSON estricto, sin markdown):
{
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

La ficha debe tener:
- Título con la regla
- Explicación breve y clara de la regla (máximo 2 oraciones)
- Un ejemplo concreto
- Entre 2 y 3 ejercicios variados sobre esa regla

Criterios:
- Los ejercicios deben ser variados: completar, corregir, clasificar, inventar
- El vocabulario de los ejercicios debe ser conocido para el grado
- Evitar ejercicios mecánicos sin sentido (ej. "escribí 10 palabras con mb")
- Priorizar ejercicios en contexto de oraciones o textos breves
- Los ejercicios deben ser strings simples con el enunciado (sin numeración — el número se muestra automáticamente)
- Marcá con **doble asterisco** las palabras clave o términos importantes en la explicación y los ejercicios
- El título debe estar en mayúscula normal (solo la primera letra de la primera palabra en mayúscula)

FORMATO DE RESPUESTA (JSON estricto, sin markdown):
{
  "titulo": "título con la regla ortográfica",
  "explicacion": "explicación breve de la regla (máximo 2 oraciones)",
  "ejemplo": "un ejemplo concreto de la regla",
  "ejercicios": [
    "ejercicio 1",
    "ejercicio 2",
    "ejercicio 3",
    "ejercicio 4"
  ]
}

Respondé SOLO con JSON válido, sin texto adicional, sin backticks, sin markdown.`;
}

// ─────────────────────────────────────────────
// PROMPT GENERADOR (general + PDL)
// ─────────────────────────────────────────────
function buildGeneratorPrompt(contenido, tipoFicha, incluirExplicacion, incluirEjemplo, feedback = null) {
  // Derivar a prompts PDL cuando corresponde
  if (contenido.area === "Prácticas del Lenguaje") {
    if (tipoFicha === "Lectura de textos") return buildPDLLecturaPrompt(contenido, feedback);
    if (tipoFicha === "Escritura de textos") return buildPDLEscrituraPrompt(contenido, feedback);
    if (tipoFicha === "Ortografía") return buildPDLOrtografiaPrompt(contenido, feedback);
  }

  // Prompt general (Matemática, Ciencias, etc.)
  const feedbackSection = feedback
    ? `\n\nATENCIÓN: El intento anterior fue rechazado por las siguientes razones:\n${feedback}\nCorregí estos problemas en esta nueva versión.`
    : "";

  const estructuraElementos = [
    "- Título atractivo para el alumno",
    incluirExplicacion ? "- Explicación breve del concepto, en lenguaje claro para el grado" : null,
    incluirEjemplo ? "- Ejemplo concreto cercano a la experiencia del alumno" : null,
    `- Actividad de tipo ${tipoFicha}`,
    "- Pregunta de reflexión final",
  ].filter(Boolean).join("\n");

  const formatoCampos = [
    '"titulo": "..."',
    incluirExplicacion ? '"explicacion": "..."' : null,
    incluirEjemplo ? '"ejemplo": "..."' : null,
    '"actividad": "..."',
    '"pregunta_reflexion": "..."',
  ].filter(Boolean).join(",\n  ");

  return `Sos un docente experto en didáctica de nivel primario de la Provincia de Buenos Aires.
Generá un recurso educativo para estudiantes de primaria con esta información curricular:

Grado: ${contenido.grado}°
Área: ${contenido.area}
Bloque: ${contenido.bloque}
Contenido: ${contenido.item}
${contenido.contexto_pedagogico ? `Contexto pedagógico adicional: ${contenido.contexto_pedagogico}` : ""}
${feedbackSection}

ESTRUCTURA DE LA FICHA (incluí exactamente estos elementos):
${estructuraElementos}

CRITERIOS OBLIGATORIOS:
1. Lenguaje claro y adecuado para niños de primaria (evitá términos académicos complejos)
2. La actividad debe promover comprensión real, no ejercicios mecánicos sin sentido
3. Todo el contenido debe responder al objetivo curricular específico, no al tema general
4. La actividad debe incluir máximo 3 ejercicios o problemas para que entre en una hoja A4
5. Los ejercicios de la actividad deben estar numerados exactamente así: "1. [enunciado]\n2. [enunciado]\n3. [enunciado]"
6. Marcá con **doble asterisco** los números, datos importantes y conceptos clave en la explicación y los ejercicios
7. El título debe estar en mayúscula normal (solo la primera letra de la primera palabra en mayúscula, no TODO MAYÚSCULAS)

FORMATO DE RESPUESTA (JSON estricto, sin markdown):
{
  ${formatoCampos}
}

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
    estructuraEsperada = "título, explicación de la regla, ejemplo concreto, ejercicios variados";
    fichaTexto = [
      `Título: ${fichaGenerada.titulo}`,
      `Explicación: ${fichaGenerada.explicacion}`,
      `Ejemplo: ${fichaGenerada.ejemplo}`,
      `Ejercicios: ${Array.isArray(fichaGenerada.ejercicios) ? fichaGenerada.ejercicios.join(" | ") : fichaGenerada.ejercicios}`,
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
function buildValidatorPrompt(fichaGenerada, contenido, tipoFicha, incluirExplicacion, incluirEjemplo) {
  // Derivar a validador PDL cuando corresponde
  if (contenido.area === "Prácticas del Lenguaje") {
    return buildPDLValidatorPrompt(fichaGenerada, contenido, tipoFicha);
  }

  const elementosFicha = [
    `Título: ${fichaGenerada.titulo}`,
    incluirExplicacion ? `Explicación: ${fichaGenerada.explicacion}` : null,
    incluirEjemplo ? `Ejemplo: ${fichaGenerada.ejemplo}` : null,
    `Actividad: ${fichaGenerada.actividad}`,
    `Pregunta de reflexión: ${fichaGenerada.pregunta_reflexion}`,
  ].filter(Boolean).join("\n");

  const estructuraEsperada = [
    "título",
    incluirExplicacion ? "explicación" : null,
    incluirEjemplo ? "ejemplo concreto" : null,
    "actividad significativa",
    "pregunta de reflexión",
  ].filter(Boolean).join(", ");

  return `Sos un revisor pedagógico experto en educación primaria. Analizá esta ficha educativa y determiná si cumple los criterios de calidad.

DATOS CURRICULARES:
- Grado: ${contenido.grado}°
- Área: ${contenido.area}
- Bloque: ${contenido.bloque}
- Contenido: ${contenido.item}
- Tipo de ficha solicitada: ${tipoFicha}

FICHA A REVISAR:
${elementosFicha}

SISTEMA DE PUNTAJE (total 100 puntos):
- ERRORES_CONCEPTUALES: 40 pts. Si hay cualquier afirmación incorrecta o imprecisa = 0 en este criterio.
- COHERENCIA_CURRICULAR: 25 pts. La ficha debe responder al contenido específico indicado, no solo al tema general.
- LENGUAJE_PRIMARIA: 20 pts. El lenguaje debe ser apropiado para niños de ${contenido.grado}° grado. Penalizá términos académicos innecesarios.
- ESTRUCTURA_COMPLETA: 15 pts. Debe tener exactamente los elementos solicitados: ${estructuraEsperada}.

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
async function callAPI(prompt, maxTokens = 1000) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text.trim();
  const clean = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/`/g, "")
    .trim();
  try {
    return JSON.parse(clean);
  } catch {
    // Intentar extraer JSON del texto si hay contenido extra alrededor
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Respuesta no es JSON válido: ${clean.slice(0, 120)}`);
  }
}

// ─────────────────────────────────────────────
// PIPELINE PRINCIPAL
// ─────────────────────────────────────────────
async function runPipeline(contenido, tipoFicha, incluirExplicacion, incluirEjemplo) {
  const isPDL = contenido.area === "Prácticas del Lenguaje";
  // Lectura necesita más tokens porque genera texto + preguntas
  const maxTokens = isPDL && tipoFicha === "Lectura de textos" ? 1500 : 1000;

  // INTENTO 1: Generar
  let ficha = await callAPI(
    buildGeneratorPrompt(contenido, tipoFicha, incluirExplicacion, incluirEjemplo),
    maxTokens
  );

  // VALIDAR el primer intento
  let validacion = await callAPI(
    buildValidatorPrompt(ficha, contenido, tipoFicha, incluirExplicacion, incluirEjemplo)
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
    buildGeneratorPrompt(contenido, tipoFicha, incluirExplicacion, incluirEjemplo, feedback),
    maxTokens
  );

  // Validar el segundo intento
  validacion = await callAPI(
    buildValidatorPrompt(ficha, contenido, tipoFicha, incluirExplicacion, incluirEjemplo)
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

  const { contenido, tipoFicha, incluirExplicacion = false, incluirEjemplo = false } = req.body;

  if (!contenido || !tipoFicha) {
    return res.status(400).json({ error: "Faltan datos del contenido curricular" });
  }

  try {
    const resultado = await runPipeline(contenido, tipoFicha, incluirExplicacion, incluirEjemplo);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en el pipeline:", error);
    return res.status(500).json({ error: "Error al generar el recurso" });
  }
}
