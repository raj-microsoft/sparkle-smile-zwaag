// Build variants of the landing page with different hero treatments.
// Each variant is a full HTML file at public/variants/<name>/index.html
// using <base href> to resolve assets back to repo root.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const PUBLIC = path.join(ROOT, 'public');
const SRC = path.join(PUBLIC, 'index.html');
const VAR_DIR = path.join(PUBLIC, 'variants');

const html = fs.readFileSync(SRC, 'utf8');

// ---- 1. Find the hero CSS block ----
// Marker comment is "/* HERO — overlay layout" through the next "/* TRUST STRIP" marker
const heroCssStart = html.indexOf('/* HERO');
const heroCssEnd = html.indexOf('/* TRUST STRIP', heroCssStart);
if (heroCssStart < 0 || heroCssEnd < 0) throw new Error('hero CSS block not found');
const heroCss = html.slice(heroCssStart, heroCssEnd);

// ---- 2. Find the hero markup block ----
const heroHtmlStart = html.indexOf('<!-- HERO -->');
const heroHtmlEnd = html.indexOf('<!-- TRUST STRIP', heroHtmlStart);
if (heroHtmlStart < 0 || heroHtmlEnd < 0) throw new Error('hero HTML block not found');
const heroHtml = html.slice(heroHtmlStart, heroHtmlEnd);

// ---- helper: write a variant ----
function writeVariant(name, label, newHeroCss, newHeroHtml) {
  const dir = path.join(VAR_DIR, name);
  fs.mkdirSync(dir, { recursive: true });

  let out = html.replace(heroCss, newHeroCss).replace(heroHtml, newHeroHtml);

  // Inject <base href> so img/, fonts/, etc. resolve to repo root.
  // GH Pages serves the repo at /sparkle-smile-zwaag/, so base = '../../'
  out = out.replace(
    /<head>/,
    `<head>\n  <base href="../../">\n  <meta name="x-variant" content="${name}">`
  );

  // Add a small floating "Variant: X" badge so we can tell them apart on the live site.
  const badge = `
  <div style="position:fixed;left:16px;bottom:16px;z-index:9999;background:rgba(15,26,21,.92);color:#f5f1e8;padding:8px 14px 8px 12px;border-radius:999px;font:600 11px/1 -apple-system,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(8px);box-shadow:0 12px 32px -10px rgba(0,0,0,.4);display:flex;align-items:center;gap:8px;text-decoration:none">
    <span style="width:6px;height:6px;border-radius:50%;background:#9bb39a;display:inline-block"></span>
    <a href="../../variants/" style="color:inherit;text-decoration:none">Variant ${label} \u2192 see all</a>
  </div>`;
  out = out.replace('</body>', `${badge}\n</body>`);

  fs.writeFileSync(path.join(dir, 'index.html'), out, 'utf8');
  console.log(`-> variants/${name}/index.html (${out.length} bytes)`);
}

// =====================================================================
// Variant V0 — original side-by-side (text left, image right card)
// =====================================================================
const V0_CSS = `/* HERO \u2014 V0 side-by-side */
  .hero{position:relative;padding-top:32px;padding-bottom:64px;overflow:hidden}
  .hero-grid{display:grid;grid-template-columns:1fr;gap:32px;align-items:end}
  .hero-img-wrap{order:0}
  @media(min-width:980px){
    .hero{padding-top:48px;padding-bottom:80px}
    .hero-grid{grid-template-columns:1fr 1.08fr;gap:72px;align-items:start}
    .hero-text{padding-top:8px}
  }
  .hero h1{font-size:clamp(3rem,11vw,6.6rem);margin:18px 0 0;font-family:var(--serif);font-weight:300;line-height:.95;letter-spacing:-.025em;color:var(--ink)}
  .hero h1 em{font-style:italic;color:var(--sage-deep);font-weight:300}
  .hero-lede{margin-top:24px;max-width:500px;font-size:1.02rem;line-height:1.65;color:var(--ink-2)}
  @media(min-width:600px){.hero-lede{font-size:1.08rem;line-height:1.7;margin-top:32px}}
  .hero-cta{margin-top:28px;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
  .hero-cta .btn{flex:1 1 auto;min-width:0;justify-content:center}
  @media(min-width:600px){.hero-cta{margin-top:36px}.hero-cta .btn{flex:0 0 auto;justify-content:flex-start}}
  .hero-meta{margin-top:36px;display:flex;flex-wrap:wrap;gap:18px 24px;align-items:center;font-size:.82rem;color:var(--muted);font-weight:500}
  @media(min-width:600px){.hero-meta{margin-top:48px;gap:32px;font-size:.85rem}}
  .hero-meta .dot{width:6px;height:6px;border-radius:50%;background:var(--sage);display:inline-block;margin-right:10px;vertical-align:middle}
  .hero-img-wrap{position:relative;aspect-ratio:4/5;border-radius:14px;overflow:hidden;background:#ddd;box-shadow:var(--shadow)}
  @media(max-width:600px){.hero-img-wrap{aspect-ratio:5/6;border-radius:10px;margin:0 -8px}}
  .hero-img-wrap img{width:100%;height:100%;object-fit:cover;transform:scale(1.05);transition:transform 8s ease-out}
  .hero-img-wrap.in img{transform:scale(1)}
  .hero-badge{position:absolute;left:12px;bottom:14px;background:var(--cream);padding:11px 14px;border-radius:12px;display:flex;align-items:center;gap:11px;font-size:.82rem;box-shadow:var(--shadow);max-width:260px}
  @media(min-width:600px){.hero-badge{left:-12px;bottom:24px;padding:14px 18px;border-radius:14px;gap:14px;font-size:.88rem;max-width:280px}}
  .hero-badge .av{width:36px;height:36px;border-radius:50%;background:var(--sage);overflow:hidden;flex:none}
  @media(min-width:600px){.hero-badge .av{width:42px;height:42px}}
  .hero-badge .av img{width:100%;height:100%;object-fit:cover}
  .hero-badge .label{color:var(--muted);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
  @media(min-width:600px){.hero-badge .label{font-size:.7rem}}
  .hero-badge strong{display:block;font-family:var(--serif);font-weight:500;font-size:.95rem;margin-top:1px}
  @media(min-width:600px){.hero-badge strong{font-size:1rem;margin-top:2px}}

  `;

