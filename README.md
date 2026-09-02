# Isaac Mothomoholo — Portfolio Website

A single-page portfolio site built with **HTML**, **JavaScript**, and **Tailwind CSS**.
All content (name, bio, contact, skills, education, certifications, experience,
projects, about) is stored in **`data.json`** — edit that file to update the
site, no coding required.

## File structure

```
portfolio/
├── index.html         → page structure/layout
├── script.js           → loads data.json and renders every section dynamically
├── style.css            → compiled Tailwind CSS (works fully offline, no CDN needed)
├── data.json           → ALL editable content lives here
├── build_tailwind.mjs  → optional dev script to rebuild style.css (see below)
└── assets/
    ├── logo.png                → "Big Human" logo (placeholder, swap with your own)
    ├── avatar-placeholder.png  → profile photo placeholder (swap with your real photo)
    └── fabric-icon.png         → Microsoft Fabric icon (no official logo exists on
                                   Simple Icons, so a matching brand-style icon was
                                   generated for it)
```

## How to view it

Because the page loads `data.json` via JavaScript's `fetch()`, most browsers will
**block it if you just double-click `index.html`** (a `file://` security restriction).
Instead, serve the folder with a tiny local server:

**Option A — Python (already on most machines):**
```bash
cd portfolio
python -m http.server 8000
```
Then open **http://localhost:8000** in your browser.

**Option B — VS Code:** install the "Live Server" extension, right-click
`index.html` → "Open with Live Server".

**Option C — Node:**
```bash
npx serve .
```

Once it's live on any real web server (GitHub Pages, Netlify, your own hosting), it
will just work — no special setup needed there.

> **Note on internet access:** the Skills logos and Credly badges load from public
> CDNs (`cdn.simpleicons.org` and `cdn.credly.com`), exactly like the Google Fonts
> link already in the page. This means the *visitor's browser* needs internet access
> to see them — completely normal for any live website, but worth knowing if you
> ever test entirely offline.

## How to edit content

Open **`data.json`** and change any of the following — the site re-renders
automatically from this file:

| Section | What you can edit |
|---|---|
| `site` | Brand name, logo path, browser tab title |
| `nav` | Nav bar labels/order |
| `hero` | Your photo, name, title, bio paragraphs, phone & email |
| `skills` | Tech stack logos (see below) |
| `education` | Qualifications list (qualification, institution, period, details) |
| `certifications` | Professional certifications & short courses — reference link **and** Credly badge (see below) |
| `experience` | Job roles, company, dates, bullet responsibilities |
| `projects` | Project name, description, tags |
| `about` | About Me heading + paragraphs |
| `footer` | Footer copyright text |

### Skills section — real logos

Each entry in `skills` is one of two types:

```json
{ "name": "Power BI", "type": "simple-icon", "slug": "powerbi", "color": "F2C811" }
{ "name": "Microsoft Fabric", "type": "image", "src": "assets/fabric-icon.png" }
```

- **`type: "simple-icon"`** pulls the real, official brand SVG logo live from the
  [Simple Icons](https://simpleicons.org) CDN at `https://cdn.simpleicons.org/<slug>/<color>`
  — this is the same CDN usage pattern documented by the Simple Icons project itself.
  To add a new tool, find its slug at [simpleicons.org](https://simpleicons.org) (click
  the icon to copy its slug) and add an entry the same way.
- **`type: "image"`** uses a local file from `/assets` instead — used here for
  **Microsoft Fabric**, which currently has no icon in the Simple Icons library.
  Swap `assets/fabric-icon.png` for Microsoft's own official Fabric icon at any
  time if you'd prefer (Microsoft provides official downloads at
  [learn.microsoft.com/fabric/fundamentals/icons](https://learn.microsoft.com/en-us/fabric/fundamentals/icons)).

### Certifications — reference link + Credly badge

Each certification entry looks like this:

```json
{
  "name": "Google Business Intelligence Certificate",
  "issuer": "Google (via Coursera)",
  "date": "February 2026",
  "link": "https://www.coursera.org/professional-certificates/google-business-intelligence",
  "credlyBadgeId": ""
}
```

- **`link`** currently points to the **official public course/certification page**
  for each credential (Coursera, SAP Learning, Credly org page), since that's the
  only universally available reference. If you have your own personal verification
  link (Credly badge URL, LinkedIn certification link, Coursera "Verify Certificate"
  link), replace `link` with that instead.
- **`credlyBadgeId`** is a dedicated slot for your **Credly digital badge**. Leave it
  empty (as it is now) and the site shows a "Credly badge not yet added" placeholder
  so it's obvious where to plug it in later. Once you have a Credly badge for a
  credential:
  1. Go to your badge on Credly → **Share** → **Embed code**.
  2. Copy just the badge ID from the code Credly gives you (the long value after
     `data-share-badge-id="..."`, e.g. `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).
  3. Paste that ID into `"credlyBadgeId"` for the matching certification in `data.json`.
  4. The site will automatically render Credly's live, official badge widget in
     that card — no other changes needed.

To use your **real profile photo**, replace `assets/avatar-placeholder.png`
with your photo (same filename), or update the `"photo"` path in `data.json`.
Same idea for the logo.

## How to change design/styling

The page uses Tailwind CSS utility classes directly in `index.html` and
`script.js` (e.g. `bg-navy`, `rounded-xl`, `md:grid-cols-2`). The CSS has
already been compiled into `style.css` so the page's own layout/styling works
completely offline — only the skill logos and Credly badges need internet access
(see note above).

If you add/change any Tailwind classes and want them reflected in
`style.css`, you have two options:

1. **Rebuild locally** (requires Node.js + the `tailwindcss` package installed):
   ```bash
   node build_tailwind.mjs
   ```
   This scans `index.html` and `script.js` for class names and regenerates `style.css`.

2. **Simplest no-build alternative:** replace the line
   ```html
   <link rel="stylesheet" href="style.css">
   ```
   in `index.html` with the Tailwind Play CDN (auto-compiles in the browser,
   requires internet access, great for quick edits):
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   ```

## Notes

- Brand colors used: **Navy** (`#1E2A4A`, `#0F1830`) to match the dark
  navy nav buttons/logo box in the original design.
- Smooth-scroll navigation and scroll-spy (active nav highlighting) are
  wired up in `script.js` and include the Certifications section.
