export default function Logo({ size = 22 }) {
  const D = "#0d1f1a";
  const G = "#00c48c";
  const style = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 900,
    fontSize: `${size}px`,
    letterSpacing: "-1px",
    lineHeight: 1,
    display: "inline-block",
  };
  return (
    <span style={style}>
      <span style={{ color: D }}>t</span>
      <span style={{ color: G }}>i</span>
      <span style={{ color: D }}>z</span>
      <span style={{ color: G }}>a</span>
      <span style={{ color: D }}>.</span>
    </span>
  );
}