const V0_HTML = `<!-- HERO -->
<section class="hero">
  <div class="container hero-grid">
    <div class="reveal in hero-text">
      <span class="eyebrow" data-i18n="hero_eyebrow">Tandarts in Zwaag \u00b7 3Shape TRIOS \u00b7 Sinds 2018</span>
      <h1 class="display"><span data-i18n="hero_h1_a">Een</span><br><span data-i18n="hero_h1_a2">glimlach</span><br><em data-i18n="hero_h1_b">die straalt.</em></h1>
      <p class="hero-lede" data-i18n="hero_lede">Implantaten, klikgebit, facings en esthetische tandheelkunde \u2014 verzorgd in een warme, gastvrije omgeving. Ook voor angstige pati\u00ebnten. Wij spreken Nederlands, Engels, Spaans en Papiaments.</p>
      <div class="hero-cta">
        <a href="#book" class="btn btn-primary"><span data-i18n="cta_book_long">Plan uw afspraak</span> <span class="arr">\u2192</span></a>
        <a href="tel:0229756979" class="btn btn-ghost">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
          0229 756 979
        </a>
      </div>
      <div class="hero-meta">
        <span data-i18n="hero_meta_1"><i class="dot"></i>Nieuwe pati\u00ebnten welkom</span>
        <span data-i18n="hero_meta_2"><i class="dot"></i>Spoed dezelfde dag</span>
        <span data-i18n="hero_meta_3"><i class="dot"></i>4 talen aan de stoel</span>
      </div>
    </div>
    <div class="hero-img-wrap reveal d2 in">
      <picture><source type="image/avif" srcset="img/hero-800.avif 800w, img/hero-1400.avif 1400w" sizes="(max-width: 980px) 92vw, 540px"><source type="image/webp" srcset="img/hero-800.webp 800w, img/hero-1400.webp 1400w" sizes="(max-width: 980px) 92vw, 540px"><img src="img/hero-1400.webp" alt="Sparkle Smile Dental Clinic in Zwaag" fetchpriority="high"></picture>
      <div class="hero-badge">
        <div class="av"><picture><source type="image/avif" srcset="img/dentist-400.avif 400w, img/dentist-800.avif 800w" sizes="42px"><source type="image/webp" srcset="img/dentist-400.webp 400w, img/dentist-800.webp 800w" sizes="42px"><img src="img/dentist-800.webp" alt=""></picture></div>
        <div>
          <span class="label" data-i18n="hero_badge_label">Hoofdtandarts</span>
          <strong>Dr. Eline van der Berg</strong>
        </div>
      </div>
    </div>
  </div>
</section>

`;

writeVariant('v0-side', '00 \u00b7 Side-by-side', V0_CSS, V0_HTML);

