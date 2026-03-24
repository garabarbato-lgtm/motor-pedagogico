import { useState, useEffect, useMemo } from "react";

const C = {
  fondo: "#f8f8f4",
  acento: "#00c48c",
  acentoOscuro: "#008f66",
  texto: "#0d1f1a",
  suave: "#e0faf2",
  muted: "#4a6b60",
  btn: "#0d1f1a",
  btnText: "#00c48c",
  white: "#ffffff",
  border: "#d8ede8",
  gris: "#f0f0ec",
  error: "#fee2e2",
  errorTexto: "#991b1b",
};

// Mapeo grado display → valores reales en el JSON
const GRADOS = [
  { num: "1° y 2°", ciclo: "Unidad Pedagógica", valores: ["1", "2"] },
  { num: "3°", ciclo: "Primer ciclo", valores: ["3"] },
  { num: "4°", ciclo: "Segundo ciclo", valores: ["4"] },
  { num: "5°", ciclo: "Segundo ciclo", valores: ["5"] },
  { num: "6°", ciclo: "Segundo ciclo", valores: ["6"] },
  { num: "7°", ciclo: "Segundo ciclo", valores: ["7"] },
];

const AREAS_CONFIG = {
  "Matemática":              { emoji: "🔢", color: "#e8f0ff", colorHover: "#c5d5ff", border: "#c5d5ff", borderHover: "#7a9ef5", desc: "Números, geometría, medidas" },
  "Prácticas del Lenguaje":  { emoji: "📖", color: "#fff0e8", colorHover: "#ffd5b8", border: "#ffd5b8", borderHover: "#f5a06a", desc: "Lectura, escritura, oralidad" },
  "Ciencias Naturales":      { emoji: "🔬", color: "#e8fff4", colorHover: "#b8ffdc", border: "#b8ffdc", borderHover: "#00c48c", desc: "Seres vivos, cuerpo, materiales" },
  "Ciencias Sociales":       { emoji: "🌍", color: "#fef9e0", colorHover: "#fde98a", border: "#fde98a", borderHover: "#e6c800", desc: "Historia, geografía, sociedad" },
};

// ── Subcomponentes ──

function BloqueConfirmado({ emoji, label, valor, onClick, color }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        gap: 12, padding: "14px 18px",
        background: hov ? C.btn : (color || C.white),
        border: `1px solid ${hov ? C.btn : C.border}`,
        borderRadius: 12, cursor: "pointer",
        transition: "all 0.18s", textAlign: "left", marginBottom: 8,
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: C.acento, display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={C.btn} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 14, color: hov ? C.white : C.texto, fontWeight: 500, margin: "2px 0 0", transition: "color 0.18s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {emoji && <span style={{ marginRight: 6 }}>{emoji}</span>}
          {valor}
        </p>
      </div>
      <span style={{
        fontSize: 11, padding: "3px 10px", borderRadius: 20, flexShrink: 0, transition: "all 0.18s",
        background: hov ? C.acento : C.gris,
        color: hov ? C.btn : C.muted,
      }}>
        Cambiar
      </span>
    </button>
  );
}

function PasoActivo({ pregunta, sub, children }) {
  return (
    <div style={{ animation: "fadeUp 0.35s cubic-bezier(.22,1,.36,1) both" }}>
      <h2 style={{
        fontFamily: "Georgia, serif",
        fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 400,
        color: C.texto, lineHeight: 1.25,
        letterSpacing: "-0.02em", marginBottom: sub ? 8 : 20
      }}>
        {pregunta}
      </h2>
      {sub && <p style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>{sub}</p>}
      {children}
    </div>
  );
}

function GradoBtn({ g, i, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "22px 8px", borderRadius: 12,
        border: `1.5px solid ${hov ? C.btn : C.border}`,
        background: hov ? C.btn : C.white,
        cursor: "pointer", transition: "all 0.18s",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        transform: hov ? "translateY(-2px)" : "none",
        animation: `fadeUp 0.3s ${i * 0.05}s both`
      }}
    >
      <span style={{ fontSize: 26, fontWeight: 800, fontFamily: "Georgia, serif", transition: "color 0.18s", color: hov ? C.acento : C.texto }}>{g.num}</span>
      <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.4, transition: "color 0.18s", color: C.muted }}>{g.ciclo}</span>
    </button>
  );
}

