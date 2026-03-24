import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────
// PROMPT GENERADOR
// ─────────────────────────────────────────────
function buildGeneratorPrompt(contenido, tipoFicha, incluirExplicacion, incluirEjemplo, feedback = null) {
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

FORMATO DE RESPUESTA (JSON estricto, sin markdown):
{
  ${formatoCampos}
}`;
}

// ─────────────────────────────────────────────
// PROMPT VALIDADOR
// ─────────────────────────────────────────────
function buildValidatorPrompt(fichaGenerada, contenido, tipoFicha, incluirExplicacion, incluirEjemplo) {
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

Si la ficha no tiene problemas, devolvé "aprobada": true, "puntaje" >= 80 y "problemas": [].`;
}

// ─────────────────────────────────────────────
// LLAMADA A LA API (genérica)
// ─────────────────────────────────────────────
async function callAPI(prompt) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text.trim();
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean);
}

// ─────────────────────────────────────────────
// PIPELINE PRINCIPAL
// ─────────────────────────────────────────────
async function runPipeline(contenido, tipoFicha, incluirExplicacion, incluirEjemplo) {
  // INTENTO 1: Generar
  let ficha = await callAPI(buildGeneratorPrompt(contenido, tipoFicha, incluirExplicacion, incluirEjemplo));

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

  ficha = await callAPI(buildGeneratorPrompt(contenido, tipoFicha, incluirExplicacion, incluirEjemplo, feedback));

  // Validar el segundo intento
  validacion = await callAPI(
    buildValidatorPrompt(ficha, contenido, tipoFicha, incluirExplicacion, incluirEjemplo)
  );

  // Sea como sea, devolvemos el resultado del 2° intento
  // Si sigue fallando, incluimos las observaciones para que el docente las vea
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
