export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { voto, comentario } = req.body ?? {};
  console.log("[feedback]", { voto, comentario, ts: new Date().toISOString() });

  // TODO: guardar en Notion DB o Google Sheets
  // const notion = new Client({ auth: process.env.NOTION_API_KEY });
  // await notion.pages.create({ parent: { database_id: "..." }, properties: { ... } });

  res.status(200).json({ ok: true });
}
