"""Extract the supplied guide, including OMML equations; preserve source answers.
Usage: python scripts/extract-micro.py PATH_TO_DOCX
Paragraph numbers refer to top-level Word body paragraphs, including blanks.
"""
from pathlib import Path
import sys, json, zipfile, xml.etree.ElementTree as ET
from fractions import Fraction

ROOT = Path(__file__).resolve().parents[1]
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
M = 'http://schemas.openxmlformats.org/officeDocument/2006/math'

def text(e):
    tag = e.tag.split('}')[-1]
    if tag == 't': return e.text or ''
    if tag == 'br': return '\n'
    if tag == 'tab': return '\t'
    if tag.endswith('Pr'): return ''
    if e.tag == '{'+M+'}f':
        return '('+text(e.find('{'+M+'}num'))+')/('+text(e.find('{'+M+'}den'))+')'
    if e.tag == '{'+M+'}sSub':
        return text(e.find('{'+M+'}e'))+'_'+text(e.find('{'+M+'}sub'))
    if e.tag == '{'+M+'}d':
        return '('+''.join(text(x) for x in e if x.tag == '{'+M+'}e')+')'
    return ''.join(text(x) for x in e)

def extract(source):
    with zipfile.ZipFile(source) as z:
        root = ET.fromstring(z.read('word/document.xml'))
    paragraphs = {i: text(p).strip() for i,p in enumerate(root.findall('./{'+W+'}body/{'+W+'}p'),1)}
    specs = [(1,'Foundations and choices',3,35),(3,'Supply, demand and markets',36,66),(5,'Elasticity',67,109),(7,'Surplus and efficiency',110,120),(9,'International trade',121,133),(10,'Externalities',134,145),(11,'Public goods and common resources',146,158)]
    chapters=[]
    for num,title,start,end in specs:
        chapter={'id': 'ch'+str(num), 'title':f'Chapter {num} · {title}', 'items':[]}
        i=start+1
        while i<=end:
            s=paragraphs[i]
            if not s: i+=1; continue
            first=i
            if i in (101,107):
                last=105 if i==101 else 109
                q=s; a='\n'.join(paragraphs[j] for j in range(i+1,last+1) if paragraphs[j]); i=last+1
            elif '\n' in s:
                q,a=s.split('\n',1); last=i; i+=1
            else:
                q=s; i+=1
                while i<=end and not paragraphs[i]: i+=1
                assert i<=end, f'Missing answer: {q}'
                a=paragraphs[i];last=i;i+=1
            chapter['items'].append({'id':f'micro{num}p{first}', 'question':q.strip(),'answer':a.strip(),'paragraphs':[first,last]})
        chapters.append(chapter)
    notes={
      31:'Study clarification: diminishing marginal utility helps explain consumer choices; income and substitution effects also matter for demand.',
      33:'Study clarification: compare marginal benefit and marginal cost in the same units, such as willingness to pay in dollars versus dollar cost. Raw utility units cannot be compared directly with dollars.',
      34:'Study clarification: compare the extra willingness to pay with the extra subscription price; utility and dollar cost need a common unit.',
      48:'Terminology: a surplus means quantity supplied exceeds quantity demanded at the current price, not that the supply curve exceeds the demand curve.',
      50:'Terminology: a shortage means quantity demanded exceeds quantity supplied at the current price.',
      52:'Qualification: self-interest does not guarantee efficiency when externalities, market power or other market failures are present.',
      72:'Precision note: unit elasticity means equal percentage changes using a consistent convention (or locally). A literal 10% increase and 10% decrease measured from initial values changes revenue to 1.10 × 0.90 = 0.99 of the original, not exactly unchanged. Midpoint percentages avoid this inconsistency for the two-point example.',
      94:'Qualification: a luxury has income elasticity greater than 1; merely positive income elasticity means a normal good.',
      115:'Qualification: the surplus-maximizing result assumes competitive markets without externalities or other relevant market failures.',
      124:'Model scope: the import/export and surplus conclusions use the standard small-country competitive-market model, without trade costs or externalities.',
      139:'Precision note: the efficient corrective tax equals marginal external damage at the socially efficient quantity, rather than total external cost.',
      140:'Qualification: the cost advantage relies on suitable information and enforcement; a tax is not always superior to every possible regulation.',
      142:'Coase clarification: with well-defined enforceable rights and negligible transaction costs, bargaining can reach an efficient outcome. Initial rights affect who pays whom; under the standard assumptions they need not determine the efficient activity level.',
      152:'Example clarification: a shared clean-air resource can be depleted through pollution; the benefit of clean air is often modeled as a public good. Rivalry depends on whether the example concerns consumption of the benefit or use of the limited pollution-absorption resource.',
      154:'Qualification: underprovision is driven by nonexcludability and free riding. Public-good classification itself is about rivalry and excludability, not simply the presence of any positive externality.',
      156:'Model scope: this assumes unrestricted access. If a password or payment excludes users, Wi-Fi can instead be an excludable club good before congestion.'
    }
    notes.update({
      38:'Terminology: own-price changes affect quantity demanded (movement along the demand curve), not demand (a shift of the curve).',
      50:'Terminology: a shortage means quantity demanded exceeds quantity supplied at the current price. Rising own price increases quantity supplied and decreases quantity demanded along existing curves; it does not itself shift either curve.',
      72:'Precision note: unit-elastic demand has absolute elasticity 1 (signed elasticity -1). A literal 10% price increase and 10% quantity decrease from initial values changes revenue to 1.10 × 0.90 = 0.99 of its original level. Those same endpoints have midpoint elasticity -21/19, not -1. Equal midpoint percentage changes imply unchanged endpoint revenue; constant revenue throughout an interval requires unit elasticity throughout that interval.',
      74:'Precision note: classifications use absolute demand elasticity. For a finite two-point comparison, use midpoint percentages consistently: absolute arc elasticity 1 corresponds to equal endpoint revenues. Local unit elasticity alone does not guarantee unchanged revenue for every finite price change.',
      143:'Precision note: cost-effective abatement equalizes marginal abatement costs, not necessarily total costs or amounts reduced. Firms can reduce pollution by different amounts at the same marginal abatement cost.',
      144:'Qualification: competitive, enforceable permit trading can meet a given cap at minimum total abatement cost by equalizing marginal abatement costs. Social efficiency also requires an appropriately chosen cap and consideration of differences in damages across sources.',
      150:'Qualification: free riding means ordinary voluntary markets tend to underprovide public goods, not that efficient provision by every private or voluntary arrangement is impossible.'
    })
    for para in [60,62,68,70,82]:
        notes[para]='Precision note: price elasticity is percentage change in quantity divided by percentage change in price. Demand classification compares the absolute ratio with 1; more or less refers to percentage changes, not units versus dollars.'
    for para in [136,137]:
        notes[para]='Model scope: this explanation describes a negative production externality, with social marginal cost above private marginal cost. A negative consumption externality instead puts social marginal benefit below private marginal benefit.'
    for para in [112,114]:
        notes[para]='Clarification: the competitive supply curve reflects marginal opportunity cost. In the standard short-run firm model, producer surplus is revenue minus variable cost; profit also subtracts fixed cost.'
    for para in [128,129]:
        notes[para]='Model scope: in the small-country model, count consumer surplus, producer surplus and government tariff revenue before identifying deadweight loss. A nonprohibitive tariff raises revenue; a prohibitive tariff eliminates imports and import-tax revenue. Deadweight losses reflect distorted production and consumption.'
    for ch in chapters:
        for item in ch['items']:
            if item['paragraphs'][0] in notes: item['note']=notes[item['paragraphs'][0]]
    assert Fraction(-20,90)/Fraction(4,12)==Fraction(-2,3)
    assert Fraction(40-60,50)/Fraction(30-20,25)==-1
    assert Fraction(110,100)*Fraction(90,100)==Fraction(99,100)
    assert Fraction(5,10)==Fraction(1,2) and Fraction(20,10)==2
    return {'source_file':Path(source).name,'title':'Microeconomics · Study guide 1','scope_note':'Organized from the supplied guide’s actual sections: chapters 1, 3, 5, 7, 9, 10 and 11. Its opening line says Macroeconomics and lists a different chapter range; no missing chapter content has been invented. Answers retain the supplied wording; separate study clarifications are explanatory annotations, not an official answer key. Embedded Word equations are transcribed into plain-text fractions and subscripts.','chapters':chapters,'unresolved':[]}

if __name__=='__main__':
    data=extract(sys.argv[1])
    data['source_url']='assets/micro/study-guide-1.docx'
    matching=json.loads((ROOT/'micro-match.json').read_text(encoding='utf-8'))
    data['match_description']=matching['description']
    for chapter in data['chapters']:
        for item in chapter['items']:
            if item['id'] in matching['pairs']:
                term,definition=matching['pairs'][item['id']]
                item['match']={'term':term,'definition':definition}
    out=ROOT/'micro-source.json'
    out.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({c['id']:len(c['items']) for c in data['chapters']}))
    print('Total cards:',sum(len(c['items']) for c in data['chapters']))
    print('Both midpoint calculations independently verified; OMML fractions retained.')
