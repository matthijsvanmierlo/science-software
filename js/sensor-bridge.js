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
        Plotly.newPlot(divId, [plotlyData], plotlyLayout);
    },

    updateChart(divId = 'plotly-chart', xVal, yVal) {
        if (!document.getElementById(divId)) return;
        Plotly.extendTraces(divId, { x: [[xVal]], y: [[yVal]] }, [0]);
    },

    startMockData(divId = 'plotly-chart') {
        if (simInterval) clearInterval(simInterval);
        time = 0;

        // Reset chart data
        if (document.getElementById(divId)) {
             Plotly.newPlot(divId, [{...plotlyData, x: [], y: []}], plotlyLayout);
        }

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