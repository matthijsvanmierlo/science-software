// Handles chemical intelligence using Kekule.js to generate fabric objects

export const ChemicalEngine = {
    composer: null,

    initComposer(elementId) {
        if (!this.composer) {
            this.composer = new Kekule.Editor.Composer(document.getElementById(elementId));
            this.composer.setCommonToolButtons(['undo', 'redo', 'copy', 'cut', 'paste', 'zoomIn', 'zoomOut']);
            this.composer.setChemObjToolButtons(['manipulate', 'erase', 'bond', 'atomAndFormula', 'ring', 'charge']);
        }
        return this.composer;
    },

    getComposerMoleculeImage(callback) {
        if (!this.composer) return;

        try {
            const chemObj = this.composer.getChemObj();
            if (!chemObj) {
                alert('No molecule drawn.');
                return;
            }

            const renderWidget = new Kekule.ChemWidget.Viewer(document);
            renderWidget.setAutosize(true);
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = '-9999px';
            div.style.top = '-9999px';
            document.body.appendChild(div);
            renderWidget.appendToElem(div);
            renderWidget.setRenderType(Kekule.Render.RendererType.R2D);
            renderWidget.setEnableToolbar(false);
            renderWidget.setChemObj(chemObj);

            setTimeout(() => {
                const dataUrl = renderWidget.exportToDataUri('image/png', {quality: 1});
                renderWidget.finalize();
                document.body.removeChild(div);
                if (callback) callback(dataUrl, Kekule.IO.saveFormatData(chemObj, 'json'));
            }, 100);
        } catch (e) {
            console.error('Failed to generate molecule image:', e);
        }
    },

    addMoleculeToCanvasFromComposer(fabricCanvas, left = 200, top = 200) {
        this.getComposerMoleculeImage((dataUrl, kekuleJson) => {
            fabric.Image.fromURL(dataUrl, (img) => {
                img.set({
                    left: left,
                    top: top,
                    originX: 'center',
                    originY: 'center',
                    hasControls: true,
                    customType: 'molecule',
                    kekuleJson: kekuleJson
                });
                img.scale(0.5);
                fabricCanvas.add(img);
                fabricCanvas.setActiveObject(img);
                fabricCanvas.renderAll();
            });
        });
    },

    generateMoleculeImage(smiles, callback) {
        try {
            const mol = Kekule.IO.loadFormatData(smiles, 'smi');
            const renderWidget = new Kekule.ChemWidget.Viewer(document);
            renderWidget.setAutosize(true);
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = '-9999px';
            div.style.top = '-9999px';
            document.body.appendChild(div);
            renderWidget.appendToElem(div);
            renderWidget.setRenderType(Kekule.Render.RendererType.R2D);
            renderWidget.setEnableToolbar(false);
            renderWidget.setChemObj(mol);

            setTimeout(() => {
                const dataUrl = renderWidget.exportToDataUri('image/png', {quality: 1});
                renderWidget.finalize();
                document.body.removeChild(div);
                if (callback) callback(dataUrl, Kekule.IO.saveFormatData(mol, 'json'));
            }, 100);
        } catch (e) {
            console.error('Failed to parse SMILES or generate molecule image:', e);
            alert('Invalid SMILES string.');
        }
    },

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
                    smiles: smiles
                });
                img.scale(0.5);
                fabricCanvas.add(img);
                fabricCanvas.setActiveObject(img);
                fabricCanvas.renderAll();
            });
        });
    }
};