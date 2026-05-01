import { useState } from "react";
import {
  CaretDown,
  CaretUp,
  FilePdf,
  FileDoc,
  Printer,
  SpinnerGap,
} from "@phosphor-icons/react";
import { track } from "@vercel/analytics";

const exportBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "13px 14px",
  border: "1.5px solid #e4ede9",
  borderRadius: 8,
  background: "#fff",
  cursor: "pointer",
  width: "100%",
  textAlign: "left",
  fontFamily: "'Lexend Deca', sans-serif",
};

const exportTitleStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: "#0d1f1a",
  lineHeight: 1.3,
};

const exportSubStyle = {
  fontSize: 11,
  color: "#6B8C7D",
  marginTop: 2,
  lineHeight: 1.3,
};

const BOTONES_IA = [
  {
    id: "simplificar",
    titulo: "Simplificar lenguaje",
    subtitulo: "Adapta el vocabulario al nivel del grado",
    icono: "✨",
    grad: "linear-gradient(135deg, #004733 0%, #006650 100%)",
    prop: "onSimplificar",
  },
  {
    id: "andamiaje",
    titulo: "Agregar Andamiaje (DUA)",
    subtitulo: "Añade pistas y apoyos visuales",
    icono: "🧠",
    grad: "linear-gradient(135deg, #7B3A00 0%, #A0522D 100%)",
    prop: "onAgregarAndamiaje",
  },
  {
    id: "extender",
    titulo: "Extender Actividades",
    subtitulo: "Genera consignas adicionales",
    icono: "➕",
    grad: "linear-gradient(135deg, #1a3561 0%, #2563EB 100%)",
    prop: "onExtenderActividades",
  },
];

export default function InspectorPanel({
  ficha,
  registro,
  hojaId = "ficha-imprimible",
  onDescargar,
  onSimplificar,
  onAgregarAndamiaje,
  onExtenderActividades,
}) {
  const [iaOpen, setIaOpen] = useState(true);
  const [exportOpen, setExportOpen] = useState(true);
  const [pensando, setPensando] = useState(false);

  const handlers = { onSimplificar, onAgregarAndamiaje, onExtenderActividades };

  const llamarIA = async (fn) => {
    if (!fn || pensando) return;
    setPensando(true);
    try {
      await fn(ficha, registro);
    } finally {
      setPensando(false);
    }
  };

  const descargarWord = async () => {
    if (!ficha || !registro) return;
    const { exportFichaToDocx } = await import("../utils/docxExport.js");
    exportFichaToDocx(ficha, registro, hojaId);
    track("word_descargado", {
      area: registro.area,
      grado: registro.grado,
      tipo: registro.tipo_ficha,
    });
  };

  return (
    <>
      <style>{`
        @keyframes _inspector-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .inspector-ia-btn { transition: transform 0.18s, opacity 0.18s; }
        .inspector-ia-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .inspector-export-btn { transition: border-color 0.15s, background 0.15s; }
        .inspector-export-btn:hover { border-color: #00c48c !important; background: #E6FAF3 !important; }
      `}</style>

      <div style={{
        width: 320,
        minWidth: 320,
        background: "#fff",
        borderLeft: "1px solid #e0e8e4",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Lexend Deca', sans-serif",
        overflow: "hidden",
      }}>

        {/* ── Magia con IA ── */}
        <div style={{ flex: iaOpen ? 1 : "none", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <button
            onClick={() => setIaOpen(v => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px 10px",
              cursor: "pointer",
              background: "none",
              border: "none",
              width: "100%",
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#6B8C7D", textTransform: "uppercase" }}>
              ✦ Magia con IA
            </span>
            {iaOpen
              ? <CaretUp size={14} color="#6B8C7D" />
              : <CaretDown size={14} color="#6B8C7D" />
            }
          </button>

          {iaOpen && (
            <div style={{
              flex: 1,
              padding: "0 12px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              position: "relative",
              overflowY: "auto",
            }}>
              {pensando && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.88)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  zIndex: 10,
                  borderRadius: 8,
                }}>
                  <SpinnerGap
                    size={28}
                    color="#00c48c"
                    style={{ animation: "_inspector-spin 0.8s linear infinite" }}
                  />
                  <span style={{ fontSize: 12, color: "#004733", fontWeight: 600, fontFamily: "'Lexend Deca', sans-serif" }}>
                    Pensando…
                  </span>
                </div>
              )}

              {BOTONES_IA.map(btn => (
                <button
                  key={btn.id}
                  className="inspector-ia-btn"
                  disabled={pensando}
                  onClick={() => llamarIA(handlers[btn.prop])}
                  style={{
                    background: btn.grad,
                    border: "none",
                    borderRadius: 10,
                    padding: "13px 14px",
                    cursor: pensando ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    opacity: pensando ? 0.5 : 1,
                    width: "100%",
                    textAlign: "left",
                    fontFamily: "'Lexend Deca', sans-serif",
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{btn.icono}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                      {btn.titulo}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2, lineHeight: 1.3 }}>
                      {btn.subtitulo}
                    </div>
                  </div>
                  <span style={{
                    background: "rgba(255,255,255,0.22)",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 4,
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                    fontFamily: "'Lexend Deca', sans-serif",
                  }}>
                    IA
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Separador ── */}
        <div style={{ height: 1, background: "#e0e8e4" }} />

        {/* ── Archivo y Exportar ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={() => setExportOpen(v => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px 10px",
              cursor: "pointer",
              background: "none",
              border: "none",
              width: "100%",
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#6B8C7D", textTransform: "uppercase" }}>
              Archivo y Exportar
            </span>
            {exportOpen
              ? <CaretUp size={14} color="#6B8C7D" />
              : <CaretDown size={14} color="#6B8C7D" />
            }
          </button>

          {exportOpen && (
            <div style={{ padding: "0 12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {onDescargar && (
                <button className="inspector-export-btn" onClick={onDescargar} style={exportBtnStyle}>
                  <FilePdf size={20} color="#e53935" weight="duotone" />
                  <div style={{ flex: 1 }}>
                    <div style={exportTitleStyle}>Descargar PDF</div>
                    <div style={exportSubStyle}>A4 · lista para imprimir</div>
                  </div>
                </button>
              )}

              {ficha && registro && (
                <button className="inspector-export-btn" onClick={descargarWord} style={exportBtnStyle}>
                  <FileDoc size={20} color="#1565c0" weight="duotone" />
                  <div style={{ flex: 1 }}>
                    <div style={exportTitleStyle}>Descargar Word (.docx)</div>
                    <div style={exportSubStyle}>Editable en cualquier equipo</div>
                  </div>
                </button>
              )}

              <button className="inspector-export-btn" onClick={() => window.print()} style={exportBtnStyle}>
                <Printer size={20} color="#00a86b" weight="duotone" />
                <div style={{ flex: 1 }}>
                  <div style={exportTitleStyle}>Imprimir</div>
                  <div style={exportSubStyle}>Abre el diálogo del sistema</div>
                </div>
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
