import { useMemo, useRef, useEffect } from "react";

export function EditableHtml({ html, className, style }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.innerHTML = html || ""; }, []);
  return <div ref={ref} contentEditable suppressContentEditableWarning className={className} style={style} />;
}

// ── Paleta de colores compartida ──
export const C = {
  fondo: "#ffffff",
  fondoHeader: "#f5f5f0",
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

export function stripMarkdown(str) {
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

export function formatearFracciones(texto) {
  if (!texto) return texto;
  return texto.replace(/<frac>(\d+)\/(\d+)<\/frac>/g, (_, num, den) =>
    `<span style="display:inline-flex;flex-direction:column;align-items:center;font-size:0.9em;line-height:1.1;vertical-align:middle;margin:0 4px;"><span style="border-bottom:1.5px solid currentColor;padding:0 4px;">${num}</span><span style="padding:0 4px;">${den}</span></span>`
  );
}

export function renderHTMLConNegrita(str) {
  if (!str) return { __html: "" };
  const html = formatearFracciones(str)
    .replace(/_{1,}/g, '<span style="font-family:Arial;letter-spacing:1px;">_______</span>')
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[•\-]\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return { __html: html };
}

export function renderTitulo(texto) {
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

// ── Subcomponentes ──

export function LineaEscritura() {
  return (
    <div style={{
      borderBottom: `1.5px solid ${C.lineaEscritura}`,
      height: 24, width: "100%", marginBottom: 4
    }} />
  );
}

export function SeccionHeader({ numero, titulo, icono }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      marginBottom: 8, padding: "5px 8px",
      background: "#eafaf4", borderRadius: 6,
      borderBottom: `2px solid ${C.borderFuerte}`
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        background: C.acento, color: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, flexShrink: 0
      }}>
        {numero}
      </div>
      <span
        contentEditable suppressContentEditableWarning
        className="ficha-campo-editable"
        style={{ fontSize: 13, fontWeight: 700, color: C.texto, letterSpacing: "0.01em" }}
      >
        {titulo}
      </span>
      <span style={{ fontSize: 13, marginLeft: "auto", opacity: 0.4 }}>{icono}</span>
    </div>
  );
}

export function RecuadroRespuesta() {
  return (
    <div style={{
      height: 96,
      minHeight: 40,
      border: "0.5px solid #ddddd8",
      borderRadius: 6,
      background: "repeating-linear-gradient(to bottom, transparent, transparent 27px, #d8d8d0 27px, #d8d8d0 28px)",
      marginTop: 4,
      resize: "vertical",
      overflow: "hidden",
      cursor: "ns-resize",
    }} />
  );
}

export function LineasRespuesta({ n = 4 }) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="ficha-campo-editable"
      style={{
        marginTop: 4,
        minHeight: n * 28,
        resize: "vertical",
        overflow: "hidden",
        borderBottom: "0.5px solid #ddddd8",
        padding: "4px 2px",
        lineHeight: "28px",
      }}
    />
  );
}

export function LineaDoble() {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ borderBottom: `1px dashed ${C.lineaEscritura}`, height: 15 }} />
      <div style={{ borderBottom: `1.5px solid ${C.lineaEscritura}`, height: 15 }} />
    </div>
  );
}

// ── Andamiaje ──

function getAndamiajeStyle() {
  const r = Math.random();
  if (r < 0.25) {
    return {
      containerStyle: {
        background: "#fffde7",
        borderTop: "20px solid #00c48c",
        borderRadius: 4,
        transform: "rotate(1.5deg)",
        position: "relative",
        padding: "6px 8px",
      },
      labelStyle: {
        position: "absolute",
        top: -15,
        left: 6,
        fontSize: 7,
        fontWeight: 700,
        color: "#ffffff",
        lineHeight: 1,
      },
      isPostit: true,
    };
  } else if (r < 0.40) {
    return {
      containerStyle: {
        border: "1.5px solid #00c48c",
        borderRadius: 10,
        padding: "6px 8px",
        position: "relative",
      },
      labelStyle: { fontSize: 7, fontWeight: 700, color: "#00c48c", display: "block", marginBottom: 2 },
      isPostit: false,
    };
  } else if (r < 0.70) {
    return {
      containerStyle: {
        border: "1.5px solid #00c48c",
        boxShadow: "2px 2px 0 #004733",
        borderRadius: 4,
        padding: "6px 8px",
      },
      labelStyle: { fontSize: 7, fontWeight: 700, color: "#00c48c", display: "block", marginBottom: 2 },
      isPostit: false,
    };
  } else if (r < 0.85) {
    return {
      containerStyle: {
        borderLeft: "3px solid #00c48c",
        background: "#f2f2f0",
        borderRadius: 0,
        padding: "6px 8px",
      },
      labelStyle: { fontSize: 7, fontWeight: 700, color: "#00c48c", display: "block", marginBottom: 2 },
      isPostit: false,
    };
  } else {
    return {
      containerStyle: {
        border: "3px double #00c48c",
        borderRadius: 4,
        padding: "6px 8px",
      },
      labelStyle: { fontSize: 7, fontWeight: 700, color: "#00c48c", display: "block", marginBottom: 2 },
      isPostit: false,
    };
  }
}

