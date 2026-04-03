import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Logo from "./src/components/Logo.jsx";

const DC_URL = "http://servicios.abc.gov.ar/lainstitucion/organismos/consejogeneral/disenioscurriculares/primaria/2018/dis-curricular-PBA-completo.pdf";

const C = {
  fondo: "#F5F5F5",
  acento: "#00c48c",
  texto: "#2B2B2B",
  muted: "#4a6b60",
  btn: "#004733",
  white: "#ffffff",
  border: "#D9D9D9",
};

/* ── DEMO INTERACTIVA ── */

const QUERY = "fracciones 5to";
const STEP_DURATIONS = [2000, 1500, 1500, 3500];
const FADE_OUT = 250;
const FADE_IN = 350;

function LupaIcon({ active }) {
  const col = active ? "#00c48c" : "#6B8C7D";
  return (
    <svg viewBox="0 0 16 16" fill="none" width="16" height="16" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5" stroke={col} strokeWidth="1.5" />
      <path d="M11 11l3 3" stroke={col} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

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
        padding: "14px 18px", background: "#fff",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}>
        <LupaIcon active={searchFocused} />
        <span style={{
          fontSize: 14, flex: 1, minHeight: 20,
          color: isTyping ? "#004733" : "#A0BDB5",
          letterSpacing: "-0.01em",
        }}>
          {isTyping ? typedText : "Ej: fracciones 5to, sistema digestivo..."}
          {searchFocused && isTyping && (
            <span style={{
              display: "inline-block", width: 1.5, height: 14,
              background: "#004733", marginLeft: 1, verticalAlign: "middle",
            }} />
          )}
        </span>
      </div>
      {/* Chips — se ocultan al escribir */}
      {!isTyping && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {["Fracciones 4°", "Multiplicación 3°", "Sistema digestivo 6°"].map(chip => (
            <span key={chip} style={{
              border: "1px solid #00c48c", borderRadius: 99,
              color: "#004733", background: "transparent",
              fontSize: 12, padding: "6px 14px", cursor: "pointer",
            }}>{chip}</span>
          ))}
        </div>
      )}
      {/* Pie */}
      {!isTyping && (
        <p style={{
          textAlign: "center", fontSize: 12, color: "#6B8C7D",
          marginTop: 12, marginBottom: 0,
        }}>
          O explorá por grado y área →
        </p>
      )}
    </div>
  );
}

function StepResults() {
  const [phase, setPhase] = useState(0);
  // 0: dropdown visible · 1: cursor aparece y se mueve · 2: click — resultado seleccionado

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const results = [
    { name: "Fracciones equivalentes",      meta: "Matemática · 5° · Números Racionales" },
    { name: "Fracciones: partes del entero", meta: "Matemática · 5° · Números Racionales" },
    { name: "Fracciones propias e impropias", meta: "Matemática · 6° · Números Racionales" },
  ];

  return (
    <div style={{ padding: "20px 18px", background: "#F0F4F2", position: "relative" }}>
      {/* Barra — estado activo */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        borderRadius: 12, border: "1.5px solid #00c48c",
        boxShadow: "0 0 0 3px rgba(0,196,140,0.12)",
        padding: "14px 18px", background: "#fff",
      }}>
        <LupaIcon active={true} />
        <span style={{ fontSize: 14, color: "#004733", flex: 1 }}>
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
            <div style={{ fontSize: 11, color: "#6B8C7D", marginBottom: 3 }}>{r.meta}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#004733" }}>{r.name}</div>
          </div>
        ))}
      </div>
      {/* Cursor SVG animado */}
      <div style={{
        position: "absolute",
        top: phase >= 1 ? 122 : 74,
        left: phase >= 1 ? 30 : 170,
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 2 ? "scale(0.85)" : "scale(1)",
        transformOrigin: "4px 2px",
        transition: "top 0.5s cubic-bezier(0.22,0.61,0.36,1), left 0.5s cubic-bezier(0.22,0.61,0.36,1), opacity 0.3s, transform 0.1s",
        pointerEvents: "none", zIndex: 10,
      }}>
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <path d="M1 1L1 15L5 11L8 18L10 17L7 10L13 10Z" fill="#004733" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function Toggle() {
  return (
    <div style={{
      width: 36, height: 20, background: "#004733",
      borderRadius: 10, position: "relative", flexShrink: 0,
    }}>
      <div style={{
        width: 16, height: 16, background: "#fff",
        borderRadius: "50%", position: "absolute",
        right: 2, top: 2,
      }} />
    </div>
  );
}

