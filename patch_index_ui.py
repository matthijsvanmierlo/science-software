import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace the Tools section
search = """            <h5>Tools</h5>
            <div class="btn-group-vertical w-100">
                <button class="btn btn-outline-secondary text-start" id="btn-add-beaker"><i class="bi bi-cup"></i> Add Beaker</button>
                <button class="btn btn-outline-secondary text-start" id="btn-add-flask"><i class="bi bi-ev-front"></i> Add Flask</button>
                <button class="btn btn-outline-secondary text-start" id="btn-add-molecule"><i class="bi bi-hexagon"></i> Draw Molecule</button>
            </div>"""

replace = """            <h5>Tools</h5>
            <div class="mb-2">
                <input type="text" class="form-control form-control-sm" id="graphics-search" placeholder="Search graphics...">
            </div>
            <div class="btn-group-vertical w-100" id="graphics-list">
                <!-- Dynamically populated from GlasswareLibrary catalog -->
            </div>
            <hr>
            <button class="btn btn-outline-primary text-start w-100" id="btn-add-molecule"><i class="bi bi-hexagon"></i> Draw Molecule</button>"""

content = content.replace(search, replace)

# Replace Properties Panel to add more props support
search_props = """                <div id="glassware-props" class="d-none">
                    <label class="form-label small">Fill Level</label>
                    <input type="range" class="form-range" id="prop-fill-level" min="0" max="100">
                    <label class="form-label small">Liquid Color</label>
                    <input type="color" class="form-control form-control-color w-100" id="prop-liquid-color">
                </div>"""

replace_props = """                <div id="dynamic-props" class="d-none">
                    <!-- Dynamically populated based on selected object type -->
                </div>"""

content = content.replace(search_props, replace_props)

with open('index.html', 'w') as f:
    f.write(content)
