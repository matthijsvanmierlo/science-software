import re

with open('js/app.js', 'r') as f:
    content = f.read()

# Replace the hardcoded buttons logic and properties handling
old_logic = """    // Bind UI Buttons
    document.getElementById('btn-add-beaker').addEventListener('click', () => {
        GlasswareLibrary.addGlassware(canvas, 'beaker', canvas.width/2, canvas.height/2, 50, '#3498db');
    });

    document.getElementById('btn-add-flask').addEventListener('click', () => {
        GlasswareLibrary.addGlassware(canvas, 'flask', canvas.width/2, canvas.height/2, 50, '#e74c3c');
    });"""

new_logic = """    // Bind UI Buttons - dynamic library
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
    });"""

content = content.replace(old_logic, new_logic)

old_props_logic = """    // Handle Properties Panel
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
    }"""

new_props_logic = """    // Handle Properties Panel
    const propsPanel = document.getElementById('dynamic-props');
    const propertiesContainer = document.getElementById('properties-panel');

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
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
    }"""

content = content.replace(old_props_logic, new_props_logic)

with open('js/app.js', 'w') as f:
    f.write(content)
