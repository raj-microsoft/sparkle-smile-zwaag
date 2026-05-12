// Self-host Fraunces + Manrope, latin + latin-ext only, weights actually used
const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = 'C:/Users/dev/projects/dental-zwaag/public/fonts';
fs.mkdirSync(outDir, { recursive: true });

// Build a Google Fonts CSS URL with realistic weights, then parse + download
const css1Url = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Manrope:wght@400..700&display=swap';

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(get(res.headers.location, headers));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  // Use a modern UA to get woff2
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
  const cssBuf = await get(css1Url, { 'User-Agent': UA });
  const css = cssBuf.toString('utf8');

  // Parse @font-face blocks
  const blocks = css.split(/@font-face/).slice(1);
  console.log('Total @font-face blocks:', blocks.length);

  let outCss = '/* Self-hosted Fraunces + Manrope, latin + latin-ext only */\n';
  let kept = 0, dropped = 0;
  let downloads = [];

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    // Identify subset by comment immediately before block; here block is the {...} content (we already split on @font-face, so we lost the preceding comment)
    // Use unicode-range as identifier instead
    const urMatch = b.match(/unicode-range:\s*([^;]+);/);
    const ur = urMatch ? urMatch[1] : '';
    // latin: U+0000-00FF ...
    // latin-ext: U+0100-02BA ...
    const isLatin = /U\+0000-00FF/.test(ur);
    const isLatinExt = /U\+0100-02BA/.test(ur);
    if (!isLatin && !isLatinExt) { dropped++; continue; }

    const family = (b.match(/font-family:\s*'([^']+)'/) || [])[1];
    const weight = (b.match(/font-weight:\s*([^;]+);/) || [])[1].trim();
    const style = (b.match(/font-style:\s*([^;]+);/) || [])[1].trim();
    const srcMatch = b.match(/url\((https:[^)]+)\)/);
    if (!family || !srcMatch) { dropped++; continue; }
    const url = srcMatch[1];
    const subset = isLatin ? 'latin' : 'latext';
    const styleSlug = style === 'italic' ? 'i' : '';
    // Weight may be a range "300 600" — turn into compact tag
    const weightSlug = weight.replace(/\s+/g, '-');
    const fname = `${family.toLowerCase()}-${weightSlug}${styleSlug}-${subset}.woff2`;
    const fpath = path.join(outDir, fname);

    downloads.push({ url, fpath, fname, family, weight, style, ur });
    kept++;
  }

  console.log(`Keeping ${kept}, dropping ${dropped}`);

  // Download all (parallel-ish, batched)
  const BATCH = 6;
  for (let i = 0; i < downloads.length; i += BATCH) {
    const batch = downloads.slice(i, i + BATCH);
    await Promise.all(batch.map(async d => {
      const buf = await get(d.url, { 'User-Agent': UA });
      fs.writeFileSync(d.fpath, buf);
      console.log(`  ${d.fname}: ${(buf.length/1024).toFixed(1)} KB`);
    }));
  }

  // Build CSS that points at relative paths under fonts/
  for (const d of downloads) {
    outCss += `@font-face{font-family:'${d.family}';font-style:${d.style};font-weight:${d.weight};font-display:swap;src:url('fonts/${d.fname}') format('woff2');unicode-range:${d.ur};}\n`;
  }

  fs.writeFileSync('C:/Users/dev/projects/dental-zwaag/public/fonts/fonts.css', outCss);

  const total = downloads.reduce((sum, d) => sum + fs.statSync(d.fpath).size, 0);
  console.log(`\nTotal fonts: ${(total/1024).toFixed(1)} KB across ${downloads.length} files`);
})().catch(e => { console.error(e); process.exit(1); });
