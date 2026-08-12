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
    const template = document.getElementById('attribute-template');

    const fragment = document.createDocumentFragment();

    // Temp div used to parse HTML strings back into DOM nodes
    const wrapper = document.createElement('div');

    ATTRIBUTES_DATA.forEach(attr => {
        wrapper.appendChild(template.content.cloneNode(true));
        let htmlString = wrapper.innerHTML;
        
        htmlString = htmlString
        .replaceAll('{{id}}', attr.id)
        .replaceAll('{{label}}', attr.label);
        
        wrapper.innerHTML = htmlString;
        fragment.appendChild(wrapper.firstElementChild);
        wrapper.innerHTML = ''; // reset for next iteration
    });

    container.appendChild(fragment);
}

injectAttributes();