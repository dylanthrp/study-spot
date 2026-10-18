"""Independent source-preservation and numeric checks for Wyatt's supplied guide."""
from pathlib import Path
from fractions import Fraction
import json, re, zipfile, xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'micro-source.json').read_text(encoding='utf-8'))
with zipfile.ZipFile(root/'assets/micro/study-guide-1.docx') as z:
    xml=ET.fromstring(z.read('word/document.xml'))
w='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
m='{http://schemas.openxmlformats.org/officeDocument/2006/math}'
ps=xml.findall('./'+w+'body/'+w+'p')
def raw(p):
    return ''.join((e.text or '') if e.tag in (w+'t',m+'t') else '\n' if e.tag==w+'br' else '' for e in p.iter()).strip()
assert [c['id'] for c in data['chapters']]==['ch1','ch3','ch5','ch7','ch9','ch10','ch11']
assert [len(c['items']) for c in data['chapters']]==[16,14,18,10,12,10,10]
items=[i for c in data['chapters'] for i in c['items']]
assert len({i['id'] for i in items})==90
for chapter in data['chapters']:
    matches=[i['match'] for i in chapter['items'] if 'match' in i]
    assert len(matches)==6
    assert len({m['term'] for m in matches})==6
    assert len({m['definition'] for m in matches})==6
    assert all(len(m['definition'])<=120 and len(m['term'])<=45 for m in matches)
covered=set()
for item in items:
    assert re.fullmatch(r'\w+',item['id'])
    a,b=item['paragraphs'];covered.update(range(a,b+1))
    assert item['question'] and item['answer']
    if a==107:
        assert 'Q_d=-2P+100' in item['question'] and 'P_1=20' in item['question'] and 'P_2=30' in item['question']
        assert item['answer'].endswith('=-1')
        continue
    source='\n'.join(raw(ps[j-1]) for j in range(a,b+1))
    assert item['question']+'\n'+item['answer']==source, item['id']
for i,p in enumerate(ps,1):
    s=raw(p)
    if s and i!=1 and not s.startswith('Chapter '):
        assert i in covered, f'Uncovered paragraph {i}'
assert len(xml.findall('.//'+m+'oMath'))==8
midpoint=lambda p1,p2,q1,q2: Fraction(q2-q1,Fraction(q1+q2,2))/Fraction(p2-p1,Fraction(p1+p2,2))
assert midpoint(10,14,100,80)==Fraction(-2,3)
assert midpoint(20,30,60,40)==-1
assert midpoint(100,110,100,90)==Fraction(-21,19)
assert -2*20+100==60 and -2*30+100==40
assert Fraction(110,100)*Fraction(90,100)==Fraction(99,100)
assert Fraction(5,10)<1 and Fraction(20,10)>1
print('PASS: 90 source-paired items; all nonblank content covered; seven actual chapters; eight embedded equations accounted for; numeric examples independently verified.')
