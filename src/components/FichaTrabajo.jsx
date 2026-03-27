import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "./Logo.jsx";

const C = {
  fondo: "#ffffff",
  fondoHeader: "#f5f5f5",
  acento: "#00c48c",
  texto: "#0d1f1a",
  muted: "#555555",
  border: "#cccccc",
  borderFuerte: "#0d0d0d",
  lineaEscritura: "#bbbbbb",
  fondoApp: "#f8f8f4",
  btnBorder: "#d8ede8",
};

// ── Helpers ──

// Detecta ejercicios que ya tienen su espacio de respuesta embebido
// (tabla HTML o espacios en blanco con guiones/span)
function tieneRespuestaEmbebida(texto) {
  if (!texto) return false;
  return texto.includes("<table") || /_{2,}/.test(texto);
}

function stripMarkdown(str) {
  if (!str) return str;
  return str
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[•\-]\s+/gm, "")
    .replace(/^\d+[.)]\s+/gm, "")
    .trim();
}

function formatearFracciones(texto) {
  if (!texto) return texto;
  return texto.replace(/<frac>(\d+)\/(\d+)<\/frac>/g, (_, num, den) =>
    `<span style="display:inline-flex;flex-direction:column;align-items:center;font-size:0.9em;line-height:1.1;vertical-align:middle;margin:0 4px;"><span style="border-bottom:1.5px solid currentColor;padding:0 4px;">${num}</span><span style="padding:0 4px;">${den}</span></span>`
  );
}

function renderHTMLConNegrita(str) {
  if (!str) return { __html: "" };
  const html = formatearFracciones(str)
    .replace(/_{1,}/g, '<span style="font-family:Arial;letter-spacing:1px;">_______</span>')
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[•\-]\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return { __html: html };
}

function htmlATextoPlano(html) {
  if (!html) return '';
  return html
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<table[\s\S]*?<\/table>/gi, '[tabla]')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function initFieldData(ficha) {
  const planos = {};

  // Campos simples (texto plano)
  for (const k of ['titulo', 'explicacion', 'concepto_clave', 'texto', 'consigna', 'ejemplo', 'reflexion', 'pregunta_reflexion']) {
    if (ficha[k]) planos[k] = ficha[k];
  }

  // PDL Lectura: preguntas
  (ficha.preguntas || []).forEach((v, i) => { planos[`pregunta_${i}`] = v || ''; });

  // Ejercicios tipados (nuevo formato) o strings (PDL Ortografía viejo)
  (ficha.ejercicios || []).forEach((ejercicio, i) => {
    if (typeof ejercicio === 'string') {
      planos[`ejercicio_${i}`] = htmlATextoPlano(ejercicio);
    } else {
      planos[`ejercicio_${i}_enunciado`] = ejercicio.enunciado || '';
      (ejercicio.oraciones || []).forEach((o, j) => { planos[`ejercicio_${i}_oracion_${j}`] = o || ''; });
      (ejercicio.filas || []).forEach((f, j) => { planos[`ejercicio_${i}_fila_${j}`] = f || ''; });
      (ejercicio.afirmaciones || []).forEach((a, j) => { planos[`ejercicio_${i}_afirmacion_${j}`] = a || ''; });
    }
  });

  // Backward compat: actividad plain text
  if (ficha.actividad) {
    parsearActividad(ficha.actividad).items.forEach((item, i) => { planos[`item_${i}`] = item.texto || ''; });
  }

  return { planos, tablas: {} };
}

function renderTitulo(texto) {
  if (!texto) return null;
  const colonIdx = texto.indexOf(":");
  if (colonIdx !== -1) {
    return (
      <>
        <span style={{ color: C.texto }}>{texto.slice(0, colonIdx + 1)}</span>
        <span style={{ color: C.acento }}>{texto.slice(colonIdx + 1)}</span>
      </>
    );
  }
  const palabras = texto.split(" ");
  if (palabras.length <= 2) return <span style={{ color: C.acento }}>{texto}</span>;
  const corte = Math.max(palabras.length - 2, 1);
  return (
    <>
      <span style={{ color: C.texto }}>{palabras.slice(0, corte).join(" ")}</span>
      {" "}
      <span style={{ color: C.acento }}>{palabras.slice(corte).join(" ")}</span>
    </>
  );
}

