# Korea House Ninano — website

Static, mobile-first website for Korea House Ninano (Osu & East Legon, Accra).

**Features:** hero video, GH₵99 weekday Value Menu picker (auto-highlights today), filterable menu with a WhatsApp order list, Friday buffet price calculator (GH₵320 / 290 / 260), Friday Nights live-music video, gallery lightbox, reservation form that sends a pre-filled WhatsApp booking, branch maps, and careers.

No build step — plain HTML/CSS/JS. Preview locally with `python3 -m http.server` and open http://localhost:8000.

## Deploying
Pushing to `main` runs `.github/workflows/pages.yml`. One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Editing content
- Value Menu days: `VALUE` in `script.js`
- Menu items: `MENU` in `script.js`
- Branch info: `LOCS` in `script.js`
- Images/videos: `assets/`
