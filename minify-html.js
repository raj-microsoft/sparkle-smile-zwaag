// Conservative HTML minifier: collapse whitespace between tags, drop HTML comments
// (but preserve <script>/<style>/IE conditionals/text content).
const fs = require('fs');
const file = 'C:/Users/dev/projects/dental-zwaag/public/index.html';
let html = fs.readFileSync(file, 'utf8');
const before = html.length;

// Extract <script>...</script>, <style>...</style>, <pre>, <textarea> verbatim
const placeholders = [];
function stash(tag) {
  const re = new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`, 'g');
  html = html.replace(re, m => {
    placeholders.push(m);
    return `__STASH_${placeholders.length - 1}__`;
  });
}
['script', 'style', 'pre', 'textarea'].forEach(stash);

// Drop HTML comments (but keep <!--[if ...]> conditionals)
html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');

// Collapse runs of whitespace between tags (>\\s+<) to single space, then trim
html = html.replace(/>\s+</g, '><');
html = html.replace(/\s{2,}/g, ' ');
html = html.replace(/^\s+|\s+$/gm, '');
html = html.trim();

// Restore stashed sections
html = html.replace(/__STASH_(\d+)__/g, (_, i) => placeholders[+i]);

fs.writeFileSync(file, html);
const after = html.length;
console.log(`HTML: ${(before/1024).toFixed(1)} KB -> ${(after/1024).toFixed(1)} KB (${Math.round((1-after/before)*100)}% smaller)`);
