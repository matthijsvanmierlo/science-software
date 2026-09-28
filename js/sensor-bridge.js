// js/sensor-bridge.js
// Handles Web Bluetooth, Web Serial for sensors (Pasco/Vernier) and Plotly graphing

let plotlyData = {
    x: [],
    y: [],
    mode: 'lines+markers',
    type: 'scatter',
    name: 'Sensor Data'
};

let plotlyLayout = {
    title: 'Live Sensor Data',
    xaxis: { title: 'Time (s)' },
    yaxis: { title: 'Measurement' }
};

let simInterval = null;
let time = 0;

export const SensorBridge = {
    initChart(divId = 'plotly-chart') {
        if (!document.getElementById(divId)) return;

        // Load graph type preference
        const savedType = localStorage.getItem('chemcanvas_graph_type') || 'scatter';
        this.setGraphType(savedType, false);

        const select = document.getElementById('graph-type-select');
        if (select) {
            select.value = savedType;
            select.addEventListener('change', (e) => {
                this.setGraphType(e.target.value);
            });
        }

        Plotly.newPlot(divId, [plotlyData], plotlyLayout);
    },

    setGraphType(type, redraw = true) {
        localStorage.setItem('chemcanvas_graph_type', type);

        if (type === 'scatter') {
            plotlyData.type = 'scatter';
            plotlyData.mode = 'lines+markers';
        } else if (type === 'line') {
            plotlyData.type = 'scatter';
            plotlyData.mode = 'lines';
        } else if (type === 'bar') {
            plotlyData.type = 'bar';
            plotlyData.mode = ''; // mode not needed for bar
        }

        if (redraw && document.getElementById('plotly-chart')) {
            Plotly.react('plotly-chart', [plotlyData], plotlyLayout);
        }
    },

    updateChart(divId = 'plotly-chart', xVal, yVal) {
        if (!document.getElementById(divId)) return;

        // Push data to our internal state so react works if we change type
        plotlyData.x.push(xVal);
        plotlyData.y.push(yVal);

        // Use react instead of extendTraces to fully support type changes on the fly
        Plotly.react(divId, [plotlyData], plotlyLayout);

        // Update table
        const tbody = document.querySelector('#data-table tbody');
        if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${xVal.toFixed(2)}</td><td>${yVal.toFixed(2)}</td>`;
            // Insert at top
            tbody.insertBefore(tr, tbody.firstChild);
        }
    },

    startMockData(divId = 'plotly-chart') {
        if (simInterval) clearInterval(simInterval);
        time = 0;

        // Reset chart data
        plotlyData.x = [];
        plotlyData.y = [];
        if (document.getElementById(divId)) {
             Plotly.react(divId, [plotlyData], plotlyLayout);
        }

        // Reset table
        const tbody = document.querySelector('#data-table tbody');
        if (tbody) tbody.innerHTML = '';

        const statusDiv = document.getElementById('sensor-status');
        if (statusDiv) {
            statusDiv.textContent = 'Status: Mock Sensor Running';
            statusDiv.className = 'alert alert-info mt-3';
        }

        simInterval = setInterval(() => {
            time += 0.5;
            // Generate a fake exponential curve + noise (e.g., cooling curve)
            const val = 20 + 80 * Math.exp(-0.1 * time) + (Math.random() * 2 - 1);
            this.updateChart(divId, time, val);

            // Dispatch event for UI updates (e.g. thermometer logic)
            window.dispatchEvent(new CustomEvent('sensorData', { detail: { type: 'temperature', value: val }}));

        }, 500);
    },

    async connectBluetooth() {
        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true
                // In a real app, filter by Pasco/Vernier GATT Service UUIDs
            });
            console.log('Bluetooth device selected:', device.name);

            const statusDiv = document.getElementById('sensor-status');
            if (statusDiv) {
                statusDiv.textContent = `Status: Connected to ${device.name}`;
                statusDiv.className = 'alert status-connected mt-3';
            }

            // Mock starting data stream
            this.startMockData();

        } catch (error) {
            console.error('Bluetooth connection failed:', error);
            alert('Bluetooth connection failed: ' + error.message);
        }
    },

    async connectSerial() {
        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            console.log('Serial port opened.');

            const statusDiv = document.getElementById('sensor-status');
            if (statusDiv) {
                statusDiv.textContent = `Status: Serial Connected`;
                statusDiv.className = 'alert status-connected mt-3';
            }

             // Mock starting data stream
             this.startMockData();

        } catch (error) {
            console.error('Serial connection failed:', error);
            alert('Serial connection failed: ' + error.message);
        }
    }
};

// Bind UI events if on the Data Lab page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('plotly-chart')) {
        SensorBridge.initChart();

        document.getElementById('btn-connect-bluetooth')?.addEventListener('click', () => {
            SensorBridge.connectBluetooth();
        });

        document.getElementById('btn-connect-serial')?.addEventListener('click', () => {
            SensorBridge.connectSerial();
        });

        document.getElementById('btn-mock-data')?.addEventListener('click', () => {
            SensorBridge.startMockData();
        });
    }
});