function separarPregunta(texto) {
  if (!texto) return { pregunta: "" };
  const match = texto.match(/^(.+?\?)\s+([\s\S]+)/);
  if (match) return { pregunta: match[1].trim() };
  return { pregunta: "" };
}

function parsearActividad(texto) {
  if (!texto) return { header: "Tu turno", items: [] };
  const lineas = texto.split("\n").map(l => l.trim()).filter(Boolean);
  let header = "Tu turno";
  let inicio = 0;
  const primera = lineas[0] || "";
  if (/tu turno|ahora vos/i.test(primera)) {
    header = primera.replace(/[:\s]+$/, "");
    inicio = 1;
  }
  const items = [];
  let actual = null;
  for (const linea of lineas.slice(inicio)) {
    const num = linea.match(/^(\d+)[.)]\s*(.*)/);
    if (num) {
      if (actual) items.push({ ...actual });
      actual = { num: num[1], texto: num[2] };
    } else if (actual) {
      actual.texto += " " + linea;
    } else if (items.length > 0) {
      items.push({ num: String(items.length + 1), texto: linea });
    }
  }
  if (actual) items.push({ ...actual });
  return { header, items };
}

// ── Subcomponentes ──

function LineaEscritura() {
  return (
    <div style={{
      borderBottom: `1.5px solid ${C.lineaEscritura}`,
      height: 24, width: "100%", marginBottom: 4
    }} />
  );
}

function SeccionHeader({ numero, titulo, icono }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      marginBottom: 8, paddingBottom: 6,
      borderBottom: `2px solid ${C.borderFuerte}`
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        background: C.borderFuerte, color: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, flexShrink: 0
      }}>
        {numero}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.texto, letterSpacing: "0.01em" }}>
        {titulo}
      </span>
      <span style={{ fontSize: 12, marginLeft: "auto", opacity: 0.4 }}>{icono}</span>
    </div>
  );
}

function RecuadroRespuesta() {
  return (
    <div style={{
      height: 96,
      border: "0.5px solid #ddddd8",
      borderRadius: 6,
      background: "transparent",
      marginTop: 4,
    }} />
  );
}

function LineasRespuesta({ n = 4 }) {
  return (
    <div style={{ marginTop: 4 }}>
      {Array.from({ length: n }).map((_, i) => <LineaEscritura key={i} />)}
    </div>
  );
}

function LineaDoble() {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ borderBottom: `1px dashed ${C.lineaEscritura}`, height: 15 }} />
      <div style={{ borderBottom: `1.5px solid ${C.lineaEscritura}`, height: 15 }} />
    </div>
  );
}

// ── Componente principal ──

