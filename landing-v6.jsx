import { useState, useEffect } from "react";

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
};

// ── DEMO INTERACTIVA ─────────────────────────────────────────────────────────

const QUERY = "fracciones 5to";
const STEP_DURATIONS = [2000, 1500, 1500, 3500];
const FADE_OUT = 250;
const FADE_IN = 350;

function LupaIcon({ active }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="16" height="16" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5" stroke={active ? "#00c48c" : "#6B8C7D"} strokeWidth="1.5" />
      <path d="M11 11l3 3" stroke={active ? "#00c48c" : "#6B8C7D"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchBar({ text, focused }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      borderRadius: 12,
      border: `1.5px solid ${focused ? "#00c48c" : "#D4E6DE"}`,
      boxShadow: focused ? "0 0 0 3px rgba(0,196,140,0.12)" : "none",
      padding: "14px 18px",
      background: "#fff",
      fontFamily: "'Lexend', sans-serif",
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}>
      <LupaIcon active={focused} />
      <span style={{
        fontSize: 14, color: "#004733", flex: 1, minHeight: 20,
        fontFamily: "'Lexend', sans-serif",
        letterSpacing: "-0.01em",
      }}>
        {text}
        {focused && (
          <span style={{
            display: "inline-block", width: 1.5, height: 14,
            background: "#004733", marginLeft: 1, verticalAlign: "middle", opacity: 1,
          }} />
        )}
      </span>
    </div>
  );
}

function StepSearch({ typedText, searchFocused }) {
  return (
    <div style={{ padding: "20px 18px" }}>
      <p style={{
        fontSize: 10, color: "#6B8C7D", marginBottom: 10,
        letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600,
        fontFamily: "'Lexend', sans-serif",
      }}>
        Buscá un contenido
      </p>
      <SearchBar text={typedText} focused={searchFocused} />
    </div>
  );
}

