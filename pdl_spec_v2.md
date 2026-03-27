# FichaIA — Especificación pedagógica PDL
**Verificado contra Diseño Curricular PBA 2018**
**Versión 2 · Marzo 2026**

---

## 0. Correcciones generales en otras áreas

### 0.1 Matemática — Bloque Espacio (1° y 2°)
El DC dice textualmente "Orientación en el micro y **meso**espacio". El macroespacio recién aparece en 4°.

- ❌ Orientación en el micro y macroespacio
- ✅ Ubicar objetos y personas en el espacio

Aplicar a: `grado: 1`, `grado: 2`, `area: Matemática`, `bloque: Espacio`

### 0.2 Matemática — Bloque Geometría (6°)
En 6° el DC fusiona Geometría y Espacio en un único bloque.

- ❌ Geometría · Espacio (dos bloques separados)
- ✅ Geometría y espacio (un solo bloque)

Aplicar a: `grado: 6`, `area: Matemática`

---

## 1. Prácticas del Lenguaje — estructura general

### Flujo de selección en cascada

```
Área
  └── Prácticas del Lenguaje
        └── Grado (1° al 6°)
              └── Tipo de ficha
                    ├── Lectura de textos
                    │     ├── Tipo de texto (lista según grado)
                    │     └── Práctica lectora (lista según tipo de texto y ciclo)
                    ├── Escritura de textos
                    │     └── Tipo de texto (lista según grado)
                    └── Ortografía
                          └── Regla ortográfica (lista según grado)
```

### Qué genera la IA según el tipo de ficha

| Tipo de ficha | La IA genera |
|---|---|
| Lectura de textos | Texto breve del tipo elegido + preguntas de comprensión |
| Escritura de textos | Consigna de escritura + orientaciones + renglones |
| Ortografía | Explicación de la regla + ejemplo + 4-6 ejercicios variados |

---

## 2. Lectura de textos

### 2.1 Tipos de texto por grado

Lista plana, sin categorías. Respetar este orden en la interfaz.

**1°**
Cuento · Fábula · Poesía · Trabalenguas y adivinanzas · Historieta · Libro álbum · Obra de teatro · Noticia · Afiche y folleto · Reglamento

**2°**
Cuento · Fábula · Poesía · Trabalenguas y adivinanzas · Historieta · Libro álbum · Obra de teatro · Noticia · Afiche y folleto · Reglamento

**3°**
Cuento · Fábula · Leyenda · Poesía · Obra de teatro · Novela · Historieta · Haiku · Noticia · Enciclopedia y manual · Carta · Afiche y folleto

**4°**
Cuento · Fábula · Leyenda · Poesía · Obra de teatro · Novela · Historieta · Haiku · Noticia · Artículo de enciclopedia · Manual · Carta formal · Afiche y folleto

**5°**
Cuento · Poesía · Obra de teatro · Novela · Historieta · Noticia · Artículo de divulgación · Enciclopedia · Manual · Carta de lector · Afiche

**6°**
Cuento · Poesía · Obra de teatro · Novela · Historieta · Noticia · Nota de opinión · Artículo de enciclopedia · Manual · Reglamento y normas

---

### 2.2 Prácticas lectoras por tipo de texto y ciclo

---

#### TEXTOS NARRATIVOS
*(Cuento · Fábula · Leyenda · Novela)*

**1° y 2° — Comprensión literal**
- Reconocer los personajes principales
- Identificar qué pasó al principio, en el medio y al final
- Describir cómo es el personaje principal
- Decir qué problema tuvo el personaje y cómo lo resolvió

**3° — Comprensión + primera interpretación**
- Reconocer personajes principales y secundarios
- Ordenar los hechos del texto
- Describir el lugar y el tiempo donde ocurre la historia
- Identificar la moraleja *(solo fábula)*
- Explicar por qué actuó así el personaje

**4° y 5° — Inferencia y opinión**
- Inferir los sentimientos o motivaciones de los personajes
- Identificar el conflicto central y cómo se resuelve
- Reconocer el narrador y su punto de vista
- Comparar dos versiones de un mismo texto *(leyenda / cuento)*
- Dar opinión sobre lo leído y justificarla

