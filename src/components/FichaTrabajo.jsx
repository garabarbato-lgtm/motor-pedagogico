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
      if (actual) items.push({ ...actual, texto: stripMarkdown(actual.texto) });
      actual = { num: num[1], texto: num[2] };
    } else if (actual) {
      actual.texto += " " + linea;
    } else if (items.length > 0) {
      items.push({ num: String(items.length + 1), texto: stripMarkdown(linea) });
    }
  }
  if (actual) items.push({ ...actual, texto: stripMarkdown(actual.texto) });
  return { header, items };
}

// ── Subcomponentes ──

function LineaEscritura() {
  return (
    <div style={{
      borderBottom: `1.5px solid ${C.lineaEscritura}`,
      height: 34, width: "100%", marginBottom: 6
    }} />
  );
}

function SeccionHeader({ numero, titulo, icono }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      marginBottom: 14, paddingBottom: 10,
      borderBottom: `2px solid ${C.borderFuerte}`
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: C.borderFuerte, color: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 800, flexShrink: 0
      }}>
        {numero}
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: C.texto, letterSpacing: "0.01em" }}>
        {titulo}
      </span>
      <span style={{ fontSize: 14, marginLeft: "auto", opacity: 0.4 }}>{icono}</span>
    </div>
  );
}

// ── Componente principal ──

