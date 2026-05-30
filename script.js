/* =============================
   NULL MERIDIAN — SCRIPT.JS
   ============================= */

// ===== PAGE NAVIGATION =====
const pages = {
  'notice':        'HOME',
  'world':         'WORLD',
  'settlements':   'WORLD > SETTLEMENTS',
  'members':       'MEMBER',
  'member-detail': 'MEMBER > CHARACTER',
  'system':        'SYSTEM',
  'fates':         'WORLD > THE FATES',
  'dreamcore':     'WORLD > DREAM CORE',
  'anomaly':       'WORLD > ANOMALY ZONE',
};

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + id);
  if (el) {
    el.classList.add('active');
    document.getElementById('page-breadcrumb').textContent = pages[id] || id.toUpperCase();
    document.getElementById('main').scrollTo(0, 0);
  }
  if (id === 'dreamcore') initCoreCanvas();
  if (id === 'anomaly') initMapCanvas();
}

// ===== SIDEBAR SECTIONS =====
function toggleSection(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}
document.addEventListener('DOMContentLoaded', () => {
  const ws = document.getElementById('world-sub');
  const ms = document.getElementById('member-sub');
  if (ws) ws.classList.add('open');
  if (ms) ms.classList.add('open');
  buildCalendar(2026, 5);
  initBgCanvas();
});

// ===== CALENDAR =====
const calEvents = { 1: 'Opening Event', 16: 'Session Arc 1' };
let calYear = 2026, calMonth = 5;

function buildCalendar(year, month) {
  calYear = year; calMonth = month;
  document.getElementById('cal-month-label').textContent = `${year}. ${month + 1}`;
  const grid = document.getElementById('cal-grid');
  if (!grid) return;
  const days = ['SU','MO','TU','WE','TH','FR','SA'];
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  let html = days.map(d => `<div class="cal-day-name">${d}</div>`).join('');
  for (let i = 0; i < first; i++) html += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= total; d++) {
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const isEvent = calEvents[d];
    const isSun = (first + d - 1) % 7 === 0;
    let cls = 'cal-day';
    if (isToday) cls += ' today';
    if (isEvent) cls += ' event';
    if (isSun) cls += ' sun';
    const title = isEvent ? ` title="${isEvent}"` : '';
    html += `<div class="${cls}"${title}>${d}</div>`;
  }
  grid.innerHTML = html;
}
document.addEventListener('click', e => {
  if (e.target.id === 'cal-month-label') return;
  const header = e.target.closest('.cal-header');
  if (!header) return;
  if (e.target.classList.contains('cal-nav')) {
    const dir = e.target.textContent === '‹' ? -1 : 1;
    let m = calMonth + dir, y = calYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    buildCalendar(y, m);
  }
});

// ===== NOTICES =====
function openNotice(title, body) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  document.getElementById('notice-modal').classList.add('open');
}
function closeModal() {
  document.getElementById('notice-modal').classList.remove('open');
}

// ===== MEMBERS =====
const memberData = {
  vesper: {
    name: 'Vesper',
    fate: 'Atropos',
    fateColor: 'atropos',
    quote: 'I do not hesitate. Hesitation is a malfunction.',
    info: ['Construct', 'Atropos Fate', 'Est. Active 3 yrs'],
    personality: 'Vesper was assembled from three separate chassis and does not discuss the third. Precise, economical with words, and possessed of a stillness that other Conductors find difficult to read. Their decisions are not fast — they are already made before the situation fully presents itself.',
    stats: { Endurance: 82, Precision: 91, Cognition: 78, Combat: 88, Stability: 65, Empathy: 40 }
  },
  lumen: {
    name: 'Lumen',
    fate: 'Clotho',
    fateColor: 'clotho',
    quote: 'If I can still fix it, I am still here.',
    info: ['Construct', 'Clotho Fate', 'Est. Active 1.5 yrs'],
    personality: 'Lumen\'s left arm was calibrated for surgical work on a chassis that is no longer operational. They have never been told whose it was before. They find this occupies more of their processing cycles than it should and have stopped pretending otherwise.',
    stats: { Endurance: 65, Precision: 88, Cognition: 90, Combat: 52, Stability: 78, Empathy: 92 }
  },
  maren: {
    name: 'Maren',
    fate: 'Lachesis',
    fateColor: 'lachesis',
    quote: 'Everything can be measured. Not everything should be.',
    info: ['Construct', 'Lachesis Fate', 'Est. Active 2 yrs'],
    personality: 'Maren keeps meticulous records. Some of them are not about the train. They have a secondary notation system that no one has asked about and they have not volunteered to explain. The entries are written in a shorthand that predates their current activation.',
    stats: { Endurance: 70, Precision: 85, Cognition: 95, Combat: 60, Stability: 88, Empathy: 75 }
  }
};