function StepResults() {
  const results = [
    { name: "Fracciones equivalentes", meta: "5° grado · Matemática · Números Racionales" },
    { name: "Fracciones: partes del entero", meta: "5° grado · Matemática · Números Racionales" },
  ];
  return (
    <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
      <SearchBar text={QUERY} focused={false} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
        {results.map((r, i) => (
          <div key={i} style={{
            background: i === 0 ? "#E6FAF3" : "#fff",
            border: `${i === 0 ? "2px" : "1px"} solid ${i === 0 ? "#004733" : "#D4E6DE"}`,
            borderRadius: 10, padding: "10px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 11, color: "#6B8C7D", fontFamily: "'Lexend', sans-serif", marginBottom: 2 }}>
                {r.meta}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#004733", fontFamily: "'Lexend', sans-serif" }}>
                {r.name}
              </div>
            </div>
            {i === 0 && (
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "#00c48c", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0, marginLeft: 8,
              }}>✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepConfirm() {
  return (
    <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Chip de confirmación */}
      <div style={{
        background: "#fff", border: "1px solid #D4E6DE",
        borderRadius: 12, padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 8,
        fontFamily: "'Lexend', sans-serif",
      }}>
        <span style={{
          fontSize: 12, color: "#004733", fontWeight: 700, flex: 1,
        }}>
          Fracciones equivalentes
        </span>
        <span style={{
          fontSize: 11, color: "#004733",
          border: "1px solid #D4E6DE",
          borderRadius: 99, padding: "3px 10px", flexShrink: 0,
          fontFamily: "'Lexend', sans-serif",
        }}>
          5° grado
        </span>
        <span style={{
          fontSize: 11, color: "#6B8C7D",
          border: "1px solid #D4E6DE",
          borderRadius: 99, padding: "3px 10px", flexShrink: 0,
          fontFamily: "'Lexend', sans-serif",
        }}>
          Cambiar
        </span>
      </div>
      {["Incluir explicación", "Incluir ejemplo concreto"].map((label) => (
        <div key={label} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", background: "#fff",
          border: "1px solid #D4E6DE", borderRadius: 10,
          fontFamily: "'Lexend', sans-serif",
        }}>
          <span style={{ fontSize: 13, color: "#004733" }}>{label}</span>
          <div style={{
            width: 36, height: 20, background: "#004733",
            borderRadius: 10, position: "relative", flexShrink: 0,
          }}>
            <div style={{
              width: 16, height: 16, background: "#fff",
              borderRadius: "50%", position: "absolute", right: 2, top: 2,
            }} />
          </div>
        </div>
      ))}
      <div style={{
        background: "#004733", color: "#fff",
        borderRadius: 10, padding: "12px 16px",
        fontSize: 13, fontWeight: 700, textAlign: "center",
        fontFamily: "'Lexend', sans-serif", marginTop: 2,
      }}>
        Generar ficha ✦
      </div>
    </div>
  );
}

function GrayBar({ width = "100%" }) {
  return <div style={{ height: 7, background: "#D4E6DE", borderRadius: 4, marginBottom: 4, width }} />;
}

function StepFicha() {
  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ background: "#004733", padding: "10px 14px" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
          {["5° grado", "Matemática", "Núm. racionales"].map(tag => (
            <span key={tag} style={{
              fontSize: 8, fontWeight: 700,
              background: "rgba(0,196,140,0.22)", color: "#00c48c",
              borderRadius: 4, padding: "2px 6px",
              fontFamily: "'Lexend', sans-serif",
            }}>{tag}</span>
          ))}
        </div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3,
          fontFamily: "'Lexend', sans-serif",
        }}>
          Fracciones <span style={{ color: "#00c48c" }}>equivalentes</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8, marginTop: 8 }}>
          {["Nombre y apellido", "Fecha"].map(label => (
            <div key={label}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ borderBottom: "1.5px solid rgba(255,255,255,0.3)", height: 16 }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "10px 14px", background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#004733", marginBottom: 5, fontFamily: "'Lexend', sans-serif" }}>
            1 · Leemos juntos
          </div>
          <div style={{ background: "#E6FAF3", borderLeft: "3px solid #004733", borderRadius: "0 6px 6px 0", padding: "7px 10px" }}>
            <GrayBar width="95%" /><GrayBar width="82%" /><GrayBar width="70%" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#004733", marginBottom: 5, fontFamily: "'Lexend', sans-serif" }}>
            2 · Tu turno
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div><GrayBar width="88%" /><div style={{ height: 28, border: "0.5px solid #D4E6DE", borderRadius: 6 }} /></div>
            <div><GrayBar width="75%" /><div style={{ height: 28, border: "0.5px solid #D4E6DE", borderRadius: 6 }} /></div>
          </div>
        </div>
      </div>
      <div style={{
        borderTop: "1px solid #D4E6DE", padding: "6px 14px",
        display: "flex", justifyContent: "space-between", background: "#F0F4F2",
      }}>
        <span style={{ fontSize: 8, color: "#6B8C7D", fontFamily: "'Lexend', sans-serif" }}>tiza. · Diseño Curricular 2018</span>
        <span style={{ fontSize: 8, color: "#6B8C7D", fontFamily: "'Lexend', sans-serif" }}>5° grado · Matemática</span>
      </div>
    </div>
  );
}

function DemoInteractiva() {
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (step !== 0) { setTypedText(""); setSearchFocused(false); return; }
    let interval = null;
    const startTimer = setTimeout(() => {
      setSearchFocused(true);
      let i = 0;
      interval = setInterval(() => {
        i++;
        setTypedText(QUERY.slice(0, i));
        if (i >= QUERY.length) clearInterval(interval);
      }, 75);
    }, FADE_IN + 200);
    return () => { clearTimeout(startTimer); if (interval) clearInterval(interval); };
  }, [step]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      const changeTimer = setTimeout(() => {
        setStep(s => (s + 1) % 4);
        setFading(false);
      }, FADE_OUT);
      return () => clearTimeout(changeTimer);
    }, STEP_DURATIONS[step]);
    return () => clearTimeout(timer);
  }, [step]);

  const fade = { opacity: fading ? 0 : 1, transition: `opacity ${fading ? FADE_OUT : FADE_IN}ms ease` };

  return (
    <div>
      <div style={{
        borderRadius: 16, border: "1px solid #D4E6DE",
        overflow: "hidden", background: "#F0F4F2",
        boxShadow: "0 8px 40px rgba(0,30,20,0.10)",
      }}>
        {/* Browser bar */}
        <div style={{
          background: "#004733", padding: "11px 18px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: 11, color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.02em", fontFamily: "'Lexend', sans-serif",
          }}>
            fichastiza.vercel.app
          </span>
        </div>
        <div style={fade}>
          {step === 0 && <StepSearch typedText={typedText} searchFocused={searchFocused} />}
          {step === 1 && <StepResults />}
          {step === 2 && <StepConfirm />}
          {step === 3 && <StepFicha />}
        </div>
      </div>
      <p style={{
        textAlign: "center", fontSize: 11, color: "#6B8C7D",
        marginTop: 12, marginBottom: 0, fontFamily: "'Lexend', sans-serif",
      }}>
        Tarda unos segundos · Alineada al Diseño Curricular PBA
      </p>
    </div>
  );
}

