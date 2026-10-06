import re
from bs4 import BeautifulSoup

with open('index.backup.html', encoding='utf-8') as f:
    html_soup = BeautifulSoup(f.read(), 'html.parser')

with open('index.backup.css', encoding='utf-8') as f:
    css_text = f.read()

themes = set(re.findall(r'data-theme=\"([^\"]+)\"', css_text))
print("Themes defined in CSS:", themes)

sections = html_soup.find_all('section')
print("Sections count:", len(sections))
for s in sections:
    vids = s.find_all('iframe')
    print(f"- {s.get('id')}: {len(vids)} videos")

all_iframes = html_soup.find_all('iframe')
print(f"Total Videos in backup: {len(all_iframes)}")
for i, ifr in enumerate(all_iframes):
    src = ifr.get('src')
    # find parent title
    parent = ifr.find_parent(class_=['video-grid', 'card', 'section'])
    h4 = ifr.find_next('h4')
    h4_text = h4.text.strip() if h4 else "No H4"
    print(f"Video {i+1}: {h4_text} -> {src}")
