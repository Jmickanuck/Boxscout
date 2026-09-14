"""Extract factual rows using the reviewed input's exact family labels.
Usage: python extract-prizm-variants.py source.xls source.html input.json output.json
Requires xlrd 2.0.2 in an isolated tooling environment. Never overwrites review input.
The output is UNAPPROVED until identity/numbering/eligibility review is completed.
"""
import sys, json, re, html
from pathlib import Path
import xlrd
workbook, page, template, destination = sys.argv[1:]
d = json.loads(Path(template).read_text(encoding="utf8"))
s = xlrd.open_workbook(workbook).sheet_by_index(0)
assert s.cell_value(0,0) == "2026 Panini Prizm FIFA World Cup Soccer Cards Checklist"
assert s.row_values(2) == ["CARD #","CARD SET","ATHLETE","TEAM","POSITION","SEQUENCE"]
labels = {f["sourceLabel"] for f in d["families"]}
d["rows"] = []
for r in range(3,s.nrows):
    v = s.row_values(r)
    if v[1] not in labels:
        continue
    number = str(int(v[0])) if isinstance(v[0],float) else str(v[0])
    d["rows"].append(dict(sourceLabel=v[1],number=number,name=v[2].strip(),country=v[3].strip(),sequence=int(v[5]) if isinstance(v[5],float) else v[5],locator=f"{s.name}!A{r+1}:F{r+1}"))
h = Path(page).read_text(encoding="utf8")
d["corroboration"] = []
for subset in d["subsets"]:
    if subset["type"] == "BASE":
        continue  # Existing base source reconciliation remains in its own importer.
    name = subset["name"]
    start = h.index(name+" Checklist")
    section = h[start:h.find("<h3>",start)]
    for block in re.findall(r"<div>(.*?)</div>",section,re.S):
        for line in re.split(r"<br\s*/?>",block):
            match = re.fullmatch(r"(\d+) (.+) - (.+)",html.unescape(re.sub("<[^>]+>","",line)).strip())
            if match:
                d["corroboration"].append(dict(subset=name,number=match[1],name=match[2],country=match[3]))
d["review"]["approved"] = False
d["review"]["rationale"] = "Source refresh requires explicit review; update dates/hashes and reconcile before promotion."
Path(destination).write_text(json.dumps(d,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
