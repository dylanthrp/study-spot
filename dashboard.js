/* Student dashboard: presentation and course navigation, separate from study engines. */
const Dashboard = (() => {
  let current = null;
  let resizeCleanup = () => {};
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
    library: '<path d="M3 6h7l2 3h9l-3 11H3Z"/><path d="M3 6V3h7l2 3h7v3"/>',
    cards: '<rect x="7" y="4" width="12" height="16" rx="2"/><path d="m4 17-2-12 3-1M11 9h4M11 13h4"/>',
    guides: '<path d="M4 3h12l4 4v14H4Z"/><path d="M15 3v5h5M8 12h8M8 16h6"/>',
    games: '<rect x="3" y="3" width="6" height="6" rx="1"/><circle cx="17" cy="6" r="3"/><path d="m3 15 6 6m0-6-6 6m11-6h6l-3 6Z"/>',
    tests: '<path d="m3 6 2 2 4-4m-6 12 2 2 4-4M13 6h8M13 16h8"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    school: '<path d="m2 9 10-6 10 6-10 6Z"/><path d="M6 12v6q6 5 12 0v-6M22 9v8"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>'
  };
  const icon = name => `<svg class="dash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.library}</svg>`;
  function readList(who, type) {
    try {
      const list = JSON.parse(localStorage.getItem(`studyspot_dashboard:${who}:${type}`) || '[]');
      return Array.isArray(list) ? list.filter(item => item && typeof item === 'object') : [];
    } catch { return []; }
  }
  function saveList(who, type, list) {
    try { localStorage.setItem(`studyspot_dashboard:${who}:${type}`, JSON.stringify(list)); return true; }
    catch { return false; }
  }
  function foldersFor(who) {
    return readList(who, 'folders').filter(folder => typeof folder.id === 'string' && typeof folder.name === 'string' && Array.isArray(folder.courses));
  }
  function recordVisit(who, code, mode = 'notes') {
    if (!STUDENTS[who]?.classes.some(c => c.code === code)) return;
    const safeMode = ['notes', 'cards', 'flash', 'sheet', 'recall'].includes(mode) ? mode : 'notes';
    const history = readList(who, 'recent').filter(item => item.code !== code);
    saveList(who, 'recent', [{ code, mode: safeMode, opened: Date.now() }, ...history].slice(0, 8));
  }
  const dashboardURL = (who, tab = 'home', extra = {}) => {
    const query = new URLSearchParams({ ...(tab === 'home' ? {} : { tab }), ...extra });
    return `#/u/${who}${query.size ? '?' + query : ''}`;
  };
  const courseURL = (who, course, mode = 'notes') => course.code === 'ACC-289' && who === 'cooper'
    ? STUDENTS.cooper.noteLink.href
    : course.code === 'MATH-215'
    ? `#/u/${who}/MATH-215${['flash','recall'].includes(mode) ? '/practice' : mode === 'sheet' ? '/sheet' : ''}`
    : `#/u/${who}/${course.code}${course.hasHub ? '/' + mode : ''}`;
  function availability(course) {
    if (course.code === 'MATH-215') return 'Guided lessons · vector diagrams · quiz practice';
    if (course.hasHub) return 'Physics materials · content review pending';
    if (course.code === 'ACC-289') return 'Accounting deck · opens separate study app';
    return 'Awaiting course materials';
  }
  function courseTile(who, course, mode = 'notes') {
    return `<a class="dash-course" href="${courseURL(who, course, mode)}" data-course-code="${course.code}">
      <div class="dash-course-top">${icon(course.hasHub ? 'cards' : 'library')}<span>${escape(course.code)}</span>${icon('arrow')}</div>
      <h3>${escape(course.name)}</h3><p>${escape(availability(course))}</p>
      <span class="dash-course-foot">${course.hasHub ? 'Open materials' : course.code === 'ACC-289' ? 'Open deck ↗' : 'Open course'} ${icon('arrow')}</span>
    </a>`;
  }
  function render(root, who, student, params) {
    resizeCleanup();
    current = { root, who, student, params };
    document.body.classList.add('dashboard-active');
    const tab = ['home', 'library', 'cards', 'guides', 'games', 'tests', 'folder'].includes(params.get('tab')) ? params.get('tab') : 'home';
    const activeTab = tab || 'home';
    const recent = readList(who, 'recent').filter(item => student.classes.some(c => c.code === item.code));
    const first = student.classes.find(c => c.code === recent[0]?.code) || student.classes.find(c => c.hasHub || c.code === 'ACC-289') || student.classes[0];
    const navLink = (id, label) => `<a class="dash-nav-link ${activeTab === id ? 'is-active' : ''}" href="${dashboardURL(who, id)}" ${activeTab === id ? 'aria-current="page"' : ''}>${icon(id)}<span>${label}</span></a>`;
    root.innerHTML = `
      <div class="dash-shell">
        <header class="dash-header">
          <div class="dash-brand-group"><button class="dash-icon-button" id="dashToggle" aria-label="Toggle sidebar" aria-controls="dashSidebar" aria-expanded="true">${icon('menu')}</button>
            <a class="dash-brand" href="${dashboardURL(who)}" aria-label="Study Spot home"><span class="dash-mark">S<span>·</span></span><span>Study Spot</span></a></div>
          <form class="dash-search" role="search" id="dashSearchForm">${icon('search')}<input id="dashSearch" type="search" aria-label="Search your courses and materials" placeholder="Search your courses and materials" value="${escape(params.get('q') || '')}"><kbd>/</kbd></form>
          <div class="dash-header-actions"><button class="dash-icon-button dash-add" data-new-folder aria-label="Create a folder">${icon('plus')}</button><a class="dash-switch" href="#/">Switch student</a>${SiteSettings.buttonHTML()}<a class="dash-avatar" href="#/" aria-label="${escape(student.display)} — switch student">${student.initials}</a></div>
        </header>
        <aside class="dash-sidebar" id="dashSidebar">
          <nav aria-label="Student navigation">
            <div class="dash-nav-group">${navLink('home', 'Home')}${navLink('library', 'Your library')}</div>
            <div class="dash-nav-group"><p class="dash-nav-label">Start here</p>${navLink('cards', 'Flashcards')}${navLink('guides', 'Study Guides')}${navLink('games', 'Games')}${navLink('tests', 'Practice Tests')}</div>
            <div class="dash-nav-group"><p class="dash-nav-label">Your folders</p><div id="dashFolders">${foldersFor(who).map(folder => `<a class="dash-nav-link ${params.get('folder') === folder.id ? 'is-active' : ''}" href="${dashboardURL(who, 'folder', { folder: folder.id })}">${icon('library')}<span>${escape(folder.name)}</span></a>`).join('')}</div><button class="dash-nav-link" data-new-folder>${icon('plus')}<span>New folder</span></button></div>
          </nav>
          <div class="dash-sidebar-foot">UM-Dearborn<span>Go Blue</span></div>
        </aside>
        <div class="dash-workspace">
          <div class="dash-main-column" id="dashContent">
            ${activeTab === 'home' ? `
              <section class="dash-section" aria-labelledby="dashResumeHeading"><h1 id="dashResumeHeading">Jump back in</h1>
                <div class="dash-resume">
                  <div class="dash-resume-copy"><span class="dash-eyebrow">${recent.length ? 'LAST OPENED COURSE' : 'YOUR STUDY SPACE'}</span><h2>${escape(first.code)} · ${escape(first.name)}</h2><p>${escape(availability(first))}</p><a class="dash-button dash-primary" data-course-code="${first.code}" href="${courseURL(who, first, recent[0]?.mode || 'notes')}">${recent.length ? 'Continue' : 'Open course'} ${icon('arrow')}</a></div>
                  <div class="dash-card-stack" aria-hidden="true"><div class="dash-paper dash-paper-back"></div><div class="dash-paper dash-paper-mid">${icon('cards')}</div><div class="dash-paper dash-paper-front"><span>STUDY SPOT</span><b>Recall.<br>Review.<br>Repeat.</b><i></i></div></div>
                </div>
              </section>
              <section class="dash-section" aria-labelledby="dashRecentsHeading"><div class="dash-section-title"><h2 id="dashRecentsHeading">Recents</h2><a href="${dashboardURL(who, 'library')}">View library ${icon('arrow')}</a></div><div class="dash-recents" id="dashRecents">${recent.length ? recent.slice(0, 2).map(item => {
                const course = student.classes.find(c => c.code === item.code);
                return `<a class="dash-recent" href="${courseURL(who, course, item.mode)}" data-course-code="${course.code}"><span class="dash-recent-icon">${icon('cards')}</span><div class="dash-recent-copy"><strong>${escape(course.name)}</strong><p>${escape(course.code)} · Recently opened</p></div></a>`;
              }).join('') : `<div class="dash-empty-inline">${icon('cards')}<div><strong>A fresh start.</strong><p>Open a course and it will appear here for next time.</p></div></div>`}</div></section>
              <section class="dash-section" aria-label="Your school and courses"><p class="dash-section-label">Make this space yours</p><div class="dash-personalize"><span class="dash-school-icon">${icon('school')}</span><h2>Your courses. All in one place.</h2><p>University of Michigan-Dearborn · ${escape(student.major)}</p><a class="dash-button dash-secondary" href="${dashboardURL(who, 'library')}">Browse your courses ${icon('arrow')}</a></div></section>
              <section class="dash-section"><div class="dash-section-title"><h2>For your next study session</h2><span class="dash-muted">${student.classes.length} ${student.classes.length === 1 ? 'course' : 'courses'}</span></div><div class="dash-course-grid">${student.classes.map(c => courseTile(who, c)).join('')}</div></section>
            ` : libraryHTML(who, student, activeTab, params)}
          </div>
          <aside class="dash-right-rail" aria-label="Student profile"><div class="dash-profile-card"><span class="dash-profile-school">UNIVERSITY OF MICHIGAN<br>DEARBORN</span><div class="dash-profile-avatar">${student.initials}</div><h2>${escape(student.display)}</h2><p>${escape(student.major)}</p><div class="dash-profile-term">Fall 2026 ${icon('school')}</div></div><p class="dash-local-note">Your space, at your pace.<br>Dashboard history stays in this browser.</p></aside>
        </div>
      </div>`;
    root.querySelectorAll('a[data-course-code]').forEach(link => {
      link.addEventListener('click', () => {
        if (link.href.startsWith('https:')) recordVisit(who, link.dataset.courseCode);
      });
    });
    const shell = root.querySelector('.dash-shell');
    const toggle = root.querySelector('#dashToggle');
    const mobile = matchMedia('(max-width: 620px)');
    const resetSidebar = () => {
      shell.classList.remove('is-collapsed', 'mobile-open');
      toggle.setAttribute('aria-expanded', String(!mobile.matches));
    };
    resetSidebar();
    mobile.addEventListener('change', resetSidebar);
    resizeCleanup = () => mobile.removeEventListener('change', resetSidebar);
    toggle.onclick = () => {
      if (mobile.matches) toggle.setAttribute('aria-expanded', String(shell.classList.toggle('mobile-open')));
      else toggle.setAttribute('aria-expanded', String(!shell.classList.toggle('is-collapsed')));
    };
    root.querySelector('#dashSearchForm').onsubmit = event => {
      event.preventDefault();
      const q = root.querySelector('#dashSearch').value.trim();
      go(dashboardURL(who, 'library', q ? { q } : {}).slice(1));
    };
    root.querySelector('#dashSearch').oninput = event => {
      if (!event.target.value && params.get('q')) go(dashboardURL(who, 'library').slice(1));
    };
    root.querySelectorAll('[data-new-folder]').forEach(button => {
      button.onclick = () => openFolderDialog(root, who, student);
    });
  }
  function openFolderDialog(root, who, student) {
    const dialog = document.createElement('dialog');
    dialog.className = 'dash-folder-dialog';
    dialog.setAttribute('aria-labelledby', 'dashFolderTitle');
    dialog.innerHTML = `<form id="dashFolderForm">
      <div class="dash-dialog-title"><h2 id="dashFolderTitle">New folder</h2><button class="dash-icon-button" type="button" data-cancel aria-label="Close folder dialog">${icon('close')}</button></div>
      <label for="dashFolderName">Folder name</label><input type="text" id="dashFolderName" maxlength="60" placeholder="e.g. Midterm review" required autofocus>
      <fieldset><legend>Choose courses to include (optional)</legend>${student.classes.map(course => `<label class="dash-check"><input type="checkbox" name="courses" value="${course.code}">${escape(course.code)} · ${escape(course.name)}</label>`).join('')}</fieldset>
      <p class="dash-form-error" role="alert" id="dashFolderError"></p>
      <div class="dash-dialog-actions"><button type="button" class="dash-button dash-secondary" data-cancel>Cancel</button><button class="dash-button dash-primary" type="submit">Create folder</button></div>
    </form>`;
    root.querySelector('.dash-shell').appendChild(dialog);
    dialog.addEventListener('close', () => dialog.remove());
    dialog.querySelectorAll('[data-cancel]').forEach(button => { button.onclick = () => dialog.close(); });
    const nameInput = dialog.querySelector('#dashFolderName');
    nameInput.oninput = () => nameInput.setCustomValidity('');
    dialog.querySelector('form').onsubmit = event => {
      event.preventDefault();
      const name = nameInput.value.trim();
      if (!name) { nameInput.setCustomValidity('Enter a folder name.'); nameInput.reportValidity(); return; }
      const folder = { id: crypto.randomUUID(), name, courses: [...dialog.querySelectorAll('input[name="courses"]:checked')].map(input => input.value) };
      if (!saveList(who, 'folders', [...foldersFor(who), folder])) {
        dialog.querySelector('#dashFolderError').textContent = 'This browser could not save the folder. Check storage permissions or free some space.';
        return;
      }
      dialog.close();
      go(dashboardURL(who, 'folder', { folder: folder.id }).slice(1));
    };
    dialog.showModal();
  }
  function handleKeydown(event) {
    if (!current || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    if (current.root.querySelector('dialog[open]')) return;
    const editable = event.target.closest('input, textarea, select, [contenteditable="true"]');
    if (event.key === '/' && !editable) {
      event.preventDefault();
      current.root.querySelector('#dashSearch').focus();
    } else if (event.key === 'Escape') {
      const search = current.root.querySelector('#dashSearch');
      search.value = '';
      if (current.params.get('q')) go(dashboardURL(current.who, 'library').slice(1));
      const shell = current.root.querySelector('.dash-shell');
      if (shell.classList.contains('mobile-open')) {
        shell.classList.remove('mobile-open');
        const toggle = current.root.querySelector('#dashToggle');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    } else if (event.key === 'g' && !editable) {
      event.preventDefault();
      go(`/u/${current.who}`);
    }
  }
  function libraryHTML(who, student, tab, params) {
    const names = { library: 'Your library', cards: 'Flashcards', guides: 'Study Guides', games: 'Games', tests: 'Practice Tests', folder: 'Your folder' };
    const modes = { cards: 'cards', guides: 'notes', tests: 'flash' };
    const query = (params.get('q') || '').trim().toLowerCase();
    const folder = tab === 'folder' ? foldersFor(who).find(item => item.id === params.get('folder')) : null;
    const courses = student.classes.filter(c => (tab !== 'folder' || folder?.courses.includes(c.code)) && (!modes[tab] || c.hasHub || c.code === 'ACC-289' || (c.code === 'MATH-215' && tab !== 'cards')) && (!query || (c.code + ' ' + c.name).toLowerCase().includes(query)));
    return `<section class="dash-section"><h1>${escape(folder?.name || names[tab] || 'Your library')}</h1><p class="dash-page-sub">${tab === 'library' ? 'Your course collection. Pick up wherever you left off.' : tab === 'folder' ? (folder ? 'Your saved course collection · stored in this browser.' : 'This folder is not available for this student.') : 'Choose a course to open its study materials.'}</p>
      ${tab === 'games' ? '<div class="dash-empty-panel"><h2>Room for a little friendly practice.</h2><p>Study games are not available yet. Your existing materials are in Your library.</p></div>' : `<div class="dash-course-grid dash-library-grid">${courses.map(c => courseTile(who, c, modes[tab] || 'notes')).join('') || '<div class="dash-empty-panel"><h2>No matching materials yet</h2><p>Try another course name, or browse Your library.</p></div>'}</div>`}
      ${who !== 'dylan' && who !== 'charlie' && who !== 'cooper' ? '<p class="dash-data-note">Existing course list carried over from the first version; schedule confirmation is still needed.</p>' : ''}
      <p class="dash-data-note">Study tools are from the existing site. Physics content and grading still need the repair pass identified in our audit.</p>
    </section>`;
  }
  return { render, recordVisit, handleKeydown };
})();
