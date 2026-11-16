import { renderTemplate } from "../scripts/template-renderer.js";

const ATTRIBUTES_DATA = [
    { id: 'strength', label: 'Strength', key: 'str' },
    { id: 'dexterity', label: 'Dexterity', key: 'dex' },
    { id: 'constitution', label: 'Constitution', key: 'con' },
    { id: 'intelligence', label: 'Intelligence', key: 'int' },
    { id: 'wisdom', label: 'Wisdom', key: 'wis' },
    { id: 'charisma', label: 'Charisma', key: 'cha' }
];

export function initAttributes(engine) {
    const container = document.getElementById('attributes');

    if (!container) { 
        console.error(`Container 'attributes' not found.`);
        return;
    }

    const fragment = renderTemplate('attribute-template', ATTRIBUTES_DATA, ['id', 'label', 'key']);
    container.appendChild(fragment);

    ATTRIBUTES_DATA.forEach(attribute => setupAttributeNodes(attribute, engine));
}

function setupAttributeNodes(attribute, engine) {
    if (!engine) {
        console.error('Calculation engine not attached.');
        return;
    }

    const input = document.getElementById(`${attribute.id}`);
    const initialValue = input && input.value !== "" ? Number(input.value) : 0;

    engine.registerSource(attribute.key, initialValue);

    engine.subscribe(attribute.key, (val) => {
        if (input && Number(input.value) !== val) {
            input.value = val;
        }
    });
}