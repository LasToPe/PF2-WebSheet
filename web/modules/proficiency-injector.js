function injectProficiencies(data, templateId, containerId) {
    const dataArray = data;
    const container = document.getElementById(containerId);
    const template = document.getElementById(templateId);

    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');

    dataArray.forEach(item => {
        wrapper.appendChild(template.content.cloneNode(true));
        let htmlString = wrapper.innerHTML;

        Object.keys(item).forEach(key => {
            htmlString = htmlString.replaceAll(`{{${key}}}`, item[key]);
        });

        wrapper.innerHTML = htmlString;
        fragment.appendChild(wrapper.firstElementChild);
        wrapper.innerHTML = '';
    });

    container.appendChild(fragment);
}