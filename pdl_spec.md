# FichaIA — Especificación pedagógica PDL
**Verificado contra Diseño Curricular PBA 2018**
**Versión Marzo 2026**

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

## 1. Prácticas del Lenguaje — nueva estructura

El DC organiza PDL por ámbitos (Literatura / Formación Ciudadana / Formación del Estudiante).
Para la app adoptamos organización por **tipo de ficha**, más cercana al lenguaje del docente.

### Flujo de selección en cascada

```
Área
  └── Prácticas del Lenguaje
        └── Grado (1° al 6°)
              └── Tipo de ficha
                    ├── Lectura de textos
                    │     ├── Tipo de texto (lista según grado)
                    │     └── Práctica lectora (lista según ciclo)
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
| Ortografía | Ejercicios sobre la regla elegida |

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

### 2.2 Prácticas lectoras por ciclo

Las prácticas siguen una progresión de dificultad. Se aplican principalmente a textos narrativos (Cuento · Fábula · Leyenda · Novela). Las prácticas para otros tipos de texto están pendientes.

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

## 3. Escritura de textos

### 3.1 Estructura de la ficha

Toda ficha de escritura tiene exactamente tres partes:

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

La IA genera ejercicios sobre la regla elegida. No hay texto narrativo, solo ejercitación ortográfica.

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

## 5. Prompt base para la IA — Lectura de textos

Cuando el usuario completa la selección en cascada, el sistema debe armar un prompt así:

```
Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de lectura para [GRADO] grado de Prácticas del Lenguaje.

Tipo de texto: [TIPO_TEXTO]
Práctica lectora: [PRACTICA]

La ficha debe tener:
1. Un texto breve del tipo indicado, adecuado al grado, con vocabulario claro.
2. [2 o 3] preguntas de comprensión enfocadas en la práctica elegida.

Criterios:
- El texto no debe superar [150 palabras para 1°-2° / 200 palabras para 3° / 250 palabras para 4°-6°]
- Las preguntas deben estar formuladas en lenguaje de alumno, no de docente
- No usar terminología técnica en las consignas
- Si el tipo de texto es fábula, incluir moraleja explícita
- Si el tipo de texto es poesía, respetar al menos una rima o recurso sonoro
```

---

## 6. Prompt base para la IA — Escritura de textos

```
Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de escritura para [GRADO] grado de Prácticas del Lenguaje.

Tipo de texto a producir: [TIPO_TEXTO]

La ficha debe tener:
1. Una consigna motivadora que invite al alumno a escribir (máximo 3 oraciones)
2. Dos o tres orientaciones breves para guiar la escritura (ej. ¿Quiénes son los personajes?)
3. NO escribir el texto — ese espacio lo completa el alumno

Criterios:
- La consigna debe ser concreta y alcanzable para el grado
- Las orientaciones deben ser preguntas simples, no instrucciones complejas
- El lenguaje debe ser cercano y motivador para un niño
```

---

## 7. Prompt base para la IA — Ortografía

```
Sos un docente experto en nivel primario de la Provincia de Buenos Aires.
Generá una ficha de ortografía para [GRADO] grado.

Regla ortográfica: [REGLA]

La ficha debe tener:
- Título con la regla
- Explicación breve y clara de la regla (máximo 2 oraciones)
- Un ejemplo concreto
- Entre 4 y 6 ejercicios variados sobre esa regla

Criterios:
- Los ejercicios deben ser variados: completar, corregir, clasificar, inventar
- El vocabulario de los ejercicios debe ser conocido para el grado
- Evitar ejercicios mecánicos sin sentido (ej. "escribí 10 palabras con mb")
- Priorizar ejercicios en contexto de oraciones o textos breves
```

---

## 8. Pendientes para próxima sesión

- [ ] Prácticas lectoras para textos no narrativos: Poesía · Haiku · Obra de teatro · Historieta · Noticia · Textos informativos · Textos de uso social
- [ ] Revisar contenidos de Ciencias Naturales y Ciencias Sociales por grado
- [ ] Definir cuántos renglones incluye cada ficha según el grado
- [ ] Validar implementación del flujo en cascada en el código existente

---

*Documento verificado contra DC PBA 2018 · FichaIA · Uso interno*
