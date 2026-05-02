import { useState, useEffect } from "react";
import { track } from '@vercel/analytics';
import { SidebarSimple } from "@phosphor-icons/react";
import InspectorPanel from "./InspectorPanel.jsx";
import "../ficha-canvas.css";

const FONT_SIZES = [
  { label: "Pequeño", value: "small" },
  { label: "Normal", value: "medium" },
  { label: "Grande", value: "large" },
];

export default function FichaCanvas({
  paginas = [],
  onDescargar,
  hojaId,
  acciones,
  ficha,
  registro,
  onSimplificar,
  onAgregarAndamiaje,
  onExtenderActividades,
}) {
  const [fmt, setFmt] = useState({ bold: false, italic: false, underline: false });
  const [panelAbierto, setPanelAbierto] = useState(
    () => localStorage.getItem("inspector_panel") !== "false"
  );

  const togglePanel = () => {
    setPanelAbierto(v => {
      const next = !v;
      localStorage.setItem("inspector_panel", String(next));
      return next;
    });
  };

  const queryFmt = () => ({
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
  });

  useEffect(() => {
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) setFmt(queryFmt());
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const apply = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    setFmt(queryFmt());
  };

  const applyFontSize = (e) => {
    const map = { small: "1", medium: "3", large: "5" };
    apply("fontSize", map[e.target.value] || "3");
  };

  return (
    <div className="ficha-canvas-word">

      {/* ── Toolbar fija estilo Word ── */}
      <div className="ficha-word-toolbar">
        <div className="ficha-word-toolbar-group">
          <select className="ficha-word-toolbar-select" onChange={applyFontSize} defaultValue="medium">
            {FONT_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="ficha-word-toolbar-group">
          <button className={`ficha-word-toolbar-btn${fmt.bold ? " active" : ""}`} onMouseDown={(e) => { e.preventDefault(); apply("bold"); }} title="Negrita"><b>N</b></button>
          <button className={`ficha-word-toolbar-btn${fmt.italic ? " active" : ""}`} onMouseDown={(e) => { e.preventDefault(); apply("italic"); }} title="Cursiva"><em>K</em></button>
          <button className={`ficha-word-toolbar-btn${fmt.underline ? " active" : ""}`} onMouseDown={(e) => { e.preventDefault(); apply("underline"); }} title="Subrayado"><u>S</u></button>
        </div>
        <div className="ficha-word-toolbar-group">
          <button className="ficha-word-toolbar-btn" onMouseDown={(e) => { e.preventDefault(); apply("justifyLeft"); }} title="Izquierda">≡</button>
          <button className="ficha-word-toolbar-btn" onMouseDown={(e) => { e.preventDefault(); apply("justifyCenter"); }} title="Centrar">☰</button>
          <button className="ficha-word-toolbar-btn" onMouseDown={(e) => { e.preventDefault(); apply("justifyRight"); }} title="Derecha">≡</button>
        </div>
        <div className="ficha-word-toolbar-group">
          <button className="ficha-word-toolbar-btn" onMouseDown={(e) => { e.preventDefault(); document.execCommand("undo"); }} title="Deshacer">↩</button>
          <button className="ficha-word-toolbar-btn" onMouseDown={(e) => { e.preventDefault(); document.execCommand("redo"); }} title="Rehacer">↪</button>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {acciones}
          {ficha && registro && (
            <button className="ficha-word-toolbar-btn" onClick={async () => { const { exportFichaToDocx } = await import("../utils/docxExport.js"); exportFichaToDocx(ficha, registro, hojaId); track('word_descargado', { area: registro.area, grado: registro.grado, tipo: registro.tipo_ficha }); }} title="Descargar Word">⬇ Word</button>
          )}
          {onDescargar && (
            <button className="ficha-word-toolbar-pdf-btn" onClick={onDescargar}>⬇ Descargar PDF</button>
          )}
          <button
            className="ficha-word-toolbar-btn"
            onClick={togglePanel}
            title={panelAbierto ? "Ocultar panel lateral" : "Mostrar panel lateral"}
            style={{ color: panelAbierto ? "#00c48c" : undefined }}
          >
            <SidebarSimple size={16} weight={panelAbierto ? "fill" : "regular"} />
          </button>
        </div>
      </div>

      {/* ── Área de trabajo: canvas + inspector ── */}
      <div style={{ display: "flex", flexDirection: "row", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <div className="ficha-canvas-wrapper" style={{ flex: 1 }}>
          {paginas.map((contenido, i) => (
            <div className="ficha-hoja" key={i} id={i === 0 && hojaId ? hojaId : undefined}>
              {paginas.length > 1 && (
                <span className="ficha-hoja-numero">Hoja {i + 1} de {paginas.length}</span>
              )}
              {contenido}
            </div>
          ))}
        </div>

        {panelAbierto && (
          <InspectorPanel
            ficha={ficha}
            registro={registro}
            hojaId={hojaId}
            onDescargar={onDescargar}
            onSimplificar={onSimplificar}
            onAgregarAndamiaje={onAgregarAndamiaje}
            onExtenderActividades={onExtenderActividades}
          />
        )}
      </div>

    </div>
  );
}
