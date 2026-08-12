# Project Overview: PF2e Sheet and Builder

Welcome to the **Pathfinder 2nd Edition (PF2e) Sheet and Builder** project. This workspace contains a modular, lightweight web-based application designed to facilitate PF2e character sheet tracking and character building, backed by a comprehensive repository of System Reference Document (SRD) game data.

---

## 1. High-Level Architecture

The project is structured as a multi-tier local application comprising a **Vanilla Frontend**, a **Node.js Express Backend API**, and a **Data Context/Layer** that reads directly from flat JSON files:

```
┌────────────────────────────────────────────────────────┐
│                      FRONTEND (web/)                   │
│  - Vanilla HTML5 / CSS3 / ES6 JavaScript               │
│  - Reusable module templates injected dynamically       │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTP Requests (e.g., fetch)
                            ▼
┌────────────────────────────────────────────────────────┐
│                     BACKEND (api/)                     │
│  - Node.js & Express REST API Server (Port 8080)       │
│  - Controller/routing layers mapping game system URLs  │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ Local imports
                            ▼
┌────────────────────────────────────────────────────────┐
│               DATA CONTEXT (datacontext/)              │
│  - Local file-system (fs) JSON loader & parser          │
│  - Caching and in-memory query/filtering engine        │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ Local file read (readFileSync)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   GAME DATA (data/)                    │
│  - Thousands of SRD/adventure JSON data assets         │
│  - Structured PF2e items (feats, spells, classes, etc.)│
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

Below is an overview of the key directories and files in this workspace:

```text
Pf2-sheet-and-builder/
├── api/                             # Express-based Node.js Backend API
│   ├── routes/                      # API endpoint definitions
│   │   ├── feat_routes.js           # Feat-specific routes (/class-feats, /skill-feats)
│   │   └── index.js                 # Central route aggregator
│   ├── package.json                 # Backend dependencies (Express)
│   ├── package-lock.json            # Locked versions
│   └── server.js                    # Backend Entry Point (starts server on port 8080)
│
├── datacontext/                     # Flat-file database interface layer
│   ├── feat_datacontext.js          # Synchronous JSON loader/filter for feats
│   └── package.json                 # Configured with ES Modules support
│
├── data/                            # Comprehensive PF2e JSON database
│   ├── ancestries/                  # Ancestry rulesets
│   ├── classes/                     # Class details and progressions
│   ├── feats/                       # All individual PF2e feats (Class, Skill, General, etc.)
│   ├── spells/                      # Spells, scrolls, and cantrips
│   ├── equipment/                   # Weapons, armor, items, and accessories
│   └── ...                          # 70+ folders representing bestiaries, adventures, and SRD rule assets
│
├── web/                             # Frontend client (Vanilla Web Stack)
│   ├── index.html                   # Main UI entry point / document layout
│   ├── assets/                      # Static branding (logo, images, custom fonts)
│   ├── modules/                     # Reusable HTML template components
│   │   ├── attribute-component.html # Reusable markup for Ability Scores (STR, DEX, etc.)
│   │   └── general-information.html # Character identity section (Name, Level, Ancestry, Class)
│   ├── scripts/                     # Client-side behavioral scripts
│   │   ├── attributes.js            # Injects & maps attribute fields dynamically
│   │   └── general-information.js   # Fetches and injects general details module
│   └── styles/                      # Aesthetic and layout stylesheets
│       ├── font-import.css          # Handles Pathfinder typography integration
│       ├── page.css                 # Document framing and sizing parameters
│       └── main.css                 # Main PF2e skin layout, forms, checkboxes, skull icons, etc.
│
├── README.md                        # Standard git repository README
└── PROJECT_OVERVIEW.md              # Detailed architecture and developer guide (This File)
```

---

## 3. Main Dependencies & Tech Stack

The project prioritizes a minimal, native, and high-performance stack with no heavy frontend build tooling:

*   **Frontend (Client)**: 
    *   **HTML5 & CSS3**: Form-heavy character sheet containing themed inputs, custom grid layouts, custom styled checkable SVGs (e.g., hexagons for Hero Points, skulls for Dying conditions).
    *   **ES6 Vanilla JavaScript**: Native ES modules, standard asynchronous `fetch` for loading component templates and interacting with the backend API. No heavy frameworks like React or Vue, ensuring lightning-fast load times.
*   **Backend (API Server)**:
    *   **Node.js**: Configured with ES modules (`"type": "module"` in `package.json`).
    *   **Express.js (v4.19.2)**: Simple, lightweight routing engine for the backend endpoints.
*   **Data Tier**:
    *   **Flat JSON Files**: Replaces an heavy external database like PostgreSQL/MongoDB with a lightning-fast local lookup from highly structured game data directories.

---

## 4. Architectural Component Deep Dive

### A. Frontend Templating & Component Injection
To avoid writing thousands of lines of repeating HTML (e.g., for ability scores, skills, proficiencies), the frontend utilizes a **Vanilla Client-Side Injection Pattern**. 

For instance, the **Attributes block** dynamically uses `web/modules/attribute-component.html`:
1. `attributes.js` defines an array of metadata representing the six primary attributes: Strength (`str`), Dexterity (`dex`), Constitution (`con`), Intelligence (`int`), Wisdom (`wis`), and Charisma (`cha`).
2. It fetches `modules/attribute-component.html` once.
3. It iterates over the metadata, replacing placeholders like `{{id}}` and `{{label}}` with real details.
4. It dynamically inserts the combined markup into `#attributes` in `index.html`.

