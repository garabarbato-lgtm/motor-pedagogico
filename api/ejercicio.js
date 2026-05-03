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

  const prompt = `Sos un docente experto en primaria de Buenos Aires. 
Generá 1 ejercicio nuevo similar a los existentes para una ficha de ${registro.area} de ${registro.grado}° grado.
Bloque: ${registro.bloque}. Objetivo: ${registro.objetivo}.
Actividades actuales:
${ficha.actividad}

Pedimos 1 ejercicio adicional con el mismo estilo, formato y lenguaje.
Respuesta JSON estricta: { "ejercicio": "texto del ejercicio nuevo" }`;

  try {
    const timeout = new Promise((_, r) => setTimeout(() => r(new Error("TIMEOUT")), 55000));
    const result = await Promise.race([callAPI(prompt), timeout]);
    return res.status(200).json({ ejercicio: result.ejercicio });
  } catch (error) {
    if (error.message === "TIMEOUT") return res.status(504).json({ error: "TIMEOUT" });
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
}
