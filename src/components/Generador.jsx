import { useState, useMemo, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase.js";
import { gsap } from "gsap";
import { 
  Calculator, 
  BookOpen, 
  Microscope, 
  GlobeHemisphereWest, 
  CheckCircle, 
  CaretRight, 
  ArrowLeft, 
  ArrowRight,
  MagnifyingGlass, 
  X, 
  Sparkle, 
  Check,
  CaretLeft,
  ArrowsClockwise,
  FileText,
  Lightbulb,
  HandsClapping
} from "@phosphor-icons/react";
import curricularData from "../../dc_pba_base_curricular_corregida.json";
import Logo from "./Logo.jsx";
import PaywallModal from "./PaywallModal.jsx";

// ── Paleta ─────────────────────────────────────────────────────────────────
const C = {
  verdeOscuro:     "#004733",
  verdeAcento:     "#00c48c",
  verdeClaroBg:    "#E6FAF3",
  verdeClaroBorder:"#5DCAA5",
  verdeTexto:      "#085041",
  verdeHoverBtn:   "#00603d",
  fondoApp:        "#F0F4F2",
  fondoCard:       "#ffffff",
  bordeSuave:      "#D4E6DE",
  bordeHover:      "#EBF2EE",
  textoPrincipal:  "#004733",
  textoSec:        "#4a6b60",
  textoMuted:      "#6B8C7D",
  textoDisabled:   "#A0BDB5",
};

// ── Datos estáticos ────────────────────────────────────────────────────────
const GRADOS = [
  { num: "1°", ciclo: "Unidad Pedagógica", valores: ["1"] },
  { num: "2°", ciclo: "Unidad Pedagógica", valores: ["2"] },
  { num: "3°", ciclo: "Primer ciclo",      valores: ["3"] },
  { num: "4°", ciclo: "Segundo ciclo",     valores: ["4"] },
  { num: "5°", ciclo: "Segundo ciclo",     valores: ["5"] },
  { num: "6°", ciclo: "Segundo ciclo",     valores: ["6"] },
];

const AREAS_CONFIG = {
  "Matemática":             { icon: <Calculator weight="duotone" />, bg: "#FFF0F0", border: "#FFD5D5", desc: "Números, geometría, medidas", color: "#dc2626" },
  "Prácticas del Lenguaje": { icon: <BookOpen weight="duotone" />, bg: "#E8F0FF", border: "#C5D5FF", desc: "Lectura, escritura, oralidad", color: "#2563eb" },
  "Ciencias Naturales":     { icon: <Microscope weight="duotone" />, bg: "#E8FFF4", border: "#B8FFDC", desc: "Seres vivos, cuerpo, materiales", color: "#059669" },
  "Ciencias Sociales":      { icon: <GlobeHemisphereWest weight="duotone" />, bg: "#FEF9E0", border: "#FDE98A", desc: "Historia, geografía, sociedad", color: "#ca8a04" },
};

// ── PDL cascada ────────────────────────────────────────────────────────────
const PDL_TIPOS = ["Lectura de textos", "Escritura de textos", "Ortografía"];

function getPDLGeneros(tipoFicha, grado) {
  const g = parseInt(grado);
  if (tipoFicha === "Ortografía") {
    if (g <= 2) return ["Separación de palabras", "Mayúsculas", "Punto"];
    if (g === 3) return ["Tilde en agudas, graves y esdrújulas"];
    if (g === 4) return ["Tilde diacrítica"];
    if (g === 5) return ["Adverbios en -mente", "Verbos con b/v"];
    return ["Reglas de acentuación avanzadas"];
  }
  if (g <= 2) return ["Cuento", "Fábula", "Poesía", "Texto informativo"];
  return ["Cuento", "Fábula", "Leyenda", "Poesía", "Obra de teatro", "Historieta", "Noticia", "Texto informativo"];
}

// Mapea bloques del JSON PDL → PDL_TIPOS
function pdlBloqueATipo(bloque) {
  if (!bloque) return null;
  const b = bloque.toLowerCase();
  if (b.startsWith("lectura")) return "Lectura de textos";
  if (b.startsWith("escritura")) return "Escritura de textos";
  if (b.startsWith("ortograf")) return "Ortografía";
  return null;
}

// ── Búsqueda: normalización ────────────────────────────────────────────────
function normalizar(str) {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function buildBlob(r) {
  const g = String(r.grado);
  return normalizar(
    [r.subtema, r.item_original, r.bloque, r.area, g, `${g}°`, `${g}to`].join(" ")
  );
}

// ── Sugerencias populares ──────────────────────────────────────────────────
const SUGERENCIAS = [
  { label: "Fracciones 4°",        q: "fraccion",   grado: "4" },
  { label: "Multiplicación 3°",    q: "multiplicac", grado: "3" },
  { label: "Sistema digestivo 6°", q: "digestivo",  grado: "6" },
  { label: "Revolución de Mayo 5°",q: "mayo",       grado: "5" },
  { label: "Lectura de cuentos 2°",q: "cuento",     grado: "2" },
];

// ── Sub-componentes ────────────────────────────────────────────────────────

// Animación GSAP en cada mount: entrar + stagger cards + boton
function PasoWrap({ children, onMount }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    // Entrada principal
    gsap.fromTo(ref.current,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
    // Cards y botón: sin animación GSAP — visibilidad garantizada por estilos inline
    if (onMount) onMount(ref.current);
  }, []);
  return <div ref={ref}>{children}</div>;
}

function PreguntaHeader({ pregunta, sub }) {
  return (
    <div style={{ marginBottom: sub ? 0 : 24 }}>
      <h2 style={{
        fontFamily: "Georgia, serif",
        fontSize: 24, fontWeight: 400,
        color: C.textoPrincipal, letterSpacing: "-0.02em",
        lineHeight: 1.25, margin: "0 0 6px",
      }}>{pregunta}</h2>
      {sub && <p style={{ fontSize: 14, color: C.textoMuted, marginBottom: 24, lineHeight: 1.5, marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

function ChipSeleccion({ label, valor, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        background: hov ? "#F0FBF7" : C.fondoCard,
        border: `1px solid ${hov ? C.verdeAcento : C.bordeSuave}`,
        borderRadius: 12, padding: "14px 20px",
        cursor: "pointer", marginBottom: 8,
        transition: "all 0.15s", textAlign: "left",
        boxShadow: hov ? "0 2px 8px rgba(0,71,51,0.08)" : "none",
      }}
    >
      <CheckCircle size={20} weight={hov ? "fill" : "regular"} color={hov ? C.verdeAcento : C.textoDisabled} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, color: C.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{label}</p>
        <p style={{ fontSize: 14, color: C.textoPrincipal, fontWeight: 500, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{valor}</p>
      </div>
      <span style={{
        fontSize: 11,
        color: hov ? C.verdeAcento : C.textoDisabled,
        background: hov ? C.verdeOscuro : C.fondoApp,
        padding: "2px 10px", borderRadius: 99, flexShrink: 0,
        transition: "all 0.15s",
      }}>{hov ? "Cambiar" : "Cambiar"}</span>
    </button>
  );
}

function GradoBtn({ g, activo, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      data-card
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 6, minHeight: 110, borderRadius: 16,
        border: activo ? `2px solid ${C.verdeOscuro}` : `1.5px solid ${hov ? C.verdeAcento : C.bordeSuave}`,
        background: activo ? C.verdeOscuro : (hov ? "#F0FBF7" : C.fondoCard),
        cursor: "pointer", transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: (hov || activo) ? "translateY(-3px) scale(1.02)" : "none",
        boxShadow: (hov || activo) ? "0 8px 24px rgba(0,71,51,0.12)" : "none",
        opacity: 1, visibility: "visible",
      }}
    >
      <span style={{
        fontFamily: "'Lexend', sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1,
        color: activo ? "#fff" : C.verdeOscuro, transition: "color 0.18s",
        opacity: 1, visibility: "visible",
      }}>{g.num}</span>
      <span style={{
        fontSize: 9, textAlign: "center", lineHeight: 1.4, padding: "0 8px",
        color: activo ? C.verdeAcento : C.textoMuted, transition: "color 0.18s",
      }}>{g.ciclo}</span>
    </button>
  );
}

function AreaBtn({ a, activo, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      data-card
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        gap: 12, borderRadius: 16, padding: 24,
        cursor: "pointer", textAlign: "left", transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        border: activo ? `2px solid ${C.verdeOscuro}` : `1.5px solid ${hov ? C.verdeOscuro : a.border}`,
        background: a.bg,
        transform: (hov || activo) ? "translateY(-3px) scale(1.02)" : "none",
        boxShadow: (hov || activo) ? "0 8px 24px rgba(0,71,51,0.10)" : "none",
        opacity: 1, visibility: "visible",
      }}
    >
      <div style={{ 
        fontSize: 40, 
        lineHeight: 1, 
        color: a.color,
        background: "#fff",
        width: 60,
        height: 60,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}>
        {a.icon}
      </div>
      <div>
        <p style={{ fontSize: 16, fontWeight: 700, color: C.verdeOscuro, margin: "0 0 4px" }}>{a.nombre}</p>
        <p style={{ fontSize: 12, color: C.textoSec, lineHeight: 1.4, margin: 0 }}>{a.desc}</p>
      </div>
    </button>
  );
}

function Toggle({ on, onChange, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onChange(!on)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 16,
        background: on ? C.verdeClaroBg : (hov ? "#F8FDFB" : C.fondoCard),
        border: `1px solid ${on ? C.verdeOscuro : (hov ? C.verdeAcento : C.bordeSuave)}`,
        borderRadius: 14, padding: "16px 20px",
        cursor: "pointer", marginBottom: 10,
        transition: "all 0.15s", userSelect: "none",
        boxShadow: on ? "0 2px 10px rgba(0,71,51,0.08)" : "none",
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.textoPrincipal, margin: "0 0 3px" }}>{title}</p>
        <p style={{ fontSize: 12, color: C.textoMuted, lineHeight: 1.5, margin: 0 }}>{desc}</p>
      </div>
      <div style={{
        width: 52, height: 28, borderRadius: 99,
        background: on ? C.verdeOscuro : C.bordeSuave,
        position: "relative", flexShrink: 0, marginTop: 2,
        transition: "background 0.2s",
      }}>
        <div style={{
          position: "absolute", top: 3, left: 3,
          width: 22, height: 22, borderRadius: "50%",
          background: "#fff",
          transform: on ? "translateX(24px)" : "translateX(0)",
          transition: "transform 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }} />
      </div>
    </div>
  );
}

function AcordeonBloques({ bloques, contenidosPorBloque, registroSeleccionado, onSelect }) {
  const [bloqueAbierto, setBloqueAbierto] = useState(null);

  const handleSelect = (r, el) => {
    if (el) {
      gsap.fromTo(el,
        { backgroundColor: "#b2f0da" },
        { backgroundColor: "#E6FAF3", duration: 0.5, ease: "power2.out" }
      );
    }
    onSelect(r);
  };

  return (
    <div>
      {bloques.map((b) => {
        const abierto = bloqueAbierto === b;
        const items = contenidosPorBloque[b] || [];
        return (
          <div key={b} style={{
            background: C.fondoCard,
            border: `1px solid ${C.bordeSuave}`,
            borderRadius: 14, overflow: "hidden", marginBottom: 8,
            boxShadow: abierto ? "0 2px 12px rgba(0,71,51,0.08)" : "none",
            transition: "box-shadow 0.2s",
          }}>
            <button
              onClick={() => setBloqueAbierto(abierto ? null : b)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px",
                background: abierto ? C.verdeClaroBg : C.fondoCard,
                border: "none", borderBottom: abierto ? `1px solid #D4EEE3` : "none",
                cursor: "pointer", textAlign: "left",
                fontSize: 14, fontWeight: 600, color: C.textoPrincipal,
                minHeight: 48, transition: "background 0.12s",
              }}
              onMouseEnter={e => { if (!abierto) e.currentTarget.style.background = "#F0FBF7"; }}
              onMouseLeave={e => { if (!abierto) e.currentTarget.style.background = C.fondoCard; }}
            >
              <span>{b}</span>
              <CaretRight 
                size={16} 
                weight="bold" 
                color={abierto ? C.verdeAcento : C.textoDisabled}
                style={{
                  transform: abierto ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }} 
              />
            </button>
            {abierto && (
              <div>
                {items.map((r) => {
                  const activo = registroSeleccionado?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={(e) => handleSelect(r, e.currentTarget)}
                      style={{
                        width: "100%", padding: "11px 18px 11px 32px",
                        fontSize: 13,
                        color: activo ? C.textoPrincipal : C.textoSec,
                        fontWeight: activo ? 600 : 400,
                        background: activo ? C.verdeClaroBg : C.fondoCard,
                        border: "none", borderTop: `1px solid ${C.bordeHover}`,
                        cursor: "pointer", textAlign: "left", minHeight: 44,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        lineHeight: 1.4, transition: "background 0.1s",
                      }}
                      onMouseEnter={e => { if (!activo) { e.currentTarget.style.background = "#F0FBF7"; e.currentTarget.style.color = C.textoPrincipal; } }}
                      onMouseLeave={e => { if (!activo) { e.currentTarget.style.background = C.fondoCard; e.currentTarget.style.color = C.textoSec; } }}
                    >
                      <span>{r.subtema || r.item_original}</span>
                      {activo && <Check size={16} weight="bold" color={C.verdeAcento} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Shimmer({ delay = "0s" }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.65) 50%,transparent 100%)", animation: "shimmer 1.8s ease-in-out infinite", animationDelay: delay }} />
  );
}

function WLine({ delay = "0s", color = "#D4E6DE", dur = "2.8s" }) {
  return (
    <div style={{ height: 6, width: "100%", borderRadius: 3, background: color, transformOrigin: "left center", animation: `writeLine ${dur} ease-in-out infinite`, animationDelay: delay, flexShrink: 0 }} />
  );
}

function FichaSkeletonDynamic({ momento }) {
  const BK = "#0d1f1a";
  const FH = "#f5f5f5";
  const EASE = "0.5s cubic-bezier(0.4,0,0.2,1)";
  const body = 340;

  const specs = {
    "Presentación":         { expH: Math.round(body * 0.72), actH: Math.round(body * 0.28) },
    "Práctica":             { expH: Math.round(body * 0.18), actH: Math.round(body * 0.82) },
    "Cierre / Integración": { expH: null, actH: null },
  };

  const isCierre = momento === "Cierre / Integración";
  const { expH, actH } = specs[momento] || specs["Presentación"];

  const SecLabel = ({ icon, label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, paddingBottom: 4, borderBottom: `1.5px solid ${BK}` }}>
      <div style={{ color: BK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, color: BK, textTransform: "uppercase", letterSpacing: "0.02em" }}>{label}</span>
    </div>
  );

  const ExplBlock = ({ h }) => (
    <div style={{ height: h, padding: "8px 12px", background: "#fff", borderBottom: `1px solid ${C.bordeSuave}`, transition: `height ${EASE}`, overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <SecLabel icon={<FileText size={12} weight="bold" />} label="Leemos juntos" />
      <div style={{ background: "#E6FAF3", borderLeft: "2px solid #00c48c", borderRadius: "0 4px 4px 0", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 5, flex: 1, justifyContent: "space-around" }}>
        {[0, 0.3, 0.6, 1.0, 1.3, 1.6].map((d, i) => <WLine key={i} delay={`${d}s`} color="#b2dfd0" dur="3s" />)}
      </div>
    </div>
  );

  const ActBlock = ({ h }) => (
    <div style={{ height: h, padding: "8px 12px", background: "#fff", transition: `height ${EASE}`, overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <SecLabel icon={<Lightbulb size={12} weight="bold" />} label="Tu turno" />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", flex: 1 }}>
        {[0, 0.6, 1.2, 1.8].map((d, i) => (
          <div key={i}>
            <WLine delay={`${d}s`} dur="2.8s" />
            <div style={{ height: 16, border: `1px solid ${C.bordeSuave}`, borderRadius: 3, marginTop: 4, position: "relative", overflow: "hidden" }}>
              <Shimmer delay={`${d + 0.2}s`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const cierreH = Math.round(body / 4);
  const cierreBlocks = [
    { icon: <FileText size={10} />, label: "Nivel 1" }, 
    { icon: <FileText size={10} />, label: "Nivel 2" },
    { icon: <FileText size={10} />, label: "Nivel 3" }, 
    { icon: <Lightbulb size={10} />, label: "Para pensar" },
  ];

  return (
    <div style={{ borderRadius: 8, overflow: "hidden", border: `2px solid ${BK}`, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontFamily: "'Lexend',sans-serif" }}>
      {/* Header */}
      <div style={{ background: BK, padding: "10px 14px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
          {[30, 80, 60].map((w, i) => (
            <div key={i} style={{ height: 13, width: w, borderRadius: 4, background: "rgba(0,196,140,0.28)", position: "relative", overflow: "hidden" }}>
              <Shimmer delay={`${i * 0.15}s`} />
            </div>
          ))}
        </div>
        <div style={{ height: 15, width: "55%", borderRadius: 4, background: "rgba(255,255,255,0.2)", position: "relative", overflow: "hidden", marginBottom: 8 }}>
          <Shimmer delay="0.1s" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
          {["Nombre", "Fecha", "Grado"].map(l => (
            <div key={l}>
              <div style={{ fontSize: 6, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
              <div style={{ borderBottom: "1.5px solid rgba(255,255,255,0.2)", height: 14 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      {isCierre ? (
        <div style={{ background: "#fff" }}>
          {cierreBlocks.map((b, i) => (
            <div key={i} style={{ height: cierreH, padding: "8px 12px", borderBottom: i < 3 ? `1px solid ${C.bordeSuave}` : "none", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <SecLabel icon={b.icon} label={b.label} />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", flex: 1 }}>
                <WLine delay={`${i * 0.3}s`} dur="2.8s" />
                <div style={{ height: 14, border: `1px solid ${C.bordeSuave}`, borderRadius: 3, position: "relative", overflow: "hidden" }}><Shimmer delay={`${i * 0.15}s`} /></div>
                <div style={{ height: 14, border: `1px solid ${C.bordeSuave}`, borderRadius: 3, position: "relative", overflow: "hidden" }}><Shimmer delay={`${i * 0.2}s`} /></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "#fff" }}>
          <ExplBlock h={expH} />
          <ActBlock h={actH} />
        </div>
      )}

      {/* Footer */}
      <div style={{ background: FH, borderTop: `1.5px solid ${BK}`, padding: "5px 14px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 7, color: "#999", fontFamily: "'Lexend',sans-serif" }}>tiza. · DC PBA 2018</span>
        <span style={{ fontSize: 7, color: "#999" }}>5° · contenido</span>
      </div>
    </div>
  );
}

function SidebarPreview({ gradoData, area, registro, tipoFicha, genero }) {
  const tituloFicha = registro
    ? (registro.subtema || registro.item_original)
    : genero
    ? genero
    : area
    ? `${area} · ${gradoData?.num}`
    : gradoData
    ? `${gradoData.num} grado`
    : null;

  const hasContent = !!(registro || genero);
  const blocks = [
    { num: 1, name: "Explicación", type: "explanation", icon: <FileText size={12} weight="bold" /> },
    { num: 2, name: "Actividad",   type: "activity",    icon: <Lightbulb size={12} weight="bold" /> },
    { num: 3, name: "Reflexión",   type: "reflection",  icon: <HandsClapping size={12} weight="bold" /> },
  ];

  return (
    <div style={{
      background: C.fondoCard, borderRadius: 10,
      border: `1px solid ${C.bordeSuave}`, overflow: "hidden",
      boxShadow: "0 4px 16px rgba(0,70,50,0.08)",
    }}>
      <div style={{ background: C.verdeOscuro, padding: "10px 14px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
          {[gradoData?.num, area, hasContent ? "contenido" : null].map((val, i) => (
            <span key={i} style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 99,
              background: val ? C.verdeAcento : "rgba(255,255,255,0.15)",
              color: val ? C.verdeOscuro : "rgba(255,255,255,0.3)", fontWeight: 700,
            }}>{val || "···"}</span>
          ))}
        </div>
        <p style={{
          fontSize: 11, fontWeight: 600, color: "#fff",
          margin: 0, lineHeight: 1.4,
          fontStyle: tituloFicha ? "normal" : "italic",
          opacity: tituloFicha ? 1 : 0.5,
        }}>{tituloFicha || "Tu ficha aparece acá"}</p>
      </div>
      <div style={{ padding: "10px 12px" }}>
        {blocks.map((block) => (
          <div key={block.name} style={{
            marginBottom: 7, opacity: hasContent ? 1 : 0.18,
            filter: hasContent ? "none" : "grayscale(1)", transition: "all 0.3s",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: C.verdeClaroBg, borderRadius: "4px 4px 0 0", padding: "4px 8px",
            }}>
              <span style={{ color: C.verdeTexto, display: "flex", alignItems: "center" }}>{block.icon}</span>
              <span style={{ fontSize: 11, color: C.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>{block.name}</span>
            </div>
            <div style={{
              background: "#fafafa", borderRadius: "0 0 4px 4px",
              padding: "5px 7px", border: `1px solid ${C.bordeHover}`,
            }}>
              {block.type === "explanation" && (
                <>{[80, 95, 70].map((w, i) => (
                  <div key={i} style={{ height: 3, borderRadius: 2, background: C.verdeAcento, opacity: 0.5, marginBottom: 3, width: `${w}%` }} />
                ))}</>
              )}
              {block.type === "example" && (
                <div style={{ height: 14, borderRadius: 3, background: C.verdeClaroBg, border: `1px solid ${C.verdeClaroBorder}` }} />
              )}
              {block.type === "activity" && (
                <>
                  <div style={{ height: 3, borderRadius: 2, background: C.verdeAcento, opacity: 0.4, marginBottom: 3, width: "90%" }} />
                  <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ flex: 1, height: 10, borderRadius: 2, border: `1px solid ${C.bordeSuave}` }} />
                    ))}
                  </div>
                </>
              )}
              {block.type === "reflection" && (
                <>{[85, 65].map((w, i) => (
                  <div key={i} style={{ height: 3, borderRadius: 2, background: C.bordeSuave, marginBottom: 3, width: `${w}%` }} />
                ))}</>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Buscador compartido ────────────────────────────────────────────────────

function Buscador({ value, onChange, onFocus, onBlur, focused, onClear, placeholder, grande }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      background: C.fondoCard,
      border: `${grande ? 2 : 1.5}px solid ${focused || value ? C.verdeAcento : C.bordeSuave}`,
      borderRadius: grande ? 16 : 12,
      padding: grande ? "18px 24px" : "12px 18px",
      boxShadow: focused
        ? "0 8px 32px rgba(0,71,51,0.18)"
        : grande
        ? "0 4px 24px rgba(0,71,51,0.10)"
        : "0 2px 10px rgba(0,71,51,0.06)",
      transition: "all 0.2s",
    }}>
      <MagnifyingGlass 
        size={grande ? 22 : 18} 
        weight={focused ? "bold" : "regular"} 
        color={focused ? C.verdeAcento : C.textoMuted} 
        style={{ flexShrink: 0 }} 
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          flex: 1, border: "none", outline: "none",
          fontSize: grande ? 16 : 14,
          color: C.textoPrincipal, background: "transparent",
          fontFamily: "'Lexend', sans-serif",
        }}
      />
      {value && (
        <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", color: C.textoMuted, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
          <X size={grande ? 20 : 16} weight="bold" />
        </button>
      )}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────

import { track } from '@vercel/analytics'

export default function Generador({ onFichaGenerada, onVolver, user, profile, onProfileUpdate, onLogin }) {
  const [paso, setPaso] = useState(0);       // 0=home, 1=grado, 2=área, 3=contenido, 4=opciones
  const [gradoData, setGradoData] = useState(null);
  const [area, setArea] = useState(null);
  const [areaConfig, setAreaConfig] = useState(null);
  const [registro, setRegistro] = useState(null);
  const [momento, setMomento] = useState(null);
  const [nivelGrupo, setNivelGrupo] = useState(null);
  const [contextoLibre, setContextoLibre] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaFocused, setBusquedaFocused] = useState(false);
  const [busquedaGrado, setBusquedaGrado] = useState(null);
  const [tipoFicha, setTipoFicha] = useState(null);
  const [genero, setGenero] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [mensajeLoading, setMensajeLoading] = useState(0);
  const [error, setError] = useState(null);
  const [retryMessage, setRetryMessage] = useState(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [textoDocente, setTextoDocente] = useState("");
  const [showTextoUploader, setShowTextoUploader] = useState(false);
  const [cargandoTexto, setCargandoTexto] = useState(false);

  // Ref al elemento DOM del PasoWrap actual (para salirPaso)
  const pasoWrapEl = useRef(null);

  const curricular = curricularData;
  const gradoNum = gradoData?.valores[0] || "1";
  const isPDL = area === "Prácticas del Lenguaje";

  // Configuración dinámica del selector de momento según área y tipo de ficha PDL
  const momentoConfig = (() => {
    if (!isPDL) return {
      mostrar: true,
      label: "Momento didáctico",
      opciones: ["Presentación", "Práctica", "Cierre / Integración"],
    };
    if (tipoFicha === "Escritura de textos") return {
      mostrar: true,
      label: "Fase de escritura",
      opciones: ["Planificación", "Producción"],
    };
    if (tipoFicha === "Ortografía") return {
      mostrar: true,
      label: "Momento didáctico",
      opciones: ["Presentación", "Práctica", "Cierre"],
    };
    // Lectura de textos: no se pregunta el momento
    return { mostrar: false };
  })();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile finder: paso activo derivado del estado
  const mobileStep = !gradoData ? 0 : !area ? 1 : !registro ? 2 : 3;
  const mobileBack = () => {
    if (mobileStep === 3) setRegistro(null);
    else if (mobileStep === 2) { setArea(null); setAreaConfig(null); }
    else if (mobileStep === 1) { setGradoData(null); setArea(null); setAreaConfig(null); }
  };

  const LIMITE_PALABRAS_TEXTO = 5000;

  const extraerTextoArchivo = async (file) => {
    setCargandoTexto(true);
    try {
      const ext = file.name.split(".").pop().toLowerCase();
      let texto = "";
      if (ext === "docx") {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        texto = result.value;
      } else if (ext === "pdf") {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const paginas = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          paginas.push(content.items.map(item => item.str).join(" "));
        }
        texto = paginas.join("\n\n");
      }
      const palabras = texto.trim().split(/\s+/);
      if (palabras.length > LIMITE_PALABRAS_TEXTO) {
        texto = palabras.slice(0, LIMITE_PALABRAS_TEXTO).join(" ");
      }
      setTextoDocente(texto.trim());
    } catch (err) {
      console.error("Error extrayendo texto:", err);
    } finally {
      setCargandoTexto(false);
    }
  };

  // ── Datos derivados ────────────────────────────────────────────────────
  const areasDisponibles = useMemo(() => {
    if (!gradoData) return [];
    const nombres = [...new Set(
      curricular.filter(r => gradoData.valores.includes(String(r.grado))).map(r => r.area)
    )];
    return nombres.map(nombre => ({ nombre, ...AREAS_CONFIG[nombre] })).filter(a => a.bg);
  }, [curricular, gradoData]);

  const bloquesDisponibles = useMemo(() => {
    if (!gradoData || !area) return [];
    return [...new Set(
      curricular
        .filter(r => gradoData.valores.includes(String(r.grado)) && r.area === area)
        .map(r => r.bloque)
    )].sort();
  }, [curricular, gradoData, area]);

  const contenidosPorBloque = useMemo(() => {
    if (!gradoData || !area) return {};
    const result = {};
    bloquesDisponibles.forEach(b => {
      result[b] = curricular
        .filter(r => gradoData.valores.includes(String(r.grado)) && r.area === area && r.bloque === b)
        .sort((a, b) => (a.subtema || a.item_original).localeCompare(b.subtema || b.item_original));
    });
    return result;
  }, [curricular, gradoData, area, bloquesDisponibles]);

  const resultadosBusqueda = useMemo(() => {
    if (!busqueda.trim()) return null;
    const words = normalizar(busqueda.trim()).split(/\s+/).filter(Boolean);
    let base = curricular;
    if (busquedaGrado) base = base.filter(r => String(r.grado) === busquedaGrado);
    return base
      .filter(r => { const b = buildBlob(r); return words.every(w => b.includes(w)); })
      .slice(0, 20);
  }, [busqueda, busquedaGrado, curricular]);

  // ── Loading messages ───────────────────────────────────────────────────
  const getMensaje = (idx) => {
    const msgs = [
      "Consultando el Diseño Curricular...",
      `Buscando el contenido de ${gradoNum}° grado`,
      "Armando la explicación...",
      "Adaptando el lenguaje para primaria",
      "Creando los ejercicios...",
      "Pensando en actividades significativas",
      "Validando el contenido...",
      "Revisando que sea adecuado para el grado",
      "Casi lista tu ficha...",
      "Últimos retoques",
    ];
    return msgs[idx % msgs.length];
  };

  useEffect(() => {
    if (!generando) { setMsgIdx(0); setMsgVisible(true); return; }
    setMsgIdx(0); setMsgVisible(true);
    const interval = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => { setMsgIdx(prev => (prev + 1) % 10); setMsgVisible(true); }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, [generando]);

  // ── Transición animada entre pasos ─────────────────────────────────────
  const irAPaso = (nuevoPaso, setupFn) => {
    const el = pasoWrapEl.current;
    const doSwitch = () => {
      if (setupFn) setupFn();
      setPaso(nuevoPaso);
    };
    if (el) {
      gsap.to(el, { autoAlpha: 0, y: -12, duration: 0.25, ease: "power2.in", onComplete: doSwitch });
    } else {
      doSwitch();
    }
  };

  // ── Navegación ─────────────────────────────────────────────────────────
  const cambiarDesde = (p) => {
    irAPaso(p, () => {
      if (p <= 0) {
        setGradoData(null); setArea(null); setAreaConfig(null); setRegistro(null);
        setTipoFicha(null); setGenero(null);
      } else if (p <= 1) {
        setArea(null); setAreaConfig(null); setRegistro(null);
        setTipoFicha(null); setGenero(null);
      } else if (p <= 2) {
        setRegistro(null); setTipoFicha(null); setGenero(null);
      } else if (p <= 3) {
        setRegistro(null); setTipoFicha(null); setGenero(null);
      }
      setBusqueda(""); setBusquedaGrado(null);
      setError(null); setGenerando(false); setMensajeLoading(0);
      setTextoDocente(""); setShowTextoUploader(false);
    });
  };

  // Seleccionar resultado de búsqueda → paso 4
  const selectResult = (r) => {
    irAPaso(4, () => {
      const g = GRADOS.find(g => g.valores.includes(String(r.grado)));
      if (g) setGradoData(g);
      const ac = AREAS_CONFIG[r.area];
      if (ac) { setArea(r.area); setAreaConfig(ac); }
      setRegistro(r);
      if (r.area === "Prácticas del Lenguaje") {
        const tipo = pdlBloqueATipo(r.bloque);
        if (tipo) { setTipoFicha(tipo); setGenero(r.subtema || r.item_original); }
      }
      setBusqueda(""); setBusquedaGrado(null);
    });
  };

  // ── API ────────────────────────────────────────────────────────────────
  const generarConPayload = async (payload, registroParaFicha, isRetry, isNetworkRetry = false) => {
    const timer4s = setTimeout(() => setMensajeLoading(1), 4000);
    try {
      const token = (await supabase.auth.getSession())?.data?.session?.access_token;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      clearTimeout(timer4s);
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        if (onProfileUpdate) onProfileUpdate(p => ({ ...p, fichas_mes: data.fichas_mes }));
        setGenerando(false);
        setShowPaywall(true);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(res.status === 504 ? "TIMEOUT" : (data.error || "SERVER_ERROR"));
      }
      const resultado = await res.json();

      // Si el docente proveyó un texto propio, inyectarlo en la ficha (no se eco desde la API)
      if (payload.contenido?.textoDocente && resultado.ficha) {
        resultado.ficha.texto = payload.contenido.textoDocente;
      }

      if (!isRetry && resultado.validacion?.observaciones?.length > 0) {
        setMensajeLoading(0);
        await generarConPayload(payload, registroParaFicha, true);
      } else {
        setMensajeLoading(2);
        setTimeout(() => {
          setGenerando(false); setError(null); setRetryMessage(null);
          track('ficha_generada', { area: registroParaFicha.area, grado: registroParaFicha.grado, tipo: registroParaFicha.tipo_ficha })
          onFichaGenerada(resultado.ficha, registroParaFicha, null);
        }, 1000);
      }
    } catch (err) {
      clearTimeout(timer4s);
      if (!isNetworkRetry) {
        const isTimeout = err.message === "TIMEOUT";
        if (isTimeout) setRetryMessage("Tardó demasiado, reintentando...");
        await new Promise(r => setTimeout(r, isTimeout ? 500 : 2000));
        await generarConPayload(payload, registroParaFicha, isRetry, true);
        return;
      }
      setGenerando(false); setMensajeLoading(0); setRetryMessage(null);
      if (err.message === "TIMEOUT") {
        setError("El servidor está tardando mucho. Esperá unos minutos e intentá de nuevo.");
      } else if (!navigator.onLine) {
        setError("Sin conexión. Verificá el internet e intentá de nuevo.");
      } else {
        setError("Algo salió mal. Intentá de nuevo en un momento.");
      }
    }
  };

  const generar = async () => {
    const isPDL = area === "Prácticas del Lenguaje";
    if (isPDL ? (!tipoFicha || !genero) : !registro) return;
    if (!user) { setShowLoginModal(true); return; }
    setGenerando(true); setMensajeLoading(0); setError(null);

    let payload, registroParaFicha;
    if (isPDL) {
      const textoDocenteTrimmed = tipoFicha === "Lectura de textos" && textoDocente.trim() ? textoDocente.trim() : null;
      payload = {
        contenido: {
          grado: gradoNum, area, tipoTexto: genero,
          textoDocente: textoDocenteTrimmed,
          contexto_pedagogico: {
            momento: momento || null,
            nivelGrupo: nivelGrupo || null,
          },
        },
        tipoFicha,
      };
      registroParaFicha = {
        id: `pdl_${gradoNum}_${tipoFicha}_${genero}`,
        grado: gradoNum, area,
        bloque: tipoFicha, item_original: genero,
      };
    } else {
      const contexto_pedagogico = {
        momento: momento || null,
        nivelGrupo: nivelGrupo || null,
        textoLibre: contextoLibre.trim() || null,
      };

      payload = {
        contenido: {
          grado: registro.grado, area: registro.area, bloque: registro.bloque,
          item_original: registro.item_original,
          subtema: registro.subtema || registro.item_original,
          objetivo_especifico: registro.objetivo_especifico,
          indicadores_de_avance: registro.indicadores_de_avance || [],
          contexto_pedagogico,
        },
        tipoFicha: momento === "Cierre / Integración" ? "ficha de cierre" : "ficha de trabajo",
      };
      registroParaFicha = registro;
    }
    await generarConPayload(payload, registroParaFicha, false);
  };

  // ── Dropdown de resultados (reutilizable) ──────────────────────────────
  const renderResultados = () => {
    if (!busqueda || !resultadosBusqueda) return null;
    return (
      <div style={{
        background: C.fondoCard, border: `1px solid ${C.bordeSuave}`,
        borderRadius: 14, marginTop: 8, overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,71,51,0.12)",
        animation: "fadeUp 0.2s both",
      }}>
        {resultadosBusqueda.length === 0 ? (
          <p style={{ fontSize: 13, color: C.textoMuted, padding: "14px 18px", margin: 0, fontStyle: "italic" }}>
            Sin resultados. Probá con otras palabras.
          </p>
        ) : resultadosBusqueda.map((r, i) => (
          <button
            key={r.id}
            onClick={() => selectResult(r)}
            style={{
              width: "100%", textAlign: "left", padding: "12px 18px",
              borderTop: i > 0 ? `1px solid ${C.bordeHover}` : "none",
              background: C.fondoCard, border: "none", cursor: "pointer",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#F0FBF7"}
            onMouseLeave={e => e.currentTarget.style.background = C.fondoCard}
          >
            <p style={{ fontSize: 11, color: C.textoMuted, margin: "0 0 2px", fontWeight: 500 }}>
              {r.area} · {r.grado}° · {r.bloque}
            </p>
            <p style={{ fontSize: 14, color: C.textoPrincipal, fontWeight: 600, margin: 0 }}>
              {r.subtema || r.item_original}
            </p>
          </button>
        ))}
      </div>
    );
  };

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Lexend', sans-serif", background: C.fondoApp, minHeight: "100vh" }}>
      {showLoginModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(13,31,26,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 24, fontFamily: "'Lexend Deca', sans-serif",
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '36px 32px',
            maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0d1f1a', margin: '0 0 8px' }}>
              Creá tu cuenta gratis
            </h2>
            <p style={{ fontSize: 14, color: '#555', margin: '0 0 24px', lineHeight: 1.6 }}>
              Iniciá sesión para generar fichas y guardarlas en tu biblioteca.
            </p>
            <button
              onClick={() => { setShowLoginModal(false); onLogin && onLogin(); }}
              style={{
                width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #e0e0e0',
                background: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 16.3 3 9.6 7.9 6.3 14.7z"/><path fill="#FBBC05" d="M24 45c5.5 0 10.5-1.9 14.3-5l-6.6-5.4C29.8 36.2 27 37 24 37c-5.7 0-10.6-3.1-11.8-8.5l-7 5.4C8.3 40.5 15.6 45 24 45z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1 3-3.3 5.4-6.2 6.9l6.6 5.4c3.8-3.5 6.3-8.9 6.3-15.4 0-1.3-.2-2.7-.5-4z"/></svg>
              Continuar con Google
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                width: '100%', marginTop: 10, padding: '12px', borderRadius: 10,
                border: 'none', background: 'none', color: '#aaa', fontSize: 13, cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showPaywall && (
        <PaywallModal
          fichasMes={profile?.fichas_mes ?? 5}
          limite={profile?.plan === 'premium' ? 50 : 5}
          plan={profile?.plan ?? 'free'}
          linkPago="https://mpago.la/1PX3Bz5"
          onCerrar={() => setShowPaywall(false)}
        />
      )}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes btnShine {
          0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(320%) skewX(-15deg); opacity: 0; }
        }
        @keyframes itemFlash {
          0%   { background: #E6FAF3; }
          40%  { background: #b2f0da; }
          100% { background: #E6FAF3; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes writeLine {
          0%   { transform: scaleX(0); opacity: 0.2; }
          18%  { opacity: 1; }
          65%  { transform: scaleX(1); opacity: 1; }
          88%  { transform: scaleX(1); opacity: 0.8; }
          100% { transform: scaleX(0); opacity: 0.2; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── HOME: pantalla search-first ── */}
      {paso === 0 && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "40px 16px",
        }}>
          <PasoWrap onMount={(el) => { pasoWrapEl.current = el; }}>
            {/* Logo */}
            <div style={{ marginBottom: 40, textAlign: "center" }}>
              <button
                onClick={onVolver}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 8, color: C.verdeOscuro }}
                title="Volver al inicio"
              >
                <Logo size={32} />
              </button>
            </div>

            {/* Buscador grande */}
            <div style={{ width: "100%", maxWidth: 560 }}>
              <h1 style={{
                fontFamily: "Georgia, serif",
                fontSize: isMobile ? 26 : 32, fontWeight: 400,
                color: C.textoPrincipal, textAlign: "center",
                margin: "0 0 24px", letterSpacing: "-0.02em", lineHeight: 1.2,
              }}>
                ¿Qué trabajamos hoy?
              </h1>

              <Buscador
                value={busqueda}
                onChange={v => { setBusqueda(v); setBusquedaGrado(null); }}
                onFocus={() => setBusquedaFocused(true)}
                onBlur={() => setTimeout(() => setBusquedaFocused(false), 150)}
                focused={busquedaFocused}
                onClear={() => { setBusqueda(""); setBusquedaGrado(null); }}
                placeholder='Ej: fracciones 5to, sistema digestivo 6to, revolución de mayo...'
                grande
              />

              {renderResultados()}

              {/* Chips de sugerencias */}
              {!busqueda && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, justifyContent: "center" }}>
                  {SUGERENCIAS.map(s => (
                    <button
                      key={s.label}
                      onClick={() => { setBusqueda(s.q); setBusquedaGrado(s.grado); }}
                      style={{
                        fontSize: 13, fontWeight: 500, color: C.verdeOscuro,
                        background: C.verdeClaroBg, border: `1px solid ${C.verdeAcento}`,
                        borderRadius: 99, padding: "8px 16px",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.verdeOscuro; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.verdeClaroBg; e.currentTarget.style.color = C.verdeOscuro; }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Link al stepper */}
              {!busqueda && (
                <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: C.textoMuted }}>
                  O{" "}
                  <button
                    onClick={() => cambiarDesde(1)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: C.textoSec, fontWeight: 600, fontSize: 13,
                      padding: 0, textDecoration: "underline", textDecorationColor: C.bordeSuave,
                      fontFamily: "'Lexend', sans-serif",
                    }}
                  >
                    explorá por grado y área →
                  </button>
                </p>
              )}
            </div>
          </PasoWrap>
        </div>
      )}

      {/* ── STEPPER (pasos 1–4) ── */}
      {paso > 0 && (
        <>
          {/* Navbar principal del Generador */}
          <nav style={{
            background: "#004733", padding: "12px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 100,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <div 
              onClick={() => onVolver()} 
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
              title="Ir al inicio (Landing)"
            >
              <Logo size={28} color="#ffffff" />
            </div>
            
            {paso >= 1 && paso < 4 && !generando && (
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                Elegí el contenido
              </span>
            )}

            <button
              onClick={() => {
                if (paso >= 4) {
                  irAPaso(1, () => { setRegistro(null); setTipoFicha(null); setGenero(null); });
                } else {
                  irAPaso(0, () => {
                    setGradoData(null); setArea(null); setAreaConfig(null);
                    setRegistro(null); setTipoFicha(null); setGenero(null);
                  });
                }
              }}
              style={{
                fontSize: "13px", 
                fontWeight: "600",
                color: "#004733",
                background: C.verdeAcento, 
                border: "none",
                borderRadius: "8px", 
                padding: "8px 16px", 
                cursor: "pointer",
                fontFamily: "'Lexend', sans-serif", 
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 8px rgba(0,196,140,0.2)"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <CaretLeft size={16} weight="bold" />
              <span>Volver</span>
            </button>
          </nav>

          {/* Barra de progreso 3px */}
          <div style={{ height: 3, background: C.bordeSuave, position: "sticky", top: 57, zIndex: 9 }}>
            <div style={{
              height: "100%", background: C.verdeAcento,
              width: `${(paso / 4) * 100}%`,
              transition: "width 0.4s ease",
              borderRadius: "0 2px 2px 0",
            }} />
          </div>

          {/* ── FINDER: pasos 1–3 ── */}
          {paso >= 1 && paso < 4 && !generando && (
            <>
              {/* Breadcrumb mobile */}
              {isMobile && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: C.fondoApp, borderBottom: `1px solid ${C.bordeSuave}` }}>
                  {mobileStep > 0 && (
                    <button onClick={mobileBack} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: C.verdeOscuro, background: "none", border: "none", cursor: "pointer", padding: "8px 12px 8px 0", minHeight: 44, fontFamily: "'Lexend', sans-serif" }}>
                      <CaretLeft size={16} weight="bold" /> Atrás
                    </button>
                  )}
                  <span style={{ fontSize: 12, color: C.textoMuted }}>
                    {["Elegí un grado", "Elegí un área", "Elegí un contenido", "Confirmá tu selección"][mobileStep]}
                    {mobileStep < 3 && <span style={{ fontWeight: 700 }}>{" · "}{mobileStep + 1}/3</span>}
                  </span>
                </div>
              )}
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 65px)", minHeight: isMobile ? "calc(100vh - 120px)" : undefined, overflow: isMobile ? "visible" : "hidden" }}>

              {/* Columna 1: Grado */}
              <div style={{ width: isMobile ? "100%" : 176, display: isMobile && mobileStep !== 0 ? "none" : undefined, flexShrink: 0, borderRight: isMobile ? "none" : `1px solid ${C.bordeSuave}`, borderBottom: isMobile ? `1px solid ${C.bordeSuave}` : "none", overflowY: "auto", background: C.fondoCard }}>
                <div style={{ padding: "10px 16px 8px", fontSize: 10, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: `1px solid ${C.bordeSuave}`, background: C.fondoApp }}>Grado</div>
                {GRADOS.map(g => {
                  const activo = gradoData?.num === g.num;
                  return (
                    <button key={g.num}
                      onClick={() => { setGradoData(g); setArea(null); setAreaConfig(null); setRegistro(null); setTipoFicha(null); setGenero(null); }}
                      style={{ width: "100%", padding: "14px 16px", textAlign: "left", border: "none", borderBottom: `1px solid ${C.bordeHover}`, background: activo ? C.verdeOscuro : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s", fontFamily: "'Lexend', sans-serif" }}
                      onMouseEnter={e => { if (!activo) e.currentTarget.style.background = "#F0FBF7"; }}
                      onMouseLeave={e => { if (!activo) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: activo ? "#fff" : C.textoPrincipal }}>{g.num}</div>
                        <div style={{ fontSize: 10, color: activo ? "rgba(255,255,255,0.6)" : C.textoMuted, marginTop: 2 }}>{g.ciclo}</div>
                      </div>
                      {activo && <CaretRight size={18} weight="bold" color={activo ? "#fff" : C.verdeAcento} />}
                    </button>
                  );
                })}
              </div>

              {/* Columna 2: Área */}
              <div style={{ width: isMobile ? "100%" : 220, display: isMobile && mobileStep !== 1 ? "none" : undefined, flexShrink: 0, borderRight: isMobile ? "none" : `1px solid ${C.bordeSuave}`, borderBottom: isMobile ? `1px solid ${C.bordeSuave}` : "none", overflowY: "auto", background: C.fondoCard }}>
                <div style={{ padding: "10px 16px 8px", fontSize: 10, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: `1px solid ${C.bordeSuave}`, background: C.fondoApp }}>
                  Área{gradoData ? ` · ${gradoData.num} grado` : ""}
                </div>
                {!gradoData ? (
                  <p style={{ padding: "20px 16px", fontSize: 12, color: C.textoMuted, fontStyle: "italic" }}>Elegí un grado</p>
                ) : areasDisponibles.map(a => {
                  const activo = area === a.nombre;
                  return (
                    <button key={a.nombre}
                      onClick={() => { setArea(a.nombre); setAreaConfig(a); setRegistro(null); setTipoFicha(null); setGenero(null); setMomento(null); track('area_seleccionada', { area: a.nombre, grado: gradoData?.grado }); }}
                      style={{ width: "100%", padding: "14px 16px", textAlign: "left", border: "none", borderBottom: `1px solid ${C.bordeHover}`, background: activo ? C.verdeClaroBg : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "background 0.15s", fontFamily: "'Lexend', sans-serif" }}
                      onMouseEnter={e => { if (!activo) e.currentTarget.style.background = "#F0FBF7"; }}
                      onMouseLeave={e => { if (!activo) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ fontSize: 24, flexShrink: 0, color: activo ? C.verdeOscuro : a.color, display: "flex", alignItems: "center" }}>{a.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: activo ? 700 : 500, color: C.textoPrincipal }}>{a.nombre}</div>
                        <div style={{ fontSize: 11, color: C.textoMuted, marginTop: 2 }}>{a.desc}</div>
                      </div>
                      {activo && <CaretRight size={18} weight="bold" color={C.verdeAcento} />}
                    </button>
                  );
                })}
              </div>

              {/* Columna 3: Contenido */}
              <div style={{ flex: isMobile ? undefined : 1, width: isMobile ? "100%" : undefined, display: isMobile && mobileStep !== 2 ? "none" : undefined, overflowY: "auto", borderRight: isMobile ? "none" : `1px solid ${C.bordeSuave}`, background: "#fff" }}>
                <div style={{ padding: "10px 16px 8px", fontSize: 10, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: `1px solid ${C.bordeSuave}`, background: C.fondoApp }}>
                  Contenido{area ? ` · ${area}` : ""}
                </div>
                {!area ? (
                  <p style={{ padding: "20px 16px", fontSize: 12, color: C.textoMuted, fontStyle: "italic" }}>Elegí un área</p>
                ) : (
                  <div style={{ padding: "12px 16px" }}>
                    <AcordeonBloques
                      bloques={bloquesDisponibles}
                      contenidosPorBloque={contenidosPorBloque}
                      registroSeleccionado={registro}
                      onSelect={(r) => {
                        setRegistro(r);
                        if (r.area === "Prácticas del Lenguaje") {
                          const tipo = pdlBloqueATipo(r.bloque);
                          if (tipo) { setTipoFicha(tipo); setGenero(r.subtema || r.item_original); }
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Columna 4: Configuración */}
              <aside style={{ width: isMobile ? "100%" : 260, display: isMobile && mobileStep !== 3 ? "none" : "flex", flexShrink: 0, background: C.fondoCard, borderLeft: isMobile ? "none" : `1px solid ${C.bordeSuave}`, borderTop: isMobile ? `1px solid ${C.bordeSuave}` : "none", flexDirection: "column", padding: 20, overflowY: "auto" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 14px" }}>Tu configuración</p>
                {[
                  { label: "Grado",     val: gradoData ? `${gradoData.num} grado` : null },
                  { label: "Área",      val: area },
                  { label: "Contenido", val: registro?.subtema || registro?.item_original },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.bordeHover}` }}>
                    <span style={{ fontSize: 11, color: C.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {val ? (
                        <>
                          <span style={{ fontSize: 12, fontWeight: 600, color: C.textoPrincipal, maxWidth: 110, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
                          <Check size={16} weight="bold" color={C.verdeAcento} />
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: C.textoDisabled, fontStyle: "italic" }}>—</span>
                      )}
                    </div>
                  </div>
                ))}
                <div style={{ flex: 1, marginTop: 20, minHeight: 0 }}>
                  <FichaSkeletonDynamic momento="Presentación" />
                </div>
                <button
                  disabled={!registro}
                  onClick={() => irAPaso(4, () => {})}
                  style={{
                    width: "100%", padding: "14px 0", marginTop: 16,
                    background: registro ? C.verdeOscuro : C.bordeSuave,
                    color: registro ? "#fff" : C.textoDisabled,
                    border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                    cursor: registro ? "pointer" : "not-allowed",
                    transition: "all 0.2s", fontFamily: "'Lexend', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                  }}
                  onMouseEnter={e => { if (registro) e.currentTarget.style.background = C.verdeHoverBtn; }}
                  onMouseLeave={e => { if (registro) e.currentTarget.style.background = C.verdeOscuro; }}
                >
                  <span>Continuar</span>
                  <ArrowRight size={18} weight="bold" />
                </button>
              </aside>
            </div>
            </>
          )}

          {/* ── GRID: paso 4 + generando ── */}
          {(paso === 4 || generando) && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 340px",
            minHeight: "calc(100vh - 60px)",
          }}>
            {/* Main */}
            <main style={{
              padding: isMobile ? "28px 16px 80px" : "40px 36px 80px",
              minWidth: 0, order: isMobile ? 1 : 0,
            }}>

              {/* Buscador (visible en pasos 1-3, oculto en 4) */}
              {paso < 4 && (
                <div style={{ marginBottom: 28 }}>
                  <Buscador
                    value={busqueda}
                    onChange={setBusqueda}
                    onFocus={() => setBusquedaFocused(true)}
                    onBlur={() => setTimeout(() => setBusquedaFocused(false), 150)}
                    focused={busquedaFocused}
                    onClear={() => setBusqueda("")}
                    placeholder='Buscá directo: "fracciones 4to", "sistema digestivo 6to"...'
                    grande={false}
                  />
                  {renderResultados()}
                </div>
              )}

              {/* Chips de selección activa */}
              {gradoData && paso > 1 && !generando && (
                <ChipSeleccion label="GRADO" valor={`${gradoData.num} grado`} onClick={() => cambiarDesde(1)} />
              )}
              {area && paso > 2 && !generando && (
                <ChipSeleccion label="ÁREA" valor={area} onClick={() => cambiarDesde(2)} />
              )}
              {registro && paso > 3 && !generando && (
                <ChipSeleccion label="CONTENIDO" valor={registro.subtema || registro.item_original} onClick={() => cambiarDesde(3)} />
              )}
              {area === "Prácticas del Lenguaje" && tipoFicha && genero && paso > 3 && !generando && (
                <ChipSeleccion label="CONTENIDO" valor={`${tipoFicha} · ${genero}`} onClick={() => cambiarDesde(3)} />
              )}

              {/* Separador */}
              {paso > 1 && !generando && (
                <div style={{ height: 1, background: C.bordeSuave, margin: "16px 0 24px" }} />
              )}

              {/* Error */}
              {error && !generando && (
                <div style={{
                  background: "#fee2e2", border: "1px solid #fca5a5",
                  borderRadius: 12, padding: "12px 18px", marginBottom: 24,
                  fontSize: 13, color: "#991b1b", animation: "fadeUp 0.3s both",
                }}>{error}</div>
              )}





              {/* ── PASO 4: Opciones + Generar ── */}
              {paso === 4 && !generando && (
                <PasoWrap onMount={(el) => { pasoWrapEl.current = el; }}>
                  <button onClick={() => cambiarDesde(3)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: C.textoMuted, padding: 0, marginBottom: 16, fontFamily: "'Lexend', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                    <ArrowLeft size={14} weight="bold" />
                    <span>Volver</span>
                  </button>

                  {/* Momento didáctico / Fase — condicional según área y tipo PDL */}
                  {momentoConfig.mostrar && (
                    <>
                      <p style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px" }}>{momentoConfig.label}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                        {momentoConfig.opciones.map((op) => (
                          <button key={op} onClick={() => setMomento(momento === op ? null : op)} style={{
                            border: `1.5px solid ${momento === op ? "#00c48c" : "#D4E6DE"}`,
                            background: momento === op ? "#00c48c" : "#fff",
                            color: "#004733",
                            borderRadius: 999, padding: "7px 16px", fontSize: 14, cursor: "pointer",
                            transition: "all 0.2s ease", fontFamily: "'Lexend', sans-serif",
                            fontWeight: momento === op ? 700 : 400,
                            boxShadow: momento === op ? "0 2px 8px rgba(0,196,140,0.25)" : "none",
                          }}
                            onMouseEnter={e => { if (momento !== op) { e.currentTarget.style.background = "#E6FAF3"; e.currentTarget.style.borderColor = "#00c48c"; } }}
                            onMouseLeave={e => { if (momento !== op) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#D4E6DE"; } }}
                          >{op}</button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Nivel del grupo */}
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px" }}>Nivel del grupo</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                    {["Necesita más apoyo", "Sin adaptación", "Puede ir más lejos"].map((op) => (
                      <button key={op} onClick={() => setNivelGrupo(nivelGrupo === op ? null : op)} style={{
                        border: `1.5px solid ${nivelGrupo === op ? "#00c48c" : "#D4E6DE"}`,
                        background: nivelGrupo === op ? "#00c48c" : "#fff",
                        color: "#004733",
                        borderRadius: 999, padding: "7px 16px", fontSize: 14, cursor: "pointer",
                        transition: "all 0.2s ease", fontFamily: "'Lexend', sans-serif",
                        fontWeight: nivelGrupo === op ? 700 : 400,
                        boxShadow: nivelGrupo === op ? "0 2px 8px rgba(0,196,140,0.25)" : "none",
                      }}
                        onMouseEnter={e => { if (nivelGrupo !== op) { e.currentTarget.style.background = "#E6FAF3"; e.currentTarget.style.borderColor = "#00c48c"; } }}
                        onMouseLeave={e => { if (nivelGrupo !== op) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#D4E6DE"; } }}
                      >{op}</button>
                    ))}
                  </div>


                  {/* Texto del docente — solo PDL Lectura */}
                  {isPDL && tipoFicha === "Lectura de textos" && (
                    <div style={{ margin: "20px 0 0" }}>
                      <button
                        onClick={() => { setShowTextoUploader(v => !v); if (showTextoUploader) setTextoDocente(""); }}
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: 10,
                          border: `1.5px solid ${showTextoUploader ? "#00c48c" : "#D4E6DE"}`,
                          background: showTextoUploader ? "#E6FAF3" : "#fff",
                          color: "#004733", fontSize: 13, fontWeight: 600,
                          cursor: "pointer", fontFamily: "'Lexend', sans-serif",
                          display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s",
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{showTextoUploader ? "✕" : "+"}</span>
                        {showTextoUploader ? "Quitar texto propio" : "Usar texto propio (opcional)"}
                      </button>

                      {showTextoUploader && (
                        <div style={{ marginTop: 10, padding: "14px", background: "#F7FDF9", borderRadius: 10, border: "1px solid #D4E6DE" }}>
                          <p style={{ fontSize: 12, color: "#4a6b60", margin: "0 0 12px", lineHeight: 1.5 }}>
                            La ficha usará tu texto en lugar de generar uno nuevo. Subí un PDF o Word, o pegá el texto directamente.
                          </p>
                          <label style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "9px 16px", borderRadius: 8,
                            border: "1.5px solid #D4E6DE", background: "#fff",
                            fontSize: 13, fontWeight: 600, color: "#004733",
                            cursor: cargandoTexto ? "wait" : "pointer",
                            fontFamily: "'Lexend', sans-serif", marginBottom: 10,
                          }}>
                            <input
                              type="file"
                              accept=".pdf,.docx"
                              style={{ display: "none" }}
                              onChange={e => { if (e.target.files[0]) extraerTextoArchivo(e.target.files[0]); }}
                            />
                            {cargandoTexto ? "⏳ Extrayendo..." : "📄 Subir PDF o Word"}
                          </label>
                          <textarea
                            value={textoDocente}
                            onChange={e => setTextoDocente(e.target.value)}
                            placeholder="O pegá el texto acá directamente..."
                            style={{
                              width: "100%", minHeight: 120,
                              border: "1.5px solid #D4E6DE", borderRadius: 8,
                              padding: "10px 12px", fontSize: 12, color: "#004733",
                              resize: "vertical", fontFamily: "'Lexend', sans-serif",
                              background: "#fff", outline: "none", boxSizing: "border-box",
                            }}
                            onFocus={e => { e.target.style.borderColor = "#00c48c"; }}
                            onBlur={e => { e.target.style.borderColor = "#D4E6DE"; }}
                          />
                          <p style={{ fontSize: 11, color: textoDocente.trim().split(/\s+/).filter(Boolean).length > 4500 ? "#F5A623" : "#4a6b60", textAlign: "right", margin: "4px 0 0" }}>
                            {textoDocente.trim() ? textoDocente.trim().split(/\s+/).filter(Boolean).length.toLocaleString() : 0} / 5.000 palabras
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Separador */}
                  <hr style={{ border: "none", borderTop: "1px solid #D4E6DE", margin: "20px 0" }} />

                  {/* Campo libre */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.textoPrincipal, margin: "0 0 8px" }}>
                      Algo más a tener en cuenta{" "}
                      <span style={{ fontSize: 11, color: C.textoSec, fontWeight: 400 }}>(opcional)</span>
                    </p>
                    <textarea
                      value={contextoLibre}
                      onChange={e => setContextoLibre(e.target.value)}
                      maxLength={150}
                      placeholder="Ej: hay alumnos con dislexia, el grupo no terminó el tema anterior…"
                      style={{
                        width: "100%", minHeight: 60, border: "1.5px solid #D4E6DE",
                        borderRadius: 10, outline: "none",
                        padding: "10px 14px", fontSize: 13, color: "#004733",
                        resize: "none", fontFamily: "'Lexend', sans-serif",
                        background: "#fff", transition: "border-color 0.2s",
                        boxSizing: "border-box",
                      }}
                      onFocus={e => { e.target.style.borderColor = "#00c48c"; }}
                      onBlur={e => { e.target.style.borderColor = "#D4E6DE"; }}
                    />
                    <p style={{ fontSize: 11, color: contextoLibre.length > 120 ? "#F5A623" : "#4a6b60", textAlign: "right", margin: "4px 0 0" }}>
                      {contextoLibre.length} / 150
                    </p>
                  </div>

                  <button
                    data-boton
                    onClick={generar}
                    style={{
                      width: "100%", padding: 18,
                      background: C.verdeOscuro, color: "#fff",
                      border: "none", borderRadius: 14,
                      fontSize: 16, fontWeight: 700,
                      cursor: "pointer", letterSpacing: "-0.2px",
                      marginTop: 20, transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow: "0 4px 16px rgba(0,71,51,0.18)",
                      position: "relative", overflow: "hidden",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = C.verdeHoverBtn;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,71,51,0.30)";
                      const shine = e.currentTarget.querySelector(".btn-shine");
                      if (shine) shine.style.animation = "btnShine 0.7s ease forwards";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = C.verdeOscuro;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,71,51,0.18)";
                      const shine = e.currentTarget.querySelector(".btn-shine");
                      if (shine) { shine.style.animation = "none"; }
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                    onMouseUp={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  >
                    <span className="btn-shine" style={{
                      position: "absolute", top: 0, left: 0,
                      width: "40%", height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                      animation: "none", pointerEvents: "none",
                    }} />
                    Generar ficha ✦
                  </button>
                  <p style={{ fontSize: 12, color: C.textoMuted, textAlign: "center", marginTop: 10 }}>
                    Tarda unos segundos · Alineada al Diseño Curricular PBA
                  </p>
                </PasoWrap>
              )}

              {/* ── Loading: skeleton + status pill ── */}
              {generando && (
                <div style={{ padding: "48px 0", animation: "fadeUp 0.4s both" }}>
                  {/* Status pill */}
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 10,
                      background: "#fff", border: `1px solid ${C.bordeSuave}`,
                      borderRadius: 99, padding: "10px 22px",
                      boxShadow: "0 2px 12px rgba(0,71,51,0.08)",
                      opacity: msgVisible ? 1 : 0, transition: "opacity 0.3s ease",
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.verdeAcento, animation: "pulse 1.2s ease-in-out infinite" }} />
                      <span style={{ fontSize: 13, color: C.textoPrincipal, fontWeight: 500 }}>{retryMessage || getMensaje(msgIdx)}</span>
                    </div>
                    <p style={{ fontSize: 11, color: C.textoMuted, marginTop: 8 }}>Promedio: ~30 segundos · No cierres la pestaña</p>
                  </div>

                  {/* Shimmer skeleton de la ficha */}
                  <div style={{ maxWidth: 580, margin: "0 auto", borderRadius: 10, overflow: "hidden", border: `2px solid ${C.verdeOscuro}`, boxShadow: "0 4px 24px rgba(0,30,20,0.1)" }}>
                    {/* Header skeleton */}
                    <div style={{ background: C.verdeOscuro, padding: "14px 18px" }}>
                      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                        {[52, 74, 96].map((w, i) => (
                          <div key={i} style={{ height: 16, width: w, borderRadius: 4, background: "rgba(0,196,140,0.25)", position: "relative", overflow: "hidden" }}>
                            <Shimmer delay={`${i * 0.2}s`} />
                          </div>
                        ))}
                      </div>
                      <div style={{ height: 18, width: "55%", borderRadius: 5, background: "rgba(255,255,255,0.2)", position: "relative", overflow: "hidden", marginBottom: 12 }}>
                        <Shimmer delay="0.1s" />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                        {[1, 2].map(i => (
                          <div key={i}>
                            <div style={{ height: 7, width: "40%", borderRadius: 3, background: "rgba(255,255,255,0.2)", marginBottom: 6, position: "relative", overflow: "hidden" }}><Shimmer delay={`${i * 0.15}s`} /></div>
                            <div style={{ borderBottom: "1.5px solid rgba(255,255,255,0.18)", height: 18 }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Body skeleton */}
                    <div style={{ padding: "16px 18px", background: "#fff", display: "flex", flexDirection: "column", gap: 16 }}>
                      {[1, 2].map(si => (
                        <div key={si}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.bordeSuave, position: "relative", overflow: "hidden" }}><Shimmer /></div>
                            <div style={{ height: 8, width: 90, borderRadius: 4, background: C.bordeSuave, position: "relative", overflow: "hidden" }}><Shimmer delay="0.1s" /></div>
                          </div>
                          <div style={{ background: si === 1 ? C.verdeClaroBg : "transparent", borderLeft: si === 1 ? `3px solid ${C.bordeSuave}` : "none", borderRadius: "0 5px 5px 0", padding: si === 1 ? "10px 12px" : "0", display: "flex", flexDirection: "column", gap: 6 }}>
                            {[95, 82, 70, 55].slice(0, si === 1 ? 4 : 2).map((w, i) => (
                              <div key={i} style={{ height: 6, width: `${w}%`, borderRadius: 3, background: C.bordeSuave, position: "relative", overflow: "hidden" }}>
                                <Shimmer delay={`${i * 0.12}s`} />
                              </div>
                            ))}
                            {si === 2 && [1, 2].map(j => (
                              <div key={j} style={{ height: 28, border: `1px solid ${C.bordeSuave}`, borderRadius: 5, position: "relative", overflow: "hidden" }}>
                                <Shimmer delay={`${j * 0.2}s`} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Footer skeleton */}
                    <div style={{ background: C.fondoApp, borderTop: `1px solid ${C.bordeSuave}`, padding: "8px 18px", display: "flex", justifyContent: "space-between" }}>
                      <div style={{ height: 7, width: 80, borderRadius: 3, background: C.bordeSuave, position: "relative", overflow: "hidden" }}><Shimmer /></div>
                      <div style={{ height: 7, width: 100, borderRadius: 3, background: C.bordeSuave, position: "relative", overflow: "hidden" }}><Shimmer delay="0.2s" /></div>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside style={{
              background: C.fondoCard,
              borderLeft: isMobile ? "none" : `1px solid ${C.bordeSuave}`,
              borderTop: isMobile ? `1px solid ${C.bordeSuave}` : "none",
              padding: 24, display: "flex", flexDirection: "column", gap: 14,
              position: isMobile ? "static" : "sticky",
              top: isMobile ? "auto" : 60,
              height: isMobile ? "auto" : "calc(100vh - 60px)",
              overflowY: "auto", order: isMobile ? 2 : 0,
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 12px" }}>
                Vista previa · {momento || "Presentación"}
              </p>
              <FichaSkeletonDynamic momento={momento || "Presentación"} />

              <a
                href="https://www.abc.gob.ar/secretarias/sites/default/files/2024-07/diseno-curricular-primaria-2018.pdf"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.verdeTexto,
                  background: C.verdeClaroBg, border: `1px solid ${C.verdeClaroBorder}`,
                  borderRadius: 10, padding: "10px 14px", textDecoration: "none", transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.verdeAcento, flexShrink: 0 }} />
                Alineado al Diseño Curricular PBA 2018 ↗
              </a>
            </aside>
          </div>
          )}
        </>
      )}
    </div>
  );
}
