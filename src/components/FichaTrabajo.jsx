import { useState } from "react";
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

function renderConNegrita(str) {
  if (!str) return null;
  const limpio = str
    .replace(/_(.+?)_/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[•\-]\s+/gm, "");
  const partes = limpio.split(/\*\*(.+?)\*\*/g);
  if (partes.length === 1) return limpio;
  return partes.map((parte, i) =>
    i % 2 === 1 ? <strong key={i}>{parte}</strong> : parte
  );
}

function renderHTMLConNegrita(str) {
  if (!str) return { __html: "" };
  const html = str
    .replace(/_(.+?)_/g, "$1")
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

// ── Edición inline ──

function EditableText({ value, onSave, children, flex }) {
  const [editando, setEditando] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editando) {
    return (
      <div style={{ width: "100%", flex: flex || undefined }}>
        <textarea
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={Math.max(2, (draft || "").split("\n").length + 1)}
          style={{
            width: "100%", boxSizing: "border-box",
            fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit",
            color: C.texto, border: `1.5px solid ${C.acento}`, borderRadius: 4,
            padding: "6px 8px", resize: "vertical", background: "#fff",
          }}
        />
        <button
          onClick={() => { onSave(draft); setEditando(false); }}
          style={{
            marginTop: 6, background: C.acento, color: "#fff",
            border: "none", borderRadius: 5, padding: "5px 14px",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
          Listo
        </button>
      </div>
    );
  }

  return (
    <div className="editable-wrapper" style={{ position: "relative", flex: flex || undefined }}>
      {children}
      <button
        className="edit-icon-btn"
        onClick={() => { setDraft(value); setEditando(true); }}
        title="Editar"
        style={{
          position: "absolute", top: 0, right: 0,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 11, opacity: 0, padding: "2px 4px", lineHeight: 1,
          transition: "opacity 0.15s",
        }}>
        ✏️
      </button>
    </div>
  );
}

function ConceptoClave({ texto, onSave }) {
  if (!texto) return null;
  return (
    <div style={{
      background: "#eafaf4",
      borderLeft: "3px solid #00c48c",
      borderRadius: "0 6px 6px 0",
      padding: "8px 12px",
      marginBottom: 8,
    }}>
      <EditableText value={texto} onSave={onSave}>
        <p className="concepto-clave-texto" style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, margin: 0, fontWeight: 500 }} dangerouslySetInnerHTML={renderHTMLConNegrita(texto)} />
      </EditableText>
    </div>
  );
}

// ── Componente principal ──

