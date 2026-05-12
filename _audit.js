const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/dev/projects/dental-zwaag/public/img';
const html = fs.statSync('C:/Users/dev/projects/dental-zwaag/public/index.html').size;
console.log(`index.html: ${(html/1024).toFixed(1)} KB`);
const files = fs.readdirSync(dir);
const grouped = {};
files.forEach(f => {
  const sz = fs.statSync(path.join(dir, f)).size;
  const ext = path.extname(f).slice(1) || 'other';
  grouped[ext] = (grouped[ext] || 0) + sz;
});
let total = html;
Object.entries(grouped).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => {
  console.log(`  ${k.padEnd(6)} ${(v/1024).toFixed(1)} KB`);
  total += v;
});
console.log(`TOTAL on disk: ${(total/1024).toFixed(1)} KB`);

// Per-image breakdown
console.log('\nPer-image (avif+webp combined):');
const bases = {};
files.filter(f => /\.(avif|webp)$/.test(f)).forEach(f => {
  const base = f.replace(/-\d+\.(avif|webp)$/, '').replace(/\.(avif|webp)$/, '');
  const sz = fs.statSync(path.join(dir, f)).size;
  bases[base] = (bases[base] || 0) + sz;
});
Object.entries(bases).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => {
  console.log(`  ${k.padEnd(22)} ${(v/1024).toFixed(1)} KB`);
});
