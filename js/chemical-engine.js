// js/chemical-engine.js
// Handles chemical intelligence using Kekule.js to generate fabric objects

export const ChemicalEngine = {
    // Generate an image data URL of a molecule given a SMILES string
    generateMoleculeImage(smiles, callback) {
        try {
            // Parse SMILES to a Kekule molecule
            const mol = Kekule.IO.loadFormatData(smiles, 'smi');

            // Create an invisible DOM element to host the Kekule ChemViewer for rendering
            const renderWidget = new Kekule.ChemWidget.Viewer(document);
            renderWidget.setDimension('300px', '300px');
            renderWidget.setRenderType(Kekule.Render.RendererType.R2D);
            renderWidget.setEnableToolbar(false);
            renderWidget.setChemObj(mol);

            // Wait for it to render then extract as image
            setTimeout(() => {
                const dataUrl = renderWidget.exportToDataUri('image/png', {quality: 1});
                // Clean up
                renderWidget.finalize();

                if (callback) callback(dataUrl);
            }, 100);

        } catch (e) {
            console.error('Failed to parse SMILES or generate molecule image:', e);
            alert('Invalid SMILES string.');
        }
    },

    // Add a molecule directly to the Fabric canvas
    addMoleculeToCanvas(fabricCanvas, smiles, left = 200, top = 200) {
        this.generateMoleculeImage(smiles, (dataUrl) => {
            fabric.Image.fromURL(dataUrl, (img) => {
                img.set({
                    left: left,
                    top: top,
                    originX: 'center',
                    originY: 'center',
                    hasControls: true,
                    customType: 'molecule',
                    smiles: smiles // store the source data
                });

                // Scale down slightly as the widget is 300x300
                img.scale(0.5);

                fabricCanvas.add(img);
                fabricCanvas.setActiveObject(img);
                fabricCanvas.renderAll();
            });
        });
    }
};