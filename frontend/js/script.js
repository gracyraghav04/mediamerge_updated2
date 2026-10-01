/* MediaMerge - shared script.
   Change VIDEOS / TABLES to plug in backend data later (e.g. fetch('/api/videos')). */
const ROOT = document.body.dataset.base || '';
const P = (f) => ROOT + 'pages/' + f;
const IMG = (f) => ROOT + 'assets/images/' + f;

const VIDEOS = [
  { id:'neon-boulevard', title:'Neon Boulevard', category:'Movies', duration:'1:46:18', year:2026, rating:'PG-13', views:'1.8M', img:'video01.jpg', featured:true, trending:true, recommended:true, added:1, desc:'A night courier follows a glowing trail through a rain-soaked city district.' },
  { id:'after-midnight', title:'After Midnight', category:'Series', duration:'52:14', year:2025, rating:'TV-14', views:'1.2M', img:'video02.jpg', featured:true, trending:true, recommended:true, added:2, desc:'Four strangers cross paths after the city falls quiet.' },
  { id:'empty-crossroads', title:'Empty Crossroads', category:'Documentary', duration:'44:08', year:2024, rating:'TV-G', views:'684K', img:'video03.jpg', featured:false, trending:true, recommended:true, added:3, desc:'A visual journey through cities that transform after dark.' },
  { id:'rain-city', title:'Rain City', category:'Anime', duration:'28:36', year:2026, rating:'TV-14', views:'2.1M', img:'video04.jpg', featured:true, trending:false, recommended:true, added:4, desc:'A young artist discovers a hidden story in the reflections of a midnight street.' },
  { id:'starlight-frontier', title:'Starlight Frontier', category:'Documentary', duration:'48:22', year:2025, rating:'TV-G', views:'912K', img:'video05.jpg', featured:true, trending:true, recommended:true, added:5, desc:'Researchers chase the darkest skies in search of the Milky Way.' },
  { id:'under-the-milky-way', title:'Under the Milky Way', category:'Series', duration:'39:44', year:2024, rating:'TV-PG', views:'755K', img:'video06.jpg', featured:false, trending:true, recommended:true, added:6, desc:'A quiet observatory becomes the meeting point for an unlikely group of dreamers.' },
  { id:'deep-sky', title:'Deep Sky', category:'Documentary', duration:'51:07', year:2023, rating:'TV-G', views:'1.1M', img:'video07.jpg', featured:true, trending:false, recommended:true, added:7, desc:'How modern cameras reveal structure hidden inside the night sky.' },
  { id:'midnight-lake', title:'Midnight Lake', category:'Movies', duration:'1:32:09', year:2025, rating:'PG', views:'1.5M', img:'video08.jpg', featured:false, trending:true, recommended:true, added:8, desc:'A family reunion unfolds beside a lake beneath an unforgettable sky.' },
  { id:'last-screening', title:'The Last Screening', category:'Movies', duration:'1:58:03', year:2024, rating:'PG-13', views:'2.4M', img:'video09.jpg', featured:true, trending:true, recommended:true, added:9, desc:'A projectionist prepares one final show in a historic cinema.' },
  { id:'red-curtain', title:'Red Curtain', category:'Series', duration:'46:51', year:2025, rating:'TV-14', views:'1.7M', img:'video10.jpg', featured:false, trending:true, recommended:true, added:10, desc:'Backstage rivalries collide on opening night.' },
  { id:'silver-hall', title:'Silver Hall', category:'Documentary', duration:'36:18', year:2023, rating:'TV-G', views:'503K', img:'video11.jpg', featured:false, trending:false, recommended:true, added:11, desc:'Inside the architecture and craft behind classic movie theaters.' },
  { id:'midnight-cinema', title:'Midnight Cinema', category:'Anime', duration:'31:26', year:2026, rating:'TV-PG', views:'1.9M', img:'video12.jpg', featured:true, trending:false, recommended:true, added:12, desc:"A mysterious late-night screening changes the course of a young filmmaker's life." },
  { id:'shadow-peak', title:'Shadow Peak', category:'Documentary', duration:'49:55', year:2024, rating:'TV-G', views:'1.0M', img:'video13.jpg', featured:true, trending:true, recommended:true, added:13, desc:'Climbers and rangers document a remote mountain ecosystem.' },
  { id:'mistwood', title:'Mistwood', category:'Movies', duration:'1:41:27', year:2025, rating:'PG-13', views:'1.3M', img:'video14.jpg', featured:false, trending:true, recommended:true, added:14, desc:'A stranded traveler follows a trail into a forest wrapped in fog.' },
  { id:'cloud-valley', title:'Cloud Valley', category:'Series', duration:'42:12', year:2024, rating:'TV-PG', views:'822K', img:'video15.jpg', featured:false, trending:false, recommended:true, added:15, desc:'A mountain community rebuilds after a season of relentless storms.' },
  { id:'beyond-the-ridge', title:'Beyond the Ridge', category:'Anime', duration:'25:48', year:2026, rating:'TV-PG', views:'1.6M', img:'video16.jpg', featured:true, trending:false, recommended:true, added:16, desc:'A young explorer searches for the place marked only on an old hand-drawn map.' },
  { id:'neon-district', title:'Neon District', category:'Movies', duration:'2:02:16', year:2025, rating:'TV-14', views:'3.4M', img:'video17.jpg', featured:true, trending:true, recommended:true, added:17, desc:'A detective tracks a signal through a futuristic entertainment district.' },
  { id:'electric-rain', title:'Electric Rain', category:'Series', duration:'54:20', year:2026, rating:'TV-14', views:'2.8M', img:'video18.jpg', featured:false, trending:true, recommended:true, added:18, desc:'Every storm reveals another layer of a citywide conspiracy.' },
  { id:'blue-hour', title:'Blue Hour', category:'Documentary', duration:'40:32', year:2024, rating:'TV-G', views:'730K', img:'video19.jpg', featured:false, trending:false, recommended:true, added:19, desc:'Photographers chase the brief blue glow between night and morning.' },
  { id:'afterglow-avenue', title:'Afterglow Avenue', category:'Anime', duration:'27:11', year:2026, rating:'TV-14', views:'2.2M', img:'video20.jpg', featured:true, trending:true, recommended:true, added:20, desc:'A neon-lit avenue becomes the stage for an unexpected reunion.' }
];

