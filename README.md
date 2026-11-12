# Avenix

**Computers, networks, robotics and software for schools, offices and homes.**
Official website of Avenix, a technology company in Nairobi, Kenya, founded in 2026 by Seth Chenge.

Live site: https://avenix.co.ke

---

## What is Avenix?

Avenix installs operating systems, builds computer labs, repairs machines, teaches Arduino robotics, builds IoT and networks, supplies RAM and hardware, and develops websites and apps. It also makes its own software, starting with **V Chess**, a chess app that explains why the engine prefers a move.

## About this repository

This is the static website for Avenix. It has no build step: plain HTML, CSS and JavaScript that you can open in a browser or upload to any web host.

### Pages

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Hero, tools line, services, workshop gallery, V Chess, how a job goes |
| Services | `services.html` | All 8 services with steps, tools, prices (KSh / USD) and FAQ |
| Projects | `projects.html` | Completed and planned projects with a status filter |
| About | `about.html` | Company story, founder profile, timeline |
| Contact | `contact.html` | Contact cards and a form that opens WhatsApp or email |

### Features

- Mobile-first, responsive layout (phones to large TVs)
- Desktop navbar with a Services dropdown, and a mobile side drawer
- Scrolling "Systems and tools we work with" line with flat logos on a night-sky background
- KSh / USD price switch on the services page
- Projects filter (All / Completed / Planned)
- Contact form that sends the message through WhatsApp or the email app
- V Chess purchase popup with M-Pesa (STK push) flow
- Gallery carousel, animated hero and scroll animations (GSAP)
- Strong SEO: meta tags, Open Graph, Twitter cards, canonical links and JSON-LD structured data on every page
- Accessibility: skip link, ARIA labels, keyboard focus styles, reduced-motion support

## Tech stack

- HTML5
- CSS3 (custom styles in `styles.css`)
- JavaScript (vanilla, in `main.js`)
- [Bootstrap 5.3](https://getbootstrap.com/) and [Bootstrap Icons](https://icons.getbootstrap.com/)
- [GSAP 3](https://gsap.com/) with ScrollTrigger
- Google Fonts: Plus Jakarta Sans, Fraunces, Source Serif 4, Material Icons Round

All libraries load from CDNs, so there is nothing to install.

## Project structure

```
avenix/
├── index.html
├── services.html
├── projects.html
├── about.html
├── contact.html
├── styles.css
├── main.js
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
└── assets/
    └── img/
        ├── logo.png
        ├── og-image.jpg            (1200 x 630, social preview)
        ├── seth-chenge.jpg
        ├── vchess.png
        ├── arduino-gallery-1.jpg
        ├── lab-gallery.jpg
        ├── os-gallery.jpg
        ├── network-gallery.jpg
        ├── os-install.jpg
        ├── computer-lab.jpg
        ├── maintenance.jpg
        ├── arduino-robot.jpg
        ├── iot-sensors.jpg
        ├── networking.jpg
        ├── ram-upgrade.jpg
        ├── web-dev.jpg
        ├── project-vchess.jpg
        ├── project-kanjalu.jpg
        ├── project-kaptebee.jpg
        ├── project-website.jpg
        ├── project-robot.jpg
        └── project-store.jpg
```

Every image has an `onerror` fallback, so the site still works while images are missing (you will see a striped placeholder with a label).

## Run it locally

No setup needed. Either:

1. Double-click `index.html`, or
2. Serve the folder (recommended, so relative links and the payment API paths behave like production):

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then open http://localhost:8000.

## How to edit common things

| I want to... | Where |
| --- | --- |
| Change the USD exchange rate | `KES_PER_USD` at the top of `main.js` |
| Change WhatsApp number or email used by the form | `WHATSAPP` and `EMAIL` at the top of `main.js` |
| Change a service price | `data-ksh="..."` and the visible text on `services.html`, plus the matching `price` in that page's JSON-LD |
| Change the V Chess price | `MPESA.amount` in `main.js`, the button and modal text in `index.html`, and the JSON-LD offers |
| Add a project | Copy a project card in `projects.html`, update the filter counts, and add it to the JSON-LD list |
| Add a gallery slide | Copy a `.carousel-item` and an indicator button in `index.html` |
| Add a FAQ question | Copy an `.accordion-item` in `services.html` (new `id`) and add it to the FAQ JSON-LD |
| Change colours | CSS variables in `:root` at the top of `styles.css` |
| Turn on a social icon | Remove `class="soon"` and set the real `href` in the footer of every page |

## M-Pesa and V Chess downloads

The payment flow in `main.js` calls **your own server**. Daraja keys must never be placed in front-end files.

```
POST /api/mpesa/stkpush   {phone: "2547XXXXXXXX", amount: 500, product: "vchess"}
                          -> {checkoutRequestId}

GET  /api/mpesa/status?id=<checkoutRequestId>
                          -> {status: "pending" | "paid" | "failed", downloadUrl?: "..."}
```

- The server returns `downloadUrl` only after Safaricom confirms payment on your callback.
- Keep the APK behind that check on the server. Do not leave it as a public file.
- Until these endpoints exist, the pay button shows "Payments are not live yet" and points people to WhatsApp.

## SEO checklist

Each page already includes a title, description, keywords, canonical link, Open Graph and Twitter tags, geo tags and JSON-LD. Before launch, make sure you also have:

- [ ] `sitemap.xml` listing all five pages
- [ ] `robots.txt` pointing to the sitemap
- [ ] `site.webmanifest` and all favicon files
- [ ] `assets/img/og-image.jpg` (1200 x 630)
- [ ] The site added to Google Search Console and Bing Webmaster Tools
- [ ] A Google Business Profile for Avenix in Nairobi

## To-do before going live

- [ ] Add the real Facebook link in the footer (marked with a `TODO` comment)
- [ ] Fill in the Privacy and Terms pages (the footer links are `#` for now)
- [ ] Make the logo path consistent: some pages use `logo.jpg`, others use `assets/img/logo.png`
- [ ] Add all project and service images
- [ ] Build the M-Pesa server endpoints
- [ ] Build the online store (planned)

## Deploying

Because the site is static, any of these work:

- **GitHub Pages**: push to a repository and enable Pages
- **Netlify** or **Cloudflare Pages**: drag and drop the folder
- **Any cPanel host**: upload everything into `public_html`

Point the `avenix.co.ke` domain at the host and enable HTTPS.

## Contact

| | |
| --- | --- |
| WhatsApp | [+254 721 156 350](https://wa.me/254721156350) |
| Email | chengeseth25@gmail.com |
| Location | Nairobi, Kenya |

## Credits

- Founder and CEO: **Seth Chenge**
- Brand logos from [Simple Icons](https://simpleicons.org/), [Iconify](https://iconify.design/) and [Devicon](https://devicon.dev/). All logos belong to their respective owners.

## License

&copy; 2026 Avenix. All rights reserved.