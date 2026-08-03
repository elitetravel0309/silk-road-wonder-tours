#!/usr/bin/env python3
"""Add breadcrumb navigation to tour pages that lack it.
Reads each .astro file, checks for breadcrumb, adds if missing.
"""
import os, re, sys

TOUR_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'pages', 'tour')

def extract_title(content):
    """Extract tour title from BaseLayout title prop."""
    m = re.search(r'title="([^"]+)"', content)
    if m:
        return m.group(1)
    # Fallback: try single quotes
    m = re.search(r"title='([^']+)'", content)
    if m:
        return m.group(1)
    # Fallback: try page-hero h1
    m = re.search(r'<h1>(.+?)</h1>', content)
    if m:
        return m.group(1)
    return None

def has_breadcrumb(content):
    return '<nav class="breadcrumb"' in content

def get_tour_filename(filename):
    """Convert .astro filename to .html URL."""
    return filename.replace('.astro', '.html')

def add_breadcrumb(content, filename, title):
    """Add breadcrumb nav and Schema.org BreadcrumbList after page-hero section."""
    tour_url = get_tour_filename(filename)
    safe_title = title.replace('"', '&quot;')

    breadcrumb_html = f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://silkroadwondertours.com/" }},
    {{ "@type": "ListItem", "position": 2, "name": "Tours", "item": "https://silkroadwondertours.com/tours.html" }},
    {{ "@type": "ListItem", "position": 3, "name": "{safe_title}" }}
  ]
}}
</script>
<nav class="breadcrumb" aria-label="Breadcrumb"><div class="container"><a href="/index.html">Home</a> <span class="sep">/</span> <a href="/tours.html">Tours</a> <span class="sep">/</span> <span>{title}</span></div></nav>'''

    # Insert after the closing </section> of page-hero
    pattern = r'(</section>\s*\n)'
    insert_point = None

    # Find page-hero closing </section>
    lines = content.split('\n')
    in_page_hero = False
    insert_line = -1
    for i, line in enumerate(lines):
        if 'class="page-hero"' in line or "class='page-hero'" in line:
            in_page_hero = True
        if in_page_hero and '</section>' in line:
            insert_line = i + 1
            break

    if insert_line == -1:
        # Try to find where the Schema script ends (TouristTrip)
        for i, line in enumerate(lines):
            if '</script>' in line and ('TouristTrip' in content[:content.find(line) + 500] or 'TouristTrip' in '\n'.join(lines[max(0,i-30):i])):
                insert_line = i + 1
                break

    if insert_line == -1:
        # Last resort: insert after BaseLayout opening
        for i, line in enumerate(lines):
            if line.strip().startswith('<BaseLayout') and '>' in line:
                # Find end of BaseLayout opening tag
                if line.strip().endswith('>'):
                    insert_line = i + 1
                    break
                else:
                    # Multi-line tag
                    for j in range(i+1, min(i+10, len(lines))):
                        if '>' in lines[j]:
                            insert_line = j + 1
                            break
                    break

    if insert_line == -1:
        print(f"  SKIP {filename}: cannot find insertion point")
        return None

    lines.insert(insert_line, '\n' + breadcrumb_html)
    return '\n'.join(lines)

def main():
    if not os.path.isdir(TOUR_DIR):
        print(f"ERROR: Tour directory not found: {TOUR_DIR}")
        sys.exit(1)

    files = [f for f in os.listdir(TOUR_DIR) if f.endswith('.astro')]
    added = 0
    skipped = 0
    errors = 0

    for filename in sorted(files):
        filepath = os.path.join(TOUR_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        if has_breadcrumb(content):
            skipped += 1
            continue

        title = extract_title(content)
        if not title:
            print(f"  SKIP {filename}: cannot extract title")
            errors += 1
            continue

        new_content = add_breadcrumb(content, filename, title)
        if new_content is None:
            errors += 1
            continue

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        added += 1
        print(f"  ✓ {filename}")

    print(f"\n{'='*50}")
    print(f"Results: {added} added, {skipped} already had, {errors} errors")
    print(f"Total: {len(files)} tour pages")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