/* Hot Takes of the Week (landing page). Demo data - replace with fetch('/api/hot-takes') later. */
const HOT_TAKES = [
  { id:'neon-district', who:'Priya S.', handle:'@priya_reels', take:'Neon District proves a detective story can be a full sensory experience. The sound design alone deserves an award.', likes:'4.2K', replies:318 },
  { id:'electric-rain', who:'Marcus T.', handle:'@marcus_frames', take:'Electric Rain is the first series in years where I needed the next episode immediately. Season two cannot come fast enough.', likes:'3.7K', replies:254 },
  { id:'rain-city', who:'Aiko N.', handle:'@aiko_draws', take:'Rain City does more with one midnight street than most anime manage with a whole season. Every reflection tells a story.', likes:'3.1K', replies:187 },
  { id:'last-screening', who:'Daniel R.', handle:'@dan_at_the_movies', take:'The Last Screening is a love letter to cinema, and the final ten minutes will make you want to go back to a real theater.', likes:'2.8K', replies:203 },
  { id:'starlight-frontier', who:'Fatima K.', handle:'@fatima_looks_up', take:'Starlight Frontier is the rare documentary that makes you put your phone down and just look at the sky. Stunning work.', likes:'2.2K', replies:96 }
];

/* Dashboard demo data (single Content Owner dashboard). Replace with fetch('/api/...') later. */
const OWNER_ASSETS = [
  ['Salt & Circuit','Anime','In Review','–','Mar 18, 2025'],
  ['Neon Harbor','Movies','Published','1.3M','Mar 14, 2025'],
  ['Crimson Signal — Season 2','Series','Published','3.1M','Mar 02, 2025'],
  ['Deep Field','Documentary','Published','1.2M','Feb 21, 2025'],
  ['Paper Lanterns','Anime','Published','4.5M','Feb 10, 2025'],
  ['Midnight Terminal','Movies','Published','892K','Jan 28, 2025'],
  ['Static Bloom','Series','Published','734K','Jan 15, 2025'],
  ['The Last Cartographer','Documentary','Draft','–','Jan 04, 2025']
];
const TABLES = {
  ownerRecent: { head:['Title','Category','Status','Views','Updated'], rows: OWNER_ASSETS.slice(0, 5) },
  ownerAssets: { head:['Title','Category','Status','Views','Updated'], rows: OWNER_ASSETS },
  collections: { head:['Collection','Assets','Visibility','Updated'], rows:[
    ['Harborlight Originals','12','Published','Mar 14, 2025'],
    ['Anime Spotlight','6','Published','Mar 18, 2025'],
    ['Documentary Archive','4','Published','Feb 21, 2025'],
    ['Festival Selections','5','Private','Jan 28, 2025'],
    ['Season Bundles','3','Draft','Jan 04, 2025']] },
  metadata: { head:['Asset','Genre','Language','Runtime','Completeness'], rows:[
    ['Salt & Circuit','Cyberpunk','Japanese','24 min','Needs Info'],
    ['Neon Harbor','Thriller','English','1h 46m','Complete'],
    ['Crimson Signal — Season 2','Crime Drama','English','8 × 52m','Complete'],
    ['Deep Field','Science','English','51 min','Complete'],
    ['Paper Lanterns','Fantasy','Japanese','26 min','Complete'],
    ['Midnight Terminal','Mystery','English','1h 32m','Needs Info'],
    ['Static Bloom','Drama','Spanish','6 × 44m','Complete'],
    ['The Last Cartographer','Adventure','English','–','Needs Info']] },
  licenses: { head:['Asset','Territory','Expires','Status'], rows:[
    ['Neon Harbor','Worldwide','Dec 2027','Active'],
    ['Crimson Signal — Season 2','US, CA, UK','Jun 2027','Active'],
    ['Midnight Terminal','EU, IN','Nov 2026','Expiring'],
    ['Deep Field','Worldwide','Mar 2028','Active'],
    ['Paper Lanterns','JP, KR, SEA','Sep 2027','Active']] },
  review: { head:['Asset','Submitted','Reviewer','Status','Clearance'], rows:[
    ['Salt & Circuit','Mar 18, 2025','Priya Nair','In Review','~18h'],
    ['Aurora Protocol','Mar 18, 2025','Marcus Lee','In Review','~12h'],
    ['Velvet Static','Mar 19, 2025','Priya Nair','In Review','~20h'],
    ['Neon Harbor','Mar 12, 2025','Marcus Lee','Approved','14h'],
    ['Paper Lanterns','Feb 08, 2025','Aiko Tanaka','Approved','16h'],
    ['Midnight Terminal','Jan 25, 2025','Marcus Lee','Changes Requested','–']] },
  analytics: { head:['Asset','Category','Views','Watch Time','Completion'], rows:[
    ['Paper Lanterns','Anime','4.5M','1.6M hrs','82%'],
    ['Crimson Signal — Season 2','Series','3.1M','1.9M hrs','71%'],
    ['Neon Harbor','Movies','1.3M','1.7M hrs','76%'],
    ['Deep Field','Documentary','1.2M','694K hrs','68%'],
    ['Midnight Terminal','Movies','892K','873K hrs','64%']] },
  team: { head:['Member','Role','Access','Status'], rows:[
    ['Sana Iyer','Head of Content','Full access','Active'],
    ['Rohan Mehta','Rights Manager','Rights & Licenses','Active'],
    ['Priya Nair','Content Reviewer','Content Review','Active'],
    ['Jordan Blake','Metadata Editor','Metadata','Pending']] }
};
const ACTIVITY = {
  owner: [['Salt & Circuit sent for review','Mar 18, 2025'],['Neon Harbor reached 1.3M views','Mar 14, 2025'],['Crimson Signal — Season 2 published','Mar 02, 2025'],['License renewed for Deep Field','Feb 21, 2025'],['Paper Lanterns reached 4.5M views','Feb 10, 2025']]
};

