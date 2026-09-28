import re

with open('js/glassware-library.js', 'r') as f:
    content = f.read()

# I need to add properties and add new svgs
# I'll create a catalog of available items and their default configs.

new_glassware_content = """// Procedural SVG generation for lab glassware wrapped as Fabric.js Custom Classes

export const GlasswareLibrary = {
    catalog: [
        { id: 'beaker', name: 'Beaker', icon: 'bi-cup', defaultProps: { fillLevel: 50, liquidColor: '#3498db' } },
        { id: 'flask', name: 'Erlenmeyer Flask', icon: 'bi-ev-front', defaultProps: { fillLevel: 50, liquidColor: '#e74c3c' } },
        { id: 'testtube', name: 'Test Tube', icon: 'bi-capsule', defaultProps: { fillLevel: 50, liquidColor: '#2ecc71' } },
        { id: 'bunsen', name: 'Bunsen Burner', icon: 'bi-fire', defaultProps: { flameSize: 50 } },
        { id: 'thermometer', name: 'Thermometer', icon: 'bi-thermometer-half', defaultProps: { temperature: 25 } },
        { id: 'cylinder', name: 'Graduated Cylinder', icon: 'bi-rulers', defaultProps: { fillLevel: 50, liquidColor: '#f1c40f' } },
    ],

    // Generates a parametric beaker SVG string
    _generateBeakerSVG(props) {
        const fillLevel = props.fillLevel || 0;
        const liquidColor = props.liquidColor || '#3498db';
        const fillHeight = (fillLevel / 100) * 100;
        const fillY = 110 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120">
            ${fillLevel > 0 ? `<rect x="10" y="${fillY}" width="80" height="${fillHeight}" fill="${liquidColor}" opacity="0.8" />` : ''}
            <path d="M 5,10 L 10,10 L 10,110 Q 10,115 15,115 L 85,115 Q 90,115 90,110 L 90,10 L 95,10" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 5,10 L 10,25" fill="none" stroke="#333" stroke-width="2"/>
            <line x1="10" y1="30" x2="25" y2="30" stroke="#333" stroke-width="1"/>
            <text x="30" y="34" font-family="Arial" font-size="10" fill="#333">80</text>
            <line x1="10" y1="50" x2="25" y2="50" stroke="#333" stroke-width="1"/>
            <text x="30" y="54" font-family="Arial" font-size="10" fill="#333">60</text>
            <line x1="10" y1="70" x2="25" y2="70" stroke="#333" stroke-width="1"/>
            <text x="30" y="74" font-family="Arial" font-size="10" fill="#333">40</text>
            <line x1="10" y1="90" x2="25" y2="90" stroke="#333" stroke-width="1"/>
            <text x="30" y="94" font-family="Arial" font-size="10" fill="#333">20</text>
        </svg>
        `;
    },

    // Generates a parametric Erlenmeyer flask SVG string
    _generateFlaskSVG(props) {
        const fillLevel = props.fillLevel || 0;
        const liquidColor = props.liquidColor || '#e74c3c';
        const fillHeight = (fillLevel / 100) * 80;
        const fillY = 110 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120">
            <defs>
                <clipPath id="flaskClip">
                    <path d="M 40,10 L 40,40 L 10,100 Q 5,110 15,115 L 85,115 Q 95,110 90,100 L 60,40 L 60,10 Z"/>
                </clipPath>
            </defs>
            ${fillLevel > 0 ? `<rect x="0" y="${fillY}" width="100" height="${fillHeight + 10}" fill="${liquidColor}" opacity="0.8" clip-path="url(#flaskClip)"/>` : ''}
            <path d="M 35,10 L 65,10" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 40,10 L 40,40 L 10,100 Q 5,110 15,115 L 85,115 Q 95,110 90,100 L 60,40 L 60,10" fill="none" stroke="#333" stroke-width="2"/>
            <line x1="60" y1="50" x2="50" y2="50" stroke="#333" stroke-width="1"/>
            <line x1="75" y1="80" x2="65" y2="80" stroke="#333" stroke-width="1"/>
            <text x="70" y="84" font-family="Arial" font-size="10" fill="#333">250</text>
        </svg>
        `;
    },

    _generateTestTubeSVG(props) {
        const fillLevel = props.fillLevel || 0;
        const liquidColor = props.liquidColor || '#2ecc71';
        const fillHeight = (fillLevel / 100) * 90;
        const fillY = 105 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="120" viewBox="0 0 40 120">
            <defs>
                <clipPath id="tubeClip">
                    <path d="M 10,10 L 10,100 Q 10,110 20,110 Q 30,110 30,100 L 30,10 Z"/>
                </clipPath>
            </defs>
            ${fillLevel > 0 ? `<rect x="0" y="${fillY}" width="40" height="${fillHeight + 10}" fill="${liquidColor}" opacity="0.8" clip-path="url(#tubeClip)"/>` : ''}
            <path d="M 5,10 L 35,10" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 10,10 L 10,100 Q 10,110 20,110 Q 30,110 30,100 L 30,10" fill="none" stroke="#333" stroke-width="2"/>
        </svg>
        `;
    },

    _generateBunsenBurnerSVG(props) {
        const flameSize = props.flameSize || 0;
        const flameHeight = (flameSize / 100) * 40;
        const innerFlameHeight = (flameSize / 100) * 20;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="120" viewBox="0 0 60 120">
            <!-- Burner Body -->
            <rect x="25" y="50" width="10" height="60" fill="#7f8c8d" stroke="#333" stroke-width="1"/>
            <path d="M 15,110 L 45,110 L 50,115 L 10,115 Z" fill="#95a5a6" stroke="#333" stroke-width="1"/>
            <!-- Valve -->
            <rect x="15" y="90" width="10" height="5" fill="#e74c3c" stroke="#333" stroke-width="1"/>

            <!-- Flame -->
            ${flameSize > 0 ? `
            <path d="M 25,50 Q 30,${50 - flameHeight} 35,50 Q 30,50 25,50 Z" fill="rgba(52, 152, 219, 0.6)"/>
            <path d="M 27,50 Q 30,${50 - innerFlameHeight} 33,50 Q 30,50 27,50 Z" fill="rgba(135, 206, 235, 0.8)"/>
            ` : ''}
        </svg>
        `;
    },

    _generateThermometerSVG(props) {
        const temperature = props.temperature || 0; // range 0 to 100 for visual simplicity
        const tempClamped = Math.max(0, Math.min(100, temperature));
        const fillHeight = (tempClamped / 100) * 80;
        const fillY = 100 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="120" viewBox="0 0 20 120">
            <!-- Stem -->
            <rect x="7" y="10" width="6" height="90" fill="none" stroke="#333" stroke-width="1" rx="3" ry="3"/>
            <!-- Bulb -->
            <circle cx="10" cy="105" r="6" fill="#333" stroke="#333" stroke-width="1"/>
            <circle cx="10" cy="105" r="5" fill="#e74c3c"/>
            <!-- Liquid -->
            <rect x="8" y="${fillY}" width="4" height="${fillHeight}" fill="#e74c3c"/>
            <!-- Markings -->
            <line x1="14" y1="20" x2="17" y2="20" stroke="#333" stroke-width="1"/>
            <line x1="14" y1="40" x2="17" y2="40" stroke="#333" stroke-width="1"/>
            <line x1="14" y1="60" x2="17" y2="60" stroke="#333" stroke-width="1"/>
            <line x1="14" y1="80" x2="17" y2="80" stroke="#333" stroke-width="1"/>
        </svg>
        `;
    },

    _generateCylinderSVG(props) {
        const fillLevel = props.fillLevel || 0;
        const liquidColor = props.liquidColor || '#f1c40f';
        const fillHeight = (fillLevel / 100) * 100;
        const fillY = 110 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="120" viewBox="0 0 40 120">
            ${fillLevel > 0 ? `<rect x="10" y="${fillY}" width="20" height="${fillHeight}" fill="${liquidColor}" opacity="0.8" />` : ''}
            <!-- Base -->
            <path d="M 5,110 L 35,110" stroke="#333" stroke-width="2"/>
            <!-- Tube -->
            <path d="M 10,10 L 10,110" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 30,10 L 30,110" fill="none" stroke="#333" stroke-width="2"/>
            <!-- Lip -->
            <path d="M 5,10 L 10,10 L 10,15" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 35,10 L 30,10 L 30,15" fill="none" stroke="#333" stroke-width="2"/>

            <!-- Markings -->
            <line x1="10" y1="20" x2="15" y2="20" stroke="#333" stroke-width="1"/>
            <line x1="10" y1="40" x2="15" y2="40" stroke="#333" stroke-width="1"/>
            <line x1="10" y1="60" x2="15" y2="60" stroke="#333" stroke-width="1"/>
            <line x1="10" y1="80" x2="15" y2="80" stroke="#333" stroke-width="1"/>
            <line x1="10" y1="100" x2="15" y2="100" stroke="#333" stroke-width="1"/>
        </svg>
        `;
    },

    getSVGString(type, props) {
        switch(type) {
            case 'beaker': return this._generateBeakerSVG(props);
            case 'flask': return this._generateFlaskSVG(props);
            case 'testtube': return this._generateTestTubeSVG(props);
            case 'bunsen': return this._generateBunsenBurnerSVG(props);
            case 'thermometer': return this._generateThermometerSVG(props);
            case 'cylinder': return this._generateCylinderSVG(props);
            default: return '';
        }
    },

    // Adds a parametric glassware object to the fabric canvas
    addGlassware(fabricCanvas, type = 'beaker', left = 100, top = 100, props = {}) {
        let svgString = this.getSVGString(type, props);

        fabric.loadSVGFromString(svgString, (objects, options) => {
            const obj = fabric.util.groupSVGElements(objects, options);
            obj.set({
                left: left,
                top: top,
                originX: 'center',
                originY: 'center',
                hasControls: true,
                hasBorders: true,
                transparentCorners: false,
                cornerColor: 'rgba(0,0,255,0.5)',
                customType: type,
                customProps: props // Store all props in an object
            });
            fabricCanvas.add(obj);
            fabricCanvas.setActiveObject(obj);
            fabricCanvas.renderAll();
        });
    },

    // Update an existing glassware object with new properties
    updateGlassware(fabricCanvas, obj, newProps) {
        if (!obj || !obj.customType) return;

        const type = obj.customType;
        const left = obj.left;
        const top = obj.top;
        const scaleX = obj.scaleX;
        const scaleY = obj.scaleY;
        const angle = obj.angle;

        const mergedProps = { ...obj.customProps, ...newProps };

        // Remove old object
        fabricCanvas.remove(obj);

        // Create new SVG
        let svgString = this.getSVGString(type, mergedProps);

        fabric.loadSVGFromString(svgString, (objects, options) => {
            const newObj = fabric.util.groupSVGElements(objects, options);
            newObj.set({
                left: left,
                top: top,
                scaleX: scaleX,
                scaleY: scaleY,
                angle: angle,
                originX: 'center',
                originY: 'center',
                hasControls: true,
                hasBorders: true,
                transparentCorners: false,
                cornerColor: 'rgba(0,0,255,0.5)',
                customType: type,
                customProps: mergedProps
            });
            fabricCanvas.add(newObj);
            fabricCanvas.setActiveObject(newObj);
            fabricCanvas.renderAll();
        });
    }
};
"""

with open('js/glassware-library.js', 'w') as f:
    f.write(new_glassware_content)
