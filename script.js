/* ====================================================
   FILIP ROESSNER — PORTFOLIO JAVASCRIPT
   GSAP Animations | Three.js Globe | AI Chat | Terminal
   ==================================================== */

'use strict';

// ===========================
// LOADER
// ===========================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }
    initAll();
  }, 1700);
});

function initAll() {
  initGSAP();
  initHeroCanvas();
  initTyped();
  initNavbar();
  initMobileNav();
  initGlobe();
  initTerminal();
  initScrollReveal();
  initCounters();
  initLanguageBars();
  initChatInput();
}

// ===========================
// GSAP SCROLL ANIMATIONS
// ===========================
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  document.querySelectorAll('.reveal-up').forEach((el) => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.75, delay,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 89%', toggleActions: 'play none none none' }
    });
  });

  document.querySelectorAll('.reveal-left').forEach((el) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
    });
  });

  document.querySelectorAll('.reveal-right').forEach((el) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.from(header, {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: header, start: 'top 86%' }
    });
  });
}

// ===========================
// HERO CANVAS — PARTICLE FIELD
// ===========================
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    const count = Math.floor((w * h) / 9000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.5, alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.6 ? '#6c63ff' : (Math.random() > 0.5 ? '#00d4ff' : '#ffffff'),
    }));
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${(1 - d / 130) * 0.12})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    }
    if (mouse.x) {
      particles.forEach(p => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 160) * 0.25})`;
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      });
    }
  }

  function drawOrb(x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }

  function draw() {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#050811'); grad.addColorStop(1, '#080e1a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    drawOrb(w * 0.2, h * 0.3, 280, 'rgba(108,99,255,0.06)');
    drawOrb(w * 0.8, h * 0.6, 320, 'rgba(0,212,255,0.04)');
    drawConnections();
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill(); ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  new ResizeObserver(resize).observe(canvas.parentElement || document.body);
  resize(); draw();
}

// ===========================
// TYPED TEXT
// ===========================
function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrases = ['Student Developer', 'Java & Python Enthusiast', 'Minecraft Mod Creator', 'AI Explorer', 'Android Developer', 'Web Builder', 'Multilingual Coder'];
  let pi = 0, ci = 0, del = false;

  function type() {
    const cur = phrases[pi];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { setTimeout(() => { del = true; }, 1800); setTimeout(type, 2000); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, del ? 55 : 85);
  }
  setTimeout(type, 3200);
}

// ===========================
// NAVBAR
// ===========================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('navMobile');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  mobileNav.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ===========================
// GLOBE.GL 3D MAP
// ===========================
function initGlobe() {
  const container = document.getElementById('globeCanvas');
  if (!container || typeof Globe === 'undefined') return;

  // We are replacing the canvas element with a div for Globe.gl if it isn't already
  let globeDiv = container;
  if (container.tagName.toLowerCase() === 'canvas') {
    globeDiv = document.createElement('div');
    globeDiv.id = 'globeCanvas';
    globeDiv.style.width = '100%';
    globeDiv.style.height = '100%';
    globeDiv.style.overflow = 'visible';
    container.parentNode.replaceChild(globeDiv, container);
  }

  const tooltip = document.getElementById('globeTooltip');

  // Visited country ISO A3 codes
  const visitedISOs = [
    'DEU', 'FRA', 'ESP', 'ITA', 'NLD', 'BEL', 'CHE', 'AUT', 'LUX',
    'DNK', 'SWE', 'NOR', 'POL', 'CZE', 'SVK', 'HUN', 'HRV', 'SVN',
    'PRT', 'GRC', 'ROU', 'BGR', 'SRB', 'BIH', 'MNE', 'ALB', 'MKD',
    'MLT', 'CYP', 'TUR'
  ];

  const myGlobe = Globe()(globeDiv)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-water.png')
    .backgroundColor('rgba(0,0,0,0)')
    .showAtmosphere(true)
    .atmosphereColor('#00d4ff')
    .atmosphereAltitude(0.25)
    .polygonLabel(({ properties: d }) => {
      const isVisited = visitedISOs.includes(d.ISO_A3) || d.ADMIN === 'France' || d.ADM0_A3 === 'FRA';
      const icon = isVisited ? '✓ ' : '✗ ';
      const statusText = isVisited ? '— Visited' : '— Not visited';
      return '<div style="' +
        'background: rgba(0, 212, 255, 0.12); ' +
        'border: 1px solid rgba(0, 212, 255, 0.4); ' +
        'backdrop-filter: blur(12px); ' +
        'border-radius: 8px; ' +
        'padding: 6px 14px; ' +
        'font-family: Arial, sans-serif; ' +
        'font-size: 0.8rem; ' +
        'font-weight: 600; ' +
        'color: #00d4ff;' +
        '">' + icon + d.ADMIN + ' ' + statusText + '</div>';
    })
    .polygonAltitude(d => Math.max(0.01, Math.min(d.properties.POP_EST / 1e9, 0.06)))
    .polygonCapColor(d => {
      const p = d.properties;
      const isFrance = p.ADMIN === 'France' || p.ADM0_A3 === 'FRA' || p.NAME === 'France';
      const isVisited = visitedISOs.includes(p.ISO_A3) || isFrance;
      return isVisited ? 'rgba(0, 212, 255, 0.8)' : 'rgba(108, 99, 255, 0.1)';
    })
    .polygonSideColor(() => 'rgba(0, 50, 100, 0.1)')
    .polygonStrokeColor(() => '#111')
    .polygonsTransitionDuration(300);

  // Load GeoJSON data for countries
  fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
    .then(res => res.json())
    .then(countries => {
      myGlobe.polygonsData(countries.features);
    });

  // Fit sizing
  function updateSize() {
    const parent = globeDiv.parentElement;
    if (parent) {
      const w = parent.offsetWidth;
      const h = parent.offsetHeight || w;
      myGlobe.width(w).height(h);
    }
  }
  new ResizeObserver(updateSize).observe(globeDiv.parentElement);
  updateSize();

  // Custom Controls setup: auto-rotate and mouse interaction
  myGlobe.controls().autoRotate = true;
  myGlobe.controls().autoRotateSpeed = 1.2;
  myGlobe.controls().enableZoom = false;

  // Add stars (particles) in the background using Three.js inside the Globe scene
  const scene = myGlobe.scene();
  const starGeo = new THREE.BufferGeometry();
  const sv = [];
  for (let i = 0; i < 3000; i++) {
    sv.push((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sv, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.6 })));
}

// ===========================
// SCROLL COUNTERS
// ===========================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 40);
      const iv = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + '+';
        if (current >= target) clearInterval(iv);
      }, 40);
      new IntersectionObserver(() => { }).observe(el);
    });
  }, { threshold: 0.5 }).observe(counters[0] || document.body);
  counters.forEach(c => { });
  // Attach per-element
  counters.forEach(el => {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 40);
        const iv = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + '+';
          if (current >= target) clearInterval(iv);
        }, 40);
      }
    }, { threshold: 0.5 }).observe(el);
  });
}

// ===========================
// LANGUAGE SKILL BARS
// ===========================
function initLanguageBars() {
  const bars = document.querySelectorAll('.lang-bar-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.dataset.width + '%';
        setTimeout(() => { bar.style.width = targetWidth; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
}

// ===========================
// SCROLL REVEAL (fallback)
// ===========================
function initScrollReveal() {
  if (typeof gsap !== 'undefined') return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.75s ease, transform 0.75s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translate(0, 0)';
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

// ===========================
// TERMINAL
// ===========================
const terminalCommands = {
  help: () => `Available commands:
  whois filip      — Learn about Filip
      skills           — Programming skills
      projects         — List of projects
      experience       — Work history & timeline
      travel           — Countries visited
      languages        — Languages Filip speaks
      minecraft        — 🎮 Easter egg
      contact          — Contact details
      clear            — Clear terminal

      Tip: Use ↑ / ↓ keys to browse history, Tab to autocomplete.`,

  'whois filip': () => `┌───────────────────────────────────────────┐