/* ---------- helpers ---------- */
const getUser = () => { try { return JSON.parse(localStorage.getItem('mm_user')); } catch (e) { return null; } };
const $ = (s) => document.querySelector(s);
const LOGO = '<span class="logo"><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="3"/><path d="m10 8.5 5 3.5-5 3.5z"/></svg></span><span>Media<b>Merge</b></span>';

/* ---------- theme switching (dark / light, remembered in localStorage) ---------- */
const THEME_ICONS = '<svg class="i-moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const getTheme = () => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('mm_theme', t); } catch (e) {}
  document.querySelectorAll('.theme-btn').forEach((b) => {
    b.title = t === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    b.setAttribute('aria-label', b.title);
  });
}
function themeButton(label) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'theme-btn';
  b.innerHTML = THEME_ICONS + (label ? '<span>Switch theme</span>' : '');
  b.onclick = () => setTheme(getTheme() === 'light' ? 'dark' : 'light');
  return b;
}
function initTheme() {
  const nav = $('.nav-auth'), slot = $('#theme-slot'), auth = $('.auth-page');
  if (nav) nav.prepend(themeButton());
  if (slot) slot.replaceWith(themeButton(true));
  if (auth) { const b = themeButton(); b.classList.add('theme-float'); auth.appendChild(b); }
  setTheme(getTheme());
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

/* One reusable video card used on every page.
   opts.progress -> progress bar + "% watched", opts.remove -> round x button (used by My Library) */
function videoCard(v, opts = {}) {
  const pct = opts.progress == null ? '' : ` &middot; ${opts.progress}% watched`;
  return `<a class="vcard" href="${P('watch.html')}?id=${v.id}">
    <div class="thumb"><img src="${IMG(v.img)}" alt="${esc(v.title)}" loading="lazy">
      <span class="tag">${v.category}</span>${opts.remove ? `<button class="x-btn" type="button" data-remove="${v.id}" aria-label="Remove ${esc(v.title)}">&times;</button>` : '<span class="play">&#9654;</span>'}<span class="dur">${v.duration}</span>
      ${opts.progress == null ? '' : `<div class="progress"><i style="width:${opts.progress}%"></i></div>`}</div>
    <div class="vinfo"><h3>${esc(v.title)}</h3><p>${v.year} &middot; ${v.rating} &middot; ${v.views} views${pct}</p></div></a>`;
}

/* ---------- library state (demo: kept in localStorage) ---------- */
const LIB_KEY = 'mm_library';
const LIB_SEED = {
  continue: [{ id:'neon-boulevard', pct:68 }, { id:'after-midnight', pct:34 }, { id:'empty-crossroads', pct:12 }, { id:'rain-city', pct:5 }],
  saved: ['rain-city', 'deep-sky', 'cloud-valley', 'neon-district'],
  history: ['neon-boulevard', 'after-midnight', 'empty-crossroads', 'rain-city']
};
function getLib() {
  try { const l = JSON.parse(localStorage.getItem(LIB_KEY)); if (l && l.continue && l.saved && l.history) return l; } catch (e) {}
  return JSON.parse(JSON.stringify(LIB_SEED));
}
function saveLib(l) { try { localStorage.setItem(LIB_KEY, JSON.stringify(l)); } catch (e) {} }
const byId = (id) => VIDEOS.find((v) => v.id === id);

/* ---------- shared navbar + footer ---------- */
function renderNav() {
  const el = $('#site-nav'); if (!el) return;
  const page = document.body.dataset.page, u = getUser();
  const link = (href, label, key) => `<a class="nav-link-mm ${page === key ? 'active' : ''}" href="${href}">${label}</a>`;
  const auth = u
    ? `<span class="user-name">${esc(u.name)}</span><a class="btn-ghost" href="#" id="logout">Logout</a>`
    : `<a class="btn-ghost" href="${P('login.html')}">Login</a><a class="btn-mm" href="${P('signup.html')}">Sign Up</a>`;
  el.innerHTML = `<header class="navbar-mm"><div class="wrap nav-in">
    <a class="brand" href="${ROOT}index.html">${LOGO}</a>
    <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
    <nav class="nav-menu" id="navMenu">
      ${link(u ? P('viewer.html') : ROOT + 'index.html', 'Home', 'home')}${link(P('browse.html'), 'Browse', 'browse')}${link(P('library.html'), 'My Library', 'library')}
      <div class="nav-auth">${auth}</div></nav></div></header>`;
  $('#navToggle').onclick = () => $('#navMenu').classList.toggle('open');
  const lo = $('#logout');
  if (lo) lo.onclick = (e) => { e.preventDefault(); localStorage.removeItem('mm_user'); location.href = ROOT + 'index.html'; };
}

function renderFooter() {
  const el = $('#site-footer'); if (!el) return;
  el.innerHTML = `<footer class="footer"><div class="wrap">
    <div class="foot-grid">
      <div><a class="brand" href="${ROOT}index.html">${LOGO}</a>
        <p class="muted mt">A digital media management and authorized streaming platform. Every title is licensed, rights-cleared and accounted for.</p></div>
      <div><h4>Platform</h4><a href="${ROOT}index.html">Home</a><a href="${P('browse.html')}">Browse</a><a href="${P('library.html')}">My Library</a></div>
      <div><h4>Creators</h4><a href="${P('dashboard.html')}">Content Owner Dashboard</a><a href="${P('signup.html')}">Become a Creator</a></div>
      <div><h4>Company</h4><a href="#">About</a><a href="#">Careers</a><a href="#">Contact</a></div>
      <div><h4>Legal</h4><a href="#">Terms of Service</a><a href="#">Privacy Policy</a><a href="#">DMCA</a></div>
    </div>
    <div class="foot-bottom"><span>&copy; 2026 MediaMerge Media Systems, Inc. All rights reserved.</span><span><i class="dot"></i> All systems operational</span></div></div></footer>`;
}

/* ---------- video lists (used by data-list="..." on any grid) ---------- */
const LISTS = {
  featured: () => VIDEOS.filter((v) => v.featured),
  trending: () => VIDEOS.filter((v) => v.trending),
  recent: () => [...VIDEOS].sort((a, b) => a.added - b.added),
  recommended: () => VIDEOS.filter((v) => v.recommended).sort((a, b) => a.added - b.added),
  all: () => VIDEOS
};

function renderLists() {
  document.querySelectorAll('[data-list]').forEach((box) => {
    const limit = +box.dataset.limit || 99;
    box.innerHTML = LISTS[box.dataset.list]().slice(0, limit).map((v) => videoCard(v)).join('');
  });
}

/* ---------- browse page: search + filters, supports ?filter=trending ---------- */
function initBrowse() {
  const grid = $('#browse-grid'); if (!grid) return;
  const params = new URLSearchParams(location.search);
  const state = { q: params.get('q') || '', filter: params.get('filter') || 'all', category: params.get('category') || 'All' };
  const search = $('#search-input'); search.value = state.q;
  const cats = ['All', 'Movies', 'Series', 'Anime', 'Documentary'];
  const filters = [['all', 'All'], ['featured', 'Featured'], ['trending', 'Trending'], ['recent', 'Recently Added']];
  const chips = (list, key, box) => {
    $(box).innerHTML = list.map((c) => {
      const [val, label] = Array.isArray(c) ? c : [c, c];
      return `<button class="chip ${state[key] === val ? 'active' : ''}" data-v="${val}">${label}</button>`;
    }).join('');
    $(box).onclick = (e) => { if (e.target.dataset.v) { state[key] = e.target.dataset.v; draw(); } };
  };
  function draw() {
    chips(cats, 'category', '#cat-chips'); chips(filters, 'filter', '#filter-chips');
    let list = (LISTS[state.filter] || LISTS.all)();
    if (state.category !== 'All') list = list.filter((v) => v.category === state.category);
    if (state.q) list = list.filter((v) => (v.title + ' ' + v.category + ' ' + v.desc).toLowerCase().includes(state.q.toLowerCase()));
    grid.innerHTML = list.length ? list.map((v) => videoCard(v)).join('') : '<p class="muted">No videos match your search.</p>';
    $('#result-count').textContent = `Showing ${list.length} of ${VIDEOS.length} titles`;
  }
  search.oninput = () => { state.q = search.value; draw(); };
  draw();
}

/* ---------- library page: continue watching / saved / history ---------- */
function initLibrary() {
  const cont = $('#lib-continue'); if (!cont) return;
  const draw = () => {
    const lib = getLib();
    const fill = (box, items, html, msg) => { box.innerHTML = items.length ? items.map(html).join('') : `<p class="empty">${msg}</p>`; };
    fill(cont, lib.continue.filter((c) => byId(c.id)), (c) => videoCard(byId(c.id), { progress: c.pct }), 'Nothing in progress. Start a video and it will show up here.');
    fill($('#lib-saved'), lib.saved.filter(byId), (id) => videoCard(byId(id), { remove: true }), 'No saved videos yet. Use “Save to library” on any watch page.');
    fill($('#lib-history'), lib.history.filter(byId), (id) => videoCard(byId(id)), 'Your watch history is empty.');
  };
  $('#lib-saved').onclick = (e) => {
    const b = e.target.closest('[data-remove]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const lib = getLib(); lib.saved = lib.saved.filter((id) => id !== b.dataset.remove); saveLib(lib); draw();
  };
  $('#clear-history').onclick = () => { const lib = getLib(); lib.history = []; saveLib(lib); draw(); };
  draw();
}

/* ---------- watch page: watch.html?id=crimson-signal ---------- */
function initWatch() {
  const box = $('#watch-box'); if (!box) return;
  const id = new URLSearchParams(location.search).get('id');
  const v = VIDEOS.find((x) => x.id === id) || VIDEOS[0];
  document.title = v.title + ' | MediaMerge';
  box.innerHTML = `<a class="back" href="${P('browse.html')}">&larr; Back to Browse</a>
    <div class="player"><video controls poster="${IMG(v.img)}" preload="metadata"><source src="${ROOT}assets/videos/video.mp4" type="video/mp4">Your browser does not support video.</video></div>
    <h1 class="watch-title">${esc(v.title)}</h1>
    <p class="meta"><span class="tag static">${v.category}</span> ${v.year} &middot; ${v.rating} &middot; ${v.duration} &middot; ${v.views} views</p>
    <p class="desc">${esc(v.desc)}</p>
    <div class="watch-actions"><button class="btn-ghost" id="save-btn" type="button"></button></div>`;

  /* save / unsave */
  const saveBtn = $('#save-btn');
  const paintSave = () => { const on = getLib().saved.includes(v.id); saveBtn.textContent = on ? '\u2713 Saved to library' : '+ Save to library'; saveBtn.classList.toggle('on', on); };
  saveBtn.onclick = () => {
    const lib = getLib();
    lib.saved = lib.saved.includes(v.id) ? lib.saved.filter((x) => x !== v.id) : [v.id, ...lib.saved];
    saveLib(lib); paintSave();
  };
  paintSave();

  /* history + continue-watching progress */
  const lib0 = getLib(); lib0.history = [v.id, ...lib0.history.filter((x) => x !== v.id)].slice(0, 12); saveLib(lib0);
  const vid = $('.player video');
  vid.addEventListener('loadedmetadata', () => {
    const c = getLib().continue.find((x) => x.id === v.id);
    if (c && c.pct > 0 && c.pct < 95 && vid.duration) vid.currentTime = vid.duration * c.pct / 100;
  });
  let lastSave = 0;
  vid.addEventListener('timeupdate', () => {
    if (!vid.duration || Date.now() - lastSave < 1000) return; lastSave = Date.now();
    const pct = Math.round(vid.currentTime / vid.duration * 100), lib = getLib();
    lib.continue = lib.continue.filter((x) => x.id !== v.id);
    if (pct < 95) lib.continue.unshift({ id: v.id, pct });
    saveLib(lib);
  });

  const others = VIDEOS.filter((x) => x.id !== v.id);
  const related = others.filter((x) => x.category === v.category).concat(others.filter((x) => x.category !== v.category));
  $('#related').innerHTML = related.slice(0, 4).map((x) => videoCard(x)).join('');
}

/* ---------- login / signup (demo only: saves user in the browser) ---------- */
function initAuth() {
  const login = $('#login-form'), signup = $('#signup-form');
  const msg = (t) => { $('#form-msg').textContent = t; };
  if (login) login.onsubmit = (e) => {
    e.preventDefault();
    const email = $('#login-email').value.trim(), saved = getUser();
    const same = saved && saved.email === email;
    const role = email.startsWith('admin') ? 'content-owner' : (same ? saved.role : 'viewer');
    localStorage.setItem('mm_user', JSON.stringify({ name: same ? saved.name : email.split('@')[0], email, role }));
    location.href = role === 'content-owner' ? 'dashboard.html' : 'viewer.html';
  };
  if (signup) signup.onsubmit = (e) => {
    e.preventDefault();
    if ($('#signup-password').value.length < 6) return msg('Password must be at least 6 characters.');
    if ($('#signup-password').value !== $('#confirm-password').value) return msg('Passwords do not match.');
    const role = signup.querySelector('input[name=role]:checked').value;
    localStorage.setItem('mm_user', JSON.stringify({ name: $('#signup-name').value.trim(), email: $('#signup-email').value.trim(), role }));
    location.href = role === 'content-owner' ? 'dashboard.html' : 'viewer.html';
  };
}

/* ---------- Content Owner dashboard (single dashboard for the agency) ---------- */
const ICONS = {
  grid:'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  table:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M12 3v18"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>',
  card:'<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  flag:'<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  megaphone:'<path d="m3 11 18-5v12L3 14z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 15v3M12 10v8M17 6v12"/>',
  review:'<path d="m9 11 3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>',
  building:'<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>'
};
const DASH = {
  owner: {
    nav: [['overview','Overview','grid'],['assets','My Assets','table'],['upload','Upload Content','upload'],['collections','Collections','layers'],['metadata','Metadata','tag'],['licenses','Rights &amp; Licenses','shield'],['review','Content Review','review'],['analytics','Analytics','chart'],['profile','Organization / Profile','building']],
    links: [['Back to Site', ROOT + 'index.html','globe','']],
    name: 'Harborlight Studios', role: 'Content Owner', match: 'content-owner'
  }
};
const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'U';

function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200);
}

