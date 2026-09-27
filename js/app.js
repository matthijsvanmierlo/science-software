// js/app.js
// Main Application Core: Event Bus and UI Bindings

import { Storage } from './storage.js';
import { Exporter } from './exporter.js';
import { GlasswareLibrary } from './glassware-library.js';
import { ChemicalEngine } from './chemical-engine.js';

let canvas = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Only initialize canvas on the Studio page
    if (!document.getElementById('main-canvas')) return;

    // Initialize Fabric.js
    const wrapper = document.getElementById('canvas-wrapper');
    canvas = new fabric.Canvas('main-canvas', {
        width: wrapper.clientWidth - 40,
        height: wrapper.clientHeight - 40,
        backgroundColor: 'white',
        selection: true
    });

    // Add canvas container class for CSS styling
    canvas.wrapperEl.classList.add('canvas-container');

    // Handle Window Resize
    window.addEventListener('resize', () => {
        canvas.setWidth(wrapper.clientWidth - 40);
        canvas.setHeight(wrapper.clientHeight - 40);
        canvas.renderAll();
    });

    // Try loading autosaved state
    const loaded = await Storage.loadState(canvas, 'autosave');

    // Initialize Autosave loop
    Storage.initAutosave(canvas, 3000);

    // Bind UI Buttons
    document.getElementById('btn-add-beaker').addEventListener('click', () => {
        GlasswareLibrary.addGlassware(canvas, 'beaker', canvas.width/2, canvas.height/2, 50, '#3498db');
    });

    document.getElementById('btn-add-flask').addEventListener('click', () => {
        GlasswareLibrary.addGlassware(canvas, 'flask', canvas.width/2, canvas.height/2, 50, '#e74c3c');
    });

    document.getElementById('btn-add-molecule').addEventListener('click', () => {
        const smiles = prompt("Enter SMILES string (e.g., C1=CC=CC=C1 for Benzene):", "C1=CC=CC=C1");
        if (smiles) {
            ChemicalEngine.addMoleculeToCanvas(canvas, smiles, canvas.width/2, canvas.height/2);
        }
    });

    // Handle Exports
    document.getElementById('btn-export-svg')?.addEventListener('click', () => Exporter.exportSVG(canvas));
    document.getElementById('btn-export-png')?.addEventListener('click', () => Exporter.exportPNG(canvas));
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => Exporter.exportPDF(canvas));

    // Handle Properties Panel
    const propsPanel = document.getElementById('glassware-props');
    const propFillLevel = document.getElementById('prop-fill-level');
    const propLiquidColor = document.getElementById('prop-liquid-color');

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
        propsPanel.classList.add('d-none');
    });

    function handleSelection(e) {
        const activeObj = canvas.getActiveObject();
        if (activeObj && (activeObj.customType === 'beaker' || activeObj.customType === 'flask')) {
            propsPanel.classList.remove('d-none');
            propFillLevel.value = activeObj.fillLevel;
            propLiquidColor.value = activeObj.liquidColor;

            // Remove previous listeners to avoid duplicates
            propFillLevel.oninput = null;
            propLiquidColor.oninput = null;

            // Bind new listeners
            propFillLevel.oninput = (ev) => {
                GlasswareLibrary.updateGlassware(canvas, canvas.getActiveObject(), parseInt(ev.target.value), propLiquidColor.value);
            };

            propLiquidColor.oninput = (ev) => {
                GlasswareLibrary.updateGlassware(canvas, canvas.getActiveObject(), parseInt(propFillLevel.value), ev.target.value);
            };
        } else {
            propsPanel.classList.add('d-none');
        }
    }

    // Keyboard Deletion
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            // Prevent deletion if typing in an input
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            const activeObjects = canvas.getActiveObjects();
            if (activeObjects.length) {
                canvas.discardActiveObject();
                activeObjects.forEach(obj => canvas.remove(obj));
            }
        }
    });
});

// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const btnTheme = document.getElementById('btn-toggle-theme');
    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            const html = document.documentElement;
            const icon = btnTheme.querySelector('i');
            if (html.getAttribute('data-bs-theme') === 'light') {
                html.setAttribute('data-bs-theme', 'dark');
                icon.classList.replace('bi-moon', 'bi-sun');
            } else {
                html.setAttribute('data-bs-theme', 'light');
                icon.classList.replace('bi-sun', 'bi-moon');
            }
        });
    }
});