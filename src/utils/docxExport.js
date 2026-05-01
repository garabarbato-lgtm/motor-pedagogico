import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, ShadingType, VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";

// ── Constantes de diseño tiza ──
const VERDE   = "00c48c";
const VERDE_BG = "eafaf4";
const HEADER_BG = "f5f5f0";
const TEXTO   = "0d1f1a";
const MUTED   = "555555";
const BORDER  = "0d0d0d";
const LINEA   = "bbbbbb";
const FONT    = "Lexend Deca";

// ── Helpers de texto ──

function run(text, opts = {}) {
  return new TextRun({ text: String(text || ""), font: FONT, color: TEXTO, size: 22, ...opts });
}

function htmlToRuns(html, baseOpts = {}) {
  if (!html) return [run("", baseOpts)];
  const div = document.createElement("div");
  div.innerHTML = String(html)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/<frac>(\d+)\/(\d+)<\/frac>/g, "$1/$2");

  const runs = [];
  function walk(node, bold, italic, underline) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text) runs.push(run(text, { ...baseOpts, bold: bold || baseOpts.bold, italics: italic, underline: underline ? {} : undefined }));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (tag === "br") { runs.push(new TextRun({ break: 1 })); return; }
      const b = bold || tag === "b" || tag === "strong";
      const i = italic || tag === "i" || tag === "em";
      const u = underline || tag === "u";
      node.childNodes.forEach(c => walk(c, b, i, u));
    }
  }
  div.childNodes.forEach(c => walk(c, false, false, false));
  return runs.length ? runs : [run("", baseOpts)];
}

function strip(str) {
  if (!str) return "";
  return String(str).replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/<[^>]+>/g, "").trim();
}

// ── Captura de ediciones del DOM ──
// Lee los campos editables del DOM en orden y los devuelve como array de strings
function leerEditables(hojaId) {
  const el = document.getElementById(hojaId || "ficha-imprimible");
  if (!el) return [];
  return Array.from(el.querySelectorAll(".ficha-campo-editable")).map(e => e.innerHTML || e.innerText || "");
}

// ── Bloques de diseño ──

function espacioVacio(before = 100, after = 100) {
  return new Paragraph({ children: [run("")], spacing: { before, after } });
}

function separador() {
  return new Paragraph({
    children: [run("")],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER } },
    spacing: { before: 0, after: 0 },
  });
}

function encabezadoSeccion(numero, titulo) {
  return new Paragraph({
    children: [
      run(`${numero}  `, { bold: true, color: VERDE, size: 24 }),
      run(titulo, { bold: true, color: TEXTO, size: 24 }),
    ],
    shading: { type: ShadingType.SOLID, color: VERDE_BG },
    spacing: { before: 200, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: VERDE } },
  });
}

function bloqueTitulo(tituloTexto) {
  const colonIdx = tituloTexto.indexOf(":");
  const children = colonIdx !== -1
    ? [
        run(tituloTexto.slice(0, colonIdx + 1), { bold: true, size: 36, color: TEXTO }),
        run(tituloTexto.slice(colonIdx + 1), { bold: true, size: 36, color: VERDE }),
      ]
    : [run(tituloTexto, { bold: true, size: 36, color: VERDE })];

  return new Paragraph({ children, alignment: AlignmentType.CENTER, spacing: { after: 200 } });
}

// Ancho de contenido = 12240 (Letter) - 864*2 (márgenes) = 10512 DXA
const CONTENT_WIDTH = 10512;

function tablaCamposAlumno() {
  const COL = Math.floor(CONTENT_WIDTH / 3); // 3504 DXA cada columna
  const campo = (label, w) => new TableCell({
    children: [
      new Paragraph({ children: [run(label, { size: 16, color: MUTED, bold: true })], spacing: { after: 40 } }),
      new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BORDER } }, children: [run("")], spacing: { before: 240 } }),
    ],
    width: { size: w, type: WidthType.DXA },
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
    margins: { right: 160 },
  });

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [COL, COL, CONTENT_WIDTH - COL * 2],
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideH: { style: BorderStyle.NONE }, insideV: { style: BorderStyle.NONE } },
    rows: [new TableRow({ children: [campo("NOMBRE Y APELLIDO", COL), campo("FECHA", COL), campo("GRADO / SECCIÓN", CONTENT_WIDTH - COL * 2)] })],
  });
}

