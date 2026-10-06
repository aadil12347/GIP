import re
from bs4 import BeautifulSoup

with open('index.backup.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

main = soup.find('main')
header = main.find('header')
sections = main.find_all('section')

print(f"Loaded {len(sections)} sections from backup.")

# Collect all 15 videos
videos = []
for s in sections:
    sec_id = s.get('id', '')
    sec_h2 = s.find('h2')
    sec_title = sec_h2.text.strip() if sec_h2 else ''
    for ifr in s.find_all('iframe'):
        src = ifr.get('src', '')
        # find closest h4 and p
        parent_card = ifr.find_parent(class_=['card', 'video-grid'])
        h4 = ifr.find_next('h4')
        p = ifr.find_next('p')
        h4_text = h4.text.strip() if h4 else "Masterclass Lecture"
        p_text = p.text.strip() if p else ""
        videos.append({
            'section_id': sec_id,
            'section_title': sec_title,
            'title': h4_text,
            'desc': p_text,
            'src': src
        })

print(f"Extracted {len(videos)} videos:")
for i, v in enumerate(videos):
    print(f"{i+1}. {v['title']} ({v['section_id']})")