function AreaBtn({ a, i, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "22px 18px", borderRadius: 14,
        border: `1.5px solid ${hov ? a.borderHover : a.border}`,
        background: hov ? a.colorHover : a.color,
        cursor: "pointer", textAlign: "left",
        transition: "all 0.18s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 10px 28px rgba(0,0,0,0.10)" : "0 2px 8px rgba(0,0,0,0.04)",
        animation: `fadeUp 0.3s ${i * 0.07}s both`
      }}
    >
      <div style={{ fontSize: 30, marginBottom: 10 }}>{a.emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.texto, marginBottom: 4 }}>{a.nombre}</div>
      <div style={{ fontSize: 12, color: C.muted }}>{a.desc}</div>
    </button>
  );
}

function OpcionBtn({ label, i, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "16px 20px", borderRadius: 10,
        border: `1.5px solid ${hov ? C.acento : C.border}`,
        background: C.white, cursor: "pointer",
        textAlign: "left", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        transition: "all 0.15s",
        animation: `fadeUp 0.3s ${i * 0.07}s both`
      }}
    >
      <span style={{ fontSize: 14, color: hov ? C.acento : C.texto, fontWeight: 500, transition: "color 0.15s", lineHeight: 1.5 }}>{label}</span>
      <span style={{ color: hov ? C.acento : C.border, fontSize: 18, flexShrink: 0, marginLeft: 12, transition: "color 0.15s" }}>›</span>
    </button>
  );
}

// ── Componente principal ──

