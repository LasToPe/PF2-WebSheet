/**
 * Proficiency Container - A standalone Web Component for PF2e proficiency indicators
 * 
 * Usage examples:
 * 
 * // Declarative HTML usage with custom attributes:
 * <prof-container label="Shield" type="armor"></prof-container>
 * 
 * // Programmatic creation:
 * const container = document.createElement('prof-container');
 * container.setAttribute('label', 'Medicine');
 * container.setAttribute('type', 'skill');
 * document.body.appendChild(container);
 */

class ProficiencyContainer extends HTMLElement {
    static get observedAttributes() {
        return ['id', 'label'];
    }

    constructor() {
        super();
        this.profLevels = [
            { id: 'trained', label: 'T' },
            { id: 'expert', label: 'E' },
            { id: 'master', label: 'M' },
            { id: 'legendary', label: 'L' }
        ];

        this.attachShadow({ mode: 'open' });
    }

    get componentId() {
        if (this.getAttribute('id')) {
            return this.getAttribute('id');
        }

        if (!this._generatedId) {
            const length = 8;
            const bytes = new Uint8Array(Math.ceil(8 / 2));
            crypto.getRandomValues(bytes);
            this._generatedId = Array.from(bytes, byte => byte.toString(16).padStart(2, '0'))
                                .join('')
                                .slice(0, length);
        }
        return this._generatedId;
    }

    connectedCallback() {
        this._renderTemplate();
    }

    _renderTemplate() {
        const idAttribute = this.componentId;
        // const labelAttribute = this.getAttribute('label');

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./styles/proficiency-container.css" />
            <span class="prof-container">
                ${this.profLevels.map((level, index) => {
                    return `
                        <span class="prof-check-container" style="z-index: ${4 - index}">
                            <input type="radio" 
                                   name="prof-${idAttribute}-group"
                                   id="prof-${idAttribute}-${level.id}">
                            <label for="prof-${idAttribute}-${level.id}">${level.label}</label>
                        </span>
                    `;
                }).join('')}
            </span>
        `;
    }
}

// Register custom element
if (typeof customElements !== 'undefined' && !customElements.get('prof-container')) {
    customElements.define('prof-container', ProficiencyContainer);
}

// Provide global API for programmatic usage (for compatibility with existing code)
if (typeof window !== 'undefined') {
    window.ProficiencyContainer = ProficiencyContainer;
}