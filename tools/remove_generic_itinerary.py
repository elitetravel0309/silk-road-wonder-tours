#!/usr/bin/env python3
"""Remove the generic placeholder itinerary line from thin tour pages."""

import os
import re

PAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'pages', 'tour')

count = 0
skipped = 0
for fname in sorted(os.listdir(PAGES_DIR)):
    if not fname.endswith('.astro'):
        continue
    fpath = os.path.join(PAGES_DIR, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip files that don't have the generic itinerary
    if 'itinerary={tour.itinerary' not in content:
        continue

    # Skip rich pages (>5KB)
    if len(content) > 6000:
        continue

    # Remove the entire itinerary line (line that starts with "  itinerary={tour.itinerary || [...")
    # The pattern: indentation, "itinerary={tour.itinerary ||", then anything until the closing "}" at end
    # Since all tour pages have the same format, match the line with the Arrival & Welcome marker
    pattern = r'^(\s*)itinerary=\{tour\.itinerary \|\| \[.*?"Arrival & Welcome".*?\]\}$'
    new_content = re.sub(pattern, '', content, flags=re.MULTILINE)

    if new_content == content:
        # Try a more flexible match - remove the line containing itinerary and Arrival
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            if 'itinerary={tour.itinerary' in line and 'Arrival & Welcome' in line:
                skipped += 0  # Will increment below
                continue
            new_lines.append(line)
        if len(new_lines) == len(lines):
            print(f"  SKIP {fname} - could not remove itinerary line")
            skipped += 1
            continue
        new_content = '\n'.join(new_lines)
        # Also remove the trailing blank line if one was left
        new_content = re.sub(r'\n\s*\n\s*(includes=)', r'\n  \1', new_content)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"  FIXED {fname}")
    count += 1

print(f"\nRemoved generic itinerary from {count} tour pages ({skipped} skipped).")
