import json
import anthropic

# ─── Cargar archivos ───────────────────────────────────────────
with open("dc_pba_con_indicadores_mat.json", encoding="utf-8") as f:
    registros = json.load(f)

client = anthropic.Anthropic()

# ─── Parsear indicadores por grado ────────────────────────────
def parsear_indicadores(path):
    with open(path, encoding="utf-8") as f:
        texto = f.read()

    secciones = {}
    grado_actual = None

    for linea in texto.split("\n"):
        linea = linea.strip()
        if linea.startswith("GRADO:"):
            grado_raw = linea.replace("GRADO:", "").strip()
            grado_actual = [grado_raw]
            secciones[grado_raw] = []
        elif linea.startswith("- ") and grado_actual:
            indicador = linea[2:].strip()
            if len(indicador) > 15:
                for g in grado_actual:
                    secciones[g].append(indicador)

    return secciones

# ─── Matchear con IA ──────────────────────────────────────────
def seleccionar_indicadores(registro, pool_indicadores):
    pool_texto = "\n".join(f"- {ind}" for ind in pool_indicadores)

    prompt = f"""Sos un especialista en el Diseño Curricular de la Provincia de Buenos Aires.

Tenés este contenido curricular de {registro['area']}:
- Grado: {registro['grado']}°
- Bloque: {registro['bloque']}
- Subtema: {registro['subtema']}
- Contenido: {registro['item_original']}
- Objetivo específico: {registro['objetivo_especifico']}

Y este pool de indicadores de avance para el grado:
{pool_texto}

Seleccioná entre 2 y 4 indicadores más relevantes para este contenido específico. Solo usá 4 si realmente hay 4 indicadores claramente relevantes.
Devolvé SOLO un JSON con esta estructura, sin markdown ni texto extra:
{{
  "indicadores_de_avance": [
    "indicador exacto tal como aparece en el pool",
    "indicador exacto tal como aparece en el pool"
  ]
}}"""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=600,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.content[0].text.strip()
    clean = text.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)["indicadores_de_avance"]


# ─── Procesar área ─────────────────────────────────────────────
def procesar_area(registros, area, txt_path):
    indicadores_por_grado = parsear_indicadores(txt_path)

    print(f"\n{'─'*50}")
    print(f"Procesando {area}")
    print(f"{'─'*50}")
    for g, inds in sorted(indicadores_por_grado.items()):
        print(f"  Grado {g}: {len(inds)} indicadores")

    area_registros = [r for r in registros if r.get("area") == area]
    otros = [r for r in registros if r.get("area") != area]

    print(f"\nTotal registros a procesar: {len(area_registros)}")

    actualizados = []
    errores = []

    for i, registro in enumerate(area_registros):
        grado = registro.get("grado")
        pool = indicadores_por_grado.get(grado, [])

        if not pool:
            print(f"  [{i+1}/{len(area_registros)}] Sin pool para grado {grado} — saltando")
            actualizados.append(registro)
            continue

        try:
            indicadores = seleccionar_indicadores(registro, pool)
            registro_nuevo = dict(registro)
            registro_nuevo["indicadores_de_avance"] = indicadores
            actualizados.append(registro_nuevo)
            print(f"  [{i+1}/{len(area_registros)}] ✓ {registro['subtema']} (grado {grado}) → {len(indicadores)} indicadores")
        except Exception as e:
            print(f"  [{i+1}/{len(area_registros)}] ✗ Error en {registro['id']}: {e}")
            errores.append(registro["id"])
            actualizados.append(registro)

    if errores:
        print(f"  Errores: {errores}")

    return actualizados + otros


# ─── Pipeline completo ─────────────────────────────────────────
print("Iniciando procesamiento de Ciencias Naturales y Ciencias Sociales...")

registros = procesar_area(
    registros,
    "Ciencias Naturales",
    "indicadores_cn_limpio.txt"
)

registros = procesar_area(
    registros,
    "Ciencias Sociales",
    "indicadores_cs_limpio.txt"
)

# ─── Guardar resultado final ───────────────────────────────────
with open("dc_pba_base_curricular_corregida.json", "w", encoding="utf-8") as f:
    json.dump(registros, f, ensure_ascii=False, indent=2)

print(f"\n{'='*50}")
print(f"✓ JSON final generado: dc_pba_base_curricular_corregida.json")
print(f"  Total registros: {len(registros)}")
con_indicadores = sum(1 for r in registros if "indicadores_de_avance" in r)
print(f"  Registros con indicadores: {con_indicadores}")
