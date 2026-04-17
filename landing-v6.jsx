import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "./src/components/Logo.jsx";
import SloganSlider from "./src/components/SloganSlider.jsx";
import { Search, Settings2, FileText, Sparkles, ChevronDown, MessageSquare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const DC_URL = "http://servicios.abc.gov.ar/lainstitucion/organismos/consejogeneral/disenioscurriculares/primaria/2018/dis-curricular-PBA-completo.pdf";

const C = {
  fondo: "#F0F4F2",
  acento: "#00c48c",
  texto: "#2B2B2B",
  muted: "#4a6b60",
  btn: "#004733",
  white: "#ffffff",
  border: "#D9D9D9",
};

/* ── COMPONENTES INTERNOS ── */

function HowItWorks({ onEmpezar }) {
  const steps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "1. Precisar contenido",
      desc: "Seleccioná grado, área y bloque. El motor te sugiere contenidos exactos del DC PBA."
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

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-[#f0fdf9] rounded-2xl border border-[#b0e8d4] flex items-center justify-center text-[#004733] mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm">
              {step.icon}
            </div>
            <h3 className="text-lg font-bold text-[#2B2B2B] mb-3">{step.title}</h3>
            <p className="text-sm text-[#4a6b60] leading-relaxed max-w-[240px]">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-20 text-center">
        <button 
          onClick={onEmpezar} 
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#00c48c] text-[#004733] rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:bg-[#00d498] transition-all duration-300 active:scale-95"
          style={{ cursor: "pointer" }}
        >
          <span>Crear mi primera ficha</span>
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
        <p className="mt-6 text-[10px] text-[#6B8C7D] font-bold uppercase tracking-[0.2em]">
          Sin registros · Alineado al Diseño Curricular
        </p>
      </div>
    </div>
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
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        borderRadius: 12,
        border: `1.5px solid ${searchFocused ? "#00c48c" : "#D4E6DE"}`,
        boxShadow: searchFocused ? "0 0 0 3px rgba(0,196,140,0.12)" : "none",
        padding: "14px 18px", background: "#fff",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}>
        <LupaIcon active={searchFocused} />
        <span style={{ fontSize: 14, flex: 1, minHeight: 20, color: isTyping ? "#004733" : "#A0BDB5" }}>
          {isTyping ? typedText : "Ej: fracciones 5to..."}
        </span>
      </div>
    </div>
  );
}

