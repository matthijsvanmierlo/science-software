import re
with open('js/storage.js', 'r') as f:
    content = f.read()
content = content.replace("['id', 'customType', 'fillLevel', 'liquidColor']", "['id', 'customType', 'customProps', 'smiles']")
with open('js/storage.js', 'w') as f:
    f.write(content)