function openMember(id) {
  const m = memberData[id];
  if (!m) return;
  const fateColors = { clotho: '#7090b8', lachesis: '#70b890', atropos: '#b87080' };
  const color = fateColors[m.fateColor] || '#b8923a';
  const statBars = Object.entries(m.stats).map(([name, val]) => `
    <div class="md-stat">
      <div class="md-stat-name">${name}</div>
      <div class="md-stat-bar"><div class="md-stat-fill" style="width:${val}%;background:${color}"></div></div>
    </div>
  `).join('');
  const total = Object.values(m.stats).reduce((a, b) => a + b, 0);
  const infoItems = m.info.map(i => `<span class="md-info-item">${i}</span>`).join('');
  document.getElementById('member-detail-inner').innerHTML = `
    <div class="md-layout">
      <div class="md-left">
        <div class="md-quote">${m.quote}</div>
        <div class="md-art-placeholder">${m.name[0]}</div>
      </div>
      <div class="md-right">
        <div class="md-back" onclick="showPage('members')">← Back to Manifest</div>
        <div class="md-faction-badge" style="color:${color}">${m.fate.toUpperCase()} · THE ${m.fate === 'Clotho' ? 'WEAVERS' : m.fate === 'Lachesis' ? 'MEASURERS' : 'SEVERERS'}</div>
        <div class="md-char-name">${m.name}</div>
        <div class="md-info-label">INFORMATION</div>
        <div class="md-info-row">${infoItems}</div>
        <div class="md-stat-grid">${statBars}</div>
        <div class="md-total">Total Stat <strong>${total}</strong></div>
        <div class="md-section-header">
          <span class="md-section-title">✦ PERSONALITY</span>
          <div class="md-section-line"></div>
        </div>
        <div class="md-personality">${m.personality}</div>
        <div class="md-section-header" style="margin-top:20px">
          <span class="md-section-title">✦ FRAGMENT MEMORY</span>
          <div class="md-section-line"></div>
        </div>
        <div class="md-personality" style="color:#4a3e30;font-style:italic;">Locked. Access requires clearance.</div>
      </div>
    </div>
  `;
  showPage('member-detail');
}

