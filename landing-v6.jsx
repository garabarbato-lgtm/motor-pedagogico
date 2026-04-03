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

// ── STEP 0: BUSCADOR ANIMADO ──────────────────────────────────────────────────

function StepSearch({ typedText, searchFocused }) {
  const isTyping = typedText.length > 0;

  return (
    <div style={{ padding: "20px 18px", background: "#F0F4F2" }}>
      {/* Input */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        borderRadius: 12,
        border: `1.5px solid ${searchFocused ? "#00c48c" : "#D4E6DE"}`,
        boxShadow: searchFocused ? "0 0 0 3px rgba(0,196,140,0.12)" : "none",
        padding: "14px 18px",
        background: "#fff",
        fontFamily: "'Lexend', sans-serif",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}>
        <LupaIcon active={searchFocused} />
        <span style={{
          fontSize: 14, flex: 1, minHeight: 20,
          color: isTyping ? "#004733" : "#A0BDB5",
          fontFamily: "'Lexend', sans-serif",
          letterSpacing: "-0.01em",
        }}>
          {isTyping ? typedText : "Ej: fracciones 5to, sistema digestivo..."}
          {searchFocused && isTyping && (
            <span style={{
              display: "inline-block", width: 1.5, height: 14,
              background: "#004733", marginLeft: 1, verticalAlign: "middle", opacity: 1,
            }} />
          )}
        </span>
      </div>

      {/* Chips — ocultos al escribir */}
      {!isTyping && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {["Fracciones 4°", "Multiplicación 3°", "Sistema digestivo 6°"].map(chip => (
            <span key={chip} style={{
              border: "1px solid #00c48c",
              borderRadius: 99,
              color: "#004733",
              background: "transparent",
              fontSize: 12,
              padding: "6px 14px",
              fontFamily: "'Lexend', sans-serif",
              cursor: "pointer",
            }}>{chip}</span>
          ))}
        </div>
      )}

      {/* Pie */}
      {!isTyping && (
        <p style={{
          textAlign: "center", fontSize: 12, color: "#6B8C7D",
          marginTop: 12, marginBottom: 0, fontFamily: "'Lexend', sans-serif",
        }}>
          O explorá por grado y área →
        </p>
      )}
    </div>
  );
}

// ── STEP 1: RESULTADOS CON DROPDOWN + CURSOR ──────────────────────────────────

function StepResults() {
  const [phase, setPhase] = useState(0);
  // phase 0: resultados visibles
  // phase 1: cursor aparece y se mueve al primer resultado
  // phase 2: cursor hace click — primer resultado seleccionado

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const results = [
    { name: "Fracciones equivalentes", meta: "Matemática · 5° · Números Racionales" },
    { name: "Fracciones: partes del entero", meta: "Matemática · 5° · Números Racionales" },
    { name: "Fracciones propias e impropias", meta: "Matemática · 6° · Números Racionales" },
  ];

  return (
    <div style={{ padding: "20px 18px", background: "#F0F4F2", position: "relative" }}>
      {/* Barra de búsqueda — estado activo */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        borderRadius: 12, border: "1.5px solid #00c48c",
        boxShadow: "0 0 0 3px rgba(0,196,140,0.12)",
        padding: "14px 18px", background: "#fff",
      }}>
        <LupaIcon active={true} />
        <span style={{ fontSize: 14, color: "#004733", flex: 1, fontFamily: "'Lexend', sans-serif" }}>
          {QUERY}
          <span style={{
            display: "inline-block", width: 1.5, height: 14,
            background: "#004733", marginLeft: 1, verticalAlign: "middle",
          }} />
        </span>
      </div>

      {/* Dropdown */}
      <div style={{
        background: "#fff", borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,71,51,0.08)",
        marginTop: 6,
      }}>
        {results.map((r, i) => (
          <div key={i} style={{
            padding: "12px 16px",
            background: i === 2 ? "#E6FAF3" : "#fff",
            boxShadow: (i === 0 && phase >= 2) ? "inset 0 0 0 2px #004733" : "none",
            borderRadius: i === 0 ? "12px 12px 0 0" : i === results.length - 1 ? "0 0 12px 12px" : "0",
            borderBottom: i < results.length - 1 ? "0.5px solid #EBF2EE" : "none",
            transition: "box-shadow 0.15s",
          }}>
            <div style={{ fontSize: 11, color: "#6B8C7D", fontFamily: "'Lexend', sans-serif", marginBottom: 3 }}>
              {r.meta}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#004733", fontFamily: "'Lexend', sans-serif" }}>
              {r.name}
            </div>
          </div>
        ))}
      </div>

      {/* Cursor SVG animado */}
      <div style={{
        position: "absolute",
        top: phase >= 1 ? 118 : 72,
        left: phase >= 1 ? 30 : 170,
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 2 ? "scale(0.85)" : "scale(1)",
        transformOrigin: "4px 2px",
        transition: "top 0.5s cubic-bezier(0.22,0.61,0.36,1), left 0.5s cubic-bezier(0.22,0.61,0.36,1), opacity 0.3s, transform 0.1s",
        pointerEvents: "none",
        zIndex: 10,
      }}>
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <path d="M1 1L1 15L5 11L8 18L10 17L7 10L13 10Z" fill="#004733" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

