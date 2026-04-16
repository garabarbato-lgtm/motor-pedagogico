import { useState, useEffect, useRef } from "react";
import {
  C, renderHTMLConNegrita, renderTitulo,
  SeccionHeader, renderEjercicioItem,
} from "./utils.jsx";

const PRINT_CSS = `
@media print {
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 10mm; }
  html, body { margin: 0; padding: 0; width: 190mm; }

  #nav-ficha,
  .btn-imprimir,
  .sidebar-edicion,
  .validacion-badge,
  .mock-banner { display: none !important; }

  .contenedor-pagina {
    background: white !important;
    min-height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .contenedor-wrapper {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .ficha {
    width: 190mm !important;
    max-width: 190mm !important;
    min-height: 277mm !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: visible !important;
    font-family: 'Lexend Deca', sans-serif !important;
  }
}
`;

export default function FichaPractica({ ficha, registro }) {
  if (!ficha || !registro) return null;

  const [fichaLocal, setFichaLocal] = useState(() => ({ ...ficha }));
  const [ejercicio3Oculto, setEjercicio3Oculto] = useState(false);
  const [editandoCampo, setEditandoCampo] = useState(null);
  const [planosLocal, setPlanosLocal] = useState(() => {
    const planos = {};
    planos.concepto_clave = ficha.concepto_clave || "";
    (ficha.ejercicios || []).forEach((e, i) => {
      if (e && typeof e === "object") planos[`ejercicio_${i}_enunciado`] = e.enunciado || "";
    });
    return planos;
  });
  const [posiciones, setPosiciones] = useState({});
  const refFicha = useRef(null);
  const sectionRefs = useRef({});
  const textareaRef = useRef(null);

  const emojis = Array.isArray(fichaLocal.emojis) && fichaLocal.emojis.length ? fichaLocal.emojis : ["📝"];
  const emojiLeft  = emojis[0];
  const emojiRight = emojis[1] || emojis[0];
  const tituloTexto = (fichaLocal.titulo || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .trim();
  const gradoDisplay = `${registro.grado}° grado`;
  const ejercicios = Array.isArray(fichaLocal.ejercicios) ? fichaLocal.ejercicios : [];

  // ── Posicionamiento de botones de edición ──
  useEffect(() => {
    if (!refFicha.current) return;
    const compute = () => {
      const fichaEl = refFicha.current;
      if (!fichaEl) return;
      const fichaRect = fichaEl.getBoundingClientRect();
      const nuevas = {};
      for (const [key, el] of Object.entries(sectionRefs.current)) {
        if (el) {
          const rect = el.getBoundingClientRect();
          nuevas[key] = rect.top - fichaRect.top;
        }
      }
      setPosiciones(nuevas);
    };
    const id = requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", compute); };
  }, [fichaLocal, editandoCampo]);

  // ── Overflow: ocultar 4° ejercicio si desborda ──
  useEffect(() => {
    const el = refFicha.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight) return;
    if (ejercicios[3] != null && !ejercicio3Oculto) {
      setEjercicio3Oculto(true);
    }
  }, [fichaLocal, ejercicio3Oculto]);

  // ── Helpers de edición ──

  const setRef = (key) => (el) => { sectionRefs.current[key] = el; };

  const saveValue = (key, val) => {
    if (key === "concepto_clave") {
      setFichaLocal(f => ({ ...f, concepto_clave: val }));
      return;
    }
    if (key.startsWith("ejercicio_") && key.endsWith("_enunciado")) {
      const i = +key.split("_")[1];
      setFichaLocal(f => {
        const arr = [...(f.ejercicios || [])];
        if (arr[i]) arr[i] = { ...arr[i], enunciado: val };
        return { ...f, ejercicios: arr };
      });
    }
  };

  const saveCampo = (key) => {
    if (!key || !textareaRef.current) return;
    const val = textareaRef.current.value;
    saveValue(key, val);
    setPlanosLocal(prev => ({ ...prev, [key]: val }));
  };

  const startEdit = (key) => {
    if (editandoCampo) saveCampo(editandoCampo);
    setEditandoCampo(key);
  };

  const confirmEdit = () => {
    saveCampo(editandoCampo);
    setEditandoCampo(null);
  };

  const estiloTextarea = {
    width: "100%", boxSizing: "border-box",
    fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit",
    color: C.texto, border: `1.5px solid ${C.acento}`, borderRadius: 4,
    padding: "6px 8px", resize: "vertical", background: "#fff",
  };

  const renderTextarea = (minRows = 2) => {
    const textoInicial = planosLocal[editandoCampo] || "";
    return (
      <textarea
        ref={textareaRef}
        autoFocus
        defaultValue={textoInicial}
        rows={Math.max(minRows, textoInicial.split("\n").length + 1)}
        style={estiloTextarea}
      />
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>

      {/* ── Ficha imprimible ── */}
      <div
        ref={refFicha}
        id="ficha-imprimible"
        className="ficha"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: C.fondo,
          border: `2.5px solid ${C.borderFuerte}`,
          borderRadius: 10,
          minHeight: "277mm",
          maxHeight: "277mm",
          overflow: "hidden",
          fontFamily: "'Lexend Deca', sans-serif",
          color: C.texto,
        }}
      >

        {/* ── Encabezado ── */}
        <div style={{
          background: C.fondoHeader,
          borderBottom: `2.5px solid ${C.borderFuerte}`,
          borderRadius: "8px 8px 0 0",
          padding: "10px 16px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojiLeft}</span>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1.25, letterSpacing: "-0.01em", textAlign: "center", flex: 1 }}>
              {renderTitulo(tituloTexto)}
            </h2>
            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojiRight}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
            {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
              <div key={label}>
                <p className="dato-label" style={{ fontSize: 9, color: C.muted, fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {label}
                </p>
                <div style={{ borderBottom: `2px solid ${C.borderFuerte}`, height: 20 }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Cuerpo ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

          {/* ── Sección 1: Recordamos ── */}
          <div style={{
            flexShrink: 0,
            padding: "10px 16px",
            borderBottom: `1.5px solid ${C.borderFuerte}`,
          }}>
            <SeccionHeader numero="1" titulo="Recordamos" icono="💡" />
            {fichaLocal.concepto_clave ? (
              <div ref={setRef("concepto_clave")}>
                {editandoCampo === "concepto_clave"
                  ? renderTextarea(2)
                  : (
                    <div
                      style={{
                        background: "#eafaf4",
                        borderLeft: "3px solid #00c48c",
                        borderRadius: "0 4px 4px 0",
                        padding: "7px 12px",
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: 1.65,
                        color: C.texto,
                      }}
                      dangerouslySetInnerHTML={renderHTMLConNegrita(fichaLocal.concepto_clave)}
                    />
                  )
                }
              </div>
            ) : null}
          </div>

          {/* ── Sección 2: Tu turno ── */}
          <div style={{
            flex: 1,
            padding: "10px 16px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            <SeccionHeader numero="2" titulo="Tu turno" icono="✏️" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ejercicios.map((ejercicio, idx) => {
                if (!ejercicio) return null;
                if (idx === 3 && ejercicio3Oculto) return null;
                const keyEnunciado = `ejercicio_${idx}_enunciado`;
                return (
                  <div key={idx} ref={setRef(keyEnunciado)}>
                    {editandoCampo === keyEnunciado
                      ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                          <div style={{ flex: 1 }}>{renderTextarea(2)}</div>
                        </div>
                      )
                      : renderEjercicioItem(ejercicio, idx)
                    }
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div style={{
          borderTop: `2px solid ${C.borderFuerte}`,
          borderRadius: "0 0 8px 8px",
          padding: "6px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: C.fondoHeader,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, fontFamily: "'Lexend Deca', sans-serif", color: C.muted }}>tiza. · Diseño Curricular 2018</span>
          <span style={{ fontSize: 13, fontFamily: "'Lexend Deca', sans-serif", color: C.muted }}>{gradoDisplay} · {registro.area} · {registro.bloque}</span>
        </div>

        <style>{PRINT_CSS}</style>
      </div>

      {/* ── Barra lateral de edición ── */}
      <div className="sidebar-edicion" style={{
        width: 48, flexShrink: 0, position: "relative", alignSelf: "stretch",
      }}>
        {Object.entries(posiciones).map(([key, top]) => (
          editandoCampo === key ? (
            <button
              key={key}
              onClick={confirmEdit}
              style={{
                position: "absolute", top: Math.max(0, top), left: 8,
                width: 36, background: C.acento, color: "#fff",
                border: "none", borderRadius: 6, padding: "5px 0",
                fontSize: 10, fontWeight: 700, cursor: "pointer",
                lineHeight: 1.3, textAlign: "center",
              }}
            >
              Listo
            </button>
          ) : (
            <button
              key={key}
              onClick={() => startEdit(key)}
              style={{
                position: "absolute", top: Math.max(0, top), left: 8,
                width: 36, background: "#fff", border: `1.5px solid ${C.border}`,
                borderRadius: 6, padding: "4px 0", fontSize: 14,
                cursor: "pointer", lineHeight: 1, textAlign: "center", color: C.muted,
              }}
            >
              ✏️
            </button>
          )
        ))}
      </div>

    </div>
  );
}
