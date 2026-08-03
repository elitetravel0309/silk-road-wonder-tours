"""Extract data from thin tour pages to test schema generation"""
import re, json, sys, os

filepath = sys.argv[1] if len(sys.argv) > 1 else r'C:\Users\Administrator\WorkBuddy\2026-05-28-23-54-44\silkroad-travel\dist\tour\classic-beijing-tour.html'

with open(filepath, encoding='utf-8') as f:
    content = f.read()

title_m = re.search(r'<title>(.*?) \|', content)
desc_m = re.search(r'<meta name="description" content="(.*?)"', content)
route_m = re.search(r'<p class="route">(.*?)</p>', content)
image_m = re.search(r"background-image:url\('([^']+)'\)", content)
price_m = re.search(r'class="price-big">\$([\d,]+)', content)
days_m = re.findall(r'<div class="day-badge"><strong>(\d+)</strong>', content)

print('Title:', title_m.group(1).strip() if title_m else 'N/A')
print('Description:', desc_m.group(1)[:120] if desc_m else 'N/A')
print('Route:', route_m.group(1) if route_m else 'N/A')
print('Image:', image_m.group(1) if image_m else 'N/A')
print('Price:', price_m.group(1) if price_m else 'N/A')
print('Days:', days_m)
print('Day count:', len(days_m) if days_m else 0)
print('Last day:', max(int(d) for d in days_m) if days_m else 'N/A')

# Find highlights
hl_start = content.find('Tour Highlights')
if hl_start >= 0:
    hl_chunk = content[hl_start:hl_start+2000]
    hl_items = re.findall(r'<li>(.*?)</li>', hl_chunk)
    print('Highlights:', hl_items[:5])

# Check if page already has schema
has_schema = 'application/ld+json' in content
print('Has schema:', has_schema)
print('File size:', len(content))
