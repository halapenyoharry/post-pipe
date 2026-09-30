import re
import os

def patch_file(path, replacements):
    with open(path, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = re.sub(old, new, content)
    with open(path, 'w') as f:
        f.write(content)

patch_file('src/components/ConfigPanel/ConfigPanel.module.css', [
    (r'bottom: 14px;', r'bottom: calc(14px + env(safe-area-inset-bottom, 0px));'),
    (r'bottom: 56px;', r'bottom: calc(56px + env(safe-area-inset-bottom, 0px));'),
    (r'bottom: 100px;', r'bottom: calc(100px + env(safe-area-inset-bottom, 0px));'),
    (r'bottom: 52px;', r'bottom: calc(52px + env(safe-area-inset-bottom, 0px));')
])

patch_file('src/components/ReaderPanel/ReaderPanel.module.css', [
    (r'bottom: 24px;', r'bottom: calc(24px + env(safe-area-inset-bottom, 0px));'),
    (r'bottom: 12px;', r'bottom: calc(12px + env(safe-area-inset-bottom, 0px));')
])

patch_file('src/components/TimeOverlay/TimeOverlay.module.css', [
    (r'bottom: 24px;', r'bottom: calc(24px + env(safe-area-inset-bottom, 0px));')
])

