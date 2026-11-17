import { renderTemplate } from "../scripts/template-renderer.js";

const WEAPONS_DATA = [
    { id: 'weapon-1', attr: 'str' },
    { id: 'weapon-2', attr: 'str' },
    { id: 'weapon-3', attr: 'str' },
    { id: 'weapon-4', attr: 'dex' },
    { id: 'weapon-5', attr: 'dex' },
];

const WEAPON_PROF_RANKS = [
    'prof-unarmed-rank',
    'prof-simple-rank',
    'prof-martial-rank',
    'prof-advanced-rank',
    'prof-other-rank'
];

export function initWeapons(engine) {
    const container = document.getElementById('strikes');
    if (!container) {
        console.error("Container 'strikes' not found.");
        return;
    }

    // Render weapon blocks and wire each strike
    const fragment = renderTemplate('weapon-block-template', WEAPONS_DATA, ['id', 'attr']);
    container.appendChild(fragment);

    WEAPONS_DATA.forEach(weapon => setupWeaponNodes(weapon, engine));
}

function setupWeaponNodes(weapon, engine) {
    if (!engine) {
        console.error('Calculation engine not attached.');
        return;
    }

    const id = weapon.id;
    const attrKey = weapon.attr.toLowerCase(); // 'str' or 'dex'

    // --- A. Register Sources ---
    const itemInput = document.getElementById(`${id}-attack-item`);
    const initialItem = itemInput && itemInput.value !== "" ? Number(itemInput.value) : 0;
    const notesInput = document.getElementById(`${id}-notes`);

    engine.registerSource(`${id}-attack-item`, initialItem);
    engine.registerSource(`${id}-notes`, notesInput?.value || '');

    // --- B. Register Proficiency Nodes ---
    // 1. Register the 5 weapon proficiency rank sources (updated via prof-change in engine.js)
    WEAPON_PROF_RANKS.forEach(rankKey => {
        engine.registerSource(rankKey, 0);
    });

    // 2. Compute the highest weapon proficiency bonus across all categories
    engine.registerFormula(
        'weapon-highest-prof',
        ['level', ...WEAPON_PROF_RANKS],
        (vals) => {
            const highestRank = Math.max(...WEAPON_PROF_RANKS.map(key => vals[key] || 0));
            const level = vals['level'] || 0;
            return highestRank === 0 ? 0 : highestRank + level;
        }
    );

    // --- C. Register Formula Nodes ---

    // 1. Attribute Modifier (Str weapons check for 'finesse' trait to use max(Str, Dex))
    if (attrKey === 'str') {
        engine.registerFormula(
            `${id}-attack-attr`,
            ['str', 'dex', `${id}-notes`],
            (vals) => {
                const str = vals['str'] || 0;
                const dex = vals['dex'] || 0;
                const isFinesse = /\bfinesse\b/i.test(vals[`${id}-notes`] || ''); // Regex test
                return isFinesse ? Math.max(str, dex) : str;
            }
        );
    } else {
        engine.registerFormula(
            `${id}-attack-attr`,
            [attrKey],
            (vals) => vals[attrKey] || 0
        );
    }

    // 2. Proficiency Bonus (mirrors highest weapon proficiency)
    engine.registerFormula(
        `${id}-attack-prof`,
        ['weapon-highest-prof'],
        (vals) => vals['weapon-highest-prof'] || 0
    );

    // 3. Final Attack Total: Attr + Prof + Item
    engine.registerFormula(
        `${id}-attack-total`,
        [`${id}-attack-attr`, `${id}-attack-prof`, `${id}-attack-item`],
        (vals) =>
            (vals[`${id}-attack-attr`] || 0) +
            (vals[`${id}-attack-prof`] || 0) +
            (vals[`${id}-attack-item`] || 0)
    );

    // --- D. Subscribe Readonly Display Inputs ---
    const attrInput = document.getElementById(`${id}-attack-attr`);
    const profInput = document.getElementById(`${id}-attack-prof`);
    const totalInput = document.getElementById(`${id}-attack-total`);

    if (attrInput) {
        engine.subscribe(`${id}-attack-attr`, (val) => { attrInput.value = val; });
    }
    if (profInput) {
        engine.subscribe(`${id}-attack-prof`, (val) => { profInput.value = val; });
    }
    if (totalInput) {
        engine.subscribe(`${id}-attack-total`, (val) => { totalInput.value = val; });
    }
}