tiza. — README de trabajo
Última actualización: abril 2026
=====================================

CÓMO TRABAJAMOS
---------------
- Diego define las decisiones pedagógicas y de producto.
- Claude (chat) hace planning, specs, decisiones estratégicas y redacta los prompts para CC.
- Claude Code (CC) en terminal implementa el código.
- REGLA CRÍTICA: los prompts para CC siempre los revisa Diego antes de enviarlos.
- Siempre diagnóstico antes de tocar código.
- Cambios estrictamente por archivo — nunca en cascada sin revisar.
- No tocar el sistema PDL salvo que se indique explícitamente.
- Prompts agrupados para minimizar tokens.
- Validación visual con mockups antes de comprometerse con specs o código.

El mockup aprobado como referencia visual definitiva está en: tiza_fichas_v3.html
El estado completo del diseño y los pools de ejercicios están en: tiza_spec_estado.md
El contexto general del proyecto está en: tiza-contexto.md


LO QUE YA ESTÁ HECHO Y PASADO A CC
------------------------------------
✅ Respuestas en JSON estructurado con tipos de ejercicio definidos
✅ Edición inline de la ficha generada
✅ Descarga en PDF
✅ Flujo rediseñado en 4 pasos en una sola pantalla
✅ Buscador en el paso de selección de contenido
✅ Pipeline de validación con scoring (umbral: 80/100)
✅ Contexto pedagógico en Paso 4: momento didáctico + nivel del grupo + campo libre
✅ Indicadores de avance del DC PBA inyectados en el prompt generador y validador
✅ Prompts especializados por tipo de ficha: buildPresentacionPrompt / buildPracticaPrompt / buildCierrePrompt
✅ FichaPresenta.jsx — primer componente de la nueva arquitectura, implementado


LO QUE ESTAMOS HACIENDO AHORA
-------------------------------
Estamos en medio de la refactorización de FichaTrabajo.jsx hacia una arquitectura
de tres componentes separados, uno por tipo de ficha.

FichaTrabajo.jsx pasa a ser un envolvente que lee `tipo_ficha` del JSON
y delega el render al componente correspondiente:
  → FichaPresenta.jsx  ✅ hecho
  → FichaPractica.jsx  ⏳ pendiente
  → FichaCierre.jsx    ⏳ pendiente

Proporciones de cada ficha (sobre la hoja sin footer):
  Presentación: encabezado 15% / explicación 65% / ejercicios 35%
  Práctica:     encabezado 15% / explicación 15% / ejercicios 70%
  Cierre:       encabezado 15% / ejercicios 85%

El orden de implementación sugerido: Práctica primero, luego Cierre.


FEATURES EN EL HORIZONTE (post refactorización)
-------------------------------------------------
- Secuencia didáctica: generar una secuencia de 3 a 5 fichas encadenadas
- Biblioteca de recursos: banco de textos, imágenes y materiales reutilizables
- Base de datos de imágenes: para insertar ilustraciones en las fichas generadas
- Diferenciación curricular: versión "con apoyo" y versión "puede más" a partir de la ficha estándar
- DOCX export: crítico para el flujo escolar real (ficha → Word → dirección → fotocopiadora)
- Mejora visual de la página usando las skills instaladas en CC
- Panel lateral de la ficha generada: editar / descargar / imprimir / generar versiones
- Validador con Sonnet: usar Sonnet para validar y Haiku para generar
- Feature texto externo: el docente sube un texto y la IA genera actividades sobre él


STACK TÉCNICO
--------------
Frontend:  React + Vite + Tailwind
Backend:   Vercel Functions
IA:        Anthropic API — Claude Haiku (generación) · Sonnet (validación)
Deploy:    Vercel — fichastiza.vercel.app
Repo:      github.com/garabarbato-lgtm/motor-pedagogico
Local:     C:\Users\ggara\OneDrive\Escritorio\motor-pedagogico


ARCHIVOS CLAVE (todos en la raíz, sin carpeta src/)
-----------------------------------------------------
Generador.jsx                          Flujo principal de selección + generación
FichaTrabajo.jsx                       Envolvente — delega por tipo_ficha
FichaPresenta.jsx                      Componente de Presentación ✅
FichaPractica.jsx                      Componente de Práctica ⏳
FichaCierre.jsx                        Componente de Cierre ⏳
api/generate.js                        Vercel Function — llama a Anthropic
dc_pba_base_curricular_corregida.json  Fuente única de verdad curricular (435 registros)
vercel.json                            Config de deploy (maxDuration: 60)
tiza_fichas_v3.html                    Mockup aprobado — referencia visual definitiva
tiza_spec_estado.md                    Spec completa de fichas + pools + pendientes
tiza-contexto.md                       Contexto general del proyecto
