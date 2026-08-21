function injectSaves() {
    const SAVES_DATA = [
        { id: 'fort', label: 'Fortitude', attr: 'Con' },
        { id: 'ref', label: 'Reflex', attr: 'Dex' },
        { id: 'will', label: 'Will', attr: 'Wis' }
    ];

    const template = document.getElementById('save-template');

    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');

    SAVES_DATA.forEach(save => {
        wrapper.appendChild(template.content.cloneNode(true));
        let htmlString = wrapper.innerHTML;

        htmlString = htmlString
            .replaceAll('{{id}}', save.id)
            .replaceAll('{{label}}', save.label)
            .replaceAll('{{attr}}', save.attr);

        wrapper.innerHTML = htmlString;
        fragment.appendChild(wrapper.firstElementChild);
        wrapper.innerHTML = '';
    });

    const savesArea = document.getElementById('saves-area');
    const notesContainer = document.getElementById('defenses-notes-container');
    savesArea.insertBefore(fragment, notesContainer);
}

injectSaves();