function StepResults() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const results = [
    { name: "Fracciones equivalentes",      meta: "Matemática · 5°" },
    { name: "Fracciones: partes del entero", meta: "Matemática · 5°" },
  ];
  return (
    <div style={{ padding: "20px 18px", background: "#F0F4F2", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 12, border: "1.5px solid #00c48c", padding: "14px 18px", background: "#fff" }}>
        <LupaIcon active={true} />
        <span style={{ fontSize: 14, color: "#004733" }}>{QUERY}</span>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, marginTop: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        {results.map((r, i) => (
          <div key={i} style={{ padding: "12px 16px", background: i === 0 && phase >= 2 ? "#E6FAF3" : "#fff", borderBottom: i === 0 ? "1.5px solid #F0F4F2" : "none", borderRadius: i === 0 ? "12px 12px 0 0" : "0 0 12px 12px" }}>
            <div style={{ fontSize: 10, color: "#6B8C7D" }}>{r.meta}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#004733" }}>{r.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepConfirm() {
  return (
    <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ background: "#fff", border: "1px solid #D4E6DE", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#00c48c", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 10 }}>✓</span>
        </div>
        <span style={{ fontSize: 11, color: "#004733", fontWeight: 600 }}>Fracciones equivalentes · 5°</span>
      </div>
      <div style={{ background: "#004733", color: "#fff", borderRadius: 10, padding: "12px", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
        Generar ficha ✦
      </div>
    </div>
  );
}

function StepFicha() {
  return (
    <div style={{ background: "#fff" }}>
      <div style={{ background: "#004733", padding: "12px 16px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Fracciones equivalentes</div>
        <div style={{ fontSize: 9, color: "#00c48c", fontWeight: 700 }}>MATEMÁTICA · 5° GRADO</div>
      </div>
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {[1, 2, 3].map(i => <div key={i} style={{ height: 6, background: "#F0F4F2", borderRadius: 3, width: `${100 - i * 15}%` }} />)}
        <div style={{ height: 40, border: "1.5px solid #F0F4F2", borderRadius: 8, marginTop: 4 }} />
      </div>
    </div>
  );
}

function DemoInteractiva() {
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);
  const [typedText, setTypedText] = useState("");
  useEffect(() => {
    if (step !== 0) { setTypedText(""); return; }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(QUERY.slice(0, i));
      if (i >= QUERY.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [step]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setStep(s => (s + 1) % 4);
        setFading(false);
      }, FADE_OUT);
    }, STEP_DURATIONS[step]);
    return () => clearTimeout(timer);
  }, [step]);
  return (
    <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #D4E6DE", boxShadow: "0 20px 40px rgba(0,40,30,0.1)", background: "#fff", opacity: fading ? 0.6 : 1, transition: "opacity 0.3s" }}>
      <div style={{ background: "#004733", padding: "10px", textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.5)" }}>fichastiza.app</div>
      {step === 0 && <StepSearch typedText={typedText} searchFocused={true} />}
      {step === 1 && <StepResults />}
      {step === 2 && <StepConfirm />}
      {step === 3 && <StepFicha />}
    </div>
  );
}

/* ── LANDING ── */

export default function Landing({ onEmpezar }) {
  const [scrolled, setScrolled] = useState(false);

  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef  = useRef(null);
  const heroDemoRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;
    const onScroll = () => setScrolled(container.scrollTop > 50);
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = [heroBadgeRef, heroTitleRef, heroSubRef, heroBtnRef, heroDemoRef].map(r => r.current).filter(Boolean);
    gsap.from(targets, { opacity: 0, y: 20, duration: 0.8, ease: "power3.out", stagger: 0.1 });
  }, []);

  return (
    <div id="scroll-container" style={{ 
      fontFamily: "'Lexend', sans-serif", 
      width: "100%", 
      background: C.fondo, 
      height: "100vh",
      overflowY: "auto",
      scrollBehavior: "smooth"
    }}>

      {/* ── NAV FIXED (SIEMPRE VERDE TIZA) ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
        background: "#004733",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      }}>
        <div 
          onClick={() => {
            const container = document.getElementById("scroll-container");
            if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          title="Ir al inicio"
        >
          <Logo size={32} color="#ffffff" />
        </div>
        <button
          onClick={onEmpezar}
          style={{
            fontSize: 14, fontWeight: 700, padding: "10px 24px",
            borderRadius: 10, border: "none",
            background: C.acento, color: "#004733", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,196,140,0.2)",
            transition: "all 0.2s"
          }}
          className="hover:scale-105 active:scale-95"
        >
          Generar recurso ✦
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        paddingTop: "100px",
        paddingBottom: "100px",
        background: "#ffffff"
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto px-6 w-full">
          <div>
            <div ref={heroBadgeRef} style={{ display: "inline-block", background: "#e0faf2", color: "#004733", fontSize: 11, fontWeight: 800, textTransform: "uppercase", padding: "6px 16px", borderRadius: 20, marginBottom: 24, border: "1px solid #b0e8d4" }}>
              Diseño Curricular PBA
            </div>
            <h1 ref={heroTitleRef} style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, color: C.texto, lineHeight: 1.1, marginBottom: 24 }}>
              Lo que tardabas una tarde, ahora son <span style={{ color: C.acento, fontStyle: "italic" }}>diez minutos.</span>
            </h1>
            <p ref={heroSubRef} style={{ fontSize: 20, color: C.muted, lineHeight: 1.6, marginBottom: 40, maxWidth: 480 }}>
              El motor pedagógico que convierte el DC en recursos listos para el aula.
            </p>
            <div ref={heroBtnRef}>
              <button onClick={onEmpezar} style={{ fontSize: 18, fontWeight: 700, padding: "18px 40px", borderRadius: 14, border: "none", background: "#004733", color: "#fff", cursor: "pointer", boxShadow: "0 10px 25px rgba(0,71,51,0.2)" }} className="hover:translate-y-[-2px] transition-transform">
                Generar recurso ✦
              </button>
            </div>
          </div>
          <div ref={heroDemoRef} className="hidden md:block">
            <DemoInteractiva />
          </div>
        </div>
        
        {/* Flecha Scroll */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", textAlign: "center", color: "#004733", opacity: 0.4 }}>
          <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.1em" }}>¿Cómo funciona?</p>
          <ChevronDown size={24} className="mx-auto" style={{ animation: "bounce 2s infinite" }} />
        </div>
      </section>

      {/* ── ¿CÓMO FUNCIONA? ── */}
      <section style={{ padding: "120px 0", background: "#ffffff", borderTop: "1px solid #F0F4F2" }}>
          <div className="text-center mb-20">
             <span style={{ fontSize: 12, fontWeight: 800, color: C.acento, background: "#e0faf2", padding: "6px 16px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
               Simple y Pedagógico
             </span>
             <h2 className="text-5xl font-light text-[#2B2B2B] mt-6 italic">¿Cómo funciona?</h2>
          </div>
          <HowItWorks onEmpezar={onEmpezar} />
      </section>

      {/* ── COBERTURA ── */}
      <section style={{ padding: "120px 0", background: C.fondo }}>
        <SloganSlider />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.btn, padding: "30px 20px", textAlign: "center" }}>
        {/* Botón Feedback */}
        <div style={{ marginBottom: "24px" }}>
           <a 
             href="https://docs.google.com/forms/d/e/1FAIpQLSdf7onmbIprlcs3jg9-7ZleYS9PFkD4VIYjSJlkv3ykdZM5nQ/viewform"
             target="_blank"
             rel="noopener noreferrer"
             style={{ 
               display: "inline-flex", 
               alignItems: "center", 
               gap: "10px",
               padding: "10px 20px",
               borderRadius: "99px",
               background: "rgba(255,255,255,0.08)",
               color: "#ffffff",
               fontSize: "13px",
               fontWeight: "500",
               textDecoration: "none",
               border: "1px solid rgba(255,255,255,0.15)",
               transition: "all 0.2s",
               cursor: "pointer"
             }}
             onMouseEnter={e => {
               e.currentTarget.style.background = "rgba(255,255,255,0.15)";
               e.currentTarget.style.transform = "translateY(-2px)";
             }}
             onMouseLeave={e => {
               e.currentTarget.style.background = "rgba(255,255,255,0.08)";
               e.currentTarget.style.transform = "translateY(0)";
             }}
           >
             <MessageSquare size={16} className="text-[#00c48c]" />
             ¿Tenés sugerencias? Dejanos tu feedback
           </a>
        </div>

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, fontWeight: 400, letterSpacing: "0.02em" }}>
          Basado en el Diseño Curricular PBA
        </p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
