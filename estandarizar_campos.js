import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORIGINAL = "dc_pba_base_curricular_corregida.json";
// JSONs de configuración que no son datos curriculares
const EXCLUIR_CONFIGS = new Set(["package.json", "package-lock.json", "vercel.json", "tsconfig.json"]);

// ── Buscar el .json más reciente en la raíz que sea array de datos ──────────
const candidatos = fs.readdirSync(__dirname)
  .filter(f => f.endsWith(".json") && f !== ORIGINAL && !EXCLUIR_CONFIGS.has(f))
  .map(f => {
    const ruta = path.join(__dirname, f);
    try {
      const contenido = JSON.parse(fs.readFileSync(ruta, "utf-8"));
      if (!Array.isArray(contenido)) return null;
      return { nombre: f, mtime: fs.statSync(ruta).mtimeMs };
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .sort((a, b) => b.mtime - a.mtime);

let archivoTarget;

if (candidatos.length > 0) {
  archivoTarget = candidatos[0].nombre;
  console.log(`📂 Archivo encontrado: ${archivoTarget}`);
} else {
  // No hay otro archivo de datos → usar el original actualizado
  archivoTarget = ORIGINAL;
  console.log(`📂 Usando archivo de datos: ${archivoTarget}`);
}

const rutaArchivo = path.join(__dirname, archivoTarget);

// ── Leer ────────────────────────────────────────────────────────────────────
const raw = fs.readFileSync(rutaArchivo, "utf-8");
const data = JSON.parse(raw);
const arr = Array.isArray(data) ? data : null;

if (!arr) {
  console.error("❌ El JSON no es un array de registros.");
  process.exit(1);
}

// ── Procesar ─────────────────────────────────────────────────────────────────
let modificados = 0;
let yaCorrectos = 0;

const resultado = arr.map(registro => {
  if ("objetivo_especifico" in registro) {
    yaCorrectos++;
    return registro;
  }
  if ("objetivo" in registro) {
    const { objetivo, ...resto } = registro;
    modificados++;
    return { ...resto, objetivo_especifico: objetivo };
  }
  // Sin ninguna de las dos claves → no tocar
  return registro;
});

// ── Guardar ──────────────────────────────────────────────────────────────────
fs.writeFileSync(rutaArchivo, JSON.stringify(resultado, null, 2), "utf-8");

// ── Reporte ──────────────────────────────────────────────────────────────────
console.log("\n✅ Estandarización completada\n");
console.log(`  Modificados (objetivo → objetivo_especifico): ${modificados}`);
console.log(`  Ya tenían objetivo_especifico:                ${yaCorrectos}`);
console.log(`  Total procesados:                             ${arr.length}`);
console.log(`\n  Archivo actualizado: ${archivoTarget}`);
