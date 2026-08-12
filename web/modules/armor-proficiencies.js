function injectArmorProficiencies() {
    const ARMOR_PROFS = [
        { id: 'unarmored', label: 'Unarmored' },
        { id: 'light', label: 'Light' },
        { id: 'medium', label: 'Medium' },
        { id: 'heavy', label: 'Heavy' }
    ];

    const container = document.getElementById('armor-proficiencies');
    const template = document.getElementById('armor-prof-template');

    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');

    ARMOR_PROFS.forEach(prof => {
        wrapper.appendChild(template.content.cloneNode(true));
        let htmlString = wrapper.innerHTML;

        htmlString = htmlString
            .replaceAll('{{id}}', prof.id)
            .replaceAll('{{label}}', prof.label);

        wrapper.innerHTML = htmlString;
        fragment.appendChild(wrapper.firstElementChild);
        wrapper.innerHTML = '';
    });

    container.appendChild(fragment);
}

injectArmorProficiencies();
