"""Add Article Schema to blog pages (currently only BreadcrumbList)"""
import re, json, os, glob

DIST_DIR = r'C:\Users\Administrator\WorkBuddy\2026-05-28-23-54-44\silkroad-travel\dist\blog'

blog_files = sorted(glob.glob(os.path.join(DIST_DIR, '*.html')))
added = 0

for fp in blog_files:
    fname = os.path.basename(fp).replace('.html', '')
    with open(fp, encoding='utf-8') as f:
        content = f.read()
    
    # Extract data
    title_m = re.search(r'<title>(.*?) \|', content)
    desc_m = re.search(r'<meta name="description" content="(.*?)"', content)
    
    title = title_m.group(1).strip() if title_m else fname
    desc = desc_m.group(1).strip() if desc_m else ''
    
    article_schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": desc[:160] if desc else '',
        "url": f"https://silkroadwondertours.com/blog/{fname}.html",
        "publisher": {
            "@type": "Organization",
            "name": "Silk Road Wonders",
            "url": "https://silkroadwondertours.com"
        },
        "author": {
            "@type": "Person",
            "name": "Silk Road Wonders Editorial Team"
        },
        "datePublished": "2025-01-15",
        "dateModified": "2025-06-01"
    }
    
    schema_block = f',\n<script type="application/ld+json">\n{json.dumps(article_schema, indent=2, ensure_ascii=False)}\n</script>'
    
    # Insert after BreadcrumbList closing </script>
    breadcrumb_end = content.find('</script>', content.find('BreadcrumbList'))
    if breadcrumb_end >= 0:
        new_content = content[:breadcrumb_end + len('</script>')] + schema_block + content[breadcrumb_end + len('</script>'):]
        
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(new_content)
        added += 1
        print(f"  [ADDED] {fname}")

print(f"\n  {added}/10 blog pages enhanced with BlogPosting Schema")
