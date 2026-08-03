"""
Final verification and sync scripts
"""
import re, os, glob, shutil

DIST = r'C:\Users\Administrator\WorkBuddy\2026-05-28-23-54-44\silkroad-travel\dist'
PUBLIC = r'C:\Users\Administrator\WorkBuddy\2026-05-28-23-54-44\silkroad-travel\public'

def verify_schema_coverage():
    """Check schema coverage across all pages"""
    print("=== Schema.org Coverage ===")
    
    for subdir, dir_name in [('tour', 'Tour'), ('destination', 'Dest'), ('blog', 'Blog'), ('', 'Root')]:
        if subdir:
            d = os.path.join(DIST, subdir)
            if not os.path.isdir(d):
                continue
            files = glob.glob(os.path.join(d, '*.html'))
        else:
            files = [os.path.join(DIST, f) for f in os.listdir(DIST) if f.endswith('.html')]
            files = [f for f in files if '/tour/' not in f and '/blog/' not in f and '/destination/' not in f]
        
        has_schema = 0
        for fp in files:
            with open(fp, encoding='utf-8') as f:
                content = f.read()
            if 'application/ld+json' in content:
                has_schema += 1
        
        pct = has_schema / len(files) * 100 if files else 0
        print(f"  {dir_name}: {has_schema}/{len(files)} ({pct:.0f}%)")
    
    # Total
    all_files = glob.glob(os.path.join(DIST, '**', '*.html'), recursive=True)
    total = len(all_files)
    with_schema = sum(1 for fp in all_files if 'application/ld+json' in open(fp, encoding='utf-8').read())
    print(f"\n  Total: {with_schema}/{total} ({with_schema/total*100:.0f}%)")


def verify_file_sizes():
    """Check enhanced page sizes"""
    print("\n=== Enhanced Page Sizes ===")
    files = [
        'destinations.html',
        'about.html',
        'contact.html',
        'extend-silk-road-tour.html',
        'tour/classic-tibet-discovery.html'
    ]
    for f in files:
        fp = os.path.join(DIST, f)
        size = os.path.getsize(fp)
        print(f"  {f}: {size:,} bytes")


def sync_to_public():
    """Sync dist changes to public directory"""
    print("\n=== Syncing to public/ ===")
    
    # Sync sw.js
    dist_sw = os.path.join(DIST, 'sw.js')
    pub_sw = os.path.join(PUBLIC, 'sw.js')
    if os.path.exists(pub_sw):
        shutil.copy2(dist_sw, pub_sw)
        print(f"  Synced: sw.js")
    
    # Sync destinations.html
    dist_dest = os.path.join(DIST, 'destinations.html')
    pub_dest = os.path.join(PUBLIC, 'destinations.html')
    if os.path.exists(pub_dest):
        shutil.copy2(dist_dest, pub_dest)
        print(f"  Synced: destinations.html")
    
    # Sync about.html
    dist_about = os.path.join(DIST, 'about.html')
    pub_about = os.path.join(PUBLIC, 'about.html')
    if os.path.exists(pub_about):
        shutil.copy2(dist_about, pub_about)
        print(f"  Synced: about.html")
    
    # Sync contact.html
    dist_contact = os.path.join(DIST, 'contact.html')
    pub_contact = os.path.join(PUBLIC, 'contact.html')
    if os.path.exists(pub_contact):
        shutil.copy2(dist_contact, pub_contact)
        print(f"  Synced: contact.html")
    
    # Sync extend-silk-road-tour.html
    dist_ext = os.path.join(DIST, 'extend-silk-road-tour.html')
    pub_ext = os.path.join(PUBLIC, 'extend-silk-road-tour.html')
    if os.path.exists(pub_ext):
        shutil.copy2(dist_ext, pub_ext)
        print(f"  Synced: extend-silk-road-tour.html")

def check_html_validity():
    """Basic HTML validity check"""
    print("\n=== HTML Validity Check (tours) ===")
    tour_dir = os.path.join(DIST, 'tour')
    issues = 0
    for fp in sorted(glob.glob(os.path.join(tour_dir, '*.html'))):
        with open(fp, encoding='utf-8') as f:
            content = f.read()
        fname = os.path.basename(fp)
        
        # Check script tag balance
        opens = len(re.findall(r'<script\b', content))
        closes = content.count('</script>')
        if opens != closes:
            print(f"  [ISSUE] {fname}: script tags unbalanced ({opens} opens, {closes} closes)")
            issues += 1
    
    for subdir in ['destination', 'blog', '']:
        if subdir:
            d = os.path.join(DIST, subdir)
        else:
            d = DIST
        for fp in sorted(glob.glob(os.path.join(d, '*.html')))[:3]:  # sample
            with open(fp, encoding='utf-8') as f:
                content = f.read()
            fname = os.path.basename(fp)
            opens = len(re.findall(r'<script\b', content))
            closes = content.count('</script>')
            if opens != closes:
                print(f"  [ISSUE] {fname}: script tags unbalanced")
                issues += 1
    
    if issues == 0:
        print(f"  No issues found in sampled files")


def main():
    verify_schema_coverage()
    verify_file_sizes()
    sync_to_public()
    check_html_validity()
    print("\n=== Verification Complete ===")

if __name__ == '__main__':
    main()
