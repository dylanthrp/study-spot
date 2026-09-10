/* Calc III classroom: original section-aligned lessons, separate from legacy physics. */
const Calc3 = (() => {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const url = (who, mode = 'overview') => `#/u/${who}/MATH-215/${mode}`;
  const link = (who, mode, text, cls = '') => `<a class="${cls}" href="${url(who, mode)}">${esc(text)}</a>`;
  function render(root, who, mode) {
    document.body.classList.add('calc-active');
    const lessons = CALC3_DATA.lessons;
    const lesson = lessons.find(l => l.id === mode) || (mode === 'learn' ? lessons[0] : null);
    root.innerHTML = `<div class="calc-shell">
      <div class="calc-top"><a href="#/u/${who}">← Your dashboard</a><span>MATH-215 <b>/</b> THE VECTOR CLASSROOM</span><span>${esc(STUDENTS[who].display.split(' ')[0])}'s workspace</span></div>
      <div class="calc-layout"><aside class="calc-sidebar" aria-label="Classroom navigation">
        <p class="calc-eyebrow">YOUR QUIZ COMPANION</p><h2>Calculus III</h2><p class="calc-muted">Stewart §§12.3–12.4</p>
        <nav>${link(who,'overview','Your study plan',mode === 'overview' ? 'selected':'')}
        <p class="calc-eyebrow">LEARN THE IDEAS</p>${lessons.map((l,i) => link(who,l.id,`${String(i+1).padStart(2,'0')}  ${l.title}`,lesson?.id === l.id ? 'selected':'')).join('')}
        <p class="calc-eyebrow">MAKE IT STICK</p>${link(who,'lab','Vector playground',mode === 'lab'?'selected':'')}${link(who,'practice','Quiz practice',mode === 'practice'?'selected':'')}${link(who,'sheet','Formula sheet',mode === 'sheet'?'selected':'')}${link(who,'notebook','My notebook',mode === 'notebook'?'selected':'')}</nav>
        <p class="calc-sidebar-note">Understand the move.<br>Work the example.<br>Try it on your own.</p>
      </aside><section class="calc-main" id="calcMain">${lesson ? lessonHTML(who,lesson) : mode === 'lab' ? labHTML() : mode === 'notebook' ? notebookHTML() : mode === 'practice' ? quizHTML() : mode === 'sheet' ? sheetHTML(who) : overview(who)}</section></div>
      <div class="calc-source"><strong>About this material</strong><p>Original explanations, diagrams, and practice aligned to Stewart §§12.3–12.4. Not copied textbook exercises or a prediction of your instructor’s quiz. Check your assigned notes for exact coverage.</p><details><summary>References & source notes</summary><ul>${CALC3_DATA.sources.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></li>`).join('')}</ul><p>Official contents establish section titles; LibreTexts provides open, aligned explanations, not Stewart’s proprietary pages.</p></details></div>
    </div>`;
    if (lesson) wireLesson(root, lesson);
    if (mode === 'lab') wireLab(root);
    if (mode === 'notebook') wireNotebook(root, who);
    if (mode === 'practice') wireQuiz(root, who);
    if (mode === 'sheet') root.querySelector('#calcPrint').onclick = () => window.print();
    window.scrollTo({ top:0 });
  }
  function overview(who) {
    return `<div class="calc-intro"><p class="calc-eyebrow">SMALL STEPS. CLEAR REASONS.</p><h1>Vectors, without<br>the guesswork.</h1><p>You don’t need to memorize a wall of formulas. Learn what the question is asking, choose the right tool, then work one careful step at a time.</p>${link(who,'learn','Start learning','calc-button primary')} ${link(who,'practice','Try quiz practice','calc-button')}</div>
    <section class="calc-card"><p class="calc-eyebrow">THE IDEA THAT CONNECTS EVERYTHING</p><h2>Dot measures alignment.<br>Cross finds a perpendicular.</h2><div class="calc-compare"><div><span class="calc-symbol">a · b</span><h3>A number, not an arrow.</h3><p>“How much do these vectors point along each other?” Think angle, projection, and work.</p></div><div><span class="calc-symbol">a × b</span><h3>A new arrow.</h3><p>“Which direction is perpendicular to both?” Its length also measures a parallelogram’s area.</p></div></div>${link(who,'lab','See it in the vector playground →','calc-text-link')}</section>
    <section class="calc-card"><h2>Your plan for tonight</h2><ol class="calc-plan"><li><b>Start with recognition.</b> Work through the lessons in order. Write down each trigger phrase and formula.</li><li><b>Try before revealing.</b> Use scratch paper before opening the next example step. Compare the reasoning, not just the answer.</li><li><b>Check your understanding.</b> Attempt the mixed practice without notes, then revisit the linked lessons for missed topics.</li></ol><p class="calc-muted">Focus first on dot, cross, angles, projections, normals, and area. Review direction cosines, volume, work, and torque as covered in your instructor’s notes.</p></section>`;
  }
  function lessonHTML(who, l) {
    const next = CALC3_DATA.lessons[CALC3_DATA.lessons.indexOf(l)+1];
    return `<p class="calc-eyebrow">${esc(l.section)} · GUIDED LESSON</p><h1>${esc(l.title)}</h1><p class="calc-lead">${esc(l.intro)}</p>
      <div class="calc-trigger"><span>WHEN YOU SEE THE QUESTION, THINK</span><strong>${esc(l.trigger)}</strong></div>
      <section class="calc-card"><h2>The rule to put in your notes</h2><div class="calc-formula">${esc(l.formula)}</div><ol class="calc-plan">${l.recipe.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section>
      <section class="calc-card calc-example"><p class="calc-eyebrow">LET’S WORK ONE TOGETHER</p><h2>Pause. Try a step. Then compare.</h2><p class="calc-problem">${esc(l.example.prompt)}</p><div id="calcSteps" aria-live="polite"></div><button class="calc-button primary" id="calcStep">Reveal next step</button><button class="calc-button" id="calcRestart">Restart example</button></section>
      <div class="calc-compare calc-checks"><section><h3>Watch out</h3><p>${esc(l.watch)}</p></section><section><h3>Check yourself</h3><p>${esc(l.check)}</p></section></div>
      <div class="calc-actions">${link(who,'notebook','Open my notebook','calc-button')}${link(who,next?.id || 'practice',next ? 'Next lesson →' : 'Try quiz practice →','calc-button primary')}</div>`;
  }
  function wireLesson(root,l) {
    let step = 0;
    const paint = () => {
      root.querySelector('#calcSteps').innerHTML = l.example.steps.slice(0,step).map((s,i)=>`<div class="calc-example-step"><span>${i+1}</span><p>${esc(s)}</p></div>`).join('') + (step === l.example.steps.length ? `<div class="calc-answer"><strong>Final answer</strong><p>${esc(l.example.answer)}</p></div>`:'');
      root.querySelector('#calcStep').disabled = step === l.example.steps.length;
    };
    root.querySelector('#calcStep').onclick = () => { step++; paint(); };
    root.querySelector('#calcRestart').onclick = () => { step=0; paint(); };
  }
  function labHTML() {
    return `<p class="calc-eyebrow">DRAG IT. PREDICT IT. EXPLAIN IT.</p><h1>Vector playground</h1><p class="calc-lead">Keep a fixed, then swing b around. Signed alignment decreases from 0° to 180°, while area peaks at 90° and returns to zero at 180°. Both vectors lie in the xy plane.</p>
      <section class="calc-card"><label for="calcAngle"><strong>Angle between a and b</strong></label><div class="calc-slider"><input type="range" id="calcAngle" min="0" max="180" value="60" step="1"><output id="calcAngleValue" for="calcAngle">60°</output></div>
      <div>${[0,90,180].map((v,i)=>`<button class="calc-button" data-angle="${v}">${v}° · ${['same direction','perpendicular','opposite'][i]}</button>`).join('')}</div>
      <svg id="calcVectorDiagram" viewBox="0 0 650 330" role="img" aria-labelledby="calcDiagramTitle calcDiagramDesc"><title id="calcDiagramTitle">Two vectors, their projection, and parallelogram area</title><desc id="calcDiagramDesc">a has length 4. b has length 3. The angle is adjustable. Numeric dot product and cross product magnitude appear below.</desc><defs><marker id="calcArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" fill="#00274c"/></marker></defs><path d="M55 225H580M230 280V40" stroke="#d5ccba"/><polygon id="calcAreaShape" fill="#ffdf68" fill-opacity=".55" stroke="#b59a46"/><path id="calcProjectionLine" stroke="#397f7b" stroke-width="3" stroke-dasharray="6 5"/><path d="M230 225H398" stroke="#00274c" stroke-width="4" marker-end="url(#calcArrow)"/><path id="calcBVector" stroke="#00274c" stroke-width="4" marker-end="url(#calcArrow)"/><circle cx="230" cy="225" r="4" fill="#00274c"/><g fill="#00274c" font-family="Inter, sans-serif" font-size="15"><text x="310" y="253">a: length 4</text><text id="calcBLabel">b: length 3</text><text x="568" y="248">x</text><text x="241" y="51">y</text></g></svg>
      <div class="calc-metrics" aria-live="polite"><div><small>DOT · alignment</small><strong id="calcDotValue"></strong><span>12 cos θ</span></div><div><small>CROSS MAGNITUDE · area</small><strong id="calcCrossValue"></strong><span>12 sin θ</span></div><div><small>SIGNED PROJECTION OF b ONTO a</small><strong id="calcProjectionValue"></strong><span>3 cos θ</span></div></div>
      <p id="calcLabInsight" class="calc-lab-insight" aria-live="polite"></p><p class="calc-muted">Gold = parallelogram. Dashed teal = perpendicular drop to a’s line. For 0° &lt; θ &lt; 180°, a × b points out of the screen (+z); at either endpoint it is the zero vector.</p></section>
      <h2>Visual references for your notes</h2><p>Original annotated diagrams. Open either image to save it alongside your notes.</p><figure class="calc-reference"><a href="assets/calc3-projection.svg" target="_blank" rel="noopener"><img src="assets/calc3-projection.svg" alt="Projection and perpendicular residual reference"></a><figcaption>Projection keeps the part along the target direction; the leftover is perpendicular.</figcaption></figure><figure class="calc-reference"><a href="assets/calc3-cross.svg" target="_blank" rel="noopener"><img src="assets/calc3-cross.svg" alt="Cross product area and right-hand orientation reference"></a><figcaption>The cross product has both a magnitude (area) and an orientation (right-hand rule).</figcaption></figure>`;
  }
  function wireLab(root) {
    const angle = root.querySelector('#calcAngle');
    const paint = () => {
      const degrees = Number(angle.value), theta = degrees*Math.PI/180;
      const x = 126*Math.cos(theta), y = 126*Math.sin(theta);
      const number = n => (Math.abs(n)<0.00001 ? 0:n).toFixed(2);
      root.querySelector('#calcAngleValue').textContent = `${degrees}°`;
      root.querySelector('#calcAreaShape').setAttribute('points',`230,225 398,225 ${398+x},${225-y} ${230+x},${225-y}`);
      root.querySelector('#calcBVector').setAttribute('d',`M230 225L${230+x} ${225-y}`);
      root.querySelector('#calcProjectionLine').setAttribute('d',`M${230+x} ${225-y}V225`);
      const label = root.querySelector('#calcBLabel'); label.setAttribute('x',230+x-35); label.setAttribute('y',205-y);
      root.querySelector('#calcDotValue').textContent = number(12*Math.cos(theta));
      root.querySelector('#calcCrossValue').textContent = number(12*Math.sin(theta));
      root.querySelector('#calcProjectionValue').textContent = number(3*Math.cos(theta));
      root.querySelector('#calcLabInsight').textContent = degrees===0 ? 'Same direction: maximum positive dot product, zero area. The cross product is the zero vector.' : degrees===180 ? 'Opposite directions: negative dot product, but still zero area. Parallel does not have to mean same direction.' : degrees===90 ? 'Perpendicular: zero dot product and maximum area. The projection is zero, not a unit vector.' : degrees<90 ? 'Acute angle: b has a positive component along a. The projection points right.' : 'Obtuse angle: b has a negative component along a. The projection points left; area stays nonnegative.';
    };
    angle.oninput = paint;
    root.querySelectorAll('[data-angle]').forEach(b=>b.onclick=()=>{ angle.value=b.dataset.angle; paint(); });
    paint();
  }
  function notebookHTML() {
    return `<p class="calc-eyebrow">PUT IT IN YOUR OWN WORDS</p><h1>My notebook</h1><p class="calc-lead">For each topic, capture the trigger, formula, one worked example, and the mistake you want to avoid.</p><section class="calc-card"><label for="calcNotes"><strong>My Calc III notes</strong></label><p class="calc-muted">Autosaved separately for each student in this browser only. Not cloud-synced or password-protected. Download a backup before switching devices or clearing browser data.</p><textarea id="calcNotes" rows="18" maxlength="50000" placeholder="DOT PRODUCT\nTrigger: angle, alignment, work...\nFormula:\nExample:\nWatch out:\n\nCROSS PRODUCT\nTrigger:\nFormula:\nExample:\nWatch out:"></textarea><p role="status" id="calcSaveStatus">Ready to take notes.</p><button class="calc-button primary" id="calcDownload">Download my notes</button></section>`;
  }
  function wireNotebook(root,who) {
    const key = `studyspot_calc3:${who}:notes:v1`;
    const notes = root.querySelector('#calcNotes'), status = root.querySelector('#calcSaveStatus');
    try { notes.value = localStorage.getItem(key) || ''; }
    catch { status.textContent = 'Browser storage unavailable. Download your notes before leaving.'; }
    notes.oninput = () => {
      try { localStorage.setItem(key,notes.value); status.textContent = 'Saved in this browser.'; }
      catch { status.textContent = 'Not saved: browser storage unavailable or full. Download your notes before leaving.'; }
    };
    root.querySelector('#calcDownload').onclick = () => {
      const blob = new Blob([notes.value],{type:'text/plain;charset=utf-8'});
      const address = URL.createObjectURL(blob), a = document.createElement('a');
      a.href=address; a.download=`${who}-calc3-notes.txt`; a.click();
      setTimeout(()=>URL.revokeObjectURL(address),1000);
    };
  }
  function quizHTML() {
    return `<p class="calc-eyebrow">ORIGINAL PRACTICE · NOT THE ACTUAL QUIZ</p><h1>Quiz practice</h1><p class="calc-lead">Work each problem on paper before choosing. You’ll get the reasoning immediately—not just a red or green mark.</p><p class="calc-muted">This attempt lasts while you stay on this page. Leaving or refreshing starts a fresh attempt; no score is treated as course mastery.</p><div id="calcQuiz"></div>`;
  }
  function wireQuiz(root,who) {
    let queue = CALC3_DATA.questions.slice(), index=0, score=0, missed=[];
    const holder = root.querySelector('#calcQuiz');
    function question(moveFocus = true) {
      let checked=false;
      const q=queue[index];
      holder.innerHTML=`<section class="calc-card"><p class="calc-eyebrow" id="calcQuestionCount">Question ${index+1} of ${queue.length}</p><form id="calcQuizForm"><fieldset><legend>${esc(q.prompt)}</legend><details class="calc-scratch"><summary>Work it out first</summary><label for="calcScratch">Scratch work (not graded or saved)</label><textarea id="calcScratch" rows="3"></textarea></details><div class="calc-options">${q.options.map((option,i)=>`<label class="calc-option"><input type="radio" name="answer" value="${i}"><span><b>${String.fromCharCode(65+i)}.</b> ${esc(option)}</span></label>`).join('')}</div></fieldset><button class="calc-button primary" id="calcCheck" disabled>Check answer</button></form><div id="calcQuizFeedback" aria-live="polite"></div><button class="calc-button primary" id="calcNext" hidden>${index===queue.length-1?'See results':'Next question'}</button></section>`;
      const form=holder.querySelector('form'), check=holder.querySelector('#calcCheck'), next=holder.querySelector('#calcNext');
      const prompt = holder.querySelector('legend');
      prompt.tabIndex = -1;
      if (moveFocus) prompt.focus();
      form.onchange=()=>{ if (!checked) check.disabled=!form.querySelector('input:checked'); };
      form.onsubmit=e=>{
        e.preventDefault();
        const selection=form.querySelector('input:checked');
        if (checked || !selection) return;
        checked=true;
        const correct=Number(selection.value)===q.correct;
        if (correct) score++; else missed.push(q);
        check.disabled=true;
        form.querySelectorAll('input').forEach(input=>{ input.disabled=true; });
        const explanation=holder.querySelector('#calcQuizFeedback');
        explanation.className=`calc-feedback ${correct?'correct':'incorrect'}`;
        explanation.innerHTML=`<h3>${correct?'Correct — here’s why.':'Not quite — let’s untangle it.'}</h3><p><strong>Answer: ${esc(q.options[q.correct])}</strong></p><p>${esc(q.explanation)}</p>${link(who,q.lesson,'Revisit this lesson →','calc-text-link')}`;
        next.hidden=false;
      };
      next.onclick=()=>{ if (!checked) return; index++; if(index<queue.length) question(); else results(); };
    }
    function results() {
      holder.innerHTML=`<section class="calc-card"><p class="calc-eyebrow">THIS ATTEMPT</p><h2 id="calcScore">${score} / ${queue.length}</h2><p>${missed.length?'Good studying starts with noticing what tripped you up. Review these explanations, then try the missed questions again.':'You answered this set correctly. Now try writing out the reasoning without the answer choices.'}</p>${missed.map(q=>`<div class="calc-review"><h3>${esc(q.prompt)}</h3><p>${esc(q.explanation)}</p>${link(who,q.lesson,'Review the lesson →','calc-text-link')}</div>`).join('')}${missed.length?'<button class="calc-button primary" id="calcRetry">Retry missed questions</button>':''}<button class="calc-button" id="calcNew">Start a new full attempt</button></section>`;
      if(missed.length) holder.querySelector('#calcRetry').onclick=()=>{ queue=missed.slice(); index=0; score=0; missed=[]; question(); };
      holder.querySelector('#calcNew').onclick=()=>{ queue=CALC3_DATA.questions.slice(); index=0; score=0; missed=[]; question(); };
      const heading = holder.querySelector('#calcScore');
      heading.tabIndex = -1;
      heading.focus();
    }
    question(false);
  }
  function sheetHTML(who) {
    return `<p class="calc-eyebrow">THE RULE + WHEN TO USE IT</p><h1>Your formula sheet</h1><p class="calc-lead">Use this while taking notes. Then put it away and see which formulas you can reconstruct.</p><button class="calc-button" id="calcPrint">Print formula sheet</button>${CALC3_DATA.lessons.map(l=>`<section class="calc-card"><h2>${esc(l.title)}</h2><p><strong>${esc(l.trigger)}</strong></p><div class="calc-formula">${esc(l.formula)}</div><p class="calc-muted">${esc(l.watch)}</p>${link(who,l.id,'See the worked example →','calc-text-link')}</section>`).join('')}`;
  }
  return { render };
})();