export function Andamiaje({ text }) {
  const { containerStyle, labelStyle } = useMemo(getAndamiajeStyle, []);
  return (
    <div style={{
      width: 170,
      flexShrink: 0,
      alignSelf: "flex-start",
      fontFamily: "'Lexend Deca', sans-serif",
      ...containerStyle,
    }}>
      <span style={{ ...labelStyle, fontSize: 11, fontFamily: "'Lexend Deca', sans-serif" }}>Recordá</span>
      <span
        contentEditable suppressContentEditableWarning
        className="ficha-campo-editable"
        style={{ fontSize: 13, lineHeight: 1.5, fontFamily: "'Lexend Deca', sans-serif", display: "block" }}
      >{text}</span>
    </div>
  );
}

// ── renderEjercicioItem — solo modo display ──

export function renderEjercicioItem(ejercicio, idx, { hideNum = false, editable = false } = {}) {
  if (!ejercicio) return null;

  const hasContent = (() => {
    if (ejercicio.tipo === "completar_oraciones") return Array.isArray(ejercicio.oraciones) && ejercicio.oraciones.length > 0;
    if (ejercicio.tipo === "tabla") return Array.isArray(ejercicio.filas) && ejercicio.filas.length > 0;
    if (ejercicio.tipo === "verdadero_falso") return Array.isArray(ejercicio.afirmaciones) && ejercicio.afirmaciones.length > 0;
    if (ejercicio.tipo === "preguntas_comprension") return Array.isArray(ejercicio.preguntas) && ejercicio.preguntas.length > 0;
    return !!ejercicio.enunciado;
  })();

  if (!hasContent) return null;

  const numLabel = hideNum ? null : (
    <span style={{ fontSize: 13, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
  );

  const enunciadoEl = (
    <div style={{ flex: 1 }}>
      {editable
        ? <EditableHtml
            html={renderHTMLConNegrita(ejercicio.enunciado).__html}
            className="ficha-campo-editable"
            style={{ fontSize: 13, color: C.texto, lineHeight: 1.55 }}
          />
        : <div style={{ fontSize: 13, color: C.texto, lineHeight: 1.55, margin: 0 }}
            dangerouslySetInnerHTML={renderHTMLConNegrita(ejercicio.enunciado)} />
      }
    </div>
  );

  const andamiajeEl = ejercicio.andamiaje ? <Andamiaje text={ejercicio.andamiaje} /> : null;

  if (ejercicio.tipo === "completar_oraciones") {
    return (
      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: hideNum ? 0 : 24 }}>
            {(ejercicio.oraciones || []).map((oracion, j) => (
              <div key={j} style={{ marginBottom: 8 }}>
                {editable
                  ? <EditableHtml html={renderHTMLConNegrita(oracion).__html} className="ficha-campo-editable" style={{ fontSize: 13, lineHeight: 1.6 }} />
                  : <div style={{ fontSize: 13, lineHeight: 1.6 }} dangerouslySetInnerHTML={renderHTMLConNegrita(oracion)} />
                }
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
      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: hideNum ? 0 : 24 }}>
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
                        <td key={j} style={{ border: "0.5px solid #ddddd8", padding: "4px 8px", minHeight: 32 }}>
                          {editable
                            ? <EditableHtml html={renderHTMLConNegrita(celdas[j] || "").__html} className="ficha-campo-editable" style={{ fontSize: 11, minHeight: 24 }} />
                            : <span dangerouslySetInnerHTML={renderHTMLConNegrita(celdas[j] || "")} />
                          }
                        </td>
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
      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: hideNum ? 0 : 24, display: "flex", flexDirection: "column", gap: 6 }}>
            {(ejercicio.afirmaciones || []).map((afirmacion, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {editable
                  ? <EditableHtml html={renderHTMLConNegrita(afirmacion).__html} className="ficha-campo-editable" style={{ fontSize: 13, lineHeight: 1.5, flex: 1 }} />
                  : <span style={{ fontSize: 13, lineHeight: 1.5, flex: 1 }} dangerouslySetInnerHTML={renderHTMLConNegrita(afirmacion)} />
                }
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
      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            {numLabel}{enunciadoEl}
          </div>
          <div style={{ marginLeft: hideNum ? 0 : 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {(ejercicio.preguntas || []).map((pregunta, j) => (
              <div key={j}>
                {editable
                  ? <EditableHtml html={renderHTMLConNegrita(`${j + 1}. ${pregunta}`).__html} className="ficha-campo-editable" style={{ fontSize: 13, color: C.texto, lineHeight: 1.55, marginBottom: 4 }} />
                  : <div style={{ fontSize: 13, color: C.texto, lineHeight: 1.55, marginBottom: 4 }} dangerouslySetInnerHTML={renderHTMLConNegrita(`${j + 1}. ${pregunta}`)} />
                }
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
      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
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

  // Default: enunciado + recuadro (situacion_problematica) o renglones
  return (
    <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
          {numLabel}{enunciadoEl}
        </div>
        {ejercicio.tipo === "situacion_problematica"
          ? <RecuadroRespuesta />
          : <LineasRespuesta n={4} />}
      </div>
      {andamiajeEl}
    </div>
  );
}
