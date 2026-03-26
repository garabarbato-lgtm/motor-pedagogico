import { useState } from "react";
import Logo from "./Logo.jsx";

// Paleta B&N safe — sostiene jerarquía por peso, borde y forma, no solo por color
const C = {
  fondo: "#ffffff",
  fondoHeader: "#f5f5f5",
  fondoEjemplo: "#f0f0f0",
  fondoReflexion: "#f7f7f0",
  acento: "#00c48c",        // solo decorativo (pantalla), nunca como único diferenciador
  texto: "#0d1f1a",
  muted: "#555555",
  border: "#cccccc",
  borderFuerte: "#0d0d0d",
  lineaEscritura: "#bbbbbb",
  // UI (fuera de la ficha imprimible)
  fondoApp: "#f8f8f4",
  btn: "#0d1f1a",
  btnText: "#00c48c",
  btnBorder: "#d8ede8",
};

// ── Helpers ──

function extraerEmoji(str) {
  if (!str) return { emoji: "📝", texto: str || "" };
  const partes = str.trim().split(" ");
  if (partes[0] && !/^[\w\u00C0-\u024F]/.test(partes[0])) {
    return { emoji: partes[0], texto: partes.slice(1).join(" ") };
  }
  return { emoji: "📝", texto: str };
}

