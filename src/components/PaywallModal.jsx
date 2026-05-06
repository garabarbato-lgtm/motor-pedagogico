export default function PaywallModal({ fichasMes, limite, plan, linkPago, onCerrar }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(13,31,26,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 24, fontFamily: "'Lexend Deca', sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "36px 32px", maxWidth: 420, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0d1f1a", margin: "0 0 8px" }}>
          Llegaste al límite del mes
        </h2>
        <p style={{ fontSize: 14, color: "#555", margin: "0 0 20px", lineHeight: 1.6 }}>
          Usaste <strong>{fichasMes} de {limite} fichas</strong> del plan gratuito este mes.
        </p>
        <div style={{
          background: "#f0fdf8", border: "1.5px solid #b6ead9", borderRadius: 12,
          padding: "16px 18px", marginBottom: 24,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#004733", margin: "0 0 10px" }}>
            Con tiza. Premium obtenés:
          </p>
          {["50 fichas por mes", "Descarga en Word (.docx) editable", "Acceso a todas las funciones IA"].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: "#00c48c", fontWeight: 700, fontSize: 15 }}>✓</span>
              <span style={{ fontSize: 13, color: "#0d1f1a" }}>{item}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => window.open(linkPago, "_blank")}
          style={{
            width: "100%", padding: "14px", borderRadius: 10, border: "none",
            background: "#00c48c", color: "#0d1f1a", fontSize: 15, fontWeight: 800,
            cursor: "pointer", marginBottom: 10,
          }}
        >
          Suscribirme — $3.000/mes
        </button>
        <button
          onClick={onCerrar}
          style={{
            width: "100%", padding: "12px", borderRadius: 10,
            border: "1.5px solid #e0e0e0", background: "#fff",
            color: "#555", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Ahora no
        </button>
        <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", margin: "12px 0 0" }}>
          El límite se reinicia el 1° de cada mes
        </p>
      </div>
    </div>
  );
}