**6° — Análisis del lenguaje**
- Identificar recursos literarios: comparaciones, repeticiones
- Analizar cómo el autor construye el suspenso o la emoción
- Relacionar el texto con situaciones de la vida real
- Reconocer el género y sus características

---

#### POESÍA
*(Poesía · Haiku · Trabalenguas y adivinanzas)*

**1°**
- Identificar palabras que riman

**2°**
- Identificar palabras que riman
- Reconocer de qué habla el poema
- Expresar qué sentimiento te produce escucharlo

**3°**
- Identificar las palabras que riman y el efecto que producen
- Reconocer una comparación o imagen dentro del poema
- Explicar con tus palabras de qué trata el poema
- Expresar qué te gustó o no te gustó y por qué

**4° y 5°**
- Reconocer recursos: comparaciones, repeticiones, personificaciones
- Interpretar el significado de una imagen poética
- Identificar el tema del poema y cómo lo desarrolla el autor
- Dar opinión sobre el poema y justificarla

**6°**
- Analizar la estructura del poema: estrofas, versos, rima
- Reconocer el tono del poema y cómo lo construye el autor
- Comparar dos poemas sobre el mismo tema
- Identificar el tipo de poema y sus características

---

#### OBRA DE TEATRO

**1° y 2°**
- Reconocer los personajes de la obra
- Identificar qué problema tienen los personajes
- Decir cómo termina la historia

**3°**
- Reconocer personajes principales y secundarios
- Identificar qué dice cada personaje y cómo lo dice
- Distinguir el diálogo de las acotaciones
- Explicar cómo se resuelve el conflicto

**4° y 5°**
- Reconocer las partes de la obra: escenas y actos
- Inferir los sentimientos de los personajes a partir de sus diálogos
- Identificar el conflicto central y cómo evoluciona
- Dar opinión sobre las decisiones de los personajes

**6°**
- Analizar cómo el autor construye los personajes a través del diálogo
- Reconocer el tono de la obra: dramático, humorístico, etc.
- Identificar las acotaciones y su función dentro del texto
- Relacionar la obra con su contexto o con otras obras leídas

---

#### HISTORIETA

**1° y 2°**
- Reconocer los personajes de la historieta
- Identificar qué pasa en cada viñeta
- Contar con tus palabras de qué trata la historia

**3°**
- Reconocer personajes principales y secundarios
- Identificar el problema y cómo se resuelve
- Distinguir lo que dicen los personajes de lo que hace el narrador
- Reconocer la secuencia de viñetas y su orden

**4° y 5°**
- Interpretar el significado de una imagen sin texto
- Identificar el humor o el recurso cómico que usa el autor
- Reconocer cómo se complementan imagen y texto
- Dar opinión sobre los personajes o la situación

**6°**
- Analizar cómo el dibujante usa el espacio de la viñeta para contar
- Reconocer recursos gráficos: globos, onomatopeyas, líneas de movimiento
- Comparar la historieta con otro texto narrativo sobre el mismo tema
- Identificar el género de la historieta y sus características

---

#### TEXTOS INFORMATIVOS
*(Enciclopedia · Manual · Artículo de enciclopedia · Artículo de divulgación)*

**1° y 2°**
- Decir de qué tema trata el texto
- Identificar una información nueva que aprendiste
- Reconocer para qué sirve el título

**3°**
- Identificar el tema principal del texto
- Reconocer la información más importante
- Distinguir el título, los subtítulos y para qué sirven
- Formular una pregunta sobre el tema después de leer

**4° y 5°**
- Identificar la idea principal de cada párrafo
- Reconocer cómo está organizada la información
- Distinguir definiciones, ejemplos y explicaciones dentro del texto
- Relacionar la información del texto con lo que ya sabías del tema

**6°**
- Analizar cómo el autor organiza y jerarquiza la información
- Reconocer el propósito del texto: informar, explicar, convencer
- Comparar información sobre el mismo tema en dos fuentes distintas
- Evaluar si la información del texto es suficiente para entender el tema

---

#### TEXTOS DE USO SOCIAL
*(Carta · Carta de lector · Afiche y folleto · Reglamento · Nota de opinión)*

