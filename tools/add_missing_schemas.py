#!/usr/bin/env python3
"""Batch add TouristDestination + BlogPosting schemas to destination and blog pages."""
import os, re, glob

BASE = r"C:\Users\Administrator\WorkBuddy\2026-05-28-23-54-44\silkroad-travel\src\pages"
SITE = "https://silkroadwondertours.com"

def add_tourist_destination(filepath):
    """Add TouristDestination schema after existing BreadcrumbList in destination pages."""
    with open(filepath, encoding="utf-8") as f:
        content = f.read()

    if 'TouristDestination' in content:
        return False  # already has it

    # Extract title and description from BaseLayout props
    m_title = re.search(r'BaseLayout\s+title="(.*?)"', content)
    m_desc = re.search(r'BaseLayout\s+.*?description="(.*?)"', content)
    if not m_title:
        print(f"  SKIP {os.path.basename(filepath)}: can't extract title")
        return False

    title = m_title.group(1)
    desc = m_desc.group(1) if m_desc else f"Explore {title} with Silk Road Wonder Tours. Expert guides, authentic experiences, and unforgettable journeys."
    slug = os.path.basename(filepath).replace('.astro', '')

    tourist_dest_schema = f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": "{title}",
  "description": "{desc[:300]}",
  "url": "{SITE}/destination/{slug}.html",
  "touristType": ["Cultural Tourism", "Adventure Tourism", "Historical Tourism"],
  "provider": {{
    "@type": "TravelAgency",
    "name": "Silk Road Wonder Tours",
    "url": "{SITE}/",
    "image": "{SITE}/assets/images/hero-silkroad.jpg"
  }}
}}
</script>
'''

    # Insert after the closing </script> of BreadcrumbList (the first JSON-LD block)
    # Find the first </script> that closes a type="application/ld+json"
    insert_pos = None
    for m in re.finditer(r'</script>', content):
        block = content[:m.start()]
        if '<script type="application/ld+json">' in block or "ld+json" in block[-500:]:
            insert_pos = m.end()
            break

    if not insert_pos:
        # Fallback: insert after <nav class="breadcrumb" ... </nav>
        m_bc = re.search(r'</nav>\s*\n\s*\n', content)
        if m_bc:
            insert_pos = m_bc.end()
        else:
            print(f"  SKIP {os.path.basename(filepath)}: can't find insertion point")
            return False

    new_content = content[:insert_pos] + '\n' + tourist_dest_schema + content[insert_pos:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True


def add_blog_posting(filepath):
    """Add BlogPosting schema after existing BreadcrumbList in blog pages."""
    with open(filepath, encoding="utf-8") as f:
        content = f.read()

    if 'BlogPosting' in content:
        return False  # already has it

    # Extract title and description from BaseLayout props
    m_title = re.search(r'BaseLayout\s+title="(.*?)"', content)
    m_desc = re.search(r'BaseLayout\s+.*?description="(.*?)"', content)
    m_date = re.search(r'<p>(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+202\d</p>', content)

    if not m_title:
        print(f"  SKIP {os.path.basename(filepath)}: can't extract title")
        return False

    title = m_title.group(1)
    desc = m_desc.group(1) if m_desc else title
    date_published = m_date.group(0).replace('<p>', '').replace('</p>', '') if m_date else "2026-05-31"
    slug = os.path.basename(filepath).replace('.astro', '')

    blog_schema = f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{title}",
  "description": "{desc[:300]}",
  "datePublished": "{date_published}",
  "url": "{SITE}/blog/{slug}.html",
  "author": {{
    "@type": "Organization",
    "name": "Silk Road Wonder Tours"
  }},
  "publisher": {{
    "@type": "Organization",
    "name": "Silk Road Wonder Tours",
    "url": "{SITE}/"
  }}
}}
</script>
'''

    # Find insertion point: after first </script> that closes JSON-LD
    insert_pos = None
    for m in re.finditer(r'</script>', content):
        block = content[:m.start()]
        if '<script type="application/ld+json">' in block or "ld+json" in block[-500:]:
            insert_pos = m.end()
            break

    if not insert_pos:
        m_bc = re.search(r'</nav>\s*\n\s*\n', content)
        if m_bc:
            insert_pos = m_bc.end()
        else:
            print(f"  SKIP {os.path.basename(filepath)}: can't find insertion point")
            return False

    new_content = content[:insert_pos] + '\n' + blog_schema + content[insert_pos:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True


# --- EXECUTION ---
count = 0

print("=== Destination pages (TouristDestination) ===")
for f in sorted(glob.glob(os.path.join(BASE, "destination", "*.astro"))):
    if add_tourist_destination(f):
        print(f"  ADDED: {os.path.basename(f)}")
        count += 1

print("\n=== Blog pages (BlogPosting) ===")
for f in sorted(glob.glob(os.path.join(BASE, "blog", "*.astro"))):
    if add_blog_posting(f):
        print(f"  ADDED: {os.path.basename(f)}")
        count += 1

print(f"\nDone. {count} files modified.")
