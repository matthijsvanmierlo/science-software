import re

# Update index.html
with open('index.html', 'r') as f:
    content = f.read()

# Add aria-label to search
content = content.replace(
    'id="graphics-search" placeholder="Search graphics..."',
    'id="graphics-search" placeholder="Search graphics..." aria-label="Search graphics library"'
)

# Add aria-labels to buttons without text
content = content.replace(
    'id="btn-toggle-theme"><i class="bi bi-moon"></i></button>',
    'id="btn-toggle-theme" aria-label="Toggle dark mode"><i class="bi bi-moon"></i></button>'
)

with open('index.html', 'w') as f:
    f.write(content)

# Update data-lab.html
with open('data-lab.html', 'r') as f:
    content = f.read()

content = content.replace(
    'id="btn-toggle-theme"><i class="bi bi-moon"></i></button>',
    'id="btn-toggle-theme" aria-label="Toggle dark mode"><i class="bi bi-moon"></i></button>'
)

with open('data-lab.html', 'w') as f:
    f.write(content)

# Update js/app.js to give aria-labels to dynamically created inputs
with open('js/app.js', 'r') as f:
    content = f.read()

content = content.replace(
    "const input = document.createElement('input');",
    "const input = document.createElement('input');\n                input.setAttribute('aria-label', label.innerText);"
)

with open('js/app.js', 'w') as f:
    f.write(content)
