import {
  C, renderHTMLConNegrita, renderTitulo,
  LineasRespuesta, renderEjercicioItem,
} from "./utils.jsx";

const PRINT_CSS = `
@media print {
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 0.5cm; }
  html, body { margin: 0; padding: 0; }
  .ficha {
    width: 100% !important;
    min-height: auto !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}
`;

export default function FichaPractica({ ficha, registro }) {
  if (!ficha || !registro) return null;

  const emojis = Array.isArray(ficha.emojis) && ficha.emojis.length ? ficha.emojis : ["📝"];
  const emojiLeft = emojis[0];
  const emojiRight = emojis[1] || emojis[0];
  const tituloTexto = (ficha.titulo || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .trim();
  const gradoDisplay = `${registro.grado}° grado`;
  const ejercicios = Array.isArray(ficha.ejercicios) ? ficha.ejercicios : [];

  return (
    <div
      className="ficha"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "210mm",
        minHeight: "297mm",
        background: C.fondo,
        fontFamily: "'Lexend Deca', sans-serif",
        fontSize: 12,
        color: C.texto,
      }}
    >
      {/* ── Encabezado (flex: 15) ── */}
      <div
        style={{
          flex: 15,
          background: C.fondoHeader,
          borderBottom: `2px solid ${C.borderFuerte}`,
          borderRadius: "8px 8px 0 0",
          padding: "10px 18px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{emojiLeft}</span>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1.25, letterSpacing: "-0.01em", textAlign: "center", flex: 1 }}>
            {renderTitulo(tituloTexto)}
          </h2>
          <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{emojiRight}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
          {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
            <div key={label}>
              <p style={{ fontSize: 9, color: C.muted, fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {label}
              </p>
              <div style={{ borderBottom: `2px solid ${C.borderFuerte}`, height: 20 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Concepto clave (flex: 15) ── */}
      <div
        style={{
          flex: 15,
          padding: "8px 18px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {ficha.concepto_clave && (
          <div
            style={{
              background: "#eafaf4",
              borderLeft: "3px solid #00c48c",
              borderRadius: "0 4px 4px 0",
              padding: "6px 10px",
              fontSize: 9,
              fontWeight: 500,
              width: "100%",
            }}
            dangerouslySetInnerHTML={renderHTMLConNegrita(ficha.concepto_clave)}
          />
        )}
      </div>

      {/* ── Ejercicios (flex: 70) ── */}
      <div
        style={{
          flex: 70,
          padding: "4px 18px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflow: "hidden",
        }}
      >
        {ejercicios.map((ejercicio, idx) => {
          if (!ejercicio) return null;
          return (
            <div key={idx}>
              {renderEjercicioItem(ejercicio, idx)}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          background: C.fondoHeader,
          borderTop: `2px solid ${C.borderFuerte}`,
          padding: "5px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 10,
          color: C.muted,
        }}
      >
        <span>tiza. · Diseño Curricular 2018</span>
        <span>{gradoDisplay} · {registro.area} · {registro.bloque}</span>
      </div>

      <style>{PRINT_CSS}</style>
    </div>
  );
}
