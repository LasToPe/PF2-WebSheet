/**
 * Template Renderer — generic TreeWalker-based template engine.
 *
 * Shared across injection modules (attributes, saves, skills) so that DOM
 * instantiation, placeholder replacement, and fragment collection live in one
 * place. Each module keeps full control over *where* its rendered fragment is
 * mounted to the DOM.
 */

/**
 * Replace placeholder tokens for a single data item across a DOM subtree.
 *
 * Uses an explicit key list to compile a targeted regex, so only the tokens a
 * template is expected to use get substituted. Unmatched tokens are left as-is.
 *
 * @param {Node} node   Root node to walk (elements + text content).
 * @param {Object} data Data payload providing values for the listed keys.
 * @param {string[]} keys Valid placeholder key names. Falls back to
 *                        Object.keys(data) when omitted.
 * @returns {void}
 */
function replacePlaceholders(node, data, keys) {
    const keyList = keys; // all keys from the data object can be used instead: ?? Object.keys(data);
    // Targets only the declared keys, e.g. keys=['id','label'] -> /{{(id|label)}}/g
    const regex = new RegExp(`{{(${keyList.join('|')})}}`, 'g');

    const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );

    let current;
    while (current = walker.nextNode()) {
        if (current.nodeType === Node.TEXT_NODE) {
            current.textContent = current.textContent.replace(regex, (_, key) => data[key] ?? '');
        } else if (current.nodeType === Node.ELEMENT_NODE) {
            for (const attr of current.attributes) {
                attr.value = attr.value.replace(regex, (_, key) => data[key] ?? '');
            }
        }
    }
}

/**
 * Clone a template for each data row, apply placeholders, run an optional hook,
 * and collect the results into a DocumentFragment.
 *
 * @param {HTMLElement|string} template <template> element or its id selector.
 * @param {Object[]} dataArray           Rows to render.
 * @param {string[]} [keys]              Valid placeholder keys.
 * @param {Function} [itemHook]          Per-item customization: (clone, data) => void
 * @returns {DocumentFragment}
 */
function renderTemplate(template, dataArray, keys, itemHook) {
    const el = typeof template === 'string'
        ? document.getElementById(template)
        : template;

    if (!el) throw new Error(`Template not found: ${template}`);

    const fragment = document.createDocumentFragment();

    for (const item of dataArray) {
        const clone = el.content.cloneNode(true);
        replacePlaceholders(clone, item, keys);
        if (typeof itemHook === 'function') itemHook(clone, item);
        fragment.appendChild(clone);
    }

    return fragment;
}

export { renderTemplate, replacePlaceholders };