export default function FichaTrabajo({ ficha, registro, validacion, onNueva, onInicio }) {
  const [imprimiendo, setImprimiendo] = useState(false);
  const [fichaLocal, setFichaLocal] = useState(() => ({ ...ficha }));
  const [itemsLocal, setItemsLocal] = useState(() => parsearActividad(ficha.actividad).items);

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

  const set = (campo) => (val) => setFichaLocal(f => ({ ...f, [campo]: val }));

  const setArrayItem = (campo, idx) => (val) =>
    setFichaLocal(f => {
      const arr = [...(f[campo] || [])];
      arr[idx] = val;
      return { ...f, [campo]: arr };
    });

  const setItem = (idx) => (val) =>
    setItemsLocal(prev => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], texto: val };
      return arr;
    });

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
      <div className="contenedor-wrapper" style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* Badge de validación pedagógica */}
        {validacion?.observaciones?.length > 0 && (
          <div className="validacion-badge" style={{
            background: "#fffbeb",
            border: "1px solid #f59e0b",
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

        {/* Botones imprimir / descargar PDF */}
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

        {/* ── FICHA IMPRIMIBLE ── */}
        <div id="ficha-imprimible" className="ficha" style={{
          background: C.fondo,
          border: `2.5px solid ${C.borderFuerte}`,
          borderRadius: 10,
          overflow: "hidden",
          fontFamily: "'Lexend Deca', sans-serif",
        }}>

          {/* Encabezado */}
          <div style={{
            background: C.fondoHeader,
            borderBottom: `2.5px solid ${C.borderFuerte}`,
            padding: "10px 16px"
          }}>
            {/* Tags (sin logo) */}
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

            {/* Título centrado con emojis simétricos — editable */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, marginBottom: 10
            }}>
              <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojiLeft}</span>
              <EditableText value={fichaLocal.titulo} onSave={set("titulo")} flex="1">
                <h2 style={{
                  fontSize: 15, fontWeight: 800,
                  margin: 0, lineHeight: 1.25, letterSpacing: "-0.01em",
                  textAlign: "center",
                }}>
                  {renderTitulo(tituloTexto)}
                </h2>
              </EditableText>
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

              /* ── PDL: Lectura de textos ── */
              registro.bloque === "Lectura de textos" ? (
                <>
                  <div className="seccion">
                    <SeccionHeader numero="1" titulo="Leemos" icono="📖" />
                    <EditableText value={fichaLocal.texto} onSave={set("texto")}>
                      <p className="explicacion" style={{ fontSize: 11, color: C.texto, lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.texto)} />
                    </EditableText>
                  </div>
                  <div className="seccion">
                    <SeccionHeader numero="2" titulo="Respondé" icono="✍️" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {Array.isArray(fichaLocal.preguntas) && fichaLocal.preguntas.map((preg, idx) => (
                        <div key={idx}>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                            <EditableText value={preg} onSave={setArrayItem("preguntas", idx)}>
                              <p className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.55, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(preg)} />
                            </EditableText>
                          </div>
                          <LineasRespuesta n={4} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>

              /* ── PDL: Escritura de textos ── */
              ) : registro.bloque === "Escritura de textos" ? (
                <>
                  <div className="seccion">
                    <SeccionHeader numero="1" titulo="¡A escribir!" icono="✏️" />
                    <EditableText value={fichaLocal.consigna} onSave={set("consigna")}>
                      <p className="explicacion" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.consigna)} />
                    </EditableText>
                  </div>
                  {Array.isArray(fichaLocal.orientaciones) && fichaLocal.orientaciones.length > 0 && (
                    <div className="seccion">
                      <SeccionHeader numero="2" titulo="Antes de escribir, pensá…" icono="💭" />
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {fichaLocal.orientaciones.map((orientacion, idx) => (
                          <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 12, color: C.muted, flexShrink: 0, marginTop: 1 }}>→</span>
                            <p className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(orientacion)} />
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
                    <ConceptoClave texto={fichaLocal.concepto_clave} onSave={set("concepto_clave")} />
                    <EditableText value={fichaLocal.explicacion} onSave={set("explicacion")}>
                      <p className="explicacion" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: "0 0 6px" }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.explicacion)} />
                    </EditableText>
                    {fichaLocal.ejemplo && (
                      <div style={{
                        background: "#f7f7f0", borderRadius: 6,
                        padding: "8px 12px", border: `1px solid ${C.border}`,
                      }}>
                        <p style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Ejemplo</p>
                        <p className="explicacion" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.ejemplo)} />
                      </div>
                    )}
                  </div>
                  <div className="seccion">
                    <SeccionHeader numero="2" titulo="Practicamos" icono="✏️" />
                    {Array.isArray(fichaLocal.ejercicios) && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {fichaLocal.ejercicios.map((ejercicio, idx) => (
                          <div key={idx}>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                              <EditableText value={ejercicio} onSave={setArrayItem("ejercicios", idx)}>
                                <p className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(ejercicio)} />
                              </EditableText>
                            </div>
                            <RecuadroRespuesta />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )

            ) : (

              /* ── No PDL: Matemática, Ciencias, etc. ── */
              <>
                {/* 1. Explicación */}
                <div className="seccion">
                  <SeccionHeader numero="1" titulo={pregExplicacion || "Leemos juntos"} icono="📖" />
                  <ConceptoClave texto={fichaLocal.concepto_clave} onSave={set("concepto_clave")} />
                  <EditableText value={fichaLocal.explicacion} onSave={set("explicacion")}>
                    <p className="explicacion" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.explicacion)} />
                  </EditableText>
                </div>

                {/* 2. Actividad */}
                <div className="seccion">
                  <SeccionHeader numero="2" titulo={headerActividad} icono="✏️" />
                  {itemsLocal.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {itemsLocal.map(({ num, texto }, idx) => (
                        <div key={num}>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{num}.</span>
                            <EditableText value={texto} onSave={setItem(idx)}>
                              <p className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.55, margin: 0 }} dangerouslySetInnerHTML={renderHTMLConNegrita(texto)} />
                            </EditableText>
                          </div>
                          <RecuadroRespuesta />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="ejercicio-enunciado" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, marginBottom: 8 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.actividad)} />
                      <RecuadroRespuesta />
                    </>
                  )}
                </div>

                {/* 3. Reflexión */}
                {fichaLocal.pregunta_reflexion && (
                  <div className="seccion">
                    <SeccionHeader numero="3" titulo="Reflexionamos" icono="💭" />
                    <EditableText value={fichaLocal.pregunta_reflexion} onSave={set("pregunta_reflexion")}>
                      <p className="reflexion-texto" style={{ fontSize: 12, color: C.texto, fontStyle: "italic", lineHeight: 1.55, marginBottom: 6 }} dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.pregunta_reflexion)} />
                    </EditableText>
                    <LineasRespuesta n={2} />
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer */}
          <div style={{
            borderTop: `2px solid ${C.borderFuerte}`,
            padding: "6px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: C.fondoHeader
          }}>
            <span style={{ fontSize: 10, color: C.muted }}>tiza. · Diseño Curricular 2018</span>
            <span style={{ fontSize: 10, color: C.muted }}>{gradoDisplay} · {registro.area}</span>
          </div>

        </div>

      </div>

      {/* CSS */}
      <style>{`
        .editable-wrapper:hover .edit-icon-btn { opacity: 1 !important; }

        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 10mm; }

          html, body {
            margin: 0;
            padding: 0;
            width: 190mm;
          }

          #nav-ficha,
          .btn-imprimir,
          .validacion-badge,
          .mock-banner,
          .edit-icon-btn { display: none !important; }

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
            width: 190mm;
            max-width: 190mm;
            margin: 0;
            padding: 0;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            min-height: 277mm;
            display: flex;
            flex-direction: column;
            overflow: visible !important;
            font-family: 'Lexend Deca', sans-serif !important;
          }

          .cuerpo-ficha { flex: 1 !important; }

          /* Solo el texto de contenido en 13px — NO los títulos ni títulos de sección */
          .explicacion,
          .ejercicio-enunciado,
          .reflexion-texto,
          .concepto-clave,
          .dato-label { font-size: 13px !important; }

          /* El contenido se distribuye ocupando toda la hoja */
          .seccion:last-of-type { flex: 1; }
        }
      `}</style>
    </div>
  );
}
