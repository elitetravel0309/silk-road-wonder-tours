#!/usr/bin/env python3
"""Verify all .astro files are valid UTF-8."""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pages_dir = os.path.join(ROOT, 'src', 'pages')
components_dir = os.path.join(ROOT, 'src', 'components')

bad = []
for root_dir in [pages_dir, components_dir]:
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for fn in filenames:
            if not fn.endswith('.astro'):
                continue
            fp = os.path.join(dirpath, fn)
            try:
                with open(fp, 'r', encoding='utf-8') as f:
                    f.read()
            except UnicodeDecodeError as e:
                bad.append((fp, str(e)))

if bad:
    print(f"ERROR: {len(bad)} files with encoding issues:")
    for fp, err in bad:
        print(f"  {fp}: {err}")
    sys.exit(1)
else:
    print(f"All .astro files are valid UTF-8.")
    sys.exit(0)
