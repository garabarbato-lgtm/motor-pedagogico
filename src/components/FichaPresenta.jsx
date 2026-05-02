import { useState } from "react";
import { House, Printer } from "@phosphor-icons/react";
import FeedbackButton from "./FeedbackButton.jsx";
import FichaCanvas from "./FichaCanvas.jsx";
import { C, EditableHtml, renderEjercicioItem } from "./utils.jsx";
import { supabase } from "../lib/supabase.js";

function GuardarBtn({ ficha, registro, userId }) {
  const [estado, setEstado] = useState("idle");
  async function guardar() {
    if (estado === "guardado") return;
    setEstado("guardando");
    const { error } = await supabase.from("fichas").insert({
      user_id: userId,
      titulo: ficha.titulo,
      area: registro?.area || "",
      grado: registro?.grado || "",
      bloque: registro?.bloque || null,
      tipo_ficha: registro?.tipo_ficha || "presentacion",
      ficha_data: ficha,
      registro_data: registro,
    });
    setEstado(error ? "error" : "guardado");
    if (error) setTimeout(() => setEstado("idle"), 3000);
  }
  const label = { idle: "☁ Guardar", guardando: "Guardando...", guardado: "✓ Guardada", error: "Error" };
  return (
    <button
      className="ficha-word-toolbar-btn"
      onClick={guardar}
      disabled={estado === "guardando" || estado === "guardado"}
      style={estado === "guardado" ? { color: "#00c48c" } : estado === "error" ? { color: "#e53e3e" } : {}}
    >
      {label[estado]}
    </button>
  );
}

// ── Helpers locales ──

function formatearFracciones(texto) {
  if (!texto) return texto;
  const s = typeof texto === "string" ? texto : String(texto);
  return s.replace(/<frac>(\d+)\/(\d+)<\/frac>/g, (_, num, den) =>
    `<span style="display:inline-flex;flex-direction:column;align-items:center;font-size:0.9em;line-height:1.1;vertical-align:middle;margin:0 4px;"><span style="border-bottom:1.5px solid currentColor;padding:0 4px;">${num}</span><span style="padding:0 4px;">${den}</span></span>`
  );
}

function renderHTMLConNegrita(str) {
  if (str === null || str === undefined) return { __html: "" };
  const s = typeof str === "string" ? str : String(str);
  if (!s) return { __html: "" };
  const html = formatearFracciones(s)
    .replace(/_{1,}/g, '<span style="font-family:Arial;letter-spacing:1px;">_______</span>')
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[•\-]\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return { __html: html };
}

function renderTitulo(texto) {
  if (!texto) return null;
  const colonIdx = texto.indexOf(":");
  if (colonIdx !== -1) {
    return (
      <>
        <span style={{ color: C.texto }}>{texto.slice(0, colonIdx + 1)}</span>
        <span style={{ color: C.acento }}>{texto.slice(colonIdx + 1)}</span>
      </>
    );
  }
  const palabras = texto.split(" ");
  if (palabras.length <= 2) return <span style={{ color: C.acento }}>{texto}</span>;
  const corte = Math.max(palabras.length - 2, 1);
  return (
    <>
      <span style={{ color: C.texto }}>{palabras.slice(0, corte).join(" ")}</span>
      {" "}
      <span style={{ color: C.acento }}>{palabras.slice(corte).join(" ")}</span>
    </>
  );
}

function SeccionHeader({ numero, titulo, icono }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingBottom: 6, borderBottom: `2px solid ${C.borderFuerte}` }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.borderFuerte, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
        {numero}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.texto }}>{titulo}</span>
      <span style={{ fontSize: 12, marginLeft: "auto", opacity: 0.4 }}>{icono}</span>
    </div>
  );
}

// ── Componente principal ──

