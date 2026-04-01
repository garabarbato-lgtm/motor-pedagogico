# 📋 Auditoría UX/UI: Proyecto Tiza

## 1. Diagnóstico de Producto
* **Propuesta de Valor:** "Lo que tardabas una tarde, ahora son diez minutos".
* **Output (PDF):** El resultado final es el punto más fuerte; limpio, estructurado y con un diseño pedagógico profesional.
* **Disonancia de UX:** Existe una brecha entre la promesa de la landing ("3 pasos") y la ejecución técnica de la interfaz ("Paso 1 de 5").

---

## 2. Matriz de Problemas Críticos

| Problema | Impacto | Descripción |
| :--- | :--- | :--- |
| **Inflación de Flujo** | Alto | El usuario percibe el proceso como más largo de lo prometido (5 pantallas en lugar de 3). |
| **Abismo Blanco** | Medio | Desperdicio de espacio en dispositivos móviles; los elementos quedan aislados y obligan al scroll. |
| **Fricción de Puntería** | Alto | Dificultad para editar en dispositivos táctiles debido a iconos de edición (lápices) muy pequeños. |
| **Invisibilidad de Opciones** | Medio | Checkboxes grises con bajo contraste que hacen que funciones como "Incluir explicación" pasen desapercibidas. |
| **Caja Negra de Carga** | Bajo | Incertidumbre sobre el progreso de la IA durante la espera con una barra de carga genérica. |

---

## 3. Hoja de Ruta de Soluciones

### ⚡ Quick Wins (Mejoras Inmediatas)
1.  **Unificación de Selectores:** Fusionar la selección de **Grado** y **Área** en una única pantalla para reducir la carga cognitiva y los clics.
2.  **Edición Directa:** Implementar edición "inline". Permitir que el docente toque cualquier párrafo de la previsualización para editarlo, sin depender del icono del lápiz.
3.  **Refuerzo de Opciones:** Reemplazar los checkboxes por **Toggle Switches** de color verde (u otro color de acento) para resaltar las opciones adicionales.

### 🛠️ Mediano Plazo
* **Skeleton Preview:** Sustituir la pantalla de carga por un "esqueleto" visual de la ficha que se vaya completando mientras la IA trabaja.
* **Buscador Predictivo:** Añadir una barra de búsqueda para que usuarios avanzados escriban directamente el tema (ej: "Fracciones 4to") y salten los pasos iniciales.
* **Validación de Sello:** Hacer explícito el sello de "Contenido alineado al Diseño Curricular" en la interfaz de edición para dar seguridad pedagógica inmediata.

---

## 4. Análisis Visual y Estético
* **Jerarquía:** Los elementos más importantes (como el objetivo de la ficha) deben tener mayor peso visual que las etiquetas decorativas.
* **Iconografía:** Estandarizar el estilo. Evitar mezclar iconos ilustrados a color con iconos de línea minimalistas.
* **Accesibilidad:** Aumentar el contraste en los textos secundarios y asegurar que todos los botones tengan un tamaño mínimo de 44x44px para uso móvil.

---

## 5. Recomendaciones para la Landing Page
* **Alineación:** Asegurar que el mensaje de "3 pasos" coincida con la realidad de la app para evitar rebote.
* **Prueba Social:** Incluir testimonios o mención específica a la **Resolución Nº 1482/17** (o el diseño curricular vigente) para dar respaldo legal.
* **Demo Visual:** Un GIF corto mostrando la rapidez de generación convierte más que una captura estática pequeña.

Addendum: Auditoría de Escritorio y Errores de Lógica

1. Error Crítico: El "Bucle de Redundancia"
Se detectó un fallo en la arquitectura de información: al seleccionar una categoría principal (ej. Ciencias Naturales), el sistema redirige a una pantalla que pide confirmar la misma categoría.

Impacto: "UX Loop" que genera frustración y sensación de que la app es lenta o no funciona. Cada clic redundante aumenta la tasa de rebote.

Solución Técnica: Implementar un "Auto-skip". Si una categoría tiene una única subcategoría lógica o es la raíz, el flujo debe saltar directamente a la selección de contenidos/bloques.

2. Dispersión Visual en Pantallas Grandes
En escritorio, los elementos están demasiado alejados entre sí, obligando al usuario a realizar "ping-pong visual" (recorrer toda la pantalla con el ojo para una sola acción).

Problema: Indicador de pasos arriba a la izquierda, contenido al centro, y botón "Siguiente" abajo a la derecha.

Solución: Layout de Columnas Progresivas. En lugar de cambiar de pantalla, mostrar las opciones en columnas laterales (estilo Finder de Mac).

Columna 1: Grados.

Columna 2: Áreas (aparece al elegir grado).

Columna 3: Temas (aparece al elegir área).

3. Aprovechamiento del Sidebar
El menú lateral actual está prácticamente vacío.

Oportunidad: Usar el Sidebar para mostrar el "Resumen de Configuración". A medida que el docente elige Grado > Área > Bloque, la barra lateral debe actualizarse con esos datos. Esto da seguridad de que el sistema guardó las selecciones previas.

4. Interfaz de Edición (The Final Preview)
El PDF de Ciencias Naturales generado es de gran nivel, pero la interfaz para editarlo compite visualmente con el contenido.

Mejora de Interfaz: Implementar "Hover & Edit". Ocultar los iconos de lápiz por defecto y mostrarlos solo cuando el usuario pase el mouse por encima de un bloque. Esto permite que la previsualización se vea exactamente igual al PDF final ("What You See Is What You Get").

Botón de Acción: El botón "Descargar PDF" debe ser el elemento más vibrante de la pantalla (verde sólido) y estar siempre visible en la cabecera o en un botón flotante.

Nota final: El producto tiene una "inteligencia" pedagógica superior a la media, pero la interfaz de escritorio se comporta como una app móvil estirada. Ajustar la densidad de información en desktop hará que se perciba como una herramienta SaaS profesional para colegios.
---
*Fin del documento.*