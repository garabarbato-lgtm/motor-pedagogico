import { useState } from "react";

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
  // B&N safe
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
      {/* Header ficha */}
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
          <span style={{ fontFamily: "Georgia, serif", fontSize: 13, color: C.fichaTexto, flexShrink: 0 }}>
            motor<span style={{ color: C.acento }}>.</span>
          </span>
        </div>
        {/* Datos alumno */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginTop: 12 }}>
          {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
            <div key={label}>
              <p style={{ fontSize: 9, color: C.fichaMuted, fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
              <div style={{ borderBottom: `2px solid ${C.fichaBorderFuerte}`, height: 22 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Cuerpo ficha */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* 1. Leemos */}
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

        {/* 2. Completamos */}
        <div>
          <SeccionHeader numero="2" titulo="Completamos" icono="✏️" />
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

        {/* 3. Representamos */}
        <div>
          <SeccionHeader numero="3" titulo="Representamos" icono="🎨" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {["1/2", "2/4"].map(f => (
              <div key={f}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.fichaTexto, textAlign: "center", marginBottom: 5 }}>{f}</p>
                <div style={{ border: `2px solid ${C.fichaBorderFuerte}`, borderRadius: 5, height: 60, background: "white" }} />
              </div>
            ))}
          </div>
        </div>

        {/* 4. Reflexionamos */}
        <div>
          <SeccionHeader numero="4" titulo="Reflexionamos" icono="💭" />
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

      {/* Footer ficha */}
      <div style={{
        borderTop: `2px solid ${C.fichaBorderFuerte}`,
        padding: "8px 18px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: C.fichaFondoHeader
      }}>
        <span style={{ fontSize: 10, color: C.fichaMuted }}>Motor Pedagógico PBA · DC 2018</span>
        <span style={{ fontSize: 10, color: C.fichaMuted }}>5° grado · Matemática</span>
      </div>
    </div>
  );
}

export default function Landing() {
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", width: "100%", background: C.fondo, minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 40px", borderBottom: `0.5px solid ${C.border}`,
        background: C.fondo, position: "sticky", top: 0, zIndex: 10
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 400, color: C.texto, letterSpacing: "-0.01em" }}>
          motor<span style={{ color: C.acento }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: C.muted, cursor: "pointer" }}>Cómo funciona</span>
          <button style={{
            fontSize: 13, fontWeight: 500, padding: "8px 20px",
            borderRadius: 7, border: `1.5px solid ${C.acento}`,
            background: "transparent", color: C.acento, cursor: "pointer"
          }}>
            Entrar
          </button>
        </div>
      </nav>

      {/* ── HERO DOS COLUMNAS ── */}
      <section style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 56, alignItems: "center",
        maxWidth: 1100, margin: "0 auto",
        padding: "80px 40px 88px",
      }}>
        {/* Izquierda */}
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
            <span style={{ fontSize: 12, color: C.muted }}>Sin registro · Sin costo · En español</span>
          </div>
        </div>

        {/* Derecha — ficha B&N safe */}
        <FichaHero />
      </section>

      {/* ── SEPARADOR ── */}
      <div style={{ borderTop: `0.5px solid ${C.border}`, maxWidth: 860, margin: "0 auto" }} />

      {/* ── PARA QUIÉN ── */}
      <section style={{ padding: "72px 40px 80px", background: C.white }}>
        <p style={{
          textAlign: "center", fontSize: 11, fontWeight: 500,
          color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10
        }}>
          ¿Para quién es?
        </p>
        <h2 style={{
          fontFamily: "Georgia, serif",
          textAlign: "center", fontSize: 26, fontWeight: 400,
          color: C.texto, marginBottom: 52, letterSpacing: "-0.015em"
        }}>
          Para toda la comunidad educativa
        </h2>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16, maxWidth: 760, margin: "0 auto"
        }}>
          {[
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke={C.acento} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
              nombre: "Docentes",
              desc: "Generás recursos alineados al Diseño sin perder horas buscando o adaptando materiales."
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke={C.acento} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
              nombre: "Familias",
              desc: "Acompañás a tus hijos con explicaciones claras y actividades del grado, sin necesitar ser docente."
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke={C.acento} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
              nombre: "Estudiantes",
              desc: "Repasás cualquier tema con ejemplos concretos y ejercicios pensados para tu año."
            },
          ].map((item) => (
            <div key={item.nombre} style={{
              background: C.fondo, border: `0.5px solid ${C.border}`,
              borderRadius: 12, padding: "28px 24px"
            }}>
              <div style={{
                width: 40, height: 40, background: C.pillBg,
                borderRadius: 8, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 16
              }}>
                {item.icon}
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: C.texto, marginBottom: 8 }}>{item.nombre}</p>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
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
