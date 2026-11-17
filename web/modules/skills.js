import { renderTemplate } from '../scripts/template-renderer.js';

const SKILLS_DATA = [
    { id: 'acrobatics', label: 'Acrobatics', attr: 'Dex' },
    { id: 'arcana', label: 'Arcana', attr: 'Int' },
    { id: 'athletics', label: 'Athletics', attr: 'Str' },
    { id: 'crafting', label: 'Crafting', attr: 'Int' },
    { id: 'deception', label: 'Deception', attr: 'Cha' },
    { id: 'diplomacy', label: 'Diplomacy', attr: 'Cha' },
    { id: 'Intimidation', label: 'Intimidation', attr: 'Cha' },
    { id: 'lore-1', label: 'Lore', attr: 'Int' },
    { id: 'lore-2', label: 'Lore', attr: 'Int' },
    { id: 'medicine', label: 'Medicine', attr: 'Wis' },
    { id: 'nature', label: 'Nature', attr: 'Wis' },
    { id: 'occultism', label: 'Occultism', attr: 'Int' },
    { id: 'performance', label: 'Performance', attr: 'Cha' },
    { id: 'religion', label: 'Religion', attr: 'Wis' },
    { id: 'society', label: 'Society', attr: 'Int' },
    { id: 'stealth', label: 'Stealth', attr: 'Dex' },
    { id: 'survival', label: 'Survival', attr: 'Wis' },
    { id: 'thievery', label: 'Thievery', attr: 'Dex' }
];

export function initSkills(engine) {
    const container = document.getElementById('skills-container');
    if (!container || container.querySelector('.skill-block')) {
        console.error("Container 'skills-container' or 'skill-block' not found.");
        return;
    }

    // Render all skills through the shared template engine.
    const fragment = renderTemplate('skill-template', SKILLS_DATA, ['id', 'label', 'attr'], handleFourPartSkill);
    container.appendChild(fragment);

    SKILLS_DATA.forEach(skill => setupSkillNodes(skill, engine));
}

// Per-item customization hook for 4-part skills (Str/Dex).
function handleFourPartSkill(clone, skill) {
    // Only apply the 4-part treatment to Str/Dex skills.
    if (skill.attr !== 'Str' && skill.attr !== 'Dex') return;

    const calcContainer = clone.querySelector('.calc-input-container');
    if (!calcContainer) return;

    // Update the container class to skill-4-part
    calcContainer.className = 'calc-input-container skill-4-part';

    // Add armor input field for 4-part skills (Str/Dex)
    const inputs = calcContainer.querySelectorAll('input');
    if (inputs.length === 3) { // Only 3 inputs - we need to add one more
        const spacer = document.createElement('span');
        spacer.className = 'plus-minus-spacer';
        spacer.textContent = '-';

        const armorInput = document.createElement('input');
        armorInput.value = '';
        armorInput.id = `${skill.id}-armor`;
        armorInput.name = `${skill.id}-armor`;
        armorInput.dataset.stat = skill.id;
        armorInput.dataset.calc = 'armor';
        armorInput.type = 'number';

        // Insert the new elements in correct order: attr, prof, item, armor
        calcContainer.appendChild(spacer);
        calcContainer.appendChild(armorInput);
    }

    // Update labels for 4-part skills to include Armor
    const labelsContainer = clone.querySelector('.calc-labels');
    if (labelsContainer && !labelsContainer.innerHTML.includes('Armor')) {
        const label = document.createElement('label');
        label.textContent = 'Armor';
        labelsContainer.appendChild(label);
    }
};

function setupSkillNodes(skill, engine) {
    if (!engine) {
        console.error('Calculation engine not attached.');
        return;
    }

    const id = skill.id;
    const attrKey = skill.attr.toLowerCase(); // 'Str', 'Dex', 'Int', 'Wis', 'Cha'
    const hasArmorPenalty = skill.attr === 'Str' || skill.attr === 'Dex';

    // --- A. Register Sources ---
    engine.registerSource(`${id}-rank`, 0); // 0 = U, 2 = T, 4 = E, 6 = M, 8 = L

    const itemInput = document.getElementById(`${id}-item`);
    const initialItem = itemInput && itemInput.value !== '' ? Number(itemInput.value) : 0;
    engine.registerSource(`${id}-item`, initialItem);

    if (hasArmorPenalty) {
        const armorInput = document.getElementById(`${id}-armor`);
        const initialArmor = armorInput && armorInput.value !== '' ? Number(armorInput.value) : 0;
        engine.registerSource(`${id}-armor`, initialArmor);
    }

    // --- B. Register Formula Nodes ---

    // 1. Attribute Modifier (mirrors Str, Dex, Int, Wis, or Cha)
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

    // 3. Final Total: Attr + Prof + Item (- Armor for Str/Dex skills)
    const totalDeps = hasArmorPenalty
        ? [`${id}-attr`, `${id}-prof`, `${id}-item`, `${id}-armor`]
        : [`${id}-attr`, `${id}-prof`, `${id}-item`];

    engine.registerFormula(
        `${id}-total`,
        totalDeps,
        (vals) => {
            const base = (vals[`${id}-attr`] || 0) + (vals[`${id}-prof`] || 0) + (vals[`${id}-item`] || 0);
            return hasArmorPenalty ? base - (vals[`${id}-armor`] || 0) : base;
        }
    );

    // --- C. Subscribe Readonly Display Inputs ---
    const attrInput = document.getElementById(`${id}-attr`);
    const profInput = document.getElementById(`${id}-prof`);
    const totalInput = document.getElementById(`${id}-total`);

    if (attrInput) {
        engine.subscribe(`${id}-attr`, (val) => { attrInput.value = val; });
        if (engine.get(`${id}-attr`) !== 0) attrInput.value = engine.get(`${id}-attr`);
    }
    if (profInput) {
        engine.subscribe(`${id}-prof`, (val) => { profInput.value = val; });
        if (engine.get(`${id}-prof`) !== 0) profInput.value = engine.get(`${id}-prof`);
    }
    if (totalInput) {
        engine.subscribe(`${id}-total`, (val) => { totalInput.value = val; });
        if (engine.get(`${id}-total`) !== 0) totalInput.value = engine.get(`${id}-total`);
    }
}