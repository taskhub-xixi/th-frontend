#!/bin/bash

# Color Migration Script for TaskHub
# This script replaces hardcoded Tailwind colors with CSS variables
# Usage: bash color-migration-script.sh

set -e

echo "🎨 Starting Color Migration..."
echo ""

# Define color mappings
declare -A COLOR_MAP=(
    # Blue → primary
    ["bg-blue-50"]="bg-secondary"
    ["bg-blue-100"]="bg-secondary"
    ["bg-blue-500"]="bg-primary"
    ["bg-blue-600"]="bg-primary"
    ["hover:bg-blue-100"]="hover:bg-secondary"
    ["hover:bg-blue-700"]="hover:bg-primary"
    ["text-blue-600"]="text-primary"
    ["text-blue-700"]="text-primary"
    ["text-blue-800"]="text-primary"
    ["text-blue-900"]="text-primary"
    ["border-blue-200"]="border-secondary"
    ["border-blue-600"]="border-primary"

    # Red → destructive
    ["bg-red-50"]="bg-destructive/10"
    ["bg-red-100"]="bg-destructive/20"
    ["hover:bg-red-100"]="hover:bg-destructive/20"
    ["text-red-500"]="text-destructive"
    ["text-red-600"]="text-destructive"
    ["text-red-700"]="text-destructive"
    ["border-red-200"]="border-destructive/30"
    ["border-red-300"]="border-destructive/40"

    # Green → success (using accent temporarily, or create new)
    ["bg-green-50"]="bg-success/10"
    ["bg-green-100"]="bg-success/20"
    ["bg-green-600"]="bg-success"
    ["hover:bg-green-100"]="hover:bg-success/20"
    ["hover:bg-green-700"]="hover:bg-success"
    ["text-green-500"]="text-success"
    ["text-green-600"]="text-success"
    ["text-green-700"]="text-success"
    ["text-green-800"]="text-success"
    ["border-green-200"]="border-success/30"

    # Yellow → warning
    ["bg-yellow-100"]="bg-warning/20"
    ["text-yellow-500"]="text-warning"
    ["text-yellow-800"]="text-warning"

    # Gray → muted
    ["bg-gray-50"]="bg-muted"
    ["bg-gray-200"]="bg-muted"
    ["bg-gray-300"]="bg-muted"
    ["text-gray-300"]="text-muted-foreground"
    ["text-gray-400"]="text-muted-foreground"
    ["text-gray-500"]="text-muted-foreground"
    ["text-gray-600"]="text-muted-foreground"
    ["text-gray-700"]="text-foreground/80"
    ["text-gray-900"]="text-foreground"
    ["border-gray-200"]="border-muted"
    ["border-gray-300"]="border-muted"

    # Amber
    ["bg-amber-100"]="bg-warning/20"
    ["text-amber-800"]="text-warning"
)

# Get list of JSX files
FILES=$(find /home/saken/Documents/frontend_stuff/project/taskhub/th-frontend/src -type f -name "*.jsx" | grep -v node_modules)

TOTAL_FILES=0
MODIFIED_FILES=0

echo "Processing $(echo "$FILES" | wc -l) files..."
echo ""

# Replace colors
for file in $FILES; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    HAS_CHANGES=0

    for OLD_COLOR in "${!COLOR_MAP[@]}"; do
        NEW_COLOR="${COLOR_MAP[$OLD_COLOR]}"

        # Check if file contains the old color
        if grep -q "$OLD_COLOR" "$file"; then
            # Replace it
            sed -i "s/$OLD_COLOR/$NEW_COLOR/g" "$file"
            HAS_CHANGES=1
        fi
    done

    if [ $HAS_CHANGES -eq 1 ]; then
        MODIFIED_FILES=$((MODIFIED_FILES + 1))
        echo "✅ Updated: $file"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary:"
echo "   Total files scanned: $TOTAL_FILES"
echo "   Files modified: $MODIFIED_FILES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "⚠️  NEXT STEPS:"
echo "1. Add these CSS variables to globals.css:"
echo ""
echo "   :root {"
echo "     --success: oklch(0.7116 0.1812 142.4939);  /* Green */"
echo "     --success-foreground: oklch(1 0 0);"
echo "     --warning: oklch(0.8868 0.1822 95.3305);   /* Yellow/Orange */"
echo "     --warning-foreground: oklch(1 0 0);"
echo "   }"
echo ""
echo "   .dark {"
echo "     --success: oklch(0.6243 0.2056 142.4939);  /* Green */"
echo "     --success-foreground: oklch(1 0 0);"
echo "     --warning: oklch(0.8868 0.1822 95.3305);   /* Yellow/Orange */"
echo "     --warning-foreground: oklch(1 0 0);"
echo "   }"
echo ""
echo "2. Add to @theme in globals.css:"
echo "   --color-success: var(--success);"
echo "   --color-success-foreground: var(--success-foreground);"
echo "   --color-warning: var(--warning);"
echo "   --color-warning-foreground: var(--warning-foreground);"
echo ""
echo "3. Run: npm run build (to check for errors)"
echo ""

echo "✨ Color migration complete!"
