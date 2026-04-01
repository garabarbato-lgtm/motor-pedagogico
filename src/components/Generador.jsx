import { useState, useMemo, useEffect } from "react";
import curricularData from "../../dc_pba_base_curricular_corregida.json";
import Logo from "./Logo.jsx";

// ── Paleta de colores ──────────────────────────────────────────────────────
const C = {
  verdeOscuro:    "#004733",
  verdeAcento:    "#00c48c",
  verdeClaroBg:   "#E6FAF3",
  verdeClaroBorder:"#5DCAA5",
  verdeTexto:     "#085041",
  verdeHoverBtn:  "#00603d",
  fondoApp:       "#F0F4F2",
  fondoCard:      "#ffffff",
  bordeSuave:     "#D4E6DE",
  bordeHover:     "#EBF2EE",
  textoPrincipal: "#004733",
  textoSec:       "#4a6b60",
  textoMuted:     "#6B8C7D",
  textoDisabled:  "#A0BDB5",
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

// ── Datos PDL (cascada hardcodeada) ────────────────────────────────────────
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
  // Lectura y Escritura
  if (g <= 2) return ["Cuento", "Fábula", "Poesía", "Texto informativo"];
  return ["Cuento", "Fábula", "Leyenda", "Poesía", "Obra de teatro", "Historieta", "Noticia", "Texto informativo"];
}

// ── Sub-componentes ────────────────────────────────────────────────────────

function Chip({ label, valor, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        background: hov ? "#F8FDFB" : C.fondoCard,
        border: `0.5px solid ${hov ? C.verdeAcento : C.bordeSuave}`,
        borderRadius: 10, padding: "9px 14px",
        cursor: "pointer", marginBottom: 6,
        transition: "all 0.15s", textAlign: "left",
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%",
        background: C.verdeOscuro, display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg viewBox="0 0 12 10" fill="none" width="10" height="10">
          <polyline points="1,5 4,8 11,1" stroke={C.verdeAcento} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, color: C.textoMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{label}</p>
        <p style={{ fontSize: 13, color: C.textoPrincipal, fontWeight: 500, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{valor}</p>
      </div>
      <span style={{
        fontSize: 11,
        color: hov ? C.verdeAcento : C.textoDisabled,
        background: hov ? C.verdeOscuro : C.fondoApp,
        padding: "2px 8px", borderRadius: 99, flexShrink: 0,
        transition: "all 0.15s",
      }}>Cambiar</span>
    </button>
  );
}

function PasoWrap({ children }) {
  return (
    <div style={{ animation: "fadeUp 0.32s cubic-bezier(.22,1,.36,1) both" }}>
      {children}
    </div>
  );
}

function PreguntaHeader({ pregunta, sub }) {
  return (
    <div style={{ marginBottom: sub ? 0 : 20 }}>
      <h2 style={{
        fontFamily: "Georgia, serif",
        fontSize: 21, fontWeight: 400,
        color: C.textoPrincipal, letterSpacing: "-0.02em",
        lineHeight: 1.25, margin: "0 0 6px",
      }}>{pregunta}</h2>
      {sub && <p style={{ fontSize: 13, color: C.textoMuted, marginBottom: 20, lineHeight: 1.5, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function GradoBtn({ g, activo, onClick }) {
  const [hov, setHov] = useState(false);
  const isActive = activo;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "18px 10px", borderRadius: 14,
        border: isActive ? `2px solid ${C.verdeOscuro}` : `1.5px solid ${hov ? C.verdeAcento : C.bordeSuave}`,
        background: isActive ? C.verdeOscuro : (hov ? "#F0FBF7" : C.fondoCard),
        cursor: "pointer", transition: "all 0.18s",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        transform: (hov || isActive) ? "translateY(-2px)" : "none",
      }}
    >
      <span style={{
        fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, lineHeight: 1,
        color: isActive ? "#fff" : C.verdeOscuro,
        transition: "color 0.18s",
      }}>{g.num}</span>
      <span style={{
        fontSize: 9, textAlign: "center", lineHeight: 1.4,
        color: isActive ? C.verdeAcento : C.textoMuted,
        transition: "color 0.18s",
      }}>{g.ciclo}</span>
    </button>
  );
}

function AreaBtn({ a, activo, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 14, padding: 16,
        cursor: "pointer",
        display: "flex", alignItems: "flex-start", gap: 12,
        transition: "all 0.18s",
        border: activo ? `2px solid ${C.verdeOscuro}` : `1.5px solid ${hov ? C.verdeOscuro : a.border}`,
        background: a.bg,
        transform: (hov || activo) ? "translateY(-2px)" : "none",
        filter: hov && !activo ? "brightness(0.96)" : "none",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{a.emoji}</span>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.verdeOscuro, margin: "0 0 2px" }}>{a.nombre}</p>
        <p style={{ fontSize: 11, color: C.textoSec, lineHeight: 1.4, margin: 0 }}>{a.desc}</p>
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
        display: "flex", alignItems: "flex-start", gap: 14,
        background: on ? C.verdeClaroBg : (hov ? "#F8FDFB" : C.fondoCard),
        border: `0.5px solid ${on ? C.verdeOscuro : (hov ? C.verdeAcento : C.bordeSuave)}`,
        borderRadius: 12, padding: "14px 16px",
        cursor: "pointer", marginBottom: 8,
        transition: "all 0.15s", userSelect: "none",
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: C.textoPrincipal, margin: "0 0 2px" }}>{title}</p>
        <p style={{ fontSize: 12, color: C.textoMuted, lineHeight: 1.5, margin: 0 }}>{desc}</p>
      </div>
      <div style={{
        width: 40, height: 22, borderRadius: 99,
        background: on ? C.verdeOscuro : C.bordeSuave,
        position: "relative", flexShrink: 0, marginTop: 2,
        transition: "background 0.2s",
      }}>
        <div style={{
          position: "absolute", top: 3, left: 3,
          width: 16, height: 16, borderRadius: "50%",
          background: "#fff",
          transform: on ? "translateX(18px)" : "translateX(0)",
          transition: "transform 0.2s",
        }} />
      </div>
    </div>
  );
}

