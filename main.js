/* Avenix main.js v2 – Bootstrap 5 + GSAP */
const KES_PER_USD = 129; // update this exchange rate when you like
document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
  document.querySelectorAll('a.soon').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  const nav = document.getElementById('mainNav'), top = document.getElementById('toTop');
  const onScroll = () => { nav && nav.classList.toggle('scrolled', scrollY > 10); top && top.classList.toggle('show', scrollY > 600); };
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  top && top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navDrawer .nav-link').forEach(l => {
    const on = l.getAttribute('href') === page; l.classList.toggle('active', on);
    on ? l.setAttribute('aria-current', 'page') : l.removeAttribute('aria-current');
  });
  const drawer = document.getElementById('navDrawer');
  drawer && drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    const i = bootstrap.Offcanvas.getInstance(drawer); i && i.hide();
  }));
  document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  // Logo strip: duplicate items for a seamless loop
  document.querySelectorAll('.marq-track').forEach(t => t.innerHTML += t.innerHTML);

  // Currency pill: KSh <-> USD (prices are stored in KSh)
  const fmt = (n, c) => new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(n);
  const setCur = c => {
    document.querySelectorAll('.price').forEach(p => {
      const k = +p.dataset.ksh; p.textContent = c === 'USD' ? '$' + fmt(Math.round(k / KES_PER_USD)) : 'KSh ' + fmt(k);
    });
    document.querySelectorAll('.cur button').forEach(b => b.setAttribute('aria-pressed', b.dataset.cur === c));
    try { localStorage.setItem('avenix-cur', c); } catch (e) {}
  };
  let saved = 'KSH'; try { saved = localStorage.getItem('avenix-cur') || 'KSH'; } catch (e) {}
  document.querySelectorAll('.cur button').forEach(b => b.addEventListener('click', () => setCur(b.dataset.cur)));
  setCur(saved);

  // Cards: two-tone borders flip when scrolled into view
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .25 });
  document.querySelectorAll('.bx').forEach(el => io.observe(el));

  if (reduce || typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // One orchestrated moment: hero text, ribbons and tool chips
  if (document.querySelector('.hero-art')) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero h1', { y: 28, opacity: 0, duration: .8 })
      .from('.hero .lead, .hero .hero-cta', { y: 18, opacity: 0, stagger: .12, duration: .6 }, '-=.4')
      .from('.ribbon-blue', { x: -60, y: -40, opacity: 0, duration: 1 }, .1)
      .from('.ribbon-amber', { x: 60, y: 40, opacity: 0, duration: 1 }, .3)
      .from('.chip', { scale: .7, opacity: 0, stagger: .12, duration: .5, ease: 'back.out(1.6)' }, '-=.5');
    gsap.to('.ribbon-blue', { y: -12, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.ribbon-amber', { y: 12, duration: 3.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.chip', { y: -7, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .45 });
  } else {
    gsap.from('.page-hero .container > *', { y: 22, opacity: 0, stagger: .1, duration: .7, ease: 'power3.out' });
  }
  // Service blocks on the services page slide in from their image side
  gsap.utils.toArray('.svc .shot').forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));
});
