export default function Logo({ size = 22 }) {
  const D = "#0d1f1a";
  const G = "#00c48c";
  return (
    <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: size, letterSpacing: -1, lineHeight: 1 }}>
      <span style={{ color: D }}>t</span>
      <span style={{ color: G }}>i</span>
      <span style={{ color: D }}>z</span>
      <span style={{ color: G }}>a</span>
      <span style={{ color: D }}>.</span>
    </span>
  );
}
