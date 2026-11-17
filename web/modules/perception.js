export function initPerception(engine) {
    if (!engine) {
        console.error('Calculation engine not attached.');
        return;
    }

    const id = 'perception';
    const attrKey = 'wis';

    // --- A. Register Sources ---
    engine.registerSource(`${id}-rank`, 0); // 0 = U, 2 = T, 4 = E, 6 = M, 8 = L

    const itemInput = document.getElementById(`${id}-item`);
    const initialItem = itemInput && itemInput.value !== "" ? Number(itemInput.value) : 0;
    engine.registerSource(`${id}-item`, initialItem);

    // --- B. Register Formula Nodes ---

    // 1. Attribute Modifier (mirrors wis)
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