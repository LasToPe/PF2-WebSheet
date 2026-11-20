import { renderTemplate } from "../scripts/template-renderer.js";

const INVENTORY_SECTIONS = [
    {
        containerId: "held-items-container",
        templateId: "inventory-row-template",
        prefix: "held",
        count: 15
    },
    {
        containerId: "consumables-container",
        templateId: "inventory-row-template",
        prefix: "consumable",
        count: 10
    },
    {
        containerId: "worn-items-container",
        templateId: "inventory-row-template-worn",
        prefix: "worn",
        count: 15
    },
    {
        containerId: "gems-container",
        templateId: "inventory-row-template-gems",
        prefix: "gems",
        count: 5
    }
];

export function initInventory(engine) {
    INVENTORY_SECTIONS.forEach(({ containerId, templateId, prefix, count }) => {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container '${containerId}' not found.`);
            return;
        }

        const rowData = Array.from({ length: count }, (_, index) => ({
            id: `inventory-${prefix}-${index + 1}`
        }));

        const fragment = renderTemplate(templateId, rowData, ["id"]);
        container.appendChild(fragment);
    });

    setupBulkNodes(engine);
}

function setupBulkNodes(engine) {
    if (!engine) {
        console.error("Calculation engine not attached.");
        return;
    }

    // --- B. Register Bulk Sources ---
    const dependencies = [];
    INVENTORY_SECTIONS.forEach(({ prefix, count }) => {
        for (let i = 1; i <= count; i++) {
            const key = `inventory-${prefix}-${i}-bulk`;
            const input = document.getElementById(key);
            engine.registerSource(key, input && input.value !== '' ? Number(input.value) : 0);
            dependencies.push(key);
        }
    });

    /*
     * --- Future: Coins Bulk (1,000 coins = 1 Bulk) ---
     */

    // --- C. Register Formula Node ---
    engine.registerFormula("bulk-total", dependencies, (vals) => {
        let sum = 0;
        dependencies.forEach((dep) => sum += vals[dep]);
        return Math.floor(sum);
    });

    // --- D. Subscribe Readonly Display Input ---
    const totalInput = document.getElementById("bulk-total");
    if (totalInput) {
        totalInput.value = engine.get("bulk-total");
        engine.subscribe("bulk-total", (val) => { totalInput.value = val; });
    }
}