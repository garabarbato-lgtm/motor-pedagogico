import { useState } from "react";
import Logo from "./Logo.jsx";

const C = {
  fondo: "#f8f8f4",
  acento: "#00c48c",
  texto: "#0d1f1a",
  suave: "#e0faf2",
  muted: "#4a6b60",
  btn: "#0d1f1a",
  btnText: "#00c48c",
  pillBg: "#e0faf2",
  pillText: "#003d2b",
  white: "#ffffff",
  border: "#d8ede8",
  fichaFondoHeader: "#f5f5f5",
  fichaFondoEjemplo: "#f0f0f0",
  fichaFondoReflexion: "#f7f7f0",
  fichaBorder: "#cccccc",
  fichaBorderFuerte: "#0d0d0d",
  fichaLineaEscritura: "#bbbbbb",
  fichaTexto: "#0d0d0d",
  fichaMuted: "#555555",
};

function SeccionHeader({ numero, titulo, icono }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      marginBottom: 12, paddingBottom: 8,
      borderBottom: `2px solid ${C.fichaBorderFuerte}`
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: "50%",
        background: C.fichaBorderFuerte, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, flexShrink: 0
      }}>
        {numero}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.fichaTexto }}>{titulo}</span>
      <span style={{ fontSize: 12, marginLeft: "auto", opacity: 0.35 }}>{icono}</span>
    </div>
  );
}

function LineaEscritura() {
  return <div style={{ borderBottom: `1.5px solid ${C.fichaLineaEscritura}`, height: 28, marginBottom: 5 }} />;
}

