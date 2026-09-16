#!/usr/bin/env python3
"""Sjekker at alle lokale lenker og bilde-referanser i de bygde HTML-filene finnes.
Bruk: python3 scripts/sjekk-lenker.py   (fra prosjektroten)"""
import os, re, sys, glob
from urllib.parse import urlparse, unquote

ROT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
filer = ['index.html', 'produksjoner.html'] + sorted(glob.glob('artister/*.html'))
feil, eksterne, antall = [], set(), 0

for f in filer:
    sti = os.path.join(ROT, f)
    if not os.path.exists(sti):
        feil.append(f'{f}: filen finnes ikke'); continue
    h = open(sti, encoding='utf-8').read()
    for attr in ('href', 'src', 'srcset'):
        for m in re.finditer(attr + r'="([^"]+)"', h):
            verdi = m.group(1).strip()
            if not verdi or verdi.startswith(('#', 'mailto:', 'tel:', 'data:')):
                continue
            if attr == 'srcset':
                deler = [d.strip().split(' ')[0] for d in verdi.split(',')]
            else:
                deler = [verdi]
            for d in deler:
                if d.startswith('http'):
                    eksterne.add(urlparse(d).netloc); continue
                if d.startswith('//'):
                    eksterne.add(urlparse(d).netloc); continue
                antall += 1
                mal = os.path.normpath(os.path.join(ROT, os.path.dirname(f), unquote(d.split('#')[0])))
                if not os.path.exists(mal):
                    feil.append(f'{f}: mangler {d}')

# sjekk at hver artist har bilde i begge størrelser og en side
import json
artister = json.load(open(os.path.join(ROT, 'data/artister.json'), encoding='utf-8'))
for a in artister:
    for storrelse in ('400', '800'):
        p = os.path.join(ROT, f'assets/artister/{a["bilde"]}-{storrelse}.webp')
        if not os.path.exists(p):
            feil.append(f'bilde mangler: assets/artister/{a["bilde"]}-{storrelse}.webp')
    if not os.path.exists(os.path.join(ROT, f'artister/{a["slug"]}.html')):
        feil.append(f'side mangler: artister/{a["slug"]}.html')

print(f'Sjekket {antall} lokale referanser i {len(filer)} filer.')
print('Eksterne verter:', ', '.join(sorted(eksterne)) or 'ingen')
if feil:
    print('\nFEIL:')
    for f in feil:
        print(' -', f)
    sys.exit(1)
print('Ingen døde lokale referanser.')