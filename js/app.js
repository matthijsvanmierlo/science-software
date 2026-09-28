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

    // Bind UI Buttons - dynamic library
    const renderGraphicsList = (filterText = '') => {
        const listDiv = document.getElementById('graphics-list');
        listDiv.innerHTML = '';
        const lowerFilter = filterText.toLowerCase();

        GlasswareLibrary.catalog.forEach(item => {
            if (item.name.toLowerCase().includes(lowerFilter) || filterText === '') {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline-secondary text-start';
                btn.innerHTML = `<i class="bi ${item.icon}"></i> Add ${item.name}`;
                btn.onclick = () => {
                    GlasswareLibrary.addGlassware(canvas, item.id, canvas.width/2, canvas.height/2, { ...item.defaultProps });
                };
                listDiv.appendChild(btn);
            }
        });
    };

    renderGraphicsList();

    document.getElementById('graphics-search')?.addEventListener('input', (e) => {
        renderGraphicsList(e.target.value);
    });

    const moleculeModal = new bootstrap.Modal(document.getElementById('moleculeModal'), {
        keyboard: false
    });

    document.getElementById('btn-add-molecule').addEventListener('click', () => {
        moleculeModal.show();
        ChemicalEngine.activeEditingObject = null;
        // Delay initialization slightly to let modal render completely
        setTimeout(() => {
            ChemicalEngine.initComposer('chem-composer');
            ChemicalEngine.composer.setChemObj(null);
        }, 200);
    });

    document.getElementById('btn-insert-molecule')?.addEventListener('click', () => {
        if (ChemicalEngine.activeEditingObject) {
            // Update existing
            ChemicalEngine.getComposerMoleculeImage((dataUrl, kekuleJson) => {
                const imgObj = ChemicalEngine.activeEditingObject;
                imgObj.setSrc(dataUrl, () => {
                    imgObj.set({ kekuleJson: kekuleJson });
                    canvas.renderAll();
                    moleculeModal.hide();
                    ChemicalEngine.activeEditingObject = null;
                });
            });
        } else {
            // Add new
            ChemicalEngine.addMoleculeToCanvasFromComposer(canvas, canvas.width/2, canvas.height/2);
            moleculeModal.hide();
        }
    });

    // Handle Exports
    document.getElementById('btn-export-svg')?.addEventListener('click', () => Exporter.exportSVG(canvas));
    document.getElementById('btn-export-png')?.addEventListener('click', () => Exporter.exportPNG(canvas));
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => Exporter.exportPDF(canvas));

    // Handle Properties Panel
    const propsPanel = document.getElementById('dynamic-props');
    const propertiesContainer = document.getElementById('properties-panel');

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('mouse:dblclick', (e) => {
        if (e.target && e.target.customType === 'molecule') {
            moleculeModal.show();
            setTimeout(() => {
                ChemicalEngine.initComposer('chem-composer');
                if (e.target.kekuleJson) {
                    const mol = Kekule.IO.loadFormatData(e.target.kekuleJson, 'json');
                    ChemicalEngine.composer.setChemObj(mol);
                } else if (e.target.smiles) {
                    const mol = Kekule.IO.loadFormatData(e.target.smiles, 'smi');
                    ChemicalEngine.composer.setChemObj(mol);
                }

                // Store the active object so we can update it later instead of creating a new one
                ChemicalEngine.activeEditingObject = e.target;
            }, 200);
        }
    });

    canvas.on('selection:cleared', () => {
        propsPanel.classList.add('d-none');
        propertiesContainer.querySelector('.text-muted').classList.remove('d-none');
    });

    function handleSelection(e) {
        const activeObj = canvas.getActiveObject();
        if (activeObj && activeObj.customType && activeObj.customType !== 'molecule') {
            propertiesContainer.querySelector('.text-muted').classList.add('d-none');
            propsPanel.classList.remove('d-none');
            propsPanel.innerHTML = ''; // Clear existing props

            const props = activeObj.customProps || {};

            if ('fillLevel' in props) {
                const label = document.createElement('label');
                label.className = 'form-label small';
                label.innerText = 'Fill Level';
                const input = document.createElement('input');
                input.setAttribute('aria-label', label.innerText);
                input.type = 'range';
                input.className = 'form-range';
                input.min = '0';
                input.max = '100';
                input.value = props.fillLevel;
                input.oninput = (ev) => {
                    GlasswareLibrary.updateGlassware(canvas, canvas.getActiveObject(), { fillLevel: parseInt(ev.target.value) });
                };
                propsPanel.appendChild(label);
                propsPanel.appendChild(input);
            }

            if ('liquidColor' in props) {
                const label = document.createElement('label');
                label.className = 'form-label small';
                label.innerText = 'Liquid Color';
                const input = document.createElement('input');
                input.setAttribute('aria-label', label.innerText);
                input.type = 'color';
                input.className = 'form-control form-control-color w-100 mb-2';
                input.value = props.liquidColor;
                input.oninput = (ev) => {
                    GlasswareLibrary.updateGlassware(canvas, canvas.getActiveObject(), { liquidColor: ev.target.value });
                };
                propsPanel.appendChild(label);
                propsPanel.appendChild(input);
            }

            if ('flameSize' in props) {
                const label = document.createElement('label');
                label.className = 'form-label small';
                label.innerText = 'Flame Size';
                const input = document.createElement('input');
                input.setAttribute('aria-label', label.innerText);
                input.type = 'range';
                input.className = 'form-range';
                input.min = '0';
                input.max = '100';
                input.value = props.flameSize;
                input.oninput = (ev) => {
                    GlasswareLibrary.updateGlassware(canvas, canvas.getActiveObject(), { flameSize: parseInt(ev.target.value) });
                };
                propsPanel.appendChild(label);
                propsPanel.appendChild(input);
            }

            if ('temperature' in props) {
                const label = document.createElement('label');
                label.className = 'form-label small';
                label.innerText = 'Temperature (Visual)';
                const input = document.createElement('input');
                input.setAttribute('aria-label', label.innerText);
                input.type = 'range';
                input.className = 'form-range';
                input.min = '0';
                input.max = '100';
                input.value = props.temperature;
                input.oninput = (ev) => {
                    GlasswareLibrary.updateGlassware(canvas, canvas.getActiveObject(), { temperature: parseInt(ev.target.value) });
                };
                propsPanel.appendChild(label);
                propsPanel.appendChild(input);
            }
        } else {
            propsPanel.classList.add('d-none');
            propertiesContainer.querySelector('.text-muted').classList.remove('d-none');
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