function FichaHero() {
  return (
    <div style={{
      background: C.white,
      border: `2.5px solid ${C.fichaBorderFuerte}`,
      borderRadius: 10,
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(0,30,20,0.10)",
    }}>
      <div style={{
        background: C.fichaFondoHeader,
        borderBottom: `2.5px solid ${C.fichaBorderFuerte}`,
        padding: "14px 18px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
              {["5° grado", "Matemática", "Números racionales"].map(tag => (
                <span key={tag} style={{
                  fontSize: 9, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 3, border: `1.5px solid ${C.fichaBorderFuerte}`,
                  color: C.fichaTexto, background: "white",
                  letterSpacing: "0.05em", textTransform: "uppercase"
                }}>{tag}</span>
              ))}
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: C.fichaTexto, margin: 0, lineHeight: 1.2 }}>
              Fracciones equivalentes
            </h3>
            <p style={{ fontSize: 11, color: C.fichaMuted, marginTop: 3, fontStyle: "italic" }}>
              Objetivo: Reconocer y construir fracciones equivalentes
            </p>
          </div>
          <span style={{ flexShrink: 0 }}><Logo size={13} /></span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginTop: 12 }}>
          {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
            <div key={label}>
              <p style={{ fontSize: 9, color: C.fichaMuted, fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
              <div style={{ borderBottom: `2px solid ${C.fichaBorderFuerte}`, height: 22 }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <SeccionHeader numero="1" titulo="Leemos juntos" icono="📖" />
          <div style={{
            background: C.fichaFondoEjemplo, borderRadius: 5,
            padding: "10px 14px", border: `1px solid ${C.fichaBorder}`,
            borderLeft: `4px solid ${C.fichaBorderFuerte}`,
          }}>
            <p style={{ fontSize: 12, color: C.fichaTexto, lineHeight: 1.75, margin: 0 }}>
              Dos fracciones son <strong>equivalentes</strong> cuando representan la misma parte de un entero, aunque tengan números distintos.
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 16, marginTop: 10, padding: "10px",
            border: `1.5px dashed ${C.fichaBorder}`, borderRadius: 6
          }}>
            {["1/2", "2/4", "4/8"].map((f, i) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {i > 0 && <span style={{ fontSize: 14, color: C.fichaMuted }}>=</span>}
                <span style={{
                  fontSize: 20, fontWeight: 800, color: C.fichaTexto,
                  textDecoration: i > 0 ? "underline" : "none",
                  textDecorationColor: C.acento, textUnderlineOffset: 3
                }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SeccionHeader numero="2" titulo="Tu turno" icono="✏️" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { base: "1/3", a: "□/6", b: "□/9" },
              { base: "2/5", a: "4/□", b: "□/15" },
            ].map((fila, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px",
                background: i % 2 === 0 ? C.white : C.fichaFondoEjemplo,
                borderRadius: 5, border: `1px solid ${C.fichaBorder}`
              }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: C.fichaTexto, minWidth: 36 }}>{fila.base}</span>
                <span style={{ color: C.fichaMuted, fontSize: 14 }}>=</span>
                <div style={{
                  border: `2px solid ${C.fichaBorderFuerte}`, borderRadius: 4,
                  width: 52, height: 32, background: "white",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <span style={{ fontSize: 11, color: C.fichaBorder }}>{fila.a}</span>
                </div>
                <span style={{ color: C.fichaMuted, fontSize: 14 }}>=</span>
                <div style={{
                  border: `2px solid ${C.fichaBorderFuerte}`, borderRadius: 4,
                  width: 52, height: 32, background: "white",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <span style={{ fontSize: 11, color: C.fichaBorder }}>{fila.b}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SeccionHeader numero="3" titulo="Reflexionamos" icono="💭" />
          <div style={{
            background: C.fichaFondoReflexion,
            border: `1px solid ${C.fichaBorder}`,
            borderLeft: `4px solid ${C.fichaBorderFuerte}`,
            borderRadius: 5, padding: "10px 13px", marginBottom: 12
          }}>
            <p style={{ fontSize: 12, color: C.fichaTexto, fontStyle: "italic", margin: 0, lineHeight: 1.65 }}>
              ¿Podés pensar en un ejemplo de tu vida cotidiana donde uses fracciones equivalentes?
            </p>
          </div>
          <LineaEscritura />
          <LineaEscritura />
        </div>
      </div>

      <div style={{
        borderTop: `2px solid ${C.fichaBorderFuerte}`,
        padding: "8px 18px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: C.fichaFondoHeader
      }}>
        <span style={{ fontSize: 10, color: C.fichaMuted }}>tiza. · DC 2018</span>
        <span style={{ fontSize: 10, color: C.fichaMuted }}>5° grado · Matemática</span>
      </div>
    </div>
  );
}

export default function Landing({ onEmpezar }) {
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", width: "100%", background: C.fondo, minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 40px", borderBottom: `0.5px solid ${C.border}`,
        background: C.fondo, position: "sticky", top: 0, zIndex: 10
      }}>
        <Logo size={32} />
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <button
            onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
            style={{ fontSize: 13, color: C.muted, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Cómo funciona
          </button>
          <button
            onClick={onEmpezar}
            style={{
              fontSize: 13, fontWeight: 500, padding: "8px 20px",
              borderRadius: 7, border: `1.5px solid ${C.acento}`,
              background: "transparent", color: C.acento, cursor: "pointer"
            }}>
            Entrar
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 56, alignItems: "center",
        maxWidth: 1100, margin: "0 auto",
        padding: "80px 40px 88px",
      }}>
        <div>
          <div style={{
            display: "inline-block", background: C.pillBg, color: C.pillText,
            fontSize: 11, fontWeight: 500, letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "5px 16px",
            borderRadius: 20, marginBottom: 32
          }}>
            Basado en el Diseño Curricular · PBA
          </div>

          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 400,
            color: C.texto, lineHeight: 1.2, marginBottom: 20,
            letterSpacing: "-0.025em"
          }}>
            Lo que tardabas una tarde, ahora son{" "}
            <span style={{ color: C.acento, fontStyle: "italic" }}>diez minutos.</span>
          </h1>

          <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, marginBottom: 40, maxWidth: 400 }}>
            El Diseño, convertido en recursos listos para el aula.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
            <button
              onClick={onEmpezar}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{
                fontSize: 15, fontWeight: 600, padding: "14px 32px",
                borderRadius: 8, border: "none",
                background: btnHover ? "#0a1814" : C.btn,
                color: C.btnText, cursor: "pointer", transition: "background 0.15s"
              }}>
              Generar mi primer recurso
            </button>
            <span style={{ fontSize: 12, color: C.muted }}>Gratuito · En español · Hecho en Argentina</span>
          </div>
        </div>

        <FichaHero />
      </section>

      {/* ── SEPARADOR ── */}
      <div style={{ borderTop: `0.5px solid ${C.border}`, maxWidth: 860, margin: "0 auto" }} />

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" style={{ background: "#f5f5f0", padding: "80px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Badge */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{
              display: "inline-block",
              background: "#d4f0e8", color: "#0d5c4a",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", padding: "5px 16px", borderRadius: 20,
            }}>
              Basado en el Diseño Curricular · PBA
            </span>
          </div>

          {/* Título */}
          <h2 style={{
            fontFamily: "Georgia, serif", textAlign: "center",
            fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 400,
            color: "#0d1f1a", marginBottom: 12, letterSpacing: "-0.02em",
          }}>
            Tres pasos. Una ficha lista.
          </h2>

          {/* Subtítulo */}
          <p style={{
            textAlign: "center", fontSize: 15, color: "#4a5550",
            marginBottom: 52, lineHeight: 1.6,
          }}>
            Sin vueltas, sin registro, sin perder tiempo.
          </p>

          {/* Conectora + cards */}
          <div style={{ position: "relative" }}>
            {/* Línea punteada */}
            <div style={{
              position: "absolute", top: 20, zIndex: 0,
              left: "calc(16.67% + 20px)", right: "calc(16.67% + 20px)",
              borderTop: "2px dashed #00c48c",
            }} />

            {/* Círculos numerados */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              marginBottom: 20, position: "relative", zIndex: 1,
            }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "#00c48c", color: "#0d1f1a",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 800,
                    boxShadow: "0 0 0 5px #f5f5f0",
                  }}>
                    {n}
                  </div>
                </div>
              ))}
            </div>

            {/* Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>

              {/* Card 1 */}
              <div style={{ background: "#ffffff", border: "1px solid #ddddd8", borderRadius: 12, padding: "28px 22px" }}>
                <div style={{
                  width: 44, height: 44, background: "#d4f0e8", borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00a876" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <polyline points="3 6 4 7 6 5"/>
                    <polyline points="3 12 4 13 6 11"/>
                    <polyline points="3 18 4 19 6 17"/>
                  </svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#0d1f1a", marginBottom: 10 }}>Elegís el objetivo</p>
                <p style={{ fontSize: 13, color: "#4a5550", lineHeight: 1.65 }}>
                  Seleccionás el{" "}
                  <strong style={{ color: "#00a876", fontWeight: 700 }}>grado, el área</strong>
                  {" "}y el contenido del{" "}
                  <strong style={{ color: "#00a876", fontWeight: 700 }}>Diseño Curricular</strong>
                  {" "}que querés trabajar.
                </p>
              </div>

              {/* Card 2 */}
              <div style={{ background: "#ffffff", border: "1px solid #ddddd8", borderRadius: 12, padding: "28px 22px" }}>
                <div style={{
                  width: 44, height: 44, background: "#d4f0e8", borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00a876" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#0d1f1a", marginBottom: 10 }}>La IA genera la ficha</p>
                <p style={{ fontSize: 13, color: "#4a5550", lineHeight: 1.65 }}>
                  En{" "}
                  <strong style={{ color: "#00a876", fontWeight: 700 }}>segundos</strong>
                  {" "}tenés una ficha lista, basada en el{" "}
                  <strong style={{ color: "#00a876", fontWeight: 700 }}>Diseño Curricular de la Provincia de Buenos Aires</strong>.
                </p>
              </div>

              {/* Card 3 */}
              <div style={{ background: "#ffffff", border: "1px solid #ddddd8", borderRadius: 12, padding: "28px 22px" }}>
                <div style={{
                  width: 44, height: 44, background: "#d4f0e8", borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00a876" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#0d1f1a", marginBottom: 10 }}>Revisás y descargás</p>
                <p style={{ fontSize: 13, color: "#4a5550", lineHeight: 1.65 }}>
                  Podés{" "}
                  <strong style={{ color: "#00a876", fontWeight: 700 }}>ajustar</strong>
                  {" "}el contenido y{" "}
                  <strong style={{ color: "#00a876", fontWeight: 700 }}>descargar</strong>
                  {" "}la ficha lista para imprimir o compartir.
                </p>
              </div>

            </div>
          </div>

          {/* Tagline */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 48 }}>
            <span style={{ fontSize: 13, color: "#4a5550", fontWeight: 500 }}>Gratuito</span>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00c48c" }} />
            <span style={{ fontSize: 13, color: "#4a5550", fontWeight: 500 }}>En español</span>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00c48c" }} />
            <span style={{ fontSize: 13, color: "#4a5550", fontWeight: 500 }}>Hecho en Argentina</span>
          </div>

        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{
        background: "#f5f5f0",
        borderTop: "0.5px solid #ddddd8",
        padding: "64px 40px",
        textAlign: "center"
      }}>
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: 28, fontWeight: 400,
          color: C.texto, marginBottom: 32,
          letterSpacing: "-0.015em"
        }}>
          ¿Listo para generar tu primera ficha?
        </h2>
        <button
          onClick={onEmpezar}
          style={{
            background: C.btn, color: C.btnText,
            border: "none", borderRadius: 8,
            fontSize: 15, fontWeight: 600,
            padding: "14px 32px", cursor: "pointer",
          }}
        >
          Generar mi primer recurso
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.btn, padding: "22px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: C.muted }}>
          Basado en el{" "}
          <span style={{ color: C.acento, fontWeight: 500 }}>Diseño Curricular PBA</span>
          {" "}· DGCyE 2018 · Resolución N° 1482/17
        </p>
      </footer>

    </div>
  );
}
