import { renderTemplate } from "../scripts/template-renderer.js";

injectAttributes();

function injectAttributes() {
    const ATTRIBUTES_DATA = [
        { id: 'strength', label: 'Strength', key: 'str' },
        { id: 'dexterity', label: 'Dexterity', key: 'dex' },
        { id: 'constitution', label: 'Constitution', key: 'con' },
        { id: 'intelligence', label: 'Intelligence', key: 'int' },
        { id: 'wisdom', label: 'Wisdom', key: 'wis' },
        { id: 'charisma', label: 'Charisma', key: 'cha' }
    ];

    const container = document.getElementById('attributes');

    const fragment = renderTemplate('attribute-template', ATTRIBUTES_DATA, ['id', 'label', 'key']);

    container.appendChild(fragment);
}