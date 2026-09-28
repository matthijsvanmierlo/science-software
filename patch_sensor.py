import re

with open('js/sensor-bridge.js', 'r') as f:
    content = f.read()

# Modify SensorBridge to handle table and preferences
search_init = """export const SensorBridge = {
    initChart(divId = 'plotly-chart') {
        if (!document.getElementById(divId)) return;
        Plotly.newPlot(divId, [plotlyData], plotlyLayout);
    },"""

replace_init = """export const SensorBridge = {
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
    },"""

content = content.replace(search_init, replace_init)


search_update = """    updateChart(divId = 'plotly-chart', xVal, yVal) {
        if (!document.getElementById(divId)) return;
        Plotly.extendTraces(divId, { x: [[xVal]], y: [[yVal]] }, [0]);
    },"""

replace_update = """    updateChart(divId = 'plotly-chart', xVal, yVal) {
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
    },"""

content = content.replace(search_update, replace_update)

search_mock_reset = """        // Reset chart data
        if (document.getElementById(divId)) {
             Plotly.newPlot(divId, [{...plotlyData, x: [], y: []}], plotlyLayout);
        }"""

replace_mock_reset = """        // Reset chart data
        plotlyData.x = [];
        plotlyData.y = [];
        if (document.getElementById(divId)) {
             Plotly.react(divId, [plotlyData], plotlyLayout);
        }

        // Reset table
        const tbody = document.querySelector('#data-table tbody');
        if (tbody) tbody.innerHTML = '';"""

content = content.replace(search_mock_reset, replace_mock_reset)

with open('js/sensor-bridge.js', 'w') as f:
    f.write(content)
