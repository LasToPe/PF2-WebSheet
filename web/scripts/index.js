async function injectHtml(filepath, element) {
    const response = await fetch(filepath);
    if (!response.ok) {
        console.error("failed fetching module");
    }

    const content = await response.text();
    element.innerHTML = content;
}

function injectModules() {
    document.querySelectorAll("div[include]")
        .forEach(e => injectHtml(e.getAttribute("include"), e));
}

injectModules();