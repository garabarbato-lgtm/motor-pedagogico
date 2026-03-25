import { useState, useEffect, useMemo } from "react";
import curricularData from "../../dc_pba_base_curricular_corregida.json";

const C = {
  fondo: "#f8f8f4",
  acento: "#00c48c",
  acentoOscuro: "#008f66",
  texto: "#0d1f1a",
  suave: "#e0faf2",
  muted: "#4a6b60",
  btn: "#0d1f1a",
  btnText: "#00c48c",
  white: "#ffffff",
  border: "#d8ede8",
  gris: "#f0f0ec",
  error: "#fee2e2",
  errorTexto: "#991b1b",
};

// Mapeo grado display → valores reales en el JSON
const GRADOS = [
  { num: "1°", ciclo: "Unidad Pedagógica", valores: ["1"] },
  { num: "2°", ciclo: "Unidad Pedagógica", valores: ["2"] },
  { num: "3°", ciclo: "Primer ciclo", valores: ["3"] },
  { num: "4°", ciclo: "Segundo ciclo", valores: ["4"] },
  { num: "5°", ciclo: "Segundo ciclo", valores: ["5"] },
  { num: "6°", ciclo: "Segundo ciclo", valores: ["6"] },
];

const AREAS_CONFIG = {
  "Matemática":              { emoji: "🔢", color: "#e8f0ff", colorHover: "#c5d5ff", border: "#c5d5ff", borderHover: "#7a9ef5", desc: "Números, geometría, medidas" },
  "Prácticas del Lenguaje":  { emoji: "📖", color: "#fff0e8", colorHover: "#ffd5b8", border: "#ffd5b8", borderHover: "#f5a06a", desc: "Lectura, escritura, oralidad" },
  "Ciencias Naturales":      { emoji: "🔬", color: "#e8fff4", colorHover: "#b8ffdc", border: "#b8ffdc", borderHover: "#00c48c", desc: "Seres vivos, cuerpo, materiales" },
  "Ciencias Sociales":       { emoji: "🌍", color: "#fef9e0", colorHover: "#fde98a", border: "#fde98a", borderHover: "#e6c800", desc: "Historia, geografía, sociedad" },
};

// ── PDL — Datos para el flujo en cascada ──

const PDL_TIPOS_FICHA = [
  { nombre: "Lectura de textos", emoji: "📖", desc: "Texto breve + preguntas de comprensión" },
  { nombre: "Escritura de textos", emoji: "✏️", desc: "Consigna + orientaciones para escribir" },
  { nombre: "Ortografía", emoji: "🔤", desc: "Ejercicios sobre la regla elegida" },
];

const PDL_TIPOS_TEXTO_LECTURA = {
  "1": ["Cuento", "Fábula", "Poesía", "Trabalenguas y adivinanzas", "Historieta", "Libro álbum", "Obra de teatro", "Noticia", "Afiche y folleto", "Reglamento"],
  "2": ["Cuento", "Fábula", "Poesía", "Trabalenguas y adivinanzas", "Historieta", "Libro álbum", "Obra de teatro", "Noticia", "Afiche y folleto", "Reglamento"],
  "3": ["Cuento", "Fábula", "Leyenda", "Poesía", "Obra de teatro", "Novela", "Historieta", "Haiku", "Noticia", "Enciclopedia y manual", "Carta", "Afiche y folleto"],
  "4": ["Cuento", "Fábula", "Leyenda", "Poesía", "Obra de teatro", "Novela", "Historieta", "Haiku", "Noticia", "Artículo de enciclopedia", "Manual", "Carta formal", "Afiche y folleto"],
  "5": ["Cuento", "Poesía", "Obra de teatro", "Novela", "Historieta", "Noticia", "Artículo de divulgación", "Enciclopedia", "Manual", "Carta de lector", "Afiche"],
  "6": ["Cuento", "Poesía", "Obra de teatro", "Novela", "Historieta", "Noticia", "Nota de opinión", "Artículo de enciclopedia", "Manual", "Reglamento y normas"],
};

