import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Logo from "./Logo.jsx";
import SloganSlider from "./SloganSlider.jsx";
import { Search, Settings2, FileText, Sparkles, ChevronDown, MessageSquare } from "lucide-react";

const DC_URL = "http://servicios.abc.gov.ar/lainstitucion/organismos/consejogeneral/disenioscurriculares/primaria/2018/dis-curricular-PBA-completo.pdf";

const C = {
  fondo: "#F0F4F2",
  acento: "#00c48c",
  texto: "#2B2B2B",
  muted: "#4a6b60",
  btn: "#004733",
  white: "#ffffff",
  border: "#D9D9D9",
  lbg: "#E6FAF3",
  lborder: "#D4E6DE",
  app: "#F0F4F2",
  faded: "#6B8C7D",
};

/* ── TIZA SPAN ── */

function TizaSpan({ size = "inherit", color = "#004733" }) {
  return (
    <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: size, letterSpacing: "-0.02em" }}>
      <span style={{ color }}>t</span>
      <span style={{ color: C.acento }}>i</span>
      <span style={{ color }}>z</span>
      <span style={{ color: C.acento }}>a</span>
      <span style={{ color }}>.</span>
    </span>
  );
}

/* ── STATIC DEMO CARD ── */

function DemoBar({ w = "100%", dark = false }) {
  return (
    <div style={{ height: 5, background: dark ? "#b2dfd0" : C.lborder, borderRadius: 3, width: w, marginBottom: 3 }} />
  );
}

