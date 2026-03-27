import { useState } from "react";

// ── Paleta B&N safe ──
// En pantalla: se ve con color
// Impreso: la jerarquía se sostiene por peso, borde y forma
const C = {
  fondo: "#ffffff",
  fondoHeader: "#f5f5f5",
  fondoSeccion: "#fafafa",
  acento: "#00c48c",       // solo decorativo en pantalla, nunca como único diferenciador
  texto: "#0d0d0d",        // negro casi puro → imprime sólido
  muted: "#555555",        // gris medio → imprime legible
  border: "#cccccc",       // gris claro → imprime suave
  borderFuerte: "#0d0d0d", // negro → imprime definido
  lineaEscritura: "#bbbbbb",
  fondoEjemplo: "#f0f0f0", // gris claro → imprime como zona diferenciada
  fondoReflexion: "#f7f7f0",
};

function LineaEscritura() {
  return (
    <div style={{
      borderBottom: `1.5px solid ${C.lineaEscritura}`,
      height: 34, width: "100%", marginBottom: 6
    }} />
  );
}

function SeccionHeader({ numero, titulo, icono }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      marginBottom: 14, paddingBottom: 10,
      borderBottom: `2px solid ${C.borderFuerte}`
    }}>
      {/* Círculo negro → imprime perfecto en B&N */}
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: C.borderFuerte, color: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 800, flexShrink: 0
      }}>
        {numero}
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: C.texto, letterSpacing: "0.01em" }}>
        {titulo}
      </span>
      {/* Ícono solo decorativo, no semántico */}
      <span style={{ fontSize: 14, marginLeft: "auto", opacity: 0.4 }}>{icono}</span>
    </div>
  );
}

