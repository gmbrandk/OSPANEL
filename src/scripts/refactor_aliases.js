// refactor-aliases.js
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src');
const ALIASES = {
  '@components': 'src/components',
  '@routes': 'src/routes',
  '@pages': 'src/pages',
  '@styles': 'src/styles',
  '@context': 'src/context',
  '@utils': 'src/utils',
  '@services': 'src/services',
  '@hooks': 'src/hooks',
  '@__mock__': 'src/__mock__',
  '@helpers': 'src/helpers',
  '@logic': 'src/logic',
  '@data': 'src/data',
  '@config': 'src/config',
  '@modules': 'src/modules',
};

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) walk(filepath, callback);
    else callback(filepath);
  });
}

function convert(filepath) {
  if (!filepath.endsWith('.js') && !filepath.endsWith('.jsx')) return;

  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  Object.entries(ALIASES).forEach(([alias, target]) => {
    const absoluteTarget = path.resolve(target);
    const relativePath = path.relative(path.dirname(filepath), absoluteTarget);

    const regex = new RegExp(
      `from ["']${relativePath.replace(/\\/g, '\\\\/')}([^"']*)["']`,
      'g'
    );

    content = content.replace(regex, (match, rest) => {
      return `from '${alias}${rest}'`;
    });
  });

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('👉 Actualizado:', filepath);
  }
}

walk(ROOT, convert);

console.log('\n✨ Migración completada. El titán ha caído.\n');
