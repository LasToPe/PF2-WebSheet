import { renderTemplate } from "../scripts/template-renderer.js";

injectSpellSlots();
injectFixedSpellTables();
injectDynamicSpellTables();

/**
 * Injects input fields for the 10 ranks of spell slots (Spells per Day & Remaining)
 */
function injectSpellSlots() {
    const perDayTrack = document.getElementById("spells-per-day-slots");
    const remainingTrack = document.getElementById("spells-remaining-slots");

    if (perDayTrack) {
        for (let i = 1; i <= 10; i++) {
            const box = document.createElement("div");
            box.className = "spells-per-day-container";
            box.innerHTML = `<input type="number" id="spell-slot-day-${i}" min="0">`;
            perDayTrack.appendChild(box);
        }
    }

    if (remainingTrack) {
        for (let i = 1; i <= 10; i++) {
            const box = document.createElement("div");
            box.className = "remaining-slot-box";
            box.innerHTML = `<input type="number" id="spell-slot-rem-${i}" min="0">`;
            remainingTrack.appendChild(box);
        }
    }
}

/**
 * Populates all rows for Cantrips, Focus Spells, Innate Spells, Spells, and Rituals
 */
function injectFixedSpellTables() {
    const FIXED_TABLES_CONFIG = [
        {
            containerId: "focus-rows-container",
            templateId: "focus-spell-row-template",
            prefix: "focus",
            count: 15
        },
        {
            containerId: "innate-rows-container",
            templateId: "innate-spell-row-template",
            prefix: "innate",
            count: 8
        },
        {
            containerId: "rituals-left-subcolumn",
            templateId: "ritual-row-template",
            prefix: "ritual-col1",
            count: 5
        },
        {
            containerId: "rituals-right-subcolumn",
            templateId: "ritual-row-template",
            prefix: "ritual-col2",
            count: 5
        }
    ];

    FIXED_TABLES_CONFIG.forEach(({ containerId, templateId, prefix, count }) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const rowData = Array.from({ length: count }, (_, i) => ({
            id: `${prefix}-${i + 1}`
        }));

        const fragment = renderTemplate(templateId, rowData, ["id"]);
        container.appendChild(fragment);
    });
}

function injectDynamicSpellTables() {
    const DYNAMIC_TABLES_CONFIG = [
        {
            sectionId: "cantrips-section",
            containerId: "cantrips-rows-container",
            templateId: "cantrip-row-template",
            prefix: "cantrip",
            count: 25
        },
        {
            sectionId: "main-spells-section",
            containerId: "spells-left-subcolumn",
            templateId: "main-spell-row-template",
            prefix: "spell-col1",
            count: 27
        },
        {
            sectionId: "main-spells-section",
            containerId: "spells-right-subcolumn",
            templateId: "main-spell-row-template",
            prefix: "spell-col2",
            count: 27
        }
    ];

    const ROW_HEIGHT = 20;

    DYNAMIC_TABLES_CONFIG.forEach(({ sectionId, containerId, templateId, prefix, count }) => {
        const section = document.getElementById(sectionId);
        const container = document.getElementById(containerId);
        if (!section || !container) return;

        // Measure table's allocated height
        let nonTableHeight = 0;
        for (const child of section.children) {
            if (!child.contains(container)) {
                nonTableHeight += child.offsetHeight 
                               + parseFloat(window.getComputedStyle(child).marginTop) 
                               + parseFloat(window.getComputedStyle(child).marginBottom);
            } else {
                nonTableHeight += parseFloat(window.getComputedStyle(child).marginTop) 
                               + parseFloat(window.getComputedStyle(child).marginBottom);
            }
        }

        const tableHeader = container.closest(".spell-table").querySelector(".spell-table-header");
        const availableHeight = section.clientHeight - nonTableHeight - tableHeader.offsetHeight;
        console.log(availableHeight);
        const rowCount = Math.max(1, Math.floor(availableHeight / ROW_HEIGHT));
        console.log(rowCount);

        const rowData = Array.from({ length: rowCount }, (_, i) => ({
            id: `${prefix}-${i + 1}`
        }));

        const fragment = renderTemplate(templateId, rowData, ["id"]);
        container.appendChild(fragment);
    });
}