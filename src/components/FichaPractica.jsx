import { useState } from "react";
import { House } from "@phosphor-icons/react";
import FeedbackButton from "./FeedbackButton.jsx";
import FichaCanvas from "./FichaCanvas.jsx";
import {
  C, renderHTMLConNegrita, renderTitulo,
  EditableHtml, SeccionHeader, renderEjercicioItem,
} from "./utils.jsx";

export default function FichaPractica({ ficha, registro, user, plan = 'free', onNueva, onInicio }) {
  if (!ficha || !registro) return null;

  const [isDownloading, setIsDownloading] = useState(false);

  const emojis = Array.isArray(ficha.emojis) && ficha.emojis.length ? ficha.emojis : ["📝"];
  const tituloTexto = (ficha.titulo || "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").trim();
  const gradoDisplay = `${registro.grado}° grado`;
  const ejercicios = Array.isArray(ficha.ejercicios) ? ficha.ejercicios : [];

  const handleDescargarPDF = async () => {
    setIsDownloading(true);
    const element = document.getElementById("ficha-imprimible");
    if (!element) { setIsDownloading(false); return; }
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import("jspdf"),
      import("html2canvas"),
    ]);
    const areaSlug = registro.area.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    element.style.boxShadow = "none";
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    element.style.boxShadow = "";
    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF("p", "mm", "a4");
    const altoImg = (canvas.height * 210) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, 210, altoImg);
    pdf.save(`tiza-${areaSlug}-${registro.grado}.pdf`);
    setIsDownloading(false);
  };

  const acciones = (
    <>
      {onInicio && <button className="ficha-word-toolbar-btn" onClick={onInicio} title="Inicio"><House size={18} /></button>}
      {onNueva && <button className="ficha-word-toolbar-btn" onClick={onNueva} title="Nueva ficha">✦ Nueva</button>}
    </>
  );

  const contenido = (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, fontFamily: "'Lexend Deca', sans-serif", fontSize: 12, color: C.texto }}>

      {/* ── Encabezado ── */}
      <div style={{ background: C.fondoHeader, borderBottom: `2.5px solid ${C.borderFuerte}`, borderRadius: "8px 8px 0 0", padding: "10px 16px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojis[0]}</span>
          <h2
            contentEditable suppressContentEditableWarning
            className="ficha-campo-editable"
            style={{ fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1.25, letterSpacing: "-0.01em", textAlign: "center", flex: 1 }}
          >
            {tituloTexto}
          </h2>
          <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojis[1] || emojis[0]}</span>
        </div>
        <div className="ficha-header-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
          {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
            <div key={label}>
              <p style={{ fontSize: 9, color: C.muted, fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              <div style={{ borderBottom: `2px solid ${C.borderFuerte}`, height: 20 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

        {/* Sección 1: Recordamos */}
        <div style={{ flexShrink: 0, padding: "10px 16px", borderBottom: `1.5px solid ${C.borderFuerte}` }}>
          <SeccionHeader numero="1" titulo="Recordamos" icono="💡" />
          {ficha.concepto_clave && (
            <EditableHtml
              html={renderHTMLConNegrita(ficha.concepto_clave).__html}
              className="ficha-campo-editable"
              style={{ background: "#eafaf4", borderLeft: "3px solid #00c48c", borderRadius: "0 4px 4px 0", padding: "7px 12px", fontSize: 13, fontWeight: 500, lineHeight: 1.65, color: C.texto, resize: "vertical", overflow: "hidden", minHeight: 40 }}
            />
          )}
        </div>

        {/* Sección 2: Tu turno */}
        <div style={{ flex: 1, padding: "10px 16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <SeccionHeader numero="2" titulo="Tu turno" icono="✏️" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ejercicios.map((ejercicio, idx) => {
              if (!ejercicio) return null;
              return <div key={idx}>{renderEjercicioItem(ejercicio, idx, { editable: true })}</div>;
            })}
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: `2px solid ${C.borderFuerte}`, borderRadius: "0 0 8px 8px", padding: "6px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.fondoHeader, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: C.muted }}>tiza. · Diseño Curricular 2018</span>
        <span style={{ fontSize: 10, color: C.muted }}>{gradoDisplay} · {registro.area} · {registro.bloque}</span>
      </div>

    </div>
  );

  return (
    <>
      <FichaCanvas
        paginas={[contenido]}
        hojaId="ficha-imprimible"
        onDescargar={handleDescargarPDF}
        acciones={acciones}
        ficha={ficha}
        registro={registro}
        user={user}
        plan={plan}
      />
      <FeedbackButton isDownloading={isDownloading} />
    </>
  );
}
