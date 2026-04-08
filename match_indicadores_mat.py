import json
import anthropic

# ─── Cargar archivos ───────────────────────────────────────────
with open("dc_pba_con_indicadores_pdl.json", encoding="utf-8") as f:
    registros = json.load(f)

with open("indicadores_mat_limpio.txt", encoding="utf-8") as f:
    texto_indicadores = f.read()

client = anthropic.Anthropic()

# ─── Parsear indicadores por grado ────────────────────────────
def parsear_indicadores(texto):
    secciones = {}
    grado_actual = None

    for linea in texto.split("\n"):
        linea = linea.strip()
        if linea.startswith("GRADO:"):
            grado_raw = linea.replace("GRADO:", "").strip()
            if "-" in grado_raw:
                partes = grado_raw.split("-")
                grado_actual = partes
            else:
                grado_actual = [grado_raw]
            for g in grado_actual:
                secciones[g] = []
        elif linea.startswith("- ") and grado_actual:
            indicador = linea[2:].strip()
            if len(indicador) > 15:
                for g in grado_actual:
                    secciones[g].append(indicador)

    return secciones

indicadores_por_grado = parsear_indicadores(texto_indicadores)

print("Indicadores parseados por grado:")
for g, inds in indicadores_por_grado.items():
    print(f"  Grado {g}: {len(inds)} indicadores")

# ─── Matchear con IA ──────────────────────────────────────────
def seleccionar_indicadores(registro, pool_indicadores):
    pool_texto = "\n".join(f"- {ind}" for ind in pool_indicadores)

    prompt = f"""Sos un especialista en el Diseño Curricular de la Provincia de Buenos Aires.

Tenés este contenido curricular de Matemática:
- Grado: {registro['grado']}°
- Bloque: {registro['bloque']}
- Subtema: {registro['subtema']}
- Contenido: {registro['item_original']}
- Objetivo específico: {registro['objetivo_especifico']}

Y este pool de indicadores de avance para el grado:
{pool_texto}

Seleccioná los 2 o 3 indicadores más relevantes para este contenido específico.
Devolvé SOLO un JSON con esta estructura, sin markdown ni texto extra:
{{
  "indicadores_de_avance": [
    "indicador 1 exacto tal como aparece en el pool",
    "indicador 2 exacto tal como aparece en el pool"
  ]
}}"""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.content[0].text.strip()
    clean = text.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)["indicadores_de_avance"]


# ─── Procesar registros de Matemática ─────────────────────────
mat_registros = [r for r in registros if r.get("area") == "Matemática"]
otros_registros = [r for r in registros if r.get("area") != "Matemática"]

print(f"\nProcesando {len(mat_registros)} registros de Matemática...")

registros_actualizados = []
errores = []

for i, registro in enumerate(mat_registros):
    grado = registro.get("grado")
    pool = indicadores_por_grado.get(grado, [])

    if not pool:
        print(f"  [{i+1}/{len(mat_registros)}] Sin pool para grado {grado} — saltando")
        registros_actualizados.append(registro)
        continue

    try:
        indicadores = seleccionar_indicadores(registro, pool)
        registro_nuevo = dict(registro)
        registro_nuevo["indicadores_de_avance"] = indicadores
        registros_actualizados.append(registro_nuevo)
        print(f"  [{i+1}/{len(mat_registros)}] ✓ {registro['subtema']} (grado {grado}) → {len(indicadores)} indicadores")
    except Exception as e:
        print(f"  [{i+1}/{len(mat_registros)}] ✗ Error en {registro['id']}: {e}")
        errores.append(registro["id"])
        registros_actualizados.append(registro)

# ─── Combinar y guardar ───────────────────────────────────────
resultado_final = registros_actualizados + otros_registros

with open("dc_pba_con_indicadores_mat.json", "w", encoding="utf-8") as f:
    json.dump(resultado_final, f, ensure_ascii=False, indent=2)

print(f"\n✓ JSON generado: dc_pba_con_indicadores_mat.json")
print(f"  Total registros: {len(resultado_final)}")
print(f"  Matemática actualizados: {len(registros_actualizados) - len(errores)}")
if errores:
    print(f"  Errores: {errores}")
