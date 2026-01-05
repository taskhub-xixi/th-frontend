#!/usr/bin/env node

/**
 * Color Migration Script for TaskHub
 * Replaces hardcoded Tailwind colors with CSS variables
 *
 * Usage: node color-migration.js
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Color mapping from hardcoded to CSS variables
const colorMap = {
  // Blue → primary/secondary
  'bg-blue-50': 'bg-secondary',
  'bg-blue-100': 'bg-secondary',
  'bg-blue-500': 'bg-primary',
  'bg-blue-600': 'bg-primary',
  'hover:bg-blue-100': 'hover:bg-secondary',
  'hover:bg-blue-700': 'hover:bg-primary',
  'text-blue-600': 'text-primary',
  'text-blue-700': 'text-primary',
  'text-blue-800': 'text-primary',
  'text-blue-900': 'text-primary',
  'border-blue-200': 'border-secondary',
  'border-blue-600': 'border-primary',

  // Red → destructive
  'bg-red-50': 'bg-destructive/10',
  'bg-red-100': 'bg-destructive/20',
  'hover:bg-red-100': 'hover:bg-destructive/20',
  'text-red-500': 'text-destructive',
  'text-red-600': 'text-destructive',
  'text-red-700': 'text-destructive',
  'border-red-200': 'border-destructive/30',
  'border-red-300': 'border-destructive/40',

  // Green → success
  'bg-green-50': 'bg-success/10',
  'bg-green-100': 'bg-success/20',
  'bg-green-600': 'bg-success',
  'hover:bg-green-100': 'hover:bg-success/20',
  'hover:bg-green-700': 'hover:bg-success',
  'text-green-500': 'text-success',
  'text-green-600': 'text-success',
  'text-green-700': 'text-success',
  'text-green-800': 'text-success',
  'border-green-200': 'border-success/30',

  // Yellow → warning
  'bg-yellow-100': 'bg-warning/20',
  'text-yellow-500': 'text-warning',
  'text-yellow-800': 'text-warning',

  // Gray → muted/foreground
  'bg-gray-50': 'bg-muted',
  'bg-gray-200': 'bg-muted',
  'bg-gray-300': 'bg-muted',
  'text-gray-300': 'text-muted-foreground',
  'text-gray-400': 'text-muted-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-600': 'text-muted-foreground',
  'text-gray-700': 'text-foreground/80',
  'text-gray-900': 'text-foreground',
  'border-gray-200': 'border-muted',
  'border-gray-300': 'border-muted',

  // Amber
  'bg-amber-100': 'bg-warning/20',
  'text-amber-800': 'text-warning',

  // Cyan (special case for API calls like 0ea5e9)
  'bg-cyan-400': 'bg-primary/50',
};

// Get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Replace colors in content
function replaceColors(content) {
  let modified = false;
  let result = content;

  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
    if (regex.test(result)) {
      result = result.replace(regex, newColor);
      modified = true;
    }
  }

  return { result, modified };
}

// Main execution
async function main() {
  console.log('🎨 Starting Color Migration...\n');

  const files = getAllFiles(srcDir);
  console.log(`Processing ${files.length} files...\n`);

  let totalModified = 0;
  const modifiedFiles = [];

  files.forEach((file) => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { result, modified } = replaceColors(content);

      if (modified) {
        fs.writeFileSync(file, result, 'utf8');
        totalModified++;
        modifiedFiles.push(file);
        console.log(`✅ Updated: ${file.replace(srcDir, '')}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary:');
  console.log(`   Total files scanned: ${files.length}`);
  console.log(`   Files modified: ${totalModified}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('⚠️  NEXT STEPS:\n');
  console.log('1. Add these CSS variables to globals.css\n');

  console.log('   In :root { ... } section:');
  console.log('   --success: oklch(0.7116 0.1812 142.4939);  /* Green */');
  console.log('   --success-foreground: oklch(1 0 0);');
  console.log('   --warning: oklch(0.8868 0.1822 95.3305);   /* Yellow/Orange */');
  console.log('   --warning-foreground: oklch(1 0 0);');
  console.log('');

  console.log('   In .dark { ... } section:');
  console.log('   --success: oklch(0.6243 0.2056 142.4939);  /* Green */');
  console.log('   --success-foreground: oklch(1 0 0);');
  console.log('   --warning: oklch(0.8868 0.1822 95.3305);   /* Yellow/Orange */');
  console.log('   --warning-foreground: oklch(1 0 0);');
  console.log('');

  console.log('2. Add to @theme section in globals.css:');
  console.log('   --color-success: var(--success);');
  console.log('   --color-success-foreground: var(--success-foreground);');
  console.log('   --color-warning: var(--warning);');
  console.log('   --color-warning-foreground: var(--warning-foreground);');
  console.log('');

  console.log('3. Run: npm run build');
  console.log('');

  console.log('✨ Color migration complete!\n');
}

main().catch(console.error);
