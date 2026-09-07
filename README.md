# GM Pharmacy — website

> **Your Health. Our Priority.**

Live at <https://gmconsultationllc.com>

Static site (plain HTML/CSS/JS). No build step, no dependencies, no server code.
That means it's fast, free to host, and easy to edit years from now.

```
index.html          all the page content
css/styles.css      all styling
js/main.js          mobile menu + live "Open now / Closed" status
images/logo.svg     mortar-and-pestle mark from the business card
images/favicon.svg  browser-tab icon
images/storefront.jpg  storefront photo used in the "Why us" section
robots.txt          search engine instructions
sitemap.xml         search engine page list
CNAME               the custom domain — do not delete, it is what maps the domain
.nojekyll           tells GitHub Pages to serve files as-is
```

---

## Run it locally

```bash
cd ~/Documents/pharmacy_website && python3 -m http.server 4321
```

Then open <http://localhost:4321> — Ctrl+C in the terminal to stop.

---

## Publishing a change

The site deploys itself. Push to `main` and GitHub Pages rebuilds within a minute.

```bash
git add -A && git commit -m "what changed" && git push
```

Then hard-reload the live site (Cmd+Shift+R) to get past the browser cache.

---

## Brand

Taken from the business card, so print and web match.

| Token | Hex | Used for |
|---|---|---|
| `--navy` | `#1e2a44` | headings, primary buttons, footer, hero background |
| `--navy-900` | `#141c2e` | darkest navy — top bar, footer, gradients |
| `--sage` | `#7f9e5c` | accent buttons, the hero wave, logo leaves/cross |
| `--sage-700` | `#5c7742` | green *text* on white (the raw sage fails contrast at text size) |
| `--sage-100` | `#eef3e7` | icon chips, soft fills |

Two deliberate contrast decisions, worth keeping if you edit:

- **Sage buttons carry navy text, not white.** White on `#7f9e5c` is 2.8:1 — unreadable
  for many people. Navy on sage is 5.2:1 and passes.
- **Green text on white uses `--sage-700`**, never `--sage`.

The logo in `images/logo.svg` is a redrawn vector of the card's mark (navy mortar,
sage cross and leaves, navy pestle). If your designer has the original vector file,
swapping it in is strictly better — just keep the filename.

---

## Editing content

**Text, phone, address, services, FAQ** — all in `index.html`. It's commented by
section (`<!-- ====== SERVICES ====== -->` etc.), so search for the words you see
on the page and edit them in place.

**Hours live in four places.** If hours change, update all four:

| Where | What it does |
|---|---|
| `js/main.js` → `HOURS` object (top of file) | drives the live "Open now / Closed" badge |
| `index.html` → the `.hours__table` rows | the visible hours table |
| `index.html` → footer "Hours" column | footer summary |
| `index.html` → `openingHoursSpecification` in the JSON-LD `<script>` at the top | what Google reads |

**Storefront photo** — `images/storefront.jpg`. Replace the file to change it; the
page crops it to 4:3 automatically. Landscape, roughly 1200×900, under ~400 KB.

---

## Contact details on the site

| | |
|---|---|
| Phone | 734-789-4144 |
| Email | gmpharmacy71@gmail.com |
| Address | 33447 Ford Rd, Garden City, MI 48135 |
| Languages | English & Arabic |

These come from the business card. If any of them change, they appear in several
places in `index.html` — search for the old value and replace every hit, including
the JSON-LD block at the top of the file.

---

## Hosting and domain

| | |
|---|---|
| Host | GitHub Pages, free, serving this repo's `main` branch |
| Domain | `gmconsultationllc.com`, registered at Namecheap |
| HTTPS | Let's Encrypt certificate, issued and renewed automatically |

DNS lives in Namecheap under **Domain List → Manage → Advanced DNS**:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `ymaitah.github.io.` |

The MX and TXT records in that same panel run the domain's email through Zoho.
**Do not remove them** while changing web records, or mail stops.

---

## Not included on purpose

There's **no form that collects health information**. A refill form on a static site
sends data through a third party, which pulls HIPAA into scope for a site that
otherwise has none. Everything routes to phone/text/email instead — and the site
tells visitors not to send medical details that way.

If you want online refills later, the right answer is a HIPAA-compliant vendor with a
signed BAA (your pharmacy software vendor likely offers one) rather than a generic
form service. The same caution applies to the Gmail address: it's fine for "are you
open Saturday?", not for prescription details.