function lineaEscritura() {
  return new Paragraph({
    children: [run("_".repeat(55), { color: LINEA })],
    spacing: { before: 60, after: 60 },
  });
}

function lineasRespuesta(n = 3) {
  return Array.from({ length: n }, () => lineaEscritura());
}

function pie(registro) {
  return new Paragraph({
    children: [run(`tiza.  ·  Diseño Curricular 2018  ·  ${registro.grado}° grado  ·  ${registro.area}  ·  ${registro.bloque || ""}`, { size: 16, color: MUTED })],
    alignment: AlignmentType.RIGHT,
    spacing: { before: 400 },
  });
}

// ── Renders por tipo de ejercicio ──

function renderEjercicio(ej, idx) {
  if (!ej) return [];
  const bloques = [];
  const enunciado = strip(ej.enunciado || ej.consigna || "");
  bloques.push(new Paragraph({
    children: [run(`${idx + 1}.  `, { bold: true }), ...htmlToRuns(enunciado)],
    spacing: { before: 160, after: 80 },
  }));

  const tipo = ej.tipo;

  if (tipo === "completar_oraciones" && Array.isArray(ej.oraciones)) {
    ej.oraciones.forEach(o => {
      bloques.push(new Paragraph({ children: htmlToRuns(strip(o)), spacing: { before: 60, after: 100 } }));
    });
  } else if (tipo === "verdadero_falso" && Array.isArray(ej.afirmaciones)) {
    ej.afirmaciones.forEach(a => {
      bloques.push(new Paragraph({
        children: [run("V  /  F    ", { bold: true, color: VERDE }), ...htmlToRuns(strip(a))],
        spacing: { before: 60, after: 60 },
      }));
    });
  } else if ((tipo === "preguntas_comprension" || tipo === "preguntas") && Array.isArray(ej.preguntas)) {
    ej.preguntas.forEach((p, i) => {
      bloques.push(new Paragraph({ children: [run(`${i + 1}. `, { bold: true }), ...htmlToRuns(strip(p))], spacing: { before: 60, after: 0 } }));
      bloques.push(...lineasRespuesta(2));
    });
  } else if (tipo === "texto_libre") {
    bloques.push(...lineasRespuesta(4));
  } else if (tipo === "situacion_problematica") {
    const situacion = strip(ej.situacion || ej.texto || "");
    if (situacion) bloques.push(new Paragraph({ children: htmlToRuns(situacion), spacing: { before: 60, after: 80 } }));
    bloques.push(...lineasRespuesta(3));
  } else if (tipo === "tabla" && Array.isArray(ej.columnas) && Array.isArray(ej.filas)) {
    const colCount = ej.columnas.length;
    const colW = Math.floor(CONTENT_WIDTH / colCount);
    const colWidths = Array.from({ length: colCount }, (_, i) =>
      i === colCount - 1 ? CONTENT_WIDTH - colW * (colCount - 1) : colW
    );
    const border = { style: BorderStyle.SINGLE, size: 4, color: BORDER };
    const cellBorders = { top: border, bottom: border, left: border, right: border };
    const headerCells = ej.columnas.map((col, i) =>
      new TableCell({
        children: [new Paragraph({ children: [run(strip(col), { bold: true, color: VERDE })], alignment: AlignmentType.CENTER })],
        shading: { type: ShadingType.CLEAR, color: VERDE_BG },
        width: { size: colWidths[i], type: WidthType.DXA },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
      })
    );
    const bodyRows = ej.filas.map(fila =>
      new TableRow({
        children: fila.map((celda, i) =>
          new TableCell({
            children: [new Paragraph({ children: [run(strip(celda || ""))], spacing: { before: 80, after: 80 } })],
            width: { size: colWidths[i], type: WidthType.DXA },
            borders: cellBorders,
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
          })
        ),
      })
    );
    bloques.push(new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: colWidths,
      rows: [new TableRow({ children: headerCells }), ...bodyRows],
    }));
  } else {
    bloques.push(...lineasRespuesta(3));
  }

  if (ej.andamiaje) {
    const texto = typeof ej.andamiaje === "string" ? ej.andamiaje : (ej.andamiaje.texto || "");
    if (texto) {
      bloques.push(new Paragraph({
        children: [run("💡  Ayuda: ", { bold: true, color: VERDE, size: 20 }), run(strip(texto), { color: TEXTO, size: 20 })],
        shading: { type: ShadingType.SOLID, color: "fffde7" },
        spacing: { before: 80, after: 80 },
      }));
    }
  }

  return bloques;
}