> Nota pedagógica: estos textos se trabajan poco en lectura en el aula. Se incluyen en la lista porque el DC los menciona, pero su mayor uso real es en escritura.

**1° y 2°**
- Decir para qué sirve el texto
- Identificar a quién está dirigido

**3°**
- Identificar para qué sirve el texto y a quién está dirigido
- Reconocer las partes del texto: saludo, cuerpo, cierre *(carta)* o título, reglas *(reglamento)*
- Decir si el texto cumple su propósito

**4° y 5°**
- Reconocer el propósito del texto y si lo logra
- Identificar el tono: formal o informal
- Distinguir la solicitud, la opinión o la norma según el tipo de texto

**6°**
- Analizar si el texto es adecuado para su destinatario y propósito
- Reconocer los recursos que usa el autor para persuadir o convencer
- Dar opinión fundamentada sobre el contenido del texto

---

#### NOTICIA

**1° y 2°**
- Decir de qué trata la noticia
- Identificar a quién le pasó y dónde

**3°**
- Identificar qué pasó, quién, dónde y cuándo
- Reconocer el título y explicar para qué sirve
- Distinguir la información más importante de los detalles

**4° y 5°**
- Identificar qué pasó, quién, dónde, cuándo y por qué
- Reconocer el punto de vista del autor de la noticia
- Distinguir hechos de opiniones dentro del texto
- Comparar cómo dos medios cuentan la misma noticia

**6°**
- Analizar los recursos que usa el medio para presentar la noticia
- Reconocer si el texto es objetivo o tiene intención persuasiva
- Relacionar la noticia con el contexto social o histórico
- Dar opinión fundamentada sobre el tema de la noticia

---

## 3. Escritura de textos

### 3.1 Estructura de la ficha

1. **Consigna** — situación motivadora + instrucción de escritura, adaptada al grado y tipo de texto
2. **Orientaciones** — 2 o 3 preguntas o ayudas para guiar al alumno antes de escribir
3. **Renglones** — espacio físico para escribir

### 3.2 Tipo de renglones según grado

| Grado | Tipo de renglón |
|---|---|
| 1° | Renglones con punteado doble (guía de altura de letra) |
| 2° a 6° | Renglones simples |

### 3.3 Tipos de texto para escritura por grado

**1° y 2°**
- Textos breves en contexto: listas, títulos, etiquetas, epígrafes
- Nueva versión de un cuento conocido (con ayuda del docente)
- Recomendación de un libro

**3°**
- Nueva versión de un cuento tradicional
- Reescritura de un cuento en versión dramática
- Afiche o invitación
- Texto de estudio (para comunicar lo aprendido)

**4°**
- Narración: fábula · leyenda · cuento
- Carta formal
- Artículo de enciclopedia
- Historieta o haiku
- Transformación de texto: narrativo → dramático

**5°**
- Texto literario: cuento · poema visual
- Carta de lector
- Artículo de divulgación científica
- Noticia
- Transformación de texto: narración → obra de teatro

**6°**
- Texto literario: cuento · capítulo de novela
- Nota de opinión
- Reseña
- Texto institucional: reglamento · normas
- Texto de estudio

---

## 4. Ortografía

### 4.1 Reglas por grado

**1° — Sistema de escritura inicial**
- Las letras y sus sonidos
- Mayúsculas al inicio de oración y en nombres propios
- Separación de palabras
- Punto al final de la oración

**2° — Consolidación y nuevos signos**
- Repaso y consolidación de mayúsculas y punto
- Coma en enumeraciones
- Signos de interrogación y exclamación

**3° — Primeras convenciones ortográficas**
- mb · nv · nr
- Plurales: z → ces
- Terminación -aba del pretérito imperfecto
- Mayúsculas (consolidación)
- Sílaba tónica (preparación para la tilde en 4°)

**4° — Tilde y familias de palabras**
- Familias de palabras para resolver dudas ortográficas
- Terminaciones: -aje · -ducir · -bundo/a
- Tilde (sistematización)
- Raya de diálogo

**5° — Homófonos y tilde avanzada**
- Homófonos: haber/a ver · hay/ay · hacer/a ser
- Tilde en hiato
- Tilde en pronombres interrogativos
- Signos de puntuación (uso pertinente)

