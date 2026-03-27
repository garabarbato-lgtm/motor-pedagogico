# Criterios de generación de fichas — Motor Pedagógico PBA

Este documento define las reglas que la IA debe seguir para generar fichas educativas.
Debe integrarse al sistema de generación como contexto fijo en todos los prompts.

---

## CRITERIOS GENERALES — aplican a todas las fichas

### Criterio 1 — Lenguaje por secciones
Cada sección arranca con una pregunta, no con una etiqueta genérica.

| Sección | En lugar de | Usar |
|---------|------------|------|
| Explicación | "Explicación:" | "¿Qué es...?" / "¿Para qué sirve...?" / "¿Cómo funciona...?" |
| Ejemplo | "Ejemplo:" | "¿Cómo se ve en la vida real?" |
| Actividad | "Actividad:" | "Tu turno" / "Ahora vos" |

### Criterio 2 — El ejemplo siempre es cercano al chico
El ejemplo debe venir del mundo cotidiano del alumno de ese grado.
Nunca usar el mismo contexto dos veces seguidas para el mismo área y grado.

- Si el contenido es de Ciencias Naturales → ejemplos de la naturaleza o el cuerpo
- Si es de Ciencias Sociales → situaciones de la comunidad o la historia
- Si es de Matemática → situaciones con cantidades reales de la vida cotidiana
- Si es de PDL → textos que el chico conoce: canciones, cuentos, carteles

Contextos válidos por grado:
- 1° y 2°: juguetes, animales, comida, familia, el aula
- 3° y 4°: recreo, kiosco, cancha, viaje, supermercado
- 5° y 6°: deportes, cocina, viajes, noticias, redes sociales

### Criterio 3 — El tipo de actividad lo elige el docente
La IA genera según la opción seleccionada. Ver opciones por área más abajo.

### Criterio 4 — Dificultad apropiada al grado
El lenguaje y la complejidad deben ser apropiados para el grado.
Sin tecnicismos, sin preguntas que requieran conocimiento fuera del DC de ese año.
La primera pregunta o ejercicio es el más accesible. El último es el más desafiante.

### Criterio 5 — Emoji por tema
Cada ficha incluye un emoji relacionado al contenido específico junto al título.
No usar siempre el mismo emoji para el área — variar según el tema concreto.

Ejemplos orientativos:
- Matemática — multiplicación: ✖️ / fracciones: 🍕 / geometría: 📐 / medidas: 📏
- Ciencias Naturales — seres vivos: 🌿 / cuerpo humano: 🫀 / sistema solar: 🪐 / agua: 💧
- Ciencias Sociales — historia: 📜 / geografía: 🗺️ / pueblos originarios: 🏹
- PDL — lectura: 📖 / escritura: ✏️ / ortografía: 🔤

### Criterio 6 — Dato curioso (opcional)
Si el contenido tiene un dato sorprendente o poco conocido, agregarlo al final.
Si no hay uno genuinamente interesante, no forzarlo.

### Criterio 7 — Espacio reservado para imagen
Las fichas de Ciencias Naturales y Geografía incluyen un recuadro reservado para imagen con el texto "Imagen del tema". Cuando el banco de íconos SVG esté disponible, ese espacio se reemplaza automáticamente.

---

## MATEMÁTICA

### Opciones de actividad

**Ejercitación**
4 a 6 ejercicios graduados del más simple al más complejo.
Sin contexto, directo al cálculo o procedimiento.
El primer ejercicio es el más simple posible. El último es el más desafiante del mismo tema.

**Situación problemática**
2 situaciones distintas con contexto real.
Si el contenido no da para dos situaciones realmente distintas, generar una situación con parte a) y b) de distinta dificultad.

**Mixta**
Situación problemática primero (2 situaciones o 1 con parte a y b) + 3 ejercicios graduados después.

---

## CIENCIAS NATURALES

### Opciones de ficha

**Explicación (hasta 2 carillas)**
- Carilla 1: título + emoji + pregunta intro + explicación clara + espacio reservado para imagen
- Carilla 2: analogía con algo conocido por el chico + dato curioso si aplica + glosario de 3 a 4 términos clave si el vocabulario lo requiere

El glosario solo se incluye si el tema tiene términos específicos que el chico necesita conocer.
Si el vocabulario es cotidiano, omitirlo.

**Preguntas de comprensión**
3 a 4 preguntas graduadas que cubren el objetivo curricular completo, no solo lo explicado en la ficha.
La ficha es el punto de entrada, no el techo.
El lenguaje y la complejidad deben ser apropiados para el grado, sin tecnicismos.
La primera pregunta es la más accesible. La última requiere relacionar ideas o aplicar el concepto.

**Situación para analizar**
Se presenta un caso, dato o fenómeno real relacionado al tema.
El chico responde preguntas sobre ese caso.

**Mixta**
2 preguntas de comprensión + 1 situación para analizar.

---

## CIENCIAS SOCIALES — HISTORIA

### Opciones de ficha

**Explicación**
Título + emoji + pregunta intro + explicación narrativa.
Línea de tiempo solo si el contenido implica una secuencia de eventos relevante para la comprensión. Si el tema es un concepto o situación puntual sin progresión temporal, omitirla.
Personajes clave si aplica.

**Preguntas de comprensión**
3 a 4 preguntas graduadas de lo factual a lo causal.
Cubren el objetivo curricular completo, no solo la ficha.
La primera es factual (¿qué pasó?). La última pide relacionar causas y consecuencias o dar una opinión fundamentada.

**Mixta**
2 preguntas de comprensión + 1 pregunta causal o de opinión fundamentada.

**Nota:** La opción de fuente histórica está reservada para cuando el banco de fuentes verificadas esté disponible. No mostrar al docente hasta entonces.

