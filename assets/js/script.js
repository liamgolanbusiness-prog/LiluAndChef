/* Lilu & Chef — interactions */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Year ---------- */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      document.body.style.overflow = '';
    };
    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });
    // close when tapping any link inside the menu
    menu.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a) close();
    });
    // close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
    // close if window resizes up to desktop while menu is open
    const mq = window.matchMedia('(min-width: 981px)');
    const onMQ = (ev) => { if (ev.matches) close(); };
    mq.addEventListener ? mq.addEventListener('change', onMQ) : mq.addListener(onMQ);
  }

  /* ---------- Smooth anchor offset (account for sticky header on small) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      // Update focus for a11y
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- IntersectionObserver: reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          en.target.style.transitionDelay = (Math.min(i, 6) * 60) + 'ms';
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Hero parallax (mouse + scroll) ---------- */
  const stage = document.querySelector('.hero-stage');
  const floats = document.querySelectorAll('.float');
  if (stage && floats.length && !reduceMotion) {
    let mx = 0, my = 0, sy = 0;
    let raf = null;
    const apply = () => {
      floats.forEach(el => {
        const d = parseFloat(el.dataset.depth || '0.3');
        const tx = mx * 30 * d;
        const ty = my * 30 * d + sy * 40 * d;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
      raf = null;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(apply); };

    if (!isCoarse) {
      window.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        queue();
      });
    }
    document.addEventListener('scroll', () => {
      const stageRect = stage.getBoundingClientRect();
      sy = -stageRect.top / window.innerHeight; // 0 at top, +1 when scrolled out
      sy = Math.max(-1, Math.min(1, sy));
      queue();
    }, { passive: true });
  }

  /* ---------- 3D tilt on cards ---------- */
  const tilts = document.querySelectorAll('.tilt');
  if (!isCoarse && !reduceMotion && tilts.length) {
    tilts.forEach(card => {
      let rect;
      const onEnter = () => { rect = card.getBoundingClientRect(); };
      const onMove = (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;  // 0..1
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 8;   // tilt x
        const ry = (px - 0.5) * 10;  // tilt y
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      };
      const onLeave = () => {
        card.style.transform = '';
        rect = null;
      };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  /* ---------- Menu tabs ---------- */
  const tabs = document.querySelectorAll('.menu-tab');
  const dishes = document.querySelectorAll('.dish-card[data-cat]');
  if (tabs.length && dishes.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        const cat = tab.dataset.tab;
        dishes.forEach(d => {
          const match = d.dataset.cat === cat;
          d.hidden = !match;
        });
      });
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = 'יש להשלים את השדות המסומנים כחובה';
        note.className = 'form-note error';
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const lines = [];
      lines.push('הזמנה חדשה מאתר Lilu & Chef:');
      lines.push('');
      lines.push('שם: ' + (data.get('name') || ''));
      lines.push('טלפון: ' + (data.get('phone') || ''));
      if (data.get('email')) lines.push('אימייל: ' + data.get('email'));
      lines.push('סוג אירוע: ' + (data.get('event') || ''));
      if (data.get('guests')) lines.push('אורחים: ' + data.get('guests'));
      if (data.get('date'))   lines.push('תאריך: ' + data.get('date'));
      if (data.get('message')) {
        lines.push('');
        lines.push('פרטים נוספים:');
        lines.push(data.get('message'));
      }
      const text = encodeURIComponent(lines.join('\n'));
      const url = `https://wa.me/972544846106?text=${text}`;
      note.textContent = 'מעבירים אתכם לוואטסאפ עם פרטי ההזמנה...';
      note.className = 'form-note success';
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- Cookie ---------- */
  const cookie = document.getElementById('cookie');
  const cookieOk = document.getElementById('cookieOk');
  if (cookie && cookieOk) {
    try {
      if (!localStorage.getItem('lc_cookie_ok')) {
        setTimeout(() => { cookie.hidden = false; }, 1200);
      }
      cookieOk.addEventListener('click', () => {
        try { localStorage.setItem('lc_cookie_ok', '1'); } catch(_) {}
        cookie.hidden = true;
      });
    } catch(_) {}
  }

  /* ---------- Marquee performance: pause when off-screen ---------- */
  const ticker = document.querySelector('.ticker-track');
  if (ticker && 'IntersectionObserver' in window) {
    const tio = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        ticker.style.animationPlayState = en.isIntersecting ? 'running' : 'paused';
      });
    });
    tio.observe(ticker);
  }
})();
