import { renderTemplate } from "../scripts/template-renderer.js";

injectInventoryRows();

function injectInventoryRows() {
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

    INVENTORY_SECTIONS.forEach(({ containerId, templateId, prefix, count }) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const rowData = Array.from({ length: count }, (_, index) => ({
            id: `inventory-${prefix}-${index + 1}`
        }));

        const fragment = renderTemplate(templateId, rowData, ["id"]);
        container.appendChild(fragment);
    });
}
