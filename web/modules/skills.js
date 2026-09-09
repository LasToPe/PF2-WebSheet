import { renderTemplate } from '../scripts/template-renderer.js';

injectSkills();

function injectSkills() {
    const SKILLS_DATA = [
        { id: 'acrobatics', label: 'Acrobatics', attr: 'Dex' },
        { id: 'arcana', label: 'Arcana', attr: 'Int' },
        { id: 'athletics', label: 'Athletics', attr: 'Str' },
        { id: 'crafting', label: 'Crafting', attr: 'Int' },
        { id: 'deception', label: 'Deception', attr: 'Cha' },
        { id: 'diplomacy', label: 'Diplomacy', attr: 'Cha' },
        { id: 'intimidation', label: 'Intimidation', attr: 'Cha' },
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

    // Keys this template is expected to render.
    const SKILLS_KEYS = ['id', 'label', 'attr'];

    // Per-item customization hook for 4-part skills (Str/Dex).
    const handleFourPartSkill = (clone, skill) => {
        // Only apply the 4-part treatment to Str/Dex skills.
        if (skill.attr !== 'Str' && skill.attr !== 'Dex') return;

        const calcContainer = clone.querySelector('.calc-input-container');
        if (!calcContainer) return;

        // Update the container class to skill-4-part
        calcContainer.className = "calc-input-container skill-4-part";

        // Add armor input field for 4-part skills (Str/Dex)
        const inputs = calcContainer.querySelectorAll('input');
        if (inputs.length === 3) { // Only 3 inputs - we need to add one more
            const spacer = document.createElement('span');
            spacer.className = "plus-minus-spacer";
            spacer.textContent = "-";

            const armorInput = document.createElement('input');
            armorInput.type = "text";
            armorInput.value = "";

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

    const container = document.getElementById('skills-container');

    // Render all skills through the shared template engine.
    const fragment = renderTemplate('skill-template', SKILLS_DATA, SKILLS_KEYS, handleFourPartSkill);

    container.appendChild(fragment);
}
