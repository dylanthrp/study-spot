/* ENGR-250: independent content, lifecycle and versioned student-local progress. */
const Engr250 = (() => {
  let generation=0, timer, pending;
  const memory={};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const modes=[['overview','Study plan'],['concepts','Concepts'],['practice','Practice'],['examples','Worked examples'],['sheet','Formula guide'],['games','Games'],['models','Interactive models']];
  const button=(id,label,primary=false)=>`<button type="button" class="ex-button${primary?' primary':''}" id="${id}">${esc(label)}</button>`;
  const citation=item=>`<p class="ex-source">Source: ${esc(item.source)}</p>`;
  const link=(who,mode,label)=>`<a class="ex-button primary" href="#/u/${who}/ENGR-250/${mode}">${esc(label)}</a>`;
  function cleanup(){generation++;clearInterval(timer);timer=null;}
  function load(who){
    if(memory[who])return memory[who];
    let saved;try{saved=JSON.parse(localStorage.getItem(`studyspot:ENGR250:v1:${who}`));}catch{}
    const fresh={prefs:{focus:false,size:'normal',spacing:false},history:{},cardHistory:{},cards:null,round:null,best:{},examples:{},model:{type:'FCC',radius:'0.128',mass:'63.546',temperature:'1000',energy:'1'},nextTopic:0};
    return memory[who]={...fresh,...saved,prefs:{...fresh.prefs,...saved?.prefs},model:{...fresh.model,...saved?.model}};
  }
  function save(who){try{localStorage.setItem(`studyspot:ENGR250:v1:${who}`,JSON.stringify(load(who)));}catch{const e=document.querySelector('#engrStorage');if(e)e.textContent='Storage unavailable: progress lasts for this visit only.';}}
  const options=(data,missed=false)=>`<option value="all">All exam topics</option>${data.topics.map(t=>`<option value="${esc(t.id)}">${esc(t.title)}</option>`).join('')}${missed?'<option value="missed">Previously missed</option>':''}`;
  const pool=(items,topic,history={})=>items.filter(c=>topic==='all'||(topic==='missed'?history[c.id]===false:c.topic===topic));
  function shuffled(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function focusHeading(el){const h=el.querySelector('#engrQuestion, #engrCardQuestion, h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});h.scrollIntoView({block:'start'});}}
  async function render(root,who,mode){
    cleanup();const token=generation;mode=modes.some(m=>m[0]===mode)?mode:'overview';document.body.classList.add('exam-active');
    root.innerHTML=`<section class="ex-card" id="engrLoading" role="status"><h1>Loading Engineering Materials…</h1><p>Source-backed Exam 1 materials are loading.</p><a href="#/u/${who}">Your dashboard</a></section>`;
    let data;
    try{pending ||= fetch('engr250-data.json').then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{pending=null;throw e;});data=await pending;}
    catch{if(token===generation)root.querySelector('#engrLoading p').textContent='Source materials are not available yet. Reload to retry; no substitute questions have been generated.';return;}
    if(token!==generation)return;
    const state=load(who);
    root.innerHTML=`<div id="engrRoom" class="ex-shell"><aside class="ex-sidebar"><a href="#/u/${who}">← Your dashboard</a><p class="ex-eyebrow">THE MATERIALS ROOM</p><h2>Structure.<br>Properties.<br>Connections.</h2><p class="ex-muted">ENGR-250 · Exam 1</p><nav aria-label="Engineering study modes">${modes.map(([id,title])=>`<a class="ex-nav ${mode===id?'selected':''}" ${mode===id?'aria-current="page"':''} href="#/u/${who}/ENGR-250/${id}">${title}</a>`).join('')}</nav><p class="ex-muted">Recall → apply → check → retry.</p></aside><main class="ex-main"><div class="ex-top"><span>${who==='charlie'?'Charlie':'Dylan'}’s study room</span><span>MODULES 1–4 · NO DIFFUSION</span></div><div class="ex-preferences"><label class="ex-toggle"><input id="engrFocus" type="checkbox">Focus view</label><label>Text size <select id="engrSize" aria-label="Text size"><option value="normal">Normal</option><option value="large">Large</option><option value="largest">Largest</option></select></label><label class="ex-toggle"><input id="engrSpacing" type="checkbox">Extra spacing</label><p id="engrStorage">Progress stays in this browser, separately for each student. Not an account or cloud sync.</p></div><aside class="engr-scope"><strong>Exam 1 · Modules 1–4</strong><p>${esc(data.scope)}</p><details><summary>Sources & study boundaries</summary><p>${esc(data.textbook.title)} · ${esc(Array.isArray(data.textbook.authors)?data.textbook.authors.join(' & '):data.textbook.authors)} · ${esc(data.textbook.edition)}</p><p>${esc(data.textbook.note)}</p><ul>${data.warnings.map(w=>`<li>${esc(w)}</li>`).join('')}</ul><p>Uploaded source PDFs stay private. Page citations identify your supplied notes; this room does not republish those files.</p><ul>${data.sources.map(s=>`<li><strong>${esc(s.title)}</strong> — ${esc(s.file)} · ${esc(s.pageNote)}</li>`).join('')}</ul></details></aside><div id="engrContent"></div><footer class="ex-footer">ENGR-250 · Study aids, not an official exam or answer key. Matching speed is not mastery.</footer></main></div>`;
    const shell=root.querySelector('#engrRoom'),el=root.querySelector('#engrContent');
    function prefs(){shell.classList.toggle('ex-focus',state.prefs.focus);shell.classList.toggle('engr-spaced',state.prefs.spacing);shell.dataset.size=state.prefs.size;save(who);}
    for(const [id,key] of [['engrFocus','focus'],['engrSpacing','spacing']]){root.querySelector('#'+id).checked=state.prefs[key];root.querySelector('#'+id).onchange=e=>{state.prefs[key]=e.target.checked;prefs();};}
    root.querySelector('#engrSize').value=state.prefs.size;root.querySelector('#engrSize').onchange=e=>{state.prefs.size=e.target.value;prefs();};prefs();
    if(mode==='concepts')cards(el,who,data);else if(mode==='practice')practice(el,who,data);else if(mode==='examples')examples(el,who,data);else if(mode==='sheet')guide(el,data);else if(mode==='games')games(el,who,data);else if(mode==='models')models(el,who,data);else overview(el,who,data);
  }
  function overview(el,who,data){el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">UNDERSTAND IT. THEN RETRIEVE IT.</p><h1>Engineering Materials.<br>One connection at a time.</h1><p>Start with concepts, try five mixed questions, then retry your misses. Use the models to connect the math to the structure.</p>${link(who,'concepts','Start concept cards')}${link(who,'practice','Try five questions')}</header><section class="ex-card"><h2>Tonight’s study loop</h2><ol>${data.studyPlan.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section><section class="ex-card"><h2>Your exam map</h2><div class="engr-topic-grid">${data.topics.map(t=>`<article><p class="ex-eyebrow">${esc(t.chapter)}</p><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p></article>`).join('')}</div></section>`;}
  function cards(el,who,data){
    const state=load(who);
    if(!state.cards?.ids?.every(id=>data.cards.some(c=>c.id===id)))state.cards=null;
    state.cards ||= {topic:'all',ids:data.cards.map(c=>c.id),index:0,missed:[],revealed:false};
    function start(topic,ids){state.cards={topic,ids:ids||pool(data.cards,topic,state.cardHistory).map(c=>c.id),index:0,missed:[],revealed:false};save(who);paint();focusHeading(el);}
    function paint(){
      const r=state.cards,c=data.cards.find(c=>c.id===r.ids[r.index]);
      el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">SAY IT BEFORE YOU SEE IT.</p><h1>Concepts</h1></header><label class="engr-filter">Card topic<select id="engrCardTopic">${options(data,true)}</select></label>${button('engrShuffle','Shuffle cards')}${button('engrMissedCards','Retry missed cards')}<p class="ex-muted">Shuffle restarts this pool without clearing your recall history.</p><div id="engrCardBody"></div>`;
      el.querySelector('#engrCardTopic').value=r.topic;el.querySelector('#engrCardTopic').onchange=e=>start(e.target.value);
      el.querySelector('#engrShuffle').onclick=()=>start(r.topic,shuffled(pool(data.cards,r.topic,state.cardHistory)).map(c=>c.id));
      el.querySelector('#engrMissedCards').onclick=()=>start('missed');
      const body=el.querySelector('#engrCardBody');
      if(!c){body.innerHTML=`<section class="ex-card"><h2>${r.ids.length?'Recall round complete':'No cards to retry yet'}</h2><p>${r.ids.length-r.missed.length} / ${r.ids.length} marked Got it. Honest self-rating guides practice; it is not an exam score.</p>${r.missed.length?button('engrCardRetry',`Retry cards (${r.missed.length})`,true):''}${button('engrCardRestart','Restart selected topic')}</section>`;body.querySelector('#engrCardRetry')?.addEventListener('click',()=>start(r.topic,[...r.missed]));body.querySelector('#engrCardRestart').onclick=()=>start(r.topic);return;}
      body.innerHTML=`<article class="ex-card" data-card-id="${esc(c.id)}"><p class="ex-eyebrow">Card ${r.index+1} of ${r.ids.length}</p><h2 id="engrCardQuestion">${esc(c.front)}</h2><p>Answer aloud or on paper, then check.</p>${r.revealed?`<section id="engrBack"><p class="engr-answer">${esc(c.back)}</p><p><strong>Watch for:</strong> ${esc(c.trap)}</p>${citation(c)}</section>${button('engrAgain','Again')}${button('engrGot','Got it',true)}`:button('engrFlip','Reveal answer',true)}</article>`;
      body.querySelector('#engrFlip')?.addEventListener('click',()=>{r.revealed=true;save(who);paint();el.querySelector('#engrAgain').focus();});
      function rate(correct){state.cardHistory[c.id]=correct;if(!correct)r.missed.push(c.id);r.index++;r.revealed=false;save(who);paint();focusHeading(el);}
      body.querySelector('#engrAgain')?.addEventListener('click',()=>rate(false));body.querySelector('#engrGot')?.addEventListener('click',()=>rate(true));
    }paint();
  }
  function practice(el,who,data){
    const state=load(who),byId=id=>data.questions.find(q=>q.id===id);
    function ordered(items){
      const groups=data.topics.map(t=>t.id),offset=state.nextTopic%groups.length,order=[...groups.slice(offset),...groups.slice(0,offset)],result=[];
      for(const mastered of [false,true]){const queues=order.map(topic=>items.filter(q=>q.topic===topic&&(state.history[q.id]===true)===mastered));while(queues.some(q=>q.length))for(const queue of queues)if(queue.length)result.push(queue.shift());}
      return result;
    }
    function start(ids){state.round={ids,index:0,results:{},drafts:{},steps:{}};save(who);paint();focusHeading(el);}
    function setup(){el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">SHORT ROUNDS. USEFUL FEEDBACK.</p><h1>Practice</h1><p>Attempt first. Then review the reason, reveal the steps, and retry what you missed. These are labeled study questions, not a predicted exam.</p></header><section class="ex-card"><h2>Choose your round</h2><div class="ex-fields"><label>Practice topic<select id="engrPracticeTopic">${options(data,true)}</select></label><label>Round length<select id="engrLength"><option value="5">5 quick questions</option><option value="10">10 questions</option><option value="all">All in this topic</option></select></label></div>${button('engrStart','Start round',true)}<p id="engrEmpty" role="status"></p></section>`;
      el.querySelector('#engrStart').onclick=()=>{const topic=el.querySelector('#engrPracticeTopic').value,items=ordered(pool(data.questions,topic,state.history)),length=el.querySelector('#engrLength').value;if(!items.length){el.querySelector('#engrEmpty').textContent='No missed questions yet. Try a topic first.';return;}const chosen=items.slice(0,length==='all'?items.length:Number(length));if(topic==='all')state.nextTopic=(state.nextTopic+1)%data.topics.length;start(chosen.map(q=>q.id));};}
    function paint(){
      const r=state.round;if(!r?.ids?.length||r.ids.some(id=>!byId(id))){setup();return;}
      if(r.index>=r.ids.length){const missed=r.ids.filter(id=>!r.results[id]?.correct);el.innerHTML=`<section class="ex-card"><h1>Round complete</h1><p class="ex-score">${r.ids.length-missed.length} / ${r.ids.length}</p><p>Correct on this attempt. Rebuild the reasoning behind your misses.</p>${missed.length?button('engrRetry',`Retry missed (${missed.length})`,true):''}${button('engrNew','New round')}</section>`;el.querySelector('#engrRetry')?.addEventListener('click',()=>start(missed));el.querySelector('#engrNew').onclick=()=>{state.round=null;save(who);setup();focusHeading(el);};return;}
      const q=byId(r.ids[r.index]),result=r.results[q.id],step=r.steps[q.id]||0;
      el.innerHTML=`<div class="ex-roundtop"><p class="ex-eyebrow" id="engrRep">Question ${r.index+1} of ${r.ids.length}</p>${button('engrChange','Choose another round')}</div><progress aria-label="Round progress" value="${r.index}" max="${r.ids.length}"></progress><article class="ex-card"><p class="ex-muted">${q.kind==='tutor-adapted'?'Tutor-adapted study question':'Original study question'} · ${esc(data.topics.find(t=>t.id===q.topic)?.title)}</p><h1 id="engrQuestion" data-id="${esc(q.id)}">${esc(q.prompt)}</h1><form id="engrAnswer"><fieldset class="engr-choices"><legend>Choose the best answer</legend>${q.choices.map((choice,i)=>`<label><input name="engrChoice" type="radio" value="${i}" ${r.drafts[q.id]===i?'checked':''} ${result?'disabled':''}><span>${esc(choice)}</span></label>`).join('')}</fieldset><p id="engrValidation" role="status"></p><button class="ex-button primary" id="engrCheck" ${result?'disabled':''}>Check answer</button></form><section id="engrFeedback" aria-live="polite">${result?`<div class="ex-result ${result.correct?'correct':'retry'}"><h2 tabindex="-1">${result.correct?'Correct':'Not quite · try again after the round'}</h2><p class="engr-answer">${esc(q.choices[q.answerIndex])}</p><p>${esc(q.explanation)}</p><ol>${q.steps.slice(0,step).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${step<q.steps.length?button('engrStep','Show next explanation step'):''}${citation(q)}${button('engrNext',r.index===r.ids.length-1?'Finish round':'Next question',true)}</div>`:''}</section></article>`;
      el.querySelector('#engrAnswer').onchange=e=>{r.drafts[q.id]=Number(e.target.value);save(who);};
      el.querySelector('#engrAnswer').onsubmit=e=>{e.preventDefault();if(result)return;if(!Number.isInteger(r.drafts[q.id])){el.querySelector('#engrValidation').textContent='Choose an answer before checking.';return;}const correct=r.drafts[q.id]===q.answerIndex;r.results[q.id]={correct};state.history[q.id]=correct;save(who);paint();el.querySelector('#engrFeedback h2').focus();};
      el.querySelector('#engrStep')?.addEventListener('click',()=>{r.steps[q.id]=step+1;save(who);paint();el.querySelector('#engrStep, #engrNext').focus();});
      el.querySelector('#engrNext')?.addEventListener('click',()=>{r.index++;save(who);paint();focusHeading(el);});
      el.querySelector('#engrChange').onclick=()=>{state.round=null;save(who);setup();focusHeading(el);};
    }paint();
  }
  function examples(el,who,data){
    const state=load(who);let chosen=state.exampleId||data.examples[0]?.id;
    function paint(){const ex=data.examples.find(e=>e.id===chosen)||data.examples[0];if(!ex){el.innerHTML='<h1>No worked examples available yet</h1>';return;}chosen=ex.id;const n=state.examples[ex.id]||0;
      el.innerHTML=`<header class="ex-hero"><h1>Worked examples</h1><p>Try each next step yourself before revealing it.</p></header><label class="engr-filter">Choose an example<select id="engrExample">${data.examples.map(e=>`<option value="${esc(e.id)}">${esc(e.title)}</option>`).join('')}</select></label><article class="ex-card"><p class="ex-muted">${ex.kind==='tutor-adapted'?'Tutor-adapted worked example':'Original worked example'}</p><h2>${esc(ex.title)}</h2><h3>Given</h3><p>${esc(ex.given)}</p><h3>Find</h3><p>${esc(ex.find)}</p><ol id="engrWorkedSteps">${ex.steps.slice(0,n).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${n<ex.steps.length?button('engrExampleStep','Reveal next step',true):`<p class="engr-answer">Answer: ${esc(ex.answer)}</p>`}${button('engrExampleReset','Try this example again')}${citation(ex)}</article>`;
      el.querySelector('#engrExample').value=chosen;el.querySelector('#engrExample').onchange=e=>{chosen=e.target.value;state.exampleId=chosen;save(who);paint();};el.querySelector('#engrExampleStep')?.addEventListener('click',()=>{state.examples[chosen]=n+1;save(who);paint();el.querySelector('#engrExampleStep, #engrExampleReset').focus();});el.querySelector('#engrExampleReset').onclick=()=>{state.examples[chosen]=0;save(who);paint();};
    }paint();
  }
  function guide(el,data){el.innerHTML=`<header class="ex-hero"><h1>Formula guide</h1><p>Choose the relationship, check its assumptions, then carry the units.</p>${button('engrPrint','Print formula guide')}</header><div class="engr-guide">${data.formulas.map(f=>`<article class="ex-card"><h2>${esc(f.name)}</h2><p class="engr-formula">${esc(f.ascii)}</p><p><strong>When:</strong> ${esc(f.when)}</p><p><strong>Units:</strong> ${esc(f.units)}</p><p><strong>Watch for:</strong> ${esc(f.pitfall)}</p>${citation(f)}</article>`).join('')}<section class="ex-card"><h2>Scope and attribution</h2><p>${esc(data.scope)}</p><p>${esc(data.textbook.title)} · ${esc(data.textbook.edition)}. ${esc(data.textbook.note)}</p><ul>${data.warnings.map(w=>`<li>${esc(w)}</li>`).join('')}</ul></section></div>`;el.querySelector('#engrPrint').onclick=()=>window.print();}
  function games(el,who,data){
    const state=load(who);let topic='all',selected=null,matched=0,penalty=0,started=0;
    const eligible=t=>pool(data.cards,t).filter(c=>c.term&&c.definition);
    el.innerHTML=`<header class="ex-hero"><h1>Games · Match six pairs</h1><p>Match a term to its meaning. Select with touch, click, Enter or Space; dragging also works. The stopwatch starts on your first selection. Wrong pairs add 1 second.</p></header><label class="engr-filter">Match topic<select id="engrMatchTopic"><option value="all">All exam topics</option>${data.topics.map(t=>`<option value="${esc(t.id)}" ${eligible(t.id).length<6?'disabled':''}>${esc(t.title)}${eligible(t.id).length<6?' · needs 6 pairs':''}</option>`).join('')}</select></label>${button('engrMatchStart','Start / replay six pairs',true)}<div class="engr-match-bar"><output id="engrClock" aria-label="Elapsed time">0.0s</output><span id="engrBest"></span></div><p id="engrMatchStatus" role="status">Choose a topic and start a round.</p><div id="engrMatchGrid" class="engr-match-grid"></div>`;
    const grid=el.querySelector('#engrMatchGrid'),status=el.querySelector('#engrMatchStatus'),clock=el.querySelector('#engrClock');
    const best=()=>{el.querySelector('#engrBest').textContent=state.best[topic]?`Personal best: ${state.best[topic].toFixed(1)}s`:'No personal best yet';};
    const elapsed=()=>started?(performance.now()-started)/1000+penalty:0;
    el.querySelector('#engrMatchTopic').onchange=e=>{topic=e.target.value;clearInterval(timer);timer=null;grid.innerHTML='';clock.textContent='0.0s';status.textContent='Topic selected. Start a new round.';best();};
    el.querySelector('#engrMatchStart').onclick=()=>{
      clearInterval(timer);timer=null;selected=null;matched=0;penalty=0;started=0;clock.textContent='0.0s';grid.innerHTML='';
      const chosen=shuffled(eligible(topic)).slice(0,6);if(chosen.length<6){status.textContent='Not enough pairs in this topic. Choose All exam topics.';return;}
      grid.innerHTML=shuffled(chosen.flatMap(c=>[{id:c.id,side:'term',text:c.term},{id:c.id,side:'definition',text:c.definition}])).map(t=>`<button class="engr-tile" draggable="true" data-pair="${esc(t.id)}" data-side="${t.side}" aria-pressed="false">${esc(t.text)}</button>`).join('');status.textContent='Find six matching pairs.';
      function pick(tile){if(tile.disabled)return;if(!started){started=performance.now();timer=setInterval(()=>{clock.textContent=`${elapsed().toFixed(1)}s`;},100);}
        if(selected===tile){tile.setAttribute('aria-pressed','false');selected=null;return;}
        if(!selected){selected=tile;tile.setAttribute('aria-pressed','true');return;}
        const previous=selected;selected=null;previous.setAttribute('aria-pressed','false');
        if(previous.dataset.pair===tile.dataset.pair&&previous.dataset.side!==tile.dataset.side){previous.disabled=true;tile.disabled=true;matched++;status.textContent=`${matched} of 6 pairs matched.`;grid.querySelector('button:not(:disabled)')?.focus({preventScroll:true});}
        else{penalty++;status.textContent='Not a match · +1 second. Try again.';}
        clock.textContent=`${elapsed().toFixed(1)}s`;
        if(matched===6){clearInterval(timer);timer=null;const time=elapsed();if(!state.best[topic]||time<state.best[topic])state.best[topic]=time;save(who);best();status.textContent=`Six pairs matched in ${time.toFixed(1)} seconds, including ${penalty} penalty seconds. Replay for fresh pairs.`;el.querySelector('#engrMatchStart').focus({preventScroll:true});}
      }
      grid.querySelectorAll('button').forEach(tile=>{tile.onclick=()=>pick(tile);tile.ondragstart=e=>{if(selected){selected.setAttribute('aria-pressed','false');selected=null;}pick(tile);e.dataTransfer.setData('text/plain',tile.dataset.pair);};tile.ondragover=e=>e.preventDefault();tile.ondrop=e=>{e.preventDefault();pick(tile);};});
    };best();
  }
  /* radius: nm; atomic mass: g/mol; output lattice edge: nm, density: g/cm^3. */
  function unitCell(type,radius,mass){
    const specs={SC:{n:1,factor:2,coordination:6,relation:'a = 2r'},BCC:{n:2,factor:4/Math.sqrt(3),coordination:8,relation:'a = 4r / √3'},FCC:{n:4,factor:2*Math.sqrt(2),coordination:12,relation:'a = 2√2 r'}};
    const s=specs[type];if(!s||!Number.isFinite(radius)||!Number.isFinite(mass)||radius<=0||mass<=0)return null;
    const a=s.factor*radius,density=s.n*mass/(6.02214076e23*(a*1e-7)**3),apf=s.n*(4/3)*Math.PI*radius**3/a**3;
    if(!Number.isFinite(density)||!Number.isFinite(apf))return null;return {...s,a,density,apf};
  }
  function vacancyFraction(energy,temperature){if(!Number.isFinite(energy)||!Number.isFinite(temperature)||energy<=0||temperature<=0)return null;return Math.exp(-energy/(8.617333262e-5*temperature));}
  function crystalSVG(type){
    const corners=[];for(let x=0;x<=1;x++)for(let y=0;y<=1;y++)for(let z=0;z<=1;z++)corners.push([x,y,z]);
    const project=([x,y,z])=>[90+150*x+65*y,245-65*y-150*z];
    let lines='';for(const p of corners)for(let axis=0;axis<3;axis++)if(p[axis]===0){const q=[...p];q[axis]=1;const a=project(p),b=project(q);lines+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;}
    const centers=type==='BCC'?[[.5,.5,.5]]:type==='FCC'?[[0,.5,.5],[1,.5,.5],[.5,0,.5],[.5,1,.5],[.5,.5,0],[.5,.5,1]]:[];
    const atoms=[...corners.map(p=>({p,kind:'corner'})),...centers.map(p=>({p,kind:type==='BCC'?'body':'face'}))].sort((a,b)=>b.p[1]-a.p[1]);
    return `<svg viewBox="0 0 400 320" role="img" aria-label="${type} cubic unit cell: eight corners${type==='BCC'?', one body center':type==='FCC'?', six face centers':''}"><title>${type} fractional lattice positions</title><g class="engr-edges">${lines}</g>${atoms.map(({p,kind})=>{const [x,y]=project(p);return `<circle data-site="${kind}" cx="${x}" cy="${y}" r="${kind==='corner'?12:16}" class="engr-atom ${kind}"><title>${kind} site (${p.join(', ')})</title></circle>`;}).join('')}<text x="160" y="276">x · a</text><text x="285" y="235">y</text><text x="64" y="84">z</text><text x="16" y="306">Fractional coordinates · schematic, not atom-size scale</text></svg>`;
  }
  function models(el,who,data){
    const state=load(who),m=state.model;
    el.innerHTML=`<header class="ex-hero"><h1>Interactive models</h1><p>Change one input. Predict what changes, then compare the model.</p></header><section class="ex-card"><h2>Cubic unit-cell lab</h2><p>Ideal monatomic hard-sphere SC, BCC and FCC crystals; fully occupied sites. Displayed spheres mark exact fractional lattice positions, not true sphere size.</p><div class="ex-fields"><label>Crystal structure<select id="engrCrystal"><option>SC</option><option>BCC</option><option>FCC</option></select></label><label>Atomic radius (nm)<input id="engrRadius" type="number" min="0.001" step="0.001"></label><label>Atomic mass (g/mol)<input id="engrMass" type="number" min="0.001" step="0.001"></label></div><div id="engrCrystalDrawing"></div><output id="engrDensity" aria-live="polite"></output><p>ρ = nA / (Nₐa³); Nₐ = 6.02214076 × 10²³ mol⁻¹; 1 nm = 10⁻⁷ cm. Defaults are illustrative copper-like inputs, not a claim that copper takes all three structures. Changing structure holds radius and mass fixed.</p><p class="ex-source">Model basis: ${esc(data.formulas.filter(f=>/density|packing|lattice|radius|unit cell/i.test(f.name+' '+f.ascii)).map(f=>f.source).filter((v,i,a)=>a.indexOf(v)===i).join(' · ')||'Ideal cubic-cell geometry; compare with the supplied crystal-structure notes.')}</p></section><section class="ex-card"><h2>Vacancy–temperature lab</h2><p>Equilibrium vacancy fraction, not a diffusion-rate model. Fixed formation energy; constant site count; dilute, independent vacancies; vibrational entropy prefactor assumed 1. Temperature is in kelvin, not °C. Below-melting validity depends on the chosen material.</p><div class="ex-fields"><label>Temperature (K)<input id="engrTemperature" type="number" min="1" step="10"></label><label>Formation energy (eV/atom)<input id="engrEnergy" type="number" min="0.001" step="0.01"></label></div><output id="engrVacancy" aria-live="polite"></output><div id="engrVacancyPlot"></div><p>Nᵥ/N = exp[−Qᵥ/(kᵦT)]; kᵦ = 8.617333262 × 10⁻⁵ eV/K. Log-scale curve shows 300–1800 K; the entered value is calculated even outside the plotted range.</p><p class="ex-source">Model basis: ${esc(data.formulas.filter(f=>/vacan/i.test(f.name+' '+f.ascii)).map(f=>f.source).join(' · ')||'Equilibrium point-defect model; compare with your supplied defects notes.')}</p></section>`;
    function update(){save(who);const cell=unitCell(m.type,Number(m.radius),Number(m.mass));el.querySelector('#engrCrystalDrawing').innerHTML=crystalSVG(m.type);
      el.querySelector('#engrDensity').innerHTML=cell?`<strong>${cell.n} atoms / cell · coordination ${cell.coordination}</strong><p>${cell.relation} → a = <b data-value="a">${cell.a.toFixed(6)}</b> nm</p><p>ρ = <b data-value="density">${cell.density.toFixed(4)}</b> g/cm³ · APF = ${cell.apf.toFixed(4)}</p><p>Atom sharing: 8 corners × ⅛${m.type==='BCC'?' + 1 body × 1':m.type==='FCC'?' + 6 faces × ½':''} = ${cell.n}. Coordination counts neighbors in the whole crystal, not just this drawing.</p>`:'Enter finite positive radius and atomic mass.';
      const energy=Number(m.energy),temperature=Number(m.temperature),fraction=vacancyFraction(energy,temperature);
      el.querySelector('#engrVacancy').textContent=fraction===null?'Enter positive temperature and formation energy.':`Nᵥ/N = ${fraction.toExponential(5)} · ${(fraction*100).toExponential(3)}% of lattice sites`;
      if(fraction===null){el.querySelector('#engrVacancyPlot').innerHTML='';return;}
      const logFraction=t=>-energy/(8.617333262e-5*t)/Math.LN10;
      const low=Math.min(-1,logFraction(300)),high=0,y=t=>220-(logFraction(t)-low)/(high-low)*190;
      const points=Array.from({length:61},(_,i)=>{const t=300+i*25;return `${55+(t-300)/1500*295},${y(t)}`;}).join(' ');
      const cx=55+(temperature-300)/1500*295;
      el.querySelector('#engrVacancyPlot').innerHTML=`<svg viewBox="0 0 400 270" role="img" aria-label="Log vacancy fraction increases as temperature rises"><title>Equilibrium vacancy fraction versus temperature</title><path class="engr-edges" d="M55 25V225H355"/><polyline class="engr-curve" points="${points}"/>${temperature>=300&&temperature<=1800?`<circle class="engr-atom body" cx="${cx}" cy="${y(temperature)}" r="6"/>`:''}<text x="4" y="22">log₁₀(Nᵥ/N)</text><text x="18" y="44">0</text><text x="2" y="225">${low.toFixed(1)}</text><text x="48" y="246">300</text><text x="313" y="246">1800 K</text></svg>`;
    }
    for(const [id,key] of [['engrCrystal','type'],['engrRadius','radius'],['engrMass','mass'],['engrTemperature','temperature'],['engrEnergy','energy']]){const input=el.querySelector('#'+id);input.value=m[key];input.addEventListener('input',()=>{m[key]=input.value;update();});}update();
  }
  return {render,cleanup,unitCell,vacancyFraction};
})();
