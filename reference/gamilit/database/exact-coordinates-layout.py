#!/usr/bin/env python3
"""
Crucigrama con coordenadas EXACTAS proporcionadas por el usuario
"""

# Coordenadas exactas:
# - SORBONA: fila 4, columna 3 (horizontal)
# - POLONIO: fila 3, columna 4 (vertical)
# - NOBEL: fila 6, columna ? (horizontal, debe intersectar con POLONIO)
# - RADIOACTIVIDAD: fila 8, columna 1 (horizontal)
# - RADIO: vertical (calculo desde RADIOACTIVIDAD)
# - CURIE: vertical (calculo desde RADIOACTIVIDAD)

words = [
    # Horizontales
    {
        "id": "h1",
        "number": 1,
        "direction": "horizontal",
        "clue": "Universidad donde estudió",
        "answer": "SORBONA",
        "startRow": 4,
        "startCol": 3,
        "length": 7
    },
    {
        "id": "h2",
        "number": 2,
        "direction": "horizontal",
        "clue": "Premio recibido en 1903 y 1911",
        "answer": "NOBEL",
        "startRow": 6,
        "startCol": 3,  # Para que O esté en col 4 (intersección con POLONIO)
        "length": 5
    },
    {
        "id": "h3",
        "number": 3,
        "direction": "horizontal",
        "clue": "Fenómeno de emisión espontánea de radiación descubierto por Marie",
        "answer": "RADIOACTIVIDAD",
        "startRow": 8,
        "startCol": 1,
        "length": 14
    },
    # Verticales
    {
        "id": "v1",
        "number": 4,
        "direction": "vertical",
        "clue": "Elemento químico nombrado en honor a Polonia",
        "answer": "POLONIO",
        "startRow": 3,
        "startCol": 4,
        "length": 7
    },
    {
        "id": "v2",
        "number": 5,
        "direction": "vertical",
        "clue": "Elemento químico radiactivo descubierto",
        "answer": "RADIO",
        "startRow": 8,
        "startCol": 1,  # Primera R de RADIOACTIVIDAD
        "length": 5
    },
    {
        "id": "v3",
        "number": 6,
        "direction": "vertical",
        "clue": "Apellido de Marie",
        "answer": "CURIE",
        "startRow": 8,
        "startCol": 7,  # Letra C de RADIOACTIVIDAD
        "length": 5
    },
]

# Crear grid
grid = [[' ' for _ in range(16)] for _ in range(14)]

# Colocar palabras
for word in words:
    answer = word['answer']
    row = word['startRow']
    col = word['startCol']
    direction = word['direction']

    for i, letter in enumerate(answer):
        if direction == 'horizontal':
            grid[row][col + i] = letter
        else:
            grid[row + i][col] = letter

# Mostrar grid
print("=" * 75)
print("CRUCIGRAMA - Coordenadas Exactas del Usuario")
print("=" * 75)
print("     ", end="")
for c in range(16):
    print(f"{c:2}", end=" ")
print()

for r in range(14):
    print(f"{r:2}:  ", end="")
    for c in range(16):
        cell = grid[r][c]
        if cell == ' ':
            print(" . ", end="")
        else:
            print(f" {cell} ", end="")
    print()

# Validar intersecciones
print("\n" + "=" * 75)
print("INTERSECCIONES:")
print("=" * 75)

intersections = []
conflicts = []

for i, word1 in enumerate(words):
    for j, word2 in enumerate(words):
        if i >= j or word1['direction'] == word2['direction']:
            continue

        positions1 = []
        positions2 = []

        for k, letter in enumerate(word1['answer']):
            if word1['direction'] == 'horizontal':
                positions1.append((word1['startRow'], word1['startCol'] + k, letter))
            else:
                positions1.append((word1['startRow'] + k, word1['startCol'], letter))

        for k, letter in enumerate(word2['answer']):
            if word2['direction'] == 'horizontal':
                positions2.append((word2['startRow'], word2['startCol'] + k, letter))
            else:
                positions2.append((word2['startRow'] + k, word2['startCol'], letter))

        for pos1 in positions1:
            for pos2 in positions2:
                if pos1[0] == pos2[0] and pos1[1] == pos2[1]:
                    if pos1[2] == pos2[2]:
                        intersections.append(True)
                        print(f"✓ {word1['id']} ({word1['answer']}) ∩ {word2['id']} ({word2['answer']}) en ({pos1[0]},{pos1[1]}): {pos1[2]} = {pos2[2]}")
                    else:
                        conflicts.append(True)
                        print(f"✗ {word1['id']} ({word1['answer']}) ∩ {word2['id']} ({word2['answer']}) en ({pos1[0]},{pos1[1]}): {pos1[2]} ≠ {pos2[2]}")

print(f"\nTotal intersecciones válidas: {len(intersections)}")
print(f"Total conflictos: {len(conflicts)}")

if len(conflicts) == 0 and len(intersections) >= 5:
    print("\n✅ PERFECTO: Crucigrama válido sin conflictos")
    print(f"   - {len(words)} palabras")
    print(f"   - {len(intersections)} intersecciones correctas")
    print(f"   - 0 conflictos")

    # Generar JSON
    print("\n" + "=" * 75)
    print("JSON PARA SQL:")
    print("=" * 75)
    import json
    print(json.dumps(words, indent=2, ensure_ascii=False))
elif len(conflicts) > 0:
    print(f"\n❌ Hay {len(conflicts)} conflictos que corregir")
else:
    print(f"\n⚠️  Solo {len(intersections)} intersecciones (se esperaban más)")