function StepConfirm() {
  return (
    <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Chip de confirmación */}
      <div style={{
        background: "#fff", border: "1px solid #D4E6DE",
        borderRadius: 10, padding: "9px 12px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          background: "#E6FAF3", border: "1.5px solid #00c48c",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ color: "#00c48c", fontSize: 10, fontWeight: 700 }}>✓</span>
        </div>
        <span style={{ fontSize: 11, color: "#004733", flex: 1, fontWeight: 500 }}>
          Fracciones equivalentes · 5° grado
        </span>
        <span style={{
          fontSize: 10, color: "#6B8C7D", background: "#F0F4F2",
          borderRadius: 6, padding: "3px 8px", flexShrink: 0,
        }}>
          Cambiar
        </span>
      </div>

      {/* Toggles */}
      {["Incluir explicación", "Incluir ejemplo concreto"].map((label) => (
        <div key={label} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "9px 12px", background: "#fff",
          border: "1px solid #D4E6DE", borderRadius: 10,
        }}>
          <span style={{ fontSize: 11, color: "#004733" }}>{label}</span>
          <Toggle />
        </div>
      ))}

      {/* Botón generar */}
      <div style={{
        background: "#004733", color: "#fff",
        borderRadius: 10, padding: "11px 16px",
        fontSize: 12, fontWeight: 600,
        width: "100%", textAlign: "center",
        marginTop: 2,
      }}>
        Generar ficha ✦
      </div>
    </div>
  );
}

function GrayLine({ width = "100%" }) {
  return (
    <div style={{
      height: 7, background: "#D4E6DE",
      borderRadius: 4, marginBottom: 4, width,
    }} />
  );
}