// =====================================================================
// Variant V2 \u2014 SPLIT FRAME (image card + sage editorial sidebar)
// =====================================================================
const V2_CSS = `/* HERO \u2014 V2 split frame */
  .hero{position:relative;padding:0;overflow:hidden;background:var(--ink)}
  .hero-frame{display:grid;grid-template-columns:1fr;min-height:560px}
  @media(min-width:980px){.hero-frame{grid-template-columns:46% 1fr;min-height:min(86vh,760px)}}
  .hero-side{background:var(--ink);color:var(--cream);padding:56px 28px;display:flex;flex-direction:column;justify-content:center;position:relative;order:1}
  @media(min-width:980px){.hero-side{padding:72px 64px;order:1}}
  @media(min-width:1280px){.hero-side{padding:96px 88px}}
  .hero-side::before{content:"";position:absolute;left:24px;top:24px;right:24px;bottom:24px;border:1px solid rgba(155,179,154,.22);pointer-events:none;border-radius:2px}
  @media(min-width:980px){.hero-side::before{left:32px;top:32px;right:0;bottom:32px;border-right:none}}
  .hero-side .eyebrow{color:var(--sage)}
  .hero-side h1{font-family:var(--serif);font-weight:300;font-size:clamp(2.6rem,8vw,5.2rem);margin:18px 0 0;line-height:.96;letter-spacing:-.025em;color:var(--cream);position:relative;z-index:1}
  .hero-side h1 em{font-style:italic;color:#cfdfca;font-weight:300}
  .hero-side .hero-lede{margin-top:22px;max-width:440px;font-size:1rem;line-height:1.7;color:rgba(245,241,232,.82);position:relative;z-index:1}
  .hero-side .hero-cta{margin-top:30px;display:flex;flex-wrap:wrap;gap:12px;position:relative;z-index:1}
  .hero-side .hero-cta .btn{flex:1 1 auto;min-width:0;justify-content:center}
  @media(min-width:600px){.hero-side .hero-cta .btn{flex:0 0 auto;justify-content:flex-start}}
  .hero-side .btn-primary{background:var(--sage);color:var(--ink);border-color:var(--sage)}
  .hero-side .btn-primary:hover{background:#b1c5b0;border-color:#b1c5b0}
  .hero-side .btn-ghost{background:transparent;color:var(--cream);border-color:rgba(245,241,232,.4)}
  .hero-side .btn-ghost:hover{background:var(--cream);color:var(--ink);border-color:var(--cream)}
  .hero-side .hero-meta{margin-top:32px;display:flex;flex-wrap:wrap;gap:14px 24px;font-size:.78rem;color:rgba(245,241,232,.72);font-weight:500;position:relative;z-index:1}
  .hero-side .hero-meta .dot{width:5px;height:5px;border-radius:50%;background:var(--sage);display:inline-block;margin-right:9px;vertical-align:middle}
  .hero-img-pane{position:relative;order:2;background:#1a2520;overflow:hidden;min-height:340px}
  @media(min-width:980px){.hero-img-pane{order:2;min-height:0}}
  .hero-img-pane>picture,.hero-img-pane>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.04);transition:transform 12s cubic-bezier(.2,.7,.2,1)}
  .hero-img-pane>picture img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.04);transition:transform 12s cubic-bezier(.2,.7,.2,1)}
  .hero-img-pane.in>picture img,.hero-img-pane.in>img{transform:scale(1)}
  .hero-img-pane::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(15,26,21,.5) 0%,rgba(15,26,21,0) 30%);pointer-events:none}
  @media(min-width:980px){.hero-img-pane::after{background:linear-gradient(90deg,rgba(15,26,21,.4) 0%,rgba(15,26,21,0) 18%)}}
  .hero-badge{position:absolute;z-index:3;bottom:18px;right:14px;background:var(--cream);padding:11px 14px;border-radius:12px;display:flex;align-items:center;gap:11px;font-size:.82rem;box-shadow:0 18px 40px -12px rgba(0,0,0,.45);max-width:260px;color:var(--ink)}
  @media(min-width:980px){.hero-badge{bottom:32px;right:32px;padding:14px 18px;border-radius:14px;gap:14px;font-size:.88rem;max-width:280px}}
  .hero-badge .av{width:42px;height:42px;border-radius:50%;background:var(--sage);overflow:hidden;flex:none}
  .hero-badge .av img{width:100%;height:100%;object-fit:cover}
  .hero-badge .label{color:var(--muted);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
  .hero-badge strong{display:block;font-family:var(--serif);font-weight:500;font-size:1rem;margin-top:2px;color:var(--ink)}

  `;

