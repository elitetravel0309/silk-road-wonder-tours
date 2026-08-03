"""
1. Fix truncated meta description in classic-tibet-discovery.html
2. Add TouristDestination Schema to all 17 destination pages
3. Sync changes back to public/ directory
"""
import re, json, os, glob

DIST_DIR = r'C:\Users\Administrator\WorkBuddy\2026-05-28-23-54-44\silkroad-travel\dist'
PUBLIC_DIR = r'C:\Users\Administrator\WorkBuddy\2026-05-28-23-54-44\silkroad-travel\public'

# Destination descriptions for TouristDestination schema
DEST_DESCRIPTIONS = {
    'beijing': "Beijing, China's capital with over 3,000 years of history, is the gateway to the Great Wall, Forbidden City, Temple of Heaven, and Summer Palace. As the eastern terminus of the Silk Road, Beijing blends imperial grandeur with modern vibrancy.",
    'xian': "Xi'an, ancient capital of 13 dynasties and the eastern starting point of the Silk Road, is home to the world-famous Terracotta Army, ancient City Wall, and the vibrant Muslim Quarter reflecting centuries of cultural exchange.",
    'shanghai': "Shanghai, China's largest city and global financial hub, showcases a stunning contrast between futuristic Pudong skyscrapers and historic Bund architecture. A gateway to eastern China's water towns and Jiangnan culture.",
    'kashgar': "Kashgar, the legendary Silk Road crossroads at the foot of the Pamir Mountains, is famous for its centuries-old Sunday Bazaar, the Id Kah Mosque, and the atmospheric Old City with its maze of mud-brick alleys.",
    'dunhuang': "Dunhuang, the oasis city on the edge of the Gobi Desert, is renowned for the UNESCO-listed Mogao Caves with 1,000 years of Buddhist art, the singing Sand Dunes, and Crescent Moon Spring.",
    'zhangjiajie': "Zhangjiajie, home to the otherworldly sandstone pillars that inspired Avatar's floating mountains, features the world's longest glass bridge, Tianmen Mountain's Heaven's Gate, and pristine sub-tropical forests.",
    'chongqing': "Chongqing, the 'Mountain City' on the Yangtze River, is famous for its fiery hotpot cuisine, dramatic river confluence, and as the gateway to the Three Gorges and Dazu Rock Carvings.",
    'guangzhou': "Guangzhou, the southern gateway of the ancient Maritime Silk Road, is a dynamic metropolis blending Cantonese culinary traditions with cutting-edge modernity along the Pearl River Delta.",
    'huangshan': "Huangshan (Yellow Mountain), a UNESCO World Heritage site, is celebrated for its granite peaks, ancient pine trees, hot springs, and sea of clouds — one of China's most iconic natural landscapes.",
    'luoyang': "Luoyang, one of China's Four Great Ancient Capitals, is home to the UNESCO-listed Longmen Grottoes with 100,000 Buddhist statues, the White Horse Temple, and spectacular peony gardens.",
    'uzbekistan': "Uzbekistan, the heart of the ancient Silk Road, dazzles with the turquoise domes of Samarkand, the medieval madrasas of Bukhara, and the fortress city of Khiva — a living museum of Islamic architecture.",
    'kyrgyzstan': "Kyrgyzstan, the 'Switzerland of Central Asia', offers pristine alpine lakes, nomadic yurt stays on lush jailoo pastures, and the towering Tien Shan mountains — an adventure traveler's paradise.",
    'kazakhstan': "Kazakhstan, the world's largest landlocked country, blends nomadic steppe traditions with futuristic Astana, while Almaty offers snow-capped mountain views and the ancient Silk Road city of Turkistan.",
    'mongolia': "Mongolia, the land of Genghis Khan and endless blue skies, invites travelers to experience the Gobi Desert's singing dunes, stay with nomadic herders, and discover the ancient capital of Karakorum.",
    'pakistan': "Pakistan, where the Karakoram Highway meets the Indus Valley civilization, offers the world's highest mountains, ancient Gandhara Buddhist sites, and the vibrant culture of Lahore and Hunza Valley.",
    'tajikistan': "Tajikistan, perched on the roof of the world along the Pamir Highway, is a land of towering peaks, crystal-clear alpine lakes, and warm Pamiri hospitality in remote mountain villages.",
    'turkmenistan': "Turkmenistan, home to the mysterious Darvaza Gas Crater (Door to Hell) and the marble-clad capital of Ashgabat, preserves the ancient Silk Road cities of Merv and Konye-Urgench."
}

