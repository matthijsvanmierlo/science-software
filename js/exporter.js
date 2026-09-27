// js/exporter.js
// Handles exporting the Fabric canvas to SVG, PNG, and PDF (via jsPDF)

export const Exporter = {
    exportSVG(fabricCanvas, filename = 'chemcanvas-export.svg') {
        const svg = fabricCanvas.toSVG();
        this._downloadString(svg, 'image/svg+xml', filename);
    },

    exportPNG(fabricCanvas, multiplier = 2, filename = 'chemcanvas-export.png') {
        const dataUrl = fabricCanvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: multiplier // for 300 DPI approx scaling
        });
        this._downloadDataUrl(dataUrl, filename);
    },

    exportPDF(fabricCanvas, filename = 'chemcanvas-export.pdf') {
        // Need to grab image data first for jspdf
        const dataUrl = fabricCanvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2
        });

        const width = fabricCanvas.getWidth();
        const height = fabricCanvas.getHeight();

        // Calculate orientation based on canvas dims
        const orientation = width > height ? 'l' : 'p';

        const { jsPDF } = window.jspdf;
        // create new pdf object, convert px to mm roughly
        const doc = new jsPDF({
            orientation: orientation,
            unit: 'px',
            format: [width, height]
        });

        doc.addImage(dataUrl, 'PNG', 0, 0, width, height);
        doc.save(filename);
    },

    _downloadString(text, fileType, fileName) {
        const blob = new Blob([text], { type: fileType });
        const a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
    },

    _downloadDataUrl(dataUrl, fileName) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};