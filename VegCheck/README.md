# VegCheck 🌱

A lightweight, client-side web application to scan food barcodes and determine if a product is **Vegan**, **Vegetarian (Lacto-Veg)**, **Eggetarian**, or **Non-Vegetarian**.

---

## ✨ Features

- **3 Scan Modes**: Live camera scanner (with flashlight support), barcode photo upload, and manual barcode entry.
- **Dietary Classifier (Engine V2)**:
  - Multi-endpoint Open Food Facts lookups with automatic UPC/EAN/GTIN normalization.
  - Recognizes Indian FSSAI INS and EU E-numbers (e.g., Carmine `120`, Gelatin `441`, Shellac `904`, L-Cysteine `920`).
  - Filters negative marketing claims (*"Eggless"*, *"Gelatin-Free"*) to prevent false flags.
- **Rich Product Insights**: Ingredient breakdown, allergen flags, Nutri-Score, Eco-Score, Nova Group processing index, and palm oil detection.
- **Local Scan History**: Saved locally in `localStorage`.

---

## 🛠️ Tech Stack

- **Frontend**: Pure HTML5, CSS3 (Modern Glassmorphism), Vanilla JavaScript
- **Barcode Decoding**: [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- **Data Source**: [Open Food Facts API](https://world.openfoodfacts.org/)

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser, or run a local server for camera permissions:

```bash
python3 -m http.server 8000
# Open http://localhost:8000/VegCheck/
```
