import re

with open('index.html', 'r') as f:
    content = f.read()

modal_html = """
    <!-- Molecule Editor Modal -->
    <div class="modal fade" id="moleculeModal" tabindex="-1" aria-labelledby="moleculeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="moleculeModalLabel">Draw Molecule</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="chem-composer" style="width: 100%; height: 500px;"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="btn-insert-molecule">Insert into Canvas</button>
                </div>
            </div>
        </div>
    </div>
"""

content = content.replace('</body>', modal_html + '\n</body>')

with open('index.html', 'w') as f:
    f.write(content)