// ── STEP 2: CONFIRMACIÓN ──────────────────────────────────────────────────────

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

// ── STEP 3: FICHA ─────────────────────────────────────────────────────────────

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

// ── ORQUESTADOR ───────────────────────────────────────────────────────────────

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
      }, 90);
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
    <div style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div style={{
        borderRadius: 20, border: "1.5px solid #D4E6DE",
        overflow: "hidden", background: "#F0F4F2",
        boxShadow: "0 12px 48px rgba(0,30,20,0.12)",
      }}>
        {/* Barra superior */}
        <div style={{
          background: "#004733", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            {["#ff5f56","#ffbd2e","#27c93f"].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.7 }} />
            ))}
          </div>
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 6,
            padding: "4px 10px", textAlign: "center",
          }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}>
              fichastiza.vercel.app
            </span>
          </div>
        </div>
        {/* Contenido animado */}
        <div style={fade}>
          {step === 0 && <StepSearch typedText={typedText} searchFocused={searchFocused} />}
          {step === 1 && <StepResults />}
          {step === 2 && <StepConfirm />}
          {step === 3 && <StepFicha />}
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#6B8C7D", marginTop: 14, marginBottom: 0 }}>
        Tarda unos segundos · Alineada al Diseño Curricular PBA
      </p>
    </div>
  );
}

// ── LANDING ──────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div style={{
      fontFamily: "'Lexend', sans-serif", width: "100%",
      background: C.fondo, minHeight: "100vh",
      display: "flex", flexDirection: "column",
    }}>

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 24px", borderBottom: `0.5px solid ${C.border}`,
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
      <section style={{ width: "100%", flex: 1, padding: "80px 0 88px", background: C.fondo }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 48px",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 80, alignItems: "center",
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
              fontSize: "clamp(28px, 3.2vw, 46px)", fontWeight: 400,
              color: C.texto, lineHeight: 1.15, marginBottom: 24,
              letterSpacing: "-0.025em",
            }}>
              Lo que tardabas una tarde, ahora son{" "}
              <span style={{ color: C.acento, fontStyle: "italic" }}>diez minutos.</span>
            </h1>

            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65 }}>
              El Diseño Curricular, convertido en recursos listos para el aula.
            </p>
          </div>

          {/* Derecha — demo interactiva */}
          <DemoInteractiva />
        </div>
      </section>

      {/* ── FOOTER — cierre absoluto ── */}
      <footer style={{
        width: "100%", background: "#004733",
        padding: "14px 24px", textAlign: "center",
        marginTop: 0, marginBottom: 0,
      }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0, padding: 0 }}>
          Basado en el{" "}
          <span style={{ color: C.acento, fontWeight: 500 }}>Diseño Curricular PBA</span>
          {" "}· DGCyE 2018 · Resolución N° 1482/17
        </p>
      </footer>

    </div>
  );
}