function separarPregunta(texto) {
  if (!texto) return { pregunta: "", cuerpo: "" };
  const match = texto.match(/^(.+?\?)\s+([\s\S]+)/);
  if (match) return { pregunta: match[1].trim(), cuerpo: match[2].trim() };
  return { pregunta: "", cuerpo: texto };
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

// Renderiza texto con **negrita** como <strong>, strip de otro markdown
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

// Primera palabra del título en acento, el resto en texto
function renderTitulo(texto) {
  if (!texto) return null;
  const idx = texto.indexOf(" ");
  if (idx === -1) return <span style={{ color: C.acento }}>{texto}</span>;
  return (
    <>
      <span style={{ color: C.acento }}>{texto.slice(0, idx)}</span>
      <span style={{ color: C.texto }}>{texto.slice(idx)}</span>
    </>
  );
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

function RecuadroCalculo() {
  return (
    <div style={{
      border: "0.5px solid #ddddd8",
      borderRadius: 6,
      minHeight: 80,
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

  if (!ficha || !registro) return null;

  const isPDL = registro.area === "Prácticas del Lenguaje";
  const { emoji, texto: tituloTexto } = extraerEmoji(ficha.titulo);
  const { pregunta: pregExplicacion } = separarPregunta(stripMarkdown(ficha.explicacion));
  const { header: headerActividad, items } = parsearActividad(ficha.actividad);
  const gradoEsUno = registro.grado === "1";
  const gradoDisplay = `${registro.grado}° grado`;

  const handleImprimir = () => {
    setImprimiendo(true);
    setTimeout(() => { window.print(); setImprimiendo(false); }, 50);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: C.fondoApp, minHeight: "100vh" }}>

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
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* Badge de validación pedagógica */}
        {validacion?.observaciones?.length > 0 && (
          <div style={{
            background: "#fffbeb",
            border: "1px solid #f59e0b",
            borderRadius: 8, padding: "12px 16px", marginBottom: 16,
            animation: "fadeUp 0.3s both"
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
          <div style={{
            background: "#fffbeb", border: "1px solid #f6ad55",
            borderRadius: 8, padding: "8px 14px", marginBottom: 16,
            fontSize: 12, color: "#92400e"
          }}>
            ⚠️ Modo de prueba — ficha de ejemplo. Configurá ANTHROPIC_API_KEY para generar fichas reales.
          </div>
        )}

        {/* Botón imprimir */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
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
        </div>

        {/* ── FICHA IMPRIMIBLE ── */}
        <div id="ficha-imprimible" style={{
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                  {[gradoDisplay, registro.area, registro.bloque].map(tag => (
                    <span key={tag} style={{
                      fontSize: 9, fontWeight: 700, padding: "2px 8px",
                      borderRadius: 4, border: `1.5px solid ${C.borderFuerte}`,
                      color: C.texto, background: "white",
                      letterSpacing: "0.05em", textTransform: "uppercase"
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>
                  <h2 style={{
                    fontSize: 16, fontWeight: 800,
                    margin: 0, lineHeight: 1.2, letterSpacing: "-0.01em"
                  }}>
                    {renderTitulo(tituloTexto)}
                  </h2>
                </div>
              </div>
              <span style={{ flexShrink: 0, marginLeft: 12 }}><Logo size={13} /></span>
            </div>

            {/* Datos alumno */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
              gap: 10, marginTop: 8
            }}>
              {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
                <div key={label}>
                  <p style={{
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
          <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

            {isPDL ? (

              /* ── PDL: Lectura de textos ── */
              registro.bloque === "Lectura de textos" ? (
                <>
                  <div>
                    <SeccionHeader numero="1" titulo="Leemos" icono="📖" />
                    <p style={{ fontSize: 11, color: C.texto, lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }}>
                      {renderConNegrita(ficha.texto)}
                    </p>
                  </div>
                  <div>
                    <SeccionHeader numero="2" titulo="Respondé" icono="✍️" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {Array.isArray(ficha.preguntas) && ficha.preguntas.map((preg, idx) => (
                        <div key={idx}>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: C.texto, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                            <p style={{ fontSize: 12, color: C.texto, lineHeight: 1.55, margin: 0 }}>{renderConNegrita(preg)}</p>
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
                  <div>
                    <SeccionHeader numero="1" titulo="¡A escribir!" icono="✏️" />
                    <p style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: 0 }}>{renderConNegrita(ficha.consigna)}</p>
                  </div>
                  {Array.isArray(ficha.orientaciones) && ficha.orientaciones.length > 0 && (
                    <div>
                      <SeccionHeader numero="2" titulo="Antes de escribir, pensá…" icono="💭" />
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {ficha.orientaciones.map((orientacion, idx) => (
                          <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 12, color: C.muted, flexShrink: 0, marginTop: 1 }}>→</span>
                            <p style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, margin: 0 }}>{renderConNegrita(orientacion)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
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
                  <div>
                    <SeccionHeader numero="1" titulo="La regla" icono="📚" />
                    <p style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: "0 0 6px" }}>{renderConNegrita(ficha.explicacion)}</p>
                    {ficha.ejemplo && (
                      <div style={{
                        background: C.fondoReflexion, borderRadius: 6,
                        padding: "8px 12px", border: `1px solid ${C.border}`,
                      }}>
                        <p style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Ejemplo</p>
                        <p style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: 0 }}>{renderConNegrita(ficha.ejemplo)}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <SeccionHeader numero="2" titulo="Practicamos" icono="✏️" />
                    {Array.isArray(ficha.ejercicios) && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {ficha.ejercicios.map((ejercicio, idx) => (
                          <div key={idx}>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.texto, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                              <p style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, margin: 0 }}>{renderConNegrita(ejercicio)}</p>
                            </div>
                            <LineasRespuesta n={4} />
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
                <div>
                  <SeccionHeader numero="1" titulo={pregExplicacion || "Leemos juntos"} icono="📖" />
                  <p style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, margin: 0 }}>
                    {renderConNegrita(ficha.explicacion)}
                  </p>
                </div>

                {/* 2. Actividad */}
                <div>
                  <SeccionHeader numero="2" titulo={headerActividad} icono="✏️" />
                  {items.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {items.map(({ num, texto }) => (
                        <div key={num}>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: C.texto, minWidth: 16, flexShrink: 0 }}>{num}.</span>
                            <p style={{ fontSize: 12, color: C.texto, lineHeight: 1.55, margin: 0 }}>{renderConNegrita(texto)}</p>
                          </div>
                          {registro.area === "Matemática"
                            ? <RecuadroCalculo />
                            : <LineasRespuesta n={4} />
                          }
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, marginBottom: 8 }}>
                        {renderConNegrita(ficha.actividad)}
                      </p>
                      {registro.area === "Matemática"
                        ? <RecuadroCalculo />
                        : <LineasRespuesta n={4} />
                      }
                    </>
                  )}
                </div>

                {/* 3. Reflexión */}
                {ficha.pregunta_reflexion && (
                  <div>
                    <SeccionHeader numero="3" titulo="Reflexionamos" icono="💭" />
                    <p style={{ fontSize: 12, color: C.texto, fontStyle: "italic", lineHeight: 1.55, marginBottom: 6 }}>
                      {renderConNegrita(ficha.pregunta_reflexion)}
                    </p>
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

      {/* CSS impresión */}
      <style>{`
        @font-face { font-family: 'Lexend Deca'; }
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          #nav-ficha { display: none !important; }
          body * { visibility: hidden; }
          #ficha-imprimible, #ficha-imprimible * { visibility: visible; }
          #ficha-imprimible {
            position: absolute; left: 0; top: 0;
            width: 100%; box-shadow: none !important;
            border-radius: 0 !important; border: none !important;
            font-family: 'Lexend Deca', sans-serif !important;
          }
        }
      `}</style>
    </div>
  );
}
