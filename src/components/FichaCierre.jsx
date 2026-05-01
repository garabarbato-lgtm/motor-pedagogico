import { useState } from "react";
import { supabase } from "../lib/supabase.js";
import { House, Printer } from "@phosphor-icons/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  C, renderTitulo,
  Andamiaje,
  renderEjercicioItem,
} from "./utils.jsx";
import FichaCanvas from "./FichaCanvas.jsx";
import FeedbackButton from "./FeedbackButton.jsx";

const BADGE_COLORS = {
  "Nivel 1": "#888888",
  "Nivel 2": "#00c48c",
  "Nivel 3": "#004733",
  "Punto de descanso": "#0d1f1a",
};

function GuardarFichaBtn({ ficha, registro, userId }) {
  const [estado, setEstado] = useState('idle');
  async function guardar() {
    if (estado === 'guardado') return;
    setEstado('guardando');
    const { error } = await supabase.from('fichas').insert({
      user_id: userId, titulo: ficha.titulo,
      area: registro?.area || '', grado: registro?.grado || '',
      bloque: registro?.bloque || null,
      tipo_ficha: registro?.tipo_ficha || 'cierre',
      ficha_data: ficha, registro_data: registro,
    });
    setEstado(error ? 'error' : 'guardado');
    if (error) setTimeout(() => setEstado('idle'), 3000);
  }
  const label = { idle: '☁ Guardar', guardando: 'Guardando...', guardado: '✓ Guardada', error: 'Error' };
  return (
    <button className="ficha-word-toolbar-btn" onClick={guardar}
      disabled={estado === 'guardando' || estado === 'guardado'} title="Guardar en mi biblioteca"
      style={estado === 'guardado' ? { color: '#00c48c' } : estado === 'error' ? { color: '#e53e3e' } : {}}>
      {label[estado]}
    </button>
  );
}

export default function FichaCierre({ ficha, registro, onNueva, onInicio, user }) {
  if (!ficha || !registro) return null;

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDescargarPDF = async () => {
    setIsDownloading(true);
    const element = document.getElementById("ficha-imprimible");
    if (!element) { setIsDownloading(false); return; }
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
      <button className="ficha-word-toolbar-btn" onClick={() => window.print()} title="Imprimir"><Printer size={18} /></button>
      {onNueva && <button className="ficha-word-toolbar-btn" onClick={onNueva} title="Nueva ficha">✦ Nueva</button>}
      {user && <GuardarFichaBtn ficha={ficha} registro={registro} userId={user.id} />}
    </>
  );

  const emojis = Array.isArray(ficha.emojis) && ficha.emojis.length ? ficha.emojis : ["📝"];
  const emojiLeft = emojis[0];
  const emojiRight = emojis[1] || emojis[0];
  const tituloTexto = (ficha.titulo || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .trim();
  const gradoDisplay = `${registro.grado}° grado`;
  const escalera = Array.isArray(ficha.escalera) ? ficha.escalera : [];

  const contenido = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        fontFamily: "'Lexend Deca', sans-serif",
        fontSize: 12,
        color: C.texto,
      }}
    >
      {/* ── Encabezado ── */}
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
          <h2
            contentEditable
            suppressContentEditableWarning
            className="ficha-campo-editable"
            style={{ fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1.25, letterSpacing: "-0.01em", textAlign: "center", flex: 1 }}
          >
            {tituloTexto}
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

      {/* ── Escalera ── */}
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
                <div style={{ flex: 1 }}>
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
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        className="ficha-campo-editable"
                        style={{ fontSize: 12, fontWeight: 700, color: C.texto, textDecoration: "underline", textUnderlineOffset: 2 }}
                      >
                        {peldano.nombre}
                      </span>
                    )}
                  </div>

                  {renderEjercicioItem(ejercicio, idx, { hideNum: true, editable: true })}
                </div>

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