// ── Sección de contenido por tipo_ficha ──

function buildContenido(ficha, editables) {
  const tipo = ficha.tipo_ficha;
  const bloques = [];
  let editIdx = 1; // índice 0 = título, siguiente = campos del cuerpo

  // ── PRESENTACIÓN (general + ortografía) ──
  if (tipo === "presentacion" || tipo === "ortografia_pdl_presentacion") {
    const parrafos = ficha.explicacion?.parrafos || [];
    bloques.push(encabezadoSeccion("1", "Leemos juntos"));
    parrafos.forEach((p) => {
      const html = editables[editIdx] !== undefined ? editables[editIdx] : p;
      editIdx++;
      bloques.push(new Paragraph({ children: htmlToRuns(html), spacing: { before: 80, after: 80 }, indent: { left: 80 } }));
    });

    const pill = ficha.explicacion?.pill;
    if (pill?.contenido) {
      bloques.push(new Paragraph({
        children: [run("💡  ", {}), run(strip(pill.contenido), { italics: true, color: MUTED, size: 20 })],
        shading: { type: ShadingType.SOLID, color: "f0fdf8" },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: VERDE } },
        spacing: { before: 120, after: 120 },
        indent: { left: 160 },
      }));
    }

    bloques.push(espacioVacio(80, 80));
    bloques.push(encabezadoSeccion("2", "Tu turno"));
    const ejercicios = (ficha.ejercicios || []).filter(Boolean).slice(0, 2);
    ejercicios.forEach((ej, idx) => bloques.push(...renderEjercicio(ej, idx)));
  }

  // ── PRÁCTICA ──
  else if (tipo === "practica") {
    if (ficha.concepto_clave) {
      bloques.push(new Paragraph({
        children: [run("📌  ", {}), run(strip(ficha.concepto_clave), { bold: true, color: VERDE })],
        shading: { type: ShadingType.SOLID, color: VERDE_BG },
        spacing: { before: 0, after: 160 },
      }));
    }
    if (ficha.explicacion) {
      bloques.push(new Paragraph({ children: htmlToRuns(strip(ficha.explicacion)), spacing: { after: 80 } }));
    }
    bloques.push(encabezadoSeccion("1", "Actividades"));
    const ejercicios = (ficha.ejercicios || []).filter(Boolean);
    ejercicios.forEach((ej, idx) => bloques.push(...renderEjercicio(ej, idx)));
  }

  // ── CIERRE (escalera) ──
  else if (tipo === "cierre" || tipo?.includes("ortografia_pdl_cierre")) {
    const escalera = ficha.escalera || [];
    escalera.forEach((peldano, idx) => {
      bloques.push(new Paragraph({
        children: [
          run(`${peldano.rotulo || `Nivel ${idx + 1}`}  `, { bold: true, color: VERDE, size: 24 }),
          run(peldano.nombre || "", { bold: true, color: TEXTO, size: 22 }),
        ],
        shading: { type: ShadingType.SOLID, color: VERDE_BG },
        spacing: { before: 200, after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: VERDE } },
      }));
      if (peldano.ejercicio) bloques.push(...renderEjercicio(peldano.ejercicio, 0));
      bloques.push(espacioVacio(60, 60));
    });
  }

  // ── LECTURA PDL ──
  else if (tipo === "lectura_pdl") {
    bloques.push(encabezadoSeccion("1", "Leemos el texto"));
    if (ficha.texto) {
      bloques.push(new Paragraph({
        children: htmlToRuns(ficha.texto),
        spacing: { before: 80, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 8, color: VERDE } },
        indent: { left: 160 },
      }));
    }
    if (Array.isArray(ficha.glosario) && ficha.glosario.length) {
      bloques.push(new Paragraph({ children: [run("Glosario", { bold: true, color: VERDE })], spacing: { before: 120, after: 60 } }));
      ficha.glosario.forEach(g => {
        bloques.push(new Paragraph({ children: [run(`${g.palabra}: `, { bold: true }), run(strip(g.definicion))], spacing: { after: 40 } }));
      });
    }
    bloques.push(encabezadoSeccion("2", "Respondemos"));
    (ficha.preguntas || []).forEach((p, i) => {
      const texto = typeof p === "string" ? p : (p.texto || p.pregunta || "");
      bloques.push(new Paragraph({ children: [run(`${i + 1}. `, { bold: true }), ...htmlToRuns(strip(texto))], spacing: { before: 120, after: 0 } }));
      bloques.push(...lineasRespuesta(2));
    });
  }

  // ── ESCRITURA PDL ──
  else if (tipo?.includes("escritura_pdl")) {
    if (ficha.consigna) {
      bloques.push(encabezadoSeccion("1", "La consigna"));
      bloques.push(new Paragraph({ children: htmlToRuns(strip(ficha.consigna)), spacing: { before: 80, after: 120 } }));
    }
    if (Array.isArray(ficha.pasos) && ficha.pasos.length) {
      bloques.push(encabezadoSeccion("2", "Pasos para escribir"));
      ficha.pasos.forEach((paso, i) => {
        bloques.push(new Paragraph({ children: [run(`${i + 1}. `, { bold: true }), ...htmlToRuns(strip(paso))], spacing: { before: 60, after: 60 } }));
      });
    }
    bloques.push(encabezadoSeccion("3", "Tu texto"));
    bloques.push(...lineasRespuesta(8));
  }

  // ── ORTOGRAFÍA PRÁCTICA / CIERRE (plana) ──
  else if (tipo?.includes("ortografia_pdl")) {
    if (ficha.concepto_clave) {
      bloques.push(new Paragraph({
        children: [run("📌  ", {}), run(strip(ficha.concepto_clave), { bold: true, color: VERDE })],
        shading: { type: ShadingType.SOLID, color: VERDE_BG },
        spacing: { before: 0, after: 160 },
      }));
    }
    if (ficha.explicacion && typeof ficha.explicacion === "string") {
      bloques.push(new Paragraph({ children: htmlToRuns(strip(ficha.explicacion)), spacing: { after: 120 } }));
    }
    bloques.push(encabezadoSeccion("1", "Actividades"));
    const ejercicios = (ficha.ejercicios || []).filter(Boolean);
    ejercicios.forEach((ej, idx) => bloques.push(...renderEjercicio(ej, idx)));
  }

  // ── GENÉRICO ──
  else {
    if (ficha.explicacion) {
      bloques.push(encabezadoSeccion("1", "Leemos juntos"));
      const parrafos = Array.isArray(ficha.explicacion?.parrafos) ? ficha.explicacion.parrafos : [ficha.explicacion];
      parrafos.forEach(p => bloques.push(new Paragraph({ children: htmlToRuns(strip(p)), spacing: { before: 80, after: 80 } })));
    }
    if (Array.isArray(ficha.ejercicios) && ficha.ejercicios.length) {
      bloques.push(encabezadoSeccion("2", "Actividades"));
      ficha.ejercicios.filter(Boolean).forEach((ej, idx) => bloques.push(...renderEjercicio(ej, idx)));
    }
  }

  return bloques;
}

// ── Función principal ──

export async function exportFichaToDocx(ficha, registro, hojaId = "ficha-imprimible") {
  const t = (ficha.titulo || "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").trim();
  const tituloTexto = t.charAt(0).toUpperCase() + t.slice(1);
  const editables = leerEditables(hojaId);

  const children = [
    bloqueTitulo(tituloTexto),
    tablaCamposAlumno(),
    espacioVacio(160, 60),
    separador(),
    espacioVacio(60, 60),
    ...buildContenido(ficha, editables),
    pie(registro),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 22, color: TEXTO },
          paragraph: { spacing: { line: 360 } },
        },
      },
    },
    sections: [{
      properties: {
        page: { margin: { top: 720, right: 864, bottom: 720, left: 864 } },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const areaSlug = (registro.area || "ficha").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  saveAs(blob, `tiza-${areaSlug}-${registro.grado}.docx`);
}
