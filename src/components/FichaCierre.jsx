import { useRef } from "react";
import {
  C, renderTitulo,
  Andamiaje,
  renderEjercicioItem,
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

const BADGE_COLORS = {
  "Nivel 1": "#888888",
  "Nivel 2": "#00c48c",
  "Nivel 3": "#004733",
  "Punto de descanso": "#0d1f1a",
};

export default function FichaCierre({ ficha, registro }) {
  const refFicha = useRef(null);
  if (!ficha || !registro) return null;

  const emojis = Array.isArray(ficha.emojis) && ficha.emojis.length ? ficha.emojis : ["📝"];
  const emojiLeft = emojis[0];
  const emojiRight = emojis[1] || emojis[0];
  const tituloTexto = (ficha.titulo || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .trim();
  const gradoDisplay = `${registro.grado}° grado`;
  const escalera = Array.isArray(ficha.escalera) ? ficha.escalera : [];

  return (
    <div
      ref={refFicha}
      id="ficha-imprimible"
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
          flex: 19,
          background: C.fondoHeader,
          borderBottom: `2px solid ${C.borderFuerte}`,
          borderRadius: "8px 8px 0 0",
          padding: "12px 18px",
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
              <div style={{ borderBottom: `2px solid ${C.borderFuerte}`, height: 28 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Escalera (flex: 85) ── */}
      <div
        style={{
          flex: 85,
          padding: "12px 18px 8px",
          display: "flex",
          gap: 10,
          overflow: "hidden",
        }}
      >
        {/* Línea lateral degradada */}
        <div
          style={{
            width: 3,
            background: "linear-gradient(to bottom, #d0d0d0 0%, #00c48c 50%, #004733 100%)",
            borderRadius: 2,
            flexShrink: 0,
            marginLeft: 6,
          }}
        />

        {/* Peldaños */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {escalera.map((peldano, idx) => {
            if (!peldano) return null;
            const badgeColor = BADGE_COLORS[peldano.rotulo] || "#888888";
            const ejercicio = peldano.ejercicio || {};

            return (
              <div
                key={idx}
                style={{
                  border: "0.5px solid #e0e0e0",
                  borderRadius: 6,
                  padding: "8px 10px",
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                {/* Contenido del peldaño */}
                <div style={{ flex: 1 }}>
                  {/* Badge + nombre */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                    <span
                      style={{
                        background: badgeColor,
                        color: "#ffffff",
                        fontSize: 13,
                        fontWeight: 700,
                        borderRadius: 3,
                        padding: "3px 8px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                      }}
                    >
                      {peldano.rotulo}
                    </span>
                    {peldano.nombre && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.texto, textDecoration: "underline", textUnderlineOffset: 2 }}>
                        {peldano.nombre}
                      </span>
                    )}
                  </div>

                  {/* Ejercicio */}
                  {renderEjercicioItem(ejercicio, idx, { hideNum: true })}
                </div>

                {/* Andamiaje */}
                {peldano.andamiaje && <Andamiaje text={peldano.andamiaje} />}
              </div>
            );
          })}
        </div>
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
