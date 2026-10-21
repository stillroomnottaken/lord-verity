# BMS Visual Website Builder: interactive static demo

A **showcase prototype** of how an administrator could edit the BMS website visually.
**Demo mode: changes exist only in the browser session.** There is no database, backend, login, local/session storage,
IndexedDB, save API or publish pipeline. Refreshing the page restores the original BMS content.
`/admin` is deliberately unauthenticated and is **not** a secured CMS; do not use it for real editing.

## What is in the repository now
- The original static site (Jinja + `build.py`, root `*.html`, `id/`, `assets/`) is untouched, so GitHub Pages keeps working.
  Only one change: `src/` was renamed to `site-src/` (and `build.py`/README paths updated) because Next.js treats a folder named `src/` as its own source root.
- A Next.js 15 / React 19 / TypeScript app (no Tailwind, no extra runtime dependencies) that re-renders the same BMS pages from a typed page model.
  Styling reuses the original stylesheet (`app/site.css`), with `max-width` media queries converted to container queries so tablet/mobile previews work inside the canvas.

| Route | Purpose |
|---|---|
| `/`, `/catalogue`, `/products`, `/how-we-work`, `/about`, `/contact`, `/corn-cobs` | public pages (English) |
| `/id`, `/id/katalog`, `/id/produk-olahan`, `/id/cara-kerja`, `/id/tentang`, `/id/kontak`, `/id/corn-cobs` | public pages (Indonesian) |
| `/admin` | the visual editor demo (never the homepage) |

Public pages and the editor share one in-memory store. If you click "Public website" in the admin (client-side navigation), you see your
in-session edits without any editor chrome. A hard refresh resets everything.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000  (editor at /admin)
npm run typecheck
npm run build && npm start
```
Static site as before: `pip install jinja2 && python3 build.py`.

## Push to GitHub and deploy on Vercel
```bash
git add -A && git commit -m "Add visual editor demo" && git push
```
Import the repo at vercel.com/new. The framework preset is detected as Next.js; no environment variables, root-directory or output settings are needed.
(GitHub Pages can keep serving the root static files; Vercel serves the Next.js app.)

## Implemented
- Admin shell with Overview, Website Editor, Pages, Catalogue, Media Library, Languages, Design Settings, persistent demo notice.
- Canvas rendered by the same components as the public site; click-to-select; type directly in headings, paragraphs, buttons, links, card titles, fact rows.
- Layers panel (nested, collapsible, visibility/duplicate/delete, drag-to-reorder, selection synced both ways) and Add panel (8 sections, 10 elements).
- Inspector per element type: text typography, image (media picker, size, aspect, fit, position, alt), button (label, destination, variant, size, alignment, radius), section (background colour/image, width, layout, columns, padding, margin, gap, alignment, visibility, order), container, spacer, divider, facts.
- Drag-and-drop for sections and elements (drop indicators; drop into containers); resize handles (width in %, with snapping and a live label; height for images/spacers; min-height for sections).
- Keyboard: Delete, Ctrl/Cmd+D, Ctrl/Cmd+Z, Ctrl/Cmd+Y, Alt+↑/↓, Esc.
- Separate English/Indonesian text for every element; Languages view with side-by-side editing of the current page.
- Catalogue manager (add, edit EN/ID names and descriptions, category, slug, image, visibility, reorder, delete) with live preview.
- Undo/redo (in-memory history, typing and slider drags are grouped), preview mode (simulated navigation, desktop/tablet/mobile), reset with confirmation, design settings with reset.
- Temporary object URLs for local images, revoked on removal, reset and unmount.

## Known limitations (honest list)
- Some original page structures are approximated with generic blocks: home "ribbons" are band sections with a link (not a fully clickable strip); the hero illustration and the three-step flow are fixed graphics.
- The repository contains no photographs, so the media library offers generated sample images and `favicon.svg`; local file previews are session-only.
- Header, menu and footer are shared site chrome and are not editable. The contact form and the catalogue "Not listed?" card use fixed bilingual text; the form does not send anything in this demo.
- Alignment guides are limited to width snapping at 25/33/50/67/75/100 %. Responsive settings are limited to column collapse (3→2→1); there are no per-device overrides.
- Drag-and-drop uses native HTML5 drag events, so it works with a mouse/trackpad but not by touch. The up/down buttons and Alt+↑/↓ are the touch/keyboard alternative.
- No ESLint config exists in the repository, so only TypeScript checking and the production build were run.
- Tested in Chromium only (automated Playwright runs); other browsers were not tested. Resize height maths assumes CSS `zoom` reports client rects in zoomed pixels (true in current Chrome).
