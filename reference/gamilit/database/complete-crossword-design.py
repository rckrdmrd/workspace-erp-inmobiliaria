#!/usr/bin/env python3
"""
Diseño completo del crucigrama con todas las palabras
Basado en las pistas visibles en la imagen
"""

# Palabras que DEBEN estar según las pistas en la imagen:
# Horizontales: SORBONA, NOBEL, RADIOACTIVIDAD
# Verticales: RADIO, PIERRE, CURIE (apellido de Marie)

# Voy a crear un diseño donde todas encajen correctamente

words = [
    # Horizontales
    {
        "id": "h1",
        "number": 1,
        "direction": "horizontal",
        "clue": "Universidad donde estudió",
        "answer": "SORBONA",
        "startRow": 1,
        "startCol": 1,
        "length": 7
    },
    {
        "id": "h2",
        "number": 2,
        "direction": "horizontal",
        "clue": "Premio recibido en 1903 y 1911",
        "answer": "NOBEL",
        "startRow": 2,
        "startCol": 1,
        "length": 5
    },
    {
        "id": "h3",
        "number": 3,
        "direction": "horizontal",
        "clue": "Fenómeno de emisión espontánea de radiación descubierto por Marie",
        "answer": "RADIOACTIVIDAD",
        "startRow": 4,
        "startCol": 0,
        "length": 14
    },
    # Verticales
    {
        "id": "v1",
        "number": 4,
        "direction": "vertical",
        "clue": "Elemento químico radiactivo descubierto",
        "answer": "RADIO",
        "startRow": 4,
        "startCol": 0,
        "length": 5
    },
    {
        "id": "v2",
        "number": 5,
        "direction": "vertical",
        "clue": "Esposo de Marie",
        "answer": "PIERRE",
        "startRow": 0,
        "startCol": 3,
        "length": 6
    },
    {
        "id": "v3",
        "number": 6,
        "direction": "vertical",
        "clue": "Apellido de Marie",
        "answer": "CURIE",
        "startRow": 4,
        "startCol": 8,
        "length": 5
    },
]

# Crear grid
grid = [[' ' for _ in range(16)] for _ in range(10)]

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
print("CRUCIGRAMA COMPLETO - Con todas las palabras")
print("=" * 75)
print("     ", end="")
for c in range(16):
    print(f"{c:2}", end=" ")
print()

for r in range(10):
    print(f"{r:2}:  ", end="")
    for c in range(16):
        cell = grid[r][c]
        if cell == ' ':
            print(" . ", end="")
        else:
            print(f" {cell} ", end="")
    print()

# Encontrar intersecciones
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

print(f"\nIntersecciones válidas: {len(intersections)}")
print(f"Conflictos: {len(conflicts)}")

if len(conflicts) == 0:
    print("\n✅ PERFECTO: Todas las intersecciones son válidas")

    # Generar JSON
    print("\n" + "=" * 75)
    print("JSON PARA SQL:")
    print("=" * 75)
    import json
    print(json.dumps(words, indent=2, ensure_ascii=False))
else:
    print(f"\n⚠️  Hay {len(conflicts)} conflictos que necesitan resolverse")