def fix_truncated_meta():
    """Fix the truncated meta description in classic-tibet-discovery.html"""
    filepath = os.path.join(DIST_DIR, 'tour', 'classic-tibet-discovery.html')
    
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    
    old_desc = 'one of t"'
    new_desc = 'one of the world\'s highest and most sacred lakes."'
    
    if old_desc in content:
        content = content.replace(
            'Namtso Lake, one of t"',
            'Namtso Lake, one of the world\'s highest and most sacred lakes."'
        )
        # Also fix in og:description and twitter:description
        content = content.replace(
            'Namtso Lake, one of t">',
            'Namtso Lake, one of the world\'s highest and most sacred lakes.">'
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [FIXED] classic-tibet-discovery.html truncated meta description")
        return True
    else:
        print(f"  [SKIP] classic-tibet-discovery.html - truncated text not found (may already be fixed)")
        return False

def add_destination_schema(filepath):
    """Add TouristDestination schema alongside existing BreadcrumbList for destination pages"""
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    
    fname = os.path.basename(filepath).replace('.html', '')
    
    # Get destination name for schema
    dest_name = fname.replace('-', ' ').title()
    # Special names
    name_map = {
        'xian': "Xi'an",
        'kashgar': "Kashgar",
        'uzbekistan': "Uzbekistan",
        'kyrgyzstan': "Kyrgyzstan",
        'kazakhstan': "Kazakhstan",
        'tajikistan': "Tajikistan",
        'turkmenistan': "Turkmenistan",
        'mongolia': "Mongolia",
        'pakistan': "Pakistan",
        'zhangjiajie': "Zhangjiajie",
        'chongqing': "Chongqing",
        'huangshan': "Huangshan",
        'guangzhou': "Guangzhou",
        'luoyang': "Luoyang",
        'dunhuang': "Dunhuang",
        'shanghai': "Shanghai",
        'beijing': "Beijing",
    }
    display_name = name_map.get(fname, dest_name)
    
    desc = DEST_DESCRIPTIONS.get(fname, f'Discover {display_name} with Silk Road Wonders.')
    
    url = f'https://silkroadwondertours.com/destination/{fname}.html'
    
    schema = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        "name": display_name,
        "description": desc,
        "url": url,
        "touristType": ["Cultural", "Historical"],
        "includesAttraction": {
            "@type": "TouristAttraction",
            "name": display_name
        }
    }
    
    schema_block = f',\n<script type="application/ld+json">\n{json.dumps(schema, indent=2, ensure_ascii=False)}\n</script>'
    
    # Insert right after BreadcrumbList schema closing </script>
    breadcrumb_end = content.find('</script>', content.find('BreadcrumbList'))
    if breadcrumb_end < 0:
        # Fallback: insert after opening <main>
        main_m = re.search(r'<main id="main-content">', content)
        if main_m:
            breadcrumb_end = main_m.end()
        else:
            print(f"  [SKIP] {fname} - no insertion point")
            return False
    
    new_content = content[:breadcrumb_end + len('</script>')] + schema_block + content[breadcrumb_end + len('</script>'):]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

def sync_to_public(dist_path, public_path):
    """Sync a dist file to public directory if public file exists"""
    if os.path.exists(public_path):
        with open(dist_path, encoding='utf-8') as f:
            content = f.read()
        with open(public_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("=== 1. Fix truncated meta description ===")
    fix_truncated_meta()
    
    print("\n=== 2. Add TouristDestination Schema to destination pages ===")
    dest_dir = os.path.join(DIST_DIR, 'destination')
    dest_files = sorted(glob.glob(os.path.join(dest_dir, '*.html')))
    
    added = 0
    for fp in dest_files:
        fname = os.path.basename(fp).replace('.html', '')
        try:
            add_destination_schema(fp)
            added += 1
            # Sync to public
            pub_path = os.path.join(PUBLIC_DIR, 'destination', os.path.basename(fp))
            if sync_to_public(fp, pub_path):
                pass  # synced
        except Exception as e:
            print(f"  [ERROR] {fname} - {e}")
    
    print(f"  {added}/17 destination pages enhanced with TouristDestination Schema")
    
    print("\n=== 3. Summary ===")
    print(f"Meta description fix: classic-tibet-discovery.html")
    print(f"Destination schemas: {added} pages")

if __name__ == '__main__':
    main()