│  Filip Roessner                           │
│  Location: Berlin, Germany                │
│  School:   Andreas Gymnasium Berlin       │
│  Role:     Student Developer              │
│  Interests: Java, AI, Minecraft, Travel   │
│  Email:    fipvip.roessner@gmail.com      │
│  GitHub:   github.com/Filiproessner       │
│  Modrinth: modrinth.com/user/Filiproessner│
└───────────────────────────────────────────┘`,

  skills: () => `Programming Languages:
  ★★★★☆  Java          — Minecraft mods, Android, desktop apps
  ★★★☆☆  Python        — Scripting, automation, AI prototyping
  ★★★☆☆  JavaScript    — Web dev, SaaS frontends
  ★★★☆☆  HTML/CSS      — Responsive, modern frontend
  ★★☆☆☆  MySQL         — Database design & queries

Modding:
  → Fabric API, Mixin, Gradle (Minecraft Java Edition)

Tools:
  → Git, IntelliJ IDEA, Android Studio, VS Code`,

  projects: () => `Projects:
  [1] Minecraft Mods    — Fabric mods (Java, Mixin, Gradle)
  [2] IOWorks           — AI-native B2B SaaS platform ⭐
  [3] Gesture Launcher  — Android shortcut app (Java)
  [4] TuntungTung Sahur — Experimental Android app
  [5] FileSorter        — Python file organiser
  [6] Sudoku Generator  — Java puzzle engine
  [7] Web Projects      — Custom sites & freelance
  [8] Content Creation  — Tech & gaming content`,

  experience: () => `Timeline:
  ▶ 2020  Started at Andreas Gymnasium Berlin (grade 5)
  ▶ 2025  Internship at Diebold Nixdorf (enterprise software)
  ▶ 2026  Started building IO Works (AI SaaS)  ← current
  ▶ 2026–2028  Abitur phase at Andreas Gymnasium`,

  travel: () => `Countries visited (30+):
  Europe: Germany, France, Spain, Italy, Netherlands,
          Belgium, Switzerland, Austria, Luxembourg,
          Denmark, Sweden, Norway, Poland, Czech Republic,
          Slovakia, Hungary, Croatia, Slovenia, Portugal,
          Greece, Romania, Bulgaria, Serbia, Bosnia,
          Montenegro, Albania, N. Macedonia, Malta, Cyprus
  
  Other:  Turkey
  
  Not yet visited: Iceland, Finland, Russia, UK, Ireland ...`,

  languages: () => `Languages:
  German   — Native (100%)
  English  — Fluent (90%)
  Serbian  — Conversational (85%)
  French   — Intermediate (55%)
  
  Also understands: Croatian, Bosnian, Montenegrin
  (closely related to Serbian)`,

  contact: () => `Contact:
  Email:    fipvip.roessner@gmail.com
  GitHub:   github.com/Filiproessner
  Modrinth: modrinth.com/user/Filiproessner
  Instagram: @f1lip210`,

  minecraft: () => `> Checking Minecraft session...

  Filip definitely spends too much time in Minecraft.
  Framework: Fabric  |  Language: Java 17+
  Mixin: yes  |  Gradle: yes
  Hours played: [DATA EXPUNGED]
  Diamonds found: enough
  Profile: modrinth.com/user/Filiproessner`,

  clear: () => '__CLEAR__',
};

function initTerminal() {
  const input = document.getElementById('terminalInput');
  const body = document.getElementById('terminalBody');
  if (!input || !body) return;

  let history = [], histIdx = -1;

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      if (!cmd) return;
      history.unshift(cmd);
      histIdx = -1;
      appendCmd(cmd);
      const result = executeCmd(cmd);
      if (result === '__CLEAR__') {
        body.innerHTML = '';
        appendLine('Terminal cleared. Type <strong>help</strong>.', 'term-text');
      } else {
        appendOutput(result);
      }
      input.value = '';
      body.scrollTop = body.scrollHeight;
    }
    if (e.key === 'ArrowUp') { histIdx = Math.min(histIdx + 1, history.length - 1); input.value = history[histIdx] || ''; }
    if (e.key === 'ArrowDown') { histIdx = Math.max(histIdx - 1, -1); input.value = histIdx === -1 ? '' : history[histIdx]; }
    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.trim().toLowerCase();
      const match = Object.keys(terminalCommands).find(k => k.startsWith(partial));
      if (match) input.value = match;
    }
  });

  function executeCmd(cmd) {
    if (terminalCommands[cmd]) return terminalCommands[cmd]();
    if (cmd === 'ls' || cmd === 'dir') return terminalCommands.projects();
    if (cmd === 'whoami') return terminalCommands['whois filip']();
    if (cmd === 'pwd') return '/home/filip/portfolio';
    if (cmd.startsWith('echo ')) return cmd.slice(5);
    if (cmd === 'modrinth') return 'Opening modrinth.com/user/Filiproessner ...\n  → Minecraft mods by Filip';
    return `bash: ${cmd}: command not found\nType 'help' for available commands.`;
  }

  function appendCmd(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line term-cmd';
    line.innerHTML = `<span class="term-prompt">filip@portfolio:~$</span><span class="term-input-typed"> ${escHtml(cmd)}</span>`;
    body.appendChild(line);
  }

  function appendOutput(text) {
    const line = document.createElement('div');
    line.className = 'term-line';
    const span = document.createElement('span');
    span.className = 'term-output';
    span.textContent = text;
    line.appendChild(span);
    body.appendChild(line);
  }

  function appendLine(html, cls) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="${cls}">${html}</span>`;
    body.appendChild(line);
  }

  document.querySelector('.terminal-wrapper')?.addEventListener('click', () => input.focus());
}

function escHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===========================
// AI CHAT — REAL API + FALLBACK
// ===========================
const AI_API_KEY = 'e0DyJPe0MBijWF2wOLJga0E2ElKZhy9X';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const FILIP_SYSTEM_PROMPT = `You are an AI assistant on Filip Roessner's personal portfolio website. You know everything about Filip and answer questions about him in a friendly, informative way.

FACTS ABOUT FILIP:
- Full name: Filip Roessner
- Location: Berlin, Germany
- Born/raised in Berlin
- School: Andreas Gymnasium Berlin (since grade 5, around 2020)
- Currently in Abitur phase (2026–2028)

PROGRAMMING SKILLS:
- Java (advanced) — main language, used for Minecraft mods, Android apps, desktop apps
- Python (intermediate) — scripting, automation, AI prototyping, wrote FileSorter utility
- JavaScript (intermediate) — web development, SaaS frontends like IOWorks
- HTML & CSS (intermediate) — modern, responsive frontend
- MySQL (beginner-intermediate) — database design and queries
- Modding: Fabric API, Mixin bytecode library, Gradle build system

TOOLS: Git, GitHub, IntelliJ IDEA, Android Studio, VS Code

PROJECTS:
1. Minecraft Mods (Java, Fabric, Mixin, Gradle) — published on Modrinth: modrinth.com/user/Filiproessner
2. IOWorks — AI-native B2B SaaS for workflow automation, meeting summaries, reports, AI integrations
3. Android Gesture Launcher — custom gesture-based app shortcut launcher for Android
4. TuntungTung Sahur App — experimental Android app project
5. FileSorter — Python script that automatically sorts files into folders by file type
6. Sudoku Generator — Java puzzle generator & solver with difficulty levels
7. Web Development — builds websites, occasionally for others as small freelance projects
8. Content Creation — tech and gaming content online

WORK EXPERIENCE:
- Internship at Diebold Nixdorf (2025) — global banking & retail tech company, enterprise software
- Started IO Works (2026) — AI SaaS, frontend, AI integrations, product development

LANGUAGES (human):
- German: native (100%)
- English: fluent (90%)
- Serbian: conversational (85%) — also understands Croatian, Bosnian, Montenegrin
- French: intermediate (55%)

TRAVEL:
- Visited 30+ countries, almost all of Europe
- NOT visited: Iceland, Finland, Russia, Belarus, Estonia, Latvia, Lithuania, Moldova, Ukraine, Ireland, UK
- Also visited Turkey

CONTACT:
- Email: fipvip.roessner@gmail.com
- GitHub: github.com/Filiproessner
- Modrinth: modrinth.com/user/Filiproessner
- Instagram: @f1lip210

PERSONALITY NOTES: Filip is curious, self-taught, passionate about building things, interested in AI, loves Minecraft.

Keep answers concise but informative. If asked something not in the context, say you only know about Filip.`;

