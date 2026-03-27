import { useState } from "react";

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
};

const GRADOS = [
  { num: "1° y 2°", ciclo: "Unidad Pedagógica" },
  { num: "3°", ciclo: "Primer ciclo" },
  { num: "4°", ciclo: "Segundo ciclo" },
  { num: "5°", ciclo: "Segundo ciclo" },
  { num: "6°", ciclo: "Segundo ciclo" },
  { num: "7°", ciclo: "Segundo ciclo" },
];

const AREAS = [
  { nombre: "Matemática", emoji: "🔢", color: "#e8f0ff", colorHover: "#c5d5ff", border: "#c5d5ff", borderHover: "#7a9ef5", desc: "Números, geometría, medidas" },
  { nombre: "Prácticas del Lenguaje", emoji: "📖", color: "#fff0e8", colorHover: "#ffd5b8", border: "#ffd5b8", borderHover: "#f5a06a", desc: "Lectura, escritura, oralidad" },
  { nombre: "Ciencias Naturales", emoji: "🔬", color: "#e8fff4", colorHover: "#b8ffdc", border: "#b8ffdc", borderHover: "#00c48c", desc: "Seres vivos, cuerpo, materiales" },
  { nombre: "Ciencias Sociales", emoji: "🌍", color: "#fef9e0", colorHover: "#fde98a", border: "#fde98a", borderHover: "#e6c800", desc: "Historia, geografía, sociedad" },
];

const DC = {
  "Matemática": {
    "Números naturales": ["Leer y escribir números hasta 100.000", "Comparar y ordenar números", "Reconocer el valor posicional"],
    "Números racionales": ["Reconocer fracciones equivalentes", "Comparar fracciones simples", "Sumar fracciones con igual denominador"],
    "Operaciones": ["Resolver problemas de multiplicación", "Usar la división en situaciones cotidianas", "Calcular el doble y la mitad"],
    "Geometría": ["Identificar figuras geométricas", "Reconocer cuerpos geométricos", "Trazar rectas paralelas y perpendiculares"],
  },
  "Prácticas del Lenguaje": {
    "Lectura": ["Leer textos narrativos con autonomía", "Identificar personajes y escenarios", "Inferir significado de palabras por contexto"],
    "Escritura": ["Planificar y redactar textos breves", "Revisar y reescribir producciones", "Escribir con cohesión y coherencia"],
    "Oralidad": ["Participar en intercambios orales", "Escuchar con atención y responder", "Exponer temas con claridad"],
  },
  "Ciencias Naturales": {
    "Seres vivos": ["Clasificar animales según sus características", "Reconocer adaptaciones de los seres vivos", "Identificar cadenas alimentarias"],
    "El cuerpo humano": ["Conocer los sistemas del cuerpo humano", "Entender la función del sistema digestivo", "Reconocer los órganos de los sentidos"],
    "Materiales": ["Distinguir materiales según sus propiedades", "Reconocer cambios físicos y químicos"],
  },
  "Ciencias Sociales": {
    "Sociedades y territorios": ["Reconocer la organización política de Argentina", "Identificar ambientes de la PBA"],
    "Historia": ["Conocer los pueblos originarios", "Comprender la Revolución de Mayo", "Identificar cambios y continuidades históricas"],
    "Economía": ["Entender las actividades económicas", "Reconocer la cadena productiva"],
  },
};

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
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 10, color: hov ? C.muted : C.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 14, color: hov ? C.white : C.texto, fontWeight: 500, margin: "2px 0 0", transition: "color 0.18s" }}>
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
      <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "Georgia, serif", transition: "color 0.18s", color: hov ? C.acento : C.texto }}>{g.num}</span>
      <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.4, transition: "color 0.18s", color: hov ? C.muted : C.muted }}>{g.ciclo}</span>
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

function BloqueOpcion({ label, i, onClick }) {
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
      <span style={{ fontSize: 15, color: hov ? C.acento : C.texto, fontWeight: 500, transition: "color 0.15s" }}>{label}</span>
      <span style={{ color: hov ? C.acento : C.border, fontSize: 18, transition: "color 0.15s" }}>›</span>
    </button>
  );
}

