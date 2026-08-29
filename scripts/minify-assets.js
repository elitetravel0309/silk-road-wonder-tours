import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');

// Simple minification for CSS
const cssFile = join(distDir, 'css', 'style.css');
if (existsSync(cssFile)) {
  const original = readFileSync(cssFile, 'utf8');
  let css = original;
  // Remove comments
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // Collapse whitespace (but preserve content)
  css = css.replace(/\s+/g, ' ');
  // Remove space before/after special chars
  css = css.replace(/\s*([{}:;,>~+])\s*/g, '$1');
  // Remove last semicolon before closing brace
  css = css.replace(/;}/g, '}');
  css = css.trim();
  writeFileSync(cssFile, css);
  console.log(`CSS: ${original.length} -> ${css.length} bytes (-${((1 - css.length / original.length) * 100).toFixed(0)}%)`);
}

// Simple minification for JS (conservative - only remove comments and extra newlines)
const jsFiles = ['js/main.js', 'js/similar-tours.js', 'js/tour-faq.js'];
for (const jsPath of jsFiles) {
  const jsFile = join(distDir, jsPath);
  if (existsSync(jsFile)) {
    const original = readFileSync(jsFile, 'utf8');
    let js = original;
    // Remove single-line comments (but NOT URLs - only lines starting with // or whitespace+//)
    js = js.replace(/^\s*\/\/.*$/gm, '');
    // Remove multi-line comments
    js = js.replace(/\/\*[\s\S]*?\*\//g, '');
    // Collapse multiple newlines
    js = js.replace(/\n\s*\n/g, '\n');
    js = js.trim();
    writeFileSync(jsFile, js);
    console.log(`JS (${jsPath}): ${original.length} -> ${js.length} bytes`);
  }
}

console.log('[minify] Done.');
