import { renderTemplate } from "../scripts/template-renderer.js";

const SAVES_DATA = [
    { id: 'fort', label: 'Fortitude', attr: 'con' },
    { id: 'ref', label: 'Reflex', attr: 'dex' },
    { id: 'will', label: 'Will', attr: 'wis' }
];

export function initSaves(engine) {
    const savesArea = document.getElementById('saves-area');
    const notesContainer = document.getElementById('defenses-notes-container');

    if (!savesArea) {
        console.error("Container 'saves-area' not found.");
        return;
    }

    const fragment = renderTemplate('save-template', SAVES_DATA, ['id', 'label', 'attr']);
    savesArea.insertBefore(fragment, notesContainer);

    SAVES_DATA.forEach(save => setupSaveNodes(save, engine));
}

function setupSaveNodes(save, engine) {
    if (!engine) {
        console.error('Calculation engine not attached.');
        return;
    }

    const id = save.id;
    const attrKey = save.attr.toLowerCase(); // 'con', 'dex', 'wis'

    // --- A. Register Sources ---
    engine.registerSource(`${id}-rank`, 0); // 0 = U, 2 = T, 4 = E, 6 = M, 8 = L

    const itemInput = document.getElementById(`${id}-item`);
    const initialItem = itemInput && itemInput.value !== "" ? Number(itemInput.value) : 0;
    engine.registerSource(`${id}-item`, initialItem);

    // --- B. Register Formula Nodes ---

    // 1. Attribute Modifier (mirrors con, dex, or wis)
    engine.registerFormula(
        `${id}-attr`,
        [attrKey],
        (vals) => vals[attrKey] || 0
    );

    // 2. Proficiency Bonus (Untrained = 0; Trained+ = rank + level)
    engine.registerFormula(
        `${id}-prof`,
        ['level', `${id}-rank`],
        (vals) => {
            const rank = vals[`${id}-rank`] || 0;
            const level = vals['level'] || 0;
            return rank === 0 ? 0 : rank + level;
        }
    );

    // 3. Final Total: Attr + Prof + Item
    engine.registerFormula(
        `${id}-total`,
        [`${id}-attr`, `${id}-prof`, `${id}-item`],
        (vals) => (vals[`${id}-attr`] || 0) + (vals[`${id}-prof`] || 0) + (vals[`${id}-item`] || 0)
    );

    // --- C. Subscribe Readonly Display Inputs ---
    const attrInput = document.getElementById(`${id}-attr`);
    const profInput = document.getElementById(`${id}-prof`);
    const totalInput = document.getElementById(`${id}-total`);

    if (attrInput) {
        engine.subscribe(`${id}-attr`, (val) => { attrInput.value = val; });
    }
    if (profInput) {
        engine.subscribe(`${id}-prof`, (val) => { profInput.value = val; });
    }
    if (totalInput) {
        engine.subscribe(`${id}-total`, (val) => { totalInput.value = val; });
    }
}
