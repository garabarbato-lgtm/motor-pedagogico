# Motor Pedagógico PBA — Contexto del proyecto

## Qué es este proyecto

Sistema de IA que transforma objetivos curriculares del Diseño Curricular de la Provincia de Buenos Aires en recursos educativos concretos para docentes, estudiantes y familias.

Un docente selecciona grado, área y contenido → el sistema genera explicación + ejemplo + actividad lista para usar en el aula.

## Estado actual

- Base curricular corregida: 251 registros, 4 áreas, 6 grados → archivo dc_pba_base_curricular_corregida.json
- Motor de generación probado: API de Claude genera recursos con estructura título + explicación + ejemplo + actividad
- Prototipos de test en HTML funcionando correctamente
- Repositorio: aún no creado — es el primer paso

## Base de datos curricular

Archivo: dc_pba_base_curricular_corregida.json (251 registros)

Estructura de cada registro:
```json
{
  "id": "mat_g3_001",
  "area": "Matemática",
  "grado": "3",
  "bloque": "Operaciones con Números Naturales",
  "item_original": "Multiplicación: problemas en distintos sentidos",
  "objetivo": "Resolver problemas de multiplicación que involucran series proporcionales, organizaciones rectangulares y combinación de elementos, relacionando las distintas situaciones con la escritura multiplicativa",
  "tipo": "contenido"
}
```

### Áreas y bloques

**Matemática (121 registros)**
Bloques: Números Naturales · Operaciones con Números Naturales · Números Racionales · Medidas · Geometría · Espacio · Proporcionalidad

**Ciencias Naturales (55 registros)**
Bloques: Seres vivos · Materiales · El mundo físico · La Tierra y el universo

**Ciencias Sociales (37 registros)**
Bloques: Las sociedades a través del tiempo · Sociedades y territorios · Ciudadanía y participación

**Prácticas del Lenguaje (38 registros)**
Bloques: Lectura literaria · Escritura creativa · Lectura de textos informativos · Escritura de textos informativos · Ortografía y sistema de escritura · Medios y ciudadanía

## Prompt pedagógico validado

Este prompt genera recursos correctos. Usarlo siempre igual:

```
Sos un docente experto en didáctica de nivel primario de la Provincia de Buenos Aires.

Generá un recurso educativo breve para este contenido curricular:

Grado: [X]° año
Área: [X]
Bloque: [X]
Contenido: [X]
Objetivo de aprendizaje: [X]

El recurso debe tener esta estructura exacta en JSON:
{
  "titulo": "título claro y atractivo para el alumno",
  "explicacion": "explicación breve del concepto en lenguaje claro para primaria (3-4 oraciones)",
  "ejemplo": "un ejemplo concreto y cercano a la experiencia del alumno",
  "actividad": "una actividad significativa que invite a pensar, no mecánica"
}

Respondé SOLO con el JSON, sin texto adicional ni markdown.
```

Modelo: claude-sonnet-4-20250514 — max_tokens: 1000

## Arquitectura planificada

| Componente | Tecnología | Descripción |
|-----------|-----------|-------------|
| Frontend | HTML/CSS/JS o React | Selector grado → área → bloque → contenido → generar |
| Base de datos | Supabase (gratuito) | JSON curricular + fichas guardadas |
| Backend | Vercel Functions | Llama a la API de Claude |
| Repositorio | GitHub | Control de versiones |
| Hosting | Vercel | Deploy automático desde GitHub |

## Próximos pasos en orden

1. Crear repositorio en GitHub y subir dc_pba_base_curricular_corregida.json
2. Construir el front: selector de grado/área/contenido + generador
3. Conectar con la API de Claude (backend con Vercel Functions)
4. Validación pedagógica automática del recurso generado
5. Generador de fichas descargables (PDF)
6. Biblioteca de fichas guardadas

## Decisiones pedagógicas — NO revertir sin consultar

- Criterio de contenidos: solo lo que un docente reconoce como algo que enseña en el aula
- Estructura del recurso: título + explicación breve + ejemplo concreto + actividad significativa
- PDL organizado por tipo de práctica (lectura, escritura, ortografía) en lugar de ámbitos del DC
- Ortografía en PDL especifica el tema exacto por grado (ej: tilde en hiato en 5°)
- Base: 251 registros limpios — no agregar sin validar contra el DC PBA

## Notas técnicas

- API key de Claude: variable de entorno ANTHROPIC_API_KEY
- El JSON curricular se carga desde el repositorio o desde Supabase
- No usar npm install -g @anthropic-ai/claude-code — método deprecado
- Siempre usar el instalador nativo

PROTOCOLO DE DELEGACIÓN POR VOLUMEN (TOKEN SAVING)
Claude actúa como Arquitecto Principal de tiza. La delegación en Gemini no es obligatoria por tipo de tarea, sino por densidad de tokens y extensión de la respuesta.

1. CRITERIO DE DELEGACIÓN
Claude debe sugerir delegar a Gemini únicamente cuando la tarea sea extensa, repetitiva o de baja complejidad lógica, para preservar la ventana de contexto.

Tareas que hace Claude (No delegar):

Arquitectura de archivos y lógica de negocio (JS/TS).

Manejo de estados, hooks y conexión con base de datos.

Debugging de errores de sistema o rutas de API.

Cambios puntuales de estilo (1-10 líneas).

Tareas para Gemini (Delegar por volumen):

Estilos: Archivos CSS completos, configuraciones extensas de Tailwind o animaciones descriptivas.

Documentación: Generación de archivos README, manuales de uso para docentes o guías pedagógicas.

Contenido de tiza.: Generación de listas largas de ejercicios, problemas matemáticos o transcripción de Diseños Curriculares.

Boilerplate: Creación de múltiples componentes similares o estructuras HTML repetitivas.

2. ACCIÓN OBLIGATORIA PARA CLAUDE
Si Claude estima que la respuesta superará las 50-60 líneas de código o texto no lógico:

Notificar: Debe informar al usuario: "Esta tarea requiere un alto volumen de tokens. Sugiero delegar la generación a Gemini para optimizar el contexto".

Contextualizar: Debe proporcionar un prompt técnico breve para que el usuario lo copie en Gemini. Este prompt debe incluir:

Variables necesarias.

Formato de salida esperado.

Restricciones técnicas específicas para que el código sea compatible al volver.

### AUTOMATIZACIÓN: CLAUDE + GEMINI CLI

Claude tiene permiso para ejecutar comandos de terminal y debe usar el CLI de Gemini para tareas de "Carga Pesada".

**Instrucciones de ejecución:**
1. **Identificación:** Si la tarea es de volumen (CSS, Docs, Boilerplate), Claude no debe escribir el código él mismo.
2. **Ejecución Directa:** Claude debe construir el comando de terminal para Gemini.
   - Formato: `gemini "[instrucción]" > [archivo_destino]`
   - Ejemplo: Si el usuario pide CSS, Claude debe ejecutar: `gemini "Genera el CSS para este HTML: [código]" > styles.css`
3. **Revisión:** Una vez que Gemini genera el archivo, Claude debe leerlo (`cat [archivo]`) para verificar que la integración sea correcta.

**Restricción de seguridad:**
Claude siempre debe pedir confirmación al usuario antes de ejecutar el comando de terminal de Gemini.