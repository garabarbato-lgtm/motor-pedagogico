import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "./Logo.jsx";

// ── Colores (copiado de FichaTrabajo) ──
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

// ── Helpers (copiados de FichaTrabajo) ──

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

// ── Subcomponentes (copiados de FichaTrabajo) ──

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

// ── Field data para edición ──

function initFieldDataPresenta(ficha) {
  const planos = {};
  planos.titulo = ficha.titulo || "";
  const parrafos = ficha.explicacion?.parrafos || [];
  parrafos.forEach((p, i) => { planos[`parrafo_${i}`] = p || ""; });
  if (ficha.explicacion?.pill?.contenido) {
    planos.pill_contenido = ficha.explicacion.pill.contenido;
  }
  (ficha.ejercicios || []).forEach((e, i) => {
    if (!e) return;
    planos[`ejercicio_${i}_enunciado`] = e.enunciado || "";
  });
  return planos;
}

// ── renderEjercicioItem — solo modo display (copiado de FichaTrabajo, sin edición) ──
// Retorna el contenido completo de la fila incluyendo andamiaje como columna derecha.

function renderEjercicioItem(ejercicio, idx) {
  if (!ejercicio) return null;

  const hasContent = (() => {
    if (typeof ejercicio === "string") return ejercicio.trim().length > 0;
    if (ejercicio.tipo === "completar_oraciones") return Array.isArray(ejercicio.oraciones) && ejercicio.oraciones.length > 0;
    if (ejercicio.tipo === "tabla") return Array.isArray(ejercicio.filas) && ejercicio.filas.length > 0;
    if (ejercicio.tipo === "verdadero_falso") return Array.isArray(ejercicio.afirmaciones) && ejercicio.afirmaciones.length > 0;
    if (ejercicio.tipo === "preguntas_comprension") {
      if (!Array.isArray(ejercicio.preguntas) || ejercicio.preguntas.length === 0) {
        console.log("[preguntas_comprension] Sin array preguntas:", JSON.stringify(ejercicio, null, 2));
        return false;
      }
      return true;
    }
    return !!ejercicio.enunciado;
  })();

  if (!hasContent) return null;

  const numLabel = (
    <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
  );
  const enunciadoEl = (
    <div style={{ flex: 1 }}>
      <div className="ejercicio-enunciado" style={{ fontSize: 13, color: C.texto, lineHeight: 1.55, margin: 0 }}
        dangerouslySetInnerHTML={renderHTMLConNegrita(ejercicio.enunciado)} />
    </div>
  );

  // Andamiaje — siempre post-it en esta versión (v1)
  const andamiajeEl = ejercicio.andamiaje ? (
    <div
      className="andamiaje-postit"
      style={{
        background: "#fffde7",
        borderTop: `20px solid ${C.acento}`,
        borderRadius: 4,
        padding: "6px 8px",
        fontSize: 8,
        lineHeight: 1.6,
        color: C.texto,
        position: "relative",
        alignSelf: "flex-start",
        width: 108,
        flexShrink: 0,
        transform: "rotate(1.5deg)",
      }}
    >
      <span style={{
        position: "absolute", top: -15, left: 6,
        fontSize: 7, fontWeight: 700, color: "#fff", letterSpacing: "0.3px",
      }}>
        Recordá
      </span>
      <div dangerouslySetInnerHTML={renderHTMLConNegrita(ejercicio.andamiaje)} />
    </div>
  ) : null;

  if (ejercicio.tipo === "completar_oraciones") {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: 24 }}>
            {(ejercicio.oraciones || []).map((oracion, j) => (
              <div key={j} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 13, lineHeight: 1.6 }} dangerouslySetInnerHTML={renderHTMLConNegrita(oracion)} />
              </div>
            ))}
          </div>
        </div>
        {andamiajeEl}
      </div>
    );
  }

  if (ejercicio.tipo === "tabla") {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
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
                        <td key={j} style={{ border: "0.5px solid #ddddd8", padding: "4px 8px", height: 32 }}
                          dangerouslySetInnerHTML={renderHTMLConNegrita(celdas[j] || "")}
                        />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {andamiajeEl}
      </div>
    );
  }

  if (ejercicio.tipo === "verdadero_falso") {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: 24, display: "flex", flexDirection: "column", gap: 6 }}>
            {(ejercicio.afirmaciones || []).map((afirmacion, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, lineHeight: 1.5, flex: 1 }} dangerouslySetInnerHTML={renderHTMLConNegrita(afirmacion)} />
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {["V", "F"].map(l => (
                    <span key={l} style={{ border: `1px solid ${C.border}`, padding: "2px 7px", fontSize: 11, fontWeight: 700, borderRadius: 3 }}>{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {andamiajeEl}
      </div>
    );
  }

  if (ejercicio.tipo === "preguntas_comprension") {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {(ejercicio.preguntas || []).map((pregunta, j) => (
              <div key={j}>
                <div style={{ fontSize: 13, color: C.texto, lineHeight: 1.55, marginBottom: 4 }}
                  dangerouslySetInnerHTML={renderHTMLConNegrita(`${j + 1}. ${pregunta}`)} />
                <LineasRespuesta n={3} />
              </div>
            ))}
          </div>
        </div>
        {andamiajeEl}
      </div>
    );
  }

  if (ejercicio.tipo === "resolver_operaciones" || ejercicio.tipo === "completar_la_cuenta") {
    const lineas = (ejercicio.enunciado || "").split(/\n|\\n/).map(l => l.trim()).filter(Boolean);
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: lineas.length > 1 ? 4 : 0 }}>
            {numLabel}
            <div style={{ flex: 1 }}>
              {lineas.length > 1
                ? lineas.map((linea, j) => (
                    <div key={j} style={{ fontSize: 13, color: C.texto, lineHeight: 1.6, marginBottom: 12 }}
                      dangerouslySetInnerHTML={renderHTMLConNegrita(linea)} />
                  ))
                : <div style={{ fontSize: 13, color: C.texto, lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={renderHTMLConNegrita(ejercicio.enunciado)} />
              }
            </div>
          </div>
        </div>
        {andamiajeEl}
      </div>
    );
  }

  // Tipos desconocidos + situacion_problematica + default → enunciado + renglones
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
          {numLabel}{enunciadoEl}
        </div>
        <LineasRespuesta n={4} />
      </div>
      {andamiajeEl}
    </div>
  );
}