// ── LANDING ──────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", width: "100%", background: C.fondo, minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 48px", borderBottom: `0.5px solid ${C.border}`,
        background: C.fondo, position: "sticky", top: 0, zIndex: 10,
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 400, color: C.texto, letterSpacing: "-0.01em" }}>
          motor<span style={{ color: C.acento }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: C.muted, cursor: "pointer" }}>Cómo funciona</span>
          <button style={{
            fontSize: 13, fontWeight: 500, padding: "8px 20px",
            borderRadius: 7, border: `1.5px solid ${C.acento}`,
            background: "transparent", color: C.acento, cursor: "pointer",
          }}>
            Entrar
          </button>
        </div>
      </nav>

      {/* ── HERO DOS COLUMNAS ── */}
      <section style={{ width: "100%", padding: "80px 0 88px", background: C.fondo }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 48px",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 56, alignItems: "center",
        }}>
          {/* Izquierda */}
          <div>
            <div style={{
              display: "inline-block", background: C.pillBg, color: C.pillText,
              fontSize: 11, fontWeight: 500, letterSpacing: "0.08em",
              textTransform: "uppercase", padding: "5px 16px",
              borderRadius: 20, marginBottom: 32,
            }}>
              Basado en el Diseño Curricular · PBA
            </div>

            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 400,
              color: C.texto, lineHeight: 1.2, marginBottom: 20,
              letterSpacing: "-0.025em",
            }}>
              Lo que tardabas una tarde, ahora son{" "}
              <span style={{ color: C.acento, fontStyle: "italic" }}>diez minutos.</span>
            </h1>

            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, maxWidth: 400 }}>
              El Diseño, convertido en recursos listos para el aula.
            </p>
          </div>

          {/* Derecha — demo interactiva */}
          <DemoInteractiva />
        </div>
      </section>

      {/* ── SEPARADOR ── */}
      <div style={{ borderTop: `0.5px solid ${C.border}` }} />

      {/* ── PARA QUIÉN ── */}
      <section style={{ width: "100%", padding: "72px 0 80px", background: C.white }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <p style={{
            textAlign: "center", fontSize: 11, fontWeight: 500,
            color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10,
          }}>
            ¿Para quién es?
          </p>
          <h2 style={{
            fontFamily: "Georgia, serif",
            textAlign: "center", fontSize: 26, fontWeight: 400,
            color: C.texto, marginBottom: 52, letterSpacing: "-0.015em",
          }}>
            Para toda la comunidad educativa
          </h2>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16, maxWidth: 760, margin: "0 auto",
          }}>
            {[
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke={C.acento} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                nombre: "Docentes",
                desc: "Generás recursos alineados al Diseño sin perder horas buscando o adaptando materiales.",
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke={C.acento} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                nombre: "Familias",
                desc: "Acompañás a tus hijos con explicaciones claras y actividades del grado, sin necesitar ser docente.",
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke={C.acento} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
                nombre: "Estudiantes",
                desc: "Repasás cualquier tema con ejemplos concretos y ejercicios pensados para tu año.",
              },
            ].map((item) => (
              <div key={item.nombre} style={{
                background: C.fondo, border: `0.5px solid ${C.border}`,
                borderRadius: 12, padding: "28px 24px",
              }}>
                <div style={{
                  width: 40, height: 40, background: C.pillBg,
                  borderRadius: 8, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: 16,
                }}>
                  {item.icon}
                </div>
                <p style={{ fontSize: 15, fontWeight: 500, color: C.texto, marginBottom: 8 }}>{item.nombre}</p>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.btn, padding: "12px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: C.muted }}>
          Basado en el{" "}
          <span style={{ color: C.acento, fontWeight: 500 }}>Diseño Curricular PBA</span>
          {" "}· DGCyE 2018 · Resolución N° 1482/17
        </p>
      </footer>

    </div>
  );
}
