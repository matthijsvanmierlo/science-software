// js/storage.js
// Handles Dexie.js IndexedDB persistence for autosaving canvas state

const db = new Dexie('ChemCanvasStudioDB');
db.version(1).stores({
    canvases: '++id, name, state, timestamp'
});

export const Storage = {
    async saveState(fabricCanvas, name = 'autosave') {
        try {
            const state = JSON.stringify(fabricCanvas.toJSON(['id', 'customType', 'fillLevel', 'liquidColor']));

            // Check if autosave exists
            const existing = await db.canvases.where('name').equals(name).first();

            if (existing) {
                await db.canvases.update(existing.id, {
                    state: state,
                    timestamp: new Date().toISOString()
                });
            } else {
                await db.canvases.add({
                    name: name,
                    state: state,
                    timestamp: new Date().toISOString()
                });
            }
            console.log(`Canvas state saved as ${name}`);
        } catch (error) {
            console.error('Failed to save canvas state:', error);
        }
    },

    async loadState(fabricCanvas, name = 'autosave') {
        try {
            const savedState = await db.canvases.where('name').equals(name).first();
            if (savedState) {
                return new Promise((resolve) => {
                    fabricCanvas.loadFromJSON(savedState.state, () => {
                        fabricCanvas.renderAll();
                        console.log(`Canvas state loaded from ${name}`);
                        resolve(true);
                    });
                });
            }
            return false;
        } catch (error) {
            console.error('Failed to load canvas state:', error);
            return false;
        }
    },

    // Setup interval autosave
    initAutosave(fabricCanvas, intervalMs = 5000) {
        setInterval(() => {
            // Only save if objects exist (don't override with empty state unnecessarily)
            if (fabricCanvas.getObjects().length > 0) {
                this.saveState(fabricCanvas, 'autosave');
            }
        }, intervalMs);
    }
};