const filipKnowledgeLocal = {
  name: 'Filip Roessner',
  skills: ['Java', 'Python', 'JavaScript', 'HTML/CSS', 'MySQL', 'Fabric', 'Mixin'],
};

function generateLocalResponse(q) {
  const ql = q.toLowerCase();
  if (ql.includes('language') || ql.includes('programming') || ql.includes('skill') || ql.includes('code') || ql.includes('know'))
    return `Filip knows several languages:\n\n• **Java** (advanced) — Minecraft mods, Android, desktop apps\n• **Python** (intermediate) — scripting, automation, FileSorter\n• **JavaScript** (intermediate) — web & SaaS\n• **HTML/CSS** — responsive frontends\n• **MySQL** — databases\n\nModding tools: **Fabric API**, **Mixin**, **Gradle**`;
  if (ql.includes('minecraft') || ql.includes('mod') || ql.includes('fabric'))
    return `Minecraft is one of Filip's biggest passions!\n\nHe creates mods using the **Fabric** framework with **Mixin** for bytecode injection and **Gradle** as the build system — solid, production-level modding workflow.\n\nCheck his Modrinth profile: **modrinth.com/user/Filiproessner**`;
  if (ql.includes('project') || ql.includes('built') || ql.includes('made'))
    return `Filip has built these projects:\n\n**Minecraft Mods** (Fabric, Java)\n**IOWorks** — AI B2B SaaS ⭐\n**Gesture Launcher** — Android\n**TuntungTung Sahur** — Android (experimental)\n**FileSorter** — Python automation tool\n**Sudoku Generator** — Java\n**Web Projects** — freelance/hobby\n\nSee GitHub: github.com/Filiproessner`;
  if (ql.includes('ioworks') || ql.includes('saas') || ql.includes('ai'))
    return `**IOWorks** is Filip's featured project — an AI-native B2B SaaS platform for workflow automation.\n\nIt includes: meeting summaries, report generation, requirements translation, and AI-powered team task management. Built with JavaScript and LLM API integrations.`;
  if (ql.includes('travel') || ql.includes('visit') || ql.includes('countr') || ql.includes('been'))
    return `Filip has visited **30+ countries** — almost all of Europe!\n\nIncludes: Germany, France, Spain, Italy, Scandinavia, Eastern Europe (Poland, Czech Republic, Hungary, Croatia, etc.), Balkans (Serbia, Bosnia, Montenegro...), Malta, Cyprus.\n\nOutside Europe: **Turkey**\n\nThe globe on this page highlights all visited countries in blue!`;
  if (ql.includes('human language') || ql.includes('speak') || ql.includes('linguistic') || ql.includes('german') || ql.includes('english') || ql.includes('french') || ql.includes('serbian'))
    return `Filip speaks:\n\n**German** — native\n**English** — fluent\n**Serbian** — conversational (also understands Croatian, Bosnian, Montenegrin)\n**French** — intermediate\n\nCheck the Languages section on this page for the skill bars!`;
  if (ql.includes('experience') || ql.includes('work') || ql.includes('internship') || ql.includes('job'))
    return `Filip's professional experience:\n\n**Diebold Nixdorf** (2025) — internship at a global banking & retail tech company\n\n**IO Works** (2026–present) — building an AI-native B2B SaaS platform as developer & co-founder\n\n**Andreas Gymnasium Berlin** — student since grade 5 (2020), Abitur phase 2026–2028`;
  if (ql.includes('contact') || ql.includes('email') || ql.includes('reach') || ql.includes('hire'))
    return `**Email:** fipvip.roessner@gmail.com\n**GitHub:** github.com/Filiproessner\n**Modrinth:** modrinth.com/user/Filiproessner\n**Instagram:** @f1lip210\n\nFilip is open to collaborations and interesting projects!`;
  if (ql.includes('python') || ql.includes('filesorter') || ql.includes('file sorter'))
    return `Filip uses **Python** for scripting and automation.\n\n**FileSorter** is one of his Python projects — it automatically organises files into folders based on file type (images, videos, documents, code, etc.). Clean, practical utility scripting.`;
  if (ql.includes('hello') || ql.includes('hi') || ql.includes('hey'))
    return `Hey! I'm Filip's AI assistant. I know all about Filip Roessner — his projects, skills, travel, languages, and experience.\n\nWhat would you like to know?`;
  return `Here's a quick overview of **Filip Roessner**:\n\nBerlin, Germany\nAndreas Gymnasium Berlin\nJava, Python, JavaScript\nMinecraft mod developer (Fabric)\nBuilding IOWorks (AI SaaS)\n30+ countries visited\nSpeaks German, English, Serbian, French\n\nFeel free to ask me anything specific!`;
}