// Prácticas lectoras por categoría de texto y grado
const PDL_PRACTICAS_LECTORAS = {
  narrativo: {
    "1": ["Reconocer los personajes principales", "Identificar qué pasó al principio, en el medio y al final", "Describir cómo es el personaje principal", "Decir qué problema tuvo el personaje y cómo lo resolvió"],
    "2": ["Reconocer los personajes principales", "Identificar qué pasó al principio, en el medio y al final", "Describir cómo es el personaje principal", "Decir qué problema tuvo el personaje y cómo lo resolvió"],
    "3": ["Reconocer personajes principales y secundarios", "Ordenar los hechos del texto", "Describir el lugar y el tiempo donde ocurre la historia", "Identificar la moraleja (solo fábula)", "Explicar por qué actuó así el personaje"],
    "4": ["Inferir los sentimientos o motivaciones de los personajes", "Identificar el conflicto central y cómo se resuelve", "Reconocer el narrador y su punto de vista", "Comparar dos versiones de un mismo texto (leyenda / cuento)", "Dar opinión sobre lo leído y justificarla"],
    "5": ["Inferir los sentimientos o motivaciones de los personajes", "Identificar el conflicto central y cómo se resuelve", "Reconocer el narrador y su punto de vista", "Comparar dos versiones de un mismo texto (leyenda / cuento)", "Dar opinión sobre lo leído y justificarla"],
    "6": ["Identificar recursos literarios: comparaciones, repeticiones", "Analizar cómo el autor construye el suspenso o la emoción", "Relacionar el texto con situaciones de la vida real", "Reconocer el género y sus características"],
  },
  poesia: {
    "1": ["Identificar palabras que riman"],
    "2": ["Identificar palabras que riman", "Reconocer de qué habla el poema", "Expresar qué sentimiento te produce escucharlo"],
    "3": ["Identificar las palabras que riman y el efecto que producen", "Reconocer una comparación o imagen dentro del poema", "Explicar con tus palabras de qué trata el poema", "Expresar qué te gustó o no te gustó y por qué"],
    "4": ["Reconocer recursos: comparaciones, repeticiones, personificaciones", "Interpretar el significado de una imagen poética", "Identificar el tema del poema y cómo lo desarrolla el autor", "Dar opinión sobre el poema y justificarla"],
    "5": ["Reconocer recursos: comparaciones, repeticiones, personificaciones", "Interpretar el significado de una imagen poética", "Identificar el tema del poema y cómo lo desarrolla el autor", "Dar opinión sobre el poema y justificarla"],
    "6": ["Analizar la estructura del poema: estrofas, versos, rima", "Reconocer el tono del poema y cómo lo construye el autor", "Comparar dos poemas sobre el mismo tema", "Identificar el tipo de poema y sus características"],
  },
  teatro: {
    "1": ["Reconocer los personajes de la obra", "Identificar qué problema tienen los personajes", "Decir cómo termina la historia"],
    "2": ["Reconocer los personajes de la obra", "Identificar qué problema tienen los personajes", "Decir cómo termina la historia"],
    "3": ["Reconocer personajes principales y secundarios", "Identificar qué dice cada personaje y cómo lo dice", "Distinguir el diálogo de las acotaciones", "Explicar cómo se resuelve el conflicto"],
    "4": ["Reconocer las partes de la obra: escenas y actos", "Inferir los sentimientos de los personajes a partir de sus diálogos", "Identificar el conflicto central y cómo evoluciona", "Dar opinión sobre las decisiones de los personajes"],
    "5": ["Reconocer las partes de la obra: escenas y actos", "Inferir los sentimientos de los personajes a partir de sus diálogos", "Identificar el conflicto central y cómo evoluciona", "Dar opinión sobre las decisiones de los personajes"],
    "6": ["Analizar cómo el autor construye los personajes a través del diálogo", "Reconocer el tono de la obra: dramático, humorístico, etc.", "Identificar las acotaciones y su función dentro del texto", "Relacionar la obra con su contexto o con otras obras leídas"],
  },
  historieta: {
    "1": ["Reconocer los personajes de la historieta", "Identificar qué pasa en cada viñeta", "Contar con tus palabras de qué trata la historia"],
    "2": ["Reconocer los personajes de la historieta", "Identificar qué pasa en cada viñeta", "Contar con tus palabras de qué trata la historia"],
    "3": ["Reconocer personajes principales y secundarios", "Identificar el problema y cómo se resuelve", "Distinguir lo que dicen los personajes de lo que hace el narrador", "Reconocer la secuencia de viñetas y su orden"],
    "4": ["Interpretar el significado de una imagen sin texto", "Identificar el humor o el recurso cómico que usa el autor", "Reconocer cómo se complementan imagen y texto", "Dar opinión sobre los personajes o la situación"],
    "5": ["Interpretar el significado de una imagen sin texto", "Identificar el humor o el recurso cómico que usa el autor", "Reconocer cómo se complementan imagen y texto", "Dar opinión sobre los personajes o la situación"],
    "6": ["Analizar cómo el dibujante usa el espacio de la viñeta para contar", "Reconocer recursos gráficos: globos, onomatopeyas, líneas de movimiento", "Comparar la historieta con otro texto narrativo sobre el mismo tema", "Identificar el género de la historieta y sus características"],
  },
  informativo: {
    "1": ["Decir de qué tema trata el texto", "Identificar una información nueva que aprendiste", "Reconocer para qué sirve el título"],
    "2": ["Decir de qué tema trata el texto", "Identificar una información nueva que aprendiste", "Reconocer para qué sirve el título"],
    "3": ["Identificar el tema principal del texto", "Reconocer la información más importante", "Distinguir el título, los subtítulos y para qué sirven", "Formular una pregunta sobre el tema después de leer"],
    "4": ["Identificar la idea principal de cada párrafo", "Reconocer cómo está organizada la información", "Distinguir definiciones, ejemplos y explicaciones dentro del texto", "Relacionar la información del texto con lo que ya sabías del tema"],
    "5": ["Identificar la idea principal de cada párrafo", "Reconocer cómo está organizada la información", "Distinguir definiciones, ejemplos y explicaciones dentro del texto", "Relacionar la información del texto con lo que ya sabías del tema"],
    "6": ["Analizar cómo el autor organiza y jerarquiza la información", "Reconocer el propósito del texto: informar, explicar, convencer", "Comparar información sobre el mismo tema en dos fuentes distintas", "Evaluar si la información del texto es suficiente para entender el tema"],
  },
  uso_social: {
    "1": ["Decir para qué sirve el texto", "Identificar a quién está dirigido"],
    "2": ["Decir para qué sirve el texto", "Identificar a quién está dirigido"],
    "3": ["Identificar para qué sirve el texto y a quién está dirigido", "Reconocer las partes del texto: saludo, cuerpo, cierre (carta) o título, reglas (reglamento)", "Decir si el texto cumple su propósito"],
    "4": ["Reconocer el propósito del texto y si lo logra", "Identificar el tono: formal o informal", "Distinguir la solicitud, la opinión o la norma según el tipo de texto"],
    "5": ["Reconocer el propósito del texto y si lo logra", "Identificar el tono: formal o informal", "Distinguir la solicitud, la opinión o la norma según el tipo de texto"],
    "6": ["Analizar si el texto es adecuado para su destinatario y propósito", "Reconocer los recursos que usa el autor para persuadir o convencer", "Dar opinión fundamentada sobre el contenido del texto"],
  },
  noticia: {
    "1": ["Decir de qué trata la noticia", "Identificar a quién le pasó y dónde"],
    "2": ["Decir de qué trata la noticia", "Identificar a quién le pasó y dónde"],
    "3": ["Identificar qué pasó, quién, dónde y cuándo", "Reconocer el título y explicar para qué sirve", "Distinguir la información más importante de los detalles"],
    "4": ["Identificar qué pasó, quién, dónde, cuándo y por qué", "Reconocer el punto de vista del autor de la noticia", "Distinguir hechos de opiniones dentro del texto", "Comparar cómo dos medios cuentan la misma noticia"],
    "5": ["Identificar qué pasó, quién, dónde, cuándo y por qué", "Reconocer el punto de vista del autor de la noticia", "Distinguir hechos de opiniones dentro del texto", "Comparar cómo dos medios cuentan la misma noticia"],
    "6": ["Analizar los recursos que usa el medio para presentar la noticia", "Reconocer si el texto es objetivo o tiene intención persuasiva", "Relacionar la noticia con el contexto social o histórico", "Dar opinión fundamentada sobre el tema de la noticia"],
  },
};

