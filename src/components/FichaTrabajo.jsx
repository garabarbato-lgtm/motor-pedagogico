import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";
import { track } from '@vercel/analytics'
import { House, Printer } from "@phosphor-icons/react";
import FichaPresenta from "./FichaPresenta.jsx";
import FichaPractica from "./FichaPractica.jsx";
import FichaCierre from "./FichaCierre.jsx";
import FeedbackButton from "./FeedbackButton.jsx";
import FichaCanvas from "./FichaCanvas.jsx";
import {
  EditableHtml, RecuadroRespuesta, LineasRespuesta,
  renderEjercicioItem,
} from "./utils.jsx";

const C = {
  fondo: "#ffffff",
  fondoHeader: "#f5f5f5",
  acento: "#00c48c",
  texto: "#0d1f1a",
  muted: "#555555",
  border: "#cccccc",
  borderFuerte: "#0d0d0d",
  lineaEscritura: "#bbbbbb",
  fondoApp: "#f8f8f4",
  btnBorder: "#d8ede8",
};

// ── Helpers ──

function tieneRespuestaEmbebida(texto) {
  if (!texto) return false;
  return texto.includes("<table") || /_{2,}/.test(texto);
}

function stripMarkdown(str) {
  if (!str) return str;
  return str
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[•\-]\s+/gm, "")
    .replace(/^\d+[.)]\s+/gm, "")
    .trim();
}

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

function separarPregunta(texto) {
  if (!texto) return { pregunta: "" };
  const match = texto.match(/^(.+?\?)\s+([\s\S]+)/);
  if (match) return { pregunta: match[1].trim() };
  return { pregunta: "" };
}

function parsearActividad(texto) {
  if (!texto) return { header: "Tu turno", items: [] };
  const lineas = texto.split("\n").map(l => l.trim()).filter(Boolean);
  let header = "Tu turno";
  let inicio = 0;
  const primera = lineas[0] || "";
  if (/tu turno|ahora vos/i.test(primera)) {
    header = primera.replace(/[:\s]+$/, "");
    inicio = 1;
  }
  const items = [];
  let actual = null;
  for (const linea of lineas.slice(inicio)) {
    const num = linea.match(/^(\d+)[.)]\s*(.*)/);
    if (num) {
      if (actual) items.push({ ...actual });
      actual = { num: num[1], texto: num[2] };
    } else if (actual) {
      actual.texto += " " + linea;
    } else if (items.length > 0) {
      items.push({ num: String(items.length + 1), texto: linea });
    }
  }
  if (actual) items.push({ ...actual });
  return { header, items };
}

// ── Sub-components ──

function LineaEscritura() {
  return (
    <div style={{ borderBottom: `1.5px solid ${C.lineaEscritura}`, height: 24, width: "100%", marginBottom: 4 }} />
  );
}

function SeccionHeader({ numero, titulo, icono }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingBottom: 6, borderBottom: `2px solid ${C.borderFuerte}` }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.borderFuerte, color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
        {numero}
      </div>
      <span
        contentEditable suppressContentEditableWarning
        className="ficha-campo-editable"
        style={{ fontSize: 12, fontWeight: 700, color: C.texto, letterSpacing: "0.01em" }}
      >{titulo}</span>
      <span style={{ fontSize: 12, marginLeft: "auto", opacity: 0.4 }}>{icono}</span>
    </div>
  );
}

function LineaDoble() {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ borderBottom: `1px dashed ${C.lineaEscritura}`, height: 15 }} />
      <div style={{ borderBottom: `1.5px solid ${C.lineaEscritura}`, height: 15 }} />
    </div>
  );
}

// ── Componente principal ──

