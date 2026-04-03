import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import curricularData from "../../dc_pba_base_curricular_corregida.json";
import Logo from "./Logo.jsx";

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
  "Matemática":             { emoji: "🔢", bg: "#E8F0FF", border: "#C5D5FF", desc: "Números, geometría, medidas" },
  "Prácticas del Lenguaje": { emoji: "📖", bg: "#FFF0E8", border: "#FFD5B8", desc: "Lectura, escritura, oralidad" },
  "Ciencias Naturales":     { emoji: "🔬", bg: "#E8FFF4", border: "#B8FFDC", desc: "Seres vivos, cuerpo, materiales" },
  "Ciencias Sociales":      { emoji: "🌍", bg: "#FEF9E0", border: "#FDE98A", desc: "Historia, geografía, sociedad" },
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
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        background: C.verdeOscuro, display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg viewBox="0 0 12 10" fill="none" width="10" height="10">
          <polyline points="1,5 4,8 11,1" stroke={C.verdeAcento} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
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
      }}>Cambiar</span>
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
        gap: 10, borderRadius: 16, padding: 28,
        cursor: "pointer", textAlign: "left", transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        border: activo ? `2px solid ${C.verdeOscuro}` : `1.5px solid ${hov ? C.verdeOscuro : a.border}`,
        background: a.bg,
        transform: (hov || activo) ? "translateY(-3px) scale(1.02)" : "none",
        boxShadow: (hov || activo) ? "0 8px 24px rgba(0,71,51,0.10)" : "none",
        opacity: 1, visibility: "visible",
      }}
    >
      <span style={{ fontSize: 52, lineHeight: 1 }}>{a.emoji}</span>
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
              <span style={{
                fontSize: 14, color: abierto ? C.verdeAcento : C.textoDisabled,
                transform: abierto ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s, color 0.2s", display: "inline-block",
              }}>›</span>
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
                      {activo && <span style={{ fontSize: 12, color: C.verdeAcento, flexShrink: 0, marginLeft: 8 }}>✓</span>}
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

function SidebarPreview({ gradoData, area, registro, tipoFicha, genero, incluirExplicacion, incluirEjemplo }) {
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
  let blockNum = 1;
  const blocks = [
    incluirExplicacion ? { num: blockNum++, name: "Explicación", type: "explanation" } : null,
    incluirEjemplo     ? { num: blockNum++, name: "Ejemplo",     type: "example" }     : null,
    { num: blockNum++, name: "Actividad",  type: "activity" },
    { num: blockNum,   name: "Reflexión",  type: "reflection" },
  ].filter(Boolean);

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
              display: "flex", alignItems: "center", gap: 4,
              background: C.verdeClaroBg, borderRadius: "4px 4px 0 0", padding: "3px 7px",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.verdeTexto }}>{block.num}</span>
              <span style={{ fontSize: 11, color: C.textoMuted }}>{block.name}</span>
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
      <svg width={grande ? 20 : 16} height={grande ? 20 : 16} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="7" cy="7" r="5" stroke={focused ? C.verdeAcento : C.textoMuted} strokeWidth="1.5" />
        <path d="M11 11l3 3" stroke={focused ? C.verdeAcento : C.textoMuted} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
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
        <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", color: C.textoMuted, fontSize: 18, padding: 0, lineHeight: 1, flexShrink: 0 }}>×</button>
      )}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────

