import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handler from "./api/generate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar variables de entorno desde .env
if (fs.existsSync(".env")) {
  fs.readFileSync(".env", "utf8")
    .split("\n")
    .forEach((line) => {
      const eq = line.indexOf("=");
      if (eq > 0) {
        const key = line.slice(0, eq).trim();
        const val = line.slice(eq + 1).trim();
        if (key) process.env[key] = val;
      }
    });
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".json": "application/json",
  ".css": "text/css",
};

const server = http.createServer(async (req, res) => {
  // CORS para dev con Vite
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // Ruta de la API
  if (req.method === "POST" && req.url === "/api/generate") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      // Añadir métodos Express-style que usa generate.js
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      };

      try {
        req.body = JSON.parse(body);
      } catch {
        res.status(400).json({ error: "JSON inválido" });
        return;
      }
      await handler(req, res);
    });
    return;
  }

  // Archivos estáticos
  const urlPath = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(__dirname, urlPath);

  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("✓ Motor Pedagógico PBA corriendo en http://localhost:3000");
});
