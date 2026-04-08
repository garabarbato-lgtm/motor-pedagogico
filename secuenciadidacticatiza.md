# 📘 Proyecto: Motor de Secuencias Didácticas (MSD) - tiza.

## 1. Fundamentación Pedagógica (PBA 2018)
El MSD transforma nodos curriculares en trayectorias de aprendizaje. Su objetivo es garantizar la **continuidad**, la **institucionalización** (lo que va al pizarrón) y la **intervención docente** estratégica.

## 2. Arquitectura de Datos (Contrato de API)
Para que el motor funcione, la respuesta de `api/generate-sequence.js` debe seguir estrictamente esta estructura JSON:

{
  "planificacion": {
    "fundamentacion": "Texto técnico para el directivo",
    "objetivos": ["punto 1", "punto 2"],
    "clases": [
      {
        "numero": 1,
        "momento": "Inicio/Desarrollo/Cierre",
        "consigna_docente": "Qué decir y qué preguntar"
      }
    ]
  },
  "fichas": [
    { "clase_id": 1, "titulo": "...", "contenido_markdown": "..." },
    { "clase_id": 2, "titulo": "...", "contenido_markdown": "..." }
  ],
  "pizarron": [
    { "clase_id": 1, "recuadro": "Texto síntesis para la carpeta" },
    { "clase_id": 2, "recuadro": "Texto síntesis para la carpeta" }
  ],
  "metadatos": {
    "tiempo_estimado": "X módulos",
    "rubrica_interna": ["indicador 1", "indicador 2"]
  }
}

## 3. Selección Modular y Edición
El docente tiene el control total antes de la descarga:
- **Toggle On/Off:** Cada objeto dentro de `fichas` o `pizarron` puede ser desactivado.
- **Recálculo:** Si se apaga una ficha, el frontend oculta ese nodo en la preview y el PDF final.

## 4. Implementación Técnica (Pasos para CC)
1. **Nuevo Componente:** `src/components/Secuenciador/Secuenciador.jsx`.
2. **State Management:** Usar un hook `useSequence` para manejar el objeto JSON de respuesta y los estados de visibilidad de cada módulo.
3. **Frontend:** Interfaz de pestañas: 
   - [Planificación] | [Guía Docente + Pizarrón] | [Fichas Alumnos].
4. **Exportación:** Ajustar `utils/pdfGenerator.js` para iterar sobre el JSON y generar el "Pack Unificado".

## 5. UI/UX & Branding
- **Títulos:** Nunito 900. **Cuerpo:** Lexend.
- **Colores:** Primario `#004733`, Acento `#00c48c`, Alerta Pedagógica (Pizarrón/Intervención) `#F5A623`.