/* Avenix main.js v4 – complete (Bootstrap 5 + GSAP) */
const KES_PER_USD = 129; // update the exchange rate when you like
const WHATSAPP = '254721156350', EMAIL = 'chengeseth25@gmail.com';

/* M-Pesa: the real work happens on YOUR server (Daraja keys must never be in this file).
   POST stkUrl    {phone:"2547XXXXXXXX", amount:500, product:"vchess"} -> {checkoutRequestId}
   GET  statusUrl?id=<checkoutRequestId> -> {status:"pending"|"paid"|"failed", downloadUrl?:"..."}
   The server returns downloadUrl only after Safaricom confirms payment on your callback. */
const MPESA = { stkUrl: '/api/mpesa/stkpush', statusUrl: '/api/mpesa/status', amount: 500, product: 'vchess' };

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $$('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
  $$('a.soon').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  // Navbar line + back-to-top
  const nav = $('#mainNav'), top = $('#toTop');
  const onScroll = () => { nav && nav.classList.toggle('scrolled', scrollY > 10); top && top.classList.toggle('show', scrollY > 600); };
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  top && top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Active link (desktop bar and sidebar)
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach(l => {
    const on = l.getAttribute('href') === page; l.classList.toggle('active', on);
    on ? l.setAttribute('aria-current', 'page') : l.removeAttribute('aria-current');
  });

  // Sidebar: Services is a dropdown that stays closed until tapped
  const drawer = $('#navDrawer');
  if (drawer) {
    $$('.has-sub', drawer).forEach(li => {
      const link = $(':scope > .nav-link', li), sub = $('.sub', li);
      const all = document.createElement('li'); all.innerHTML = '<a href="services.html">All services</a>'; sub.prepend(all);
      link.setAttribute('role', 'button'); link.setAttribute('aria-haspopup', 'true'); link.setAttribute('aria-expanded', 'false');
      link.addEventListener('click', e => { e.preventDefault(); link.setAttribute('aria-expanded', li.classList.toggle('open')); });
    });
    $$('a', drawer).forEach(a => a.addEventListener('click', () => {
      if (a.parentElement.classList.contains('has-sub')) return; // dropdown toggle, keep the sidebar open
      const i = bootstrap.Offcanvas.getInstance(drawer); i && i.hide();
    }));
    drawer.addEventListener('hidden.bs.offcanvas', () => $$('.has-sub', drawer).forEach(li => { li.classList.remove('open'); $(':scope > .nav-link', li).setAttribute('aria-expanded', 'false'); }));
  }
  $$('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  // Never allow sideways dragging
  let sx = 0, sy = 0;
  addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchmove', e => {
    if (e.touches.length > 1 || e.target.closest('.carousel,input,textarea,select')) return;
    if (Math.abs(e.touches[0].clientX - sx) > Math.abs(e.touches[0].clientY - sy) && e.cancelable) e.preventDefault();
  }, { passive: false });
  addEventListener('scroll', () => { if (scrollX) scrollTo(0, scrollY); }, { passive: true });

  // Tool tiles: duplicate for a seamless loop
  $$('.marq-track').forEach(t => t.innerHTML += t.innerHTML);

  // Images that should appear at their natural size (app screenshot, portrait)
  $$('.app-shot img,.portrait img').forEach(img => {
    const ok = () => img.parentNode.classList.add('has');
    img.complete && img.naturalWidth ? ok() : img.addEventListener('load', ok);
  });

  // Currency pill (services page)
  const fmt = n => new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(n);
  const setCur = c => {
    $$('.price').forEach(p => { const k = +p.dataset.ksh; p.textContent = c === 'USD' ? '$' + fmt(Math.round(k / KES_PER_USD)) : 'KSh ' + fmt(k); });
    $$('.cur button').forEach(b => b.setAttribute('aria-pressed', b.dataset.cur === c));
    try { localStorage.setItem('avenix-cur', c); } catch (e) {}
  };
  let saved = 'KSH'; try { saved = localStorage.getItem('avenix-cur') || 'KSH'; } catch (e) {}
  $$('.cur button').forEach(b => b.addEventListener('click', () => setCur(b.dataset.cur)));
  if ($('.cur')) setCur(saved);

  // Two-tone borders flip as cards scroll into view
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2 });
  $$('.bx').forEach(el => io.observe(el));

  // Projects filter
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('[data-status]').forEach(c => c.hidden = b.dataset.filter !== 'all' && c.dataset.status !== b.dataset.filter);
  }));

  // Contact form: opens WhatsApp (or email) with the message filled in
  const form = $('#contactForm');
  if (form) {
    const sel = form.elements.service, q = new URLSearchParams(location.search).get('service');
    if (q && $$('option', sel).some(o => o.value === q)) sel.value = q;
    const text = () => { const d = new FormData(form); return `Hello Avenix, my name is ${d.get('name')}.\nService: ${sel.selectedOptions[0].text}\nPhone: ${d.get('phone') || '-'}\n\n${d.get('message')}`; };
    const note = t => $('#formMsg').textContent = t;
    form.addEventListener('submit', e => {
      e.preventDefault();
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text())}`, '_blank', 'noopener');
      note('Opening WhatsApp with your message. Just press send there.');
    });
    $('#mailBtn').addEventListener('click', () => {
      if (!form.reportValidity()) return;
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Enquiry: ' + sel.selectedOptions[0].text)}&body=${encodeURIComponent(text())}`;
      note('Opening your email app.');
    });
  }

  // V Chess: pay with M-Pesa, then reveal the download link
  const payBtn = $('#payBtn');
  if (payBtn) {
    const msg = (t, c) => { const m = $('#payMsg'); m.textContent = t; m.className = 'small mt-2 ' + (c || ''); };
    const norm = v => { v = v.replace(/\D/g, ''); if (/^0[17]\d{8}$/.test(v)) return '254' + v.slice(1); if (/^[17]\d{8}$/.test(v)) return '254' + v; return /^254[17]\d{8}$/.test(v) ? v : null; };
    const done = url => { $('#payStep').classList.add('d-none'); $('#payDone').classList.remove('d-none'); $('#dlLink').href = url; };
    payBtn.addEventListener('click', async () => {
      const phone = norm($('#mpPhone').value);
      if (!phone) return msg('Enter a valid Safaricom number, for example 0712 345 678.', 'err');
      payBtn.disabled = true; msg('Check your phone and enter your M-Pesa PIN...');
      try {
        const r = await fetch(MPESA.stkUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, amount: MPESA.amount, product: MPESA.product }) });
        if (!r.ok) throw new Error('stk');
        const { checkoutRequestId } = await r.json();
        for (let i = 0; i < 40; i++) {
          await new Promise(s => setTimeout(s, 3000));
          const s = await (await fetch(MPESA.statusUrl + '?id=' + encodeURIComponent(checkoutRequestId))).json();
          if (s.status === 'paid' && s.downloadUrl) return done(s.downloadUrl);
          if (s.status === 'failed') throw new Error('failed');
        }
        throw new Error('timeout');
      } catch (e) {
        msg(e.message === 'failed' ? 'The payment was cancelled or failed. Please try again.' : 'Payments are not live yet. Message us on WhatsApp and we will help you get the app.', 'err');
      }
      payBtn.disabled = false;
    });
  }

  // GSAP
  if (reduce || typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if ($('.hero-art')) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero h1', { y: 28, opacity: 0, duration: .8 })
      .from('.hero .lead, .hero .hero-cta', { y: 18, opacity: 0, stagger: .12, duration: .6 }, '-=.4')
      .from('.ribbon-blue', { x: -60, y: -40, opacity: 0, duration: 1 }, .1)
      .from('.ribbon-amber', { x: 60, y: 40, opacity: 0, duration: 1 }, .3)
      .from('.chip', { scale: .7, opacity: 0, stagger: .12, duration: .5, ease: 'back.out(1.6)' }, '-=.5');
    gsap.to('.ribbon-blue', { y: -12, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.ribbon-amber', { y: 12, duration: 3.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.chip', { y: -7, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .45 });
  } else if ($('.page-hero')) {
    gsap.from('.page-hero .container > *', { y: 22, opacity: 0, stagger: .1, duration: .7, ease: 'power2.out' });
  }
  $$('.svc .shot,.proj,.neo-card').forEach(el => gsap.from(el, { y: 36, opacity: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
});