// Mapeo de tipo de texto → categoría de prácticas lectoras
const PDL_NARRATIVOS = ["Cuento", "Fábula", "Leyenda", "Novela", "Libro álbum"];
const PDL_POESIA = ["Poesía", "Haiku", "Trabalenguas y adivinanzas"];
const PDL_INFORMATIVOS = ["Enciclopedia", "Manual", "Artículo de enciclopedia", "Artículo de divulgación", "Enciclopedia y manual"];
const PDL_USO_SOCIAL = ["Carta", "Carta formal", "Carta de lector", "Afiche y folleto", "Afiche", "Reglamento", "Reglamento y normas", "Nota de opinión"];

function getPracticasPDL(tipoTexto, gradoNum) {
  let categoria;
  if (PDL_NARRATIVOS.includes(tipoTexto))       categoria = "narrativo";
  else if (PDL_POESIA.includes(tipoTexto))       categoria = "poesia";
  else if (tipoTexto === "Obra de teatro")        categoria = "teatro";
  else if (tipoTexto === "Historieta")            categoria = "historieta";
  else if (PDL_INFORMATIVOS.includes(tipoTexto)) categoria = "informativo";
  else if (PDL_USO_SOCIAL.includes(tipoTexto))   categoria = "uso_social";
  else if (tipoTexto === "Noticia")               categoria = "noticia";
  else                                            categoria = "narrativo";
  return (PDL_PRACTICAS_LECTORAS[categoria] || {})[gradoNum] || [];
}

