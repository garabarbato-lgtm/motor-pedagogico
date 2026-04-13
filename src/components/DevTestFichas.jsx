import FichaPresenta from "./FichaPresenta.jsx";
import FichaPractica from "./FichaPractica.jsx";
import FichaCierre from "./FichaCierre.jsx";

const REGISTRO = {
  grado: "4",
  area: "Matemática",
  bloque: "Números Racionales",
};

const FICHA_PRESENTA = {
  tipo_ficha: "presentacion",
  emojis: ["🍕", "🎂"],
  titulo: "Fracciones: comparar y ordenar",
  explicacion: {
    parrafos: [
      "Una **fracción** es una parte de un entero. Cuando dividimos algo en partes iguales y tomamos algunas de esas partes, estamos usando fracciones. Por ejemplo, si cortamos una pizza en 8 porciones iguales y comemos 3, decimos que comimos **3/8** de la pizza.",
      "Cuando queremos saber cuál fracción es más grande o más pequeña, estamos **comparando fracciones**. A veces dos fracciones diferentes representan la misma cantidad: eso se llama **fracciones equivalentes**. Por ejemplo, 1/2 es igual a 2/4 porque ambas representan la mitad de algo.",
      "Para comparar fracciones, podemos usar diferentes estrategias: mirar el tamaño de las partes, usar una fracción de referencia como 1/2, dibujar o contar. Si dos fracciones tienen el mismo denominador, la que tenga el numerador más grande será la mayor.",
    ],
    pill: {
      tipo: "dato_curioso",
      contenido: "¿Sabías que cuando compartís un chocolate con un amigo y lo dividen en 2 partes iguales, cada uno recibe 1/2? Pero si lo compartís con 3 amigos más y lo dividen en 4 partes, recibís 1/4, que es menos. Las fracciones nos ayudan a repartir justamente.",
    },
  },
  ejercicios: [
    {
      tipo: "situacion_problematica",
      enunciado: "Marta y Juan compraron dos tortas iguales. Marta comió 2/8 de su torta y Juan comió 3/8 de la suya. ¿Quién comió más torta? Marcá las porciones que comió cada uno y compará.",
      andamiaje: null,
    },
    {
      tipo: "situacion_problematica",
      enunciado: "Aquí hay tres fracciones: 1/2, 2/4 y 3/6. Dibujá en tres rectángulos iguales estas fracciones. ¿Qué observás? ¿Representan la misma cantidad o cantidades diferentes?",
      andamiaje: null,
    },
  ],
};

const FICHA_PRACTICA = {
  tipo_ficha: "practica",
  emojis: ["🍕", "🎂"],
  titulo: "fracciones: comparando y ordenando",
  concepto_clave: "Dos fracciones son **equivalentes** cuando representan la misma cantidad, aunque se escriban diferente. Para **comparar** fracciones, podés usar <frac>1/2</frac> como referencia para saber si una fracción es mayor o menor.",
  ejercicios: [
    {
      tipo: "situacion_problematica",
      enunciado: "Martina comió <frac>3/4</frac> de una pizza y su hermano comió <frac>2/4</frac> de otra pizza igual. ¿Quién comió más pizza? Ahora compará esas fracciones con <frac>1/2</frac>: ¿cada una es más o menos que la mitad?",
      andamiaje: "Primero, dibujá dos pizzas divididas en 4 partes cada una. Pintá las partes que comió cada uno. Luego pensá: si dividís cada pizza por la mitad, ¿cuántas partes serían?",
    },
    {
      tipo: "completar_oraciones",
      enunciado: "Completá las siguientes frases usando >, <, o = según corresponda.",
      oraciones: [
        "<frac>2/8</frac> es _______ que <frac>1/2</frac>",
        "<frac>4/6</frac> es _______ que <frac>1/2</frac>",
        "<frac>2/5</frac> es _______ que <frac>2/3</frac>",
        "<frac>3/6</frac> es _______ que <frac>1/2</frac>",
      ],
      andamiaje: null,
    },
    {
      tipo: "verdadero_falso",
      enunciado: "Marcá V o F según corresponda:",
      afirmaciones: [
        "3/4 es mayor que 1/2 porque 3/4 tiene más partes que 1/2",
        "2/4 y 1/2 son fracciones equivalentes",
        "1/3 es mayor que 1/2",
        "5/6 está más cerca de 1 que de 0",
      ],
      andamiaje: null,
    },
    null,
  ],
};