const V2_HTML = `<!-- HERO -->
<section class="hero">
  <div class="hero-frame">
    <div class="hero-side reveal in">
      <span class="eyebrow" data-i18n="hero_eyebrow">Tandarts in Zwaag \u00b7 3Shape TRIOS \u00b7 Sinds 2018</span>
      <h1 class="display"><span data-i18n="hero_h1_a">Een</span><br><span data-i18n="hero_h1_a2">glimlach</span><br><em data-i18n="hero_h1_b">die straalt.</em></h1>
      <p class="hero-lede" data-i18n="hero_lede">Implantaten, klikgebit, facings en esthetische tandheelkunde \u2014 verzorgd in een warme, gastvrije omgeving. Ook voor angstige pati\u00ebnten. Wij spreken Nederlands, Engels, Spaans en Papiaments.</p>
      <div class="hero-cta">
        <a href="#book" class="btn btn-primary"><span data-i18n="cta_book_long">Plan uw afspraak</span> <span class="arr">\u2192</span></a>
        <a href="tel:0229756979" class="btn btn-ghost">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
          0229 756 979
        </a>
      </div>
      <div class="hero-meta">
        <span data-i18n="hero_meta_1"><i class="dot"></i>Nieuwe pati\u00ebnten welkom</span>
        <span data-i18n="hero_meta_2"><i class="dot"></i>Spoed dezelfde dag</span>
        <span data-i18n="hero_meta_3"><i class="dot"></i>4 talen aan de stoel</span>
      </div>
    </div>
    <div class="hero-img-pane reveal in">
      <picture><source type="image/avif" srcset="img/hero-800.avif 800w, img/hero-1400.avif 1400w" sizes="(max-width: 980px) 100vw, 60vw"><source type="image/webp" srcset="img/hero-800.webp 800w, img/hero-1400.webp 1400w" sizes="(max-width: 980px) 100vw, 60vw"><img src="img/hero-1400.webp" alt="Sparkle Smile Dental Clinic in Zwaag" fetchpriority="high"></picture>
      <div class="hero-badge">
        <div class="av"><picture><source type="image/avif" srcset="img/dentist-400.avif 400w, img/dentist-800.avif 800w" sizes="42px"><source type="image/webp" srcset="img/dentist-400.webp 400w, img/dentist-800.webp 800w" sizes="42px"><img src="img/dentist-800.webp" alt=""></picture></div>
        <div>
          <span class="label" data-i18n="hero_badge_label">Hoofdtandarts</span>
          <strong>Dr. Eline van der Berg</strong>
        </div>
      </div>
    </div>
  </div>
</section>

`;

writeVariant('v2-split', '02 \u00b7 Split frame', V2_CSS, V2_HTML);

// =====================================================================
// Variant V3 \u2014 CENTERED COVER (image inset under giant centered headline)
// =====================================================================
const V3_CSS = `/* HERO \u2014 V3 centered cover */
  .hero{position:relative;padding:0;overflow:hidden;background:var(--cream)}
  .hero-cover{padding:48px 0 0;text-align:center;position:relative}
  @media(min-width:980px){.hero-cover{padding:72px 0 0}}
  .hero-cover .eyebrow{justify-content:center;display:inline-flex}
  .hero-cover h1{font-family:var(--serif);font-weight:300;font-size:clamp(3.4rem,13vw,8.4rem);margin:24px 0 0;line-height:.92;letter-spacing:-.03em;color:var(--ink)}
  @media(min-width:980px){.hero-cover h1{font-size:clamp(5rem,11vw,9.4rem);margin-top:30px}}
  .hero-cover h1 em{font-style:italic;color:var(--sage-deep);font-weight:300;display:block}
  .hero-cover .hero-lede{margin:24px auto 0;max-width:560px;font-size:1.02rem;line-height:1.7;color:var(--ink-2);padding:0 20px}
  @media(min-width:600px){.hero-cover .hero-lede{font-size:1.08rem;margin-top:30px}}
  .hero-cover .hero-cta{margin-top:30px;display:flex;flex-wrap:wrap;gap:12px;justify-content:center;padding:0 20px}
  .hero-cover .hero-cta .btn{flex:1 1 auto;min-width:0;justify-content:center}
  @media(min-width:600px){.hero-cover .hero-cta{margin-top:38px}.hero-cover .hero-cta .btn{flex:0 0 auto;justify-content:center}}
  .hero-cover .hero-meta{margin-top:30px;display:flex;flex-wrap:wrap;gap:14px 24px;justify-content:center;font-size:.78rem;color:var(--muted);font-weight:500;padding:0 20px}
  @media(min-width:600px){.hero-cover .hero-meta{margin-top:40px;font-size:.82rem;gap:32px}}
  .hero-cover .hero-meta .dot{width:5px;height:5px;border-radius:50%;background:var(--sage);display:inline-block;margin-right:9px;vertical-align:middle}
  .hero-inset{margin:48px auto 0;max-width:1180px;padding:0 16px;position:relative}
  @media(min-width:980px){.hero-inset{margin-top:72px;padding:0 24px}}
  .hero-inset-frame{position:relative;aspect-ratio:21/9;border-radius:16px;overflow:hidden;background:#1a2520;box-shadow:0 32px 80px -24px rgba(15,26,21,.35)}
  @media(max-width:600px){.hero-inset-frame{aspect-ratio:4/5;border-radius:12px}}
  .hero-inset-frame>picture,.hero-inset-frame>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.04);transition:transform 14s cubic-bezier(.2,.7,.2,1)}
  .hero-inset-frame>picture img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.04);transition:transform 14s cubic-bezier(.2,.7,.2,1)}
  .hero-inset.in .hero-inset-frame>picture img,.hero-inset.in .hero-inset-frame>img{transform:scale(1)}
  .hero-badge{position:absolute;z-index:3;bottom:16px;right:16px;background:var(--cream);padding:11px 14px;border-radius:12px;display:flex;align-items:center;gap:11px;font-size:.82rem;box-shadow:0 18px 40px -12px rgba(0,0,0,.45);max-width:260px;color:var(--ink)}
  @media(min-width:980px){.hero-badge{bottom:24px;right:24px;padding:14px 18px;border-radius:14px;gap:14px;font-size:.88rem;max-width:280px}}
  .hero-badge .av{width:42px;height:42px;border-radius:50%;background:var(--sage);overflow:hidden;flex:none}
  .hero-badge .av img{width:100%;height:100%;object-fit:cover}
  .hero-badge .label{color:var(--muted);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
  .hero-badge strong{display:block;font-family:var(--serif);font-weight:500;font-size:1rem;margin-top:2px;color:var(--ink)}

  `;