function StepFicha() {
  return (
    <div style={{ overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#004733", padding: "10px 14px" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
          {["5° grado", "Matemática", "Núm. racionales"].map(tag => (
            <span key={tag} style={{
              fontSize: 8, fontWeight: 700,
              background: "rgba(0,196,140,0.22)", color: "#00c48c",
              borderRadius: 4, padding: "2px 6px",
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
          Fracciones{" "}
          <span style={{ color: "#00c48c" }}>equivalentes</span>
        </div>
        {/* Datos alumno */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8, marginTop: 8 }}>
          {["Nombre y apellido", "Fecha"].map(label => (
            <div key={label}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ borderBottom: "1.5px solid rgba(255,255,255,0.3)", height: 16 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Cuerpo */}
      <div style={{ padding: "10px 14px", background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Sección 1: Leemos juntos */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#004733", marginBottom: 5 }}>
            1 · Leemos juntos
          </div>
          <div style={{
            background: "#E6FAF3", borderLeft: "3px solid #004733",
            borderRadius: "0 6px 6px 0", padding: "7px 10px",
          }}>
            <GrayLine width="95%" />
            <GrayLine width="82%" />
            <GrayLine width="70%" />
          </div>
        </div>

        {/* Sección 2: Tu turno */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#004733", marginBottom: 5 }}>
            2 · Tu turno
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div>
              <GrayLine width="88%" />
              <div style={{ height: 28, border: "0.5px solid #D4E6DE", borderRadius: 6 }} />
            </div>
            <div>
              <GrayLine width="75%" />
              <div style={{ height: 28, border: "0.5px solid #D4E6DE", borderRadius: 6 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #D4E6DE", padding: "6px 14px",
        display: "flex", justifyContent: "space-between",
        background: "#F0F4F2",
      }}>
        <span style={{ fontSize: 8, color: "#6B8C7D" }}>tiza. · Diseño Curricular 2018</span>
        <span style={{ fontSize: 8, color: "#6B8C7D" }}>5° grado · Matemática</span>
      </div>
    </div>
  );
}

function DemoInteractiva() {
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Typing animation — only on step 0
  useEffect(() => {
    if (step !== 0) {
      setTypedText("");
      setSearchFocused(false);
      return;
    }
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
    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [step]);

  // Step progression loop
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

  const contentTransition = {
    opacity: fading ? 0 : 1,
    transition: `opacity ${fading ? FADE_OUT : FADE_IN}ms ease`,
  };

  return (
    <div>
      <div style={{
        borderRadius: 16,
        border: "0.5px solid #D4E6DE",
        overflow: "hidden",
        background: "#F0F4F2",
        boxShadow: "0 8px 40px rgba(0,30,20,0.10)",
        fontFamily: "'Lexend Deca', 'Lexend', system-ui, sans-serif",
      }}>
        {/* Browser header */}
        <div style={{
          background: "#004733",
          padding: "11px 16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }}>
            fichastiza.vercel.app
          </span>
        </div>

        {/* Animated content */}
        <div style={contentTransition}>
          {step === 0 && <StepSearch typedText={typedText} searchFocused={searchFocused} />}
          {step === 1 && <StepResults />}
          {step === 2 && <StepConfirm />}
          {step === 3 && <StepFicha />}
        </div>
      </div>

      <p style={{
        textAlign: "center", fontSize: 11, color: "#6B8C7D",
        marginTop: 12, marginBottom: 0,
      }}>
        Tarda unos segundos · Alineada al Diseño Curricular PBA
      </p>
    </div>
  );
}

/* ── LANDING ── */

export default function Landing({ onEmpezar }) {
  const [scrolled, setScrolled] = useState(false);

  const [btnHover, setBtnHover] = useState(false);

  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef  = useRef(null);
  const heroDemoRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = [heroBadgeRef, heroTitleRef, heroSubRef, heroBtnRef, heroDemoRef].map(r => r.current).filter(Boolean);
    gsap.from(targets, {
      opacity: 0, y: 20, duration: 0.6,
      ease: "power3.out", stagger: 0.12,
    });
  }, []);

  return (
    <div style={{ fontFamily: "'Lexend', sans-serif", width: "100%", background: C.fondo, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 40px",
        borderBottom: scrolled ? "none" : `0.5px solid ${C.border}`,
        background: scrolled ? "rgba(0,71,51,0.95)" : C.btn,
        backdropFilter: scrolled ? "blur(8px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.12)" : "none",
        position: "sticky", top: 0, zIndex: 10,
        transition: "background 0.3s, box-shadow 0.3s, backdrop-filter 0.3s",
      }}>
        <Logo size={32} color="#ffffff" />
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
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
        background: "#ffffff",
        padding: "40px 0",
        flex: 1,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 80, alignItems: "center",
          maxWidth: 1280, margin: "0 auto", padding: "0 48px",
        }}>
          {/* Columna izquierda */}
          <div>
            <div ref={heroBadgeRef} style={{
              display: "inline-block", background: "#e0faf2", color: "#004733",
              fontSize: 11, fontWeight: 500, letterSpacing: "0.08em",
              textTransform: "uppercase", padding: "5px 16px",
              borderRadius: 20, marginBottom: 32,
              border: "1px solid #b0e8d4",
              opacity: 1,
            }}>
              Basado en el Diseño Curricular · PBA
            </div>

            <h1 ref={heroTitleRef} style={{
              fontFamily: "'Lexend', sans-serif",
              fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 400,
              color: C.texto, lineHeight: 1.2, marginBottom: 20,
              letterSpacing: "-0.025em", opacity: 1,
            }}>
              Lo que tardabas una tarde, ahora son{" "}
              <span style={{ color: C.acento, fontStyle: "italic" }}>diez minutos.</span>
            </h1>

            <p ref={heroSubRef} style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, marginBottom: 32, maxWidth: 400, opacity: 1 }}>
              El Diseño Curricular, convertido en recursos listos para el aula.
            </p>

            <div ref={heroBtnRef} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, opacity: 1 }}>
              <button
                onClick={onEmpezar}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  fontSize: 15, fontWeight: 600, padding: "14px 28px",
                  borderRadius: 12, border: "none",
                  background: btnHover ? "#00603d" : "#004733",
                  color: "#fff", cursor: "pointer",
                  boxShadow: btnHover ? "0 8px 24px rgba(0,71,51,0.3)" : "0 2px 8px rgba(0,71,51,0.12)",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}>
                Generar mi primer recurso
              </button>
              <span style={{ fontSize: 12, color: "#6B8C7D" }}>
                Contenido verificado · Alineado al DC · Listo para el aula
              </span>
            </div>

          </div>

          {/* Columna derecha: demo interactiva */}
          <div ref={heroDemoRef} style={{ opacity: 1 }}>
            <DemoInteractiva />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.btn, padding: "14px 48px", textAlign: "center", marginTop: "auto", marginBottom: 0 }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0 }}>
          Basado en el{" "}
          <a
            href={DC_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.acento, fontWeight: 500 }}
          >
            Diseño Curricular PBA
          </a>
          {" "}· DGCyE 2018 · Resolución N° 1482/17
        </p>
      </footer>

    </div>
  );
}
