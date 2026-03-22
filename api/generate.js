import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { grado, area, bloque, item, objetivo } = req.body;

  if (!grado || !area || !bloque || !objetivo) {
    return res.status(400).json({ error: "Faltan datos del contenido curricular" });
  }

  const prompt = `Sos un docente experto en didáctica de nivel primario de la Provincia de Buenos Aires.

Generá un recurso educativo breve para este contenido curricular:

Grado: ${grado}° año
Área: ${area}
Bloque: ${bloque}
Contenido: ${item}
Objetivo de aprendizaje: ${objetivo}

El recurso debe tener esta estructura exacta en JSON:
{
  "titulo": "título claro y atractivo para el alumno",
  "explicacion": "explicación breve del concepto en lenguaje claro para primaria (3-4 oraciones)",
  "ejemplo": "un ejemplo concreto y cercano a la experiencia del alumno",
  "actividad": "una actividad significativa que invite a pensar, no mecánica"
}

Respondé SOLO con el JSON, sin texto adicional ni markdown.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;
    const recurso = JSON.parse(text);

    return res.status(200).json(recurso);
  } catch (error) {
    console.error("Error generando recurso:", error);
    return res.status(500).json({
      error: "Error al generar el recurso educativo",
      detail: error.message,
    });
  }
}
