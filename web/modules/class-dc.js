export function initClassDC(engine) {
    if (!engine) {
        console.error('Calculation engine not attached.');
        return;
    }

    // --- A. Register Sources ---
    const baseInput = document.getElementById('class-dc-base');
    const initialBase = baseInput && baseInput.value !== "" ? Number(baseInput.value) : 10;
    engine.registerSource('class-dc-base', initialBase);

    const keyInput = document.getElementById('class-dc-key');
    const initialKey = keyInput && keyInput.value !== "" ? Number(keyInput.value) : 0;
    engine.registerSource('class-dc-key', initialKey);

    const profInput = document.getElementById('class-dc-prof');
    const initialProf = profInput && profInput.value !== "" ? Number(profInput.value) : 0;
    engine.registerSource('class-dc-prof', initialProf);

    const itemInput = document.getElementById('class-dc-item');
    const initialItem = itemInput && itemInput.value !== "" ? Number(itemInput.value) : 0;
    engine.registerSource('class-dc-item', initialItem);

    // --- B. Register Formula Node ---
    engine.registerFormula(
        'class-dc-total',
        ['class-dc-base', 'class-dc-key', 'class-dc-prof', 'class-dc-item'],
        (vals) =>
            (vals['class-dc-base'] || 10) +
            (vals['class-dc-key'] || 0) +
            (vals['class-dc-prof'] || 0) +
            (vals['class-dc-item'] || 0)
    );

    // --- C. Subscribe Readonly Display Input ---
    const totalInput = document.getElementById('class-dc-total');
    if (totalInput) {
        engine.subscribe('class-dc-total', (val) => { totalInput.value = val; });
    }
}