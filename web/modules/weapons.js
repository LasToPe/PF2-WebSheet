import { renderTemplate } from "../scripts/template-renderer.js";

injectWeapons();

function injectWeapons() {
    const WEAPONS_DATA = [
        { id: 'weapon-1', attr: 'Str' },
        { id: 'weapon-2', attr: 'Str' },
        { id: 'weapon-3', attr: 'Str' },
        { id: 'weapon-4', attr: 'Dex' },
        { id: 'weapon-5', attr: 'Dex' },
    ];

    const container = document.getElementById('strikes');

    const fragment = renderTemplate('weapon-block-template', WEAPONS_DATA, ['id', 'attr']);

    container.appendChild(fragment);
}