"""
Batch add TouristTrip Schema.org to thin tour pages in dist/tour/
Also adds to public/tour/ for source files if they exist.
"""
import re, json, os, glob
from html import unescape

DIST_DIR = r'C:\Users\Administrator\WorkBuddy\2026-05-28-23-54-44\silkroad-travel\dist\tour'

def extract_page_data(content, filepath):
    """Extract key data from a tour HTML page"""
    data = {}
    
    # Title
    title_m = re.search(r'<title>(.*?) \|', content)
    if title_m:
        data['title'] = unescape(title_m.group(1).strip())
    
    # Meta description
    desc_m = re.search(r'<meta name="description" content="(.*?)"', content)
    if desc_m:
        data['description'] = unescape(desc_m.group(1).strip())
    
    # Hero image
    image_m = re.search(r"background-image:url\('([^']+)'\)", content)
    if image_m:
        data['image'] = image_m.group(1)
    
    # Price
    price_m = re.search(r'class="price-big">\$([\d,]+)', content)
    if price_m:
        data['price'] = price_m.group(1).replace(',', '')
    
    # Day count
    days = re.findall(r'<div class="day-badge"><strong>(\d+)</strong>', content)
    if days:
        data['dayCount'] = max(int(d) for d in days)
    
    # Tourist types - infer from content
    types = []
    content_lower = content.lower()
    if 'group' in content_lower:
        types.append('Group')
    if 'private' in content_lower or 'tailor' in content_lower:
        types.append('Private')
    if 'luxury' in content_lower or '5-star' in content_lower:
        types.append('Luxury')
    if 'photography' in content_lower or 'photo' in content_lower:
        types.append('Photography')
    if 'trek' in content_lower or 'hiking' in content_lower:
        types.append('Adventure')
    if 'culture' in content_lower or 'heritage' in content_lower or 'history' in content_lower:
        types.append('Cultural')
    if not types:
        types = ['Cultural']
    data['touristType'] = types
    
    # URL
    rel_path = os.path.relpath(filepath, os.path.dirname(DIST_DIR))
    data['url'] = f'https://silkroadwondertours.com/{rel_path.replace(os.sep, "/")}'
    
    return data


def generate_schema(data):
    """Generate TouristTrip JSON-LD schema"""
    schema = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": data.get('title', 'Silk Road Tour'),
        "description": data.get('description', ''),
        "url": data.get('url', 'https://silkroadwondertours.com'),
        "image": data.get('image', '/assets/images/hero-silkroad.jpg'),
        "touristType": data.get('touristType', ['Cultural']),
        "provider": {
            "@type": "TravelAgency",
            "name": "Silk Road Wonders",
            "url": "https://silkroadwondertours.com",
            "telephone": "+8615347723823",
            "email": "booking@silkroadwondertours.com",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Urumqi",
                "addressRegion": "Xinjiang",
                "addressCountry": "CN"
            }
        },
        "itinerary": {
            "@type": "Trip"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "USD"
        }
    }
    
    if data.get('dayCount'):
        schema['itinerary']['itineraryDayCount'] = data['dayCount']
    if data.get('price'):
        schema['offers']['price'] = data['price']
    
    return json.dumps(schema, indent=2, ensure_ascii=False)


def process_file(filepath):
    """Add schema to a single tour page"""
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has schema
    if 'application/ld+json' in content:
        return False, "already has schema"
    
    # Extract data
    data = extract_page_data(content, filepath)
    schema_json = generate_schema(data)
    schema_block = f'<script type="application/ld+json">\n{schema_json}\n</script>'
    
    # Insert after the opening <main> tag
    main_match = re.search(r'<main id="main-content">\s*', content)
    if main_match:
        insert_pos = main_match.end()
    else:
        # Fallback: insert before </body>
        insert_pos = content.rfind('</body>')
        if insert_pos < 0:
            return False, "no insertion point found"
    
    new_content = content[:insert_pos] + '\n' + schema_block + '\n' + content[insert_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True, f"added ({data.get('dayCount', '?')}d, ${data.get('price', '?')})"


def main():
    tour_files = glob.glob(os.path.join(DIST_DIR, '*.html'))
    print(f"Found {len(tour_files)} tour pages\n")
    
    added = 0
    skipped = 0
    errors = 0
    
    for fp in sorted(tour_files):
        fname = os.path.basename(fp)
        try:
            ok, msg = process_file(fp)
            if ok:
                added += 1
                print(f"  [ADDED] {fname} — {msg}")
            else:
                skipped += 1
                if msg != "already has schema":
                    print(f"  [SKIP]  {fname} — {msg}")
        except Exception as e:
            errors += 1
            print(f"  [ERROR] {fname} — {e}")
    
    print(f"\nDone: {added} added, {skipped} skipped, {errors} errors")


if __name__ == '__main__':
    main()
