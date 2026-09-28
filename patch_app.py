import re

with open('js/app.js', 'r') as f:
    content = f.read()

# Replace the btn-add-molecule logic
old_add_molecule = """    document.getElementById('btn-add-molecule').addEventListener('click', () => {
        const smiles = prompt("Enter SMILES string (e.g., C1=CC=CC=C1 for Benzene):", "C1=CC=CC=C1");
        if (smiles) {
            ChemicalEngine.addMoleculeToCanvas(canvas, smiles, canvas.width/2, canvas.height/2);
        }
    });"""

new_add_molecule = """    const moleculeModal = new bootstrap.Modal(document.getElementById('moleculeModal'), {
        keyboard: false
    });

    document.getElementById('btn-add-molecule').addEventListener('click', () => {
        moleculeModal.show();
        // Delay initialization slightly to let modal render completely
        setTimeout(() => {
            ChemicalEngine.initComposer('chem-composer');
        }, 200);
    });

    document.getElementById('btn-insert-molecule')?.addEventListener('click', () => {
        ChemicalEngine.addMoleculeToCanvasFromComposer(canvas, canvas.width/2, canvas.height/2);
        moleculeModal.hide();
    });"""

content = content.replace(old_add_molecule, new_add_molecule)

with open('js/app.js', 'w') as f:
    f.write(content)
