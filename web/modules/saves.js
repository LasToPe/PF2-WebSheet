import { renderTemplate } from "../scripts/template-renderer.js";

function injectSaves() {
    const SAVES_DATA = [
        { id: 'fort', label: 'Fortitude', attr: 'Con' },
        { id: 'ref', label: 'Reflex', attr: 'Dex' },
        { id: 'will', label: 'Will', attr: 'Wis' }
    ];

    const fragment = renderTemplate('save-template', SAVES_DATA, ['id', 'label', 'attr']);

    const savesArea = document.getElementById('saves-area');
    const notesContainer = document.getElementById('defenses-notes-container');
    savesArea.insertBefore(fragment, notesContainer);
}

injectSaves();