async function callMistralAPI(userMessage) {
  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: FILIP_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error(`API ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

function openAIChat() {
  const widget = document.getElementById('aiChatWidget');
  if (widget) {
    widget.classList.add('open');
    const icon = document.getElementById('chatToggleIcon');
    if (icon) { icon.className = 'fas fa-times'; }
    document.getElementById('chatInput')?.focus();
  }
}

function closeAIChat() {
  const widget = document.getElementById('aiChatWidget');
  if (widget) widget.classList.remove('open');
  const icon = document.getElementById('chatToggleIcon');
  if (icon) icon.className = 'fas fa-robot';
}

function toggleAIChat() {
  const widget = document.getElementById('aiChatWidget');
  if (widget && widget.classList.contains('open')) {
    closeAIChat();
  } else {
    openAIChat();
  }
}

function sendSuggestion(btn) {
  const text = btn.textContent;
  btn.closest('.chat-suggestions')?.remove();
  const input = document.getElementById('chatInput');
  if (input) input.value = text;
  sendChatMessage();
}

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  if (!input || !messages) return;

  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<div class="msg-content">${escHtml(text)}</div>`;
  messages.appendChild(userMsg);

  // Typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-msg ai';
  typingEl.innerHTML = `<div class="chat-typing"><span></span><span></span><span></span></div>`;
  messages.appendChild(typingEl);
  messages.scrollTop = messages.scrollHeight;

  // Update subtitle
  const subtitle = document.getElementById('chatSubtitle');
  if (subtitle) subtitle.textContent = 'AI is thinking...';

  try {
    // Try real API first
    const response = await callMistralAPI(text);
    typingEl.remove();
    appendChatAI(messages, response);
    if (subtitle) subtitle.textContent = 'AI-powered · Knows everything';
  } catch {
    // Fallback to local knowledge base
    const delay = 800 + Math.random() * 400;
    setTimeout(() => {
      typingEl.remove();
      appendChatAI(messages, generateLocalResponse(text));
      if (subtitle) subtitle.textContent = 'Knowledge base mode';
    }, delay);
  }
}

function appendChatAI(messages, response) {
  const aiMsg = document.createElement('div');
  aiMsg.className = 'chat-msg ai';
  const formatted = response
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  aiMsg.innerHTML = `<div class="msg-content">${formatted}</div>`;
  messages.appendChild(aiMsg);
  messages.scrollTop = messages.scrollHeight;
}

function initChatInput() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });
}