export default function Generador({ onFichaGenerada, onVolver }) {
  const [paso, setPaso] = useState(1);
  const [gradoData, setGradoData] = useState(null);     // { num, ciclo, valores }
  const [area, setArea] = useState(null);
  const [areaConfig, setAreaConfig] = useState(null);
  const [bloque, setBloque] = useState(null);
  const [registro, setRegistro] = useState(null);       // full JSON record selected
  const [curricular, setCurricular] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/dc_pba_base_curricular_corregida.json')
      .then(r => r.json())
      .then(data => { setCurricular(data); setCargando(false); })
      .catch(() => { setCargando(false); setError('No se pudo cargar la base curricular.'); });
  }, []);

  const areasDisponibles = useMemo(() => {
    if (!gradoData) return [];
    const nombres = [...new Set(
      curricular.filter(r => gradoData.valores.includes(String(r.grado))).map(r => r.area)
    )];
    return nombres.map(nombre => ({ nombre, ...AREAS_CONFIG[nombre] })).filter(a => a.color);
  }, [curricular, gradoData]);

  const bloquesDisponibles = useMemo(() => {
    if (!gradoData || !area) return [];
    return [...new Set(
      curricular
        .filter(r => gradoData.valores.includes(String(r.grado)) && r.area === area)
        .map(r => r.bloque)
    )].sort();
  }, [curricular, gradoData, area]);

  const contenidosDisponibles = useMemo(() => {
    if (!gradoData || !area || !bloque) return [];
    return curricular
      .filter(r => gradoData.valores.includes(String(r.grado)) && r.area === area && r.bloque === bloque)
      .sort((a, b) => a.item_original.localeCompare(b.item_original));
  }, [curricular, gradoData, area, bloque]);

  const elegir = (setter, val, sig) => { setter(val); setTimeout(() => setPaso(sig), 160); };

  const volver = (p) => {
    setPaso(p);
    if (p <= 1) setGradoData(null);
    if (p <= 2) { setArea(null); setAreaConfig(null); }
    if (p <= 3) setBloque(null);
    if (p <= 4) setRegistro(null);
    setError(null);
    setGenerando(false);
  };

  const generar = async () => {
    if (!registro) return;
    setGenerando(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenido: {
            grado: registro.grado,
            area: registro.area,
            bloque: registro.bloque,
            item: registro.item_original,
          },
          tipoFicha: "ficha de trabajo",
        }),
      });
      if (!res.ok) throw new Error('Error en el servidor');
      const resultado = await res.json();
      onFichaGenerada(resultado.ficha, registro, resultado.validacion);
    } catch (err) {
      setGenerando(false);
      setError('No se pudo generar la ficha. Verificá tu conexión e intentá de nuevo.');
    }
  };

  const totalPasos = 5;
  const progreso = generando ? 100 : Math.round(((paso - 1) / (totalPasos - 1)) * 100);

  if (cargando) {
    return (
      <div style={{ background: C.fondo, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, margin: "0 auto 16px", border: `3px solid ${C.border}`, borderTopColor: C.acento, borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontSize: 14, color: C.muted }}>Cargando base curricular…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: C.fondo, minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: `0.5px solid ${C.border}`,
        background: "rgba(248,248,244,0.95)", backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 10
      }}>
        <button onClick={onVolver} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 400, color: C.texto }}>
          motor<span style={{ color: C.acento }}>.</span>
        </button>
        <span style={{ fontSize: 12, color: C.muted }}>
          {generando ? "Generando…" : `Paso ${paso} de ${totalPasos}`}
        </span>
      </nav>

      {/* Barra de progreso */}
      <div style={{ height: 2, background: C.border }}>
        <div style={{
          height: "100%", background: C.acento,
          width: `${progreso}%`,
          transition: "width 0.5s cubic-bezier(.22,1,.36,1)"
        }} />
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Bloques confirmados */}
        {gradoData && paso > 1 && (
          <BloqueConfirmado label="Grado" valor={gradoData.num} emoji="🎓" onClick={() => volver(1)} />
        )}
        {area && paso > 2 && (
          <BloqueConfirmado label="Área" valor={area} emoji={areaConfig?.emoji} color={areaConfig?.color} onClick={() => volver(2)} />
        )}
        {bloque && paso > 3 && (
          <BloqueConfirmado label="Bloque" valor={bloque} emoji="📦" onClick={() => volver(3)} />
        )}
        {registro && paso > 4 && (
          <BloqueConfirmado label="Contenido" valor={registro.item_original} emoji="🎯" onClick={() => volver(4)} />
        )}

        {paso > 1 && !generando && (
          <div style={{ height: 1, background: C.border, margin: "16px 0 28px" }} />
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: C.error, border: `1px solid #fca5a5`,
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: C.errorTexto, animation: "fadeUp 0.3s both"
          }}>
            {error}
          </div>
        )}

        {/* Paso 1: Grado */}
        {paso === 1 && (
          <PasoActivo pregunta="¿Con qué grado estás trabajando hoy?">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {GRADOS.map((g, i) => (
                <GradoBtn key={g.num} g={g} i={i} onClick={() => elegir(setGradoData, g, 2)} />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 2: Área */}
        {paso === 2 && (
          <PasoActivo pregunta={`Perfecto. ¿Qué área trabajamos en ${gradoData?.num}?`}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {areasDisponibles.map((a, i) => (
                <AreaBtn
                  key={a.nombre}
                  a={a}
                  i={i}
                  onClick={() => {
                    setArea(a.nombre);
                    setAreaConfig(a);
                    setTimeout(() => setPaso(3), 160);
                  }}
                />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 3: Bloque */}
        {paso === 3 && (
          <PasoActivo pregunta={`¿Qué bloque de ${area}?`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bloquesDisponibles.map((b, i) => (
                <OpcionBtn key={b} label={b} i={i} onClick={() => elegir(setBloque, b, 4)} />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 4: Contenido */}
        {paso === 4 && (
          <PasoActivo pregunta="¿Cuál es el contenido?" sub={`Del Diseño Curricular oficial · ${gradoData?.num} · ${area}`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {contenidosDisponibles.map((r, i) => (
                <OpcionBtn key={r.id} label={r.item_original} i={i} onClick={() => elegir(setRegistro, r, 5)} />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 5: Confirmar y generar */}
        {paso === 5 && !generando && (
          <PasoActivo pregunta="Todo listo. ¿Generamos la ficha?" sub="Revisá arriba lo que elegiste. Tocá cualquier bloque para cambiarlo.">
            {registro && (
              <div style={{
                background: C.white, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "14px 16px", marginBottom: 24
              }}>
                <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Objetivo de aprendizaje</p>
                <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.6, margin: 0 }}>{registro.objetivo}</p>
              </div>
            )}
            <button
              onClick={generar}
              style={{
                width: "100%", padding: "18px",
                background: C.btn, color: C.btnText,
                fontSize: 17, fontWeight: 700, border: "none",
                borderRadius: 12, cursor: "pointer", transition: "all 0.18s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.acento; e.currentTarget.style.color = C.btn; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.btn; e.currentTarget.style.color = C.btnText; }}
            >
              Generar ficha ✦
            </button>
            <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 10 }}>
              Tarda unos segundos · Alineada al Diseño Curricular
            </p>
          </PasoActivo>
        )}

        {/* Generando */}
        {generando && (
          <div style={{ textAlign: "center", padding: "60px 0", animation: "fadeUp 0.3s both" }}>
            <div style={{ width: 52, height: 52, margin: "0 auto 24px", border: `3px solid ${C.border}`, borderTopColor: C.acento, borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, color: C.texto, marginBottom: 8 }}>Creando tu ficha…</h2>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
              Alineando el contenido con el objetivo curricular<br />
              y adaptando el lenguaje para {gradoData?.num}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
