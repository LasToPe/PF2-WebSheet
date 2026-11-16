const ARMOR_PROFICIENCIES = ['unarmored', 'light-armor', 'medium-armor', 'heavy-armor'];

/**
 * Initializes Armor Class, Armor Proficiencies, and Shield calculations.
 * Call from app.js alongside initSaves(engine).
 */
export function initArmorAndShield(engine) {
    initArmor(engine);
    initShield(engine);
}

function initArmor(engine) {
    if (!engine) {
        console.error('Calculation engine not attached.');
        return;
    }

    // --- A. Register Sources ---
    // Armor proficiency ranks (0 = U, 2 = T, 4 = E, 6 = M, 8 = L)
    ARMOR_PROFICIENCIES.forEach((type) => {
        engine.registerSource(`${type}-rank`, 0);
    });

    // Optional selector support: 'auto' uses highest rank, or set to one of ARMOR_PROFICIENCIES
    engine.registerSource('ac-armor-type', 'auto');

    // Optional Dex cap support (null = uncapped)
    engine.registerSource('ac-dex-cap', null);

    const baseInput = document.getElementById('ac-base');
    const dexInput = document.getElementById('ac-dex');
    const itemInput = document.getElementById('ac-item');

    engine.registerSource('ac-base', getNumericValue(baseInput, 10));
    engine.registerSource('ac-dex', getNumericValue(dexInput, 0));
    engine.registerSource('ac-item', getNumericValue(itemInput, 0));

    // --- B. Register Formula Nodes ---

    // 1. Active Armor Proficiency Rank
    engine.registerFormula(
        'ac-rank',
        ['ac-armor-type', ...ARMOR_PROFICIENCIES.map((type) => `${type}-rank`)],
        (vals) => {
            const selectedType = vals['ac-armor-type'];
            if (ARMOR_PROFICIENCIES.includes(selectedType)) {
                return vals[`${selectedType}-rank`] || 0;
            }
            return Math.max(...ARMOR_PROFICIENCIES.map((type) => vals[`${type}-rank`] || 0));
        }
    );

    // 2. Proficiency Bonus (Untrained = 0; Trained+ = rank + level)
    engine.registerFormula(
        'ac-prof',
        ['level', 'ac-rank'],
        (vals) => {
            const rank = vals['ac-rank'] || 0;
            const level = vals['level'] || 0;
            return rank === 0 ? 0 : rank + level;
        }
    );

    // 4. Final AC Total: Base + Dex + Prof + Item
    engine.registerFormula(
        'ac-total',
        ['ac-base', 'ac-dex', 'ac-prof', 'ac-item'],
        (vals) =>
            (vals['ac-base'] || 0) +
            (vals['ac-dex'] || 0) +
            (vals['ac-prof'] || 0) +
            (vals['ac-item'] || 0)
    );

    // --- C. Subscribe Display Inputs ---
    const profInput = document.getElementById('ac-prof');
    const totalInput = document.getElementById('ac-total');

    if (profInput) {
        engine.subscribe('ac-prof', (val) => { profInput.value = val; });
        profInput.value = engine.get('ac-prof');
    }

    if (totalInput) {
        engine.subscribe('ac-total', (val) => { totalInput.value = val; });
        totalInput.value = engine.get('ac-total');
    }
}

function initShield(engine) {
    if (!engine) {
        console.error('Calculation engine not attached.');
        return;
    }

    // --- A. Register Sources ---
    const acBonusInput = document.getElementById('shield-ac');
    const hardnessInput = document.getElementById('shield-hardness');
    const maxHpInput = document.getElementById('shield-max-hp');
    const hpInput = document.getElementById('shield-hp');
    const btInput = document.getElementById('shield-bt');

    engine.registerSource('shield-ac-bonus', getNumericValue(acBonusInput, 0));
    engine.registerSource('shield-hardness', getNumericValue(hardnessInput, 0));
    engine.registerSource('shield-max-hp', getNumericValue(maxHpInput, 0));
    engine.registerSource('shield-hp', getNumericValue(hpInput, 0));

    // --- B. Register Formula Nodes ---

    // Broken Threshold (BT) = floor(Max HP / 2)
    engine.registerFormula(
        'shield-bt',
        ['shield-max-hp'],
        (vals) => Math.floor((vals['shield-max-hp'] || 0) / 2)
    );

    // --- C. Subscribe Display Input ---
    if (btInput) {
        engine.subscribe('shield-bt', (val) => {
            if (document.activeElement !== btInput) {
                btInput.value = val;
            }
        });

        if (maxHpInput && maxHpInput.value !== '') {
            btInput.value = engine.get('shield-bt');
        }
    }
}

function getNumericValue(input, fallback = 0) {
    return input && input.value !== '' ? Number(input.value) : fallback;
}