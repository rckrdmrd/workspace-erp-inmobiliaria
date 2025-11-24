#!/bin/bash

###############################################################################
# Fix TS2564: Property has no initializer and is not definitely assigned
#
# Adds definite assignment assertion (!) to properties that need it.
#
# Usage:
#   chmod +x fix-ts2564.sh
#   ./fix-ts2564.sh
###############################################################################

set -e

echo "========================================"
echo "Fixing TS2564 Errors"
echo "========================================"
echo ""

# Counter
FIXED_FILES=0

# Get list of files with TS2564 errors
FILES=$(npx tsc --noEmit 2>&1 | grep "error TS2564" | cut -d'(' -f1 | sort -u)

for file in $FILES; do
    if [ -f "$file" ]; then
        echo "Processing: $file"

        # Backup original file
        cp "$file" "$file.bak"

        # Fix pattern: Add ! to properties without ?, =, or !
        # Pattern matches: "  propertyName: Type;" where there's no ?, =, or ! before :
        sed -i -E 's/^(\s+)(@[A-Za-z]+.*\n\s+)*([a-zA-Z_][a-zA-Z0-9_]*):\s*([^?!=;]+);$/\1\2\3!: \4;/g' "$file"

        # Alternative simpler approach for multi-line decorators:
        # Just add ! before : if not already present and no ? or =
        perl -i -pe 's/^(\s+)([a-zA-Z_][a-zA-Z0-9_]+):\s*(?!.*[?!=])(.+);$/\1\2!: \3;/' "$file"

        FIXED_FILES=$((FIXED_FILES + 1))
    fi
done

echo ""
echo "========================================"
echo "Fix Complete"
echo "========================================"
echo "Files processed: $FIXED_FILES"
echo ""
echo "Running TypeScript compiler to verify..."
npx tsc --noEmit 2>&1 | grep -c "error TS2564" || echo "✓ All TS2564 errors fixed!"
echo ""
echo "Backup files created with .bak extension"
echo "To restore: find src -name '*.bak' -exec bash -c 'mv \"\$0\" \"\${0%.bak}\"' {} \\;"