function ObjetivoOpcion({ obj, i, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "18px 20px", borderRadius: 10,
        border: `1.5px solid ${hov ? C.acento : C.border}`,
        background: hov ? C.suave : C.white,
        cursor: "pointer", textAlign: "left", lineHeight: 1.5,
        transition: "all 0.15s",
        animation: `fadeUp 0.3s ${i * 0.08}s both`
      }}
    >
      <span style={{ fontSize: 14, color: hov ? C.acentoOscuro : C.texto, transition: "color 0.15s" }}>{obj}</span>
    </button>
  );
}

export default function Generador() {
  const [paso, setPaso] = useState(1);
  const [grado, setGrado] = useState(null);
  const [area, setArea] = useState(null);
  const [bloque, setBloque] = useState(null);
  const [objetivo, setObjetivo] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [listo, setListo] = useState(false);

  const elegir = (setter, val, sig) => { setter(val); setTimeout(() => setPaso(sig), 160); };
  const volver = (p) => {
    setPaso(p);
    if (p <= 1) setGrado(null);
    if (p <= 2) { setArea(null); setBloque(null); setObjetivo(null); }
    if (p <= 3) { setBloque(null); setObjetivo(null); }
    if (p <= 4) setObjetivo(null);
    setListo(false); setGenerando(false);
  };
  const generar = () => {
    setGenerando(true);
    setTimeout(() => { setGenerando(false); setListo(true); }, 2600);
  };

  const areaData = AREAS.find(a => a.nombre === area);
  const bloques = area ? Object.keys(DC[area]) : [];
  const objetivos = area && bloque ? DC[area][bloque] : [];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: C.fondo, minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: `0.5px solid ${C.border}`,
        background: "rgba(248,248,244,0.95)", backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 10
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 400, color: C.texto }}>
          motor<span style={{ color: C.acento }}>.</span>
        </span>
        <span style={{ fontSize: 12, color: C.muted }}>{listo ? "Ficha lista ✦" : `Paso ${paso} de 5`}</span>
      </nav>

      <div style={{ height: 2, background: C.border }}>
        <div style={{
          height: "100%", background: C.acento,
          width: `${listo ? 100 : ((paso - 1) / 4) * 100}%`,
          transition: "width 0.5s cubic-bezier(.22,1,.36,1)"
        }} />
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* BLOQUES CONFIRMADOS */}
        {grado && paso > 1 && <BloqueConfirmado label="Grado" valor={grado} emoji="🎓" onClick={() => volver(1)} />}
        {area && paso > 2 && <BloqueConfirmado label="Área" valor={area} emoji={areaData?.emoji} color={areaData?.color} onClick={() => volver(2)} />}
        {bloque && paso > 3 && <BloqueConfirmado label="Bloque" valor={bloque} emoji="📦" onClick={() => volver(3)} />}
        {objetivo && paso > 4 && <BloqueConfirmado label="Objetivo" valor={objetivo} emoji="🎯" onClick={() => volver(4)} />}

        {paso > 1 && !listo && <div style={{ height: 1, background: C.border, margin: "16px 0 28px" }} />}

        {paso === 1 && (
          <PasoActivo pregunta="¿Con qué grado estás trabajando hoy?">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {GRADOS.map((g, i) => <GradoBtn key={g.num} g={g} i={i} onClick={() => elegir(setGrado, g.num, 2)} />)}
            </div>
          </PasoActivo>
        )}

        {paso === 2 && (
          <PasoActivo pregunta={`Perfecto. ¿Qué área trabajamos en ${grado}?`}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {AREAS.map((a, i) => <AreaBtn key={a.nombre} a={a} i={i} onClick={() => elegir(setArea, a.nombre, 3)} />)}
            </div>
          </PasoActivo>
        )}

        {paso === 3 && (
          <PasoActivo pregunta={`¿Qué bloque de ${area}?`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bloques.map((b, i) => <BloqueOpcion key={b} label={b} i={i} onClick={() => elegir(setBloque, b, 4)} />)}
            </div>
          </PasoActivo>
        )}

        {paso === 4 && (
          <PasoActivo pregunta="¿Cuál es el objetivo de aprendizaje?" sub="Del Diseño Curricular oficial · PBA">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {objetivos.map((obj, i) => <ObjetivoOpcion key={obj} obj={obj} i={i} onClick={() => elegir(setObjetivo, obj, 5)} />)}
            </div>
          </PasoActivo>
        )}

        {paso === 5 && !generando && !listo && (
          <PasoActivo pregunta="Todo listo. ¿Generamos la ficha?" sub="Revisá arriba lo que elegiste. Tocá cualquier bloque para cambiarlo.">
            <p style={{ fontSize: 12, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Tipo de recurso</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 28 }}>
              {[
                { label: "Ficha de trabajo", emoji: "📝", sel: true },
                { label: "Explicación breve", emoji: "💡", sel: false },
                { label: "Actividad grupal", emoji: "👥", sel: false },
                { label: "Evaluación corta", emoji: "✅", sel: false },
              ].map(op => (
                <BloqueOpcion key={op.label} label={`${op.emoji}  ${op.label}`} i={0} onClick={() => {}} />
              ))}
            </div>
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

        {generando && (
          <div style={{ textAlign: "center", padding: "60px 0", animation: "fadeUp 0.3s both" }}>
            <div style={{ width: 52, height: 52, margin: "0 auto 24px", border: `3px solid ${C.border}`, borderTopColor: C.acento, borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, color: C.texto, marginBottom: 8 }}>Creando tu ficha...</h2>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Alineando el contenido con el objetivo curricular<br />y adaptando el lenguaje para {grado}</p>
          </div>
        )}

        {listo && (
          <div style={{ animation: "fadeUp 0.4s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "14px 18px", background: C.suave, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 20 }}>✦</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.texto, margin: 0 }}>¡Ficha generada!</p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{grado} · {area} · {objetivo}</p>
              </div>
            </div>
            <div style={{ background: C.white, border: "2.5px solid #0d0d0d", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ background: "#f5f5f5", borderBottom: "2px solid #0d0d0d", padding: "14px 18px" }}>
                <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
                  {[grado, area, bloque].map(t => (
                    <span key={t} style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 3, border: "1.5px solid #0d0d0d", color: "#0d0d0d", background: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t}</span>
                  ))}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0d0d0d", margin: 0, lineHeight: 1.3 }}>{objetivo}</h3>
              </div>
              <div style={{ padding: "16px 18px" }}>
                {["Leemos juntos", "Completamos", "Representamos", "Reflexionamos"].map((s, i) => (
                  <div key={s} style={{ display: "flex", gap: 10, marginBottom: 12, paddingBottom: i < 3 ? 12 : 0, borderBottom: i < 3 ? "0.5px solid #eee" : "none" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#0d0d0d", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#0d0d0d", margin: 0, lineHeight: 1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ flex: 1, padding: "14px", background: C.btn, color: C.btnText, fontSize: 14, fontWeight: 700, border: "none", borderRadius: 10, cursor: "pointer", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.acento; e.currentTarget.style.color = C.btn; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.btn; e.currentTarget.style.color = C.btnText; }}>
                ⬇ Descargar PDF
              </button>
              <button
                onClick={() => { setPaso(1); setGrado(null); setArea(null); setBloque(null); setObjetivo(null); setListo(false); }}
                style={{ flex: 1, padding: "14px", background: C.white, color: C.texto, fontSize: 14, fontWeight: 500, border: `1.5px solid ${C.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.btn; e.currentTarget.style.color = C.acento; e.currentTarget.style.borderColor = C.btn; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.texto; e.currentTarget.style.borderColor = C.border; }}>
                ✦ Crear otra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
