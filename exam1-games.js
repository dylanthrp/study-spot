/* Matching uses the same source-linked concept IDs as the flashcard deck. */
const ExamGames = (() => {
  let timer;
  const stop = () => { clearInterval(timer); timer=null; };
  window.addEventListener('hashchange',stop);
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function shuffled(items) {
    const result=[...items];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function render(el,who,data) {
    stop();
    const key=`exam1_match_v1_${who}`;
    let bests={};
    try {const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved==='object')bests=saved;}catch(_){/* Optional storage. */}
    let topic='all',previous=[];
    const best=()=>Number.isFinite(bests[topic])?`${bests[topic].toFixed(1)}s`:'No time yet';
    function setup() {
      stop();
      el.innerHTML=`<header class="ex-hero"><p class="ex-eyebrow">GAMES · CHAPTERS 1–3</p><h1>Concept Match</h1><p>Clear six pairs. Beat your own time.</p></header><section class="ex-card"><h2>Choose what you’re working on</h2><label for="exMatchTopic">Matching topic</label><select id="exMatchTopic"><option value="all">All Chapters 1–3 concepts</option>${data.groups.map(g=>`<option value="${escape(g.id)}">${escape(g.title)}</option>`).join('')}</select><p>12 tiles · 6 term–definition pairs · 4 columns × 3 rows</p><p>Tap two tiles, or drag one onto its match. Keyboard: Tab to a tile, then Enter or Space. Correct pairs disappear. Wrong pairs add <strong>1 second</strong>.</p><p>Personal best: <strong id="exMatchBest">${best()}</strong></p><button class="ex-button primary" id="exMatchStart">Start matching</button><p class="ex-muted">The timer starts when the board appears and continues if you switch browser tabs. Times include penalties. Records stay on this device under your name, by topic—not a shared leaderboard. Prefer no timer? Use the Concepts flashcards.</p></section>`;
      const select=el.querySelector('#exMatchTopic');select.value=topic;
      select.onchange=()=>{topic=select.value;el.querySelector('#exMatchBest').textContent=best();};
      el.querySelector('#exMatchStart').onclick=play;
    }
    function play() {
      stop();
      const pool=data.cards.filter(c=>topic==='all'||c.group===topic);
      if(pool.length<6){setup();return;}
      let cards=shuffled(pool).slice(0,6);
      // Avoid repeating the identical six-card lot on an immediate replay.
      if(cards.every(c=>previous.includes(c.id))&&pool.length>6)cards[5]=shuffled(pool.filter(c=>!previous.includes(c.id)))[0];
      previous=cards.map(c=>c.id);
      const tiles=shuffled(cards.flatMap(c=>[{id:c.id,side:'term',text:c.term},{id:c.id,side:'definition',text:c.match}]));
      let selected=null,matched=0,mistakes=0,finished=false;
      const matchedIds=new Set();
      el.innerHTML=`<header class="ex-match-header"><div><p class="ex-eyebrow">CH. 1–3 · ${escape(topic==='all'?'Mixed concepts':data.groups.find(g=>g.id===topic).title)}</p><h1>Concept Match</h1></div><div class="ex-match-clock"><span>TIME</span><output id="exMatchTime" aria-label="Elapsed time including penalties">0.0s</output><small>Best: ${best()}</small></div></header><div class="ex-roundtop"><p id="exMatchProgress">0 / 6 pairs</p><button class="ex-button" id="exMatchExit">Choose another topic</button></div><p id="exMatchStatus" role="status">Match a term with its definition. Wrong match: +1 second.</p><div class="ex-match-grid" aria-label="Twelve matching tiles">${tiles.map((t,i)=>`<button class="ex-match-tile" data-tile="${i}" data-card="${escape(t.id)}" data-side="${t.side}" aria-pressed="false" draggable="true">${escape(t.text)}</button>`).join('')}</div><p class="ex-muted">Same vocabulary as the Concepts cards. Speed is practice feedback, not an exam score.</p>`;
      const started=performance.now();
      const elapsed=()=>((performance.now()-started)/1000)+mistakes;
      function tick(){if(!el.isConnected){stop();return;}el.querySelector('#exMatchTime').textContent=`${elapsed().toFixed(1)}s`;}
      timer=setInterval(tick,100);
      const buttons=[...el.querySelectorAll('[data-tile]')];
      const status=el.querySelector('#exMatchStatus');
      function finish() {
        finished=true;stop();
        const seconds=elapsed();
        const record=!Number.isFinite(bests[topic])||seconds<bests[topic];
        if(record)bests[topic]=seconds;
        let storage='Saved on this device.';
        try{localStorage.setItem(key,JSON.stringify(bests));}catch(_){storage='Storage unavailable; best time lasts for this visit only.';}
        el.innerHTML=`<section class="ex-card ex-summary"><p class="ex-eyebrow">ALL SIX PAIRS CLEARED</p><h1 tabindex="-1">${record?'New personal best!':'Board cleared!'}</h1><p class="ex-score" id="exMatchFinal">${seconds.toFixed(1)}s</p><p>${mistakes} wrong ${mistakes===1?'match':'matches'} · ${mistakes} penalty ${mistakes===1?'second':'seconds'} included.</p><p>Best for this topic: ${best()} ${escape(storage)}</p><button class="ex-button primary" id="exMatchReplay">Play again · new cards</button><button class="ex-button" id="exMatchMenu">Choose another topic</button><details><summary>Review this round’s pairs</summary><dl>${cards.map(c=>`<dt><strong>${escape(c.term)}</strong></dt><dd>${escape(c.match)}</dd>`).join('')}</dl></details><a class="ex-button" href="#/u/${who}/ACC-298/concepts">Review concept flashcards</a></section>`;
        el.querySelector('#exMatchReplay').onclick=play;el.querySelector('#exMatchMenu').onclick=setup;el.querySelector('h1').focus();
      }
      function pick(index) {
        if(finished||matchedIds.has(tiles[index].id))return;
        buttons.forEach(b=>b.classList.remove('wrong'));
        if(selected===null){selected=index;buttons[index].classList.add('picked');buttons[index].setAttribute('aria-pressed','true');return;}
        const first=selected;selected=null;
        buttons[first].classList.remove('picked');buttons[first].setAttribute('aria-pressed','false');
        if(first===index)return;
        if(tiles[first].id===tiles[index].id&&tiles[first].side!==tiles[index].side){
          matchedIds.add(tiles[index].id);matched++;
          for(const i of [first,index]){buttons[i].disabled=true;buttons[i].classList.add('matched');buttons[i].setAttribute('draggable','false');}
          status.textContent='Correct pair!';el.querySelector('#exMatchProgress').textContent=`${matched} / 6 pairs`;
          if(matched===6){finish();return;}
          buttons.find(b=>!b.disabled)?.focus({preventScroll:true});
        }else{
          mistakes++;tick();buttons[first].classList.add('wrong');buttons[index].classList.add('wrong');
          status.textContent=`Not a match. +1 second. ${mistakes} ${mistakes===1?'penalty':'penalties'} so far.`;
        }
      }
      buttons.forEach((button,index)=>{
        button.onclick=()=>pick(index);
        button.ondragstart=e=>{e.dataTransfer.setData('text/plain',String(index));e.dataTransfer.effectAllowed='move';};
        button.ondragover=e=>{if(!button.disabled)e.preventDefault();};
        button.ondrop=e=>{
          e.preventDefault();const text=e.dataTransfer.getData('text/plain');
          if(!/^\d+$/.test(text))return;
          const from=Number(text);if(from>=tiles.length||from===index||matchedIds.has(tiles[from].id))return;
          if(selected!==null){buttons[selected].classList.remove('picked');buttons[selected].setAttribute('aria-pressed','false');selected=null;}
          pick(from);pick(index);
        };
      });
      el.querySelector('#exMatchExit').onclick=setup;
    }
    setup();
  }
  return {render,stop};
})();
