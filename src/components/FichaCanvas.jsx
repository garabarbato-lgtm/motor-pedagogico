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
  user,
  plan,
}) {
  const [fmt, setFmt] = useState({ bold: false, italic: false, underline: false });
  const [panelAbierto, setPanelAbierto] = useState(
    () => localStorage.getItem("inspector_panel") !== "false"
  );
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 960);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 960);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const applyFontSize = (val) => {
    const map = { small: "1", medium: "3", large: "5" };
    apply("fontSize", map[val] || "3");
  };

  const descargarWord = async () => {
    if (!ficha || !registro) return;
    const { exportFichaToDocx } = await import("../utils/docxExport.js");
    exportFichaToDocx(ficha, registro, hojaId);
  };

  return (
    <div className="ficha-canvas-word">

      {/* ── Toolbar fija — solo nav + toggle ── */}
      <div className="ficha-word-toolbar">
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {acciones}
          {window.innerWidth > 960 && (
            <button
              className="ficha-word-toolbar-btn"
              onClick={togglePanel}
              title={panelAbierto ? "Ocultar panel lateral" : "Mostrar panel lateral"}
              style={{ color: panelAbierto ? "#00c48c" : undefined }}
            >
              <SidebarSimple size={16} weight={panelAbierto ? "fill" : "regular"} />
            </button>
          )}
        </div>
      </div>

      {/* ── Área de trabajo: canvas + inspector ── */}
      <div style={{ display: "flex", flexDirection: "row", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <div className="ficha-canvas-wrapper" style={{ flex: 1, marginRight: panelAbierto ? 320 : 0, transition: "margin-right 0.2s" }}>
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
          <div className="ficha-inspector-panel">
          <InspectorPanel
            ficha={ficha}
            registro={registro}
            hojaId={hojaId}
            onDescargar={onDescargar}
            fmt={fmt}
            apply={apply}
            applyFontSize={applyFontSize}
            user={user}
            plan={plan}
          />
          </div>
        )}
      </div>

      {isMobile && (
        <div className="ficha-mobile-bar">
          {onDescargar && (
            <button className="ficha-mobile-bar-btn ficha-mobile-bar-btn--pdf" onClick={onDescargar}>
              Descargar PDF
            </button>
          )}
          {ficha && registro && (
            <button className="ficha-mobile-bar-btn ficha-mobile-bar-btn--word" onClick={descargarWord}>
              Descargar Word
            </button>
          )}
        </div>
      )}
    </div>
  );
}