export default function FichaTrabajoV2() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>

      {/* Botón imprimir */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button
          onClick={() => window.print()}
          style={{
            fontSize: 12, fontWeight: 600, padding: "8px 20px",
            borderRadius: 7, border: `2px solid ${C.borderFuerte}`,
            background: C.borderFuerte, color: C.acento, cursor: "pointer"
          }}>
          🖨 Imprimir ficha
        </button>
      </div>

      {/* ── FICHA ── */}
      <div id="ficha-imprimible" style={{
        background: C.fondo,
        border: `2.5px solid ${C.borderFuerte}`,
        borderRadius: 10,
        overflow: "hidden",
      }}>

        {/* ── ENCABEZADO ── */}
        <div style={{
          background: C.fondoHeader,
          borderBottom: `2.5px solid ${C.borderFuerte}`,
          padding: "18px 24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              {/* Tags — diferenciados por borde grueso, no por color */}
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                {["5° grado", "Matemática", "Números racionales"].map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 4, border: `1.5px solid ${C.borderFuerte}`,
                    color: C.texto, background: "white",
                    letterSpacing: "0.05em", textTransform: "uppercase"
                  }}>{tag}</span>
                ))}
              </div>
              <h2 style={{
                fontSize: 20, fontWeight: 800, color: C.texto,
                margin: 0, lineHeight: 1.2, letterSpacing: "-0.01em"
              }}>
                Fracciones equivalentes
              </h2>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 5, fontStyle: "italic" }}>
                Objetivo: Reconocer y construir fracciones equivalentes
              </p>
            </div>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 14, color: C.texto, flexShrink: 0 }}>
              motor<span style={{ color: C.acento }}>.</span>
            </span>
          </div>

          {/* Datos del alumno — línea negra sólida */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
            gap: 16, marginTop: 18
          }}>
            {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
              <div key={label}>
                <p style={{
                  fontSize: 10, color: C.muted, fontWeight: 700,
                  marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em"
                }}>
                  {label}
                </p>
                <div style={{ borderBottom: `2px solid ${C.borderFuerte}`, height: 26 }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── CUERPO ── */}
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 26 }}>

          {/* 1. LEEMOS */}
          <div>
            <SeccionHeader numero="1" titulo="Leemos juntos" icono="📖" />
            {/* Zona de lectura — diferenciada por fondo gris, no por color */}
            <div style={{
              background: C.fondoEjemplo,
              borderRadius: 6, padding: "14px 18px",
              border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${C.borderFuerte}`, // acento estructural en negro
            }}>
              <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.8, margin: 0 }}>
                Dos fracciones son <strong>equivalentes</strong> cuando representan la misma parte de un entero, aunque tengan números distintos.<br />
                Por ejemplo: si cortamos una pizza en <strong>2 partes iguales</strong> y comemos 1, es lo mismo que cortarla en <strong>4 partes</strong> y comer 2.
              </p>
            </div>

            {/* Ejemplo visual — tamaño y negrita como diferenciadores, no color */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 20, marginTop: 14, padding: "14px",
              border: `1.5px dashed ${C.border}`, borderRadius: 8
            }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: C.texto }}>1/2</span>
              <span style={{ fontSize: 18, color: C.muted, fontWeight: 400 }}>=</span>
              {/* Subrayado como diferenciador estructural */}
              <span style={{ fontSize: 24, fontWeight: 800, color: C.texto, textDecoration: "underline", textDecorationColor: C.acento, textUnderlineOffset: 4 }}>2/4</span>
              <span style={{ fontSize: 18, color: C.muted, fontWeight: 400 }}>=</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: C.texto, textDecoration: "underline", textDecorationColor: C.acento, textUnderlineOffset: 4 }}>4/8</span>
            </div>
          </div>

          {/* 2. COMPLETAMOS */}
          <div>
            <SeccionHeader numero="2" titulo="Completamos" icono="✏️" />
            <p style={{ fontSize: 13, color: C.texto, marginBottom: 16, lineHeight: 1.6 }}>
              Escribí el número que falta en cada cajita para formar fracciones equivalentes:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { base: "1/3", a: "□/6", b: "□/9" },
                { base: "2/5", a: "4/□", b: "□/15" },
                { base: "3/4", a: "□/8", b: "6/□" },
              ].map((fila, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 16px",
                  background: i % 2 === 0 ? C.fondo : C.fondoEjemplo,
                  borderRadius: 6, border: `1px solid ${C.border}`
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: C.texto, minWidth: 44 }}>
                    {fila.base}
                  </span>
                  <span style={{ color: C.muted, fontSize: 16 }}>=</span>
                  {/* Cajita con borde negro fuerte → imprime siempre */}
                  <div style={{
                    border: `2px solid ${C.borderFuerte}`, borderRadius: 5,
                    width: 64, height: 38, background: "white",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <span style={{ fontSize: 13, color: C.border, fontWeight: 500 }}>{fila.a}</span>
                  </div>
                  <span style={{ color: C.muted, fontSize: 16 }}>=</span>
                  <div style={{
                    border: `2px solid ${C.borderFuerte}`, borderRadius: 5,
                    width: 64, height: 38, background: "white",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <span style={{ fontSize: 13, color: C.border, fontWeight: 500 }}>{fila.b}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. REPRESENTAMOS */}
          <div>
            <SeccionHeader numero="3" titulo="Representamos" icono="🎨" />
            <p style={{ fontSize: 13, color: C.texto, marginBottom: 14, lineHeight: 1.6 }}>
              Dividí cada rectángulo para mostrar la fracción indicada:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[{ f: "1/2", desc: "(1 parte de 2)" }, { f: "2/4", desc: "(2 partes de 4)" }].map(({ f, desc }) => (
                <div key={f}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.texto, textAlign: "center", marginBottom: 6 }}>
                    {f} <span style={{ fontWeight: 400, color: C.muted, fontSize: 11 }}>{desc}</span>
                  </p>
                  <div style={{
                    border: `2px solid ${C.borderFuerte}`,
                    borderRadius: 6, height: 88, background: "white"
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* 4. REFLEXIONAMOS */}
          <div>
            <SeccionHeader numero="4" titulo="Reflexionamos" icono="💭" />
            <div style={{
              background: C.fondoReflexion,
              border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${C.borderFuerte}`,
              borderRadius: 6, padding: "12px 16px", marginBottom: 16
            }}>
              <p style={{ fontSize: 13, color: C.texto, fontStyle: "italic", margin: 0, lineHeight: 1.7 }}>
                ¿Podés pensar en un ejemplo de tu vida cotidiana donde uses fracciones equivalentes sin darte cuenta? Explicalo con tus palabras.
              </p>
            </div>
            <LineaEscritura />
            <LineaEscritura />
            <LineaEscritura />
          </div>

        </div>

        {/* ── FOOTER ── */}
        <div style={{
          borderTop: `2px solid ${C.borderFuerte}`,
          padding: "10px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: C.fondoHeader
        }}>
          <span style={{ fontSize: 11, color: C.muted }}>Motor Pedagógico PBA · Diseño Curricular 2018</span>
          <span style={{ fontSize: 11, color: C.muted }}>5° grado · Matemática</span>
        </div>
      </div>

      {/* CSS impresión */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #ficha-imprimible, #ficha-imprimible * { visibility: visible; }
          #ficha-imprimible {
            position: absolute; left: 0; top: 0;
            width: 100%; box-shadow: none !important;
            border-radius: 0 !important;
          }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