---

## CIENCIAS SOCIALES — GEOGRAFÍA

### Opciones de ficha

**Explicación**
Título + emoji + pregunta intro + explicación + espacio reservado para mapa o imagen + dato relevante si aplica.

**Preguntas de comprensión**
3 a 4 preguntas graduadas sobre el objetivo curricular.
La primera es descriptiva. La última pide relacionar el ambiente con las actividades humanas.

**Situación para analizar**
Se presenta un problema real que afecta a personas o al ambiente.
El chico responde preguntas sobre causas, consecuencias y posibles soluciones.

**Mixta**
2 preguntas de comprensión + 1 situación para analizar.

---

## PRÁCTICAS DEL LENGUAJE

### Lectura literaria

**Comprensión lectora**
3 a 4 preguntas graduadas de lo literal a lo interpretativo.
La primera cualquier chico que leyó el texto puede responderla.
La última requiere opinar o relacionar con experiencia propia.
Las preguntas nunca tienen una sola respuesta correcta. Siempre hay lugar para la interpretación personal siempre que el chico la justifique con algo del texto.

**Fragmento + preguntas**
La IA genera un fragmento breve de 4 a 6 líneas + 3 preguntas sobre ese fragmento.

**Producción a partir de la lectura**
El chico escribe algo relacionado al texto: continuar la historia, cambiar el final, escribir desde otro personaje.

**Nota:** La opción de que el docente cargue el texto o PDF queda reservada como evolución futura.

---

### Lectura de textos informativos

**Comprensión de texto informativo**
La IA genera un texto informativo breve de 6 a 8 líneas sobre el tema + 3 a 4 preguntas de comprensión graduadas.

**Estrategias de lectura**
Texto breve con consignas que trabajan el paratexto (título, subtítulos, imágenes) antes de leer el cuerpo.

**Búsqueda de información**
Consignas guía para que el chico busque y organice información por su cuenta.

---

### Escritura creativa

**Consigna libre con disparador**
Un disparador concreto: situación, frase inicial o imagen descripta.
El chico escribe libremente a partir de ahí.

**Reescritura**
Transformar un texto conocido: cambiar el final, el narrador o un personaje.

**Consigna estructurada**
La consigna incluye: punto de partida concreto + extensión mínima + al menos un elemento narrativo específico.
Más andamiaje en grados bajos, más autonomía en grados altos.

Ejemplos por grado:
- 1° y 2°: "Dibujá y escribí: ¿qué pasaría si tu animal favorito pudiera hablar? Escribí al menos 3 oraciones."
- 3° y 4°: "Escribí un cuento que empiece con esta frase: 'Esa mañana, nadie esperaba lo que iba a pasar...'. Tu cuento tiene que tener un personaje, un problema y un final sorpresa."
- 5° y 6°: "Reescribí una escena de un cuento que hayas leído pero desde el punto de vista del personaje secundario."

---

### Escritura de textos informativos

El docente elige el género. La IA genera la consigna con la estructura correcta para ese género adaptada al grado.

La consigna siempre recuerda brevemente la estructura del género antes de pedirle al chico que escriba.

Géneros disponibles:
- Texto explicativo
- Noticia o informe
- Carta formal
- Receta
- Instructivo
- Afiche o folleto
- Reseña
- Biografía breve

Criterio: cada género tiene convenciones propias que la consigna debe respetar y explicar brevemente.
Por ejemplo: una receta siempre tiene ingredientes y pasos. Una noticia siempre responde quién, qué, cuándo y dónde.

---

### Ortografía y sistema de escritura

Contenidos por grado (acumulativos — cada grado suma al anterior, no reemplaza):
- 1°: Grafemas, fonemas, nombre propio, punto y mayúsculas
- 2°: Escritura convencional, género/número, coma
- 3°: Sílaba tónica, terminaciones verbales (-aba), g/j y c/s
- 4°: Reglas de acentuación, raya de diálogo, terminaciones (-aje, -ducir)
- 5°: Tilde en hiato, homófonos, correlación pretérito perfecto/imperfecto
- 6°: Tilde diacrítica, adverbios en -mente, homófonos complejos, siglas

**Ejercitación**
Distribución fija:
- 1 o 2 ejercicios de repaso de contenidos de grados anteriores
- 2 o 3 ejercicios sobre el contenido nuevo del grado actual
- 1 ejercicio integrador que combine ambos en un texto breve

**Explicación + ejercitación**
Explicación breve de la regla nueva del grado + 3 ejercicios de aplicación.

**Corrección de errores**
Texto breve con errores ortográficos intencionales que el chico encuentra y corrige.
Los errores deben corresponder a contenidos ya trabajados hasta ese grado.

---

## DISEÑO DE LA FICHA

- Fondo blanco siempre — imprime bien en cualquier impresora
- Color terracota (#A0522D) solo en: línea lateral izquierda, ícono del área, borde del bloque de actividad
- Tipografía del contenido: Lexend
- Encabezado: área + grado + campos para nombre, apellido y división
- Título: generado por la IA, atractivo y cercano al chico — nunca el nombre técnico del contenido
- Emoji relacionado al tema específico junto al título
- Bloque de actividad con borde fino sin fondo de color
- Líneas de respuesta con separación suficiente para la letra de un nene de primaria
- Footer: "Diseño Curricular · Provincia de Buenos Aires" + "Motor Pedagógico PBA"

---

## LO QUE QUEDA PARA ETAPAS FUTURAS

- Banco de íconos SVG por área y bloque (reemplaza el espacio reservado para imagen)
- Banco de fuentes históricas verificadas para fichas de Historia
- Opción de carga de texto/PDF del docente para fichas de Lectura literaria
- Bloque de Medios y ciudadanía
