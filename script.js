/* ══════════════════════════════════════════════════════
   script.js — Valentine Sequência Cinematográfica
   Cena 1: Presente → Cena 2: Envelope → Cena 3: Carta
══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────
   BOKEH — fundo magenta
───────────────────────────────────────── */
(function initBokeh() {

  const canvas = document.getElementById('bokehCanvas');
  const ctx    = canvas.getContext('2d');

  const COLS = [
    [255,60,160],
    [255,120,200],
    [220,0,100],
    [255,180,220],
    [180,0,80],
    [255,80,180],
  ];

  let W, H, circles;

  function resize() {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  }

  function mkC() {
    return {
      x  : Math.random() * W,
      y  : Math.random() * H,
      r  : Math.random() * 55 + 18,
      c  : COLS[Math.floor(Math.random() * COLS.length)],
      op : Math.random() * 0.32 + 0.08,
      vx : (Math.random() - .5) * .35,
      vy : (Math.random() - .5) * .35,
      ph : Math.random() * Math.PI * 2,
    };
  }

  resize();

  circles = Array.from({ length: 28 }, mkC);

  window.addEventListener('resize', resize);

  (function draw() {

    ctx.clearRect(0, 0, W, H);

    const t = performance.now() / 1000;

    circles.forEach(c => {

      const sc = 1 + .12 * Math.sin(t * .8 + c.ph);
      const r  = c.r * sc;
      const op = c.op * (.85 + .15 * Math.sin(t * 1.1 + c.ph));

      const [R, G, B] = c.c;

      const g = ctx.createRadialGradient(
        c.x, c.y, 0,
        c.x, c.y, r
      );

      g.addColorStop(0, `rgba(${R},${G},${B},${op.toFixed(3)})`);
      g.addColorStop(.5, `rgba(${R},${G},${B},${(op * .45).toFixed(3)})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      c.x += c.vx;
      c.y += c.vy;

      if (c.x < -r * 2) c.x = W + r;
      if (c.x > W + r * 2) c.x = -r;

      if (c.y < -r * 2) c.y = H + r;
      if (c.y > H + r * 2) c.y = -r;

    });

    requestAnimationFrame(draw);

  })();

})();


/* ─────────────────────────────────────────
   CORAÇÕES OUTLINE
───────────────────────────────────────── */
(function initOutline() {

  const el = document.getElementById('outlineHearts');

  for (let i = 0; i < 10; i++) {

    const s = document.createElement('span');

    s.className = 'oh';
    s.textContent = '♥';

    const sz  = 45 + Math.random() * 55;
    const dur = 14 + Math.random() * 16;
    const del = -(Math.random() * dur);

    s.style.cssText = `
      font-size:${sz}px;
      left:${Math.random() * 100}%;
      bottom:${Math.random() * 120 - 20}%;

      --rot:${(Math.random() - .5) * 25}deg;
      --sc:${.7 + Math.random() * .7};
      --op:${.3 + Math.random() * .35};
      --travel:-${75 + Math.random() * 40}vh;

      animation-duration:${dur}s;
      animation-delay:${del}s;
    `;

    el.appendChild(s);
  }

})();


/* ═══════════════════════════════════════════════════
   MÁQUINA DE ESTADOS
═══════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

const scenes = {
  gift   : $('sceneGift'),
  letter : $('sceneLetter'),
  card   : $('sceneCard'),
};

function showScene(name) {

  Object.values(scenes).forEach(scene => {
    scene.classList.add('hidden');
  });

  scenes[name].classList.remove('hidden');

}


/* ═══════════════════════════════════════════════════
   CENA 1 — PRESENTE ══════════════════════════ */


(function initGift() {

  const wrap = document.getElementById('giftWrap');
  const hint = document.getElementById('hintPull');

  if (!wrap) return;

  let clicked = false;

  function onGiftClick() {

    if (clicked) return;
    clicked = true;

    // animação
    wrap.classList.add('gift-click');

    // explosão
    setTimeout(() => {
      burstFromBox();
    }, 200);

    // texto
    setTimeout(() => {
      if (hint) {
        hint.textContent = 'Descubra o que tem dentro…';
        hint.style.animation = 'none';
      }
    }, 500);

    // próxima cena
    setTimeout(() => {
      goToLetter();
    }, 1700);
  }

  wrap.addEventListener('click', onGiftClick);
  wrap.addEventListener('touchstart', onGiftClick, { passive: true });

})();


/* ─────────────────────────────────────────
   Explosão de corações
───────────────────────────────────────── */
function burstFromBox() {

  const SYMS = ['💖','💘','💕','💗','💝','✨','🌸'];

  const rect = $('giftWrap').getBoundingClientRect();

  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 4;

  for (let i = 0; i < 22; i++) {

    const p = document.createElement('span');

    p.className = 'bh';

    p.textContent =
      SYMS[Math.floor(Math.random() * SYMS.length)];

    const angle =
      (Math.PI * 2 / 22) * i +
      (Math.random() * .5 - .25);

    const dist = 80 + Math.random() * 130;

    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 60;

    const sz  = 14 + Math.random() * 18;
    const dur = (.9 + Math.random() * .7).toFixed(2);
    const rot = (Math.random() - .5) * 60;

    p.style.cssText = `
      left:${cx}px;
      top:${cy}px;

      --tx:${tx}px;
      --ty:${ty}px;
      --sz:${sz}px;
      --dur:${dur}s;
      --rot:${rot}deg;

      animation-delay:${(Math.random() * .18).toFixed(2)}s;
    `;

    document.body.appendChild(p);

    p.addEventListener('animationend', () => {
      p.remove();
    });

  }

}


/* ═══════════════════════════════════════════════════
   CENA 2 — ENVELOPE
═══════════════════════════════════════════════════ */
function goToLetter() {

  showScene('letter');

  initLetter();

}

function initLetter() {

  const wrap = $('envelopeWrap');
  const flap = $('flapFront');
  const hint = $('hintOpen');

  let clicked = false;

  setTimeout(() => {
    wrap.classList.add('envelope-idle');
  }, 500);

  function onEnvelopeClick() {

    if (clicked) return;
    clicked = true;

    wrap.classList.remove('envelope-idle');

    // abre a aba (ANIMAÇÃO REAL)
    flap.style.transition = "transform 0.8s ease";
    flap.style.transformOrigin = "120px 60px";
    flap.style.transform = "rotateX(180deg)";

    // texto
    setTimeout(() => {
      hint.textContent = 'Uma mensagem para você…';
    }, 300);

    // sai envelope
    setTimeout(() => {
      wrap.style.transition = "transform 0.6s ease, opacity 0.6s ease";
      wrap.style.transform = "translateY(-40px)";
      wrap.style.opacity = "0";
    }, 900);

    // próxima cena
    setTimeout(() => {
      goToCard();
    }, 1500);
  }

  wrap.addEventListener('click', onEnvelopeClick);
  wrap.addEventListener('touchstart', onEnvelopeClick, { passive: true });
}


/* ═══════════════════════════════════════════════════
   CENA 3 — CARTÃO
═══════════════════════════════════════════════════ */
function goToCard() {

  showScene('card');

  initCardScene();

}

function initCardScene() {

  initFallingHearts();
  initStageDeco();
  revealCardLines();

}


/* ─────────────────────────────────────────
   Corações caindo
───────────────────────────────────────── */
function initFallingHearts() {

  const container = $('fallingHearts');

  const stage = document.querySelector('.stage');

  function h() {
    return stage ? stage.offsetHeight : 560;
  }

  for (let i = 0; i < 20; i++) {

    const el = document.createElement('span');

    el.className = 'fh';

    el.textContent =
      SYMS[Math.floor(Math.random() * SYMS.length)];

    const sz  = 10 + Math.random() * 14;
    const dur = 5 + Math.random() * 8;
    const del = -(Math.random() * dur);

    const hue =
      Math.random() < .5
      ? 340 + Math.random() * 20
      : 0;

    el.style.cssText = `
      font-size:${sz}px;
      left:${Math.random() * 100}%;

      color:hsl(
        ${hue},
        ${80 + Math.random() * 20}%,
        ${52 + Math.random() * 18}%
      );

      --sh:${h()}px;

      animation-duration:${dur}s;
      animation-delay:${del}s;
    `;

    container.appendChild(el);

  }

  window.addEventListener('resize', () => {

    container.querySelectorAll('.fh').forEach(e => {
      e.style.setProperty('--sh', h() + 'px');
    });

  });

}


/* ─────────────────────────────────────────
   Decorações do stage
───────────────────────────────────────── */
function initStageDeco() {

  const c = $('stageDeco');
  for (let i = 0; i < 12; i++) {

    const el = document.createElement('span');

    el.className = 'sd';

    el.textContent =
      SYMS[Math.floor(Math.random() * SYMS.length)];

    const sz  = 12 + Math.random() * 12;
    const dur = 3 + Math.random() * 5;
    const del = -(Math.random() * dur);

    el.style.cssText = `
      --sz:${sz}px;

      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;

      --tx:${(Math.random() - .5) * 30}px;
      --ty:-${8 + Math.random() * 30}px;

      animation-duration:${dur}s;
      animation-delay:${del}s;
    `;

    c.appendChild(el);

  }

}


/* ─────────────────────────────────────────
   Texto aparecendo
───────────────────────────────────────── */
function revealCardLines() {

  const msg = document.querySelector('.card-msg');

  if (!msg) return;

  const raw = msg.innerHTML;

  const lines = raw
    .split('<br>')
    .filter(l => l.trim());

  msg.innerHTML =
    lines.map(l => `<span>${l}</span>`).join('');

  msg.classList.add('reveal');

  const spans = msg.querySelectorAll('span');

  spans.forEach((sp, i) => {

    setTimeout(() => {
      sp.classList.add('show');
    }, 600 + i * 320);

  });

}


/* ─────────────────────────────────────────
   Hover 3D cartão
───────────────────────────────────────── */
(function initCardHover() {

  const card = $('card');

  if (!card) return;

  let raf = null;
  let tx  = 0;
  let ty  = 0;

  card.addEventListener('mousemove', e => {

    const r = card.getBoundingClientRect();

    tx =
      ((e.clientX - r.left - r.width / 2) /
      (r.width / 2)) * 5;

    ty =
      -((e.clientY - r.top - r.height / 2) /
      (r.height / 2)) * 5;

    if (!raf) {

      raf = requestAnimationFrame(() => {

        card.style.transform = `
          perspective(600px)
          rotateY(${tx}deg)
          rotateX(${ty}deg)
          scale(1.02)
        `;

        raf = null;

      });

    }

  });

  card.addEventListener('mouseleave', () => {

    card.style.transition = 'transform 0.5s ease';

    card.style.transform = 'none';

    setTimeout(() => {
      card.style.transition = '';
    }, 520);

  });

  card.addEventListener('touchstart', () => {

    card.style.transition = 'transform 0.3s ease';

    card.style.transform = 'scale(1.025)';

  }, { passive: true });

  card.addEventListener('touchend', () => {

    card.style.transform = 'scale(1)';

    setTimeout(() => {
      card.style.transition = '';
    }, 330);

  }, { passive: true });

})();
