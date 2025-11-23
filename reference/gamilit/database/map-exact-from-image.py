#!/usr/bin/env python3
"""
Mapeo EXACTO del crucigrama desde la imagen
6 palabras: SORBONA, NOBEL, RADIOACTIVIDAD, POLONIO, RADIO, CURIE
"""

# Mirando la imagen letra por letra:
# Veo:
# - P (sola arriba)
# - SORBONA (horizontal)
# - NOBEL (horizontal)
# - RADIOACTIVIDAD (horizontal)
# - RADIO (vertical, lado izquierdo)

# La P de arriba debe ser el inicio de POLONIO vertical
# Debajo de RADIOACTIVIDAD hay letras verticales que forman CURIE

# Voy a contar las posiciones exactas:

# Fila 0: P en alguna columna
# Fila 1: SORBONA horizontal
# Fila 2: NOBEL horizontal
# Fila 4: RADIOACTIVIDAD horizontal
# Columna 0: RADIO vertical

# Analizando la columna donde está la P:
# Si SORBONA es S-O-R-B-O-N-A
# Y veo que debajo está NOBEL con N-O-B-E-L
# La N de NOBEL estaría alineada con alguna letra de SORBONA

# Voy a intentar reconstruir:
# Si NOBEL empieza en col 1 como la N, entonces:
# NOBEL = cols 1,2,3,4,5

# Y SORBONA si está arriba...
# SORBONA podría empezar en col 0 o col 1

# Mirando más cuidadosamente la imagen:
# Parece que hay una P arriba de alguna letra

# Voy a intentar este layout:

words = [
    {
        "id": "h1",
        "number": 1,
        "direction": "horizontal",
        "clue": "Universidad donde estudió",
        "answer": "SORBONA",
        "startRow": 1,
        "startCol": 0,
        "length": 7
    },
    {
        "id": "h2",
        "number": 2,
        "direction": "horizontal",
        "clue": "Premio recibido en 1903 y 1911",
        "answer": "NOBEL",
        "startRow": 2,
        "startCol": 0,
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
    {
        "id": "v1",
        "number": 4,
        "direction": "vertical",
        "clue": "Elemento químico nombrado en honor a Polonia",
        "answer": "POLONIO",
        "startRow": 0,
        "startCol": 0,
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
print("CRUCIGRAMA - Intento 1")
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
print("VALIDACIÓN:")
print("=" * 75)

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
                    if pos1[2] != pos2[2]:
                        conflicts.append(f"{word1['id']} ∩ {word2['id']} en ({pos1[0]},{pos1[1]}): {pos1[2]} ≠ {pos2[2]}")

if conflicts:
    print("❌ CONFLICTOS ENCONTRADOS:")
    for c in conflicts:
        print(f"  - {c}")
    print("\nPROBLEMA: POLONIO y RADIO comparten columna 0")
    print("          Esto es imposible - no pueden estar en la misma columna")
else:
    print("✅ Sin conflictos")
