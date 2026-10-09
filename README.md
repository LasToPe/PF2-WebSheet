# Pathfinder 2e Web Character Sheet

A highly interactive, responsive, and comprehensive digital character sheet built for **Pathfinder 2nd Edition**. 

Designed to replicate the dense, structured look of traditional physical sheets while leveraging modern browser capabilities for automated calculations, real-time bulk limits, and inventory tracking.

---

## 🚀 Features

- **Dynamic Stat Management**: Track Level, XP, Hero Points, Dying/Wounded conditions, and core combat numbers with automated modifier calculation.
- **Automated Inventory & Bulk**: Real-time bulk capacity tracking (Encumbered/Maximum thresholds) and automated coin/wealth conversions.
- **Complex Two-Page Layout**: Faithfully mirrors physical sheet ergonomics using advanced CSS Grid and Flexbox layouts.
- **Data Persistence**: Automatically persists changes to your browser's `localStorage` and supports JSON import and export.
- **Modular Architecture**: Built with native ES Modules for clean separation of concerns without requiring a build step or bundler.
- **Custom Theming & Iconography**: Uses CSS custom properties alongside Pathfinder-specific glyph fonts via `@font-face`.

---

## 🛠️ Tech Stack

- **Core Technologies**: Semantic HTML5, Modern CSS3, Vanilla ES6+ JavaScript.
- **CSS Features Used**: CSS Grid, Flexbox, `:has()` pseudo-class, CSS Custom Properties (variables).
- **Module Architecture**: Native ES Modules (`type="module"`).
- **Typography & Glyphs**:
  - Web fonts: Taroca, Open Sans
  - Custom Pathfinder action/die glyph sets loaded via `@font-face`

---

## 📁 Project Structure

```text
PF2-WebSheet/
├── LICENSE             # Project license
└── web/                # Application root
    ├── index.html      # Main markup & entry point
    ├── assets/
    │   └── images/     # Logos, graphical UI elements
    ├── modules/        # ES Module logic
    ├── scripts/        # General helper utilities
    └── styles/         # CSS stylesheets
```

---

## ⚙️ Getting Started & Local Setup

Because this project utilizes native JavaScript ES Modules, opening index.html directly via file:/// in a standard browser will fail due to CORS security rules. Choose one of the following methods to run or preview the sheet:

### Option 1: VS Code Integrated Browser (Recommended)
You can preview and interact with the sheet directly inside VS Code without installing third-party extensions:
1. In the VS Code File Explorer, right-click `web/index.html`.
2. Select **Open in Integrated Browser** (or open `index.html` and click the **Open in Integrated Browser** globe icon in the editor tab toolbar).

### Option 2: Python 3 (CLI)
From the root of the repository, navigate into the `web` folder and start the server:
```bash
cd web
python3 -m http.server 8000
```
Open your browser to: [http://localhost:8000](http://localhost:8000)

### Option 3: Node / NPX
If you have Node.js installed:
```bash
cd web
npx serve .
```

---

## 🌐 Browser Compatibility

This application relies on modern CSS selectors like `:has()`. For optimal layout rendering and script execution, ensure your browser meets or exceeds the following baseline versions:

| Browser                      | Minimum Supported Version |
| :--------------------------- | :------------------------ |
| **Google Chrome / Chromium** | 105+                      |
| **Mozilla Firefox**          | 121+                      |
| **Apple Safari**             | 15.4+                     |
| **Microsoft Edge**           | 105+                      |

---

## 🤖 AI Use Disclaimer

This project is developed with the assistance of AI coding assistants (including Cline and local/cloud LLMs) across design, code generation, refactoring, and documentation phases. 

- **Human Oversight**: All code, layout designs, and calculation logic undergo manual review and verification.
- **No Warranty**: This software is provided *"as-is"*. Automated calculations (e.g., bulk limits, proficiency formulas) should be reviewed against the official Pathfinder 2e rulebooks before being relied upon in critical play sessions.

---

## ⚖️ Legal & Trademarks

This project uses trademarks and/or copyrights owned by Paizo Inc., used under Paizo's Community Use Policy ([paizo.com/licenses/communityuse](https://paizo.com/licenses/communityuse)). We are expressly prohibited from charging you to use or access this content. The project is not published, endorsed, or specifically approved by Paizo. For more information about Paizo Inc. and Paizo products, visit [paizo.com](https://paizo.com).

---

## 📜 License & Contributing

- **License**: See the [LICENSE](LICENSE) file for code licensing terms.
- **Contributions**: This project is actively in pre-release development. Pull requests introducing major new features will not be accepted until the `v1.0` release milestone is reached. Bug reports, styling fixes, and issue tickets are welcome!