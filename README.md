# Splitdrop

Free, 100% client-side online tools — no backend, no database, no API, no server.
Everything runs in the browser using HTML5, CSS3 and vanilla JavaScript.

## Tools included

| Tool | File | Description |
|---|---|---|
| Image Compressor | `image-compressor.html` | Reduce JPG/PNG/WEBP file size with a quality slider. Batch + ZIP download. |
| Image Converter | `image-converter.html` | Convert JPG ↔ PNG ↔ WEBP. Batch + ZIP download. |
| PDF Merge | `pdf-merge.html` | Combine multiple PDFs, drag to reorder, download merged file. |
| PDF Split | `pdf-split.html` | Extract a page range, or split every page into a ZIP of single-page PDFs. |
| QR Code Generator | `qr-generator.html` | URL, text, email, phone, SMS, WhatsApp, WiFi, UPI, vCard — custom colors, logo, PNG/SVG export. |

## Tech stack

- HTML5 / CSS3 / vanilla JavaScript (no frameworks, no build step)
- [pdf-lib](https://pdf-lib.js.org/) (CDN) — PDF merge/split
- [qrcode](https://github.com/soldair/node-qrcode) (CDN) — QR generation
- [JSZip](https://stuk.github.io/jszip/) (CDN) — batch ZIP downloads

## Project structure

```
Splitdrop/
├── index.html
├── image-compressor.html
├── image-converter.html
├── pdf-merge.html
├── pdf-split.html
├── qr-generator.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── compressor.js
│   ├── converter.js
│   ├── pdfmerge.js
│   ├── pdfsplit.js
│   └── qr.js
├── assets/
│   ├── images/
│   └── icons/
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── README.md
```

## Deploying to GitHub Pages

1. Create a new GitHub repository and push this folder's contents to the `main` branch.
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, select the `main` branch and `/ (root)` folder, then **Save**.
4. Your site will be live at `https://<username>.github.io/<repo-name>/` within a few minutes.
5. Before going live, replace every `https://zubairbusiness132-commits.github.io/Splitdrop/` reference in the HTML `<head>` tags (canonical URLs, Open Graph, sitemap.xml, robots.txt) with your real domain or GitHub Pages URL.

## Ads

Every page has three ad `<div class="ad-slot">` elements (below header, after tool, footer) with an HTML comment marking where to paste your Adsterra/AdSense script once approved.

## Notes

- All processing (image compression/conversion, PDF merge/split, QR generation) happens locally in the visitor's browser. No files are ever uploaded to a server.
- Dark/light theme preference is remembered via `localStorage`.