const PDL_TIPOS_TEXTO_ESCRITURA = {
  "1": ["Textos breves en contexto: listas, títulos, etiquetas, epígrafes", "Nueva versión de un cuento conocido (con ayuda del docente)", "Recomendación de un libro"],
  "2": ["Textos breves en contexto: listas, títulos, etiquetas, epígrafes", "Nueva versión de un cuento conocido (con ayuda del docente)", "Recomendación de un libro"],
  "3": ["Nueva versión de un cuento tradicional", "Reescritura de un cuento en versión dramática", "Afiche o invitación", "Texto de estudio (para comunicar lo aprendido)"],
  "4": ["Narración: fábula · leyenda · cuento", "Carta formal", "Artículo de enciclopedia", "Historieta o haiku", "Transformación de texto: narrativo → dramático"],
  "5": ["Texto literario: cuento · poema visual", "Carta de lector", "Artículo de divulgación científica", "Noticia", "Transformación de texto: narración → obra de teatro"],
  "6": ["Texto literario: cuento · capítulo de novela", "Nota de opinión", "Reseña", "Texto institucional: reglamento · normas", "Texto de estudio"],
};

const PDL_REGLAS_ORTOGRAFIA = {
  "1": ["Las letras y sus sonidos", "Mayúsculas al inicio de oración y en nombres propios", "Separación de palabras", "Punto al final de la oración"],
  "2": ["Repaso y consolidación de mayúsculas y punto", "Coma en enumeraciones", "Signos de interrogación y exclamación"],
  "3": ["mb · nv · nr", "Plurales: z → ces", "Terminación -aba del pretérito imperfecto", "Mayúsculas (consolidación)", "Sílaba tónica (preparación para la tilde en 4°)"],
  "4": ["Familias de palabras para resolver dudas ortográficas", "Terminaciones: -aje · -ducir · -bundo/a", "Tilde (sistematización)", "Raya de diálogo"],
  "5": ["Homófonos: haber/a ver · hay/ay · hacer/a ser", "Tilde en hiato", "Tilde en pronombres interrogativos", "Signos de puntuación (uso pertinente)"],
  "6": ["Tilde diacrítica", "Tilde en adverbios terminados en -mente", "Homófonos: hecho/echo · valla/vaya · halla/haya", "Signos de puntuación avanzados: paréntesis · puntos suspensivos · dos puntos"],
};

// ── Subcomponentes ──

function BloqueConfirmado({ emoji, label, valor, onClick, color }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        gap: 12, padding: "14px 18px",
        background: hov ? C.btn : (color || C.white),
        border: `1px solid ${hov ? C.btn : C.border}`,
        borderRadius: 12, cursor: "pointer",
        transition: "all 0.18s", textAlign: "left", marginBottom: 8,
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: C.acento, display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={C.btn} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 14, color: hov ? C.white : C.texto, fontWeight: 500, margin: "2px 0 0", transition: "color 0.18s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {emoji && <span style={{ marginRight: 6 }}>{emoji}</span>}
          {valor}
        </p>
      </div>
      <span style={{
        fontSize: 11, padding: "3px 10px", borderRadius: 20, flexShrink: 0, transition: "all 0.18s",
        background: hov ? C.acento : C.gris,
        color: hov ? C.btn : C.muted,
      }}>
        Cambiar
      </span>
    </button>
  );
}

function PasoActivo({ pregunta, sub, children }) {
  return (
    <div style={{ animation: "fadeUp 0.35s cubic-bezier(.22,1,.36,1) both" }}>
      <h2 style={{
        fontFamily: "Georgia, serif",
        fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 400,
        color: C.texto, lineHeight: 1.25,
        letterSpacing: "-0.02em", marginBottom: sub ? 8 : 20
      }}>
        {pregunta}
      </h2>
      {sub && <p style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>{sub}</p>}
      {children}
    </div>
  );
}

function GradoBtn({ g, i, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "22px 8px", borderRadius: 12,
        border: `1.5px solid ${hov ? C.btn : C.border}`,
        background: hov ? C.btn : C.white,
        cursor: "pointer", transition: "all 0.18s",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        transform: hov ? "translateY(-2px)" : "none",
        animation: `fadeUp 0.3s ${i * 0.05}s both`
      }}
    >
      <span style={{ fontSize: 26, fontWeight: 800, fontFamily: "Georgia, serif", transition: "color 0.18s", color: hov ? C.acento : C.texto }}>{g.num}</span>
      <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.4, transition: "color 0.18s", color: C.muted }}>{g.ciclo}</span>
    </button>
  );
}

