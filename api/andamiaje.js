import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callAPI(prompt, maxTokens = 1000) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  const text = response.content[0].text.trim();
  const clean = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").replace(/`/g, "").trim();
  try { return JSON.parse(clean); } catch (_) {}
  const match = clean.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch (_) { throw new Error("JSON truncado"); } }
  throw new Error("Sin JSON válido: " + clean.slice(0, 200));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
  const { ficha, registro } = req.body;
  if (!ficha || !registro) return res.status(400).json({ error: "Faltan ficha o registro" });

  const logica = async () => {
    const prompt = `Sos un docente experto en DUA (Diseño Universal del Aprendizaje) para primaria de la Provincia de Buenos Aires.
Adaptá esta ficha de ${registro.area} (${registro.grado}° grado) aplicando criterios DUA: simplificá el lenguaje, agregá pasos claros, usá ejemplos concretos y preguntas guía que faciliten la comprensión para todos los alumnos.

Explicación actual: "${ficha.explicacion || ""}"
Actividad actual: "${ficha.actividad || ""}"

Bloque: ${registro.bloque}. Objetivo: ${registro.objetivo}.

Respondé SOLO con este JSON: { "explicacion": "explicación adaptada", "actividad": "actividad adaptada" }`;

    const resAPI = await callAPI(prompt, 1200);
    return { ...ficha, explicacion: resAPI.explicacion, actividad: resAPI.actividad };
  };

  try {
    const resultado = await Promise.race([
      logica(),
      new Promise((_, r) => setTimeout(() => r(new Error("TIMEOUT")), 55000))
    ]);
    return res.status(200).json(resultado);
  } catch (error) {
    if (error.message === "TIMEOUT") return res.status(504).json({ error: "TIMEOUT" });
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
}