export default function Generador({ onFichaGenerada, onVolver }) {
  const [paso, setPaso] = useState(0);       // 0=home, 1=grado, 2=área, 3=contenido, 4=opciones
  const [gradoData, setGradoData] = useState(null);
  const [area, setArea] = useState(null);
  const [areaConfig, setAreaConfig] = useState(null);
  const [registro, setRegistro] = useState(null);
  const [incluirExplicacion, setIncluirExplicacion] = useState(true);
  const [incluirEjemplo, setIncluirEjemplo] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaFocused, setBusquedaFocused] = useState(false);
  const [busquedaGrado, setBusquedaGrado] = useState(null);
  const [tipoFicha, setTipoFicha] = useState(null);
  const [genero, setGenero] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [mensajeLoading, setMensajeLoading] = useState(0);
  const [error, setError] = useState(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Ref al elemento DOM del PasoWrap actual (para salirPaso)
  const pasoWrapEl = useRef(null);

  const curricular = curricularData;
  const gradoNum = gradoData?.valores[0] || "1";

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
  const generarConPayload = async (payload, registroParaFicha, isRetry) => {
    const timer4s = setTimeout(() => setMensajeLoading(1), 4000);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      clearTimeout(timer4s);
      if (!res.ok) throw new Error("Error en el servidor");
      const resultado = await res.json();

      if (!isRetry && resultado.validacion?.observaciones?.length > 0) {
        setMensajeLoading(0);
        await generarConPayload(payload, registroParaFicha, true);
      } else {
        setMensajeLoading(2);
        setTimeout(() => {
          setGenerando(false); setError(null);
          onFichaGenerada(resultado.ficha, registroParaFicha, null);
        }, 1000);
      }
    } catch {
      clearTimeout(timer4s);
      setGenerando(false); setMensajeLoading(0);
      setError("No se pudo generar la ficha. Verificá tu conexión e intentá de nuevo.");
    }
  };

  const generar = async () => {
    const isPDL = area === "Prácticas del Lenguaje";
    if (isPDL ? (!tipoFicha || !genero) : !registro) return;
    setGenerando(true); setMensajeLoading(0); setError(null);

    let payload, registroParaFicha;
    if (isPDL) {
      payload = {
        contenido: { grado: gradoNum, area, tipoTexto: genero },
        tipoFicha, incluirExplicacion, incluirEjemplo,
      };
      registroParaFicha = {
        id: `pdl_${gradoNum}_${tipoFicha}_${genero}`,
        grado: gradoNum, area,
        bloque: tipoFicha, item_original: genero,
      };
    } else {
      payload = {
        contenido: {
          grado: registro.grado, area: registro.area, bloque: registro.bloque,
          item_original: registro.item_original,
          subtema: registro.subtema || registro.item_original,
          objetivo_especifico: registro.objetivo_especifico,
          contexto_pedagogico: `Incluir explicación: ${incluirExplicacion}. Incluir ejemplo: ${incluirEjemplo}.`,
        },
        tipoFicha: "ficha de trabajo", incluirExplicacion, incluirEjemplo,
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
              <Logo size={32} />
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
          {/* Navbar simplificada */}
          <nav style={{
            background: C.verdeOscuro, padding: "14px 28px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 10,
          }}>
            <button onClick={paso <= 1 ? () => cambiarDesde(0) : onVolver} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <Logo size={32} color="#ffffff" />
            </button>
            <button
              onClick={() => cambiarDesde(paso - 1)}
              style={{
                fontSize: 12, color: "rgba(255,255,255,0.7)",
                background: "none", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 99, padding: "5px 14px", cursor: "pointer",
                fontFamily: "'Lexend', sans-serif", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >
              ‹ volver
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

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
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

              {/* ── PASO 1: Grado ── */}
              {paso === 1 && (
                <PasoWrap onMount={(el) => { pasoWrapEl.current = el; }}>
                  <PreguntaHeader pregunta="¿Con qué grado trabajamos hoy?" sub="Elegí el año de la primaria" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {GRADOS.map((g) => (
                      <GradoBtn key={g.num} g={g} activo={gradoData?.num === g.num}
                        onClick={() => {
                          irAPaso(2, () => {
                            setGradoData(g);
                            setArea(null); setAreaConfig(null); setRegistro(null);
                          });
                        }}
                      />
                    ))}
                  </div>
                </PasoWrap>
              )}

              {/* ── PASO 2: Área ── */}
              {paso === 2 && (
                <PasoWrap onMount={(el) => { pasoWrapEl.current = el; }}>
                  <button onClick={() => cambiarDesde(1)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: C.textoMuted, padding: 0, marginBottom: 16, fontFamily: "'Lexend', sans-serif" }}>‹ Volver</button>
                  <PreguntaHeader pregunta="¿Qué área trabajamos?" sub={`${gradoData?.num} · elegí la materia`} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {areasDisponibles.map((a) => (
                      <AreaBtn key={a.nombre} a={a} activo={area === a.nombre}
                        onClick={() => {
                          irAPaso(3, () => {
                            setArea(a.nombre); setAreaConfig(a);
                            setRegistro(null); setBusqueda("");
                          });
                        }}
                      />
                    ))}
                  </div>
                </PasoWrap>
              )}

              {/* ── PASO 3: Contenido — áreas no-PDL ── */}
              {paso === 3 && area !== "Prácticas del Lenguaje" && (
                <PasoWrap onMount={(el) => { pasoWrapEl.current = el; }}>
                  <button onClick={() => cambiarDesde(2)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: C.textoMuted, padding: 0, marginBottom: 16, fontFamily: "'Lexend', sans-serif" }}>‹ Volver</button>
                  <PreguntaHeader
                    pregunta={`¿Qué contenido de ${area}?`}
                    sub="Diseño Curricular PBA · elegí el bloque y el objetivo"
                  />
                  <AcordeonBloques
                    bloques={bloquesDisponibles}
                    contenidosPorBloque={contenidosPorBloque}
                    registroSeleccionado={registro}
                    onSelect={(r) => { irAPaso(4, () => setRegistro(r)); }}
                  />
                </PasoWrap>
              )}

              {/* ── PASO 3: PDL cascada ── */}
              {paso === 3 && area === "Prácticas del Lenguaje" && (
                <PasoWrap onMount={(el) => { pasoWrapEl.current = el; }}>
                  <button onClick={() => cambiarDesde(2)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: C.textoMuted, padding: 0, marginBottom: 16, fontFamily: "'Lexend', sans-serif" }}>‹ Volver</button>
                  {!tipoFicha ? (
                    <>
                      <PreguntaHeader pregunta="¿Qué tipo de ficha?" sub={`Prácticas del Lenguaje · ${gradoData?.num}`} />
                      {PDL_TIPOS.map((tipo) => (
                        <button key={tipo} onClick={() => setTipoFicha(tipo)} style={{
                          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                          background: C.fondoCard, border: `1px solid ${C.bordeSuave}`,
                          borderRadius: 12, padding: "14px 18px", cursor: "pointer", marginBottom: 8,
                          fontSize: 15, fontWeight: 600, color: C.textoPrincipal, textAlign: "left",
                          transition: "all 0.15s", boxShadow: "0 1px 4px rgba(0,71,51,0.04)",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#F0FBF7"; e.currentTarget.style.borderColor = C.verdeAcento; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,71,51,0.10)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.fondoCard; e.currentTarget.style.borderColor = C.bordeSuave; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,71,51,0.04)"; }}
                        >
                          {tipo}
                          <span style={{ fontSize: 18, color: C.textoDisabled }}>›</span>
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <PreguntaHeader
                        pregunta={tipoFicha === "Ortografía" ? "¿Qué regla ortográfica?" : "¿Qué tipo de texto?"}
                        sub={tipoFicha}
                      />
                      <button onClick={() => setTipoFicha(null)} style={{
                        display: "flex", alignItems: "center", gap: 4,
                        fontSize: 13, color: C.textoMuted, background: "none", border: "none",
                        cursor: "pointer", padding: "0 0 16px", fontFamily: "'Lexend', sans-serif",
                      }}
                        onMouseEnter={e => e.currentTarget.style.color = C.textoPrincipal}
                        onMouseLeave={e => e.currentTarget.style.color = C.textoMuted}
                      >
                        ‹ volver a tipos
                      </button>
                      {getPDLGeneros(tipoFicha, gradoNum).map((gen) => (
                        <button key={gen} onClick={() => { irAPaso(4, () => setGenero(gen)); }} style={{
                          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                          background: C.fondoCard, border: `1px solid ${C.bordeSuave}`,
                          borderRadius: 12, padding: "13px 18px", cursor: "pointer", marginBottom: 8,
                          fontSize: 14, fontWeight: 400, color: C.textoSec, textAlign: "left",
                          transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#F0FBF7"; e.currentTarget.style.borderColor = C.verdeAcento; e.currentTarget.style.color = C.textoPrincipal; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.fondoCard; e.currentTarget.style.borderColor = C.bordeSuave; e.currentTarget.style.color = C.textoSec; }}
                        >
                          {gen}
                          <span style={{ fontSize: 18, color: C.textoDisabled }}>›</span>
                        </button>
                      ))}
                    </>
                  )}
                </PasoWrap>
              )}

              {/* ── PASO 4: Opciones + Generar ── */}
              {paso === 4 && !generando && (
                <PasoWrap onMount={(el) => { pasoWrapEl.current = el; }}>
                  <button onClick={() => cambiarDesde(3)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: C.textoMuted, padding: 0, marginBottom: 16, fontFamily: "'Lexend', sans-serif" }}>‹ Volver</button>
                  <Toggle
                    on={incluirExplicacion}
                    onChange={(v) => { setIncluirExplicacion(v); if (!v) setIncluirEjemplo(false); }}
                    title="Incluir explicación del tema"
                    desc="Agrega un párrafo explicativo antes de las actividades"
                  />
                  <div style={{ opacity: incluirExplicacion ? 1 : 0.45, transition: "opacity 0.2s" }}>
                    <Toggle
                      on={incluirEjemplo && incluirExplicacion}
                      onChange={(v) => { if (incluirExplicacion) setIncluirEjemplo(v); }}
                      title="Incluir ejemplo concreto"
                      desc="Agrega un ejemplo cercano a la experiencia del alumno"
                    />
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

              {/* ── Loading ── */}
              {generando && (
                <div style={{ padding: "48px 0", animation: "fadeUp 0.4s both" }}>
                  <div style={{
                    background: C.verdeClaroBg, borderRadius: 20,
                    padding: "44px 36px", textAlign: "center", maxWidth: 420, margin: "0 auto",
                  }}>
                    <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 32px" }}>
                      <div style={{
                        position: "absolute", inset: 0,
                        border: "4px solid rgba(0,196,140,0.2)",
                        borderTopColor: C.verdeAcento, borderRadius: "50%",
                        animation: "spin 1.8s linear infinite",
                      }} />
                      <span style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                      }}>✏️</span>
                    </div>
                    <p style={{
                      fontSize: 17, fontWeight: 700, color: C.textoPrincipal,
                      marginBottom: 24, minHeight: 28,
                      opacity: msgVisible ? 1 : 0, transition: "opacity 0.3s ease",
                    }}>{getMensaje(msgIdx)}</p>
                    <div style={{ height: 5, background: "rgba(0,196,140,0.2)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", background: C.verdeAcento, borderRadius: 999,
                        width: mensajeLoading === 0 ? "30%" : mensajeLoading === 1 ? "75%" : "100%",
                        transition: "width 1.5s ease",
                      }} />
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
              <SidebarPreview
                gradoData={gradoData} area={area} areaConfig={areaConfig}
                registro={registro} tipoFicha={tipoFicha} genero={genero}
                incluirExplicacion={incluirExplicacion} incluirEjemplo={incluirEjemplo}
              />

              <div style={{ background: C.fondoApp, borderRadius: 12, padding: "14px 16px" }}>
                {[
                  { key: "Grado",    val: gradoData?.num },
                  { key: "Área",     val: area },
                  { key: "Contenido", val: area === "Prácticas del Lenguaje"
                    ? (genero ? `${tipoFicha} · ${genero}` : tipoFicha)
                    : (registro?.subtema || registro?.item_original) },
                ].map(({ key, val }) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: C.textoMuted, flexShrink: 0 }}>{key}</span>
                    <span style={{
                      fontSize: 11, color: val ? C.textoPrincipal : "#C4D9D0",
                      fontWeight: val ? 600 : 400, fontStyle: val ? "normal" : "italic",
                      textAlign: "right", maxWidth: 150,
                      overflow: "hidden", textOverflow: "ellipsis",
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    }}>{val || "—"}</span>
                  </div>
                ))}
              </div>

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
        </>
      )}
    </div>
  );
}
