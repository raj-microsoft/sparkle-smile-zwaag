# Sparkle Smile Dental Clinic — Zwaag

Editorial landing page for [Sparkle Smile Dental Clinic](https://sparklesmiledentalclinic.nl) in Zwaag, NL.

- **Single-file HTML** — no build step, no framework
- **Languages:** Nederlands · English · Español (switcher in header)
- **Performance:** ~80 ms FCP on mobile, ~32 KB initial image payload (AVIF + WebP responsive)
- **Stack:** Plain HTML / CSS / vanilla JS, Fraunces + Manrope from Google Fonts
- **Decorative forms only** — booking goes via phone/email

## Local dev

```bash
npx http-server public -p 4477 -c-1 -s
```

Then open <http://127.0.0.1:4477>.

## Image optimization

The `public/img/` folder contains responsive AVIF + WebP variants generated from source PNGs (PNGs are gitignored). To regenerate:

```bash
npm install sharp --no-save
node optimize-images.js
node optimize-html.js
```

## Deploy

Hosted on Vercel as a static site. Push to `main` triggers auto-deploy.