function AcordeonBloques({ bloques, contenidosPorBloque, registroSeleccionado, onSelect }) {
  const [bloqueAbierto, setBloqueAbierto] = useState(null);

  return (
    <div>
      {bloques.map((b) => {
        const abierto = bloqueAbierto === b;
        const items = contenidosPorBloque[b] || [];
        return (
          <div key={b} style={{
            background: C.fondoCard,
            border: `0.5px solid ${C.bordeSuave}`,
            borderRadius: 12, overflow: "hidden", marginBottom: 6,
          }}>
            <button
              onClick={() => setBloqueAbierto(abierto ? null : b)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px",
                background: abierto ? C.verdeClaroBg : C.fondoCard,
                border: "none", borderBottom: abierto ? `0.5px solid #D4EEE3` : "none",
                cursor: "pointer", textAlign: "left",
                fontSize: 13, fontWeight: 500, color: C.textoPrincipal,
                minHeight: 44, transition: "background 0.12s",
              }}
              onMouseEnter={e => { if (!abierto) e.currentTarget.style.background = "#F0FBF7"; }}
              onMouseLeave={e => { if (!abierto) e.currentTarget.style.background = C.fondoCard; }}
            >
              <span>{b}</span>
              <span style={{
                fontSize: 12,
                color: abierto ? C.verdeAcento : C.textoDisabled,
                transform: abierto ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s, color 0.2s",
                display: "inline-block",
              }}>›</span>
            </button>
            {abierto && (
              <div>
                {items.map((r, i) => {
                  const activo = registroSeleccionado?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => onSelect(r)}
                      style={{
                        width: "100%",
                        padding: "10px 16px 10px 28px",
                        fontSize: 13,
                        color: activo ? C.textoPrincipal : C.textoSec,
                        fontWeight: activo ? 500 : 400,
                        background: activo ? C.verdeClaroBg : C.fondoCard,
                        border: "none",
                        borderTop: `0.5px solid ${C.bordeHover}`,
                        cursor: "pointer", textAlign: "left",
                        minHeight: 44,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        lineHeight: 1.4, transition: "background 0.1s",
                      }}
                      onMouseEnter={e => { if (!activo) { e.currentTarget.style.background = "#F0FBF7"; e.currentTarget.style.color = C.textoPrincipal; } }}
                      onMouseLeave={e => { if (!activo) { e.currentTarget.style.background = C.fondoCard; e.currentTarget.style.color = C.textoSec; } }}
                    >
                      <span>{r.item_original}</span>
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

function SidebarPreview({ gradoData, area, registro, incluirExplicacion, incluirEjemplo }) {
  const tituloFicha = registro
    ? registro.item_original
    : area
    ? `${area} · ${gradoData?.num}`
    : gradoData
    ? `${gradoData.num} grado`
    : null;

  const hasContent = !!registro;

  // Renumeración automática según toggles
  let blockNum = 1;
  const blocks = [
    incluirExplicacion ? { num: blockNum++, name: "Explicación", type: "explanation" } : null,
    incluirEjemplo     ? { num: blockNum++, name: "Ejemplo",     type: "example" }     : null,
    { num: blockNum++, name: "Actividad",  type: "activity" },
    { num: blockNum,   name: "Reflexión",  type: "reflection" },
  ].filter(Boolean);

  return (
    <div style={{
      background: C.fondoCard,
      borderRadius: 8,
      border: `0.5px solid ${C.bordeSuave}`,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,70,50,0.08)",
    }}>
      {/* Header hoja */}
      <div style={{ background: C.verdeOscuro, padding: "8px 12px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
          {[gradoData?.num, area, registro ? "contenido" : null].map((val, i) => (
            <span key={i} style={{
              fontSize: 9, padding: "2px 6px", borderRadius: 99,
              background: val ? C.verdeAcento : "rgba(255,255,255,0.15)",
              color: val ? C.verdeOscuro : "rgba(255,255,255,0.3)",
              fontWeight: 600,
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
      {/* Cuerpo */}
      <div style={{ padding: "8px 10px" }}>
        {blocks.map((block) => (
          <div key={block.name} style={{
            marginBottom: 6,
            opacity: hasContent ? 1 : 0.18,
            filter: hasContent ? "none" : "grayscale(1)",
            transition: "all 0.3s",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: C.verdeClaroBg, borderRadius: "4px 4px 0 0",
              padding: "3px 6px",
            }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: C.verdeTexto }}>{block.num}</span>
              <span style={{ fontSize: 8, color: C.textoMuted }}>{block.name}</span>
            </div>
            <div style={{
              background: "#fafafa", borderRadius: "0 0 4px 4px",
              padding: "4px 6px", border: `0.5px solid ${C.bordeHover}`,
            }}>
              {block.type === "explanation" && (
                <>{[80, 95, 70].map((w, i) => (
                  <div key={i} style={{ height: 3, borderRadius: 2, background: C.verdeAcento, opacity: 0.5, marginBottom: 3, width: `${w}%` }} />
                ))}</>
              )}
              {block.type === "example" && (
                <div style={{ height: 14, borderRadius: 3, background: C.verdeClaroBg, border: `0.5px solid ${C.verdeClaroBorder}` }} />
              )}
              {block.type === "activity" && (
                <>
                  <div style={{ height: 3, borderRadius: 2, background: C.verdeAcento, opacity: 0.4, marginBottom: 3, width: "90%" }} />
                  <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ flex: 1, height: 10, borderRadius: 2, border: `0.5px solid ${C.bordeSuave}` }} />
                    ))}
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: C.verdeAcento, opacity: 0.3, width: "75%" }} />
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

// ── Componente principal ───────────────────────────────────────────────────

export default function Generador({ onFichaGenerada, onVolver }) {
  const [paso, setPaso] = useState(1);
  const [gradoData, setGradoData] = useState(null);
  const [area, setArea] = useState(null);
  const [areaConfig, setAreaConfig] = useState(null);
  const [registro, setRegistro] = useState(null);
  const [incluirExplicacion, setIncluirExplicacion] = useState(true);
  const [incluirEjemplo, setIncluirEjemplo] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaFocused, setBusquedaFocused] = useState(false);
  const [tipoFicha, setTipoFicha] = useState(null);
  const [genero, setGenero] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [mensajeLoading, setMensajeLoading] = useState(0);
  const [error, setError] = useState(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const curricular = curricularData;
  const gradoNum = gradoData?.valores[0] || "1";

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Áreas disponibles
  const areasDisponibles = useMemo(() => {
    if (!gradoData) return [];
    const nombres = [...new Set(
      curricular.filter(r => gradoData.valores.includes(String(r.grado))).map(r => r.area)
    )];
    return nombres.map(nombre => ({ nombre, ...AREAS_CONFIG[nombre] })).filter(a => a.bg);
  }, [curricular, gradoData]);

  // Bloques disponibles
  const bloquesDisponibles = useMemo(() => {
    if (!gradoData || !area) return [];
    return [...new Set(
      curricular
        .filter(r => gradoData.valores.includes(String(r.grado)) && r.area === area)
        .map(r => r.bloque)
    )].sort();
  }, [curricular, gradoData, area]);

  // Contenidos por bloque
  const contenidosPorBloque = useMemo(() => {
    if (!gradoData || !area) return {};
    const result = {};
    bloquesDisponibles.forEach(b => {
      result[b] = curricular
        .filter(r => gradoData.valores.includes(String(r.grado)) && r.area === area && r.bloque === b)
        .sort((a, b) => a.item_original.localeCompare(b.item_original));
    });
    return result;
  }, [curricular, gradoData, area, bloquesDisponibles]);

  // Resultados de búsqueda
  const resultadosBusqueda = useMemo(() => {
    if (!busqueda.trim()) return null;
    const q = busqueda.trim().toLowerCase();
    let base = [...curricular];
    if (gradoData) base = base.filter(r => gradoData.valores.includes(String(r.grado)));
    if (area) base = base.filter(r => r.area === area);
    return base.filter(r =>
      r.item_original.toLowerCase().includes(q) ||
      r.bloque.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [busqueda, curricular, gradoData, area]);

  // Loading messages
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
    setMsgIdx(0);
    setMsgVisible(true);
    const interval = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIdx(prev => (prev + 1) % 10);
        setMsgVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, [generando]);

  // Cascade reset
  const cambiarDesde = (p) => {
    setPaso(p);
    if (p <= 1) {
      setGradoData(null); setArea(null); setAreaConfig(null); setRegistro(null);
      setTipoFicha(null); setGenero(null);
    } else if (p <= 2) {
      setArea(null); setAreaConfig(null); setRegistro(null);
      setTipoFicha(null); setGenero(null);
    } else if (p <= 3) {
      setRegistro(null);
      setTipoFicha(null); setGenero(null);
    }
    setBusqueda("");
    setError(null);
    setGenerando(false);
    setMensajeLoading(0);
  };

  // API
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
          setGenerando(false);
          setError(null);
          onFichaGenerada(resultado.ficha, registroParaFicha, null);
        }, 1000);
      }
    } catch (err) {
      clearTimeout(timer4s);
      setGenerando(false);
      setMensajeLoading(0);
      setError("No se pudo generar la ficha. Verificá tu conexión e intentá de nuevo.");
    }
  };

  const generar = async () => {
    const isPDL = area === "Prácticas del Lenguaje";
    if (isPDL ? (!tipoFicha || !genero) : !registro) return;
    setGenerando(true);
    setMensajeLoading(0);
    setError(null);

    let payload, registroParaFicha;

    if (isPDL) {
      payload = {
        contenido: {
          grado: gradoNum,
          area,
          tipoTexto: genero,
        },
        tipoFicha,
        incluirExplicacion,
        incluirEjemplo,
      };
      registroParaFicha = {
        id: `pdl_${gradoNum}_${tipoFicha}_${genero}`,
        grado: gradoNum,
        area,
        bloque: tipoFicha,
        item_original: genero,
      };
    } else {
      payload = {
        contenido: {
          grado: registro.grado,
          area: registro.area,
          bloque: registro.bloque,
          item: registro.item_original,
          contexto_pedagogico: `Incluir explicación: ${incluirExplicacion}. Incluir ejemplo: ${incluirEjemplo}.`,
        },
        tipoFicha: "ficha de trabajo",
        incluirExplicacion,
        incluirEjemplo,
      };
      registroParaFicha = registro;
    }

    await generarConPayload(payload, registroParaFicha, false);
  };

  const progreso = paso * 25;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Lexend', sans-serif", background: C.fondoApp, minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        background: C.verdeOscuro,
        padding: "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onVolver} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Logo size={28} color="#ffffff" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            {generando ? "Generando…" : `Paso ${paso} de 4`}
          </span>
          <div style={{ width: 100, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 99 }}>
            <div style={{
              height: "100%", background: C.verdeAcento, borderRadius: 99,
              width: `${progreso}%`,
              transition: "width 0.45s cubic-bezier(.22,1,.36,1)",
            }} />
          </div>
        </div>
      </nav>

      {/* Grid layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 260px",
        minHeight: "calc(100vh - 57px)",
      }}>

        {/* ── MAIN ── */}
        <main style={{
          padding: isMobile ? "24px 16px 80px" : "32px 28px 80px",
          minWidth: 0,
          order: isMobile ? 1 : 0,
        }}>

          {/* Buscador */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: C.fondoCard,
            border: `1.5px solid ${busquedaFocused || busqueda ? C.verdeAcento : C.bordeSuave}`,
            borderRadius: 12, padding: "10px 16px",
            marginBottom: busqueda && resultadosBusqueda ? 4 : 22,
            transition: "border-color 0.15s",
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke={C.textoMuted} strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke={C.textoMuted} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onFocus={() => setBusquedaFocused(true)}
              onBlur={() => setTimeout(() => setBusquedaFocused(false), 150)}
              placeholder={'Buscá directo: "fracciones 4to", "sistema digestivo 6to"...'}
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: 13, color: C.textoPrincipal,
                background: "transparent",
                fontFamily: "'Lexend', sans-serif",
              }}
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.textoMuted, fontSize: 16, padding: 0, lineHeight: 1 }}
              >×</button>
            )}
          </div>

          {/* Resultados búsqueda */}
          {busqueda && resultadosBusqueda && (
            <div style={{
              background: C.fondoCard,
              border: `0.5px solid ${C.bordeSuave}`,
              borderRadius: 12, marginBottom: 22,
              overflow: "hidden", animation: "fadeUp 0.2s both",
              boxShadow: "0 4px 12px rgba(0,70,50,0.08)",
            }}>
              {resultadosBusqueda.length === 0 ? (
                <p style={{ fontSize: 13, color: C.textoMuted, padding: "12px 16px", margin: 0, fontStyle: "italic" }}>
                  Sin resultados. Probá con otras palabras.
                </p>
              ) : resultadosBusqueda.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => {
                    const g = GRADOS.find(g => g.valores.includes(String(r.grado)));
                    if (g) setGradoData(g);
                    const ac = AREAS_CONFIG[r.area];
                    if (ac) { setArea(r.area); setAreaConfig(ac); }
                    setRegistro(r);
                    setBusqueda("");
                    setPaso(4);
                  }}
                  style={{
                    width: "100%", textAlign: "left", padding: "10px 16px",
                    borderTop: i > 0 ? `0.5px solid ${C.bordeHover}` : "none",
                    background: C.fondoCard, border: "none", cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F0FBF7"}
                  onMouseLeave={e => e.currentTarget.style.background = C.fondoCard}
                >
                  <p style={{ fontSize: 11, color: C.textoMuted, margin: "0 0 2px" }}>
                    {r.area} · {r.grado}° · {r.bloque}
                  </p>
                  <p style={{ fontSize: 13, color: C.textoPrincipal, fontWeight: 500, margin: 0 }}>{r.item_original}</p>
                </button>
              ))}
            </div>
          )}

          {/* Chips de confirmación */}
          {gradoData && paso > 1 && !generando && (
            <Chip label="GRADO" valor={`${gradoData.num} grado`} onClick={() => cambiarDesde(1)} />
          )}
          {area && paso > 2 && !generando && (
            <Chip label="ÁREA" valor={area} onClick={() => cambiarDesde(2)} />
          )}
          {registro && paso > 3 && !generando && (
            <Chip label="CONTENIDO" valor={registro.item_original} onClick={() => cambiarDesde(3)} />
          )}
          {area === "Prácticas del Lenguaje" && tipoFicha && genero && paso > 3 && !generando && (
            <Chip label="CONTENIDO" valor={`${tipoFicha} · ${genero}`} onClick={() => cambiarDesde(3)} />
          )}

          {/* Separador */}
          {paso > 1 && !generando && (
            <div style={{ height: "0.5px", background: C.bordeSuave, margin: "14px 0" }} />
          )}

          {/* Botón volver */}
          {paso > 1 && !generando && (
            <button
              onClick={() => cambiarDesde(paso - 1)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 12, color: C.textoMuted,
                background: "none", border: "none",
                cursor: "pointer", padding: "0 0 14px",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.textoPrincipal}
              onMouseLeave={e => e.currentTarget.style.color = C.textoMuted}
            >
              ‹ volver
            </button>
          )}

          {/* Error */}
          {error && !generando && (
            <div style={{
              background: "#fee2e2", border: "1px solid #fca5a5",
              borderRadius: 10, padding: "12px 16px", marginBottom: 20,
              fontSize: 13, color: "#991b1b", animation: "fadeUp 0.3s both",
            }}>{error}</div>
          )}

          {/* ── PASO 1: Grado ── */}
          {paso === 1 && (
            <PasoWrap>
              <PreguntaHeader pregunta="¿Con qué grado trabajamos hoy?" sub="Elegí el año de la primaria" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {GRADOS.map((g) => (
                  <GradoBtn
                    key={g.num}
                    g={g}
                    activo={gradoData?.num === g.num}
                    onClick={() => {
                      setGradoData(g);
                      setArea(null); setAreaConfig(null); setRegistro(null);
                      setTimeout(() => setPaso(2), 240);
                    }}
                  />
                ))}
              </div>
            </PasoWrap>
          )}

          {/* ── PASO 2: Área ── */}
          {paso === 2 && (
            <PasoWrap>
              <PreguntaHeader
                pregunta="¿Qué área trabajamos?"
                sub={`${gradoData?.num} · elegí la materia`}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {areasDisponibles.map((a) => (
                  <AreaBtn
                    key={a.nombre}
                    a={a}
                    activo={area === a.nombre}
                    onClick={() => {
                      setArea(a.nombre);
                      setAreaConfig(a);
                      setRegistro(null);
                      setBusqueda("");
                      setTimeout(() => setPaso(3), 240);
                    }}
                  />
                ))}
              </div>
            </PasoWrap>
          )}

          {/* ── PASO 3: Contenido (acordeón) — áreas no-PDL ── */}
          {paso === 3 && area !== "Prácticas del Lenguaje" && (
            <PasoWrap>
              <PreguntaHeader
                pregunta={`¿Qué contenido de ${area}?`}
                sub="Diseño Curricular PBA · elegí el bloque y el objetivo"
              />
              <AcordeonBloques
                bloques={bloquesDisponibles}
                contenidosPorBloque={contenidosPorBloque}
                registroSeleccionado={registro}
                onSelect={(r) => {
                  setRegistro(r);
                  setTimeout(() => setPaso(4), 260);
                }}
              />
            </PasoWrap>
          )}

          {/* ── PASO 3: PDL — cascada hardcodeada ── */}
          {paso === 3 && area === "Prácticas del Lenguaje" && (
            <PasoWrap>
              {!tipoFicha ? (
                <>
                  <PreguntaHeader
                    pregunta="¿Qué tipo de ficha?"
                    sub={`Prácticas del Lenguaje · ${gradoData?.num}`}
                  />
                  {PDL_TIPOS.map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setTipoFicha(tipo)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: C.fondoCard,
                        border: `0.5px solid ${C.bordeSuave}`,
                        borderRadius: 10, padding: "13px 16px",
                        cursor: "pointer", marginBottom: 6,
                        fontSize: 14, fontWeight: 500, color: C.textoPrincipal,
                        textAlign: "left", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#F0FBF7"; e.currentTarget.style.borderColor = C.verdeAcento; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.fondoCard; e.currentTarget.style.borderColor = C.bordeSuave; }}
                    >
                      {tipo}
                      <span style={{ fontSize: 16, color: C.textoDisabled }}>›</span>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <PreguntaHeader
                    pregunta={tipoFicha === "Ortografía" ? "¿Qué regla ortográfica?" : "¿Qué tipo de texto?"}
                    sub={tipoFicha}
                  />
                  <button
                    onClick={() => setTipoFicha(null)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 12, color: C.textoMuted,
                      background: "none", border: "none",
                      cursor: "pointer", padding: "0 0 14px",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = C.textoPrincipal}
                    onMouseLeave={e => e.currentTarget.style.color = C.textoMuted}
                  >
                    ‹ volver a tipos
                  </button>
                  {getPDLGeneros(tipoFicha, gradoNum).map((gen) => (
                    <button
                      key={gen}
                      onClick={() => {
                        setGenero(gen);
                        setTimeout(() => setPaso(4), 260);
                      }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: C.fondoCard,
                        border: `0.5px solid ${C.bordeSuave}`,
                        borderRadius: 10, padding: "13px 16px",
                        cursor: "pointer", marginBottom: 6,
                        fontSize: 13, fontWeight: 400, color: C.textoSec,
                        textAlign: "left", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#F0FBF7"; e.currentTarget.style.borderColor = C.verdeAcento; e.currentTarget.style.color = C.textoPrincipal; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.fondoCard; e.currentTarget.style.borderColor = C.bordeSuave; e.currentTarget.style.color = C.textoSec; }}
                    >
                      {gen}
                      <span style={{ fontSize: 16, color: C.textoDisabled }}>›</span>
                    </button>
                  ))}
                </>
              )}
            </PasoWrap>
          )}

          {/* ── PASO 4: Opciones y generar ── */}
          {paso === 4 && !generando && (
            <PasoWrap>
              <PreguntaHeader pregunta="Últimos detalles" sub="¿Qué querés que incluya la ficha?" />
              <Toggle
                on={incluirExplicacion}
                onChange={(v) => {
                  setIncluirExplicacion(v);
                  if (!v) setIncluirEjemplo(false);
                }}
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
                onClick={generar}
                style={{
                  width: "100%", padding: 15,
                  background: C.verdeOscuro, color: "#fff",
                  border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 600,
                  cursor: "pointer", letterSpacing: "-0.2px",
                  marginTop: 16, transition: "all 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.verdeHoverBtn; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.verdeOscuro; e.currentTarget.style.transform = "translateY(0)"; }}
                onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              >
                Generar ficha ✦
              </button>
              <p style={{ fontSize: 12, color: C.textoMuted, textAlign: "center", marginTop: 8 }}>
                Tarda unos segundos · Alineada al Diseño Curricular PBA
              </p>
            </PasoWrap>
          )}

          {/* ── Loading ── */}
          {generando && (
            <div style={{ padding: "48px 0", animation: "fadeUp 0.4s both" }}>
              <div style={{
                background: C.verdeClaroBg, borderRadius: 16,
                padding: "36px 32px", textAlign: "center",
                maxWidth: 400, margin: "0 auto",
              }}>
                <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 28px" }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    border: "4px solid rgba(0,196,140,0.2)",
                    borderTopColor: C.verdeAcento, borderRadius: "50%",
                    animation: "spin 1.8s linear infinite",
                  }} />
                  <span style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>✏️</span>
                </div>
                <p style={{
                  fontSize: 17, fontWeight: 700, color: C.textoPrincipal,
                  marginBottom: 20, minHeight: 28,
                  opacity: msgVisible ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}>{getMensaje(msgIdx)}</p>
                <div style={{ height: 4, background: "rgba(0,196,140,0.2)", borderRadius: 999, overflow: "hidden" }}>
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

        {/* ── SIDEBAR ── */}
        <aside style={{
          background: C.fondoCard,
          borderLeft: isMobile ? "none" : `0.5px solid ${C.bordeSuave}`,
          borderTop: isMobile ? `0.5px solid ${C.bordeSuave}` : "none",
          padding: 20,
          display: "flex", flexDirection: "column", gap: 12,
          position: isMobile ? "static" : "sticky",
          top: isMobile ? "auto" : 57,
          height: isMobile ? "auto" : "calc(100vh - 57px)",
          overflowY: "auto",
          order: isMobile ? 2 : 0,
        }}>
          <SidebarPreview
            gradoData={gradoData}
            area={area}
            areaConfig={areaConfig}
            registro={registro}
            incluirExplicacion={incluirExplicacion}
            incluirEjemplo={incluirEjemplo}
          />

          {/* Resumen de selecciones */}
          <div style={{ background: C.fondoApp, borderRadius: 12, padding: "12px 14px" }}>
            {[
              { key: "Grado",    val: gradoData?.num },
              { key: "Área",     val: area },
              { key: "Contenido", val: area === "Prácticas del Lenguaje" ? (genero ? `${tipoFicha} · ${genero}` : tipoFicha) : registro?.item_original },
            ].map(({ key, val }) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: C.textoMuted, flexShrink: 0 }}>{key}</span>
                <span style={{
                  fontSize: 11,
                  color: val ? C.textoPrincipal : "#C4D9D0",
                  fontWeight: val ? 500 : 400,
                  fontStyle: val ? "normal" : "italic",
                  textAlign: "right", maxWidth: 140,
                  overflow: "hidden", textOverflow: "ellipsis",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>{val || "—"}</span>
              </div>
            ))}
          </div>

          {/* Badge DC PBA */}
          <a
            href="https://www.abc.gob.ar/secretarias/sites/default/files/2024-07/diseno-curricular-primaria-2018.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 12, color: C.verdeTexto,
              background: C.verdeClaroBg,
              border: `0.5px solid ${C.verdeClaroBorder}`,
              borderRadius: 10, padding: "9px 12px",
              textDecoration: "none", transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.verdeAcento, flexShrink: 0 }} />
            Alineado al Diseño Curricular PBA 2018 ↗
          </a>
        </aside>
      </div>
    </div>
  );
}