// ── Componente principal ──

export default function FichaPresenta({ ficha, registro, validacion, onNueva, onInicio }) {
  if (!ficha || !registro) return null;

  const [imprimiendo, setImprimiendo] = useState(false);
  const [fichaLocal, setFichaLocal] = useState(() => ({ ...ficha }));
  const [editandoCampo, setEditandoCampo] = useState(null);
  const [planosLocal, setPlanosLocal] = useState(() => initFieldDataPresenta(ficha));
  const [posiciones, setPosiciones] = useState({});
  const [ejercicio1Oculto, setEjercicio1Oculto] = useState(false);
  const refFicha = useRef(null);
  const sectionRefs = useRef({});
  const textareaRef = useRef(null);

  const tituloTexto = (() => {
    const limpio = (fichaLocal.titulo || "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .trim();
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  })();
  const emojis = Array.isArray(fichaLocal.emojis) && fichaLocal.emojis.length ? fichaLocal.emojis : ["📝"];
  const emojiLeft = emojis[0];
  const emojiRight = emojis[1] || emojis[0];
  const gradoDisplay = `${registro.grado}° grado`;

  const parrafos = fichaLocal.explicacion?.parrafos || [];
  const pill = fichaLocal.explicacion?.pill || null;
  const tieneAndamiaje = (fichaLocal.ejercicios || []).some(e => e && e.andamiaje);
  const mostrarPill = !!(pill?.contenido && !tieneAndamiaje);

  // ── Posicionamiento de botones de edición ──
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
  }, [fichaLocal, editandoCampo]);

  // ── Overflow: ocultar segundo ejercicio si desborda ──
  useEffect(() => {
    const el = refFicha.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight) return;
    const ejercicios = fichaLocal.ejercicios || [];
    if (ejercicios[1] != null && !ejercicio1Oculto) {
      setEjercicio1Oculto(true);
    }
  }, [fichaLocal, ejercicio1Oculto]);

  const setRef = (key) => (el) => { sectionRefs.current[key] = el; };

  // ── Edición ──

  const saveValue = (key, val) => {
    if (key === "titulo") {
      setFichaLocal(f => ({ ...f, titulo: val }));
      return;
    }
    if (key.startsWith("parrafo_")) {
      const i = +key.slice(8);
      setFichaLocal(f => {
        const ps = [...(f.explicacion?.parrafos || [])];
        ps[i] = val;
        return { ...f, explicacion: { ...f.explicacion, parrafos: ps } };
      });
      return;
    }
    if (key === "pill_contenido") {
      setFichaLocal(f => ({
        ...f,
        explicacion: { ...f.explicacion, pill: { ...f.explicacion?.pill, contenido: val } },
      }));
      return;
    }
    if (key.startsWith("ejercicio_") && key.endsWith("_enunciado")) {
      const i = +key.split("_")[1];
      setFichaLocal(f => {
        const ejercicios = [...(f.ejercicios || [])];
        if (ejercicios[i]) ejercicios[i] = { ...ejercicios[i], enunciado: val };
        return { ...f, ejercicios };
      });
    }
  };

  const saveCampo = (key) => {
    if (!key || !textareaRef.current) return;
    const val = textareaRef.current.value;
    saveValue(key, val);
    setPlanosLocal(prev => ({ ...prev, [key]: val }));
  };

  const startEdit = (key) => {
    if (editandoCampo) saveCampo(editandoCampo);
    setEditandoCampo(key);
  };

  const confirmEdit = () => {
    saveCampo(editandoCampo);
    setEditandoCampo(null);
  };

  const estiloTextarea = {
    width: "100%", boxSizing: "border-box",
    fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit",
    color: C.texto, border: `1.5px solid ${C.acento}`, borderRadius: 4,
    padding: "6px 8px", resize: "vertical", background: "#fff",
  };

  const renderTextarea = (minRows = 2) => {
    const textoInicial = planosLocal[editandoCampo] || "";
    return (
      <textarea
        ref={textareaRef}
        autoFocus
        defaultValue={textoInicial}
        rows={Math.max(minRows, textoInicial.split("\n").length + 1)}
        style={estiloTextarea}
      />
    );
  };

  // ── Acciones ──

  const handleImprimir = () => {
    setImprimiendo(true);
    setTimeout(() => { window.print(); setImprimiendo(false); }, 50);
  };

  const handleDescargarPDF = async () => {
    const element = document.getElementById("ficha-imprimible");
    if (!element) { console.error("No se encontró #ficha-imprimible"); return; }
    const areaSlug = registro.area.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const filename = `tiza-${areaSlug}-${registro.grado}.pdf`;
    const prevBorder = element.style.border;
    const prevBorderRadius = element.style.borderRadius;
    const prevBoxShadow = element.style.boxShadow;
    element.style.border = "none";
    element.style.borderRadius = "0";
    element.style.boxShadow = "none";
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    element.style.border = prevBorder;
    element.style.borderRadius = prevBorderRadius;
    element.style.boxShadow = prevBoxShadow;
    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF("p", "mm", "a4");
    // Siempre ancho completo A4, altura proporcional al canvas
    const anchoImg = 210;
    const altoImg = (canvas.height * anchoImg) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, anchoImg, altoImg);
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
        position: "sticky", top: 0, zIndex: 10,
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
              background: C.borderFuerte, color: C.acento, cursor: "pointer",
            }}>
            🖨 Imprimir ficha
          </button>
          <button
            onClick={handleDescargarPDF}
            style={{
              fontSize: 13, fontWeight: 600, padding: "8px 18px",
              borderRadius: 7, border: `2px solid ${C.acento}`,
              background: C.acento, color: "#ffffff", cursor: "pointer",
            }}>
            ⬇ Descargar PDF
          </button>
          <button
            onClick={onNueva}
            style={{
              fontSize: 13, fontWeight: 500, padding: "8px 18px",
              borderRadius: 7, border: `1.5px solid ${C.btnBorder}`,
              background: "transparent", color: "#0d1f1a", cursor: "pointer",
            }}>
            ✦ Crear otra
          </button>
        </div>
      </nav>

      {/* Wrapper */}
      <div className="contenedor-wrapper" style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* Badge validación */}
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
            fontSize: 12, color: "#92400e",
          }}>
            ⚠️ Modo de prueba — ficha de ejemplo. Configurá ANTHROPIC_API_KEY para generar fichas reales.
          </div>
        )}

        <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>

          {/* ── Ficha imprimible ── */}
          <div
            ref={refFicha}
            id="ficha-imprimible"
            className="ficha"
            style={{
              flex: 1,
              background: C.fondo,
              border: `2.5px solid ${C.borderFuerte}`,
              borderRadius: 10,
              minHeight: "277mm",
              maxHeight: "277mm",
              overflow: "hidden",
              fontFamily: "'Lexend Deca', sans-serif",
              display: "flex",
              flexDirection: "column",
            }}
          >

            {/* ── Encabezado ── */}
            <div style={{
              background: C.fondoHeader,
              borderBottom: `2.5px solid ${C.borderFuerte}`,
              borderRadius: "8px 8px 0 0",
              padding: "10px 16px",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojiLeft}</span>
                <div ref={setRef("titulo")} style={{ flex: 1, textAlign: "center" }}>
                  {editandoCampo === "titulo"
                    ? renderTextarea(1)
                    : (
                      <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1.25, letterSpacing: "-0.01em", textAlign: "center" }}>
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
                      marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>
                      {label}
                    </p>
                    <div style={{ borderBottom: `2px solid ${C.borderFuerte}`, height: 20 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Cuerpo ── */}
            <div className="cuerpo-ficha ficha-contenido" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

              {/* ── Sección 1: Leemos juntos (flex: 65) ── */}
              <div className="seccion" style={{
                flex: "0 0 65%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                padding: "12px 16px",
                borderBottom: `1.5px solid ${C.borderFuerte}`,
                overflow: "hidden",
              }}>
                <SeccionHeader numero="1" titulo="Leemos juntos" icono="📖" />

                <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "flex-start" }}>

                  {/* Columna izquierda — párrafos */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    {parrafos.map((p, i) => (
                      <div ref={setRef(`parrafo_${i}`)} key={i}>
                        {editandoCampo === `parrafo_${i}`
                          ? renderTextarea(3)
                          : (
                            <div
                              style={{ fontSize: 13, color: C.texto, lineHeight: 1.75 }}
                              dangerouslySetInnerHTML={renderHTMLConNegrita(p)}
                            />
                          )
                        }
                      </div>
                    ))}
                  </div>

                  {/* Columna derecha — pill globo (solo si no hay andamiaje) */}
                  {mostrarPill && (
                    <div
                      ref={setRef("pill_contenido")}
                      className="pill-globo"
                      style={{ width: 110, flexShrink: 0, alignSelf: "flex-start" }}
                    >
                      <div style={{
                        border: `1.5px solid ${C.acento}`,
                        borderRadius: 10,
                        padding: "7px 9px",
                        background: "#fff",
                      }}>
                        <span style={{
                          fontSize: 8, fontWeight: 700, color: C.acento,
                          display: "block", marginBottom: 3,
                        }}>
                          {pill.tipo === "pregunta_disparadora" ? "¿Y vos?" : "¿Sabías que...?"}
                        </span>
                        {editandoCampo === "pill_contenido"
                          ? renderTextarea(3)
                          : (
                            <div
                              style={{ fontSize: 9, color: C.texto, lineHeight: 1.6 }}
                              dangerouslySetInnerHTML={renderHTMLConNegrita(pill.contenido)}
                            />
                          )
                        }
                      </div>
                      {/* Cola del globo */}
                      <div style={{
                        width: 12, height: 9,
                        borderLeft: `1.5px solid ${C.acento}`,
                        borderBottom: `1.5px solid ${C.acento}`,
                        marginLeft: 16, marginTop: -1,
                        borderRadius: "0 0 0 6px",
                      }} />
                    </div>
                  )}

                </div>
              </div>

              {/* ── Sección 2: Tu turno (flex: 35) ── */}
              <div className="seccion" style={{
                flex: "0 0 35%",
                display: "flex",
                flexDirection: "column",
                padding: "12px 16px",
                overflow: "hidden",
              }}>
                <SeccionHeader numero="2" titulo="Tu turno" icono="✏️" />

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(fichaLocal.ejercicios || []).map((ejercicio, idx) => {
                    if (!ejercicio) return null;
                    if (idx === 1 && ejercicio1Oculto) return null;
                    const keyEnunciado = `ejercicio_${idx}_enunciado`;
                    return (
                      <div key={idx} ref={setRef(keyEnunciado)}>
                        {editandoCampo === keyEnunciado
                          ? (
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                              <div style={{ flex: 1 }}>{renderTextarea(2)}</div>
                            </div>
                          )
                          : renderEjercicioItem(ejercicio, idx)
                        }
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ── Footer ── */}
            <div style={{
              borderTop: `2px solid ${C.borderFuerte}`,
              borderRadius: "0 0 8px 8px",
              padding: "6px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: C.fondoHeader,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 10, color: C.muted }}>tiza. · Diseño Curricular 2018</span>
              <span style={{ fontSize: 10, color: C.muted }}>{gradoDisplay} · {registro.area} · {registro.bloque}</span>
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
                    position: "absolute", top: Math.max(0, top), left: 8,
                    width: 36, background: C.acento, color: "#fff",
                    border: "none", borderRadius: 6, padding: "5px 0",
                    fontSize: 10, fontWeight: 700, cursor: "pointer",
                    lineHeight: 1.3, textAlign: "center",
                  }}
                >
                  Listo
                </button>
              ) : (
                <button
                  key={key}
                  onClick={() => startEdit(key)}
                  style={{
                    position: "absolute", top: Math.max(0, top), left: 8,
                    width: 36, background: "#fff", border: `1.5px solid ${C.border}`,
                    borderRadius: 6, padding: "4px 0", fontSize: 14,
                    cursor: "pointer", lineHeight: 1, textAlign: "center", color: C.muted,
                  }}
                >
                  ✏️
                </button>
              )
            ))}
          </div>

        </div>
      </div>

      {/* CSS de impresión */}
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

          .pill-globo,
          .andamiaje-postit {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

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

          .ejercicio-enunciado,
          .dato-label { font-size: 13px !important; }

          .ficha-contenido { font-family: 'Lexend Deca', sans-serif !important; font-size: 13px !important; }
          .ficha-contenido div, .ficha-contenido span, .ficha-contenido p { font-family: 'Lexend Deca', sans-serif !important; }

          .seccion:last-of-type { flex: 1; }
        }
      `}</style>

    </div>
  );
}