This keeps files highly readable, modular, and easy to extend.

### B. Flat-File Query Engine (`datacontext`)
Rather than keeping a running database server, `datacontext/feat_datacontext.js` acts as an in-memory data cache and filter:
1. When queried, it checks if its internal memory array `feats` is populated.
2. If empty, it uses Node's standard file system library (`node:fs`) to read directory names under `data/feats` synchronously (`readdirSync`), loads each file individually (`readFileSync`), parses them as JSON, and caches them in memory.
3. Provides specialized filter functions like `getClassFeats(className)` (filtering feats containing the requested class trait) and `getSkillFeats()` (filtering feats designated with category `"skill"`).

---

## 5. Entry Points

*   **Frontend Application**: `web/index.html`
    *   Open this file directly in a web browser or serve it with a lightweight dev server to access the character sheet interface.
*   **Backend API Service**: `api/server.js`
    *   Run `node server.js` from the `api` folder to launch the Express server at `http://localhost:8080`.
*   **Data Engine Module**: `datacontext/feat_datacontext.js`
    *   The single source of truth for loading, processing, and caching raw Pathfinder JSON databases.

---

## 6. Key Workflows

### Workflow A: Dynamic UI Initialisation
When a player loads `web/index.html`:
```text
[ Browser loads index.html ]
             │
             ├─► Loads scripts/general-information.js ──► Fetches modules/general-information.html ──► Injects into #general-information
             │
             └─► Loads scripts/attributes.js ──────────► Fetches modules/attribute-component.html ────► Injects 6x (STR, DEX, etc.) into #attributes
```

### Workflow B: Requesting Class/Skill Feats
When the UI or a user requests feats for a specific class configuration (e.g., "Fighter" class feats):
```text
1. Client-Side UI / Builder  ──► Sends HTTP GET request to http://localhost:8080/class-feats/fighter
2. Express Server (api/)     ──► Receives request, matches route in api/routes/feat_routes.js
3. Feat Routes Middleware    ──► Calls datacontext.getClassFeats('fighter')
4. Datacontext Engine        ──► Check cache. If empty, scans & parses 'data/feats/*.json' into memory
                             ──► Filters results: feat.system.category == "class" && traits.includes("fighter")
5. Express Server Response   ──► Serializes matched JSON feats array and returns it to Client-Side UI
```

---

## 7. Development Guidelines

*   **Adding New Frontend Sections**: Formulate a new module under `web/modules/` and inject it dynamically via a matching script in `web/scripts/` to keep `web/index.html` exceptionally clean.
*   **Extending the API**: Add endpoint routes in `api/routes/feat_routes.js` and implement any matching flat-file query filtering inside `datacontext/feat_datacontext.js` to adhere to the separation of concerns between routing and data-fetching.
*   **Pathfinder System Data**: Raw items can be updated or added by dropping valid JSON items into their respective directory under `data/` (e.g. `data/feats`, `data/spells`, etc.).

---

## 8. Frontend Evaluation & Architectural Guidance

As the application evolves from static presentation to dynamic interactive tracking, the current frontend structure has been evaluated for strengths, architectural risks, and future scalability.

### A. Architectural Strengths
*   **Modular Template Injections**: Reusing components (e.g., ability scores) by fetching raw HTML files dynamically keeps the `web/index.html` file uncluttered and simplifies layout maintenance.
*   **Immersive Aesthetic Fidelity**: High-fidelity thematic design using standard CSS custom grid shapes, condition indicators (hexagons and skulls), and input elements aligns perfectly with the Pathfinder 2e paper sheet layout.
*   **Minimal/Native Stack**: Zero framework dependencies (no React/Vue/Svelte compile overhead) ensures instant startup times and simplifies deployment.

### B. Scalability Risks & Architectural Challenges

#### Active
1.  **Inconsistent Modularization**: Currently, components like Attributes are dynamically rendered, while other highly repeating fields (e.g., Saving Throws, Defenses, and 16+ Skills) are hardcoded directly into the main index file. 
2.  **Cascade Recalculations**: Modifying a base attribute (such as Dexterity) must automatically trigger modifications to Armor Class, Reflex Saves, and all Dexterity-based skills (Acrobatics, Stealth, etc.). Managing these calculations with raw event listeners bound manually in global-scoped vanilla scripts will degrade quickly into unmaintainable "spaghetti" code.

#### Resolved
3.  ~~**Layout Shifts (CLS)**: Fetching module snippets dynamically from a server via `fetch()` triggers asynchronous layout rendering, causing noticeable layout shifts during initial load.~~
4.  ~~**Global Scope Clashing**: Importing files without `type="module"` runs them globally, leading to naming collisions as more components are introduced.~~

### C. Actionable Technical Recommendations

#### 1. Introduce a Centralized Character State Store
Organize the client logic around a single, cohesive character state object. When any user action occurs, modify the state first, and then let an observer engine recompute dependent modifiers (e.g., Strength Score ──► Athletics skill bonus).
```javascript
const characterState = {
    level: 1,
    attributes: { str: 10, dex: 14, con: 12, int: 10, wis: 10, cha: 10 },
    proficiencies: { acrobatics: 'T', athletics: 'U' }
};

function updateCalculatedModifiers() {
    const level = characterState.level;
    const dexMod = Math.floor((characterState.attributes.dex - 10) / 2);
    // Automatically trigger updates to all DOM fields utilizing level or dexMod
    document.querySelector('.dex-modifier-display').textContent = dexMod;
}
```
