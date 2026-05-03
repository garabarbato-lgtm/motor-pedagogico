import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callAPI(prompt, maxTokens = 500) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  const text = response.content[0].text.trim();
  const clean = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").replace(/`/g, "").trI will verify the content of `api/reformular.js` to see if the subagent successfully updated it.

import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 55000 });

async function callAPI(prompt, maxTokens = 500) {
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
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { ficha, registro, seleccion } = req.body;
  if (!ficha || !registro || !seleccion) return res.status(400).json({ error: "Faltan datos" });
  try {
    const prompt = `Como docente de primaria de Buenos Aires, reformulá SOLO el siguiente texto manteniendo el tipo de ejercicio y dificultad para ${registro.grado} de ${registro.area} (${registro.bloque}).
    TEXTO: "${seleccion}"
    CONTEXTO FICHA: ${JSON.stringify(ficha)}
    Responde exclusivamente JSON: {"texto": "..."}`;
    const result = await callAPI(prompt);
    res.status(200).json({ texto: result.texto });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
