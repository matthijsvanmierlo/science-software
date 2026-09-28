// Procedural SVG generation for lab glassware wrapped as Fabric.js Custom Classes

export const GlasswareLibrary = {
    catalog: [
        { id: 'beaker', name: 'Beaker', icon: 'bi-cup', defaultProps: { fillLevel: 50, liquidColor: '#3498db' } },
        { id: 'flask', name: 'Erlenmeyer Flask', icon: 'bi-ev-front', defaultProps: { fillLevel: 50, liquidColor: '#e74c3c' } },
        { id: 'testtube', name: 'Test Tube', icon: 'bi-capsule', defaultProps: { fillLevel: 50, liquidColor: '#2ecc71' } },
        { id: 'bunsen', name: 'Bunsen Burner', icon: 'bi-fire', defaultProps: { flameSize: 50 } },
        { id: 'thermometer', name: 'Thermometer', icon: 'bi-thermometer-half', defaultProps: { temperature: 25 } },
        { id: 'cylinder', name: 'Graduated Cylinder', icon: 'bi-rulers', defaultProps: { fillLevel: 50, liquidColor: '#f1c40f' } },
        { id: 'volumetric_flask', name: 'Volumetric Flask', icon: 'bi-droplet', defaultProps: { fillLevel: 50, liquidColor: '#9b59b6' } },
        { id: 'round_bottom_flask', name: 'Round-Bottom Flask', icon: 'bi-circle', defaultProps: { fillLevel: 50, liquidColor: '#e67e22' } },
        { id: 'separatory_funnel', name: 'Separatory Funnel', icon: 'bi-funnel', defaultProps: { fillLevel: 50, liquidColor: '#1abc9c' } },
        { id: 'petri_dish', name: 'Petri Dish', icon: 'bi-record-circle', defaultProps: { fillLevel: 50, liquidColor: '#f39c12' } },
        { id: 'standard_funnel', name: 'Funnel', icon: 'bi-funnel-fill', defaultProps: {} },
        { id: 'buchner_funnel', name: 'Büchner Funnel', icon: 'bi-filter', defaultProps: {} },
        { id: 'watch_glass', name: 'Watch Glass', icon: 'bi-eye', defaultProps: {} },
        { id: 'burette', name: 'Burette', icon: 'bi-symmetry-vertical', defaultProps: { fillLevel: 50, liquidColor: '#3498db' } },
        { id: 'pipette', name: 'Micropipette', icon: 'bi-pen', defaultProps: {} },
        { id: 'tripod', name: 'Tripod Stand', icon: 'bi-triangle', defaultProps: {} },
        { id: 'wire_gauze', name: 'Wire Gauze', icon: 'bi-grid-3x3', defaultProps: {} },
        { id: 'retort_stand', name: 'Retort Stand', icon: 'bi-align-bottom', defaultProps: {} },
        { id: 'microscope', name: 'Microscope', icon: 'bi-search', defaultProps: {} },
        { id: 'balance', name: 'Analytical Balance', icon: 'bi-scales', defaultProps: {} },
        { id: 'hotplate', name: 'Magnetic Hotplate', icon: 'bi-speaker', defaultProps: {} },
        { id: 'crucible', name: 'Crucible', icon: 'bi-cup-hot', defaultProps: {} }
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

            <line x1="10" y1="50" x2="25" y2="50" stroke="#333" stroke-width="1"/>

            <line x1="10" y1="70" x2="25" y2="70" stroke="#333" stroke-width="1"/>

            <line x1="10" y1="90" x2="25" y2="90" stroke="#333" stroke-width="1"/>

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


    _generateVolumetricFlaskSVG(props) {
        const fillLevel = props.fillLevel || 0;
        const liquidColor = props.liquidColor || '#9b59b6';
        const fillHeight = (fillLevel / 100) * 50;
        const fillY = 100 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="120" viewBox="0 0 60 120">
            <defs>
                <clipPath id="volFlaskClip">
                    <path d="M 25,10 L 35,10 L 35,60 Q 50,60 50,85 Q 50,110 30,110 Q 10,110 10,85 Q 10,60 25,60 Z"/>
                </clipPath>
            </defs>
            ${fillLevel > 0 ? `<rect x="0" y="${fillY}" width="60" height="${fillHeight + 10}" fill="${liquidColor}" opacity="0.8" clip-path="url(#volFlaskClip)"/>` : ''}
            <path d="M 25,10 L 35,10" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 25,10 L 25,60 Q 10,60 10,85 Q 10,110 30,110 Q 50,110 50,85 Q 50,60 35,60 L 35,10" fill="none" stroke="#333" stroke-width="2"/>
            <line x1="20" y1="40" x2="40" y2="40" stroke="#333" stroke-width="1"/>
        </svg>
        `;
    },

    _generateRoundBottomFlaskSVG(props) {
        const fillLevel = props.fillLevel || 0;
        const liquidColor = props.liquidColor || '#e67e22';
        const fillHeight = (fillLevel / 100) * 60;
        const fillY = 100 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="0 0 80 120">
            <defs>
                <clipPath id="rbfClip">
                    <path d="M 30,20 L 50,20 L 50,45 A 35,35 0 1,1 30,45 Z"/>
                </clipPath>
            </defs>
            ${fillLevel > 0 ? `<rect x="0" y="${fillY}" width="80" height="${fillHeight + 20}" fill="${liquidColor}" opacity="0.8" clip-path="url(#rbfClip)"/>` : ''}
            <path d="M 30,20 L 50,20" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 30,20 L 30,45 A 35,35 0 1,0 50,45 L 50,20" fill="none" stroke="#333" stroke-width="2"/>
        </svg>
        `;
    },

    _generateSeparatoryFunnelSVG(props) {
        const fillLevel = props.fillLevel || 0;
        const liquidColor = props.liquidColor || '#1abc9c';
        const fillHeight = (fillLevel / 100) * 60;
        const fillY = 80 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="140" viewBox="0 0 60 140">
            <defs>
                <clipPath id="sepFunnelClip">
                    <path d="M 20,20 L 40,20 Q 55,40 40,70 L 32,90 L 32,120 L 28,120 L 28,90 L 20,70 Q 5,40 20,20 Z"/>
                </clipPath>
            </defs>
            ${fillLevel > 0 ? `<rect x="0" y="${fillY}" width="60" height="${fillHeight + 20}" fill="${liquidColor}" opacity="0.8" clip-path="url(#sepFunnelClip)"/>` : ''}
            <path d="M 20,20 L 40,20" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 20,20 Q 5,40 20,70 L 28,90 L 28,120 M 40,20 Q 55,40 40,70 L 32,90 L 32,120" fill="none" stroke="#333" stroke-width="2"/>
            <line x1="24" y1="105" x2="36" y2="105" stroke="#333" stroke-width="3"/>
            <circle cx="30" cy="105" r="2" fill="#fff"/>
        </svg>
        `;
    },

    _generatePetriDishSVG(props) {
        const fillLevel = props.fillLevel || 0;
        const liquidColor = props.liquidColor || '#f39c12';
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40">
            <ellipse cx="40" cy="20" rx="35" ry="10" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 5,20 L 5,30 Q 40,40 75,30 L 75,20" fill="none" stroke="#333" stroke-width="2"/>
            ${fillLevel > 0 ? `<ellipse cx="40" cy="23" rx="33" ry="8" fill="${liquidColor}" opacity="0.6"/>` : ''}
        </svg>
        `;
    },

    _generateStandardFunnelSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="80" viewBox="0 0 60 80">
            <path d="M 10,10 L 50,10 L 35,40 L 35,70 L 25,70 L 25,40 Z" fill="none" stroke="#333" stroke-width="2"/>
        </svg>
        `;
    },

    _generateBuchnerFunnelSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="80" viewBox="0 0 60 80">
            <path d="M 10,10 L 50,10 L 50,40 L 35,40 L 35,70 L 25,70 L 25,40 L 10,40 Z" fill="none" stroke="#333" stroke-width="2"/>
            <line x1="10" y1="35" x2="50" y2="35" stroke="#333" stroke-width="1" stroke-dasharray="2,2"/>
        </svg>
        `;
    },

    _generateWatchGlassSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="30" viewBox="0 0 80 30">
            <path d="M 10,15 Q 40,30 70,15" fill="none" stroke="#333" stroke-width="2"/>
        </svg>
        `;
    },

    _generateBuretteSVG(props) {
        const fillLevel = props.fillLevel || 0;
        const liquidColor = props.liquidColor || '#3498db';
        const fillHeight = (fillLevel / 100) * 120;
        const fillY = 130 - fillHeight;

        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="180" viewBox="0 0 40 180">
            ${fillLevel > 0 ? `<rect x="15" y="${fillY}" width="10" height="${fillHeight}" fill="${liquidColor}" opacity="0.8" />` : ''}
            <path d="M 15,10 L 25,10" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 15,10 L 15,140 L 18,170 M 25,10 L 25,140 L 22,170" fill="none" stroke="#333" stroke-width="2"/>
            <line x1="10" y1="150" x2="30" y2="150" stroke="#333" stroke-width="3"/>
            <circle cx="20" cy="150" r="2" fill="#fff"/>
            <line x1="15" y1="30" x2="20" y2="30" stroke="#333" stroke-width="1"/>
            <line x1="15" y1="60" x2="20" y2="60" stroke="#333" stroke-width="1"/>
            <line x1="15" y1="90" x2="20" y2="90" stroke="#333" stroke-width="1"/>
            <line x1="15" y1="120" x2="20" y2="120" stroke="#333" stroke-width="1"/>
        </svg>
        `;
    },

    _generatePipetteSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="120" viewBox="0 0 40 120">
            <rect x="12" y="10" width="16" height="30" rx="3" fill="#ecf0f1" stroke="#333" stroke-width="2"/>
            <rect x="15" y="40" width="10" height="40" fill="#bdc3c7" stroke="#333" stroke-width="2"/>
            <path d="M 15,80 L 25,80 L 22,110 L 18,110 Z" fill="#95a5a6" stroke="#333" stroke-width="2"/>
            <rect x="16" y="5" width="8" height="5" fill="#34495e"/>
        </svg>
        `;
    },

    _generateTripodSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
            <ellipse cx="40" cy="20" rx="30" ry="8" fill="none" stroke="#333" stroke-width="3"/>
            <line x1="15" y1="23" x2="5" y2="75" stroke="#333" stroke-width="3"/>
            <line x1="65" y1="23" x2="75" y2="75" stroke="#333" stroke-width="3"/>
            <line x1="40" y1="28" x2="40" y2="70" stroke="#333" stroke-width="3"/>
        </svg>
        `;
    },

    _generateWireGauzeSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
            <rect x="5" y="5" width="50" height="50" fill="none" stroke="#333" stroke-width="2"/>
            <circle cx="30" cy="30" r="15" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1"/>
            <line x1="15" y1="5" x2="15" y2="55" stroke="#333" stroke-width="0.5"/>
            <line x1="25" y1="5" x2="25" y2="55" stroke="#333" stroke-width="0.5"/>
            <line x1="35" y1="5" x2="35" y2="55" stroke="#333" stroke-width="0.5"/>
            <line x1="45" y1="5" x2="45" y2="55" stroke="#333" stroke-width="0.5"/>
            <line x1="5" y1="15" x2="55" y2="15" stroke="#333" stroke-width="0.5"/>
            <line x1="5" y1="25" x2="55" y2="25" stroke="#333" stroke-width="0.5"/>
            <line x1="5" y1="35" x2="55" y2="35" stroke="#333" stroke-width="0.5"/>
            <line x1="5" y1="45" x2="55" y2="45" stroke="#333" stroke-width="0.5"/>
        </svg>
        `;
    },

    _generateRetortStandSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="150" viewBox="0 0 80 150">
            <rect x="10" y="130" width="60" height="10" fill="#7f8c8d" stroke="#333" stroke-width="2"/>
            <rect x="20" y="10" width="6" height="120" fill="#95a5a6" stroke="#333" stroke-width="2"/>
        </svg>
        `;
    },

    _generateMicroscopeSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="0 0 80 120">
            <path d="M 20,110 L 60,110 L 55,90 L 25,90 Z" fill="#7f8c8d" stroke="#333" stroke-width="2"/>
            <path d="M 40,90 Q 60,50 40,20" fill="none" stroke="#333" stroke-width="6"/>
            <rect x="35" y="10" width="10" height="20" fill="#bdc3c7" stroke="#333" stroke-width="2"/>
            <line x1="30" y1="60" x2="50" y2="60" stroke="#333" stroke-width="4"/>
            <rect x="25" y="70" width="20" height="5" fill="#bdc3c7" stroke="#333" stroke-width="2"/>
        </svg>
        `;
    },

    _generateBalanceSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
            <rect x="10" y="50" width="60" height="20" rx="3" fill="#ecf0f1" stroke="#333" stroke-width="2"/>
            <rect x="35" y="55" width="25" height="10" fill="#000"/>
            <text x="38" y="63" font-family="monospace" font-size="8" fill="#0f0">0.000</text>
            <rect x="15" y="10" width="50" height="40" fill="none" stroke="#333" stroke-width="1"/>
            <ellipse cx="40" cy="45" rx="15" ry="3" fill="#bdc3c7" stroke="#333" stroke-width="1"/>
        </svg>
        `;
    },

    _generateHotplateSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40">
            <rect x="10" y="10" width="60" height="20" rx="2" fill="#ecf0f1" stroke="#333" stroke-width="2"/>
            <rect x="15" y="6" width="50" height="4" fill="#bdc3c7" stroke="#333" stroke-width="1"/>
            <circle cx="25" cy="20" r="4" fill="#7f8c8d" stroke="#333" stroke-width="1"/>
            <circle cx="55" cy="20" r="4" fill="#7f8c8d" stroke="#333" stroke-width="1"/>
            <circle cx="40" cy="20" r="2" fill="#e74c3c"/>
        </svg>
        `;
    },

    _generateCrucibleSVG(props) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <path d="M 10,10 L 30,10 L 25,30 L 15,30 Z" fill="#ecf0f1" stroke="#333" stroke-width="2"/>
            <path d="M 8,10 Q 20,5 32,10" fill="none" stroke="#333" stroke-width="2"/>
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
            case 'volumetric_flask': return this._generateVolumetricFlaskSVG(props);
            case 'round_bottom_flask': return this._generateRoundBottomFlaskSVG(props);
            case 'separatory_funnel': return this._generateSeparatoryFunnelSVG(props);
            case 'petri_dish': return this._generatePetriDishSVG(props);
            case 'standard_funnel': return this._generateStandardFunnelSVG(props);
            case 'buchner_funnel': return this._generateBuchnerFunnelSVG(props);
            case 'watch_glass': return this._generateWatchGlassSVG(props);
            case 'burette': return this._generateBuretteSVG(props);
            case 'pipette': return this._generatePipetteSVG(props);
            case 'tripod': return this._generateTripodSVG(props);
            case 'wire_gauze': return this._generateWireGauzeSVG(props);
            case 'retort_stand': return this._generateRetortStandSVG(props);
            case 'microscope': return this._generateMicroscopeSVG(props);
            case 'balance': return this._generateBalanceSVG(props);
            case 'hotplate': return this._generateHotplateSVG(props);
            case 'crucible': return this._generateCrucibleSVG(props);

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
