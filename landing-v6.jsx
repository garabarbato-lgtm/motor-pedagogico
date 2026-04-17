import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "./src/components/Logo.jsx";
import SloganSlider from "./src/components/SloganSlider.jsx";
import { Search, Settings2, FileText, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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

/* ── COMPONENTES INTERNOS ── */

function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "1. Precisar contenido",
      desc: "Seleccioná grado, área y bloque. El motor te sugiere contenidos exactos del DC PBA 2018."
    },
    {
      icon: <Settings2 className="w-6 h-6" />,
      title: "2. Personalizar",
      desc: "¿Explicación teórica? ¿Ejemplos concretos? Vos decidís qué elementos pedagógicos incluir."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "3. Recurso listo",
      desc: "Obtené una ficha PDF profesional, lista para imprimir y llevar directamente al aula."
    }
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".step-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white border-y border-[#D9D9D9]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-[#2B2B2B] mb-4">
            De la planificación al aula en <span className="text-[#00c48c] italic">tres pasos.</span>
          </h2>
          <p className="text-[#4a6b60] max-w-xl mx-auto">
            Diseñado para integrarse a tu flujo de trabajo docente, sin complicaciones técnicas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="step-card flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#f0fdf9] rounded-2xl border border-[#b0e8d4] flex items-center justify-center text-[#004733] mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-[#2B2B2B] mb-3">{step.title}</h3>
              <p className="text-sm text-[#4a6b60] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <div style={{ 
      fontFamily: "'Lexend', sans-serif", 
      width: "100%", 
      background: C.fondo, 
      height: "100vh", 
      overflowY: "auto", 
      scrollSnapType: "y mandatory",
      scrollBehavior: "smooth"
    }}>

      {/* ── NAV (Flotante para no interferir con snap) ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 40px",
        background: scrolled ? "rgba(0,71,51,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
        boxShadow: scrolled ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "background 0.3s, box-shadow 0.3s",
      }}>
        <Logo size={32} color={scrolled ? "#ffffff" : "#004733"} />
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {scrolled && (
            <button
              onClick={onEmpezar}
              style={{
                fontSize: 12, fontWeight: 600, padding: "8px 16px",
                borderRadius: 7, border: "none",
                background: C.acento, color: "#004733", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,196,140,0.3)",
              }}>
              Generar recurso ✦
            </button>
          )}
          <button
            onClick={onEmpezar}
            className="min-h-[44px] min-w-[44px]"
            style={{
              fontSize: 13, fontWeight: 500, padding: "8px 20px",
              borderRadius: 7, border: `1.5px solid ${scrolled ? "#ffffff" : C.acento}`,
              background: "transparent", color: scrolled ? "#ffffff" : C.acento, cursor: "pointer"
            }}>
            Entrar
          </button>
        </div>
      </nav>

      {/* ── HERO (Full Screen) ── */}
      <section style={{ 
        background: "#ffffff", 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        scrollSnapAlign: "start",
        position: "relative"
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center max-w-[1280px] mx-auto px-6 md:px-12 w-full">
          {/* Columna izquierda */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
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

            <h1 ref={heroTitleRef}
              className="text-3xl md:text-[42px]"
              style={{
              fontFamily: "'Lexend', sans-serif",
              fontWeight: 400,
              color: C.texto, lineHeight: 1.2, marginBottom: 20,
              letterSpacing: "-0.025em", opacity: 1,
            }}>
              Lo que tardabas una tarde, ahora son{" "}
              <span style={{ color: C.acento, fontStyle: "italic" }}>diez minutos.</span>
            </h1>

            <p ref={heroSubRef} style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, marginBottom: 32, maxWidth: 400, opacity: 1 }}>
              El Diseño Curricular, convertido en recursos listos para el aula.
            </p>

            <div ref={heroBtnRef} className="flex flex-col items-center md:items-start gap-2.5" style={{ opacity: 1 }}>
                <button
                onClick={onEmpezar}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                className="min-h-[44px]"
                style={{
                  fontSize: 15, fontWeight: 600, padding: "14px 28px",
                  borderRadius: 12, border: "none",
                  background: btnHover ? "#00603d" : "#004733",
                  color: "#fff", cursor: "pointer",
                  boxShadow: btnHover ? "0 8px 24px rgba(0,71,51,0.3)" : "0 2px 8px rgba(0,71,51,0.12)",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}>
                Generar recurso ✦
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

        {/* Scroll Indicator */}
        <div style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "bounce 2s infinite",
          color: "#004733",
          opacity: 0.6,
          textAlign: "center"
        }}>
          <p style={{ fontSize: 10, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>¿Cómo funciona?</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
        
        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
            40% { transform: translateY(-10px) translateX(-50%); }
            60% { transform: translateY(-5px) translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── SECCIÓN: CÓMO FUNCIONA ── */}
      <section style={{ height: "100vh", display: "flex", alignItems: "center", scrollSnapAlign: "start", background: "#ffffff" }}>
        <div className="w-full">
          <div className="text-center mb-8">
             <span style={{ 
               fontSize: 12, fontWeight: 700, color: C.acento, 
               background: "#e0faf2", padding: "4px 12px", borderRadius: 20,
               textTransform: "uppercase", letterSpacing: "0.05em"
             }}>
               Flujo de trabajo
             </span>
             <h2 className="text-4xl font-light text-[#2B2B2B] mt-4">¿Cómo funciona?</h2>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* ── SECCIÓN: COBERTURA ── */}
      <section style={{ height: "100vh", display: "flex", alignItems: "center", scrollSnapAlign: "start", background: "#F5F5F5" }}>
        <div className="w-full">
          <SloganSlider />
        </div>
      </section>

      {/* ── FOOTER (Anclado al final de la última sección o como sección extra) ── */}
      <footer style={{ background: C.btn, padding: "14px 48px", textAlign: "center", scrollSnapAlign: "end" }}>
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
