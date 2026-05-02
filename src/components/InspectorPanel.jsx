import { useState } from "react";
import {
  FilePdf,
  FileDoc,
  Printer,
  SpinnerGap,
  FloppyDisk,
} from "@phosphor-icons/react";
import { track } from "@vercel/analytics";

const FONT_SIZES = [
  { label: "Pequeño", value: "small" },
  { label: "Normal", value: "medium" },
  { label: "Grande", value: "large" },
];

const BOTONES_IA = [
  {
    id: "andamiaje",
    titulo: "Agregar Andamiaje",
    subtitulo: "Añade pistas y apoyos DUA",
    icono: "🧩",
    prop: "onAgregarAndamiaje",
    baseColor: "#004733",
    bgColor: "#f0faf6",
    borderColor: "#b6ead9",
    badgeBg: "rgba(182, 234, 217, 0.6)",
  },
  {
    id: "ejercicio",
    titulo: "Agregar ejercicio",
    subtitulo: "Genera consignas adicionales",
    icono: "➕",
    prop: "onExtenderActividades",
    baseColor: "#7a4a1a",
    bgColor: "#fff8f0",
    borderColor: "#f5d9b4",
    badgeBg: "rgba(245, 217, 180, 0.6)",
  },
  {
    id: "regenerar",
    titulo: "Regenerar ficha",
    subtitulo: "Nueva versión con el mismo contenido",
    icono: "↺",
    prop: "onRegenerarFicha",
    baseColor: "#1a3561",
    bgColor: "#f0f4ff",
    borderColor: "#ccd4f0",
    badgeBg: "rgba(204, 212, 240, 0.6)",
  },
];