function LandingDemoCard() {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid " + C.lborder, boxShadow: "0 20px 48px rgba(0,40,30,0.14)", fontFamily: "'Lexend', sans-serif" }}>
      <div style={{ background: C.btn, padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {["5° grado", "Matemática", "Núm. Racionales"].map(t => (
            <span key={t} style={{ fontSize: 8, fontWeight: 700, background: "rgba(0,196,140,0.22)", color: C.acento, borderRadius: 4, padding: "2px 6px" }}>{t}</span>
          ))}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Fracciones <span style={{ color: C.acento }}>equivalentes</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8, marginTop: 10 }}>
          {["Nombre y apellido", "Fecha"].map(l => (
            <div key={l}>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{l}</div>
              <div style={{ borderBottom: "1.5px solid rgba(255,255,255,0.22)", height: 16 }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 18px", background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.btn, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: C.btn, color: "#fff", fontSize: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>1</span>
            Leemos juntos
          </div>
          <div style={{ background: C.lbg, borderLeft: "2.5px solid " + C.btn, borderRadius: "0 5px 5px 0", padding: "6px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
            <DemoBar w="92%" dark /><DemoBar w="80%" dark /><DemoBar w="62%" dark />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.btn, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: C.btn, color: "#fff", fontSize: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>2</span>
            Tu turno
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div><DemoBar w="88%" /><div style={{ height: 22, border: "1px solid " + C.lborder, borderRadius: 5 }} /></div>
            <div><DemoBar w="70%" /><div style={{ height: 22, border: "1px solid " + C.lborder, borderRadius: 5 }} /></div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid " + C.lborder, padding: "6px 18px", display: "flex", justifyContent: "space-between", background: C.app }}>
        <span style={{ fontSize: 8, color: C.faded }}>tiza. · DC PBA 2018</span>
        <span style={{ fontSize: 8, color: C.faded }}>5° · Matemática</span>
      </div>
    </div>
  );
}

/* ── HOW IT WORKS ── */

function HowItWorks({ onEmpezar }) {
  const steps = [
    { icon: <Search size={24} />, title: "1. Precisar contenido", desc: "Seleccioná grado, área y bloque. El motor te sugiere contenidos exactos del DC PBA." },
    { icon: <Settings2 size={24} />, title: "2. Personalizar", desc: "¿Explicación teórica? ¿Ejemplos concretos? Vos decidís qué elementos pedagógicos incluir." },
    { icon: <FileText size={24} />, title: "3. Recurso listo", desc: "Obtené una ficha PDF profesional, lista para imprimir y llevar directamente al aula." },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: "#f0fdf9", borderRadius: 16, border: "1px solid #b0e8d4", display: "flex", alignItems: "center", justifyContent: "center", color: C.btn, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,71,51,0.06)" }}>
              {step.icon}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.texto, marginBottom: 12 }}>{step.title}</h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, maxWidth: 260 }}>{step.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 64, textAlign: "center" }}>
        <button
          onClick={onEmpezar}
          style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 40px", borderRadius: 16, background: C.acento, color: C.btn, fontSize: 18, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(0,196,140,0.3)", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#00d498"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.acento; e.currentTarget.style.transform = "none"; }}
        >
          <span>Crear mi primera ficha</span>
          <Sparkles size={22} />
        </button>
        <p style={{ marginTop: 16, fontSize: 11, color: C.faded, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
          Sin registros · Alineado al Diseño Curricular
        </p>
      </div>
    </div>
  );
}

/* ── ABOUT TIZA ── */

function AboutTiza() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 40px", textAlign: "center" }}>
      <div style={{ marginBottom: 48 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: C.acento, background: "#e0faf2", padding: "6px 16px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Nuestra Esencia
        </span>
        <h2 style={{ fontFamily: "'Lexend', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: C.btn, marginTop: 24 }}>
          ¿Qué es <TizaSpan size="0.95em" />?
        </h2>
      </div>
      <div style={{ color: C.muted, fontSize: 17, lineHeight: 1.8, textAlign: "left" }}>
        <p style={{ marginBottom: 24 }}>
          <TizaSpan /> es una herramienta pensada para docentes de primaria de la Provincia de Buenos Aires que quieren preparar fichas de trabajo sin perder horas en el proceso.
        </p>
        <p style={{ marginBottom: 24 }}>
          Funciona simple: elegís el grado, el área y el contenido que vas a dar, y la app genera una ficha lista para imprimir, alineada al <span style={{ fontStyle: "italic", color: C.acento, fontWeight: 600 }}>Diseño Curricular de PBA</span>.
        </p>
        <p style={{ background: "#f0fdf9", padding: "24px", borderRadius: 16, borderLeft: `4px solid ${C.acento}`, marginBottom: 24 }}>
          No hace falta registrarse. No hace falta saber de tecnología. En menos de un minuto tenés un recurso listo para el aula.
        </p>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: C.btn, marginBottom: 14 }}>¿Por qué existe?</h3>
          <p>
            Porque preparar materiales de calidad lleva tiempo que los docentes no siempre tienen. <TizaSpan /> no reemplaza tu criterio pedagógico — te da un punto de partida sólido que podés ajustar antes de imprimir.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── LANDING ── */

export default function Landing({ onEmpezar }) {
  const scrollIndicatorRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef = useRef(null);
  const heroDemoRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById("landing-scroll");
    if (!container) return;
    const onScroll = () => {
      if (scrollIndicatorRef.current) {
        const opacity = Math.max(0, 0.5 - container.scrollTop / 200);
        scrollIndicatorRef.current.style.opacity = opacity;
      }
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = [heroBadgeRef, heroTitleRef, heroSubRef, heroBtnRef, heroDemoRef].map(r => r.current).filter(Boolean);
    gsap.from(targets, { opacity: 0, y: 20, duration: 0.8, ease: "power3.out", stagger: 0.1 });
  }, []);

  return (
    <div id="landing-scroll" style={{ fontFamily: "'Lexend', sans-serif", width: "100%", height: "100vh", overflowY: "auto", background: C.fondo, scrollBehavior: "smooth" }}>

      {/* ── NAV ── */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", background: C.btn, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <div onClick={() => document.getElementById("landing-scroll")?.scrollTo({ top: 0, behavior: "smooth" })} style={{ cursor: "pointer" }}>
          <Logo size={28} color="#ffffff" />
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span
            onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}
          >¿Cómo funciona?</span>
          <button
            onClick={onEmpezar}
            style={{ fontSize: 13, fontWeight: 700, padding: "9px 22px", borderRadius: 9, border: "none", background: C.acento, color: C.btn, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00d498"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.acento; e.currentTarget.style.transform = "scale(1)"; }}
          >
            Generar recurso ✦
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "calc(100vh - 62px)", display: "flex", alignItems: "center", background: "#ffffff", position: "relative", padding: "80px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <div>
            <div ref={heroBadgeRef} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.lbg, border: "1px solid #b0e8d4", borderRadius: 99, padding: "5px 14px", marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.acento }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.btn, letterSpacing: "0.07em", textTransform: "uppercase" }}>Diseño Curricular PBA · Primaria</span>
            </div>

            <h1 ref={heroTitleRef} style={{ fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: 400, color: C.texto, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.025em" }}>
              Lo que tardabas una tarde, ahora son{" "}
              <em style={{ color: C.acento, fontStyle: "italic" }}>diez minutos.</em>
            </h1>

            <p ref={heroSubRef} style={{ fontSize: 18, color: C.muted, lineHeight: 1.65, marginBottom: 36, maxWidth: 430 }}>
              Generá fichas pedagógicas alineadas al DC PBA. Sin registrarte. Listo para imprimir.
            </p>

            <div ref={heroBtnRef} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
              <button
                onClick={onEmpezar}
                style={{ fontSize: 17, fontWeight: 700, padding: "16px 36px", borderRadius: 10, border: "none", background: C.btn, color: "#fff", cursor: "pointer", boxShadow: "0 8px 24px rgba(0,71,51,0.22)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#00603d"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.btn; e.currentTarget.style.transform = "none"; }}
              >
                Generar mi primer recurso
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {["Sin registro", "Alineado al DC", "PDF listo"].map(t => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.faded }}>
                    <span style={{ color: C.acento, fontWeight: 800 }}>✓</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div ref={heroDemoRef} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 340 }}>
              <LandingDemoCard />
              <p style={{ textAlign: "center", fontSize: 11, color: C.faded, marginTop: 12 }}>~15 segundos · Alineada al DC PBA 2018</p>
            </div>
          </div>
        </div>

        <div ref={scrollIndicatorRef} style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", textAlign: "center", color: C.btn, opacity: 0.5, transition: "opacity 0.2s", pointerEvents: "none" }}>
          <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", marginBottom: 6, letterSpacing: "0.12em" }}>¿Cómo funciona?</p>
          <ChevronDown size={22} style={{ margin: "0 auto" }} />
        </div>
      </section>

      {/* ── STRIP 01/02/03 ── */}
      <section style={{ background: C.app, borderTop: "1px solid " + C.lborder, padding: "20px 64px" }}>
        <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto" }}>
          {[
            { n: "01", t: "Elegís el contenido",   s: "Grado, área y bloque del DC PBA" },
            { n: "02", t: "Personalizás opciones", s: "Momento, nivel y contexto del grupo" },
            { n: "03", t: "Descargás la ficha",    s: "PDF profesional listo para el aula" },
          ].map((step, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 14, paddingRight: i < 2 ? 32 : 0, paddingLeft: i > 0 ? 32 : 0, borderRight: i < 2 ? "1px solid " + C.lborder : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.btn, color: C.acento, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{step.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.btn, marginBottom: 2 }}>{step.t}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{step.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ¿CÓMO FUNCIONA? ── */}
      <section id="como-funciona" style={{ padding: "100px 0", background: "#ffffff", borderTop: "1px solid " + C.app }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.acento, background: "#e0faf2", padding: "6px 16px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Simple y Pedagógico
          </span>
          <h2 style={{ fontFamily: "'Lexend', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: C.texto, marginTop: 20, fontStyle: "italic" }}>
            ¿Cómo funciona?
          </h2>
        </div>
        <HowItWorks onEmpezar={onEmpezar} />
      </section>

      {/* ── ¿QUÉ ES TIZA? ── */}
      <section style={{ background: "#ffffff", borderTop: "1px solid " + C.app }}>
        <AboutTiza />
      </section>

      {/* ── COBERTURA ── */}
      <section style={{ padding: "100px 0", background: C.fondo }}>
        <SloganSlider />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.btn, padding: "20px 20px", textAlign: "center" }}>
        <div style={{ marginBottom: 20 }}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdf7onmbIprlcs3jg9-7ZleYS9PFkD4VIYjSJlkv3ykdZM5nQ/viewform"
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 28px", borderRadius: 99, background: C.acento, color: C.btn, fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 15px rgba(0,196,140,0.3)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00d498"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.acento; e.currentTarget.style.transform = "none"; }}
          >
            <MessageSquare size={18} />
            Ayudá a que tiza. sea mejor: dejanos tu opinión
          </a>
        </div>
      </footer>
    </div>
  );
}