// ===== FATE FILTER =====
function filterFate(fate, btn) {
  document.querySelectorAll('.fate-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.member-card').forEach(card => {
    if (fate === 'all' || card.dataset.fate === fate || card.classList.contains('add-card')) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ===== ANOMALY MAP =====
const mapPoints = {
  'somnian-route': {
    title: 'The Somnian — Current Position',
    body: 'The only path through the Anomaly Zone\'s edge. The Conductors know the margin between safe passage and Zone corruption is thinner than passengers understand. The route narrows every month as the Zone expands.'
  },
  'lambda': {
    title: 'Lambda — The Breadbasket',
    body: 'Northern frozen wastes. Underground agricultural complexes. The Cultivation Council feeds the world and wields that fact with the precision of a scalpel. Constructs here are flagged as productivity anomalies when they develop personalities.'
  },
  'omega': {
    title: 'Omega — The Signal',
    body: 'Border territory communications hub. Constructs here have the most legal rights of any settlement. The Signal Score that monitors their every behavior is not mentioned in the same breath as those rights.'
  },
  'alpha': {
    title: 'Alpha — The Deep',
    body: 'Desert-side mining complex. Hot, loud, running on inertia. Vantablack Industrial has not sent a representative in over a decade. Constructs are tools here, not cruelly, just with the complete absence of any framework that would permit a different view.'
  },
  'unknown-1': {
    title: '??? — Uncharted Territory',
    body: 'Deep frozen wastes. Survey drones sent into this region returned corrupted data. One did not return at all. Lambda\'s Cultivation Council has not authorized further investigation.'
  },
  'unknown-2': {
    title: '??? — Signal Anomaly',
    body: 'Omega\'s receivers occasionally pick up a frequency originating from this direction. The signal does not match any known transmission format. It repeats on a 17-day cycle.'
  },
  'unknown-3': {
    title: '??? — Collapsed Infrastructure',
    body: 'Pre-collapse maps indicate a settlement in this region. No contact has been established. The area is classified as uninhabitable. The classification predates the current administration.'
  },
  'unknown-4': {
    title: '??? — Zone Anomaly Cluster',
    body: 'This region is where the Anomaly Zone behaves most unpredictably. Gravity inversions lasting up to 40 minutes have been recorded here. Constructs who survived passage reported memory gaps.'
  },
  'unknown-5': {
    title: '??? — Uncharted Zone Interior',
    body: 'The Somnian has not passed through this region. What the Zone does to biological passengers in its interior — as opposed to its edge — is theoretical. The Conductors prefer it remains theoretical.'
  },
  'unknown-6': {
    title: '??? — Deep Desert',
    body: 'Past the known perimeter of the scorched zone. Surface temperature measurements from this region were last recorded twelve years ago. The instruments that took them were subsequently decommissioned for unexplained data corruption.'
  },
  'unknown-7': {
    title: '??? — Southern Anomaly Edge',
    body: 'The Zone\'s southern boundary is expanding at seven centimeters per day. At current rate, this area will be consumed in approximately four years. No evacuation planning has been publicly discussed.'
  },
  'unknown-8': {
    title: '??? — Vantablack Perimeter',
    body: 'This region falls within the last known operational boundary of Vantablack Industrial\'s original operations. What they were doing here — and why they stopped communicating — remains undisclosed.'
  }
};

function openMapPoint(id) {
  const p = mapPoints[id];
  if (!p) return;
  document.querySelector('.ai-title').textContent = p.title;
  document.querySelector('.ai-body').textContent = p.body;
}

function initMapCanvas() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // === ZONE BACKGROUNDS ===
  // Top third: frozen wastes — deep blue-black
  const iceGrad = ctx.createLinearGradient(0, 0, 0, H * 0.38);
  iceGrad.addColorStop(0,   '#07101e');
  iceGrad.addColorStop(0.6, '#0b1420');
  iceGrad.addColorStop(1,   '#0d1624');
  ctx.fillStyle = iceGrad;
  ctx.fillRect(0, 0, W, H * 0.38);

  // Middle: anomaly zone — dark purple
  const anomGrad = ctx.createLinearGradient(0, H * 0.35, 0, H * 0.65);
  anomGrad.addColorStop(0,   '#0d0814');
  anomGrad.addColorStop(0.5, '#120a1c');
  anomGrad.addColorStop(1,   '#0d0814');
  ctx.fillStyle = anomGrad;
  ctx.fillRect(0, H * 0.35, W, H * 0.30);

  // Bottom third: desert — warm dark orange-brown
  const desertGrad = ctx.createLinearGradient(0, H * 0.62, 0, H);
  desertGrad.addColorStop(0,   '#1a0e06');
  desertGrad.addColorStop(0.5, '#1e1008');
  desertGrad.addColorStop(1,   '#160c05');
  ctx.fillStyle = desertGrad;
  ctx.fillRect(0, H * 0.62, W, H * 0.38);

  // === ZONE GLOW BANDS (blended transitions) ===
  // Ice zone blue tint
  const iceGlow = ctx.createLinearGradient(0, 0, 0, H * 0.42);
  iceGlow.addColorStop(0,    'rgba(60,110,180,0.12)');
  iceGlow.addColorStop(0.7,  'rgba(60,110,180,0.04)');
  iceGlow.addColorStop(1,    'transparent');
  ctx.fillStyle = iceGlow;
  ctx.fillRect(0, 0, W, H * 0.42);

  // Desert orange tint
  const desGlow = ctx.createLinearGradient(0, H * 0.58, 0, H);
  desGlow.addColorStop(0,    'transparent');
  desGlow.addColorStop(0.3,  'rgba(160,80,30,0.06)');
  desGlow.addColorStop(1,    'rgba(180,90,30,0.14)');
  ctx.fillStyle = desGlow;
  ctx.fillRect(0, H * 0.58, W, H * 0.42);

  // Anomaly zone purple shimmer
  const anomGlow = ctx.createLinearGradient(0, H * 0.38, 0, H * 0.62);
  anomGlow.addColorStop(0,   'transparent');
  anomGlow.addColorStop(0.5, 'rgba(100,40,160,0.18)');
  anomGlow.addColorStop(1,   'transparent');
  ctx.fillStyle = anomGlow;
  ctx.fillRect(0, H * 0.38, W, H * 0.24);

  // === ZONE LABEL AREAS (thin horizontal color bars) ===
  // Ice zone top border
  ctx.fillStyle = 'rgba(60,110,200,0.15)';
  ctx.fillRect(0, 0, W, 2);

  // Desert bottom border
  ctx.fillStyle = 'rgba(180,90,30,0.2)';
  ctx.fillRect(0, H - 2, W, 2);

  // === ZONE SEPARATOR LINES ===
  ctx.strokeStyle = 'rgba(100,40,160,0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(0, H * 0.38); ctx.lineTo(W, H * 0.38); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, H * 0.62); ctx.lineTo(W, H * 0.62); ctx.stroke();
  ctx.setLineDash([]);

  // === ICE ZONE TEXTURES ===
  // Ice cracks / horizontal striations
  ctx.strokeStyle = 'rgba(130,160,210,0.05)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 28; i++) {
    const y = (i / 28) * H * 0.36;
    ctx.beginPath();
    ctx.moveTo(0, y);
    let x = 0;
    while (x < W) {
      x += 20 + Math.random() * 40;
      ctx.lineTo(x, y + (Math.random() - 0.5) * 12);
    }
    ctx.stroke();
  }
  // Frozen mountain silhouettes
  ctx.fillStyle = 'rgba(80,120,180,0.07)';
  for (let i = 0; i < 10; i++) {
    const mx = (i / 9) * W * 1.1 - W * 0.05;
    const mh = 60 + Math.random() * 80;
    const mw = 80 + Math.random() * 100;
    ctx.beginPath();
    ctx.moveTo(mx - mw/2, H * 0.37);
    ctx.lineTo(mx, H * 0.37 - mh);
    ctx.lineTo(mx + mw/2, H * 0.37);
    ctx.closePath();
    ctx.fill();
    // snow cap
    ctx.fillStyle = 'rgba(200,220,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(mx - mw*0.12, H * 0.37 - mh * 0.75);
    ctx.lineTo(mx, H * 0.37 - mh);
    ctx.lineTo(mx + mw*0.12, H * 0.37 - mh * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(80,120,180,0.07)';
  }

  // === DESERT ZONE TEXTURES ===
  // Dune ripple lines
  ctx.strokeStyle = 'rgba(180,110,50,0.06)';
  ctx.lineWidth = 0.6;
  for (let i = 0; i < 16; i++) {
    const y = H * 0.65 + (i / 15) * H * 0.32;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= W; x += 25) {
      ctx.lineTo(x, y + Math.sin(x * 0.015 + i * 0.8) * 10);
    }
    ctx.stroke();
  }
  // Dune mounds
  for (let i = 0; i < 6; i++) {
    const dx = (i / 5) * W * 1.1 - W * 0.05;
    const dw = 150 + Math.random() * 120;
    const dh = 30 + Math.random() * 50;
    ctx.beginPath();
    ctx.ellipse(dx, H * 0.63, dw/2, dh * 0.5, 0, Math.PI, 0);
    ctx.fillStyle = 'rgba(160,90,40,0.07)';
    ctx.fill();
  }

  // === ANOMALY ZONE TEXTURES ===
  // Glitch/warp lines
  ctx.strokeStyle = 'rgba(140,60,200,0.07)';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 12; i++) {
    const y = H * 0.40 + (i / 11) * H * 0.20;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= W; x += 15) {
      ctx.lineTo(x, y + (Math.random() - 0.5) * 20);
    }
    ctx.stroke();
  }
  // Floating anomaly orbs
  for (let i = 0; i < 8; i++) {
    const ax = (i / 7) * W;
    const ay = H * 0.42 + Math.random() * H * 0.16;
    const ar = 6 + Math.random() * 14;
    const ag = ctx.createRadialGradient(ax, ay, 0, ax, ay, ar);
    ag.addColorStop(0, 'rgba(160,80,220,0.12)');
    ag.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(ax, ay, ar, 0, Math.PI * 2);
    ctx.fillStyle = ag;
    ctx.fill();
  }

  // === GRID OVERLAY ===
  ctx.strokeStyle = 'rgba(184,146,58,0.04)';
  ctx.lineWidth = 0.3;
  for (let x = 0; x <= W; x += 50) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 50) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // === ZONE LABELS ===
  ctx.save();
  ctx.font = 'bold 11px Cinzel, serif';
  ctx.letterSpacing = '0.3em';
  ctx.fillStyle = 'rgba(100,150,220,0.25)';
  ctx.fillText('FROZEN WASTES', 18, 22);
  ctx.fillStyle = 'rgba(160,80,220,0.28)';
  ctx.fillText('ANOMALY  ZONE', W * 0.38, H * 0.51);
  ctx.fillStyle = 'rgba(180,110,50,0.28)';
  ctx.fillText('SCORCHED DESERT', 18, H - 14);
  ctx.restore();

  // === TRAIN ROUTE (dashed gold line) ===
  ctx.strokeStyle = 'rgba(184,146,58,0.35)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 5]);
  ctx.beginPath();
  ctx.moveTo(W * 0.14, H * 0.22);
  ctx.bezierCurveTo(W * 0.25, H * 0.40, W * 0.38, H * 0.50, W * 0.43, H * 0.46);
  ctx.bezierCurveTo(W * 0.50, H * 0.40, W * 0.62, H * 0.32, W * 0.72, H * 0.18);
  ctx.stroke();
  // Branch to Alpha
  ctx.strokeStyle = 'rgba(184,146,58,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W * 0.43, H * 0.46);
  ctx.bezierCurveTo(W * 0.50, H * 0.58, W * 0.56, H * 0.65, W * 0.62, H * 0.74);
  ctx.stroke();
  ctx.setLineDash([]);
}