const FICHA_CIERRE = {
  tipo_ficha: "cierre",
  emojis: ["🍰", "🎂"],
  titulo: "fracciones en acción: comparación y equivalencia",
  escalera: [
    {
      rotulo: "Nivel 1",
      nombre: "las fracciones en el pastel",
      ejercicio: {
        tipo: "situacion_problematica",
        enunciado: "Martina y su hermano recibieron una torta de cumpleaños. Martina comió 2/4 de la torta y su hermano comió 1/2. Dibujá cómo se vería cada porción en un rectángulo y explicá: ¿quién comió más torta o comieron lo mismo? ¿Por qué?",
      },
      andamiaje: null,
    },
    {
      rotulo: "Nivel 2",
      nombre: "encontrando parejas equivalentes",
      ejercicio: {
        tipo: "tabla",
        enunciado: "Completá la tabla encontrando fracciones equivalentes.",
        columnas: ["Fracción original", "Fracción equivalente", "¿Representan lo mismo?"],
        filas: [
          ["1/2", "__/4", ""],
          ["2/4", "__/2", ""],
          ["3/6", "__/2", ""],
          ["2/8", "__/4", ""],
        ],
      },
      andamiaje: null,
    },
    {
      rotulo: "Nivel 3",
      nombre: "los comparadores expertos",
      ejercicio: {
        tipo: "verdadero_falso",
        enunciado: "Decidí si es verdadero o falso. Justificá tu respuesta comparando con fracciones de referencia (0, 1/2 o 1).",
        afirmaciones: [
          "3/8 es menor que 1/2 porque 3/8 está más cerca del 0.",
          "5/6 es mayor que 1/2 porque 5/6 está muy cerca del 1 entero.",
          "2/6 y 2/3 son equivalentes porque tienen el mismo numerador.",
          "1/4 es mayor que 1/3 porque 4 es mayor que 3.",
        ],
      },
      andamiaje: null,
    },
    {
      rotulo: "Punto de descanso",
      nombre: "reflexionamos juntos",
      ejercicio: {
        tipo: "preguntas_comprension",
        enunciado: "Respondé:",
        preguntas: [
          "¿Cuál fue la estrategia que más te ayudó para comparar fracciones: dibujarlas, usar una fracción de referencia como 1/2, o comparar los números? ¿Por qué?",
        ],
      },
      andamiaje: null,
    },
  ],
};

export default function DevTestFichas() {
  return (
    <div style={{ background: "#f8f8f4", minHeight: "100vh", padding: 40, display: "flex", flexDirection: "column", gap: 60, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "#0d1f1a", color: "#00c48c", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, width: "fit-content" }}>
        DEV — prueba visual de fichas v2
      </div>

      <section>
        <h2 style={{ color: "#555", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Presentación</h2>
        <FichaPresenta ficha={FICHA_PRESENTA} registro={REGISTRO} />
      </section>

      <section>
        <h2 style={{ color: "#555", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Práctica — Nivel: Necesita más apoyo (con andamiaje)</h2>
        <FichaPractica ficha={FICHA_PRACTICA} registro={REGISTRO} />
      </section>

      <section>
        <h2 style={{ color: "#555", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Cierre</h2>
        <FichaCierre ficha={FICHA_CIERRE} registro={REGISTRO} />
      </section>
    </div>
  );
}