export default function InspectorPanel({
  ficha,
  registro,
  hojaId = "ficha-imprimible",
  onDescargar,
  onRegenerarFicha,
  onAgregarAndamiaje,
  onExtenderActividades,
  fmt,
  apply,
  applyFontSize,
  onGuardar,
}) {
  const [pensando, setPensando] = useState(false);

  const handlers = { onRegenerarFicha, onAgregarAndamiaje, onExtenderActividades };

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

  const toolbarBtnBase = {
    width: 32,
    height: 32,
    border: "1px solid #e8e8e8",
    borderRadius: 6,
    background: "#fafafa",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    fontFamily: "'Lexend Deca', sans-serif",
    transition: "all 0.15s",
  };

  const toolbarBtnActive = {
    ...toolbarBtnBase,
    background: "#e8f9f3",
    borderColor: "#00c48c",
  };

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px 10px",
    background: "none",
    border: "none",
    width: "100%",
    fontFamily: "'Lexend Deca', sans-serif",
  };

  const sectionTitleStyle = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#6B8C7D",
    textTransform: "uppercase",
    fontFamily: "'Lexend Deca', sans-serif",
  };

  const exportBtnBase = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "13px 14px",
    borderRadius: 8,
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    fontFamily: "'Lexend Deca', sans-serif",
    transition: "all 0.15s",
    minHeight: 62,
  };

  return (
    <>
      <style>{`
        @keyframes _inspector-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ins-btn { transition: all 0.15s; }
        .ins-btn:hover:not(:disabled) { opacity: 0.8; transform: translateY(-1px); }
        .ins-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      <div style={{
        width: 320,
        minWidth: 320,
        background: "#fff",
        borderLeft: "1px solid #e0e8e4",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Lexend Deca', sans-serif",
        overflowY: "auto",
        paddingTop: 44,
        paddingBottom: 24,
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.08em",
          color: "#00c48c",
          textTransform: "uppercase",
          padding: "14px 16px 10px",
          borderBottom: "1px solid #e0e8e4",
          fontFamily: "'Nunito', 'Lexend Deca', sans-serif",
        }}>
          Personalizá tu ficha
        </div>

        {/* ── Edición manual ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={sectionHeaderStyle}>
            <span style={sectionTitleStyle}>Edición manual</span>
          </div>
          
          <div style={{ padding: "0 12px 12px" }}>
            <select 
              onChange={(e) => applyFontSize(e.target.value)} 
              defaultValue="medium"
              style={{
                width: "100%",
                height: 32,
                border: "1px solid #e8e8e8",
                borderRadius: 6,
                background: "#fafafa",
                fontSize: 12,
                marginBottom: 8,
                padding: "0 8px",
                fontFamily: "'Lexend Deca', sans-serif",
                color: "#444"
              }}
            >
              {FONT_SIZES.map(fs => (
                <option key={fs.value} value={fs.value}>{fs.label}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <button 
                onMouseDown={(e) => { e.preventDefault(); apply("bold"); }}
                style={fmt?.bold ? toolbarBtnActive : toolbarBtnBase}
              >
                N
              </button>
              <button 
                onMouseDown={(e) => { e.preventDefault(); apply("italic"); }}
                style={fmt?.italic ? toolbarBtnActive : toolbarBtnBase}
              >
                K
              </button>
              <button 
                onMouseDown={(e) => { e.preventDefault(); apply("underline"); }}
                style={fmt?.underline ? toolbarBtnActive : toolbarBtnBase}
              >
                S
              </button>
              
              <div style={{ width: 1, height: 32, background: "#eee", margin: "0 2px" }} />
              
              <button onMouseDown={(e) => { e.preventDefault(); apply("justifyLeft"); }} style={toolbarBtnBase}>≡</button>
              <button onMouseDown={(e) => { e.preventDefault(); apply("justifyCenter"); }} style={toolbarBtnBase}>☰</button>
              <button onMouseDown={(e) => { e.preventDefault(); apply("justifyRight"); }} style={toolbarBtnBase}>≡</button>
              
              <div style={{ width: 1, height: 32, background: "#eee", margin: "0 2px" }} />
              
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand("undo"); }} style={toolbarBtnBase}>↩</button>
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand("redo"); }} style={toolbarBtnBase}>↪</button>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#e0e8e4" }} />

        {/* ── Edición con IA ── */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={sectionHeaderStyle}>
            <span style={{ ...sectionTitleStyle, flex: 1 }}>Edición con IA</span>
            <button 
              title="Esta función consume créditos extra"
              style={{
                background: "#f0f0f0",
                border: "none",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: 10,
                cursor: "pointer",
                color: "#666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 4,
                fontFamily: "'Lexend Deca', sans-serif",
              }}
            >
              ?
            </button>
          </div>

          <div style={{
            padding: "0 12px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            position: "relative",
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
                className="ins-btn"
                disabled={pensando}
                onClick={() => llamarIA(handlers[btn.prop])}
                style={{
                  background: btn.bgColor,
                  border: `1.5px solid ${btn.borderColor}`,
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
                  minHeight: 62,
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{btn.icono}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: btn.baseColor, lineHeight: 1.3, opacity: 0.7 }}>
                    {btn.titulo}
                  </div>
                  <div style={{ fontSize: 11, color: btn.baseColor, opacity: 0.7, marginTop: 2, lineHeight: 1.3 }}>
                    {btn.subtitulo}
                  </div>
                </div>
                <span style={{
                  background: btn.badgeBg,
                  color: btn.baseColor,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 4,
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                }}>
                  IA
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: "#e0e8e4" }} />

        {/* ── Descarga y guardado ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={sectionHeaderStyle}>
            <span style={sectionTitleStyle}>Descarga y guardado</span>
          </div>

          <div style={{ padding: "0 12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            <button 
              className="ins-btn" 
              onClick={onGuardar} 
              disabled={!onGuardar}
              style={{ 
                ...exportBtnBase, 
                background: "#e8f9f3", 
                border: "1.5px solid #b6ead9",
                opacity: onGuardar ? 1 : 0.45,
                cursor: onGuardar ? "pointer" : "not-allowed"
              }}
            >
              <FloppyDisk size={20} color="#004733" weight="duotone" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#004733", lineHeight: 1.3 }}>Guardar ficha</div>
                <div style={{ fontSize: 11, color: "#004733", opacity: 0.7, marginTop: 2, lineHeight: 1.3 }}>Sincronizar cambios</div>
              </div>
            </button>

            {onDescargar && (
              <button 
                className="ins-btn" 
                onClick={onDescargar} 
                style={{ ...exportBtnBase, background: "#fff5f5", border: "1.5px solid #fcc8c8" }}
              >
                <FilePdf size={20} color="#e53935" weight="duotone" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e53935", lineHeight: 1.3 }}>Descargar PDF</div>
                  <div style={{ fontSize: 11, color: "#6B8C7D", marginTop: 2, lineHeight: 1.3 }}>A4 · lista para imprimir</div>
                </div>
              </button>
            )}

            {ficha && registro && (
              <button 
                className="ins-btn" 
                onClick={descargarWord} 
                style={{ ...exportBtnBase, background: "#f0f4ff", border: "1.5px solid #c5d3f5" }}
              >
                <FileDoc size={20} color="#1565c0" weight="duotone" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1565c0", lineHeight: 1.3 }}>Descargar Word (.docx)</div>
                  <div style={{ fontSize: 11, color: "#6B8C7D", marginTop: 2, lineHeight: 1.3 }}>Editable en cualquier equipo</div>
                </div>
              </button>
            )}

            <button 
              className="ins-btn" 
              onClick={() => window.print()} 
              style={{ ...exportBtnBase, background: "#fff", border: "1.5px solid #e4ede9" }}
            >
              <Printer size={20} color="#00a86b" weight="duotone" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0d1f1a", lineHeight: 1.3 }}>Imprimir</div>
                <div style={{ fontSize: 11, color: "#6B8C7D", marginTop: 2, lineHeight: 1.3 }}>Diálogo del sistema</div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
