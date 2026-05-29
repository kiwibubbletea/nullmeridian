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
// Open world and member sections by default
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
  const names = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
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
  const fateColors = { clotho: '#6080a0', lachesis: '#60a080', atropos: '#a06070' };
  const color = fateColors[m.fateColor] || '#8a6a3a';
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
        <div class="md-personality" style="color:#5a4a3a;font-style:italic;">Locked. Access requires clearance.</div>
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
    title: 'Somnian Transit Route',
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

  // Background gradient — frozen top, desert bottom, zone middle
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0,    '#0c0f14');
  grad.addColorStop(0.35, '#0e1018');
  grad.addColorStop(0.45, '#1a0e08');
  grad.addColorStop(0.55, '#1a0e08');
  grad.addColorStop(0.65, '#130c08');
  grad.addColorStop(1,    '#100a06');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Zone band
  const zoneGrad = ctx.createLinearGradient(0, H * 0.38, 0, H * 0.62);
  zoneGrad.addColorStop(0, 'rgba(80,40,100,0)');
  zoneGrad.addColorStop(0.5, 'rgba(80,40,100,0.15)');
  zoneGrad.addColorStop(1, 'rgba(80,40,100,0)');
  ctx.fillStyle = zoneGrad;
  ctx.fillRect(0, H * 0.38, W, H * 0.24);

  // Frozen texture — ice lines top
  ctx.strokeStyle = 'rgba(120,150,180,0.06)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 20; i++) {
    const y = Math.random() * H * 0.45;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y + (Math.random() - 0.5) * 30);
    ctx.stroke();
  }

  // Desert dune lines bottom
  ctx.strokeStyle = 'rgba(160,100,50,0.06)';
  for (let i = 0; i < 12; i++) {
    const y = H * 0.55 + Math.random() * H * 0.4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= W; x += 40) {
      ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 8);
    }
    ctx.stroke();
  }

  // Grid overlay
  ctx.strokeStyle = 'rgba(138,106,58,0.05)';
  ctx.lineWidth = 0.3;
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // Zone label
  ctx.font = '10px Inconsolata, monospace';
  ctx.fillStyle = 'rgba(160,100,180,0.3)';
  ctx.letterSpacing = '0.2em';
  ctx.fillText('ANOMALY ZONE', W * 0.4, H * 0.51);

  // Train route line
  ctx.strokeStyle = 'rgba(138,106,58,0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(W * 0.20, H * 0.30);
  ctx.bezierCurveTo(W * 0.35, H * 0.42, W * 0.60, H * 0.42, W * 0.75, H * 0.25);
  ctx.stroke();
  ctx.moveTo(W * 0.48, H * 0.42);
  ctx.lineTo(W * 0.60, H * 0.70);
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
    ctx.fillStyle = '#0c0a10';
    ctx.fillRect(0, 0, W, H);

    // Outer rings
    for (let r = 0; r < 5; r++) {
      const radius = 30 + r * 28 + Math.sin(t * 0.5 + r) * 3;
      const alpha = 0.06 - r * 0.01;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(138,106,58,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Rotating spokes
    for (let s = 0; s < 8; s++) {
      const angle = (s / 8) * Math.PI * 2 + t * 0.3;
      const len = 100 + Math.sin(t + s) * 15;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.strokeStyle = `rgba(138,106,58,0.04)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Floating particles
    for (let p = 0; p < 24; p++) {
      const angle = (p / 24) * Math.PI * 2 + t * 0.2 * (p % 3 === 0 ? -1 : 1);
      const dist = 60 + Math.sin(t * 0.7 + p * 0.5) * 30;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const alpha = 0.2 + Math.sin(t + p) * 0.1;
      ctx.beginPath();
      ctx.arc(px, py, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192,146,74,${alpha})`;
      ctx.fill();
    }

    // Inner glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
    grd.addColorStop(0, `rgba(160,100,200,${0.12 + Math.sin(t) * 0.04})`);
    grd.addColorStop(0.5, `rgba(100,60,140,0.06)`);
    grd.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Core dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(192,146,74,${0.5 + Math.sin(t * 1.5) * 0.2})`;
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

  // Stars
  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(),
    y: Math.random() * 0.6,
    r: Math.random() * 0.7 + 0.2,
    a: Math.random() * 0.25 + 0.04,
    twinkle: Math.random() * Math.PI * 2
  }));

  // Train components
  const train = {
    x: -400,
    speed: 0.18,
    carriages: 8,
    carH: 28,
    carW: 56,
    gap: 6,
  };

  // Landscape scroll
  let scrollX = 0;
  // Mountains / dunes
  const frozenPeaks = Array.from({ length: 18 }, (_, i) => ({
    x: i / 17,
    h: 0.08 + Math.random() * 0.14,
    w: 0.06 + Math.random() * 0.08
  }));
  const desertDunes = Array.from({ length: 12 }, (_, i) => ({
    x: i / 11,
    h: 0.04 + Math.random() * 0.07,
    w: 0.1 + Math.random() * 0.12
  }));

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Sky gradient — frozen to desert (left to right)
    const skyGrad = ctx.createLinearGradient(0, 0, W, 0);
    skyGrad.addColorStop(0,   '#09101a');
    skyGrad.addColorStop(0.4, '#080d14');
    skyGrad.addColorStop(0.6, '#100a08');
    skyGrad.addColorStop(1,   '#140b06');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Stars (frozen side — left half)
    stars.forEach(s => {
      const tw = Math.sin(t * 0.8 + s.twinkle);
      const alpha = s.a + tw * 0.05;
      ctx.beginPath();
      ctx.arc(s.x * W * 0.55, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,230,${alpha})`;
      ctx.fill();
    });

    // Aurora (frozen side)
    const auroraY = H * 0.15;
    for (let a = 0; a < 3; a++) {
      const grad = ctx.createLinearGradient(0, auroraY + a * 18, 0, auroraY + a * 18 + 40);
      grad.addColorStop(0, `rgba(60,120,100,${0.03 + Math.sin(t * 0.3 + a) * 0.01})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, auroraY + a * 18, W * 0.45, 40);
    }

    // Ground horizon line
    const groundY = H * 0.72;
    ctx.strokeStyle = 'rgba(138,106,58,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    // Frozen mountains (left side, scrolling slowly)
    const mScroll = (scrollX * 0.3) % W;
    frozenPeaks.forEach(p => {
      let px = ((p.x * W * 1.5 - mScroll) % (W * 1.5));
      if (px < -200) px += W * 1.5;
      const pw = p.w * W;
      const ph = p.h * H;
      const py = groundY;
      ctx.beginPath();
      ctx.moveTo(px - pw / 2, py);
      ctx.lineTo(px, py - ph);
      ctx.lineTo(px + pw / 2, py);
      ctx.closePath();
      const alpha = px < W * 0.55 ? 0.12 : 0.03;
      ctx.fillStyle = `rgba(140,160,190,${alpha})`;
      ctx.fill();
      // Snow cap
      ctx.beginPath();
      ctx.moveTo(px - pw * 0.08, py - ph * 0.78);
      ctx.lineTo(px, py - ph);
      ctx.lineTo(px + pw * 0.08, py - ph * 0.78);
      ctx.closePath();
      ctx.fillStyle = `rgba(200,210,230,${alpha * 1.5})`;
      ctx.fill();
    });

    // Desert dunes (right side)
    const dScroll = (scrollX * 0.2) % W;
    desertDunes.forEach(d => {
      let dx = ((d.x * W * 1.5 + W * 0.4 - dScroll) % (W * 1.5));
      if (dx < -200) dx += W * 1.5;
      const dw = d.w * W;
      const dh = d.h * H;
      ctx.beginPath();
      ctx.ellipse(dx, groundY, dw / 2, dh * 0.6, 0, Math.PI, 0);
      const alpha = dx > W * 0.5 ? 0.1 : 0.02;
      ctx.fillStyle = `rgba(160,100,50,${alpha})`;
      ctx.fill();
    });

    // Ground fill
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
    groundGrad.addColorStop(0, 'rgba(15,12,8,0.8)');
    groundGrad.addColorStop(1, 'rgba(10,8,6,1)');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, W, H - groundY);

    // Train tracks
    const trackY = groundY + 12;
    ctx.strokeStyle = 'rgba(80,65,45,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, trackY - 4); ctx.lineTo(W, trackY - 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, trackY + 4); ctx.lineTo(W, trackY + 4); ctx.stroke();
    // Sleepers
    for (let sl = -30; sl < W + 30; sl += 30) {
      const sx = (sl - scrollX * 2) % (W + 60);
      ctx.strokeStyle = 'rgba(80,65,45,0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(sx, trackY - 6); ctx.lineTo(sx, trackY + 6); ctx.stroke();
    }

    // Train
    const ty = groundY - 10;
    const totalW = train.carriages * (train.carW + train.gap);
    const tx = ((train.x) % (W + totalW + 200));

    for (let c = 0; c < train.carriages; c++) {
      const cx2 = tx + c * (train.carW + train.gap);
      const isFirst = c === 0;

      // Carriage body
      const carGrad = ctx.createLinearGradient(cx2, ty - train.carH, cx2, ty);
      carGrad.addColorStop(0, 'rgba(30,25,20,0.95)');
      carGrad.addColorStop(1, 'rgba(20,16,12,0.95)');
      ctx.fillStyle = carGrad;
      ctx.beginPath();
      const r = isFirst ? 4 : 2;
      ctx.roundRect(cx2, ty - train.carH, train.carW, train.carH, isFirst ? [r,r,0,0] : r);
      ctx.fill();

      // Carriage border
      ctx.strokeStyle = 'rgba(138,106,58,0.2)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Windows
      for (let w2 = 0; w2 < 3; w2++) {
        const wx = cx2 + 6 + w2 * 16;
        const wy = ty - train.carH + 8;
        const lit = Math.sin(t * 0.5 + c * 1.3 + w2 * 0.7) > 0.3;
        ctx.fillStyle = lit ? 'rgba(200,170,100,0.25)' : 'rgba(80,70,60,0.15)';
        ctx.fillRect(wx, wy, 10, 8);
      }

      // Wheels
      for (let w2 = 0; w2 < 2; w2++) {
        ctx.beginPath();
        ctx.arc(cx2 + 12 + w2 * 32, ty + 3, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40,35,28,0.9)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(100,80,50,0.4)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Engine (first carriage extras)
      if (isFirst) {
        // Smokestack
        ctx.fillStyle = 'rgba(35,28,22,0.9)';
        ctx.fillRect(cx2 + 8, ty - train.carH - 10, 8, 10);
        // Steam puffs
        for (let sm = 0; sm < 3; sm++) {
          const smAlpha = Math.max(0, 0.15 - sm * 0.05 - (t * 0.1) % 0.15);
          const smY = ty - train.carH - 12 - sm * 8 - (t * 20 % 24);
          const smR = 4 + sm * 3;
          ctx.beginPath();
          ctx.arc(cx2 + 12, smY, smR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,170,160,${smAlpha})`;
          ctx.fill();
        }
        // Light beam
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

    // Zone shimmer (middle of screen)
    const shimmerX = W * 0.45 + Math.sin(t * 0.4) * 20;
    const shimmerGrad = ctx.createLinearGradient(shimmerX, 0, shimmerX + 60, 0);
    shimmerGrad.addColorStop(0, 'transparent');
    shimmerGrad.addColorStop(0.5, `rgba(120,60,160,${0.04 + Math.sin(t * 0.6) * 0.02})`);
    shimmerGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = shimmerGrad;
    ctx.fillRect(shimmerX, 0, 60, H);

    // Advance
    train.x += train.speed;
    if (train.x > W + totalW + 200) train.x = -(totalW + 200);
    scrollX += 0.5;
    t += 0.016;

    requestAnimationFrame(draw);
  }
  draw();
}
