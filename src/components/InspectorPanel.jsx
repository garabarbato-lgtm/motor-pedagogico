import { useState } from "react";
import {
  FilePdf,
  FileDoc,
  Printer,
  FloppyDisk,
} from "@phosphor-icons/react";
import { track } from "@vercel/analytics";
import { supabase } from "../lib/supabase.js";

function GuardarFichaBtn({ ficha, registro, userId }) {
  const [estado, setEstado] = useState('idle')

  async function guardar() {
    if (estado === 'guardado' || estado === 'duplicado') return
    setEstado('verificando')
    const { count } = await supabase
      .from('fichas')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('titulo', ficha.titulo)
      .eq('area', registro?.area || '')
      .eq('grado', registro?.grado || '')
    if (count > 0) { setEstado('duplicado'); return }
    setEstado('guardando')
    const { error } = await supabase.from('fichas').insert({
      user_id: userId,
      titulo: ficha.titulo,
      area: registro?.area || '',
      grado: registro?.grado || '',
      bloque: registro?.bloque || null,
      tipo_ficha: registro?.tipo_ficha || 'trabajo',
      ficha_data: ficha,
      registro_data: registro,
    })
    setEstado(error ? 'error' : 'guardado')
    if (error) setTimeout(() => setEstado('idle'), 3000)
  }

  const labels = { idle: 'Guardar ficha', verificando: 'Verificando...', guardando: 'Guardando...', guardado: '✓ Guardada', duplicado: '✓ Ya guardada', error: 'Error al guardar' }
  const subtitles = { idle: 'Sincronizar cambios', verificando: '...', guardando: '...', guardado: 'En tu biblioteca', duplicado: 'En tu biblioteca', error: 'Intentá de nuevo' }
  const busy = estado === 'verificando' || estado === 'guardando'
  const done = estado === 'guardado' || estado === 'duplicado'

  return (
    <button
      className="ins-btn"
      onClick={guardar}
      disabled={busy || done}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        background: done ? '#e8f9f3' : '#e8f9f3',
        border: `1.5px solid ${done ? '#00c48c' : '#b6ead9'}`,
        borderRadius: 10, padding: '10px 14px', cursor: busy || done ? 'not-allowed' : 'pointer',
        opacity: busy ? 0.7 : 1, textAlign: 'left',
      }}
    >
      <FloppyDisk size={20} color={done ? '#00c48c' : '#004733'} weight="duotone" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: done ? '#00c48c' : '#004733', lineHeight: 1.3 }}>{labels[estado]}</div>
        <div style={{ fontSize: 11, color: '#004733', opacity: 0.7, marginTop: 2, lineHeight: 1.3 }}>{subtitles[estado]}</div>
      </div>
    </button>
  )
}

const FONT_SIZES = [
  { label: "Pequeño", value: "small" },
  { label: "Normal", value: "medium" },
  { label: "Grande", value: "large" },
];


export default function InspectorPanel({
  ficha,
  registro,
  hojaId = "ficha-imprimible",
  onDescargar,
  fmt,
  apply,
  applyFontSize,
  user,
  plan,
}) {



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

      <div className="ficha-inspector-panel" style={{
        width: 320,
        minWidth: 320,
        background: "#fff",
        borderLeft: "1px solid #e0e8e4",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Lexend Deca', sans-serif",
        overflowY: "auto",
        paddingTop: 44,
        position: "fixed",
        top: 44,
        right: 0,
        height: "calc(100vh - 44px)",
        zIndex: 100,
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

                {/* ── Descarga y guardado ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={sectionHeaderStyle}>
            <span style={sectionTitleStyle}>Descarga y guardado</span>
          </div>

          <div style={{ padding: "0 12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {user ? (
              <GuardarFichaBtn ficha={ficha} registro={registro} userId={user.id} />
            ) : (
              <button
                className="ins-btn"
                disabled
                style={{ ...exportBtnBase, background: "#e8f9f3", border: "1.5px solid #b6ead9", opacity: 0.45, cursor: "not-allowed" }}
              >
                <FloppyDisk size={20} color="#004733" weight="duotone" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#004733", lineHeight: 1.3 }}>Guardar ficha</div>
                  <div style={{ fontSize: 11, color: "#004733", opacity: 0.7, marginTop: 2, lineHeight: 1.3 }}>Iniciá sesión para guardar</div>
                </div>
              </button>
            )}

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
