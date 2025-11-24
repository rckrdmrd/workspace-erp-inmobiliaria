#!/usr/bin/env python3
"""
Mapeo EXACTO letra por letra de la imagen "Distribución real.jpg"
"""

# Voy a mapear cada letra que VEO en el grid de la imagen
# contando desde la esquina superior izquierda

# Fila 0: solo veo una P
# Fila 1: S O R B O N A
# Fila 2: N O B E L
# Fila 3: (algunas letras verticales)
# Fila 4: R A D I O A C T I V I D A D

# También veo palabras VERTICALES debajo

print("Analizando imagen letra por letra...")
print("=" * 70)

# Voy a contar las columnas de SORBONA para ubicar el inicio
# En la imagen, SORBONA parece empezar después de algunas columnas vacías

# Layout visible:
# Col:  0 1 2 3 4 5 6 7 8 9 ...
# R0:       P
# R1:   S O R B O N A
# R2:   N O B E L

# Espera, esto no coincide. En la fila 1 veo S O R B O N A
# y en la fila 2 veo N O B E L

# Pero la N de NOBEL está debajo de alguna letra de SORBONA...
# Déjame ver: Si SORBONA es S-O-R-B-O-N-A
# Y NOBEL está debajo, entonces:
# - La N de NOBEL estaría debajo de... ¿qué letra?

# Mirando la imagen más cuidadosamente:
# Parece que SORBONA y NOBEL comparten letras verticalmente

# Voy a mapear asumiendo que hay intersecciones:

print("\nIntentando reconstruir el grid...")
print()

# Si hay palabras verticales, necesito identificarlas
# Veo claramente debajo de RADIOACTIVIDAD:
# - R (col 0)
# - A (col 0)
# - D (col 0)
# - I (col 0)
# - O (col 0)
# Esto es RADIO vertical

# También hay más letras verticales debajo de otras columnas de RADIOACTIVIDAD

# Mirando el panel de PISTAS en la imagen veo:
# Verticales:
# - ¿cuánta Marie? (probablemente CURIE)
# - Esposo de Marie (PIERRE)
# - Nombre de Marie (¿MARIA?)

# Horizontales:
# - ¿cuánta Marie? (SORBONA)
# - Premio Nobel (NOBEL)
# - Fenómeno descubierto (RADIOACTIVIDAD)

print("PISTAS VISIBLES EN LA IMAGEN:")
print("-" * 70)
print("Horizontales:")
print("  1. ¿cuánta Marie? → SORBONA")
print("  2. Premio Nobel → NOBEL")
print("  3. Fenómeno → RADIOACTIVIDAD")
print()
print("Verticales:")
print("  1. ¿cuánta Marie? → CURIE?")
print("  2. Esposo de Marie → PIERRE")
print("  3. Apellido de Marie → ¿?")
print()

# Voy a intentar un diseño donde:
# - SORBONA, NOBEL, RADIOACTIVIDAD estén horizontales
# - RADIO, CURIE, PIERRE estén verticales

# Grid propuesto:
grid_lines = [
    "       P              ",  # 0
    "   S O R B O N A      ",  # 1
    "   N O B E L          ",  # 2
    "       R              ",  # 3
    " R A D I O A C T I V I D A D",  # 4
    " A     I              ",  # 5
    " D     E              ",  # 6
    " I     R              ",  # 7
    " O     R              ",  # 8
    "       E              ",  # 9
]

print("GRID RECONSTRUIDO (hipotético):")
print("=" * 70)
for i, line in enumerate(grid_lines):
    print(f"{i}: {line}")

print()
print("Si esto es correcto, las palabras verticales serían:")
print("  - RADIO (col 0, rows 4-8)")
print("  - PIERRE (col 6, rows 0-9) <- la P arriba + IERRE abajo")
print("  - CURIE? (necesito verificar)")

print()
print("⚠️  NECESITO CONFIRMAR:")
print("    ¿Hay más palabras verticales que RADIO?")
print("    ¿CURIE está vertical?")
print("    ¿PIERRE completo está vertical?")
