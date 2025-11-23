#!/usr/bin/env python3
"""
Crucigrama basado en la imagen "Distribución real.jpg"
Implementando las palabras visibles + inferidas
"""

# Palabras CLARAMENTE visibles en la imagen:
# 1. SORBONA (horizontal)
# 2. NOBEL (horizontal)
# 3. RADIOACTIVIDAD (horizontal)
# 4. RADIO (vertical)

# Palabras que DEBEN estar según las pistas pero no las veo claramente:
# 5. POLONIA (vertical - "País natal de Marie")
# 6. POLONIO (vertical - "Elemento nombrado por Polonia")
# 7. PIERRE (vertical - "Esposo de Marie")

# Basándome en el layout de la imagen, voy a crear un diseño coherente:

words = [
    # Horizontales (visibles claramente)
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
        "startCol": 2,
        "length": 5
    },
    {
        "id": "h3",
        "number": 3,
        "direction": "horizontal",
        "clue": "Fenómeno de emisión espontánea de radiación descubierto por Marie",
        "answer": "RADIOACTIVIDAD",
        "startRow": 4,
        "startCol": 1,
        "length": 14
    },
    # Verticales
    {
        "id": "v1",
        "number": 4,
        "direction": "vertical",
        "clue": "Segundo elemento descubierto",
        "answer": "RADIO",
        "startRow": 4,
        "startCol": 0,
        "length": 5
    },
    {
        "id": "v2",
        "number": 5,
        "direction": "vertical",
        "clue": "País natal de Marie",
        "answer": "POLONIA",
        "startRow": 0,
        "startCol": 2,
        "length": 7
    },
    {
        "id": "v3",
        "number": 6,
        "direction": "vertical",
        "clue": "Elemento químico nombrado en honor a Polonia",
        "answer": "POLONIO",
        "startRow": 1,
        "startCol": 5,
        "length": 7
    },
    {
        "id": "v4",
        "number": 7,
        "direction": "vertical",
        "clue": "Esposo de Marie",
        "answer": "PIERRE",
        "startRow": 1,
        "startCol": 3,
        "length": 6
    },
]

# Crear grid
grid = [[' ' for _ in range(16)] for _ in range(12)]

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
print("CRUCIGRAMA FINAL - Basado en imagen + pistas")
print("=" * 75)
print("     ", end="")
for c in range(16):
    print(f"{c:2}", end=" ")
print()

for r in range(12):
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
for i, word1 in enumerate(words):
    for j, word2 in enumerate(words):
        if i >= j or word1['direction'] == word2['direction']:
            continue

        # Calcular posiciones
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

        # Buscar intersecciones
        for pos1 in positions1:
            for pos2 in positions2:
                if pos1[0] == pos2[0] and pos1[1] == pos2[1]:
                    if pos1[2] == pos2[2]:
                        intersections.append(True)
                        print(f"✓ {word1['id']} ({word1['answer']}) ∩ {word2['id']} ({word2['answer']}) en ({pos1[0]},{pos1[1]}): {pos1[2]} = {pos2[2]}")
                    else:
                        print(f"✗ CONFLICTO: {word1['id']} ({word1['answer']}) ∩ {word2['id']} ({word2['answer']}) en ({pos1[0]},{pos1[1]}): {pos1[2]} ≠ {pos2[2]}")

print(f"\nTotal de intersecciones válidas: {len(intersections)}")

# Generar JSON para SQL
print("\n" + "=" * 75)
print("JSON PARA SQL:")
print("=" * 75)
import json
print(json.dumps(words, indent=2, ensure_ascii=False))
