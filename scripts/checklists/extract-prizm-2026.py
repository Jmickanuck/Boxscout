"""Product-specific source adapter; offline replay needs only the committed factual JSON.
Usage: python extract-prizm-2026.py source.xls source.html output-directory
Requires xlrd==2.0.2 in a temporary venv, never an application dependency.
Output is unreviewed: do not overwrite a reviewed import without reconciliation.
"""
import html
import json
from pathlib import Path
import re
import sys
import xlrd

workbook, page, output = sys.argv[1:]
sheet = xlrd.open_workbook(workbook).sheet_by_index(0)
assert sheet.cell_value(0, 0) == '2026 Panini Prizm FIFA World Cup Soccer Cards Checklist'
assert sheet.row_values(2) == ['CARD #', 'CARD SET', 'ATHLETE', 'TEAM', 'POSITION', 'SEQUENCE']
gts = []
for i in range(3, sheet.nrows):
    row = sheet.row_values(i)
    if row[1] == 'Base':  # Exact membership; never prefix-match Base parallels/variations.
        assert isinstance(row[0], (str, float))
        number = str(int(row[0])) if isinstance(row[0], float) and row[0].is_integer() else str(row[0])
        gts.append(dict(cardNumber=number, subset=row[1], playerName=row[2], country=row[3], locator=f'{sheet.name}!A{i+1}:F{i+1}'))
page_text = Path(page).read_text(encoding='utf-8')
start = page_text.index('<div>1 Julian Alvarez - Argentina')
end = page_text.index('</div>', start)
ci = []
for line in re.split(r'<br\s*/?>', page_text[start+5:end]):
    text = html.unescape(re.sub('<[^>]+>', '', line)).strip()
    match = re.fullmatch(r'(\d+) (.+) - (.+)', text)
    assert match, f'Unexpected checklist line: {text}'
    number, player, country = match.groups()
    ci.append(dict(cardNumber=number, subset='Base', playerName=player, country=country, locator=f'Base Checklist / #{number}'))
assert len(gts) == len(ci) == 500
destination = Path(output)
destination.mkdir(parents=True, exist_ok=True)
for name, rows in [('gts', gts), ('ci', ci)]:
    # Same stable JSON encoding as the reviewed extracts; raw strings remain intact.
    text = '[\n' + ',\n'.join('  '+json.dumps(row, ensure_ascii=False, separators=(',', ':')) for row in rows) + '\n]\n'
    (destination / f'{name}.json').write_text(text, encoding='utf-8', newline='\n')
