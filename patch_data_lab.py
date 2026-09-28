import re

with open('data-lab.html', 'r') as f:
    content = f.read()

# Add Graph Type Dropdown and Settings section in the left column
search_sidebar = """                        <div id="sensor-status" class="alert alert-secondary mt-3">Status: Disconnected</div>
                    </div>
                </div>
            </div>"""

replace_sidebar = """                        <div id="sensor-status" class="alert alert-secondary mt-3">Status: Disconnected</div>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        Graph Settings
                    </div>
                    <div class="card-body">
                        <label for="graph-type-select" class="form-label">Graph Type</label>
                        <select class="form-select mb-3" id="graph-type-select">
                            <option value="scatter">Line + Markers</option>
                            <option value="line">Line Only</option>
                            <option value="bar">Bar Chart</option>
                        </select>
                    </div>
                </div>
            </div>"""

content = content.replace(search_sidebar, replace_sidebar)

# Add Tabular Data section in the right column
search_main = """                <div class="card">
                    <div class="card-header">
                        Live Data Visualization
                    </div>
                    <div class="card-body">
                        <div id="plotly-chart" style="width:100%; height:400px;"></div>
                    </div>
                </div>
            </div>"""

replace_main = """                <div class="card mb-4">
                    <div class="card-header">
                        Live Data Visualization
                    </div>
                    <div class="card-body">
                        <div id="plotly-chart" style="width:100%; height:400px;"></div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        Tabular Data
                    </div>
                    <div class="card-body p-0" style="max-height: 300px; overflow-y: auto;">
                        <table class="table table-striped table-hover m-0" id="data-table">
                            <thead style="position: sticky; top: 0; background-color: var(--bs-body-bg); z-index: 1;">
                                <tr>
                                    <th>Time (s)</th>
                                    <th>Measurement</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Dynamically populated -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>"""

content = content.replace(search_main, replace_main)

with open('data-lab.html', 'w') as f:
    f.write(content)
