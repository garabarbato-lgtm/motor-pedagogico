import { useState } from "react";

export default function FeedbackButton({ isDownloading }) {
  const [open, setOpen] = useState(false);
  const [voto, setVoto] = useState(null);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(
    () => !!sessionStorage.getItem("tiza_feedback_enviado")
  );

  if (isDownloading || enviado) return null;

  const handleVoto = (v) => {
    setVoto(v);
    setOpen(true);
  };

  const handleEnviar = async () => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voto, comentario }),
      });
    } catch (_) {}
    sessionStorage.setItem("tiza_feedback_enviado", "1");
    setEnviado(true);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 8,
      fontFamily: "Nunito, sans-serif",
    }}>
      {open && (
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          width: 256,
        }}>
          <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#111" }}>
            {voto === "util" ? "¡Genial! ¿Algo para mejorar?" : "¿Qué falló?"}
          </p>
          <textarea
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            placeholder="Opcional..."
            maxLength={200}
            style={{
              width: "100%",
              height: 72,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 8,
              fontSize: 13,
              resize: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              outline: "none",
              color: "#333",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={() => { setOpen(false); setVoto(null); }}
              style={{
                flex: 1, padding: "7px 0", border: "1px solid #e5e7eb",
                borderRadius: 8, background: "#fff", fontSize: 13,
                cursor: "pointer", color: "#666", fontFamily: "inherit",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleEnviar}
              style={{
                flex: 1, padding: "7px 0", border: "none",
                borderRadius: 8, background: "#1a5c38", color: "#fff",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {!open && (
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: "8px 14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#555",
        }}>
          <span style={{ fontWeight: 600 }}>¿Útil?</span>
          <button
            onClick={() => handleVoto("util")}
            title="Sí, fue útil"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "0 2px", lineHeight: 1 }}
          >
            👍
          </button>
          <button
            onClick={() => handleVoto("no_util")}
            title="No fue útil"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "0 2px", lineHeight: 1 }}
          >
            👎
          </button>
        </div>
      )}
    </div>
  );
}