function GuardarFichaBtn({ ficha, registro, userId }) {
  const [estado, setEstado] = useState('idle') // idle | verificando | guardando | guardado | duplicado | error

  async function guardar() {
    if (estado === 'guardado' || estado === 'duplicado') return
    setEstado('verificando')
    const { count } = await supabase
      .from('fichas')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('titulo', ficha.titulo)
      .eq('area', registro?.area || '')
      .eq('grado', registro?.grado || '')
    if (count > 0) { setEstado('duplicado'); return }
    setEstado('guardando')
    const { error } = await supabase.from('fichas').insert({
      user_id: userId,
      titulo: ficha.titulo,
      area: registro?.area || '',
      grado: registro?.grado || '',
      bloque: registro?.bloque || null,
      tipo_ficha: registro?.tipo_ficha || 'trabajo',
      ficha_data: ficha,
      registro_data: registro,
    })
    setEstado(error ? 'error' : 'guardado')
    if (error) setTimeout(() => setEstado('idle'), 3000)
  }

  const label = { idle: '☁ Guardar', verificando: 'Verificando...', guardando: 'Guardando...', guardado: '✓ Guardada', duplicado: '✓ Ya guardada', error: 'Error' }
  return (
    <button
      className="ficha-word-toolbar-btn"
      onClick={guardar}
      disabled={estado === 'verificando' || estado === 'guardando' || estado === 'guardado' || estado === 'duplicado'}
      title="Guardar en mi biblioteca"
      style={estado === 'guardado' || estado === 'duplicado' ? { color: '#00c48c' } : estado === 'error' ? { color: '#e53e3e' } : {}}
    >
      {label[estado]}
    </button>
  )
}