export default function FichaPresenta({ ficha, registro, validacion, user, onNueva, onInicio }) {
  if (!ficha || !registro) return null;

  const [isDownloading, setIsDownloading] = useState(false);

  const tituloTexto = (() => {
    const limpio = (ficha.titulo || "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").trim();
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  })();

  const emojis = Array.isArray(ficha.emojis) && ficha.emojis.length ? ficha.emojis : ["📝"];
  const gradoDisplay = `${registro.grado}° grado`;
  const parrafos = ficha.explicacion?.parrafos || [];
  const pill = ficha.explicacion?.pill || null;
  const tieneAndamiaje = (ficha.ejercicios || []).some(e => e?.andamiaje);
  const mostrarPill = !!(pill?.contenido && !tieneAndamiaje);

  // Máximo 2 ejercicios para que la ficha entre en una hoja
  const ejercicios = (ficha.ejercicios || []).filter(Boolean).slice(0, 2);

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

  const handleImprimir = () => { window.print(); };

  const acciones = (
    <>
      {onInicio && (
        <button className="ficha-word-toolbar-btn" onClick={onInicio} title="Inicio"><House size={18} /></button>
      )}
      <button className="ficha-word-toolbar-btn" onClick={handleImprimir} title="Imprimir"><Printer size={18} /></button>
      {user && <GuardarBtn ficha={ficha} registro={registro} userId={user.id} />}
      {onNueva && (
        <button className="ficha-word-toolbar-btn" onClick={onNueva} title="Nueva ficha">✦ Nueva</button>
      )}
    </>
  );

  const contenido = (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, fontFamily: "'Lexend Deca', sans-serif", fontSize: 12, color: C.texto }}>

      {/* Validación */}
      {validacion?.observaciones?.length > 0 && (
        <div style={{ background: "#fffbeb", borderBottom: "1px solid #f59e0b", padding: "8px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", margin: "0 0 4px" }}>⚠ Revisá esta ficha</p>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {validacion.observaciones.map((obs, i) => (
              <li key={i} style={{ fontSize: 11, color: "#92400e" }}><strong>{obs.criterio}:</strong> {obs.descripcion}</li>
            ))}
          </ul>
        </div>
      )}

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
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Sección 1: Leemos juntos */}
        <div style={{ display: "flex", flexDirection: "column", padding: "12px 16px", borderBottom: `1.5px solid ${C.borderFuerte}` }}>
          <SeccionHeader numero="1" titulo="Leemos juntos" icono="📖" />
          <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {parrafos.map((p, i) => (
                <EditableHtml
                  key={i}
                  html={renderHTMLConNegrita(p).__html}
                  className="ficha-campo-editable"
                  style={{ fontSize: 13, color: C.texto, lineHeight: 1.75 }}
                />
              ))}
            </div>
            {mostrarPill && (
              <div style={{ width: 110, flexShrink: 0 }}>
                <div style={{ border: `1.5px solid ${C.acento}`, borderRadius: 10, padding: "7px 9px", background: "#fff" }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: C.acento, display: "block", marginBottom: 3 }}>
                    {pill.tipo === "pregunta_disparadora" ? "¿Y vos?" : "¿Sabías que...?"}
                  </span>
                  <EditableHtml
                    html={renderHTMLConNegrita(pill.contenido).__html}
                    className="ficha-campo-editable"
                    style={{ fontSize: 9, color: C.texto, lineHeight: 1.6 }}
                  />
                </div>
                <div style={{ width: 12, height: 9, borderLeft: `1.5px solid ${C.acento}`, borderBottom: `1.5px solid ${C.acento}`, marginLeft: 16, marginTop: -1, borderRadius: "0 0 0 6px" }} />
              </div>
            )}
          </div>
        </div>

        {/* Sección 2: Tu turno */}
        <div style={{ display: "flex", flexDirection: "column", padding: "12px 16px" }}>
          <SeccionHeader numero="2" titulo="Tu turno" icono="✏️" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ejercicios.map((ejercicio, idx) => (
              <div key={idx}>
                {renderEjercicioItem(ejercicio, idx, { editable: true })}
              </div>
            ))}
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
      />
      <FeedbackButton isDownloading={isDownloading} />
    </>
  );
}
