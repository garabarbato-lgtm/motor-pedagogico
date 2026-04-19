export default function FeedbackButton({ isDownloading }) {
  if (isDownloading) return null;

  return (
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSdf7onmbIprlcs3jg9-7ZleYS9PFkD4VIYjSJlkv3ykdZM5nQ/viewform"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#F5A623",
        color: "#004733",
        border: "none",
        borderRadius: 24,
        padding: "10px 18px",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "'Lexend', sans-serif",
        textDecoration: "none",
        boxShadow: "0 2px 12px rgba(0,71,51,0.18)",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#e8951f"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#F5A623"; e.currentTarget.style.transform = "none"; }}
    >
      💬 Tu opinión nos ayuda a mejorar
    </a>
  );
}
