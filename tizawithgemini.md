Bitácora de Desarrollo: Proyecto tiza.
Asunto: Refactorización de la base de datos curricular y automatización local.

1. Contexto y Problema Pedagógico Detectado
Durante el desarrollo de la lógica de generación de fichas, se detectó un problema de granularidad curricular. El Diseño Curricular de PBA agrupa múltiples temas en un solo ítem (ej: "Ortografía: tilde diacrítica, adverbios en -mente y homófonos").

Al procesar esto, la IA intentaba generar recursos que abarcaban demasiados conceptos para una clase de 60 minutos.

Solución aplicada: Descomposición atómica. Se estableció la regla de negocio "Una Ficha = Un Objetivo de Aprendizaje".

2. Estrategia Técnica Utilizada
Para no consumir la cuota diaria de tokens de Claude Code analizando y reescribiendo la base de datos completa, se optó por una estrategia de automatización local:

Creación de Script: Se desarrolló un script en Node.js (procesar_curriculo.js) para realizar el trabajo pesado en la terminal de forma local.

Lógica de Separación: El script lee el archivo original y busca conjunciones (y, e, o) y comas (,) dentro del campo item_original.

Generación de IDs: A los contenidos divididos se les asignó un sufijo dinámico (a, b, c...) para mantener la trazabilidad con el ID oficial del DC de PBA.

Nuevos Campos: Se crearon dos campos nuevos para alimentar al motor de IA: subtema (para la interfaz) y objetivo_especifico (para el prompt de generación).

3. Resolución de Conflictos en la Terminal
Durante la ejecución local se resolvieron los siguientes bloqueos técnicos:

Navegación de directorios: Se utilizó el comando cd para ubicar la terminal exactamente en la ruta del proyecto (C:\Users\ggara\OneDrive\Escritorio\motor-pedagogico).

Conflictos de Módulos (ESM): Se actualizó la sintaxis del script de require('fs') a import fs from 'fs' debido a la configuración de tipo "module" en el package.json del proyecto React.

4. Código del Script Ejecutado (procesar_curriculo.js)
Este es el código exacto que se ejecutó con éxito para generar la nueva base de datos:

JavaScript
import fs from 'fs';

console.log("Leyendo base de datos original...");
const rawData = fs.readFileSync('dc_pba_base_curricular_corregida.json', 'utf8');
const curriculo = JSON.parse(rawData);

const curriculoGranular = [];

curriculo.forEach(item => {
    // Definimos la regla de corte: coma, " y ", " e ", " o "
    const reglaDeCorte = /,\s*|\s+y\s+|\s+e\s+|\s+o\s+/i;
    
    // Condición: Si el tema contiene alguno de esos separadores
    if (item.item_original.match(reglaDeCorte)) {
        
        // Dividir el texto mecánicamente
        const partes = item.item_original.split(reglaDeCorte)
            .map(p => p.trim())
            .filter(p => p.length > 2); // Evita crear fichas con palabras sueltas

        partes.forEach((parte, index) => {
            // Genera a, b, c, d... dinámicamente
            const sufijo = String.fromCharCode(97 + index); 
            
            // Capitalizar la primera letra
            const subtemaFormateado = parte.charAt(0).toUpperCase() + parte.slice(1);

            curriculoGranular.push({
                id: `${item.id}_${sufijo}`,
                area: item.area,
                grado: item.grado,
                bloque: item.bloque,
                item_original: item.item_original,
                subtema: subtemaFormateado,
                objetivo_especifico: `Abordar el concepto de ${parte.toLowerCase()} dentro de ${item.bloque.toLowerCase()}`,
                tipo: "contenido_atomico"
            });
        });

    } else {
        // Si no se divide, pasa directo adaptando el formato
        curriculoGranular.push({
            id: item.id,
            area: item.area,
            grado: item.grado,
            bloque: item.bloque,
            item_original: item.item_original,
            subtema: item.item_original,
            objetivo_especifico: item.objetivo || "Trabajar este contenido de forma integral",
            tipo: "contenido_atomico"
        });
    }
});

fs.writeFileSync('dc_pba_base_granular.json', JSON.stringify(curriculoGranular, null, 2), 'utf8');

console.log("--------------------------------------------------");
console.log(`¡Proceso exitoso!`);
console.log(`- Registros originales: ${curriculo.length}`);
console.log(`- Nuevos registros atómicos: ${curriculoGranular.length}`);
console.log(`El archivo 'dc_pba_base_granular.json' está listo.`);
console.log("--------------------------------------------------");
5. Instrucciones Directas para Claude
A partir de este momento, Claude debe acatar las siguientes directivas:

Nueva Fuente de Datos: Ignorar dc_pba_base_curricular_corregida.json. El motor de búsqueda de tiza. ahora debe consumir exclusivamente el archivo dc_pba_base_granular.json.

Interfaz del Buscador: Los resultados de búsqueda en el frontend deben mostrar el contenido del campo subtema, no el item_original.

Generación de Fichas: Al redactar el prompt oculto que genera el recurso didáctico, se debe utilizar el contenido del campo objetivo_especifico para garantizar el enfoque atómico de la clase.