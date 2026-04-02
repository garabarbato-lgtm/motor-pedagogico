# Blueprint Final: Motor de Secuencias Didácticas (MSD) - tiza.

## 1. Identidad del Producto
Transformar nodos curriculares atómicos en trayectorias de aprendizaje coherentes, con enfoque en la autonomía del estudiante y la intervención docente estratégica.

## 2. Nuevos Archivos y Funcionalidades de Código
- `src/components/Secuenciador/StepConfig.jsx`: Donde se define el ritmo de la secuencia.
- `src/utils/pdfGenerator.js`: Modificar para soportar layouts de varias páginas (Secuencia + Fichas).
- `api/generate-sequence.js`: El prompt incluirá ahora un bloque de "Gestión de Errores Comunes" (anticipar qué van a preguntar los alumnos).

## 3. Estructura del Output (Lo que entrega la IA)

| Sección | Descripción Pedagógica |
| :--- | :--- |
| **Hoja de Ruta** | Resumen de los 3-4 contenidos del JSON vinculados. |
| **Propósitos** | Basados estrictamente en los "Modos de Conocer" del Diseño 2018. |
| **Clase a Clase** | Inicio (Problema), Desarrollo (Uso de fichas), Cierre (Institucionalización). |
| **Lo que queda en la Carpeta** | El texto conceptual que el alumno debe registrar para formalizar el saber. |
| **Indicadores de Avance** | Qué observar en el alumno para saber si aprendió (Rúbrica). |

## 4. Prompt Maestro para Claude Haiku (Lógica Interna)
"Actuá como un Coordinador Pedagógico. Recibirás los IDs [JSON_DATA]. 
Diseñá una secuencia de [N] clases. 
CRÍTICO: 
1. Entre cada clase debe haber un puente lógico ('Como vimos en la clase anterior...').
2. Incluí una sección de 'Intervención Docente': ¿Qué preguntas debe hacer el maestro para guiar el pensamiento sin dar la respuesta?
3. Generá una Rúbrica con indicadores de avance específicos de los contenidos elegidos."

## 5. UX/UI & Branding (tiza.)
- **Layout:** Pantalla dividida. Izquierda: Configuración. Derecha: Preview dinámica con GSAP (fade-in suave).
- **Colores:** Encabezados de clase en `#004733`. Notas de intervención en `#F5A623` (alerta pedagógica).
- **Tipografía:** Títulos en **Nunito 900**, contenido en **Lexend**.