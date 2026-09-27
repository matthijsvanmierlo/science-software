// js/glassware-library.js
// Procedural SVG generation for lab glassware wrapped as Fabric.js Custom Classes

export const GlasswareLibrary = {
    // Generates a parametric beaker SVG string
    _generateBeakerSVG(fillLevel, liquidColor) {
        // Simple beaker shape: 100x120
        // Fill level 0-100
        const fillHeight = (fillLevel / 100) * 100;
        const fillY = 110 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120">
            <!-- Background / Liquid -->
            ${fillLevel > 0 ? `<rect x="10" y="${fillY}" width="80" height="${fillHeight}" fill="${liquidColor}" opacity="0.8" />` : ''}

            <!-- Beaker Outline -->
            <path d="M 5,10 L 10,10 L 10,110 Q 10,115 15,115 L 85,115 Q 90,115 90,110 L 90,10 L 95,10" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 5,10 L 10,25" fill="none" stroke="#333" stroke-width="2"/> <!-- Spout -->

            <!-- Markings -->
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
    _generateFlaskSVG(fillLevel, liquidColor) {
        // Flask shape: 100x120
        const fillHeight = (fillLevel / 100) * 80; // Only fill up to the neck base
        const fillY = 110 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120">
            <!-- Background / Liquid (simplified clip-path logic) -->
            <defs>
                <clipPath id="flaskClip">
                    <path d="M 40,10 L 40,40 L 10,100 Q 5,110 15,115 L 85,115 Q 95,110 90,100 L 60,40 L 60,10 Z"/>
                </clipPath>
            </defs>
            ${fillLevel > 0 ? `<rect x="0" y="${fillY}" width="100" height="${fillHeight + 10}" fill="${liquidColor}" opacity="0.8" clip-path="url(#flaskClip)"/>` : ''}

            <!-- Flask Outline -->
            <path d="M 35,10 L 65,10" fill="none" stroke="#333" stroke-width="2"/> <!-- Top lip -->
            <path d="M 40,10 L 40,40 L 10,100 Q 5,110 15,115 L 85,115 Q 95,110 90,100 L 60,40 L 60,10" fill="none" stroke="#333" stroke-width="2"/>

            <!-- Markings -->
            <line x1="60" y1="50" x2="50" y2="50" stroke="#333" stroke-width="1"/>
            <line x1="75" y1="80" x2="65" y2="80" stroke="#333" stroke-width="1"/>
            <text x="70" y="84" font-family="Arial" font-size="10" fill="#333">250</text>
        </svg>
        `;
    },

    // Adds a parametric glassware object to the fabric canvas
    addGlassware(fabricCanvas, type = 'beaker', left = 100, top = 100, fillLevel = 50, liquidColor = '#3498db') {
        let svgString = '';
        if (type === 'beaker') {
            svgString = this._generateBeakerSVG(fillLevel, liquidColor);
        } else if (type === 'flask') {
            svgString = this._generateFlaskSVG(fillLevel, liquidColor);
        }

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
                fillLevel: fillLevel,
                liquidColor: liquidColor
            });
            fabricCanvas.add(obj);
            fabricCanvas.setActiveObject(obj);
            fabricCanvas.renderAll();
        });
    },

    // Update an existing glassware object with new properties
    updateGlassware(fabricCanvas, obj, fillLevel, liquidColor) {
        if (!obj || !obj.customType) return;

        const type = obj.customType;
        const left = obj.left;
        const top = obj.top;
        const scaleX = obj.scaleX;
        const scaleY = obj.scaleY;
        const angle = obj.angle;

        // Remove old object
        fabricCanvas.remove(obj);

        // Create new SVG
        let svgString = '';
        if (type === 'beaker') {
            svgString = this._generateBeakerSVG(fillLevel, liquidColor);
        } else if (type === 'flask') {
            svgString = this._generateFlaskSVG(fillLevel, liquidColor);
        }

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
                fillLevel: fillLevel,
                liquidColor: liquidColor
            });
            fabricCanvas.add(newObj);
            fabricCanvas.setActiveObject(newObj);
            fabricCanvas.renderAll();
        });
    }
};