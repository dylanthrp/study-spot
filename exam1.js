/* Source-grounded ACC 298 review. Separate from Cooper's existing ACC 289 deck. */
const Exam1 = (() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const url = (who, mode='overview') => `#/u/${who}/ACC-298/${mode}`;
  const link = (who, mode, label, cls='ex-button') => `<a class="${cls}" href="${url(who,mode)}">${esc(label)}</a>`;
  function render(root, who, mode) {
    document.body.classList.add('exam-active');
    root.innerHTML = `<div id="examRoom" class="ex-shell"><aside class="ex-sidebar"><a href="#/u/${who}">← Your dashboard</a><p class="ex-eyebrow">THE EXAM 1 ROOM</p><h2>Accounting,<br>one rep at a time.</h2><p class="ex-muted">ACC 298 · professor review</p><nav aria-label="Exam study modes">${[['overview','Your cram plan'],['practice','Quick reps'],['cards','Recall cards'],['sheet','One-page guide']].map(([id,label])=>link(who,id,label,`ex-nav ${mode===id?'selected':''}`)).join('')}</nav><p class="ex-muted">Try → check → understand → retry.</p></aside><section class="ex-main"><div class="ex-top"><span>${esc(who==='wyatt'?'Wyatt’s Focus prototype':'Cooper’s study room')}</span><span>EXAM 01 / CH. 1–3</span></div><div id="exContent">${overview(who)}</div><footer class="ex-footer"><a href="assets/exam1-review.pdf" target="_blank" rel="noopener">Professor’s review PDF</a><a href="assets/exam1-solution.pdf" target="_blank" rel="noopener">Professor’s solution PDF</a><p>ACC 298 is printed on the supplied review. The older ACC 289 deck is unchanged. Shared materials; progress is browser-local, not a private account or cloud sync.</p></footer></section></div>`;
  }
  function overview(who) {
    return `<header class="ex-hero"><p class="ex-eyebrow">LESS REREADING. MORE RETRIEVAL.</p><h1>Exam 1. Make every rep count.</h1><p>Journal entries. Adjustments. Financial statements.<br>A short path through the professor’s Lars Cleaners review.</p>${link(who,'practice','Start quick reps →','ex-button primary')} ${link(who,'cards','Warm up with cards')}</header><section class="ex-card"><h2>Your last-night plan</h2><div class="ex-plan"><div><b>01 / 10 MIN</b><h3>Recall the moves</h3><p>Say the rule before turning the card. Don’t just recognize the answer.</p></div><div><b>02 / 25 MIN</b><h3>Work the entries</h3><p>Choose debit, credit, and amount. Check the reasoning, then retry misses.</p></div><div><b>03 / 15 MIN</b><h3>Build the statements</h3><p>Use the adjusted trial balance. Work income → retained earnings → balance sheet.</p></div></div><p class="ex-muted">Suggested study blocks, not a countdown or a promise. Take a short break between rounds.</p></section><section class="ex-card"><h2>The professor’s shortcut</h2><p>Complete the journal entries first. Then use the supplied adjusted trial balance instead of repeating every posting, and prepare the financial statements without notes.</p><p class="ex-muted">Review p. 1. This tool covers the supplied Chapters 2–3 comprehensive problem. The exam review says Chapters 1–3: also revisit Chapter 1 notes, quizzes, and the recommended Adaptive Practice.</p></section>${who==='wyatt'?'<section class="ex-card"><h2>A quieter way to practice</h2><p>Focus view is an optional prototype: shorter chunks, more space, and one step at a time. Same accounting, no reduced expectations. Try it and keep only what helps.</p></section>':''}`;
  }
  const memory = {};
  let dataPromise, conceptsPromise;
  function load(who) {
    if (memory[who]) return memory[who];
    let saved;
    try { saved = JSON.parse(localStorage.getItem(`exam1_v1_${who}`)); } catch (_) { /* Use defaults. */ }
    const fresh = { round:null, history:{}, drafts:{}, cards:{index:0,missed:[]}, prefs:{focus:who==='wyatt',size:'normal',spacing:true}, feedback:'' };
    memory[who] = saved && typeof saved==='object' ? {...fresh,...saved,prefs:{...fresh.prefs,...saved.prefs}} : fresh;
    return memory[who];
  }
  function save(who) {
    try { localStorage.setItem(`exam1_v1_${who}`,JSON.stringify(load(who))); }
    catch (_) { const note=document.querySelector('#exStorage'); if(note) note.textContent='Storage is unavailable. Progress lasts for this visit only.'; }
  }
  function source(p) {
    const isKey=p.source_file==='Review for Exam One Solution.pdf';
    return `<p class="ex-source">Source: <a href="assets/exam1-${isKey?'solution':'review'}.pdf#page=${p.page}" target="_blank" rel="noopener">${isKey?'solution':'review'} p. ${p.page}</a>${isKey?'':` · <a href="assets/exam1-solution.pdf#page=${p.solution_page}" target="_blank" rel="noopener">solution p. ${p.solution_page}</a>`}. Prompts and explanations are study aids, not extra professor questions. Source links can reveal answers.</p>`;
  }
  const money = n => Number(n).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  function numberValue(value) {
    const text=String(value).trim();
    if(!/^\$?\s*-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(text)) return NaN;
    return Number(text.replace(/[$,\s]/g,''));
  }
  function practice(el,who,data) {
    const state=load(who);
    const focus=()=>load(who).prefs.focus;
    const allAccounts=[...new Set(data.problems.flatMap(p=>[p.debit,p.credit]).filter(Boolean))].sort();
    const byId=id=>data.problems.find(p=>p.id===id);
    function start(ids) { state.round={ids,index:0,results:{}}; ids.forEach(id=>delete state.drafts[id]); save(who); paint(true); }
    function setup() {
      el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">RETRIEVE FIRST. REVEAL SECOND.</p><h1>Quick reps</h1><p>Five questions is enough to find your next weak spot.</p></header><section class="ex-card"><h2>Choose your round</h2><div class="ex-fields"><label>Practice topic<select id="exTopic"><option value="mixed">Mixed accounting cycle</option>${data.topics.map(t=>`<option value="${esc(t.id)}">${esc(t.title)}</option>`).join('')}<option value="missed">Previously missed</option></select></label><label>Round length<select id="exLength"><option value="5">5 quick reps</option><option value="10">10 reps</option><option value="all">All in this topic</option></select></label></div><button class="ex-button primary" id="exStart">Start round</button><p id="exEmpty" role="status"></p><p class="ex-muted">No race clock. Choose the accounts and amount, or calculate a statement total. Revealing without an attempt adds the question to retry.</p></section>`;
      el.querySelector('#exStart').onclick=()=>{
        const topic=el.querySelector('#exTopic').value;
        let pool=topic==='missed'?data.problems.filter(p=>state.history[p.id]===false):topic==='mixed'?data.topics.flatMap((_,i)=>data.problems.filter(p=>p.topic===data.topics[i].id).map((p,j)=>({p,order:j*data.topics.length+i}))).sort((a,b)=>a.order-b.order).map(x=>x.p):data.problems.filter(p=>p.topic===topic);
        // Rotate completed items behind unseen/missed ones on later rounds.
        if(topic!=='missed') pool=pool.filter(p=>state.history[p.id]!==true).concat(pool.filter(p=>state.history[p.id]===true));
        if(!pool.length) { el.querySelector('#exEmpty').textContent='No missed questions yet. Try a new round first.'; return; }
        const count=el.querySelector('#exLength').value;
        start(pool.slice(0,count==='all'?pool.length:Number(count)).map(p=>p.id));
      };
    }
    function paint(moveFocus=false) {
      const round=state.round;
      if(!round || !Array.isArray(round.ids) || !round.ids.length || round.ids.some(id=>!byId(id))) { state.round=null; setup(); return; }
      if(round.index>=round.ids.length) { summary(); return; }
      const p=byId(round.ids[round.index]);
      const result=round.results[p.id];
      const draft=state.drafts[p.id]||{};
      const options=selected=>`<option value="">Choose an account</option>${allAccounts.map(a=>`<option ${selected===a?'selected':''} value="${esc(a)}">${esc(a)}</option>`).join('')}`;
      el.innerHTML=`<div class="ex-roundtop"><p id="exRepCount" class="ex-eyebrow">Rep ${round.index+1} of ${round.ids.length}</p><button class="ex-button" id="exChange">Choose another round</button></div><progress aria-label="Round progress" value="${round.index}" max="${round.ids.length}"></progress><article class="ex-card ex-problem"><p class="ex-eyebrow">${esc(data.topics.find(t=>t.id===p.topic)?.title)}</p><h1 id="exQuestion" tabindex="-1">${esc(p.title)}</h1><div id="exReadTarget"><p class="ex-prompt">${esc(p.prompt)}</p><div class="ex-given"><h2>Given</h2><ul>${p.given.map(g=>`<li>${esc(g)}</li>`).join('')}</ul><h2>Find</h2><p>${esc(p.find)}</p></div></div><details class="ex-original"><summary>Read the original problem wording</summary><p>${esc(p.statement)}</p></details>${p.topic==='statements'?`<details class="ex-atb"><summary>Open adjusted trial balance · allowed reference for this rep</summary>${balanceTable(data)}</details>`:''}<div class="ex-read-controls"><button class="ex-button" id="exSpeak">Read question aloud</button><button class="ex-button" id="exStop">Stop reading</button><span id="exSpeechStatus" role="status" class="ex-muted"></span></div><form id="exAnswerForm"><div class="ex-fields">${p.debit?`<label>Debit account<select id="exDebit" ${result?'disabled':''}>${options(draft.debit)}</select></label><label>Credit account<select id="exCredit" ${result?'disabled':''}>${options(draft.credit)}</select></label>`:''}<label>${p.debit?'Amount ($)':'Your answer ($)'}<input id="exAmount" inputmode="decimal" autocomplete="off" value="${esc(draft.amount||'')}" ${result?'disabled':''} placeholder="Enter an amount"></label></div><p id="exValidation" role="status"></p><button class="ex-button primary" type="submit" ${result?'disabled':''}>Check answer</button><button class="ex-button" type="button" id="exReveal" ${result?'disabled':''}>Show solution · mark for retry</button></form><section id="exFeedback" aria-live="polite">${result?feedback(p,result):''}</section>${source(p)}</article>`;
      el.querySelector('#exDebit')?.setAttribute('aria-label','Debit account');
      el.querySelector('#exCredit')?.setAttribute('aria-label','Credit account');
      el.querySelector('#exAmount').setAttribute('aria-label',p.debit?'Amount ($)':'Your answer ($)');
      if(!p.debit) {
        const excerpt=el.querySelector('.ex-original');
        if(!result) excerpt.remove();
        else excerpt.querySelector('summary').textContent='Read the source solution excerpt';
      }
      if(p.id==='unadjustedtotal') el.querySelector('.ex-atb')?.remove();
      const fields=()=>({debit:el.querySelector('#exDebit')?.value||'',credit:el.querySelector('#exCredit')?.value||'',amount:el.querySelector('#exAmount').value});
      el.querySelector('#exAnswerForm').oninput=()=>{state.drafts[p.id]=fields();save(who);};
      el.querySelector('#exAnswerForm').onchange=()=>{state.drafts[p.id]=fields();save(who);};
      function record(correct,revealed) {
        if(round.results[p.id]) return;
        state.drafts[p.id]=fields(); round.results[p.id]={correct,revealed}; state.history[p.id]=correct; save(who); stopReading(); paint(); el.querySelector('#exFeedback h2').focus();
      }
      el.querySelector('#exAnswerForm').onsubmit=e=>{e.preventDefault();if(result)return;const v=fields();const n=numberValue(v.amount);if(!Number.isFinite(n)||(p.debit&&(!v.debit||!v.credit))) {el.querySelector('#exValidation').textContent='Enter a valid amount and select both accounts. Your rep has not been graded.';return;}record(n===(p.debit?p.amount:p.number)&&(!p.debit||(v.debit===p.debit&&v.credit===p.credit)),false);};
      el.querySelector('#exReveal').onclick=()=>record(false,true);
      el.querySelector('#exChange').onclick=()=>{state.round=null;save(who);stopReading();setup();};
      wireSpeech(el,()=>p.title+'. '+el.querySelector('#exReadTarget').innerText);
      if(result) {
        let shown=focus()?0:p.steps.length;
        const stepBox=el.querySelector('#exSteps');
        const stepButton=el.querySelector('#exNextStep');
        function steps() {stepBox.innerHTML=p.steps.slice(0,shown).map((s,i)=>`<li><b>Step ${i+1}.</b> ${esc(s)}</li>`).join('');stepButton.disabled=shown>=p.steps.length;}
        steps();stepButton.onclick=()=>{shown++;steps();};
        el.querySelector('#exNext').onclick=()=>{round.index++;save(who);stopReading();paint(true);};
      }
      if(moveFocus) el.querySelector('#exQuestion').focus();
    }
    function feedback(p,r) {return `<div class="ex-result ${r.correct?'correct':'retry'}"><h2 tabindex="-1">${r.correct?'Correct':r.revealed?'Solution revealed · retry this one':'Not quite · let’s fix the move'}</h2><p class="ex-answer">${esc(p.answer)}</p><h3>Why it works</h3><ol id="exSteps" class="ex-steps"></ol><button id="exNextStep" class="ex-button" type="button">Show next explanation step</button><p><strong>Watch for:</strong> ${esc(p.pitfall)}</p><button id="exNext" type="button" class="ex-button primary">${state.round.index===state.round.ids.length-1?'Finish round':'Next rep'}</button></div>`;}
    function summary() {
      const r=state.round;const missed=r.ids.filter(id=>!r.results[id]?.correct);const correct=r.ids.length-missed.length;
      el.innerHTML=`<section class="ex-card ex-summary"><p class="ex-eyebrow">SMALL ROUND. USEFUL FEEDBACK.</p><h1 tabindex="-1">Round complete</h1><p class="ex-score">${correct} / ${r.ids.length}</p><p>correct without revealing. ${missed.length?'Your next best move: retry the misses.':'Nice work. Try a different topic without notes.'}</p>${missed.length?`<button id="exRetry" class="ex-button primary">Retry missed (${missed.length})</button>`:''}<button id="exNew" class="ex-button">New round</button><ul>${r.ids.map(id=>`<li>${r.results[id]?.correct?'✓ Correct':'↻ Retry'} · ${esc(byId(id).title)}</li>`).join('')}</ul></section>`;
      if(missed.length)el.querySelector('#exRetry').onclick=()=>start(missed);
      el.querySelector('#exNew').onclick=()=>{state.round=null;save(who);setup();};
      el.querySelector('h1').focus();
    }
    paint();
  }
  function balanceTable(data) {
    return `<div class="ex-tablewrap"><table><caption>Lars Cleaners · Adjusted trial balance · March 31, 2024 (solution p. 6)</caption><thead><tr><th scope="col">Account</th><th scope="col">Debit</th><th scope="col">Credit</th></tr></thead><tbody>${data.balances.map(b=>`<tr><th scope="row">${esc(b.account)}</th><td>${b.debit?money(b.debit):'—'}</td><td>${b.credit?money(b.credit):'—'}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function stopReading() { if('speechSynthesis' in window) window.speechSynthesis.cancel(); }
  function wireSpeech(el,text) {
    const read=el.querySelector('#exSpeak'),stop=el.querySelector('#exStop'),status=el.querySelector('#exSpeechStatus');
    if(!('speechSynthesis' in window)) {read.disabled=true;stop.disabled=true;status.textContent='Read-aloud is not available in this browser.';return;}
    read.onclick=()=>{stopReading();const utterance=new SpeechSynthesisUtterance(text());utterance.rate=.85;utterance.lang='en-US';utterance.onend=()=>{status.textContent='Finished reading.';};utterance.onerror=()=>{status.textContent='Voice unavailable. Try your device’s read-aloud tools.';};status.textContent='Reading…';window.speechSynthesis.speak(utterance);};
    stop.onclick=()=>{stopReading();status.textContent='Reading stopped.';};
  }
  window.addEventListener('hashchange',stopReading);
  function cards(el,who,data) {
    const state=load(who);
    if(!Array.isArray(state.cards.ids))state.cards={ids:data.flashcards.map(c=>c.id),index:0,missed:[]};
    const cstate=state.cards;
    function paint() {
      if(cstate.index>=cstate.ids.length) {
        el.innerHTML=`<section class="ex-card"><h1>Recall round complete</h1><p>${cstate.ids.length-cstate.missed.length} / ${cstate.ids.length} cards marked “Got it.” Self-rating is a cue for practice, not an exam score.</p>${cstate.missed.length?`<button id="exCardRetry" class="ex-button primary">Retry cards (${cstate.missed.length})</button>`:''}<button id="exCardRestart" class="ex-button">Restart all cards</button>${link(who,'practice','Put it into practice →')}</section>`;
        if(cstate.missed.length)el.querySelector('#exCardRetry').onclick=()=>{cstate.ids=[...cstate.missed];cstate.missed=[];cstate.index=0;save(who);paint();};
        el.querySelector('#exCardRestart').onclick=()=>{cstate.ids=data.flashcards.map(c=>c.id);cstate.missed=[];cstate.index=0;save(who);paint();};return;
      }
      const c=data.flashcards.find(x=>x.id===cstate.ids[cstate.index]);
      let revealed=false;
      el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">SAY IT BEFORE YOU SEE IT.</p><h1>Recall cards</h1></header><section class="ex-card ex-flash"><p id="exCardCount" class="ex-eyebrow">Card ${cstate.index+1} of ${cstate.ids.length}</p><h2 tabindex="-1">${esc(c.front)}</h2><p class="ex-muted">Answer aloud or on paper. Then turn the card.</p><button id="exFlip" class="ex-button primary">Reveal answer</button><p id="exCardBack" hidden>${esc(c.back)}</p><div id="exCardRating" hidden><button id="exAgain" class="ex-button">Again</button><button id="exGot" class="ex-button primary">Got it</button></div><div class="ex-read-controls"><button class="ex-button" id="exSpeak">Read card aloud</button><button class="ex-button" id="exStop">Stop reading</button><span id="exSpeechStatus" role="status"></span></div><p class="ex-source">Derived study card · <a href="assets/exam1-solution.pdf#page=${c.page}" target="_blank" rel="noopener">solution p. ${c.page}</a></p></section>`;
      el.querySelector('#exFlip').onclick=()=>{revealed=true;el.querySelector('#exCardBack').hidden=false;el.querySelector('#exCardRating').hidden=false;el.querySelector('#exFlip').hidden=true;};
      const advance=miss=>{if(miss)cstate.missed.push(c.id);cstate.index++;save(who);stopReading();paint();};
      el.querySelector('#exAgain').onclick=()=>advance(true);el.querySelector('#exGot').onclick=()=>advance(false);
      wireSpeech(el,()=>c.front+(revealed?' '+c.back:''));
    }
    paint();
  }
  function concepts(el,who,data) {
    const state=load(who);
    if(!state.concepts)state.concepts={history:{},round:null};
    const study=state.concepts;
    const byId=id=>data.cards.find(c=>c.id===id);
    const header=()=>`<header class="ex-hero"><p class="ex-eyebrow">CHAPTERS 1–3 · CONCEPTS FIRST</p><h1>Know the why.</h1><p>Say your answer. Flip the card. Be honest about what needs another rep.</p></header>`;
    function start(ids) {
      study.round={ids:[...ids],index:0,missed:[]};save(who);paint();
    }
    function setup() {
      stopReading();
      const known=data.cards.filter(c=>study.history[c.id]===true).length;
      const missed=data.cards.filter(c=>study.history[c.id]===false).length;
      el.innerHTML=`${header()}<section class="ex-card"><h2>Your concept deck</h2><p>${data.cards.length} cards · ${known} marked “Got it” · ${missed} need another look</p><div class="ex-fields"><label for="exConceptTopic">Concept topic</label><select id="exConceptTopic"><option value="all">All Chapters 1–3 topics</option>${data.groups.map(g=>`<option value="${esc(g.id)}">${esc(g.title)}</option>`).join('')}</select><label for="exConceptPool">Practice pool</label><select id="exConceptPool"><option value="all">All cards · unseen and missed first</option><option value="missed">Only cards marked Again</option></select><label for="exConceptLength">Concept round length</label><select id="exConceptLength"><option value="10">10 quick cards</option><option value="all">All selected cards</option></select></div><button id="exConceptStart" class="ex-button primary">Start concept cards</button><p id="exConceptEmpty" role="status"></p><p class="ex-muted">No timer. “Got it” is your self-rating, not proof of exam readiness.</p></section><details class="ex-card"><summary>What this deck covers</summary><p>${esc(data.scope_note)}</p><p>Use your instructor’s notes to confirm exact chapter coverage. This set excludes Chapter 4 drills.</p></details>`;
      el.querySelector('.ex-fields').classList.add('ex-concept-fields');
      el.querySelector('#exConceptStart').onclick=()=>{
        const topic=el.querySelector('#exConceptTopic').value;
        const onlyMissed=el.querySelector('#exConceptPool').value==='missed';
        let pool=data.cards.filter(c=>(topic==='all'||c.group===topic)&&(!onlyMissed||study.history[c.id]===false));
        if(!pool.length){el.querySelector('#exConceptEmpty').textContent='No cards marked Again in this topic yet. Try all cards first.';return;}
        pool=pool.filter(c=>study.history[c.id]!==true).concat(pool.filter(c=>study.history[c.id]===true));
        const length=el.querySelector('#exConceptLength').value;
        start(pool.slice(0,length==='all'?pool.length:Number(length)).map(c=>c.id));
      };
    }
    function paint(moveFocus=false) {
      const round=study.round;
      if(!round||!round.ids.length||round.ids.some(id=>!byId(id))){setup();return;}
      if(round.index>=round.ids.length) {
        el.innerHTML=`${header()}<section class="ex-card"><h2>Concept round complete</h2><p>${round.ids.length-round.missed.length} / ${round.ids.length} marked “Got it.” Now explain the rules without looking.</p>${round.missed.length?`<button class="ex-button primary" id="exConceptRetry">Retry concept misses (${round.missed.length})</button>`:'<p>No misses marked in this round. Try another topic or shuffle for a fresh recall order.</p>'}<button class="ex-button" id="exConceptNew">Choose concept round</button></section>`;
        if(round.missed.length)el.querySelector('#exConceptRetry').onclick=()=>start(round.missed);
        el.querySelector('#exConceptNew').onclick=()=>{study.round=null;save(who);setup();};return;
      }
      const c=byId(round.ids[round.index]),source=data.sources.find(s=>s.id===c.source);
      let revealed=false;
      el.innerHTML=`<div class="ex-roundtop"><p class="ex-eyebrow" id="exConceptCount">Concept ${round.index+1} of ${round.ids.length}</p><button class="ex-button" id="exConceptChange">Choose concept round</button></div><progress aria-label="Concept round progress" value="${round.index}" max="${round.ids.length}"></progress><article class="ex-card ex-concept"><p class="ex-eyebrow">${esc(data.groups.find(g=>g.id===c.group)?.title)} · CH. 1–3</p><h1 id="exConceptQuestion" tabindex="-1">${esc(c.front)}</h1><p class="ex-muted">Answer in your own words before you flip.</p><button class="ex-button primary" id="exConceptFlip" aria-expanded="false" aria-controls="exConceptBack">Flip card</button><div id="exConceptBack" hidden><p class="ex-concept-answer">${esc(c.back)}</p><p class="ex-given"><strong>Don’t fall for this:</strong> ${esc(c.trap)}</p></div><div id="exConceptRating" hidden><button class="ex-button" id="exConceptAgain">Again</button><button class="ex-button primary" id="exConceptGot">Got it</button></div><div class="ex-read-controls"><button class="ex-button" id="exSpeak">Read concept aloud</button><button class="ex-button" id="exStop">Stop reading</button><span id="exSpeechStatus" role="status"></span></div><p class="ex-source">Original study prompt based on <a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)}</a> · not a professor exam question.</p></article><button class="ex-button" id="exConceptShuffle">Shuffle remaining cards</button>`;
      el.querySelector('#exConceptFlip').onclick=e=>{
        revealed=!revealed;stopReading();el.querySelector('#exConceptBack').hidden=!revealed;el.querySelector('#exConceptRating').hidden=!revealed;
        e.currentTarget.textContent=revealed?'Show question only':'Flip card';e.currentTarget.setAttribute('aria-expanded',String(revealed));
      };
      function rate(got) {
        if(!revealed)return;
        study.history[c.id]=got;if(!got)round.missed.push(c.id);
        round.index++;save(who);stopReading();paint(true);
      }
      el.querySelector('#exConceptAgain').onclick=()=>rate(false);
      el.querySelector('#exConceptGot').onclick=()=>rate(true);
      el.querySelector('#exConceptChange').onclick=()=>{study.round=null;save(who);setup();};
      el.querySelector('#exConceptShuffle').onclick=()=>{
        for(let i=round.ids.length-1;i>round.index;i--){const j=round.index+Math.floor(Math.random()*(i-round.index+1));[round.ids[i],round.ids[j]]=[round.ids[j],round.ids[i]];}
        save(who);stopReading();paint(true);
      };
      wireSpeech(el,()=>c.front+(revealed?' '+c.back+' Watch for: '+c.trap:''));
      if(moveFocus)el.querySelector('#exConceptQuestion').focus();
    }
    paint();
  }
  function sheet(el,data) {
    el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">READ ONCE. THEN TRY WITHOUT IT.</p><h1>One-page guide</h1><p>A compact map of the supplied comprehensive problem.</p><button id="exPrint" class="ex-button">Print guide</button></header>
      <div class="ex-guide"><section class="ex-card"><h2>1. Know which side increases</h2><p><b>Debit:</b> assets, expenses, dividends.<br><b>Credit:</b> liabilities, common stock, revenue.</p><p>Decreases go on the opposite side. Every entry: total debits = total credits.</p></section>
      ${data.topics.map(t=>`<section class="ex-card"><h2>${esc(t.title)}</h2><p><b>${esc(t.cue)}</b></p><p>${esc(t.rule)}</p><ol>${t.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p><b>Trap:</b> ${esc(t.pitfall)}</p></section>`).join('')}
      <section class="ex-card"><h2>Source-key correction</h2><p>The solution’s p. 3 T-account prints a $2,500 depreciation balance. The transaction and solution pp. 5–7 use <b>$250</b>. This room uses $250, which agrees with the adjusted trial balance and statements.</p></section></div>
      <details class="ex-card"><summary>Statement reference · adjusted trial balance</summary>${balanceTable(data)}</details>
      <details class="ex-card"><summary>Source scope &amp; reading-design research</summary><p>This is not a prediction of every exam question. Review p. 1 also directs students to textbook, Adaptive Practice, and prior quizzes for Chapters 1–3.</p><p>Reading controls follow the <a href="https://www2.worc.ac.uk/disabilityanddyslexia/documents/British%20Dyslexia%20Association%20Style%20Guide.pdf" target="_blank" rel="noopener">British Dyslexia Association style guide (university-hosted PDF)</a>: plain sans-serif text, left alignment, spacing, and user preferences. No special font or layout works for everyone.</p><p>The short attempt–feedback–retry loops apply <a href="https://www.learningscientists.org/retrieval-practice" target="_blank" rel="noopener">retrieval practice</a>. No timed pressure or claim that one night replaces spaced study.</p></details>`;
    el.querySelector('#exPrint').onclick=()=>window.print();
  }
  function preferences(root,who) {
    const state=load(who),prefs=state.prefs,room=root.querySelector('#examRoom'),content=root.querySelector('#exContent');
    const controls=document.createElement('div');controls.className='ex-preferences';
    controls.innerHTML=`<label class="ex-toggle"><input id="exFocus" type="checkbox" ${prefs.focus?'checked':''}> Focus view</label><label for="exSize">Text size</label><select id="exSize"><option value="normal">Standard</option><option value="large">Larger</option><option value="largest">Largest</option></select><label class="ex-toggle"><input id="exSpacing" type="checkbox" ${prefs.spacing?'checked':''}> Extra spacing</label><p id="exStorage">Progress saves in this browser, separately under each name.</p>`;
    content.before(controls);controls.querySelector('#exSize').value=prefs.size;
    function apply() {room.classList.toggle('ex-focus',prefs.focus);room.classList.toggle('ex-spaced',prefs.spacing);room.dataset.size=prefs.size;}
    controls.querySelector('#exFocus').onchange=e=>{prefs.focus=e.target.checked;apply();save(who);};
    controls.querySelector('#exSize').onchange=e=>{prefs.size=e.target.value;apply();save(who);};
    controls.querySelector('#exSpacing').onchange=e=>{prefs.spacing=e.target.checked;apply();save(who);};
    apply();
    if(who==='wyatt') {
      const box=document.createElement('details');box.className='ex-card ex-feedback-box';
      box.innerHTML=`<summary>Wyatt: is this easier to use?</summary><p>Optional prototype. Your preference matters more than a special font. Nothing here is a treatment or a claim that one style works for every reader.</p><label for="exFeedbackNote">What helps? What gets in your way?</label><textarea id="exFeedbackNote" rows="3" placeholder="Try the text size, spacing, and Focus controls first."></textarea><button id="exSaveFeedback" class="ex-button">Save feedback on this device</button><p id="exFeedbackSaved" role="status">This does not send anything. Show or copy your note to Dylan.</p>`;
      root.querySelector('.ex-footer').before(box);box.querySelector('textarea').value=state.feedback;
      box.querySelector('button').onclick=()=>{state.feedback=box.querySelector('textarea').value;save(who);box.querySelector('#exFeedbackSaved').textContent='Saved for this visit and, if browser storage is available, on this device. Nothing was sent.';};
    }
  }
  const renderShell=render;
  async function renderRoom(root,who,mode) {
    ExamGames.stop();
    renderShell(root,who,mode);
    const conceptsLink=document.createElement('a');
    conceptsLink.href=url(who,'concepts');conceptsLink.className=`ex-nav ${mode==='concepts'?'selected':''}`;
    conceptsLink.textContent='Ch. 1–3 Concepts';
    root.querySelector('nav[aria-label="Exam study modes"]').children[1].before(conceptsLink);
    const gamesLink=document.createElement('a');
    gamesLink.href=url(who,'games');gamesLink.className=`ex-nav ${mode==='games'?'selected':''}`;gamesLink.textContent='Games';
    conceptsLink.after(gamesLink);
    preferences(root,who);
    const el=root.querySelector('#exContent');
    if(!['practice','cards','sheet','concepts','games'].includes(mode)) {
      const feature=document.createElement('section');feature.className='ex-card';
      feature.innerHTML=`<p class="ex-eyebrow">EXAM SCOPE · CHAPTERS 1–3</p><h2>Nail the conceptual questions</h2><p>Know what the terms mean, why the rules work, and which answer traps to avoid. No Chapter 4 drills in this set.</p>${link(who,'concepts','Study concept flashcards →','ex-button primary')}`;
      el.prepend(feature);return;
    }
    el.innerHTML='<p role="status">Loading the professor’s review…</p>';
    try {
      if(mode==='concepts'||mode==='games') {
        if(!conceptsPromise)conceptsPromise=fetch('exam1-concepts.json').then(r=>{if(!r.ok)throw new Error('Concept cards unavailable');return r.json();}).catch(e=>{conceptsPromise=null;throw e;});
        const conceptsData=await conceptsPromise;
        if(el.isConnected) {
          if(mode==='games')ExamGames.render(el,who,conceptsData);
          else concepts(el,who,conceptsData);
        }
        return;
      }
      if(!dataPromise)dataPromise=fetch('exam1-data.json').then(r=>{if(!r.ok)throw new Error('Source data unavailable');return r.json();}).catch(e=>{dataPromise=null;throw e;});
      const data=await dataPromise;
      if(!el.isConnected)return;
      if(mode==='cards')cards(el,who,data);
      else if(mode==='sheet')sheet(el,data);
      else practice(el,who,data);
    }catch(_){if(el.isConnected)el.innerHTML='<section class="ex-card"><h1>Review could not load</h1><p>Reload to try again. The original PDFs are linked below.</p></section>';}
  }
  return { render:renderRoom };
})();
