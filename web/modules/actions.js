import { renderTemplate } from "../scripts/template-renderer.js";

injectActionBlocks();

function injectActionBlocks() {
    const cardCount = 5;

    // Standard Action & Activity entries
    const ACTIONS_DATA = Array.from({ length: cardCount }, (_, i) => ({
        id: `action-${i + 1}`
    }));

    // Free Action & Reaction entries
    const REACTIONS_DATA = Array.from({ length: cardCount }, (_, i) => ({
        id: `reaction-${i + 1}`
    }));

    document.getElementById('actions-and-reactions-grid')?.style.setProperty('--card-count', cardCount);

    const actionsContainer = document.getElementById("actions-cards-container");
    const reactionsContainer = document.getElementById("reactions-cards-container");

    if (actionsContainer) {
        const actionsFragment = renderTemplate(
            "action-activity-card-template",
            ACTIONS_DATA,
            ["id"]
        );
        actionsContainer.appendChild(actionsFragment);
    }

    if (reactionsContainer) {
        const reactionsFragment = renderTemplate(
            "free-reaction-card-template",
            REACTIONS_DATA,
            ["id"]
        );
        reactionsContainer.appendChild(reactionsFragment);
    }
}