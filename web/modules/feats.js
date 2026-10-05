import { renderTemplate } from "../scripts/template-renderer.js";

injectFeatRows();

function injectFeatRows() {
    const FEATS_DATA = Array.from({ length: 19 }, (_, i) => {
        const level = i + 2;
        const isEven = level % 2 === 0;

        return {
            level,
            featType: isEven
                ? 'Skill Feat'
                : (level % 4 === 1 ? 'Ancestry Feat' : 'General Feat'),
            classFeatType: isEven
                ? 'Class Feat'
                : 'Class Feature',
            hasBoost: level % 5 === 0,
        };
    });

    const container = document.querySelector('.abilities-table');

    const fragment = renderTemplate(
        'feat-row-template',
        FEATS_DATA,
        ['level', 'featType', 'classFeatType'],
        (clone, data) => {
            if (!data.hasBoost) {
                clone.querySelector('.boost-tag')?.remove();
            }
        }
    );

    container.appendChild(fragment);
}