export default function FichaTrabajo({ ficha, registro, validacion, onNueva, onInicio }) {
  const [imprimiendo, setImprimiendo] = useState(false);

  if (!ficha || !registro) return null;

  const isPDL = registro.area === "Prácticas del Lenguaje";
  const { emoji, texto: tituloTexto } = extraerEmoji(ficha.titulo);
  const { pregunta: pregExplicacion, cuerpo: cuerpoExplicacion } = separarPregunta(stripMarkdown(ficha.explicacion));
  const { pregunta: pregEjemplo, cuerpo: cuerpoEjemplo } = separarPregunta(stripMarkdown(ficha.ejemplo));
  const { header: headerActividad, items } = parsearActividad(ficha.actividad);
  const nLineas = Math.max(3, Math.min(items.length + 1, 7));
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
        }}>

          {/* Encabezado */}
          <div style={{
            background: C.fondoHeader,
            borderBottom: `2.5px solid ${C.borderFuerte}`,
            padding: "18px 24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  {[gradoDisplay, registro.area, registro.bloque].map(tag => (
                    <span key={tag} style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 10px",
                      borderRadius: 4, border: `1.5px solid ${C.borderFuerte}`,
                      color: C.texto, background: "white",
                      letterSpacing: "0.05em", textTransform: "uppercase"
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 26, lineHeight: 1 }}>{emoji}</span>
                  <h2 style={{
                    fontSize: 20, fontWeight: 800, color: C.texto,
                    margin: 0, lineHeight: 1.2, letterSpacing: "-0.01em"
                  }}>
                    {tituloTexto}
                  </h2>
                </div>
                {registro.objetivo && (
                  <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic", margin: 0 }}>
                    Objetivo: {registro.objetivo}
                  </p>
                )}
              </div>
              <span style={{ flexShrink: 0, marginLeft: 16 }}><Logo size={14} /></span>
            </div>

            {/* Datos alumno */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
              gap: 16, marginTop: 18
            }}>
              {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
                <div key={label}>
                  <p style={{
                    fontSize: 10, color: C.muted, fontWeight: 700,
                    marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em"
                  }}>
                    {label}
                  </p>
                  <div style={{ borderBottom: `2px solid ${C.borderFuerte}`, height: 26 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Cuerpo */}
          <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 26 }}>

            {isPDL ? (

              /* ── PDL: Lectura de textos ── */
              registro.bloque === "Lectura de textos" ? (
                <>
                  <div>
                    <SeccionHeader numero="1" titulo="Leemos" icono="📖" />
                    <div style={{
                      background: C.fondoEjemplo, borderRadius: 6,
                      padding: "14px 18px", border: `1px solid ${C.border}`,
                      borderLeft: `4px solid ${C.borderFuerte}`,
                    }}>
                      <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
                        {stripMarkdown(ficha.texto)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <SeccionHeader numero="2" titulo="Respondé" icono="✍️" />
                    {Array.isArray(ficha.preguntas) && ficha.preguntas.map((preg, idx) => (
                      <div key={idx} style={{ marginBottom: 20 }}>
                        <div style={{
                          display: "flex", gap: 12, alignItems: "flex-start",
                          padding: "10px 14px",
                          background: (idx + 1) % 2 === 0 ? C.fondoEjemplo : C.fondo,
                          borderRadius: 6, border: `1px solid ${C.border}`, marginBottom: 8,
                        }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: "50%",
                            border: `2px solid ${C.borderFuerte}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, color: C.borderFuerte, flexShrink: 0,
                          }}>{idx + 1}</div>
                          <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.6, margin: 0 }}>{stripMarkdown(preg)}</p>
                        </div>
                        <LineaEscritura /><LineaEscritura /><LineaEscritura />
                      </div>
                    ))}
                  </div>
                </>

              /* ── PDL: Escritura de textos ── */
              ) : registro.bloque === "Escritura de textos" ? (
                <>
                  <div>
                    <SeccionHeader numero="1" titulo="¡A escribir!" icono="✏️" />
                    <div style={{
                      background: C.fondoEjemplo, borderRadius: 6,
                      padding: "14px 18px", border: `1px solid ${C.border}`,
                      borderLeft: `4px solid ${C.borderFuerte}`,
                    }}>
                      <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.8, margin: 0 }}>{stripMarkdown(ficha.consigna)}</p>
                    </div>
                  </div>
                  {Array.isArray(ficha.orientaciones) && ficha.orientaciones.length > 0 && (
                    <div>
                      <SeccionHeader numero="2" titulo="Antes de escribir, pensá…" icono="💭" />
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {ficha.orientaciones.map((orientacion, idx) => (
                          <div key={idx} style={{
                            display: "flex", gap: 12, alignItems: "flex-start",
                            padding: "10px 14px",
                            background: (idx + 1) % 2 === 0 ? C.fondoEjemplo : C.fondo,
                            borderRadius: 6, border: `1px solid ${C.border}`,
                          }}>
                            <div style={{
                              width: 24, height: 24, borderRadius: "50%",
                              border: `2px solid ${C.borderFuerte}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 800, color: C.borderFuerte, flexShrink: 0,
                            }}>{idx + 1}</div>
                            <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.6, margin: 0 }}>{stripMarkdown(orientacion)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <SeccionHeader numero="3" titulo="Mi texto" icono="📝" />
                    {Array.from({ length: 10 }).map((_, i) => <LineaEscritura key={i} />)}
                  </div>
                </>

              /* ── PDL: Ortografía ── */
              ) : (
                <>
                  <div>
                    <SeccionHeader numero="1" titulo="La regla" icono="📚" />
                    <div style={{
                      background: C.fondoEjemplo, borderRadius: 6,
                      padding: "14px 18px", border: `1px solid ${C.border}`,
                      borderLeft: `4px solid ${C.borderFuerte}`, marginBottom: 12,
                    }}>
                      <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.8, margin: 0 }}>{stripMarkdown(ficha.explicacion)}</p>
                    </div>
                    {ficha.ejemplo && (
                      <div style={{
                        background: C.fondoReflexion, borderRadius: 6,
                        padding: "12px 16px", border: `1px solid ${C.border}`,
                      }}>
                        <p style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Ejemplo</p>
                        <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.7, margin: 0 }}>{stripMarkdown(ficha.ejemplo)}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <SeccionHeader numero="2" titulo="Practicamos" icono="✏️" />
                    {Array.isArray(ficha.ejercicios) && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {ficha.ejercicios.map((ejercicio, idx) => (
                          <div key={idx}>
                            <div style={{
                              display: "flex", gap: 12, alignItems: "flex-start",
                              padding: "10px 14px",
                              background: (idx + 1) % 2 === 0 ? C.fondoEjemplo : C.fondo,
                              borderRadius: 6, border: `1px solid ${C.border}`, marginBottom: 6,
                            }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: "50%",
                                border: `2px solid ${C.borderFuerte}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 800, color: C.borderFuerte, flexShrink: 0,
                              }}>{idx + 1}</div>
                              <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.6, margin: 0 }}>{stripMarkdown(ejercicio)}</p>
                            </div>
                            <LineaEscritura /><LineaEscritura />
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
                  <div style={{
                    background: C.fondoEjemplo,
                    borderRadius: 6, padding: "14px 18px",
                    border: `1px solid ${C.border}`,
                    borderLeft: `4px solid ${C.borderFuerte}`,
                  }}>
                    <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.8, margin: 0 }}>
                      {cuerpoExplicacion || ficha.explicacion}
                    </p>
                  </div>
                </div>

                {/* 2. Ejemplo */}
                <div>
                  <SeccionHeader numero="2" titulo={pregEjemplo || "¿Cómo se ve en la vida real?"} icono="💡" />
                  <div style={{
                    background: C.fondoReflexion,
                    border: `1px solid ${C.border}`,
                    borderLeft: `4px solid ${C.borderFuerte}`,
                    borderRadius: 6, padding: "14px 18px"
                  }}>
                    <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.8, margin: 0 }}>
                      {cuerpoEjemplo || ficha.ejemplo}
                    </p>
                  </div>
                </div>

                {/* 3. Actividad */}
                <div>
                  <SeccionHeader numero="3" titulo={headerActividad} icono="✏️" />
                  {items.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                      {items.map(({ num, texto }) => (
                        <div key={num} style={{
                          display: "flex", gap: 12, alignItems: "flex-start",
                          padding: "10px 14px",
                          background: Number(num) % 2 === 0 ? C.fondoEjemplo : C.fondo,
                          borderRadius: 6, border: `1px solid ${C.border}`
                        }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: "50%",
                            border: `2px solid ${C.borderFuerte}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, color: C.borderFuerte, flexShrink: 0
                          }}>
                            {num}
                          </div>
                          <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.6, margin: 0 }}>{texto}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.8, marginBottom: 20 }}>
                      {ficha.actividad}
                    </p>
                  )}
                  <p style={{
                    fontSize: 10, color: C.muted, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8
                  }}>
                    Escribí tus respuestas acá
                  </p>
                  {Array.from({ length: nLineas }).map((_, i) => <LineaEscritura key={i} />)}
                </div>

                {/* 4. Reflexión */}
                {ficha.pregunta_reflexion && (
                  <div>
                    <SeccionHeader numero="4" titulo="Reflexionamos" icono="💭" />
                    <div style={{
                      background: C.fondoReflexion,
                      border: `1px solid ${C.border}`,
                      borderLeft: `4px solid ${C.borderFuerte}`,
                      borderRadius: 6, padding: "12px 16px", marginBottom: 14
                    }}>
                      <p style={{ fontSize: 13, color: C.texto, fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
                        {stripMarkdown(ficha.pregunta_reflexion)}
                      </p>
                    </div>
                    <LineaEscritura />
                    <LineaEscritura />
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer */}
          <div style={{
            borderTop: `2px solid ${C.borderFuerte}`,
            padding: "10px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: C.fondoHeader
          }}>
            <span style={{ fontSize: 11, color: C.muted }}>tiza. · Diseño Curricular 2018</span>
            <span style={{ fontSize: 11, color: C.muted }}>{gradoDisplay} · {registro.area}</span>
          </div>

        </div>

      </div>

      {/* CSS impresión */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
          #nav-ficha { display: none !important; }
          body * { visibility: hidden; }
          #ficha-imprimible, #ficha-imprimible * { visibility: visible; }
          #ficha-imprimible {
            position: absolute; left: 0; top: 0;
            width: 100%; box-shadow: none !important;
            border-radius: 0 !important; border: none !important;
            max-height: 273mm; overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
}
