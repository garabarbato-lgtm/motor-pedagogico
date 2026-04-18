import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Logo from "./Logo.jsx";

const DC_URL = "http://servicios.abc.gov.ar/lainstitucion/organismos/consejogeneral/disenioscurriculares/primaria/2018/dis-curricular-PBA-completo.pdf";

const C = {
  fondo: "#F5F5F5",
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

/* ── STATIC DEMO CARD ── */

function DemoBar({ w = "100%", dark = false }) {
  return (
    <div style={{
      height: 5, background: dark ? "#b2dfd0" : C.lborder,
      borderRadius: 3, width: w, marginBottom: 3,
    }} />
  );
}

function LandingDemoCard() {
  return (
    <div style={{
      borderRadius: 16, overflow: "hidden",
      border: "1px solid " + C.lborder,
      boxShadow: "0 20px 48px rgba(0,40,30,0.14)",
      fontFamily: "'Lexend', sans-serif",
    }}>
      {/* Header */}
      <div style={{ background: C.btn, padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {["5° grado", "Matemática", "Núm. Racionales"].map(t => (
            <span key={t} style={{
              fontSize: 8, fontWeight: 700,
              background: "rgba(0,196,140,0.22)", color: C.acento,
              borderRadius: 4, padding: "2px 6px",
            }}>{t}</span>
          ))}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
          Fracciones <span style={{ color: C.acento }}>equivalentes</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8, marginTop: 10 }}>
          {["Nombre y apellido", "Fecha"].map(l => (
            <div key={l}>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{l}</div>
              <div style={{ borderBottom: "1.5px solid rgba(255,255,255,0.22)", height: 16 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 18px", background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Leemos juntos */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.btn, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: C.btn, color: "#fff", fontSize: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>1</span>
            Leemos juntos
          </div>
          <div style={{ background: C.lbg, borderLeft: "2.5px solid " + C.btn, borderRadius: "0 5px 5px 0", padding: "6px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
            <DemoBar w="92%" dark />
            <DemoBar w="80%" dark />
            <DemoBar w="62%" dark />
          </div>
        </div>

        {/* Tu turno */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.btn, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: C.btn, color: "#fff", fontSize: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>2</span>
            Tu turno
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div>
              <DemoBar w="88%" />
              <div style={{ height: 22, border: "1px solid " + C.lborder, borderRadius: 5 }} />
            </div>
            <div>
              <DemoBar w="70%" />
              <div style={{ height: 22, border: "1px solid " + C.lborder, borderRadius: 5 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid " + C.lborder, padding: "6px 18px",
        display: "flex", justifyContent: "space-between", background: C.app,
      }}>
        <span style={{ fontSize: 8, color: C.faded }}>tiza. · DC PBA 2018</span>
        <span style={{ fontSize: 8, color: C.faded }}>5° · Matemática</span>
      </div>
    </div>
  );
}

/* ── LANDING ── */

export default function Landing({ onEmpezar }) {
  const [scrolled, setScrolled] = useState(false);

  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef = useRef(null);
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
    <div style={{ fontFamily: "'Lexend', sans-serif", width: "100%", background: C.fondo, minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 44px", height: 62,
        background: scrolled ? "rgba(0,71,51,0.95)" : C.btn,
        backdropFilter: scrolled ? "blur(8px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.12)" : "none",
        position: "sticky", top: 0, zIndex: 10,
        transition: "background 0.3s, box-shadow 0.3s",
      }}>
        <Logo size={28} color="#ffffff" />
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
            ¿Cómo funciona?
          </span>
          <button
            onClick={onEmpezar}
            style={{
              fontSize: 13, fontWeight: 700, padding: "9px 22px",
              borderRadius: 9, border: "none",
              background: C.acento, color: C.btn, cursor: "pointer",
            }}>
            Generar recurso ✦
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: "#ffffff", padding: "64px 64px 80px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 64, alignItems: "center",
          maxWidth: 1100, margin: "0 auto",
        }}>
          {/* Left column */}
          <div>
            <div ref={heroBadgeRef} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: C.lbg, border: "1px solid #b0e8d4",
              borderRadius: 99, padding: "5px 14px", marginBottom: 28,
              opacity: 1,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.acento }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.btn, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                Diseño Curricular PBA · Primaria
              </span>
            </div>

            <h1 ref={heroTitleRef} style={{
              fontFamily: "'Lexend', sans-serif",
              fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 400,
              color: C.texto, lineHeight: 1.1, marginBottom: 20,
              letterSpacing: "-0.025em", opacity: 1,
            }}>
              Lo que tardabas una tarde, ahora son{" "}
              <em style={{ color: C.acento, fontStyle: "italic" }}>diez minutos.</em>
            </h1>

            <p ref={heroSubRef} style={{ fontSize: 18, color: C.muted, lineHeight: 1.65, marginBottom: 36, maxWidth: 430, opacity: 1 }}>
              Generá fichas pedagógicas alineadas al DC PBA. Sin registrarte. Listo para imprimir.
            </p>

            <div ref={heroBtnRef} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, opacity: 1 }}>
              <button
                onClick={onEmpezar}
                style={{
                  fontSize: 17, fontWeight: 700, padding: "16px 36px",
                  borderRadius: 10, border: "none",
                  background: C.btn, color: "#ffffff", cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(0,71,51,0.22)",
                  transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#00603d"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,71,51,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.btn; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,71,51,0.22)"; }}>
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

          {/* Right column: static demo card */}
          <div ref={heroDemoRef} style={{ display: "flex", justifyContent: "center", opacity: 1 }}>
            <div style={{ width: 340 }}>
              <LandingDemoCard />
              <p style={{ textAlign: "center", fontSize: 11, color: C.faded, marginTop: 12 }}>
                ~15 segundos · Alineada al DC PBA 2018
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS STRIP ── */}
      <section style={{
        background: C.app, borderTop: "1px solid " + C.lborder,
        padding: "20px 64px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto" }}>
          {[
            { n: "01", t: "Elegís el contenido",   s: "Grado, área y bloque del DC PBA" },
            { n: "02", t: "Personalizás opciones", s: "Momento, nivel y contexto del grupo" },
            { n: "03", t: "Descargás la ficha",    s: "PDF profesional listo para el aula" },
          ].map((step, i) => (
            <div key={i} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 14,
              paddingRight: i < 2 ? 32 : 0, paddingLeft: i > 0 ? 32 : 0,
              borderRight: i < 2 ? "1px solid " + C.lborder : "none",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: C.btn, color: C.acento,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, flexShrink: 0,
              }}>{step.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.btn, marginBottom: 2 }}>{step.t}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{step.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.btn, padding: "10px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
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
