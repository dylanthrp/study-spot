/* Independent, outline-aligned law room. No accounting state or engine shared. */
const LawRoom = (() => {
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const modes = [['overview','Study plan'],['concepts','Concept cards'],['practice','Scenario practice'],['games','Match terms'],['sheet','Study guide']];
  const memory={}; let pending, generation=0, timer;
  function cleanup(){generation++;clearInterval(timer);timer=null;}
  function load(who){
    if(memory[who])return memory[who];
    let saved;try{saved=JSON.parse(localStorage.getItem(`law_v2_${who}`));}catch{}
    const fresh={prefs:{focus:who==='wyatt',size:'normal',spacing:true},history:{},cardHistory:{},cards:null,round:null,best:{}};
    return memory[who]={...fresh,...saved,prefs:{...fresh.prefs,...saved?.prefs}};
  }
  function save(who){try{localStorage.setItem(`law_v2_${who}`,JSON.stringify(load(who)));}catch{const e=document.querySelector('#lawStorage');if(e)e.textContent='Storage unavailable: progress lasts for this visit only.';}}
  const button=(id,text,primary=false)=>`<button type="button" id="${id}" class="ex-button${primary?' primary':''}">${text}</button>`;
  const link=(who,mode,text)=>`<a class="ex-button" href="#/u/${who}/LE-253/${mode}">${esc(text)}</a>`;
  function source(data,page){return `<a href="${esc(data.source.url)}#page=${encodeURIComponent(page)}" target="_blank" rel="noopener">Saylor secondary reference · PDF p. ${esc(page)}</a>`;}
  function options(data,missed=false){return `<option value="all">All six chapters</option>${data.chapters.map(c=>`<option value="${esc(c.id)}">Ch. ${c.number} · ${esc(c.title)}</option>`).join('')}${missed?'<option value="missed">Previously missed</option>':''}`;}
  function pool(items,topic,history){return items.filter(c=>topic==='all'||(topic==='missed'?history[c.id]===false:c.group===topic));}
  async function render(root,who,mode){
    cleanup();const token=generation;mode=modes.some(m=>m[0]===mode)?mode:'overview';
    document.body.classList.add('exam-active','law-active');
    root.innerHTML='<div class="ex-shell" id="lawLoading" role="status">Loading outline study materials…</div>';
    let data;
    try{pending ||= fetch('law-data.json').then(r=>{if(!r.ok)throw Error('Materials unavailable');return r.json();}).catch(e=>{pending=null;throw e;});data=await pending;}
    catch{if(token===generation)root.innerHTML=`<section class="ex-card"><h1>Law materials unavailable</h1><p>The source data could not load. Reload to try again.</p><a href="#/u/${who}">Return to your dashboard</a></section>`;return;}
    if(token!==generation)return;
    const state=load(who);
    root.innerHTML=`<div id="lawRoom" class="ex-shell"><aside class="ex-sidebar"><a href="#/u/${who}">← Your dashboard</a><p class="ex-eyebrow">THE BUSINESS LAW ROOM</p><h2>Learn the rule.<br>Spot the difference.</h2><p class="ex-muted">LE 253 · outline-based study aid</p><nav aria-label="Law study modes">${modes.map(([id,label])=>`<a class="ex-nav ${id===mode?'selected':''}" ${id===mode?'aria-current="page"':''} href="#/u/${who}/LE-253/${id}">${label}</a>`).join('')}</nav><p class="ex-muted">Recall → apply → check → retry.</p></aside><section class="ex-main"><div class="ex-top"><span>${who==='wyatt'?'Wyatt’s Focus study room':'Cooper’s study room'}</span><span>OUTLINE CH. 1, 4, 5, 6, 8 &amp; 9</span></div><div class="ex-preferences"><label class="ex-toggle"><input id="lawFocus" type="checkbox" ${state.prefs.focus?'checked':''}>Focus view</label><label>Text size <select id="lawSize" aria-label="Text size"><option value="normal">Normal</option><option value="large">Large</option><option value="largest">Largest</option></select></label><label class="ex-toggle"><input id="lawSpacing" type="checkbox" ${state.prefs.spacing?'checked':''}>Extra spacing</label><p id="lawStorage">Progress stays in this browser, separately for each student. Not an account or cloud sync.</p></div><aside class="law-caveat"><strong>Cooper-supplied exam outline</strong><p>Chapter numbers follow the outline, not Saylor. Assigned textbook unconfirmed.</p><details><summary>Sources and study boundaries</summary><p>Study topics follow Cooper’s supplied review outline. Chapter numbers refer to the supplied outline, not Saylor. Assigned text remains unconfirmed. The Saylor textbook is a secondary reference; its page links are separate from review-prompt provenance. Supplied examples are not represented as instructor-authored or approved. Answers and explanations are study aids, not an official answer key. This older textbook describes historical rules and is not current legal advice.</p><a href="LAW-SOURCES.md" target="_blank" rel="noopener">Source mapping and attribution</a></details></aside><div id="lawContent"></div><footer class="ex-footer law-attribution"><a href="${esc(data.source.url)}" target="_blank" rel="noopener">${esc(data.source.title)}</a><p>Secondary reference: Saylor-hosted textbook · <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank" rel="noopener">CC BY-NC-SA 3.0</a>. Original creator intentionally unattributed under the source notice. Textbook-based summaries and cards are adapted for study use and shared under the same license. Cooper-supplied review prompts have separate provenance, shown on each supplied example; this textbook attribution does not describe those prompts.</p><p>${esc(data.source.notice || '')}</p></footer></section></div>`;
    const shell=root.querySelector('#lawRoom'),el=root.querySelector('#lawContent');
    function prefs(){shell.classList.toggle('ex-focus',state.prefs.focus);shell.classList.toggle('law-spaced',state.prefs.spacing);shell.dataset.size=state.prefs.size;save(who);}
    root.querySelector('#lawSize').value=state.prefs.size;
    root.querySelector('#lawFocus').onchange=e=>{state.prefs.focus=e.target.checked;prefs();};
    root.querySelector('#lawSize').onchange=e=>{state.prefs.size=e.target.value;prefs();};
    root.querySelector('#lawSpacing').onchange=e=>{state.prefs.spacing=e.target.checked;prefs();};prefs();
    if(mode==='concepts')cards(el,who,data);else if(mode==='practice')practice(el,who,data);else if(mode==='games')games(el,who,data);else if(mode==='sheet')guide(el,data);else overview(el,who,data);
  }
  function overview(el,who,data){el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">LESS REREADING. MORE RETRIEVAL.</p><h1>Business law.<br>One clear rule at a time.</h1><p>Six chapters. Recall the distinction, apply it to a new scenario, then revisit what you missed.</p>${link(who,'concepts','Start with concept cards →')}${link(who,'practice','Try five scenarios')}</header><section class="ex-card"><h2>Your study loop</h2><div class="ex-plan"><div><b>01 / RECALL</b><h3>Say the rule first</h3><p>Turn a card only after trying an answer. Again saves it for another pass.</p></div><div><b>02 / APPLY</b><h3>Read the facts closely</h3><p>Choose the best answer to a supplied review example or generated study scenario. Check the explanation and the common trap.</p></div><div><b>03 / RETRY</b><h3>Work the weak spots</h3><p>Retry missed cards and scenarios. Use the matching game for vocabulary, not proof of mastery.</p></div></div></section><section class="ex-card"><h2>Exam outline map</h2><p>${esc(data.scope_note)}</p><div class="law-chapters">${data.chapters.map(c=>`<article><p class="ex-eyebrow">OUTLINE CHAPTER ${c.number}</p><h3>${esc(c.title)}</h3><p>${esc(c.summary)}</p></article>`).join('')}</div></section>`;}
  function cards(el,who,data){
    const state=load(who);
    if(!state.cards?.ids?.every(id=>data.cards.some(c=>c.id===id)))state.cards=null;
    state.cards ||= {topic:'all',ids:data.cards.map(c=>c.id),index:0,missed:[]};
    function start(topic,ids){state.cards={topic,ids:ids||pool(data.cards,topic,state.cardHistory).map(c=>c.id),index:0,missed:[]};save(who);paint();}
    function paint(){
      const r=state.cards,c=data.cards.find(c=>c.id===r.ids[r.index]);
      el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">SAY IT BEFORE YOU SEE IT.</p><h1>Concept cards</h1></header><label class="law-filter">Card chapter<select id="lawCardTopic">${options(data,true)}</select></label>${button('lawCardShuffle','Shuffle cards')}<p class="ex-muted">Shuffle restarts the selected card pool; your recall history is kept.</p><div id="lawCardBody"></div>`;
      el.querySelector('#lawCardTopic').value=r.topic;el.querySelector('#lawCardTopic').onchange=e=>start(e.target.value);
      el.querySelector('#lawCardShuffle').onclick=()=>start(r.topic,shuffled(pool(data.cards,r.topic,state.cardHistory)).map(c=>c.id));
      const body=el.querySelector('#lawCardBody');
      if(!c){body.innerHTML=`<section class="ex-card"><h2>${r.ids.length?'Recall round complete':'No cards to retry yet'}</h2><p>${r.ids.length-r.missed.length} / ${r.ids.length} marked Got it. Self-rating guides practice; it is not an exam score.</p>${r.missed.length?button('lawCardRetry',`Retry cards (${r.missed.length})`,true):''}${button('lawCardRestart','Restart selected chapter')}</section>`;body.querySelector('#lawCardRetry')?.addEventListener('click',()=>start(r.topic,[...r.missed]));body.querySelector('#lawCardRestart').onclick=()=>start(r.topic);return;}
      let revealed=false;
      body.innerHTML=`<article class="ex-card ex-flash"><p class="ex-eyebrow" id="lawCardCount">Card ${r.index+1} of ${r.ids.length}</p><h2>${esc(c.front)}</h2><p>Answer aloud or on paper, then check your recall.</p>${button('lawFlip','Reveal answer',true)}<section id="lawBack" hidden><p class="law-answer">${esc(c.back)}</p><p><strong>Watch for:</strong> ${esc(c.trap)}</p><p class="ex-source">${source(data,c.page)}</p></section><div id="lawRatings" hidden>${button('lawAgain','Again')}${button('lawGot','Got it',true)}</div></article>`;
      body.querySelector('#lawFlip').onclick=()=>{revealed=true;body.querySelector('#lawBack').hidden=false;body.querySelector('#lawRatings').hidden=false;body.querySelector('#lawFlip').hidden=true;};
      function rate(correct){if(!revealed)return;state.cardHistory[c.id]=correct;if(!correct)r.missed.push(c.id);r.index++;save(who);paint();}
      body.querySelector('#lawAgain').onclick=()=>rate(false);body.querySelector('#lawGot').onclick=()=>rate(true);
    }paint();
  }
  function practice(el,who,data){
    const state=load(who),byId=id=>data.questions.find(q=>q.id===id);
    function ordered(questions,topic){
      const groups=data.chapters.map(c=>c.id),offset=topic==='all'?(state.nextChapter||0):0;
      const order=[...groups.slice(offset),...groups.slice(0,offset)],result=[];
      // Both unanswered and previously missed items precede mastered items.
      for(const mastered of [false,true]){
        const queues=order.map(group=>questions.filter(q=>q.group===group&&(state.history[q.id]===true)===mastered));
        while(queues.some(q=>q.length))for(const queue of queues)if(queue.length)result.push(queue.shift());
      }
      return result;
    }
    function focusQuestion(){const heading=el.querySelector('#lawQuestion')||el.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'});}}
    function start(ids){state.round={ids,index:0,results:{},drafts:{}};save(who);paint();focusQuestion();}
    function setup(){el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">APPLY THE RULE TO THE FACTS.</p><h1>Scenario practice</h1><p>Cooper-supplied review examples and original generated study scenarios. Each prompt is labeled below; explanations are study aids, not an official answer key.</p></header><section class="ex-card"><h2>Choose your round</h2><div class="ex-fields"><label>Practice chapter<select id="lawPracticeTopic">${options(data,true)}</select></label><label>Round length<select id="lawLength"><option value="5">5 quick scenarios</option><option value="all">All in this chapter</option></select></label></div>${button('lawStart','Start round',true)}<p id="lawEmpty" role="status"></p></section>`;
      el.querySelector('#lawStart').onclick=()=>{const topic=el.querySelector('#lawPracticeTopic').value,questions=ordered(pool(data.questions,topic,state.history),topic),length=el.querySelector('#lawLength').value;if(!questions.length){el.querySelector('#lawEmpty').textContent='No missed scenarios yet. Try a chapter first.';return;}const chosen=questions.slice(0,length==='all'?questions.length:5);if(topic==='all')state.nextChapter=(data.chapters.findIndex(c=>c.id===chosen.at(-1).group)+1)%data.chapters.length;start(chosen.map(q=>q.id));};}
    function paint(){const r=state.round;if(!r?.ids?.length||r.ids.some(id=>!byId(id))){setup();return;}
      if(r.index>=r.ids.length){const missed=r.ids.filter(id=>!r.results[id]?.correct);el.innerHTML=`<section class="ex-card"><h1>Round complete</h1><p class="ex-score">${r.ids.length-missed.length} / ${r.ids.length}</p><p>correct without revealing. Check the rules behind your misses, then try them again.</p>${missed.length?button('lawRetry',`Retry missed (${missed.length})`,true):''}${button('lawNew','New round')}</section>`;el.querySelector('#lawRetry')?.addEventListener('click',()=>start(missed));el.querySelector('#lawNew').onclick=()=>{state.round=null;save(who);setup();};return;}
      const q=byId(r.ids[r.index]),result=r.results[q.id];
      el.innerHTML=`<div class="ex-roundtop"><p id="lawRepCount" class="ex-eyebrow">Rep ${r.index+1} of ${r.ids.length}</p>${button('lawChange','Choose another round')}</div><progress aria-label="Round progress" value="${r.index}" max="${r.ids.length}"></progress><article class="ex-card ex-problem"><p class="law-provenance">${q.kind==='supplied'?`<strong>Cooper-supplied review example</strong><br>Prompt source: ${esc(q.source_file || 'Supplied review outline')}`:'<strong>Original generated study scenario</strong> · not a supplied review question'}</p><h1 id="lawQuestion">${esc(q.prompt)}</h1><form id="lawAnswer"><fieldset class="law-choices"><legend>Choose the best answer</legend>${q.choices.map((choice,i)=>`<label><input id="lawChoice${i}" name="lawChoice" type="radio" value="${i}" ${r.drafts[q.id]===i?'checked':''} ${result?'disabled':''}><span>${esc(choice)}</span></label>`).join('')}</fieldset><p id="lawValidation" role="status"></p><button id="lawCheck" class="ex-button primary" ${result?'disabled':''}>Check answer</button>${button('lawReveal','Show answer · mark for retry')}</form><section id="lawFeedback" aria-live="polite">${result?`<div class="ex-result ${result.correct?'correct':'retry'}"><h2 tabindex="-1">${result.correct?'Correct':result.revealed?'Answer revealed · retry this one':'Not quite · review the distinction'}</h2><p class="law-answer">${esc(q.choices[q.answer])}</p><h3>Why it works</h3><p>${esc(q.explanation)}</p><p><strong>Watch for:</strong> ${esc(q.trap)}</p><p class="ex-source">${source(data,q.page)}</p>${button('lawNext',r.index===r.ids.length-1?'Finish round':'Next scenario',true)}</div>`:''}</section></article>`;
      el.querySelector('#lawAnswer').onchange=e=>{r.drafts[q.id]=Number(e.target.value);save(who);};
      function grade(revealed){if(result)return;if(!revealed&&!Number.isInteger(r.drafts[q.id])){el.querySelector('#lawValidation').textContent='Choose an answer before checking.';return;}const correct=!revealed&&r.drafts[q.id]===q.answer;r.results[q.id]={correct,revealed};state.history[q.id]=correct;save(who);paint();el.querySelector('#lawFeedback h2').focus();}
      el.querySelector('#lawAnswer').onsubmit=e=>{e.preventDefault();grade(false);};el.querySelector('#lawReveal').disabled=!!result;el.querySelector('#lawReveal').onclick=()=>grade(true);
      el.querySelector('#lawNext')?.addEventListener('click',()=>{r.index++;save(who);paint();focusQuestion();});el.querySelector('#lawChange').onclick=()=>{state.round=null;save(who);setup();};
    }paint();
  }
  function shuffled(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function games(el,who,data){
    const state=load(who);let topic='all',selected=null,matched=0,penalty=0,started=0;
    el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">QUICK VOCABULARY RETRIEVAL.</p><h1>Match terms</h1><p>Six terms, six meanings. Select a term and its matching definition. A mismatch adds one second. The clock starts on your first selection.</p></header><label class="law-filter">Match chapter<select id="lawMatchTopic">${options(data)}</select></label><div class="law-match-bar">${button('lawMatchStart','Start / replay six pairs',true)}<output id="lawClock" aria-label="Elapsed time">0.0s</output><span id="lawBest"></span></div><p id="lawMatchStatus" role="status">Choose a chapter and start a round.</p><div id="lawMatchGrid" class="law-match-grid"></div>`;
    const grid=el.querySelector('#lawMatchGrid'),status=el.querySelector('#lawMatchStatus'),clock=el.querySelector('#lawClock');
    function best(){el.querySelector('#lawBest').textContent=state.best[topic]?`Personal best: ${state.best[topic].toFixed(1)}s`:'No best yet';}
    const elapsed=()=>started?(performance.now()-started)/1000+penalty:0;
    el.querySelector('#lawMatchTopic').onchange=e=>{topic=e.target.value;clearInterval(timer);timer=null;grid.innerHTML='';clock.textContent='0.0s';status.textContent='Chapter selected. Start a new round.';best();};
    el.querySelector('#lawMatchStart').onclick=()=>{
      clearInterval(timer);selected=null;matched=0;penalty=0;started=0;clock.textContent='0.0s';
      const chosen=shuffled(pool(data.cards,topic,{})).filter(c=>c.term&&c.match).slice(0,6);
      if(chosen.length<6){status.textContent='Not enough matching pairs in this chapter.';return;}
      grid.innerHTML=shuffled(chosen.flatMap(c=>[{id:c.id,side:'term',text:c.term},{id:c.id,side:'match',text:c.match}])).map(t=>`<button class="law-tile" data-pair="${esc(t.id)}" data-side="${t.side}" aria-pressed="false">${esc(t.text)}</button>`).join('');status.textContent='Find six matching pairs.';
      grid.querySelectorAll('button').forEach(tile=>{tile.onclick=()=>{
        if(!started){started=performance.now();timer=setInterval(()=>{clock.textContent=`${elapsed().toFixed(1)}s`;},100);}
        if(selected===tile){tile.classList.remove('picked');tile.setAttribute('aria-pressed','false');selected=null;return;}
        if(!selected){selected=tile;tile.classList.add('picked');tile.setAttribute('aria-pressed','true');return;}
        const previous=selected;selected=null;previous.classList.remove('picked');previous.setAttribute('aria-pressed','false');
        if(previous.dataset.pair===tile.dataset.pair&&previous.dataset.side!==tile.dataset.side){previous.disabled=true;tile.disabled=true;matched++;status.textContent=`${matched} of 6 pairs matched.`;}
        else{penalty++;status.textContent='Not a match · +1 second. Try again.';}
        clock.textContent=`${elapsed().toFixed(1)}s`;
        if(matched===6){clearInterval(timer);timer=null;const time=elapsed();if(!state.best[topic]||time<state.best[topic])state.best[topic]=time;save(who);best();status.textContent=`Six pairs matched in ${time.toFixed(1)} seconds, including ${penalty} penalty seconds. Replay to practice again.`;}
      };});
    };best();
  }
  function guide(el,data){el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">THE RULE. THE DISTINCTION. THE TRAP.</p><h1>Business law study guide</h1><p>A printable chapter-by-chapter companion, not a prediction of your exam.</p>${button('lawPrint','Print study guide')}</header><div class="law-guide">${data.chapters.map(c=>`<section class="ex-card"><p class="ex-eyebrow">OUTLINE CHAPTER ${c.number}</p><h2>${esc(c.title)}</h2><p>${esc(c.summary)}</p>${c.rules.map(r=>`<article class="law-rule"><h3>${esc(r.term)}</h3><p>${esc(r.explanation)}</p><p><strong>Watch for:</strong> ${esc(r.trap)}</p><p class="ex-source">${source(data,r.page)}</p></article>`).join('')}</section>`).join('')}</div>`;el.querySelector('#lawPrint').onclick=()=>window.print();}
  return {render,cleanup};
})();