const V3_HTML = `<!-- HERO -->
<section class="hero">
  <div class="hero-cover">
    <div class="container">
      <span class="eyebrow reveal in" data-i18n="hero_eyebrow">Tandarts in Zwaag \u00b7 3Shape TRIOS \u00b7 Sinds 2018</span>
      <h1 class="display reveal in"><span data-i18n="hero_h1_a">Een</span> <span data-i18n="hero_h1_a2">glimlach</span> <em data-i18n="hero_h1_b">die straalt.</em></h1>
      <p class="hero-lede reveal in" data-i18n="hero_lede">Implantaten, klikgebit, facings en esthetische tandheelkunde \u2014 verzorgd in een warme, gastvrije omgeving. Ook voor angstige pati\u00ebnten. Wij spreken Nederlands, Engels, Spaans en Papiaments.</p>
      <div class="hero-cta reveal in">
        <a href="#book" class="btn btn-primary"><span data-i18n="cta_book_long">Plan uw afspraak</span> <span class="arr">\u2192</span></a>
        <a href="tel:0229756979" class="btn btn-ghost">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
          0229 756 979
        </a>
      </div>
      <div class="hero-meta reveal in">
        <span data-i18n="hero_meta_1"><i class="dot"></i>Nieuwe pati\u00ebnten welkom</span>
        <span data-i18n="hero_meta_2"><i class="dot"></i>Spoed dezelfde dag</span>
        <span data-i18n="hero_meta_3"><i class="dot"></i>4 talen aan de stoel</span>
      </div>
    </div>
    <div class="hero-inset reveal in">
      <div class="hero-inset-frame">
        <picture><source type="image/avif" srcset="img/hero-800.avif 800w, img/hero-1400.avif 1400w" sizes="(max-width: 980px) 100vw, 1180px"><source type="image/webp" srcset="img/hero-800.webp 800w, img/hero-1400.webp 1400w" sizes="(max-width: 980px) 100vw, 1180px"><img src="img/hero-1400.webp" alt="Sparkle Smile Dental Clinic in Zwaag" fetchpriority="high"></picture>
        <div class="hero-badge">
          <div class="av"><picture><source type="image/avif" srcset="img/dentist-400.avif 400w, img/dentist-800.avif 800w" sizes="42px"><source type="image/webp" srcset="img/dentist-400.webp 400w, img/dentist-800.webp 800w" sizes="42px"><img src="img/dentist-800.webp" alt=""></picture></div>
          <div>
            <span class="label" data-i18n="hero_badge_label">Hoofdtandarts</span>
            <strong>Dr. Eline van der Berg</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

`;

writeVariant('v3-centered', '03 \u00b7 Centered cover', V3_CSS, V3_HTML);

console.log('\nDone. Variants written under public/variants/');
