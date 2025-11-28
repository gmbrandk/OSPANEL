import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

// === CONFIG ===

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC = path.join(PROJECT_ROOT, 'src');

const ALIASES = {
  '@components': 'src/components',
  '@routes': 'src/routes',
  '@pages': 'src/pages',
  '@styles': 'src/styles',
  '@context': 'src/context',
  '@utils': 'src/utils',
  '@services': 'src/service',
  '@hooks': 'src/hooks',
  '@__mock__': 'src/__mock__',
  '@helpers': 'src/helpers',
  '@logic': 'src/logic',
  '@data': 'src/data',
  '@config': 'src/config',
  '@modules': 'src/modules',
};

const ABS_ALIASES = Object.fromEntries(
  Object.entries(ALIASES).map(([alias, rel]) => [
    alias,
    path.resolve(PROJECT_ROOT, rel),
  ])
);

function matchAlias(filePath) {
  for (const [alias, absDir] of Object.entries(ABS_ALIASES)) {
    if (filePath.startsWith(absDir)) {
      const relativeInside = path.relative(absDir, filePath);
      return `${alias}/${relativeInside.replace(/\\/g, '/')}`;
    }
  }
  return null;
}

function processFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let modified = code;

  const importRegex = /import\s+[^'"]+['"](.+?)['"]/g;

  modified = modified.replace(importRegex, (full, importPath) => {
    if (importPath.startsWith('@')) return full;
    if (!importPath.startsWith('.')) return full;
    if (importPath.includes('node_modules')) return full;

    const absoluteImportedFile = path.resolve(
      path.dirname(filePath),
      importPath
    );

    const aliasImport = matchAlias(absoluteImportedFile);
    if (!aliasImport) return full;

    const possibleFiles = [
      absoluteImportedFile,
      absoluteImportedFile + '.js',
      absoluteImportedFile + '.jsx',
      absoluteImportedFile + '.ts',
      absoluteImportedFile + '.tsx',
    ];

    const exists = possibleFiles.some((f) => fs.existsSync(f));
    if (!exists) return full;

    return full.replace(importPath, aliasImport);
  });

  if (modified !== code) {
    fs.writeFileSync(filePath, modified, 'utf8');
    console.log('✔ Modificado:', path.relative(PROJECT_ROOT, filePath));
  }
}

console.log('⏳ Buscando archivos...');

// glob en ESM es SIEMPRE async
const files = await glob(`${SRC.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx}`);

console.log(`🔍 Archivos encontrados: ${files.length}`);

for (const file of files) {
  processFile(file);
}

console.log('\n✨ Migración completada.\n');