export default function FichaTrabajo({ ficha, registro, validacion, onNueva, onInicio }) {
  const [imprimiendo, setImprimiendo] = useState(false);
  const [fichaLocal, setFichaLocal] = useState(() => ({ ...ficha }));
  const [itemsLocal, setItemsLocal] = useState(() => parsearActividad(ficha.actividad).items);
  const [editandoCampo, setEditandoCampo] = useState(null);
  const [planosLocal, setPlanosLocal] = useState(() => initFieldData(ficha).planos);
  const [tablasLocal] = useState(() => initFieldData(ficha).tablas);
  const [posiciones, setPosiciones] = useState({});
  const [editDraft, setEditDraft] = useState(null);
  const refFicha = useRef(null);
  const sectionRefs = useRef({});
  const textareaRef = useRef(null);

  if (!ficha || !registro) return null;

  const isPDL = registro.area === "Prácticas del Lenguaje";
  const tituloTexto = fichaLocal.titulo || "";
  const emojis = Array.isArray(ficha.emojis) && ficha.emojis.length ? ficha.emojis : ["📝"];
  const emojiLeft = emojis[0];
  const emojiRight = emojis[1] || emojis[0];
  const { pregunta: pregExplicacion } = separarPregunta(stripMarkdown(fichaLocal.explicacion));
  const { header: headerActividad } = parsearActividad(ficha.actividad);
  const gradoEsUno = registro.grado === "1";
  const gradoDisplay = `${registro.grado}° grado`;

  // ── Posicionamiento de íconos ──

  useEffect(() => {
    if (!refFicha.current) return;
    const compute = () => {
      const fichaEl = refFicha.current;
      if (!fichaEl) return;
      const fichaRect = fichaEl.getBoundingClientRect();
      const nuevas = {};
      for (const [key, el] of Object.entries(sectionRefs.current)) {
        if (el) {
          const rect = el.getBoundingClientRect();
          nuevas[key] = rect.top - fichaRect.top;
        }
      }
      setPosiciones(nuevas);
    };
    const id = requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", compute); };
  }, [fichaLocal, itemsLocal, editandoCampo]);

  const setRef = (key) => (el) => { sectionRefs.current[key] = el; };

  // ── Gestión de edición ──

  const saveValue = (key, val) => {
    const simples = ["titulo", "explicacion", "concepto_clave", "texto", "consigna", "reflexion", "pregunta_reflexion", "actividad"];
    if (simples.includes(key)) { setFichaLocal(f => ({ ...f, [key]: val })); return; }
    if (key.startsWith("pregunta_")) {
      const i = +key.slice(9);
      setFichaLocal(f => { const a = [...(f.preguntas || [])]; a[i] = val; return { ...f, preguntas: a }; });
      return;
    }
    if (key.startsWith("ejercicio_")) {
      const parts = key.split("_");
      const i = +parts[1];
      const sub = parts[2];
      if (!sub) return; // key antigua sin subkey
      if (sub === "enunciado") {
        setFichaLocal(f => { const e = [...(f.ejercicios || [])]; e[i] = { ...e[i], enunciado: val }; return { ...f, ejercicios: e }; });
      } else if (sub === "oracion") {
        const j = +parts[3];
        setFichaLocal(f => { const e = [...(f.ejercicios || [])]; const o = [...(e[i].oraciones || [])]; o[j] = val; e[i] = { ...e[i], oraciones: o }; return { ...f, ejercicios: e }; });
      } else if (sub === "fila") {
        const j = +parts[3];
        setFichaLocal(f => { const e = [...(f.ejercicios || [])]; const fi = [...(e[i].filas || [])]; fi[j] = val; e[i] = { ...e[i], filas: fi }; return { ...f, ejercicios: e }; });
      } else if (sub === "afirmacion") {
        const j = +parts[3];
        setFichaLocal(f => { const e = [...(f.ejercicios || [])]; const af = [...(e[i].afirmaciones || [])]; af[j] = val; e[i] = { ...e[i], afirmaciones: af }; return { ...f, ejercicios: e }; });
      }
      return;
    }
    if (key.startsWith("item_")) {
      const i = +key.slice(5);
      setItemsLocal(prev => { const a = [...prev]; a[i] = { ...a[i], texto: val }; return a; });
    }
  };

  const isEjercicioKey = (k) => k && k.startsWith("ejercicio_") && k.split("_").length === 2;

  const saveEjercicioDraft = (key) => {
    if (!editDraft || typeof editDraft !== 'object') return;
    const idx = +key.split("_")[1];
    setFichaLocal(f => {
      const e = [...(f.ejercicios || [])];
      e[idx] = { ...editDraft };
      return { ...f, ejercicios: e };
    });
  };

  const saveCampo = (key) => {
    if (!key || !textareaRef.current) return;
    const val = textareaRef.current.value;
    saveValue(key, val);
    setPlanosLocal(prev => ({ ...prev, [key]: val }));
  };

  const startEdit = (key) => {
    if (editandoCampo) {
      if (isEjercicioKey(editandoCampo) && editDraft) saveEjercicioDraft(editandoCampo);
      else saveCampo(editandoCampo);
    }
    if (isEjercicioKey(key)) {
      const idx = +key.split("_")[1];
      const ejercicio = (fichaLocal.ejercicios || [])[idx];
      if (ejercicio && typeof ejercicio === "object") {
        setEditDraft({ ...ejercicio });
      }
    } else {
      setEditDraft(null);
    }
    setEditandoCampo(key);
  };

  const confirmEdit = () => {
    if (isEjercicioKey(editandoCampo) && editDraft) saveEjercicioDraft(editandoCampo);
    else saveCampo(editandoCampo);
    setEditandoCampo(null);
    setEditDraft(null);
  };

  // ── Textarea reutilizable ──

  const estiloTextarea = {
    width: "100%", boxSizing: "border-box",
    fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit",
    color: C.texto, border: `1.5px solid ${C.acento}`, borderRadius: 4,
    padding: "6px 8px", resize: "vertical", background: "#fff",
  };

  const renderTextarea = (minRows = 2) => {
    const textoInicial = planosLocal[editandoCampo] || '';
    const tabla = tablasLocal[editandoCampo];
    return (
      <>
        <textarea
          ref={textareaRef}
          autoFocus
          defaultValue={textoInicial}
          rows={Math.max(minRows, textoInicial.split('\n').length + 1)}
          style={estiloTextarea}
        />
        {tabla && (
          <div
            dangerouslySetInnerHTML={{ __html: tabla }}
            style={{ marginTop: 8, opacity: 0.55, pointerEvents: "none", fontSize: "inherit" }}
          />
        )}
      </>
    );
  };

  // ── Render de ejercicio tipado ──

  const renderEjercicioItem = (ejercicio, idx) => {
    const keyEjercicio = `ejercicio_${idx}`;
    const editando = editandoCampo === keyEjercicio && editDraft;
    const numLabel = (
      <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
    );

    // ── Modo edición: editor multi-campo controlado ──
    if (editando) {
      return (
        <div key={idx} ref={setRef(keyEjercicio)}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            {numLabel}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <textarea
                autoFocus
                style={estiloTextarea}
                value={editDraft.enunciado || ''}
                onChange={e => setEditDraft(d => ({ ...d, enunciado: e.target.value }))}
                rows={2}
              />
              {editDraft.tipo === "completar_oraciones" && (editDraft.oraciones || []).map((o, j) => (
                <textarea
                  key={j}
                  style={estiloTextarea}
                  value={o}
                  onChange={e => setEditDraft(d => {
                    const oraciones = [...(d.oraciones || [])];
                    oraciones[j] = e.target.value;
                    return { ...d, oraciones };
                  })}
                  rows={1}
                />
              ))}
              {editDraft.tipo === "tabla" && (editDraft.filas || []).map((f, j) => {
                const rowStr = Array.isArray(f) ? f.join(' | ') : (f || '');
                return (
                  <textarea
                    key={j}
                    style={estiloTextarea}
                    value={rowStr}
                    onChange={e => setEditDraft(d => {
                      const filas = [...(d.filas || [])];
                      filas[j] = e.target.value.split(' | ');
                      return { ...d, filas };
                    })}
                    rows={1}
                    placeholder={`Fila ${j + 1} — columnas separadas por " | "`}
                  />
                );
              })}
              {editDraft.tipo === "verdadero_falso" && (editDraft.afirmaciones || []).map((a, j) => (
                <textarea
                  key={j}
                  style={estiloTextarea}
                  value={a}
                  onChange={e => setEditDraft(d => {
                    const afirmaciones = [...(d.afirmaciones || [])];
                    afirmaciones[j] = e.target.value;
                    return { ...d, afirmaciones };
                  })}
                  rows={1}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Modo display ──
    const enunciadoEl = (
      <div style={{ flex: 1 }}>
        <div className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.55, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(ejercicio.enunciado)} />
      </div>
    );

    if (ejercicio.tipo === "completar_oraciones") {
      return (
        <div key={idx} ref={setRef(keyEjercicio)}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: 24 }}>
            {(ejercicio.oraciones || []).map((oracion, j) => (
              <div key={j} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, lineHeight: 1.6 }} dangerouslySetInnerHTML={renderHTMLConNegrita(oracion)} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (ejercicio.tipo === "tabla") {
      return (
        <div key={idx} ref={setRef(keyEjercicio)}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  {(ejercicio.columnas || []).map((col, i) => (
                    <th key={i} style={{ border: "0.5px solid #ddddd8", background: "#f5f5f0", padding: "4px 8px", fontWeight: 700, textAlign: "left" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(ejercicio.filas || []).map((fila, i) => {
                  const celdas = Array.isArray(fila) ? fila : [fila];
                  return (
                    <tr key={i}>
                      {(ejercicio.columnas || []).map((_, j) => (
                        <td key={j} style={{ border: "0.5px solid #ddddd8", padding: "4px 8px", height: 32 }}>
                          {celdas[j] || ''}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (ejercicio.tipo === "verdadero_falso") {
      return (
        <div key={idx} ref={setRef(keyEjercicio)}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: 24, display: "flex", flexDirection: "column", gap: 6 }}>
            {(ejercicio.afirmaciones || []).map((afirmacion, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, lineHeight: 1.5, flex: 1 }}>{afirmacion}</span>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {["V", "F"].map(l => (
                    <span key={l} style={{ border: `1px solid ${C.border}`, padding: "2px 7px", fontSize: 11, fontWeight: 700, borderRadius: 3 }}>{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default: texto_libre
    return (
      <div key={idx} ref={setRef(keyEjercicio)}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
          {numLabel}{enunciadoEl}
        </div>
        <RecuadroRespuesta />
      </div>
    );
  };

  // ── Acciones ──

  const handleImprimir = () => {
    setImprimiendo(true);
    setTimeout(() => { window.print(); setImprimiendo(false); }, 50);
  };

  const handleDescargarPDF = async () => {
    const element = document.getElementById("ficha-imprimible");
    const areaSlug = registro.area.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const filename = `tiza-${areaSlug}-${registro.grado}.pdf`;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "JPEG", 10, 10, 190, 0);
    pdf.save(filename);
  };

  // ── Render ──

  return (
    <div className="contenedor-pagina" style={{ fontFamily: "system-ui, sans-serif", background: C.fondoApp, minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: `0.5px solid ${C.btnBorder}`,
        background: "rgba(248,248,244,0.95)", backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 10
      }} id="nav-ficha">
        <button onClick={onInicio} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Logo size={22} />
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleImprimir}
            disabled={imprimiendo}
            style={{
              fontSize: 13, fontWeight: 600, padding: "8px 18px",
              borderRadius: 7, border: `2px solid ${C.borderFuerte}`,
              background: C.borderFuerte, color: C.acento, cursor: "pointer"
            }}>
            🖨 Imprimir ficha
          </button>
          <button
            onClick={handleDescargarPDF}
            style={{
              fontSize: 13, fontWeight: 600, padding: "8px 18px",
              borderRadius: 7, border: `2px solid ${C.acento}`,
              background: C.acento, color: "#ffffff", cursor: "pointer"
            }}>
            ⬇ Descargar PDF
          </button>
          <button
            onClick={onNueva}
            style={{
              fontSize: 13, fontWeight: 500, padding: "8px 18px",
              borderRadius: 7, border: `1.5px solid ${C.btnBorder}`,
              background: "transparent", color: "#0d1f1a", cursor: "pointer"
            }}>
            ✦ Crear otra
          </button>
        </div>
      </nav>

      {/* Contenedor */}
      <div className="contenedor-wrapper" style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* Badge de validación pedagógica */}
        {validacion?.observaciones?.length > 0 && (
          <div className="validacion-badge" style={{
            background: "#fffbeb", border: "1px solid #f59e0b",
            borderRadius: 8, padding: "12px 16px", marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>
              ⚠ Revisá esta ficha antes de usar
            </p>
            <ul style={{ paddingLeft: 18, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              {validacion.observaciones.map((obs, i) => (
                <li key={i} style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
                  <strong>{obs.criterio}:</strong> {obs.descripcion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Banner mock */}
        {ficha._mock && (
          <div className="mock-banner" style={{
            background: "#fffbeb", border: "1px solid #f6ad55",
            borderRadius: 8, padding: "8px 14px", marginBottom: 16,
            fontSize: 12, color: "#92400e"
          }}>
            ⚠️ Modo de prueba — ficha de ejemplo. Configurá ANTHROPIC_API_KEY para generar fichas reales.
          </div>
        )}

        {/* Botones — se ocultan mientras hay edición activa */}
        {!editandoCampo && (
          <div className="btn-imprimir" style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 16 }}>
            <button
              onClick={handleImprimir}
              disabled={imprimiendo}
              style={{
                fontSize: 12, fontWeight: 600, padding: "8px 20px",
                borderRadius: 7, border: `2px solid ${C.borderFuerte}`,
                background: C.borderFuerte, color: C.acento, cursor: "pointer"
              }}>
              🖨 Imprimir ficha
            </button>
            <button
              onClick={handleDescargarPDF}
              style={{
                fontSize: 12, fontWeight: 600, padding: "8px 20px",
                borderRadius: 7, border: `2px solid ${C.acento}`,
                background: C.acento, color: "#ffffff", cursor: "pointer"
              }}>
              ⬇ Descargar PDF
            </button>
          </div>
        )}

        {/* ── FICHA + BARRA LATERAL ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>

          {/* Ficha imprimible */}
          <div ref={refFicha} id="ficha-imprimible" className="ficha" style={{
            flex: 1,
            background: C.fondo,
            border: `2.5px solid ${C.borderFuerte}`,
            borderRadius: 10,
            minHeight: "297mm",
            fontFamily: "'Lexend Deca', sans-serif",
          }}>

            {/* Encabezado */}
            <div style={{
              background: C.fondoHeader,
              borderBottom: `2.5px solid ${C.borderFuerte}`,
              borderRadius: "8px 8px 0 0",
              padding: "10px 16px"
            }}>
              {/* Tags */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {[gradoDisplay, registro.area, registro.bloque].map(tag => (
                  <span key={tag} style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 8px",
                    borderRadius: 4, border: `1.5px solid ${C.borderFuerte}`,
                    color: C.texto, background: "white",
                    letterSpacing: "0.05em", textTransform: "uppercase"
                  }}>{tag}</span>
                ))}
              </div>

              {/* Título editable */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojiLeft}</span>
                <div ref={setRef("titulo")} style={{ flex: 1 }}>
                  {editandoCampo === "titulo"
                    ? renderTextarea(1)
                    : (
                      <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0, lineHeight: 1.25, letterSpacing: "-0.01em", textAlign: "center" }}>
                        {renderTitulo(tituloTexto)}
                      </h2>
                    )
                  }
                </div>
                <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojiRight}</span>
              </div>

              {/* Datos alumno */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
                {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
                  <div key={label}>
                    <p className="dato-label" style={{
                      fontSize: 9, color: C.muted, fontWeight: 700,
                      marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em"
                    }}>
                      {label}
                    </p>
                    <div style={{ borderBottom: `2px solid ${C.borderFuerte}`, height: 20 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Cuerpo */}
            <div className="cuerpo-ficha" style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

              {isPDL ? (

                /* ── PDL: Lectura ── */
                registro.bloque === "Lectura de textos" ? (
                  <>
                    <div className="seccion">
                      <SeccionHeader numero="1" titulo="Leemos" icono="📖" />
                      <div ref={setRef("texto")}>
                        {editandoCampo === "texto"
                          ? renderTextarea(6)
                          : <div className="explicacion" style={{ fontSize: 11, color: C.texto, lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.texto)} />
                        }
                      </div>
                    </div>
                    <div className="seccion">
                      <SeccionHeader numero="2" titulo="Respondé" icono="✍️" />
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {Array.isArray(fichaLocal.preguntas) && fichaLocal.preguntas.map((preg, idx) => (
                          <div key={idx}>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                              <div ref={setRef(`pregunta_${idx}`)} style={{ flex: 1 }}>
                                {editandoCampo === `pregunta_${idx}`
                                  ? renderTextarea(2)
                                  : <div className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.55, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(preg)} />
                                }
                              </div>
                            </div>
                            <LineasRespuesta n={4} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>

                /* ── PDL: Escritura ── */
                ) : registro.bloque === "Escritura de textos" ? (
                  <>
                    <div className="seccion">
                      <SeccionHeader numero="1" titulo="¡A escribir!" icono="✏️" />
                      <div ref={setRef("consigna")}>
                        {editandoCampo === "consigna"
                          ? renderTextarea(3)
                          : <div className="explicacion" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.consigna)} />
                        }
                      </div>
                    </div>
                    {Array.isArray(fichaLocal.orientaciones) && fichaLocal.orientaciones.length > 0 && (
                      <div className="seccion">
                        <SeccionHeader numero="2" titulo="Antes de escribir, pensá…" icono="💭" />
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {fichaLocal.orientaciones.map((orientacion, idx) => (
                            <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <span style={{ fontSize: 12, color: C.muted, flexShrink: 0, marginTop: 1 }}>→</span>
                              <div className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(orientacion)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="seccion">
                      <SeccionHeader numero="3" titulo="Mi texto" icono="📝" />
                      {gradoEsUno
                        ? Array.from({ length: 8 }).map((_, i) => <LineaDoble key={i} />)
                        : Array.from({ length: 8 }).map((_, i) => <LineaEscritura key={i} />)
                      }
                    </div>
                  </>

                /* ── PDL: Ortografía ── */
                ) : (
                  <>
                    <div className="seccion">
                      <SeccionHeader numero="1" titulo="La regla" icono="📚" />
                      {fichaLocal.concepto_clave && (
                        <div style={{ background: "#eafaf4", borderLeft: "3px solid #00c48c", borderRadius: "0 6px 6px 0", padding: "8px 12px", marginBottom: 8 }}>
                          <div ref={setRef("concepto_clave")}>
                            {editandoCampo === "concepto_clave"
                              ? renderTextarea(2)
                              : <div className="concepto-clave-texto" style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, margin: 0, fontWeight: 500 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.concepto_clave)} />
                            }
                          </div>
                        </div>
                      )}
                      <div ref={setRef("explicacion")}>
                        {editandoCampo === "explicacion"
                          ? renderTextarea(3)
                          : <div className="explicacion" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: "0 0 6px" }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.explicacion)} />
                        }
                      </div>
                      {fichaLocal.ejemplo && (
                        <div style={{ background: "#f7f7f0", borderRadius: 6, padding: "8px 12px", border: `1px solid ${C.border}` }}>
                          <p style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Ejemplo</p>
                          <div className="explicacion" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.ejemplo)} />
                        </div>
                      )}
                    </div>
                    <div className="seccion">
                      <SeccionHeader numero="2" titulo="Practicamos" icono="✏️" />
                      {Array.isArray(fichaLocal.ejercicios) && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {fichaLocal.ejercicios.map((ejercicio, idx) =>
                            typeof ejercicio === "string"
                              ? (
                                <div key={idx}>
                                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                                    <div ref={setRef(`ejercicio_${idx}`)} style={{ flex: 1 }}>
                                      {editandoCampo === `ejercicio_${idx}`
                                        ? renderTextarea(2)
                                        : <div className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(ejercicio)} />
                                      }
                                    </div>
                                  </div>
                                  {!tieneRespuestaEmbebida(ejercicio) && <RecuadroRespuesta />}
                                </div>
                              )
                              : renderEjercicioItem(ejercicio, idx)
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )

              ) : (

                /* ── No PDL: Matemática, Ciencias, etc. ── */
                <>
                  <div className="seccion">
                    <SeccionHeader numero="1" titulo={pregExplicacion || "Leemos juntos"} icono="📖" />
                    {fichaLocal.concepto_clave && (
                      <div style={{ background: "#eafaf4", borderLeft: "3px solid #00c48c", borderRadius: "0 6px 6px 0", padding: "8px 12px", marginBottom: 8 }}>
                        <div ref={setRef("concepto_clave")}>
                          {editandoCampo === "concepto_clave"
                            ? renderTextarea(2)
                            : <div className="concepto-clave-texto" style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, margin: 0, fontWeight: 500 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.concepto_clave)} />
                          }
                        </div>
                      </div>
                    )}
                    <div ref={setRef("explicacion")}>
                      {editandoCampo === "explicacion"
                        ? renderTextarea(3)
                        : <div className="explicacion" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.explicacion)} />
                      }
                    </div>
                  </div>

                  <div className="seccion">
                    <SeccionHeader numero="2" titulo="Tu turno" icono="✏️" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {Array.isArray(fichaLocal.ejercicios) && fichaLocal.ejercicios.length > 0
                        ? fichaLocal.ejercicios.map((ejercicio, idx) => renderEjercicioItem(ejercicio, idx))
                        : itemsLocal.map(({ num, texto }, idx) => (
                          <div key={num}>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{num}.</span>
                              <div ref={setRef(`item_${idx}`)} style={{ flex: 1 }}>
                                {editandoCampo === `item_${idx}`
                                  ? renderTextarea(2)
                                  : <div className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.55, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(texto)} />
                                }
                              </div>
                            </div>
                            {!tieneRespuestaEmbebida(texto) && <RecuadroRespuesta />}
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {(fichaLocal.reflexion || fichaLocal.pregunta_reflexion) && (
                    <div className="seccion">
                      <SeccionHeader numero="3" titulo="Reflexionamos" icono="💭" />
                      <div ref={setRef("reflexion")}>
                        {editandoCampo === "reflexion"
                          ? renderTextarea(2)
                          : <div className="reflexion-texto" style={{ fontSize: 12, color: C.texto, fontStyle: "italic", lineHeight: 1.55, marginBottom: 6 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.reflexion || fichaLocal.pregunta_reflexion)} />
                        }
                      </div>
                      <LineasRespuesta n={2} />
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Footer */}
            <div style={{
              borderTop: `2px solid ${C.borderFuerte}`,
              borderRadius: "0 0 8px 8px",
              padding: "6px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: C.fondoHeader
            }}>
              <span style={{ fontSize: 10, color: C.muted }}>tiza. · Diseño Curricular 2018</span>
              <span style={{ fontSize: 10, color: C.muted }}>{gradoDisplay} · {registro.area}</span>
            </div>

          </div>

          {/* ── Barra lateral de edición ── */}
          <div className="sidebar-edicion" style={{
            width: 48, flexShrink: 0, position: "relative", alignSelf: "stretch",
          }}>
            {Object.entries(posiciones).map(([key, top]) => (
              editandoCampo === key ? (
                <button
                  key={key}
                  onClick={confirmEdit}
                  style={{
                    position: "absolute",
                    top: Math.max(0, top),
                    left: 8,
                    width: 36,
                    background: C.acento,
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "5px 0",
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    lineHeight: 1.3,
                    textAlign: "center",
                  }}
                >
                  Listo
                </button>
              ) : (
                <button
                  key={key}
                  onClick={() => startEdit(key)}
                  style={{
                    position: "absolute",
                    top: Math.max(0, top),
                    left: 8,
                    width: 36,
                    background: "#fff",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 6,
                    padding: "4px 0",
                    fontSize: 14,
                    cursor: "pointer",
                    lineHeight: 1,
                    textAlign: "center",
                    color: C.muted,
                  }}
                >
                  ✏️
                </button>
              )
            ))}
          </div>

        </div>
      </div>

      {/* CSS */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 10mm; }

          html, body { margin: 0; padding: 0; width: 190mm; }

          #nav-ficha,
          .btn-imprimir,
          .sidebar-edicion,
          .validacion-badge,
          .mock-banner { display: none !important; }

          .contenedor-pagina {
            background: white !important;
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .contenedor-wrapper {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .ficha {
            width: 190mm !important;
            max-width: 190mm !important;
            min-height: 277mm !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: visible !important;
            font-family: 'Lexend Deca', sans-serif !important;
          }

          .cuerpo-ficha { flex: 1 !important; }

          .explicacion,
          .ejercicio-enunciado,
          .reflexion-texto,
          .concepto-clave-texto,
          .dato-label { font-size: 13px !important; }

          .seccion:last-of-type { flex: 1; }
        }
      `}</style>
    </div>
  );
}
