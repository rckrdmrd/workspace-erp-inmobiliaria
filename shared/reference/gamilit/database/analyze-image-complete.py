#!/usr/bin/env python3
"""
Análisis COMPLETO de la imagen "Distribución real.jpg"
Mirando letra por letra
"""

# Basándome en la imagen, veo claramente:
# Grid con palabras colocadas

# Voy a mapear letra por letra lo que VEO en la imagen:

# Empezando desde arriba:
# Fila 0, col 2: P
# Fila 1: S O R B O N A (empieza en col 1)
# Fila 2: N O B E L (empieza en col 2)
# Fila 4: R A D I O A C T I V I D A D (empieza en col 1)

# Columna 0 (vertical):
# Fila 4: R
# Fila 5: A
# Fila 6: D
# Fila 7: I
# Fila 8: O
# Esto es RADIO

# Ahora necesito ver si hay más palabras verticales
# La P en (0,2) podría ser inicio de PIERRE o POLONIO

# Mirando columna 2 desde fila 0:
# (0,2) = P
# (1,2) = O (de SORBONA)
# (2,2) = O (parece N de NOBEL... espera)

# Déjame reconstruir letra por letra más cuidadosamente

print("=" * 70)
print("ANÁLISIS DETALLADO DE LA IMAGEN")
print("=" * 70)

# Lo que veo CLARAMENTE en el grid:
visible_letters = [
    (0, 2, 'P'),
    (1, 1, 'S'),
    (1, 2, 'O'),
    (1, 3, 'R'),
    (1, 4, 'B'),
    (1, 5, 'O'),
    (1, 6, 'N'),
    (1, 7, 'A'),
    (2, 2, 'N'),
    (2, 3, 'O'),
    (2, 4, 'B'),
    (2, 5, 'E'),
    (2, 6, 'L'),
    (3, 2, 'O'),  # Posible letra vertical
    (4, 0, 'R'),
    (4, 1, 'R'),
    (4, 2, 'A'),
    (4, 3, 'D'),
    (4, 4, 'I'),
    (4, 5, 'O'),
    (4, 6, 'A'),
    (4, 7, 'C'),
    (4, 8, 'T'),
    (4, 9, 'I'),
    (4, 10, 'V'),
    (4, 11, 'I'),
    (4, 12, 'D'),
    (4, 13, 'A'),
    (4, 14, 'D'),
    (5, 0, 'A'),
    (6, 0, 'D'),
    (7, 0, 'I'),
    (8, 0, 'O'),
]

# Crear grid
grid = [[' ' for _ in range(16)] for _ in range(10)]
for row, col, letter in visible_letters:
    grid[row][col] = letter

# Mostrar grid
print("\nGRID RECONSTRUIDO:")
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

# Identificar palabras
print("\n" + "=" * 70)
print("PALABRAS IDENTIFICADAS:")
print("=" * 70)

words = []

# SORBONA horizontal (fila 1, cols 1-7)
words.append({
    "id": "h1",
    "answer": "SORBONA",
    "startRow": 1,
    "startCol": 1,
    "direction": "horizontal",
    "clue": "Universidad donde estudió"
})

# NOBEL horizontal (fila 2, cols 2-6)
words.append({
    "id": "h2",
    "answer": "NOBEL",
    "startRow": 2,
    "startCol": 2,
    "direction": "horizontal",
    "clue": "Premio recibido en 1903 y 1911"
})

# RADIOACTIVIDAD horizontal (fila 4, cols 1-14)
words.append({
    "id": "h3",
    "answer": "RADIOACTIVIDAD",
    "startRow": 4,
    "startCol": 1,
    "direction": "horizontal",
    "clue": "Fenómeno de emisión espontánea de radiación descubierto por Marie"
})

# RADIO vertical (col 0, filas 4-8)
words.append({
    "id": "v1",
    "answer": "RADIO",
    "startRow": 4,
    "startCol": 0,
    "direction": "vertical",
    "clue": "Segundo elemento descubierto"
})

# POLONIO vertical? (col 2, filas 0-6)
# P-O-N-O-A... no, no es POLONIO
# Mirando columna 2: P(0) O(1) N(2) O(3) A(4)
# Eso no forma POLONIO ni PIERRE

# Pero si miro col 2:
# (0,2) = P
# (1,2) = O (de SORBONA)
# (2,2) = N (de NOBEL? no, NOBEL empieza en col 2, primera letra es N)
# Espera, si NOBEL está en (2,2) entonces:
# (2,2) = N, (2,3) = O, (2,4) = B, (2,5) = E, (2,6) = L

# Entonces columna 2 vertical:
# (0,2) = P
# (1,2) = O (de SORBONA)
# (2,2) = N (de NOBEL)
# (3,2) = O?
# (4,2) = A (de RADIOACTIVIDAD)

# P-O-N-O-A... tampoco es una palabra

# A menos que sea PIERRE vertical en otra columna...
# O POLONIO vertical en otra posición

print("\nHorizontales:")
for w in words:
    if w['direction'] == 'horizontal':
        print(f"  {w['answer']} - {w['clue']}")

print("\nVerticales:")
for w in words:
    if w['direction'] == 'vertical':
        print(f"  {w['answer']} - {w['clue']}")

print("\n" + "=" * 70)
print("PISTAS VISIBLES EN LA IMAGEN:")
print("=" * 70)
print("Horizontales:")
print("  1. ¿cuánta Marie? → probablemente SORBONA")
print("  2. Premio recibido en 1903 y 1911 → NOBEL")
print("  3. Fenómeno... → RADIOACTIVIDAD")
print("\nVerticales:")
print("  1. País natal de Marie → POLONIA (¿dónde está?)")
print("  2. Esposo de Marie → PIERRE (¿dónde está?)")
print("  3. ¿cuánta Marie? → ?")

print("\n⚠️  NECESITO ver la imagen más grande o más clara para")
print("    identificar POLONIA y PIERRE/POLONIO verticales")