// ===== DREAM CORE CANVAS =====
let coreAnimId = null;
function initCoreCanvas() {
  const canvas = document.getElementById('core-canvas');
  if (!canvas) return;
  if (coreAnimId) cancelAnimationFrame(coreAnimId);
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0810';
    ctx.fillRect(0, 0, W, H);

    for (let r = 0; r < 5; r++) {
      const radius = 30 + r * 28 + Math.sin(t * 0.5 + r) * 3;
      const alpha = 0.07 - r * 0.01;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(184,146,58,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    for (let s = 0; s < 8; s++) {
      const angle = (s / 8) * Math.PI * 2 + t * 0.3;
      const len = 100 + Math.sin(t + s) * 15;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.strokeStyle = `rgba(184,146,58,0.04)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    for (let p = 0; p < 24; p++) {
      const angle = (p / 24) * Math.PI * 2 + t * 0.2 * (p % 3 === 0 ? -1 : 1);
      const dist = 60 + Math.sin(t * 0.7 + p * 0.5) * 30;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const alpha = 0.22 + Math.sin(t + p) * 0.1;
      ctx.beginPath();
      ctx.arc(px, py, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,168,74,${alpha})`;
      ctx.fill();
    }

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
    grd.addColorStop(0, `rgba(160,100,200,${0.14 + Math.sin(t) * 0.05})`);
    grd.addColorStop(0.5, `rgba(100,60,140,0.07)`);
    grd.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,168,74,${0.55 + Math.sin(t * 1.5) * 0.2})`;
    ctx.fill();

    t += 0.012;
    coreAnimId = requestAnimationFrame(draw);
  }
  draw();
}

// ===== BACKGROUND ANIMATION =====
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(),
    y: Math.random() * 0.6,
    r: Math.random() * 0.7 + 0.2,
    a: Math.random() * 0.25 + 0.04,
    twinkle: Math.random() * Math.PI * 2
  }));

  const train = { x: -400, speed: 0.18, carriages: 8, carH: 28, carW: 56, gap: 6 };

  let scrollX = 0;
  const frozenPeaks = Array.from({ length: 18 }, (_, i) => ({
    x: i / 17, h: 0.08 + Math.random() * 0.14, w: 0.06 + Math.random() * 0.08
  }));
  const desertDunes = Array.from({ length: 12 }, (_, i) => ({
    x: i / 11, h: 0.04 + Math.random() * 0.07, w: 0.1 + Math.random() * 0.12
  }));

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const skyGrad = ctx.createLinearGradient(0, 0, W, 0);
    skyGrad.addColorStop(0,   '#07101a');
    skyGrad.addColorStop(0.4, '#060c12');
    skyGrad.addColorStop(0.6, '#0e0906');
    skyGrad.addColorStop(1,   '#120a05');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    stars.forEach(s => {
      const tw = Math.sin(t * 0.8 + s.twinkle);
      const alpha = s.a + tw * 0.05;
      ctx.beginPath();
      ctx.arc(s.x * W * 0.55, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,230,${alpha})`;
      ctx.fill();
    });

    const auroraY = H * 0.15;
    for (let a = 0; a < 3; a++) {
      const grad = ctx.createLinearGradient(0, auroraY + a * 18, 0, auroraY + a * 18 + 40);
      grad.addColorStop(0, `rgba(60,120,100,${0.03 + Math.sin(t * 0.3 + a) * 0.01})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, auroraY + a * 18, W * 0.45, 40);
    }

    const groundY = H * 0.72;
    ctx.strokeStyle = 'rgba(184,146,58,0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    const mScroll = (scrollX * 0.3) % W;
    frozenPeaks.forEach(p => {
      let px = ((p.x * W * 1.5 - mScroll) % (W * 1.5));
      if (px < -200) px += W * 1.5;
      const pw = p.w * W, ph = p.h * H, py = groundY;
      ctx.beginPath();
      ctx.moveTo(px - pw / 2, py);
      ctx.lineTo(px, py - ph);
      ctx.lineTo(px + pw / 2, py);
      ctx.closePath();
      const alpha = px < W * 0.55 ? 0.12 : 0.03;
      ctx.fillStyle = `rgba(140,160,190,${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px - pw * 0.08, py - ph * 0.78);
      ctx.lineTo(px, py - ph);
      ctx.lineTo(px + pw * 0.08, py - ph * 0.78);
      ctx.closePath();
      ctx.fillStyle = `rgba(200,210,230,${alpha * 1.5})`;
      ctx.fill();
    });

    const dScroll = (scrollX * 0.2) % W;
    desertDunes.forEach(d => {
      let dx = ((d.x * W * 1.5 + W * 0.4 - dScroll) % (W * 1.5));
      if (dx < -200) dx += W * 1.5;
      const dw = d.w * W, dh = d.h * H;
      ctx.beginPath();
      ctx.ellipse(dx, groundY, dw / 2, dh * 0.6, 0, Math.PI, 0);
      const alpha = dx > W * 0.5 ? 0.1 : 0.02;
      ctx.fillStyle = `rgba(160,100,50,${alpha})`;
      ctx.fill();
    });

    const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
    groundGrad.addColorStop(0, 'rgba(14,11,8,0.85)');
    groundGrad.addColorStop(1, 'rgba(8,6,4,1)');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, W, H - groundY);

    const trackY = groundY + 12;
    ctx.strokeStyle = 'rgba(80,65,45,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, trackY - 4); ctx.lineTo(W, trackY - 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, trackY + 4); ctx.lineTo(W, trackY + 4); ctx.stroke();
    for (let sl = -30; sl < W + 30; sl += 30) {
      const sx = (sl - scrollX * 2) % (W + 60);
      ctx.strokeStyle = 'rgba(80,65,45,0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(sx, trackY - 6); ctx.lineTo(sx, trackY + 6); ctx.stroke();
    }

    const ty = groundY - 10;
    const totalW = train.carriages * (train.carW + train.gap);
    const tx = ((train.x) % (W + totalW + 200));

    for (let c = 0; c < train.carriages; c++) {
      const cx2 = tx + c * (train.carW + train.gap);
      const isFirst = c === 0;
      const carGrad = ctx.createLinearGradient(cx2, ty - train.carH, cx2, ty);
      carGrad.addColorStop(0, 'rgba(28,23,18,0.96)');
      carGrad.addColorStop(1, 'rgba(18,14,10,0.96)');
      ctx.fillStyle = carGrad;
      ctx.beginPath();
      const r = isFirst ? 4 : 2;
      ctx.roundRect(cx2, ty - train.carH, train.carW, train.carH, isFirst ? [r,r,0,0] : r);
      ctx.fill();
      ctx.strokeStyle = 'rgba(184,146,58,0.18)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      for (let w2 = 0; w2 < 3; w2++) {
        const wx = cx2 + 6 + w2 * 16;
        const wy = ty - train.carH + 8;
        const lit = Math.sin(t * 0.5 + c * 1.3 + w2 * 0.7) > 0.3;
        ctx.fillStyle = lit ? 'rgba(200,170,100,0.25)' : 'rgba(80,70,60,0.15)';
        ctx.fillRect(wx, wy, 10, 8);
      }
      for (let w2 = 0; w2 < 2; w2++) {
        ctx.beginPath();
        ctx.arc(cx2 + 12 + w2 * 32, ty + 3, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(38,32,25,0.9)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(100,80,50,0.4)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      if (isFirst) {
        ctx.fillStyle = 'rgba(32,26,20,0.9)';
        ctx.fillRect(cx2 + 8, ty - train.carH - 10, 8, 10);
        for (let sm = 0; sm < 3; sm++) {
          const smAlpha = Math.max(0, 0.15 - sm * 0.05 - (t * 0.1) % 0.15);
          const smY = ty - train.carH - 12 - sm * 8 - (t * 20 % 24);
          const smR = 4 + sm * 3;
          ctx.beginPath();
          ctx.arc(cx2 + 12, smY, smR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,170,160,${smAlpha})`;
          ctx.fill();
        }
        const beamGrad = ctx.createLinearGradient(cx2 - 60, ty - train.carH / 2, cx2, ty - train.carH / 2);
        beamGrad.addColorStop(0, 'transparent');
        beamGrad.addColorStop(1, 'rgba(200,180,100,0.06)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(cx2, ty - train.carH + 4);
        ctx.lineTo(cx2, ty - 4);
        ctx.lineTo(cx2 - 60, ty - train.carH / 2 + 10);
        ctx.lineTo(cx2 - 60, ty - train.carH / 2 - 10);
        ctx.closePath();
        ctx.fill();
      }
    }

    const shimmerX = W * 0.45 + Math.sin(t * 0.4) * 20;
    const shimmerGrad = ctx.createLinearGradient(shimmerX, 0, shimmerX + 60, 0);
    shimmerGrad.addColorStop(0, 'transparent');
    shimmerGrad.addColorStop(0.5, `rgba(120,60,160,${0.04 + Math.sin(t * 0.6) * 0.02})`);
    shimmerGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = shimmerGrad;
    ctx.fillRect(shimmerX, 0, 60, H);

    train.x += train.speed;
    if (train.x > W + totalW + 200) train.x = -(totalW + 200);
    scrollX += 0.5;
    t += 0.016;
    requestAnimationFrame(draw);
  }
  draw();
}