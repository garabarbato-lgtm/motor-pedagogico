import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVO = "dc_pba_base_curricular_corregida.json";
const ORDEN_CLAVES = ["id", "area", "grado", "bloque", "item_original", "subtema", "objetivo_especifico", "tipo"];

const ruta = path.join(__dirname, ARCHIVO);
const data = JSON.parse(fs.readFileSync(ruta, "utf-8"));

let sinSubtema = 0;
let tipoNormalizado = 0;
let yaCorrectos = 0;

const resultado = data.map(registro => {
  let r = { ...registro };

  // 2. Agregar subtema si falta
  if (!("subtema" in r)) {
    r.subtema = r.item_original;
    sinSubtema++;
  }

  // 3. Estandarizar tipo
  if (r.tipo === "contenido") {
    r.tipo = "contenido_atomico";
    tipoNormalizado++;
  } else {
    yaCorrectos++;
  }

  // 1. Reconstruir con claves en orden exacto (omitir las que no existan)
  const ordenado = {};
  for (const clave of ORDEN_CLAVES) {
    if (clave in r) ordenado[clave] = r[clave];
  }
  // Preservar claves extra no contempladas en el orden
  for (const clave of Object.keys(r)) {
    if (!(clave in ordenado)) ordenado[clave] = r[clave];
  }

  return ordenado;
});

fs.writeFileSync(ruta, JSON.stringify(resultado, null, 2), "utf-8");

console.log("\n✅ Normalización completada\n");
console.log(`  Total procesados:                          ${data.length}`);
console.log(`  Sin subtema → copiado de item_original:   ${sinSubtema}`);
console.log(`  tipo "contenido" → "contenido_atomico":   ${tipoNormalizado}`);
console.log(`  Ya estaban correctos (tipo sin cambio):   ${yaCorrectos}`);
console.log(`\n  Archivo actualizado: ${ARCHIVO}`);