// ===========================
// CV DOWNLOAD (jsPDF)
// ===========================
function downloadCV() {
  if (typeof window.jspdf === 'undefined') {
    // Try dynamic import
    alert('CV is being generated...');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, M = 20;

  // Header
  doc.setFillColor(20, 12, 50); doc.rect(0, 0, W, 52, 'F');
  doc.setFillColor(108, 99, 255); doc.rect(0, 52, W, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(28);
  doc.text('Filip Roessner', M, 22);

  doc.setFont('helvetica', 'normal'); doc.setFontSize(13);
  doc.setTextColor(190, 190, 220);
  doc.text('Student Developer  |  Berlin, Germany', M, 33);

  doc.setFontSize(8.5); doc.setTextColor(150, 150, 200);
  doc.text('fipvip.roessner@gmail.com   |   github.com/Filiproessner   |   +49 151 40362110', M, 44);

  let y = 65;
  doc.setTextColor(30, 30, 50);

  function sec(title) {
    doc.setFillColor(108, 99, 255); doc.rect(M, y - 4, 4, 10, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(30, 30, 60);
    doc.text(title, M + 8, y + 3); y += 13;
    doc.setDrawColor(210, 210, 235); doc.line(M, y - 5, W - M, y - 5); y += 2;
  }

  function body(text, indent = 0) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(55, 55, 80);
    const lines = doc.splitTextToSize(text, W - M * 2 - indent);
    doc.text(lines, M + indent, y); y += lines.length * 5.5 + 3;
  }

  function bold(text) {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(25, 25, 55);
    doc.text(text, M, y); y += 7;
  }

  function bullet(text) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(55, 55, 80);
    doc.text('•', M + 2, y);
    const lines = doc.splitTextToSize(text, W - M * 2 - 10);
    doc.text(lines, M + 9, y); y += lines.length * 5.5 + 2;
  }

  sec('About');
  body('I am a student developer from Berlin, Germany, attending Andreas Gymnasium Berlin since grade 5. I combine academic learning with real-world software development in Java, Python, and JavaScript, and I am currently building IOWorks, an AI-native B2B SaaS platform.');
  y += 2;

  sec('Education');
  bold('Andreas Gymnasium Berlin'); body('Student since 2020 (Grade 5)  ·  Currently in Abitur phase (2026–2028)', 4);
  y += 2;

  sec('Experience');
  bold('Internship — Diebold Nixdorf  (2025)');
  body('International technology company specialising in banking and retail software. Worked alongside professional dev teams.', 4); y += 4;
  bold('Developer — IO Works  (2026–present)');
  body('Building IOWorks, an AI-native B2B SaaS for workflow automation. Frontend development, AI API integration, product architecture.', 4);
  y += 2;

  sec('Skills');
  bold('Programming:');
  bullet('Java (Advanced) — Minecraft mods (Fabric, Mixin), Android apps, desktop apps');
  bullet('Python (Intermediate) — Scripting, automation, AI prototyping');
  bullet('JavaScript (Intermediate) — Web development, SaaS frontends');
  bullet('HTML & CSS — Responsive frontend design');
  bullet('MySQL — Database design and queries');
  y += 2;
  bold('Tools:');
  bullet('Git & GitHub, IntelliJ IDEA, Android Studio, VS Code');
  bullet('Minecraft Fabric API, Mixin, Gradle');
  y += 2;

  sec('Languages');
  bullet('German — Native');
  bullet('English — Fluent');
  bullet('Serbian — Conversational (also understands Croatian, Bosnian, Montenegrin)');
  bullet('French — Intermediate');
  y += 2;

  sec('Interests');
  body('Minecraft mod development, Artificial Intelligence, Android development, Travel (30+ countries visited), Web Development, Content Creation.');

  // Footer
  doc.setFillColor(240, 240, 252); doc.rect(0, 280, W, 17, 'F');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(140, 140, 175);
  doc.text('Filip Roessner  ·  fipvip.roessner@gmail.com  ·  github.com/Filiproessner  ·  CV 2026', W / 2, 290, { align: 'center' });

  doc.save('Filip_Roessner_CV.pdf');
}

// ===========================
// SMOOTH ANCHOR SCROLLING
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href')?.slice(1);
    const target = id && document.getElementById(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
