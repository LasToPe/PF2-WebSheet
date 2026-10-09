import { renderTemplate } from "../scripts/template-renderer.js";

injectInventoryRows();

function injectInventoryRows() {
    const INVENTORY_SECTIONS = [
        {
            containerId: "held-items-container",
            prefix: "held",
            count: 10
        },
        {
            containerId: "consumables-container",
            prefix: "consumable",
            count: 10
        },
        {
            containerId: "worn-items-container",
            prefix: "worn",
            count: 15
        },
        {
            containerId: "gems-container",
            prefix: "gem",
            count: 5
        }
    ];

    const handleRowType = (clone, data) => {
        if (data.id.includes('held') || data.id.includes('consumable')) {
            clone.querySelector('.inventory-row').classList.add('held-consumables');
            clone.querySelector('.invested-cell')?.remove();
            clone.querySelector('.item-price-input')?.remove();
            return;
        }

        if (data.id.includes('worn')) {
            clone.querySelector('.inventory-row').classList.add('worn');
            clone.querySelector('.item-price-input')?.remove();
            return;
        }

        if (data.id.includes('gem')) {
            clone.querySelector('.inventory-row').classList.add('gems');
            clone.querySelector('.invested-cell')?.remove();
            return;
        }
    }

    INVENTORY_SECTIONS.forEach(({ containerId, prefix, count }) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const rowData = Array.from({ length: count }, (_, index) => ({
            id: `inventory-${prefix}-${index + 1}`
        }));

        const fragment = renderTemplate('inventory-row-template', rowData, ["id"], handleRowType);
        container.appendChild(fragment);
    });
}