function AreaBtn({ a, i, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "22px 18px", borderRadius: 14,
        border: `1.5px solid ${hov ? a.borderHover : a.border}`,
        background: hov ? a.colorHover : a.color,
        cursor: "pointer", textAlign: "left",
        transition: "all 0.18s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 10px 28px rgba(0,0,0,0.10)" : "0 2px 8px rgba(0,0,0,0.04)",
        animation: `fadeUp 0.3s ${i * 0.07}s both`
      }}
    >
      <div style={{ fontSize: 30, marginBottom: 10 }}>{a.emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.texto, marginBottom: 4 }}>{a.nombre}</div>
      <div style={{ fontSize: 12, color: C.muted }}>{a.desc}</div>
    </button>
  );
}

function OpcionBtn({ label, i, onClick, suave = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "16px 20px", borderRadius: 10,
        border: `1.5px solid ${hov ? C.acento : C.border}`,
        background: hov && suave ? C.suave : C.white, cursor: "pointer",
        textAlign: "left", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        transition: "all 0.15s",
        animation: `fadeUp 0.3s ${i * 0.07}s both`
      }}
    >
      <span style={{ fontSize: 14, color: hov ? C.acento : C.texto, fontWeight: 500, transition: "color 0.15s", lineHeight: 1.5 }}>{label}</span>
      <span style={{ color: hov ? C.acento : C.border, fontSize: 18, flexShrink: 0, marginLeft: 12, transition: "color 0.15s" }}>›</span>
    </button>
  );
}

// ── Componente principal ──

