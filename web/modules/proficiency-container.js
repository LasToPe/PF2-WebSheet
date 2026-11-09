/**
 * Proficiency Container - A standalone Web Component for PF2e proficiency indicators
 * 
 * Usage examples:
 * 
 * // Declarative HTML usage with custom attributes:
 * <prof-container id="acrobatics" label="Acrobatics"></prof-container>
 * 
 * // Programmatic creation:
 * const container = document.createElement('prof-container');
 * container.setAttribute('id', 'medicine');
 * container.setAttribute('label', 'Medicine');
 * document.body.appendChild(container);
 */

class ProficiencyContainer extends HTMLElement {
    static get observedAttributes() {
        return ['id', 'label'];
    }

    constructor() {
        super();
        this.profLevels = [
            { id: 'trained', label: 'T', tier: 1, bonus: 2 },
            { id: 'expert', label: 'E', tier: 2, bonus: 4 },
            { id: 'master', label: 'M', tier: 3, bonus: 6 },
            { id: 'legendary', label: 'L', tier: 4, bonus: 8 }
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

    get value() {
        const checked = this.shadowRoot.querySelector('input[type="radio"]:checked');
        return checked ? checked.value : 'untrained';
    }

    set value(levelId) {
        const radios = this.shadowRoot.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.checked = radio.value === levelId;
        });
        this.dataset.prof = levelId;
    }

    connectedCallback() {
        // Tag the host custom element for document-level event delegation
        this.dataset.stat = this.componentId;
        this.dataset.calc = 'prof';
        this.dataset.prof = this.value;

        this._renderTemplate();
        this._attachEventListeners();
    }

    _attachEventListeners() {
        const radios = this.shadowRoot.querySelectorAll('input[type="radio"]');
        
        radios.forEach(radio => {
            // Allows unchecking an active radio to return to "Untrained"
            radio.addEventListener('click', (e) => {
                if (this._lastCheckedRadio === radio) {
                    radio.checked = false;
                    this._lastCheckedRadio = null;
                    this.dataset.prof = 'untrained';
                    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
                } else {
                    this._lastCheckedRadio = radio;
                    this.dataset.prof = radio.value;
                }
            });
        });
    }

    _renderTemplate() {
        const idAttribute = this.componentId;

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./styles/proficiency-container.css" />
            <span class="prof-container">
                ${this.profLevels.map((level, index) => {
                    return `
                        <span class="prof-check-container" style="z-index: ${4 - index}">
                            <input type="radio" 
                                   name="${idAttribute}-proficiency"
                                   id="prof-${idAttribute}-${level.id}"
                                   value="${level.id}"
                                   data-stat="${idAttribute}"
                                   data-calc="prof"
                                   data-prof="${level.id}"
                                   data-bonus="${level.bonus}">
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

// Provide global API for programmatic usage
if (typeof window !== 'undefined') {
    window.ProficiencyContainer = ProficiencyContainer;
}