#!/usr/bin/env python3
"""
Layout correcto basado en la imagen
POLONIO debe estar en columna diferente a RADIO
"""

# Mirando la imagen:
# - RADIO está en el lado IZQUIERDO (columna 0)
# - La P (inicio de POLONIO) está más a la DERECHA, arriba de alguna letra de SORBONA
# - SORBONA, NOBEL, RADIOACTIVIDAD están horizontales
# - CURIE está vertical debajo de RADIOACTIVIDAD

# Si SORBONA empieza en col 1, entonces:
# S O R B O N A (cols 1,2,3,4,5,6,7)

# La P podría estar arriba de la O (col 2)
# Entonces POLONIO sería vertical en col 2:
# P (row 0, col 2)
# O (row 1, col 2) <- O de SORBONA
# L (row 2, col 2)
# O (row 3, col 2)
# N (row 4, col 2)
# I (row 5, col 2)
# O (row 6, col 2)

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
        "clue": "Elemento químico nombrado en honor a Polonia",
        "answer": "POLONIO",
        "startRow": 0,
        "startCol": 2,
        "length": 7
    },
    {
        "id": "v2",
        "number": 5,
        "direction": "vertical",
        "clue": "Elemento químico radiactivo descubierto",
        "answer": "RADIO",
        "startRow": 4,
        "startCol": 0,
        "length": 5
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
print("CRUCIGRAMA FINAL - Layout Corregido")
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

print(f"\nTotal intersecciones: {len(intersections)}")
print(f"Total conflictos: {len(conflicts)}")

if len(conflicts) == 0 and len(intersections) >= 3:
    print("\n✅ PERFECTO: Crucigrama válido sin conflictos")

    # Generar JSON
    print("\n" + "=" * 75)
    print("JSON PARA SQL:")
    print("=" * 75)
    import json
    print(json.dumps(words, indent=2, ensure_ascii=False))
else:
    print(f"\n⚠️  Necesita ajustes: {len(conflicts)} conflictos")
