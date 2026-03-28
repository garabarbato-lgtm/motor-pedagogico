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

  const camposOpcionales = [
    incluirExplicacion ? '  "concepto_clave": "definición del concepto en una oración",' : null,
    incluirExplicacion ? '  "explicacion": "explicación breve en lenguaje claro para el grado",' : null,
  ].filter(Boolean).join("\n");

  return `Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá un recurso educativo para:

Grado: ${contenido.grado}°
Área: ${contenido.area}
Bloque: ${contenido.bloque}
Contenido: ${contenido.item}
${contenido.contexto_pedagogico ? `Contexto adicional: ${contenido.contexto_pedagogico}` : ""}
${feedbackSection}

CRITERIOS:
1. Lenguaje claro para niños de primaria — sin términos académicos
2. IMPORTANTE: Generá EXACTAMENTE 3 ejercicios, ni más ni menos. Si generás un cuarto ejercicio el sistema lo va a ignorar y quedará incompleto. Máximo 3.
3. Marcá con **doble asterisco** números, datos y conceptos clave en la explicación
4. Título: dos partes separadas por dos puntos, mayúscula solo en la primera letra
5. Elegí 1 o 2 emojis relevantes al tema para "emojis"

TIPOS DE EJERCICIO:
- "texto_libre": problemas o respuestas abiertas. Puede incluir "emoji" si hay objeto cotidiano concreto.
- "completar_oraciones": array "oraciones" con strings con _______ (5+ guiones) donde va la respuesta
- "tabla": "columnas" = encabezados. "filas" = array de arrays donde cada sub-array tiene un valor por columna (string vacío "" para celda que el alumno completa). NUNCA concatenar varias columnas en un solo string.
- "verdadero_falso": array "afirmaciones" para evaluar con V/F
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
      "tipo": "tabla",
      "enunciado": "Completá la tabla:",
      "columnas": ["Fracción", "Numerador", "Denominador"],
      "filas": [["<frac>1/2</frac>", "", ""], ["<frac>3/4</frac>", "", ""]]
    }
  ],
  "reflexion": "pregunta para conectar con la vida cotidiana del alumno"
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
function buildValidatorPrompt(fichaGenerada, contenido, tipoFicha, incluirExplicacion, incluirEjemplo) {
  // Derivar a validador PDL cuando corresponde
  if (contenido.area === "Prácticas del Lenguaje") {
    return buildPDLValidatorPrompt(fichaGenerada, contenido, tipoFicha);
  }

  const elementosFicha = [
    `Título: ${fichaGenerada.titulo}`,
    incluirExplicacion ? `Explicación: ${fichaGenerada.explicacion}` : null,
    `Ejercicios: ${Array.isArray(fichaGenerada.ejercicios)
      ? fichaGenerada.ejercicios.map(e => `[${e.tipo}] ${e.enunciado}`).join(" | ")
      : fichaGenerada.ejercicios}`,
    `Reflexión: ${fichaGenerada.reflexion}`,
  ].filter(Boolean).join("\n");

  const estructuraEsperada = [
    "título",
    incluirExplicacion ? "explicación" : null,
    "ejercicios tipados (texto_libre, completar_oraciones, tabla, verdadero_falso)",
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
async function callAPI(prompt, maxTokens = 1500) {
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
async function runPipeline(contenido, tipoFicha, incluirExplicacion, incluirEjemplo) {
  const isPDL = contenido.area === "Prácticas del Lenguaje";
  // Lectura PDL genera texto completo + preguntas → más tokens
  // Resto de generadores subidos a 1500 para soportar HTML de tablas/fracciones
  const maxTokens = isPDL && tipoFicha === "Lectura de textos" ? 2000 : 1500;

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

    // DIAGNÓSTICO: ver estructura completa antes de enviar al frontend
    console.log("[DIAGNÓSTICO] JSON completo que se envía al frontend:");
    console.log(JSON.stringify(resultado, null, 2));

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en el pipeline:", error);
    return res.status(500).json({ error: "Error al generar el recurso" });
  }
}
