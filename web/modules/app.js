// modules/engine.js
import { CalculationEngine } from '../scripts/calc-graph.js';
import { initAttributes } from './attributes.js';
import { initArmorAndShield } from './armor.js';
import { initSaves } from './saves.js';
import { initSkills } from './skills.js';
import { initPerception } from './perception.js';
import { initWeapons } from './weapons.js';

// Export a single shared instance
export const engine = new CalculationEngine();

// Register global roots immediately so downstream formulas don't compute against undefined
engine.registerSource('level', 1);
['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(attr => {
    engine.registerSource(attr, 0);
});

document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Initialize global root inputs (Tier 0)
    const levelInput = document.getElementById('level');
    const initialLevel = Number(levelInput?.value) || 1;
    engine.registerSource('level', initialLevel);

    // Step 2: Initialize UI modules in dependency order
    initAttributes(engine);
    initArmorAndShield(engine);
    initSaves(engine);
    initSkills(engine);
    initPerception(engine);
    initWeapons(engine);

    // Step 3: Attach global delegation listener for user edits
    document.addEventListener('input', (e) => {
        const { stat, calc } = e.target.dataset;
        if (!stat) return;

        const key = calc && calc !== 'attr' ? e.target.id : stat;
        const val = e.target.type === 'number' ? (Number(e.target.value) || 0) : e.target.value;

        engine.updateSource(key, val);
    });

    document.addEventListener('prof-change', (e) => {
        const { id, rank } = e.detail; // rank is 0, 2, 4, 6, or 8
        engine.updateSource(`${id}-rank`, rank);
    });
});