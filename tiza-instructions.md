# 🟢 tiza. - Instrucciones Maestro del Proyecto

## 1. Contexto del Proyecto
App web educativa para maestros de PBA (Argentina). Genera recursos alineados al Diseño Curricular 2018.
- **Stack:** React + Vite + Tailwind + Vercel + Anthropic API (Haiku).
- **Base de Datos:** `dc_pba_base_curricular_corregida.json` (435 registros atómicos).
- **Filosofía:** Vibe coding. Priorizar soluciones visuales, prácticas y directas.

## 2. Identidad Visual (Branding)
- **Paleta:** - Principal: `#004733` (Verde oscuro tiza)
  - Acento: `#00c48c` (Verde brillante)
  - Acento cálido: `#F5A623` (Alertas/Pizarrón)
  - Fondo: `#F5F5F5` | Texto: `#2B2B2B` | Bordes: `#D9D9D9`
- **Tipografía:** - Logo: `Nunito 900`
  - App/Cuerpo: `Lexend`

## 3. Estructura de Componentes Clave
- `Generador.jsx`: Buscador search-first y selección de Grado/Área.
- `FichaTrabajo.jsx`: Preview de la ficha generada con edición inline ("click-to-edit").
- `api/generate.js`: Lógica de conexión con la IA para crear contenido.

## 4. Reglas de Oro para la IA (Co-Dev)
1. **PBA 2018:** Todo contenido generado debe citar o basarse en los "Modos de Conocer" del diseño curricular.
2. **Localización:** Usar siempre español rioplatense (voseo), moneda `$`, nombres y contextos de Buenos Aires, Argentina.
3. **No GSAP para visibilidad:** No usar `autoAlpha` o estados iniciales ocultos que rompan la carga. Usar Tailwind puro para opacidad y visibilidad.
4. **Iconografía:** Usar siempre la librería `lucide-react`.

## 5. Roadmap de Funcionalidades (Pendientes)
- **Secuenciador:** Generación de 3-6 clases vinculadas con momentos de inicio, desarrollo, cierre e institucionalización (pizarrón).
- **Biblioteca:** Persistencia de fichas con score > 80.
- **Exportación:** Soporte para PDF y próximamente DOCX.