**6° — Tilde diacrítica y signos avanzados**
- Tilde diacrítica
- Tilde en adverbios terminados en -mente
- Homófonos: hecho/echo · valla/vaya · halla/haya
- Signos de puntuación avanzados: paréntesis · puntos suspensivos · dos puntos

---

## 5. Prompts base para la IA

### 5.1 Lectura de textos

```
Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de lectura para [GRADO] grado de Prácticas del Lenguaje.

Tipo de texto: [TIPO_TEXTO]
Práctica lectora: [PRACTICA]

La ficha debe tener:
1. Un texto breve del tipo indicado, adecuado al grado, con vocabulario claro.
2. 2 o 3 preguntas de comprensión enfocadas en la práctica elegida.

Criterios:
- El texto no debe superar: 150 palabras (1°-2°) / 200 palabras (3°) / 250 palabras (4°-6°)
- Las preguntas deben estar formuladas en lenguaje de alumno, no de docente
- No usar terminología técnica en las consignas
- Si el tipo de texto es fábula: incluir moraleja explícita
- Si el tipo de texto es poesía: incluir al menos una rima o recurso sonoro
- Si el tipo de texto es noticia: respetar estructura periodística (título, copete, cuerpo)
- Si el tipo de texto es obra de teatro: incluir al menos dos personajes y acotaciones
- Si el tipo de texto es historieta: describir las viñetas con texto ya que no hay imágenes
```

### 5.2 Escritura de textos

```
Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de escritura para [GRADO] grado de Prácticas del Lenguaje.

Tipo de texto a producir: [TIPO_TEXTO]

La ficha debe tener:
1. Una consigna motivadora que invite al alumno a escribir (máximo 3 oraciones)
2. Dos o tres orientaciones breves en forma de pregunta para guiar la escritura
3. NO escribir el texto — ese espacio lo completa el alumno

Criterios:
- La consigna debe ser concreta y alcanzable para el grado
- Las orientaciones deben ser preguntas simples, no instrucciones complejas
- El lenguaje debe ser cercano y motivador para un niño
```

### 5.3 Ortografía

```
Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de ortografía para [GRADO] grado.

Regla ortográfica: [REGLA]

La ficha debe tener:
- Título con la regla
- Explicación breve y clara (máximo 2 oraciones)
- Un ejemplo concreto
- Entre 4 y 6 ejercicios variados

Criterios:
- Los ejercicios deben ser variados: completar, corregir, clasificar, inventar
- El vocabulario debe ser conocido para el grado
- Evitar ejercicios mecánicos sin sentido (ej. "escribí 10 palabras con mb")
- Priorizar ejercicios en contexto de oraciones o textos breves
```

---

## 6. Cambios aplicados en v1 (ya en el código)

- Correcciones Matemática: mesoespacio en 1° y 2°, Geometría y espacio en 6°
- Flujo en cascada PDL completo en Generador.jsx
- Datos por grado: PDL_TIPOS_TEXTO_LECTURA, PDL_PRACTICAS_LECTORAS, PDL_TIPOS_TEXTO_ESCRITURA, PDL_REGLAS_ORTOGRAFIA
- Prompts diferenciados en api/generate.js: buildPDLLecturaPrompt, buildPDLEscrituraPrompt, buildPDLOrtografiaPrompt, buildPDLValidatorPrompt
- Rendering condicional en FichaTrabajo.jsx para los tres tipos PDL

## 7. Cambios nuevos — aplicar en v2

- Agregar prácticas lectoras para todos los tipos de texto en PDL_PRACTICAS_LECTORAS:
  - Poesía (con progresión especial: 1° solo rima, 2° introducción, 3°+ en profundidad)
  - Obra de teatro
  - Historieta
  - Textos informativos (unifica: Enciclopedia · Manual · Artículo de enciclopedia · Artículo de divulgación)
  - Textos de uso social (unifica: Carta · Carta de lector · Afiche y folleto · Reglamento · Nota de opinión)
  - Noticia
- Actualizar buildPDLLecturaPrompt con criterios específicos por tipo de texto (sección 5.1)

---

*Documento verificado contra DC PBA 2018 · FichaIA · Uso interno*
