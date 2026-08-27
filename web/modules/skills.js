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

    const container = document.getElementById('skills-container');
    const template = document.getElementById('skill-template');

    // Create a new fragment to avoid issues with the existing DOM
    const fragment = document.createDocumentFragment();
    
    SKILLS_DATA.forEach(skill => {
        // Clone the template for each skill
        const clone = template.content.cloneNode(true);
        
        // Replace placeholders
        replacePlaceholders(clone, skill);

        // Handle 4-part skills (Str and Dex)
        if (skill.attr === 'Str' || skill.attr === 'Dex') {
            handleFourPartSkill(clone, skill);
        }
        fragment.appendChild(clone);
    });

    container.appendChild(fragment);
}

// Helper function to replace placeholders
function replacePlaceholders(node, skill) {
    
    // Internal helper to replace matched keys
    const replace = (str) => str.replace(/{{(id|label|attr)}}/g, (_, key) => skill[key] ?? '');

    const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );

    let currentNode;
    while (currentNode = walker.nextNode()) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode.textContent = replace(currentNode.textContent);
        } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
            for (const attr of currentNode.attributes) {
                attr.value = replace(attr.value);
            }
        }
    }
}

// Helper function to handle 4-part skills
function handleFourPartSkill(clone, skill) {
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
}