function statusBadge(t) {
  const map = { Published:'ok', Active:'ok', 'In Review':'warn', 'Under Review':'warn', Pending:'warn', Expiring:'warn', Draft:'mute', Private:'mute', Complete:'ok', Approved:'ok', 'Needs Info':'warn', 'Changes Requested':'warn' };
  return map[t] ? `<span class="badge ${map[t]}">${t}</span>` : esc(t);
}
function tableHTML(t, rows) {
  return `<div class="table-wrap"><table><thead><tr>${t.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${
    rows.length ? rows.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="strong"' : ''}>${statusBadge(c)}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${t.head.length}" class="muted">Nothing to show.</td></tr>`}</tbody></table></div>`;
}
const assetFilter = { value: 'All' };
function renderTables() {
  document.querySelectorAll('[data-table]').forEach((box) => {
    const key = box.dataset.table, t = TABLES[key];
    const rows = key === 'ownerAssets' && assetFilter.value !== 'All' ? t.rows.filter((r) => r[2] === assetFilter.value) : t.rows;
    box.innerHTML = tableHTML(t, rows);
  });
  const chips = $('#asset-filter');
  if (chips) {
    chips.innerHTML = ['All', 'Published', 'In Review', 'Draft'].map((c) => `<button class="chip ${assetFilter.value === c ? 'active' : ''}" data-f="${c}" type="button">${c}</button>`).join('');
    chips.onclick = (e) => { if (e.target.dataset.f) { assetFilter.value = e.target.dataset.f; renderTables(); } };
  }
  document.querySelectorAll('[data-activity]').forEach((ul) => {
    ul.innerHTML = ACTIVITY[ul.dataset.activity].map(([txt, when]) => `<li><i class="adot"></i><span>${esc(txt)}</span><time>${when}</time></li>`).join('');
  });
}

function exportAssetsCSV() {
  const t = TABLES.ownerAssets, q = (c) => '"' + String(c).replace(/"/g, '""') + '"';
  const csv = [t.head, ...t.rows].map((r) => r.map(q).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'mediamerge-assets.csv';
  document.body.appendChild(a); a.click(); a.remove();
}

function initDash() {
  const kind = document.body.dataset.dash, side = $('#side'); if (!kind || !side) return;
  const cfg = DASH[kind], u = getUser();
  const name = u && u.role === cfg.match && u.name ? u.name : cfg.name;
  const views = [...document.querySelectorAll('[data-view]')];

  side.innerHTML = `<a class="brand" href="${ROOT}index.html">${LOGO}</a><hr>
    <nav class="side-nav">${cfg.nav.map(([id, label, ic]) => `<a class="s" href="#${id}" data-go="${id}">${icon(ic)}<span>${label}</span></a>`).join('')}</nav>
    <div class="bottom"><hr>
      ${cfg.links.map(([label, href, ic, cls]) => `<a class="s ${cls}" href="${href}">${icon(ic)}<span>${label}</span></a>`).join('')}
      <span id="theme-slot"></span>
      <a class="s" href="#" id="dash-logout">${icon('logout')}<span>Logout</span></a></div>
    <div class="user-card"><span class="avatar">${esc(initials(name))}</span><div><strong>${esc(name)}</strong><span>${cfg.role}</span></div></div>`;
  document.querySelectorAll('[data-name]').forEach((el) => { if (el.tagName === 'INPUT') el.value = name; else el.textContent = name; });

  // icon sprite for the <use> icons used in the page body
  const sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sprite.setAttribute('style', 'display:none');
  sprite.innerHTML = Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('');
  document.body.prepend(sprite);

  const go = (id) => {
    if (!views.some((v) => v.dataset.view === id)) id = cfg.nav[0][0];
    views.forEach((v) => { v.hidden = v.dataset.view !== id; });
    side.querySelectorAll('.side-nav a').forEach((a) => a.classList.toggle('active', a.dataset.go === id));
    if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
    window.scrollTo(0, 0);
  };
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.dataset.go); return; }
    const act = e.target.closest('[data-action]'); if (!act) return;
    const a = act.dataset.action;
    if (a === 'review') go('review');
    if (a === 'upload') go('upload');
    if (a === 'export') { exportAssetsCSV(); toast('Report exported: mediamerge-assets.csv'); }
    if (a === 'rights') go('licenses');
  });
  window.addEventListener('hashchange', () => go(location.hash.slice(1)));
  go(location.hash.slice(1));

  const lo = $('#dash-logout');
  lo.onclick = (e) => { e.preventDefault(); localStorage.removeItem('mm_user'); location.href = 'login.html'; };
  const up = $('#upload-form');
  if (up) up.onsubmit = (e) => { e.preventDefault(); $('#upload-msg').textContent = 'Asset submitted for review (demo).'; up.reset(); };
  const pf = $('#profile-form');
  if (pf) pf.onsubmit = (e) => { e.preventDefault(); toast('Profile saved (demo)'); };
}

/* ---------- landing page: Hot Takes of the Week ---------- */
const TAKE_ICONS = {
  up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
};
function renderHotTakes() {
  document.querySelectorAll('[data-hot]').forEach((box) => {
    box.innerHTML = HOT_TAKES.filter((t) => byId(t.id)).map((t, i) => {
      const v = byId(t.id);
      return `<article class="take">
        <span class="take-rank">${String(i + 1).padStart(2, '0')}</span>
        <a class="take-thumb" href="${P('watch.html')}?id=${v.id}" aria-label="Watch ${esc(v.title)}"><img src="${IMG(v.img)}" alt="${esc(v.title)}" loading="lazy"></a>
        <div class="take-body">
          <p class="take-text">&ldquo;${esc(t.take)}&rdquo;</p>
          <div class="take-meta"><span class="avatar sm">${esc(initials(t.who))}</span><strong>${esc(t.who)}</strong><span>${esc(t.handle)}</span><span>&middot; on <a href="${P('watch.html')}?id=${v.id}">${esc(v.title)}</a></span></div>
        </div>
        <div class="take-stats"><span>${TAKE_ICONS.up}${t.likes}</span><span>${TAKE_ICONS.chat}${t.replies}</span></div>
      </article>`;
    }).join('');
  });
}

/* ---------- viewer home (pages/viewer.html): hero + trailer carousel + release posters ---------- */
const VH_ICONS = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>',
  vol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
  mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/></svg>',
  left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>'
};
function initViewerHome() {
  const hero = $('#vhero'); if (!hero) return;
  const list = [...VIDEOS].sort((a, b) => (b.featured - a.featured) || (b.trending - a.trending) || (a.added - b.added)).slice(0, 12);
  const track = $('#tr-track'), vid = $('#vh-video'), playBtn = $('#vh-play'), muteBtn = $('#vh-mute'), fav = $('#vh-fav');
  let idx = 0;

  $('#tr-prev').innerHTML = VH_ICONS.left; $('#tr-next').innerHTML = VH_ICONS.right;
  $('#po-prev').innerHTML = VH_ICONS.left; $('#po-next').innerHTML = VH_ICONS.right;

  track.innerHTML = list.map((v, i) => `<button class="tcard" type="button" data-i="${i}" aria-label="${esc(v.title)}">
    <img src="${IMG(v.img)}" alt="" loading="lazy"><span class="now">Now Playing</span>
    <span class="tc-info"><strong>${esc(v.title)}</strong><span class="tc-meta"><span>${v.duration}</span><em>${v.category}</em></span></span></button>`).join('');
  const cards = [...track.children];

  const paintPreview = () => {
    const on = hero.classList.contains('playing');
    playBtn.innerHTML = on ? VH_ICONS.pause : VH_ICONS.play;
    playBtn.title = on ? 'Pause preview' : 'Play preview'; playBtn.setAttribute('aria-label', playBtn.title);
    muteBtn.innerHTML = vid.muted ? VH_ICONS.mute : VH_ICONS.vol;
    muteBtn.title = vid.muted ? 'Unmute preview' : 'Mute preview'; muteBtn.setAttribute('aria-label', muteBtn.title);
  };
  const stopPreview = () => { vid.pause(); vid.currentTime = 0; hero.classList.remove('playing'); paintPreview(); };
  const paintFav = (v) => { const on = getLib().saved.includes(v.id); fav.textContent = on ? '\u2713 Favorited' : '+ Favorite'; fav.classList.toggle('on', on); };

  function select(i, scroll) {
    idx = Math.max(0, Math.min(list.length - 1, i));
    const v = list[idx];
    stopPreview();
    const bg = $('#vh-bg'); bg.style.backgroundImage = `url("${IMG(v.img)}")`;
    bg.style.animation = 'none'; void bg.offsetWidth; bg.style.animation = '';
    $('#vh-title').textContent = v.title;
    $('#vh-meta').textContent = `${v.category} \u00b7 ${v.year} \u00b7 ${v.rating} \u00b7 ${v.duration}`;
    $('#vh-desc').textContent = v.desc;
    $('#vh-watch').href = `${P('watch.html')}?id=${v.id}`;
    $('#vh-count').textContent = `${idx + 1}/${list.length}`;
    $('#tr-prev').disabled = idx === 0; $('#tr-next').disabled = idx === list.length - 1;
    cards.forEach((c, n) => { c.classList.toggle('active', n === idx); c.setAttribute('aria-current', n === idx ? 'true' : 'false'); });
    paintFav(v);
    if (scroll) cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  track.onclick = (e) => {
    const c = e.target.closest('.tcard'); if (!c) return;
    const i = +c.dataset.i;
    if (i === idx) location.href = `${P('watch.html')}?id=${list[i].id}`; else select(i, true);
  };
  $('#tr-prev').onclick = () => select(idx - 1, true);
  $('#tr-next').onclick = () => select(idx + 1, true);
  fav.onclick = () => {
    const v = list[idx], lib = getLib();
    lib.saved = lib.saved.includes(v.id) ? lib.saved.filter((x) => x !== v.id) : [v.id, ...lib.saved];
    saveLib(lib); paintFav(v);
  };
  playBtn.onclick = () => {
    if (hero.classList.contains('playing')) { vid.pause(); hero.classList.remove('playing'); }
    else { hero.classList.add('playing'); const p = vid.play(); if (p && p.catch) p.catch(() => hero.classList.remove('playing')); }
    paintPreview();
  };
  muteBtn.onclick = () => { vid.muted = !vid.muted; paintPreview(); };

  /* latest releases poster rail */
  const rel = [...VIDEOS].sort((a, b) => (b.year - a.year) || (b.added - a.added)).slice(0, 12);
  const po = $('#po-track');
  po.innerHTML = rel.map((v) => `<a class="poster" href="${P('watch.html')}?id=${v.id}">
    <div class="pimg"><img src="${IMG(v.img)}" alt="${esc(v.title)}" loading="lazy"><span class="play">&#9654;</span></div>
    <h3>${esc(v.title)}</h3><p>${v.year} &middot; ${v.category}</p></a>`).join('');
  const nudge = (dir) => po.scrollBy({ left: dir * po.clientWidth * 0.85, behavior: 'smooth' });
  $('#po-prev').onclick = () => nudge(-1); $('#po-next').onclick = () => nudge(1);

  select(0, false);
}

/* ---------- start ---------- */
renderNav(); renderFooter(); renderLists(); renderHotTakes(); initViewerHome(); initBrowse(); initLibrary(); initWatch(); initAuth(); initDash(); renderTables(); initTheme();