export default function FichaTrabajo({ ficha, registro, validacion, user, onNueva, onInicio }) {
  if (!ficha || !registro) return null;

  const [isDownloading, setIsDownloading] = useState(false);
  const [fichaOverrides, setFichaOverrides] = useState({});
  const [seleccionActual, setSeleccionActual] = useState(null);

  // Normalizar ficha (explicacion puede ser objeto con parrafos) — debe ir antes de los handlers
  const fichaLocal = (() => {
    const f = { ...ficha, ...fichaOverrides };
    if (f.explicacion && typeof f.explicacion === "object") {
      f.explicacion = Array.isArray(f.explicacion.parrafos)
        ? f.explicacion.parrafos.join("\n\n")
        : "";
    }
    return f;
  })();

  const itemsLocal = parsearActividad(fichaLocal.actividad).items;

  useEffect(() => {
    const capturar = () => {
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 2) {
        setSeleccionActual({ texto: sel.toString().trim(), range: sel.getRangeAt(0).cloneRange() });
      } else if (sel && sel.toString().trim().length === 0) {
        setSeleccionActual(null);
      }
    };
    document.addEventListener("mouseup", capturar);
    return () => document.removeEventListener("mouseup", capturar);
  }, []);

  const handleAgregarAndamiaje = async () => {
    const res = await fetch("/api/andamiaje", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ficha: fichaLocal, registro }),
    });
    const data = await res.json();
    if (data.explicacion || data.actividad) {
      setFichaOverrides(prev => ({ ...prev, explicacion: data.explicacion, actividad: data.actividad }));
    }
  };

  const handleExtenderActividades = async () => {
    const res = await fetch("/api/ejercicio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ficha: fichaLocal, registro }),
    });
    const data = await res.json();
    if (data.ejercicio) {
      setFichaOverrides(prev => ({ ...prev, actividad: (prev.actividad || fichaLocal.actividad || "") + "\n\n" + data.ejercicio }));
    }
  };

  const handleReformularSeleccion = async () => {
    if (!seleccionActual) return;
    const res = await fetch("/api/reformular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ficha: fichaLocal, registro, seleccion: seleccionActual.texto }),
    });
    const data = await res.json();
    if (data.texto && seleccionActual.range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(seleccionActual.range);
      document.execCommand("insertText", false, data.texto);
      setSeleccionActual(null);
    }
  };

  const esDosHojasObligatorio = false;

  // Delegar a FichaPresenta para presentaciones de una sola página
  if ((ficha?.tipo_ficha === "presentacion" || ficha?.tipo_ficha === "ortografia_pdl_presentacion") && !esDosHojasObligatorio) {
    return (
      <FichaPresenta
        ficha={ficha}
        registro={registro}
        validacion={validacion}
        user={user}
        onNueva={onNueva}
        onInicio={onInicio}
      />
    );
  }

  const isPDL = registro.area === "Prácticas del Lenguaje";
  const tituloTexto = (() => {
    const limpio = (fichaLocal.titulo || "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .trim();
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  })();
  const emojis = Array.isArray(ficha.emojis) && ficha.emojis.length ? ficha.emojis : ["📝"];
  const emojiLeft = emojis[0];
  const emojiRight = emojis[1] || emojis[0];
  const { pregunta: pregExplicacion } = separarPregunta(stripMarkdown(fichaLocal.explicacion));
  const gradoEsUno = registro.grado === "1";
  const gradoDisplay = `${registro.grado}° grado`;

  // ── PDF multi-página ──
  const handleDescargarPDF = async () => {
    setIsDownloading(true);
    const hojas = document.querySelectorAll(".ficha-hoja");
    if (!hojas.length) { setIsDownloading(false); return; }
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import("jspdf"),
      import("html2canvas"),
    ]);
    const areaSlug = registro.area.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < hojas.length; i++) {
      const el = hojas[i];
      el.style.boxShadow = "none";
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      el.style.boxShadow = "";
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const altoImg = (canvas.height * 210) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, 210, altoImg);
    }
    pdf.save(`tiza-${areaSlug}-${registro.grado}.pdf`);
    track('pdf_descargado', { area: registro.area, grado: registro.grado, tipo: registro.tipo_ficha })
    setIsDownloading(false);
  };

  // ── Routing por tipo_ficha ──

  const renderFichaEspecializada = (FichaComponent) => (
    <FichaComponent
      ficha={ficha}
      registro={registro}
      validacion={validacion}
      onNueva={onNueva}
      onInicio={onInicio}
    />
  );

  if (ficha.tipo_ficha === "practica") return renderFichaEspecializada(FichaPractica);
  if (ficha.tipo_ficha === "cierre") return renderFichaEspecializada(FichaCierre);

  // ── Acciones del toolbar ──
  const acciones = (
    <>
      {onInicio && <button className="ficha-word-toolbar-btn" onClick={onInicio} title="Inicio"><House size={18} /></button>}
      <button className="ficha-word-toolbar-btn" onClick={() => window.print()} title="Imprimir"><Printer size={18} /></button>
      {onNueva && <button className="ficha-word-toolbar-btn" onClick={onNueva} title="Nueva ficha">✦ Nueva</button>}
      {user && <GuardarFichaBtn ficha={ficha} registro={registro} userId={user.id} />}
    </>
  );

  // ── Encabezado con título ──
  const encabezadoConTitulo = (
    <div style={{ background: C.fondoHeader, borderBottom: `2.5px solid ${C.borderFuerte}`, borderRadius: "8px 8px 0 0", padding: "10px 16px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojiLeft}</span>
        <h2
          contentEditable suppressContentEditableWarning
          className="ficha-campo-editable"
          style={{ fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1.25, letterSpacing: "-0.01em", textAlign: "center", flex: 1 }}
        >
          {tituloTexto}
        </h2>
        <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emojiRight}</span>
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
  );

  // ── Encabezado sin título (hoja 2) ──
  const encabezadoSinTitulo = (
    <div style={{ background: C.fondoHeader, borderBottom: `2.5px solid ${C.borderFuerte}`, borderRadius: "8px 8px 0 0", padding: "10px 16px", flexShrink: 0 }}>
      <div className="ficha-header-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
        {["Nombre y apellido", "Fecha", "Grado / Sección"].map(label => (
          <div key={label}>
            <p style={{ fontSize: 9, color: C.muted, fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
            <div style={{ borderBottom: `2px solid ${C.borderFuerte}`, height: 20 }} />
          </div>
        ))}
      </div>
    </div>
  );

  // ── Footer ──
  const footer = (num) => (
    <div style={{ borderTop: `2px solid ${C.borderFuerte}`, borderRadius: "0 0 8px 8px", padding: "6px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.fondoHeader, flexShrink: 0 }}>
      <span style={{ fontSize: 10, color: C.muted }}>tiza. · Diseño Curricular 2018</span>
      <span style={{ fontSize: 10, color: C.muted }}>{gradoDisplay} · {registro.area} · {registro.bloque}</span>
    </div>
  );

  // ── Banners de validación / modo prueba ──
  const banners = (
    <>
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
      {ficha._mock && (
        <div style={{ background: "#fffbeb", borderBottom: "1px solid #f6ad55", padding: "8px 16px", fontSize: 11, color: "#92400e" }}>
          ⚠️ Modo de prueba — ficha de ejemplo. Configurá ANTHROPIC_API_KEY para generar fichas reales.
        </div>
      )}
    </>
  );

  // ── Layout dos hojas ──
  if (esDosHojasObligatorio) {
    const hoja1 = (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, fontFamily: "'Lexend Deca', sans-serif", fontSize: 12, color: C.texto }}>
        {banners}
        {encabezadoConTitulo}
        <div style={{ flex: 1, padding: "10px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {isPDL && registro.bloque === "Lectura de textos" ? (
            <div>
              <SeccionHeader numero="1" titulo="Leemos" icono="📖" />
              {Array.isArray(fichaLocal.glosario) && fichaLocal.glosario.length > 0 && (
                <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6, padding: "8px 12px", marginBottom: 8 }}>
                  <p style={{ fontSize: 10, color: "#1E40AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>📚 Palabras nuevas</p>
                  {fichaLocal.glosario.map((item, i) => (
                    <p key={i} style={{ fontSize: 11, color: C.texto, lineHeight: 1.5, margin: "0 0 2px" }}>
                      <strong>{item.palabra}</strong>: {item.definicion}
                    </p>
                  ))}
                </div>
              )}
              <EditableHtml
                html={renderHTMLConNegrita(fichaLocal.texto).__html}
                className="ficha-campo-editable"
                style={{ fontSize: 11, color: C.texto, lineHeight: 1.65, whiteSpace: "pre-line" }}
              />
            </div>
          ) : (
            <div>
              <SeccionHeader numero="1" titulo={pregExplicacion || "Leemos juntos"} icono="📖" />
              {fichaLocal.concepto_clave && (
                <div style={{ background: "#eafaf4", borderLeft: "3px solid #00c48c", borderRadius: "0 6px 6px 0", padding: "8px 12px", marginBottom: 8 }}>
                  <EditableHtml
                    html={renderHTMLConNegrita(fichaLocal.concepto_clave).__html}
                    className="ficha-campo-editable"
                    style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, fontWeight: 500 }}
                  />
                </div>
              )}
              <EditableHtml
                html={renderHTMLConNegrita(fichaLocal.explicacion).__html}
                className="ficha-campo-editable"
                style={{ fontSize: 12, color: C.texto, lineHeight: 1.6 }}
              />
            </div>
          )}
        </div>
        {footer(1)}
      </div>
    );

    const hoja2 = (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, fontFamily: "'Lexend Deca', sans-serif", fontSize: 12, color: C.texto }}>
        {encabezadoSinTitulo}
        <div style={{ flex: 1, padding: "10px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {isPDL && registro.bloque === "Lectura de textos" ? (
            <div>
              <SeccionHeader numero="2" titulo="Respondé" icono="✍️" />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Array.isArray(fichaLocal.preguntas) && fichaLocal.preguntas.map((preg, idx) => {
                  const pregTexto = typeof preg === "string" ? preg : preg.pregunta;
                  const pista = typeof preg === "object" ? preg.pista : null;
                  const inicioRespuesta = typeof preg === "object" ? preg.inicio_respuesta : null;
                  return (
                    <div key={idx}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                        <EditableHtml
                          html={renderHTMLConNegrita(pregTexto).__html}
                          className="ficha-campo-editable"
                          style={{ flex: 1, fontSize: 12, color: C.texto, lineHeight: 1.55 }}
                        />
                      </div>
                      {pista && (
                        <p style={{ fontSize: 10, color: "#1E40AF", background: "#EFF6FF", borderRadius: 4, padding: "2px 8px", margin: "0 0 4px 24px" }}>
                          💡 {pista}
                        </p>
                      )}
                      {inicioRespuesta && (
                        <p style={{ fontSize: 11, color: C.muted, fontStyle: "italic", margin: "0 0 2px 24px" }}>{inicioRespuesta} ___</p>
                      )}
                      <LineasRespuesta n={5} />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <SeccionHeader numero="2" titulo="Tu turno" icono="✏️" />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Array.isArray(fichaLocal.ejercicios) && fichaLocal.ejercicios.length > 0
                  ? fichaLocal.ejercicios.map((ejercicio, idx) => (
                      <div key={idx}>{renderEjercicioItem(ejercicio, idx, { editable: true })}</div>
                    ))
                  : itemsLocal.map(({ num, texto }, idx) => (
                    <div key={num}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{num}.</span>
                        <EditableHtml
                          html={renderHTMLConNegrita(texto).__html}
                          className="ficha-campo-editable"
                          style={{ flex: 1, fontSize: 12, color: C.texto, lineHeight: 1.55 }}
                        />
                      </div>
                      {!tieneRespuestaEmbebida(texto) && <RecuadroRespuesta />}
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
        {footer(2)}
      </div>
    );

    return (
      <>
        <FichaCanvas
          paginas={[hoja1, hoja2]}
          hojaId="ficha-imprimible"
          onDescargar={handleDescargarPDF}
          acciones={acciones}
          ficha={fichaLocal}
          registro={registro}
          onAgregarAndamiaje={handleAgregarAndamiaje}
          onExtenderActividades={handleExtenderActividades}
          onRegenerarFicha={handleReformularSeleccion}
          haySeleccion={!!seleccionActual}
        />
        <FeedbackButton isDownloading={isDownloading} />
      </>
    );
  }

  // ── Layout página única ──

  const hojaContenido = (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, fontFamily: "'Lexend Deca', sans-serif", fontSize: 12, color: C.texto }}>
      {banners}
      {encabezadoConTitulo}
      <div style={{ flex: 1, padding: "10px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {isPDL ? (

          registro.bloque === "Lectura de textos" ? (
            /* ── PDL: Lectura ── */
            <>
              <div>
                <SeccionHeader numero="1" titulo="Leemos" icono="📖" />
                {Array.isArray(fichaLocal.glosario) && fichaLocal.glosario.length > 0 && (
                  <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6, padding: "8px 12px", marginBottom: 8 }}>
                    <p style={{ fontSize: 10, color: "#1E40AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>📚 Palabras nuevas</p>
                    {fichaLocal.glosario.map((item, i) => (
                      <p key={i} style={{ fontSize: 11, color: C.texto, lineHeight: 1.5, margin: "0 0 2px" }}>
                        <strong>{item.palabra}</strong>: {item.definicion}
                      </p>
                    ))}
                  </div>
                )}
                <EditableHtml
                  html={renderHTMLConNegrita(fichaLocal.texto).__html}
                  className="ficha-campo-editable"
                  style={{ fontSize: 11, color: C.texto, lineHeight: 1.65, whiteSpace: "pre-line" }}
                />
              </div>
              <div>
                <SeccionHeader numero="2" titulo="Respondé" icono="✍️" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Array.isArray(fichaLocal.preguntas) && fichaLocal.preguntas.map((preg, idx) => {
                    const pregTexto = typeof preg === "string" ? preg : preg.pregunta;
                    const pista = typeof preg === "object" ? preg.pista : null;
                    const inicioRespuesta = typeof preg === "object" ? preg.inicio_respuesta : null;
                    return (
                      <div key={idx}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                          <EditableHtml
                            html={renderHTMLConNegrita(pregTexto).__html}
                            className="ficha-campo-editable"
                            style={{ flex: 1, fontSize: 12, color: C.texto, lineHeight: 1.55 }}
                          />
                        </div>
                        {pista && (
                          <p style={{ fontSize: 10, color: "#1E40AF", background: "#EFF6FF", borderRadius: 4, padding: "2px 8px", margin: "0 0 4px 24px" }}>
                            💡 {pista}
                          </p>
                        )}
                        {inicioRespuesta && (
                          <p style={{ fontSize: 11, color: C.muted, fontStyle: "italic", margin: "0 0 2px 24px" }}>{inicioRespuesta} ___</p>
                        )}
                        <LineasRespuesta n={3} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>

          ) : registro.bloque === "Escritura de textos" ? (
            /* ── PDL: Escritura ── */
            fichaLocal.fase === "planificacion" ? (
              <>
                <div>
                  <SeccionHeader numero="1" titulo="Antes de escribir, pensá..." icono="💭" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {Array.isArray(fichaLocal.preguntas_previas) && fichaLocal.preguntas_previas.map((preg, idx) => (
                      <div key={idx} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 12, color: C.muted, flexShrink: 0, marginTop: 1 }}>→</span>
                          <EditableHtml html={renderHTMLConNegrita(preg).__html} className="ficha-campo-editable" style={{ flex: 1, fontSize: 12, color: C.texto, lineHeight: 1.5 }} />
                        </div>
                        <LineasRespuesta n={2} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <SeccionHeader numero="2" titulo="Organizá tus ideas" icono="📋" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {Array.isArray(fichaLocal.organizador) && fichaLocal.organizador.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: 4 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 12, color: C.muted, flexShrink: 0, marginTop: 1 }}>→</span>
                          <EditableHtml html={renderHTMLConNegrita(item).__html} className="ficha-campo-editable" style={{ flex: 1, fontSize: 12, color: C.texto, lineHeight: 1.5 }} />
                        </div>
                        <LineasRespuesta n={1} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <SeccionHeader numero="3" titulo="Mi borrador" icono="📝" />
                  <EditableHtml html={renderHTMLConNegrita(fichaLocal.consigna_borrador).__html} className="ficha-campo-editable" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6, marginBottom: 8 }} />
                  <LineasRespuesta n={8} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <SeccionHeader numero="1" titulo="¡A escribir!" icono="✏️" />
                  <EditableHtml html={renderHTMLConNegrita(fichaLocal.consigna).__html} className="ficha-campo-editable" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6 }} />
                </div>
                {Array.isArray(fichaLocal.orientaciones) && fichaLocal.orientaciones.length > 0 && (
                  <div>
                    <SeccionHeader numero="2" titulo="Antes de escribir, pensá…" icono="💭" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {fichaLocal.orientaciones.map((orientacion, idx) => (
                        <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 12, color: C.muted, flexShrink: 0, marginTop: 1 }}>→</span>
                          <EditableHtml html={renderHTMLConNegrita(orientacion).__html} className="ficha-campo-editable" style={{ flex: 1, fontSize: 12, color: C.texto, lineHeight: 1.5 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <SeccionHeader numero={Array.isArray(fichaLocal.orientaciones) && fichaLocal.orientaciones.length > 0 ? "3" : "2"} titulo="Mi texto" icono="📝" />
                  {gradoEsUno
                    ? Array.from({ length: 8 }).map((_, i) => <LineaDoble key={i} />)
                    : Array.from({ length: 8 }).map((_, i) => <LineaEscritura key={i} />)
                  }
                </div>
              </>
            )

          ) : (
            /* ── PDL: Ortografía ── */
            fichaLocal.momento === "presentacion" ? (
              <>
                <div>
                  <SeccionHeader numero="1" titulo="La regla" icono="📚" />
                  {fichaLocal.concepto_clave && (
                    <div style={{ background: "#eafaf4", borderLeft: "3px solid #00c48c", borderRadius: "0 6px 6px 0", padding: "8px 12px", marginBottom: 8 }}>
                      <EditableHtml html={renderHTMLConNegrita(fichaLocal.concepto_clave).__html} className="ficha-campo-editable" style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, fontWeight: 500 }} />
                    </div>
                  )}
                  <EditableHtml html={renderHTMLConNegrita(fichaLocal.explicacion).__html} className="ficha-campo-editable" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6 }} />
                  {fichaLocal.ejemplo && (
                    <div style={{ background: "#f7f7f0", borderRadius: 6, padding: "8px 12px", border: `1px solid ${C.border}`, marginTop: 6 }}>
                      <p style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Ejemplo</p>
                      <EditableHtml html={renderHTMLConNegrita(fichaLocal.ejemplo).__html} className="ficha-campo-editable" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6 }} />
                    </div>
                  )}
                </div>
                <div>
                  <SeccionHeader numero="2" titulo="Practicamos" icono="✏️" />
                  {fichaLocal.ejercicio_guiado && renderEjercicioItem(fichaLocal.ejercicio_guiado, 0, { editable: true })}
                </div>
              </>
            ) : fichaLocal.momento === "cierre" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Array.isArray(fichaLocal.escalera) && fichaLocal.escalera.map((peldaño, idx) => (
                  <div key={idx} style={{ border: `1.5px solid ${C.borderFuerte}`, borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: C.acento }}>{peldaño.rotulo}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.texto }}>{peldaño.nombre}</span>
                    </div>
                    {renderEjercicioItem(peldaño.ejercicio, idx, { editable: true })}
                    {peldaño.ejercicio?.tipo === "texto_libre" && <LineasRespuesta n={6} />}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div>
                  <SeccionHeader numero="1" titulo="La regla" icono="📚" />
                  {fichaLocal.concepto_clave && (
                    <div style={{ background: "#eafaf4", borderLeft: "3px solid #00c48c", borderRadius: "0 6px 6px 0", padding: "8px 12px", marginBottom: 8 }}>
                      <EditableHtml html={renderHTMLConNegrita(fichaLocal.concepto_clave).__html} className="ficha-campo-editable" style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, fontWeight: 500 }} />
                    </div>
                  )}
                  <EditableHtml html={renderHTMLConNegrita(fichaLocal.explicacion).__html} className="ficha-campo-editable" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6 }} />
                  {fichaLocal.ejemplo && (
                    <div style={{ background: "#f7f7f0", borderRadius: 6, padding: "8px 12px", border: `1px solid ${C.border}`, marginTop: 6 }}>
                      <p style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Ejemplo</p>
                      <EditableHtml html={renderHTMLConNegrita(fichaLocal.ejemplo).__html} className="ficha-campo-editable" style={{ fontSize: 12, color: C.texto, lineHeight: 1.6 }} />
                    </div>
                  )}
                </div>
                <div>
                  <SeccionHeader numero="2" titulo="Practicamos" icono="✏️" />
                  {Array.isArray(fichaLocal.ejercicios) && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {fichaLocal.ejercicios.map((ejercicio, idx) =>
                        typeof ejercicio === "string" ? (
                          <div key={idx}>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{idx + 1}.</span>
                              <EditableHtml html={renderHTMLConNegrita(ejercicio).__html} className="ficha-campo-editable" style={{ flex: 1, fontSize: 12, color: C.texto, lineHeight: 1.5 }} />
                            </div>
                            {!tieneRespuestaEmbebida(ejercicio) && <RecuadroRespuesta />}
                          </div>
                        ) : (
                          <div key={idx}>{renderEjercicioItem(ejercicio, idx, { editable: true })}</div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </>
            )
          )

        ) : (

          /* ── No PDL: Matemática, Ciencias, etc. ── */
          (() => {
            const tieneExplicacion = !!(fichaLocal.explicacion || fichaLocal.concepto_clave || fichaLocal.ejemplo);
            const numTuTurno = tieneExplicacion ? 2 : 1;
            const numReflexion = tieneExplicacion ? 3 : 2;
            return (
              <>
                {tieneExplicacion && (
                  <div>
                    <SeccionHeader numero="1" titulo={pregExplicacion || "Leemos juntos"} icono="📖" />
                    {fichaLocal.concepto_clave && (
                      <div style={{ background: "#eafaf4", borderLeft: "3px solid #00c48c", borderRadius: "0 6px 6px 0", padding: "8px 12px", marginBottom: 8 }}>
                        <EditableHtml
                          html={renderHTMLConNegrita(fichaLocal.concepto_clave).__html}
                          className="ficha-campo-editable"
                          style={{ fontSize: 12, color: C.texto, lineHeight: 1.5, fontWeight: 500 }}
                        />
                      </div>
                    )}
                    <EditableHtml
                      html={renderHTMLConNegrita(fichaLocal.explicacion).__html}
                      className="ficha-campo-editable"
                      style={{ fontSize: 12, color: C.texto, lineHeight: 1.6 }}
                    />
                  </div>
                )}

                <div>
                  <SeccionHeader numero={numTuTurno} titulo="Tu turno" icono="✏️" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {Array.isArray(fichaLocal.ejercicios) && fichaLocal.ejercicios.length > 0
                      ? fichaLocal.ejercicios.map((ejercicio, idx) => (
                          <div key={idx}>{renderEjercicioItem(ejercicio, idx, { editable: true })}</div>
                        ))
                      : itemsLocal.map(({ num, texto }, idx) => (
                        <div key={num}>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: C.acento, minWidth: 16, flexShrink: 0 }}>{num}.</span>
                            <EditableHtml
                              html={renderHTMLConNegrita(texto).__html}
                              className="ficha-campo-editable"
                              style={{ flex: 1, fontSize: 12, color: C.texto, lineHeight: 1.55 }}
                            />
                          </div>
                          {!tieneRespuestaEmbebida(texto) && <RecuadroRespuesta />}
                        </div>
                      ))
                    }
                  </div>
                </div>

                {(fichaLocal.reflexion || fichaLocal.pregunta_reflexion) && (
                  <div>
                    <SeccionHeader numero={numReflexion} titulo="Reflexionamos" icono="💭" />
                    <EditableHtml
                      html={renderHTMLConNegrita(fichaLocal.reflexion || fichaLocal.pregunta_reflexion).__html}
                      className="ficha-campo-editable"
                      style={{ fontSize: 12, color: C.texto, fontStyle: "italic", lineHeight: 1.55 }}
                    />
                    <LineasRespuesta n={2} />
                  </div>
                )}
              </>
            );
          })()

        )}

      </div>
      {footer(1)}
    </div>
  );

  return (
    <>
      <FichaCanvas
        paginas={[hojaContenido]}
        hojaId="ficha-imprimible"
        onDescargar={handleDescargarPDF}
        acciones={acciones}
        ficha={fichaLocal}
        registro={registro}
        onAgregarAndamiaje={handleAgregarAndamiaje}
        onExtenderActividades={handleExtenderActividades}
        onRegenerarFicha={handleReformularSeleccion}
      />
      <FeedbackButton isDownloading={isDownloading} />
    </>
  );
}
