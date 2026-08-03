import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, relative } from 'path';

const distDir = join(process.cwd(), 'dist');

// Simple minification for CSS
const cssFile = join(distDir, 'css', 'style.css');
if (existsSync(cssFile)) {
  let css = readFileSync(cssFile, 'utf8');
  css = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
  const orig = readFileSync(cssFile, 'utf8');
  writeFileSync(cssFile, css);
  console.log(`CSS: ${orig.length} -> ${css.length} bytes (-${((1 - css.length / orig.length) * 100).toFixed(0)}%)`);
}

// Simple minification for JS
const jsFile = join(distDir, 'js', 'main.js');
if (existsSync(jsFile)) {
  let js = readFileSync(jsFile, 'utf8');
  js = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '').replace(/\n\s*\n/g, '\n').trim();
  writeFileSync(jsFile, js);
  const orig = readFileSync(jsFile, 'utf8');
  console.log(`JS: using basic minification`);
}

console.log('[minify] Done.');
