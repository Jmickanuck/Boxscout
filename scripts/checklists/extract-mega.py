"""Extract complete Mega families from a local manufacturer XLS and checklist HTML.
Usage: python extract-mega.py workbook.xls checklist.html output.json
Produces unapproved evidence; review discrepancies before publication.
"""
import sys, json, re, html, hashlib
from pathlib import Path
import xlrd
workbook,page,destination=sys.argv[1:]
s=xlrd.open_workbook(workbook).sheet_by_index(0)
assert s.row_values(2)==["CARD #","CARD SET","ATHLETE","TEAM","POSITION","SEQUENCE"]
old=json.loads(Path('data/imports/golden-product-variants/input.json').read_text(encoding='utf8'))
labels={}
for i in range(3,s.nrows):
 v=s.row_values(i)
 labels.setdefault(v[1],[]).append(dict(sourceLabel=v[1],number=str(int(v[0])) if isinstance(v[0],float) else str(v[0]),name=v[2].strip(),country=v[3].strip(),sequence=int(v[5]) if isinstance(v[5],float) else v[5],locator=f'{s.name}!A{i+1}:F{i+1}'))
regular=['Scorers Club','New Era','Connections','Aces','Phenomenon','Global Reach','Trophy Hunting','Screamers']
rare=['Color Blast','Color Blast Duals','Prizmania','Color Wheel','National Landmarks','World Cup Posters','Team Badges','Manga','National Pride','Alter Ego']
autos=['Signatures','Penmanship','International Ink','Global Graphs','National Heroes','2012 Prizm Throwback Signatures','1994 Team USA Signatures','Dual Signatures','Trio Signatures','Quad Signatures','Winning Captains','Signature Moments']
subsets=['Base']+regular+rare+autos
stamp='2026-09-15'
d={k:old[k] for k in ['releaseId']}
d.update(checkedAt=stamp,primarySourceId='mega-gts-workbook',corroboratingSourceId='mega-checklist-insider',subsets=[],families=[],rows=[],corroboration=[],sources=[{'id':'mega-gts-workbook','name':'Panini manufacturer checklist via GTS — Mega expansion','url':old['sources'][0]['url'],'checkedAt':stamp},{'id':'mega-checklist-insider','name':'Checklist Insider — Mega identity corroboration','url':'https://www.checklistinsider.com/2026-panini-prizm-fifa-world-cup-soccer','checkedAt':stamp},{'id':'mega-packaging-ce','name':'Collectors Emporium — Mega packaging, image 3','url':'https://collectorsemporium.com/en-ca/products/2026-panini-prizm-fifa-world-cup-trading-cards-mega-box','checkedAt':stamp},{'id':'mega-collectosk','name':'Collectosk — Mega version comparison','url':'https://www.collectosk.com/2026-panini-prizm-fifa-world-cup-2026-soccer-cards/','checkedAt':stamp},{'id':'mega-target','name':'Target — retail Mega listing','url':'https://www.target.com/p/panini-prizm-fifa-world-cup-2026-soccer-trading-card-mega-box/-/A-95267129','checkedAt':stamp}],configurations=[],eligibilityRules=[],review={'approved':False,'reviewedAt':stamp,'conflicts':[],'rationale':'Pending exact identity and packaging review.'})
# Include existing configuration identities for validation; merge preserves originals.
for c in old['configurations']:
 d['configurations'].append({**c,'sourceIds':['mega-collectosk']})