export default function Generador({ onFichaGenerada, onVolver }) {
  const [paso, setPaso] = useState(1);
  const [gradoData, setGradoData] = useState(null);     // { num, ciclo, valores }
  const [area, setArea] = useState(null);
  const [areaConfig, setAreaConfig] = useState(null);
  const [bloque, setBloque] = useState(null);
  const [registro, setRegistro] = useState(null);       // full JSON record selected (non-PDL)
  const [curricular] = useState(curricularData);
  const [incluirExplicacion, setIncluirExplicacion] = useState(false);
  const [incluirEjemplo, setIncluirEjemplo] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [mensajeLoading, setMensajeLoading] = useState(0); // 0 Generando · 1 Validando · 2 ¡Lista!
  const [error, setError] = useState(null);

  // Estado PDL
  const [isPDL, setIsPDL] = useState(false);
  const [pdlTipoTexto, setPdlTipoTexto] = useState(null);  // tipo de texto o regla elegida
  const [pdlPractica, setPdlPractica] = useState(null);    // práctica lectora (solo Lectura)

  // Derivados
  const gradoNum = gradoData?.valores[0] || "1";

  const areasDisponibles = useMemo(() => {
    if (!gradoData) return [];
    const nombres = [...new Set(
      curricular.filter(r => gradoData.valores.includes(String(r.grado))).map(r => r.area)
    )];
    return nombres.map(nombre => ({ nombre, ...AREAS_CONFIG[nombre] })).filter(a => a.color);
  }, [curricular, gradoData]);

  const bloquesDisponibles = useMemo(() => {
    if (!gradoData || !area || isPDL) return [];
    return [...new Set(
      curricular
        .filter(r => gradoData.valores.includes(String(r.grado)) && r.area === area)
        .map(r => r.bloque)
    )].sort();
  }, [curricular, gradoData, area, isPDL]);

  const contenidosDisponibles = useMemo(() => {
    if (!gradoData || !area || !bloque || isPDL) return [];
    return curricular
      .filter(r => gradoData.valores.includes(String(r.grado)) && r.area === area && r.bloque === bloque)
      .sort((a, b) => a.item_original.localeCompare(b.item_original));
  }, [curricular, gradoData, area, bloque, isPDL]);

  const elegir = (setter, val, sig) => { setter(val); setTimeout(() => setPaso(sig), 160); };

  const volver = (p) => {
    setPaso(p);
    if (p <= 1) setGradoData(null);
    if (p <= 2) { setArea(null); setAreaConfig(null); setIsPDL(false); }
    if (p <= 3) { setBloque(null); setPdlTipoTexto(null); setPdlPractica(null); }
    if (p <= 4) { setRegistro(null); setPdlTipoTexto(null); setPdlPractica(null); }
    setError(null);
    setGenerando(false);
    setMensajeLoading(0);
  };

  // Volver solo a elegir práctica (mantiene tipo de texto ya elegido)
  const volverPDLPractica = () => {
    setPaso(4);
    setPdlPractica(null);
    setError(null);
  };

  const generar = async () => {
    if (isPDL) {
      if (!bloque || !pdlTipoTexto) return;
      if (bloque === "Lectura de textos" && !pdlPractica) return;
    } else {
      if (!registro) return;
    }

    setGenerando(true);
    setMensajeLoading(0);
    setError(null);

    const timer4s = setTimeout(() => setMensajeLoading(1), 4000);

    const payload = isPDL
      ? {
          contenido: {
            grado: gradoNum,
            area: "Prácticas del Lenguaje",
            tipoFicha: bloque,
            tipoTexto: pdlTipoTexto,
            practica: pdlPractica,
          },
          tipoFicha: bloque,
        }
      : {
          contenido: {
            grado: registro.grado,
            area: registro.area,
            bloque: registro.bloque,
            item: registro.item_original,
          },
          tipoFicha: "ficha de trabajo",
          incluirExplicacion,
          incluirEjemplo,
        };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      clearTimeout(timer4s);
      if (!res.ok) throw new Error('Error en el servidor');
      const resultado = await res.json();
      setMensajeLoading(2);

      const registroParaFicha = isPDL
        ? {
            grado: gradoNum,
            area: "Prácticas del Lenguaje",
            bloque: bloque,
            item_original: bloque === "Lectura de textos"
              ? `${pdlTipoTexto} — ${pdlPractica}`
              : pdlTipoTexto,
            objetivo: null,
          }
        : registro;

      setTimeout(() => {
        setGenerando(false);
        onFichaGenerada(resultado.ficha, registroParaFicha, resultado.validacion);
      }, 1000);
    } catch (err) {
      clearTimeout(timer4s);
      setGenerando(false);
      setMensajeLoading(0);
      setError('No se pudo generar la ficha. Verificá tu conexión e intentá de nuevo.');
    }
  };

  const totalPasos = 5;
  const progreso = generando ? 100 : Math.round(((paso - 1) / (totalPasos - 1)) * 100);


  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: C.fondo, minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: `0.5px solid ${C.border}`,
        background: "rgba(248,248,244,0.95)", backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 10
      }}>
        <button onClick={onVolver} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 400, color: C.texto }}>
          FichaIA<span style={{ color: C.acento }}>.</span>
        </button>
        <span style={{ fontSize: 12, color: C.muted }}>
          {generando ? "Generando…" : `Paso ${paso} de ${totalPasos}`}
        </span>
      </nav>

      {/* Barra de progreso */}
      <div style={{ height: 2, background: C.border }}>
        <div style={{
          height: "100%", background: C.acento,
          width: `${progreso}%`,
          transition: "width 0.5s cubic-bezier(.22,1,.36,1)"
        }} />
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Bloques confirmados */}
        {gradoData && paso > 1 && (
          <BloqueConfirmado label="Grado" valor={gradoData.num} emoji="🎓" onClick={() => volver(1)} />
        )}
        {area && paso > 2 && (
          <BloqueConfirmado label="Área" valor={area} emoji={areaConfig?.emoji} color={areaConfig?.color} onClick={() => volver(2)} />
        )}

        {/* Bloques confirmados — PDL */}
        {isPDL && bloque && paso > 3 && (
          <BloqueConfirmado label="Tipo de ficha" valor={bloque} emoji="📚" onClick={() => volver(3)} />
        )}
        {isPDL && pdlTipoTexto && paso > 4 && (
          <BloqueConfirmado
            label={bloque === "Ortografía" ? "Regla ortográfica" : "Tipo de texto"}
            valor={pdlTipoTexto}
            emoji="📄"
            onClick={() => volver(4)}
          />
        )}
        {isPDL && bloque === "Lectura de textos" && pdlPractica && paso > 4 && (
          <BloqueConfirmado label="Práctica lectora" valor={pdlPractica} emoji="🎯" onClick={volverPDLPractica} />
        )}

        {/* Bloques confirmados — No PDL */}
        {!isPDL && bloque && paso > 3 && (
          <BloqueConfirmado label="Bloque" valor={bloque} emoji="📦" onClick={() => volver(3)} />
        )}
        {!isPDL && registro && paso > 4 && (
          <BloqueConfirmado label="Contenido" valor={registro.item_original} emoji="🎯" onClick={() => volver(4)} />
        )}

        {paso > 1 && !generando && (
          <div style={{ height: 1, background: C.border, margin: "16px 0 28px" }} />
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: C.error, border: `1px solid #fca5a5`,
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: C.errorTexto, animation: "fadeUp 0.3s both"
          }}>
            {error}
          </div>
        )}

        {/* Paso 1: Grado */}
        {paso === 1 && (
          <PasoActivo pregunta="¿Con qué grado estás trabajando hoy?">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {GRADOS.map((g, i) => (
                <GradoBtn key={g.num} g={g} i={i} onClick={() => elegir(setGradoData, g, 2)} />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 2: Área */}
        {paso === 2 && (
          <PasoActivo pregunta={`Perfecto. ¿Qué área trabajamos en ${gradoData?.num}?`}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {areasDisponibles.map((a, i) => (
                <AreaBtn
                  key={a.nombre}
                  a={a}
                  i={i}
                  onClick={() => {
                    setArea(a.nombre);
                    setAreaConfig(a);
                    setIsPDL(a.nombre === "Prácticas del Lenguaje");
                    setTimeout(() => setPaso(3), 160);
                  }}
                />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 3: Bloque (no PDL) */}
        {paso === 3 && !isPDL && (
          <PasoActivo pregunta={`¿Qué bloque de ${area}?`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bloquesDisponibles.map((b, i) => (
                <OpcionBtn key={b} label={b} i={i} onClick={() => elegir(setBloque, b, 4)} />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 3: Tipo de ficha (PDL) */}
        {paso === 3 && isPDL && (
          <PasoActivo pregunta="¿Qué tipo de ficha necesitás?">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PDL_TIPOS_FICHA.map((t, i) => (
                <OpcionBtn
                  key={t.nombre}
                  label={`${t.emoji}  ${t.nombre} — ${t.desc}`}
                  i={i}
                  onClick={() => elegir(setBloque, t.nombre, 4)}
                />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 4: Contenido (no PDL) */}
        {paso === 4 && !isPDL && (
          <PasoActivo pregunta="¿Cuál es el contenido?" sub={`Del Diseño Curricular oficial · ${gradoData?.num} · ${area}`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {contenidosDisponibles.map((r, i) => (
                <OpcionBtn key={r.id} label={r.item_original} i={i} onClick={() => elegir(setRegistro, r, 5)} suave />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 4: Tipo de texto / Regla (PDL) */}
        {paso === 4 && isPDL && bloque === "Lectura de textos" && (
          <PasoActivo
            pregunta={!pdlTipoTexto ? "¿Qué tipo de texto?" : "¿Cuál es la práctica lectora?"}
            sub={!pdlTipoTexto ? `Textos disponibles para ${gradoData?.num} grado` : pdlTipoTexto}
          >
            {!pdlTipoTexto ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(PDL_TIPOS_TEXTO_LECTURA[gradoNum] || []).map((t, i) => (
                  <OpcionBtn key={t} label={t} i={i} onClick={() => setPdlTipoTexto(t)} suave />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {getPracticasPDL(pdlTipoTexto, gradoNum).map((p, i) => (
                  <OpcionBtn key={p} label={p} i={i} onClick={() => elegir(setPdlPractica, p, 5)} suave />
                ))}
              </div>
            )}
          </PasoActivo>
        )}

        {paso === 4 && isPDL && bloque === "Escritura de textos" && (
          <PasoActivo pregunta="¿Qué tipo de texto?" sub={`Tipos disponibles para ${gradoData?.num} grado`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(PDL_TIPOS_TEXTO_ESCRITURA[gradoNum] || []).map((t, i) => (
                <OpcionBtn key={t} label={t} i={i} onClick={() => elegir(setPdlTipoTexto, t, 5)} suave />
              ))}
            </div>
          </PasoActivo>
        )}

        {paso === 4 && isPDL && bloque === "Ortografía" && (
          <PasoActivo pregunta="¿Cuál es la regla ortográfica?" sub={`Reglas para ${gradoData?.num} grado`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(PDL_REGLAS_ORTOGRAFIA[gradoNum] || []).map((r, i) => (
                <OpcionBtn key={r} label={r} i={i} onClick={() => elegir(setPdlTipoTexto, r, 5)} suave />
              ))}
            </div>
          </PasoActivo>
        )}

        {/* Paso 5: Confirmar y generar (no PDL) */}
        {paso === 5 && !generando && !isPDL && (
          <PasoActivo pregunta="Todo listo. ¿Generamos la ficha?" sub="Revisá arriba lo que elegiste. Tocá cualquier bloque para cambiarlo.">
            {registro && (
              <div style={{
                background: C.white, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "14px 16px", marginBottom: 24
              }}>
                <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Objetivo de aprendizaje</p>
                <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.6, margin: 0 }}>{registro.objetivo}</p>
              </div>
            )}
            {/* Checkboxes opcionales */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                Opciones adicionales
              </p>
              {[
                {
                  id: "explicacion",
                  label: "Incluir explicación del tema",
                  checked: incluirExplicacion,
                  disabled: false,
                  onChange: (v) => { setIncluirExplicacion(v); if (!v) setIncluirEjemplo(false); },
                },
                {
                  id: "ejemplo",
                  label: "Incluir ejemplo concreto",
                  checked: incluirEjemplo,
                  disabled: !incluirExplicacion,
                  onChange: setIncluirEjemplo,
                },
              ].map(({ id, label, checked, disabled, onChange }) => (
                <div
                  key={id}
                  onClick={() => !disabled && onChange(!checked)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px",
                    background: C.white,
                    border: `1px solid ${checked ? C.acento : C.border}`,
                    borderRadius: 10,
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.4 : 1,
                    transition: "all 0.15s",
                    marginBottom: 8,
                    userSelect: "none",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    border: `1.5px solid ${checked ? C.acento : C.border}`,
                    background: checked ? C.acento : C.white,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {checked && (
                      <svg viewBox="0 0 12 10" fill="none" width="10" height="10">
                        <polyline points="1,5 4,8 11,1" stroke={C.btn} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 14, color: C.texto, fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={generar}
              style={{
                width: "100%", padding: "18px",
                background: C.btn, color: C.btnText,
                fontSize: 17, fontWeight: 700, border: "none",
                borderRadius: 12, cursor: "pointer", transition: "all 0.18s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.acento; e.currentTarget.style.color = C.btn; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.btn; e.currentTarget.style.color = C.btnText; }}
            >
              Generar ficha ✦
            </button>
            <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 10 }}>
              Tarda unos segundos · Alineada al Diseño Curricular
            </p>
          </PasoActivo>
        )}

        {/* Paso 5: Confirmar y generar (PDL) */}
        {paso === 5 && !generando && isPDL && (
          <PasoActivo pregunta="Todo listo. ¿Generamos la ficha?" sub="Revisá arriba lo que elegiste. Tocá cualquier bloque para cambiarlo.">
            <button
              onClick={generar}
              style={{
                width: "100%", padding: "18px",
                background: C.btn, color: C.btnText,
                fontSize: 17, fontWeight: 700, border: "none",
                borderRadius: 12, cursor: "pointer", transition: "all 0.18s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.acento; e.currentTarget.style.color = C.btn; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.btn; e.currentTarget.style.color = C.btnText; }}
            >
              Generar ficha ✦
            </button>
            <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 10 }}>
              Tarda unos segundos · Alineada al Diseño Curricular
            </p>
          </PasoActivo>
        )}

        {/* Loading */}
        {generando && (
          <div style={{ padding: "48px 0", animation: "fadeUp 0.4s both" }}>
            <div style={{
              background: C.suave,
              borderRadius: 16,
              padding: "36px 32px",
              textAlign: "center",
              maxWidth: 400,
              margin: "0 auto",
            }}>

              {/* Spinner */}
              <div style={{
                width: 48, height: 48,
                border: "3px solid rgba(0,196,140,0.2)",
                borderTopColor: C.acento,
                borderRadius: "50%",
                animation: "spin 0.9s linear infinite",
                margin: "0 auto 24px",
              }} />

              {/* Mensaje */}
              <p style={{
                fontFamily: "Georgia, serif",
                fontSize: 20, fontWeight: 400,
                color: C.texto, marginBottom: 24,
                letterSpacing: "-0.01em",
                minHeight: 30,
              }}>
                {["Generando ficha…", "Validando contenido…", "¡Lista!"][mensajeLoading]}
              </p>

              {/* Barra de progreso */}
              <div style={{
                height: 4, background: "rgba(0,196,140,0.2)",
                borderRadius: 999, overflow: "hidden", marginBottom: 20,
              }}>
                <div style={{
                  height: "100%", background: C.acento, borderRadius: 999,
                  width: mensajeLoading === 0 ? "30%" : mensajeLoading === 1 ? "75%" : "100%",
                  transition: "width 0.8s cubic-bezier(.22,1,.36,1)",
                }} />
              </div>

              {/* Steps */}
              <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
                {["Generando", "Validando", "Lista"].map((label, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: i <= mensajeLoading ? C.acento : "rgba(0,196,140,0.25)",
                      transition: "background 0.4s",
                    }} />
                    <span style={{
                      fontSize: 10, fontWeight: 500,
                      color: i <= mensajeLoading ? C.muted : "rgba(74,107,96,0.4)",
                      transition: "color 0.4s", letterSpacing: "0.03em",
                    }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