d['configurations'].append(dict(id='excell-mega',releaseId=d['releaseId'],name='Target / Excell Mega',confidence='PROBABLE',sourceIds=['mega-target','mega-collectosk']))
h=Path(page).read_text(encoding='utf8')
for name in subsets:
 slug=next((x['slug'] for x in old['subsets'] if x['name']==name),re.sub('[^a-z0-9]+','-',name.lower()).strip('-'))
 d['subsets'].append(dict(name=name,slug=slug,type='BASE' if name=='Base' else 'AUTOGRAPH' if name in autos else 'INSERT',count=len(labels[name])))
 if name!='Base':
  heading=name+(' Autographs' if name=='National Heroes' else '')+' Checklist'
  match=re.search(r'<h3[^>]*>'+re.escape(heading)+r'</h3>',h); assert match, heading
  start=match.start(); end=h.find('<h3',match.end())
  section=h[start:end]
  for block in re.findall(r'<div>(.*?)</div>',section,re.S):
   for line in re.split(r'<br\s*/?>',block):
    m=re.fullmatch(r'(\d+) (.+) - (.+)',html.unescape(re.sub('<[^>]+>','',line)).strip())
    if not m and name in ['World Cup Posters','Team Badges']:
     simple=re.fullmatch(r'(\d+) (.+)',html.unescape(re.sub('<[^>]+>','',line)).strip())
     if simple and not simple[2].startswith('cards.'):
      country=next((r['country'] for r in labels[name] if r['number']==simple[1]),'No Team')
      d['corroboration'].append(dict(subset=name,number=simple[1],name=simple[2],country=country))
    if m:d['corroboration'].append(dict(subset=name,number=m[1],name=m[2],country=m[3]))
 parallels=['default']
 if name=='Base':parallels+=['Silver','Disco','RGB Mojo','Purple Disco','Orange Disco','Fuchsia Disco','Red Disco','Gold Wave','Green Disco','Gold Power','Teal Disco','White Disco','Blue Disco','Pink Disco','Bronze Disco','Green and White Disco']
 elif name in regular:parallels+=['Silver','Wave','Gold Wave','Black Wave']
 elif name in autos:parallels+=['Wave','Gold Wave','Gold Power']
 for parallel in parallels:
  label=name if parallel=='default' else name+' Prizms '+parallel
  if label not in labels:
   d['review']['conflicts'].append('Missing family '+label);continue
  rows=labels[label];d['families'].append(dict(sourceLabel=label,subset=name,parallel=parallel,expectedCount=len(rows),serialTotal='per-entry'));d['rows']+=rows
  versions=[]
  if name=='Base':
   special={'Teal Disco':'excell-mega','White Disco':'excell-mega','Blue Disco':'hobby-mega','Pink Disco':'hobby-mega','Bronze Disco':'dsg-mega','Green and White Disco':'dsg-mega'}
   versions=[special[parallel]] if parallel in special else ['npp-mega']
   if parallel in ['default','Disco']:versions=['npp-mega','excell-mega','hobby-mega','dsg-mega']
   if parallel=='Silver':versions=['npp-mega','hobby-mega','dsg-mega']
  elif name in autos:
   if parallel!='default':versions=['npp-mega']
  else:versions=['npp-mega']
  if name in ['Color Blast','Manga','Prizmania','Alter Ego'] and parallel=='default':versions+=['excell-mega']
  for version in versions:
   source='mega-packaging-ce' if version=='npp-mega' else 'mega-collectosk'
   d['eligibilityRules'].append(dict(id='mega-009-'+version+'-'+re.sub('[^a-z0-9]+','-',label.lower()),configurationId=version,sourceLabel=label,status='INCLUDED',confidence='PROBABLE',sourceIds=[source],locator='Packaging image 3' if version=='npp-mega' else 'Products > '+version,rationale='Retailer packaging supports the NPP family; exact retailer mapping remains probable.' if version=='npp-mega' else 'Secondary version guide supports this family; no exact manufacturer barcode bridge asserted.'))
d['identityRows']=[]
for sub in d['subsets']:
 identity={}
 for f in d['families']:
  if f['subset']==sub['name']:
   for r in labels[f['sourceLabel']]:identity.setdefault(r['number'],{**r,'sourceLabel':sub['name']})
 d['identityRows']+=list(identity.values());sub['count']=len(identity)
for sub in d['subsets']:
 if sub['type']=='BASE':continue
 for r in [r for r in d['identityRows'] if r['sourceLabel']==sub['name']]:
  c=[x for x in d['corroboration'] if x['subset']==sub['name'] and x['number']==r['number']]
  norm=lambda x:re.sub(r'\s+',' ',x).strip()
  if len(c)!=1 or norm(c[0]['name'])!=norm(r['name']) or norm(c[0]['country'])!=norm(r['country']):d['review']['conflicts'].append({'subset':sub['name'],'number':r['number'],'manufacturer':[r['name'],r['country']],'secondary':c})
d['workbookSha256']=hashlib.sha256(Path(workbook).read_bytes()).hexdigest()
Path(destination).parent.mkdir(parents=True,exist_ok=True)
Path(destination).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Families',len(d['families']),'rows',len(d['rows']),'conflicts',len(d['review']['conflicts']))
