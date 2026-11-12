/* =========================================================
   AVENIX  |  main.js  v5  (Bootstrap 5 + GSAP)

   TABLE OF CONTENTS
   01. Settings (exchange rate, contact details, M-Pesa)
   02. Helpers
   03. Tooltips and "coming soon" links
   04. Navbar line and back-to-top button
   05. Active menu link
   06. Mobile sidebar (Services dropdown)
   07. Footer year
   08. Block sideways dragging on touch screens
   09. Tools line (duplicate tiles for a seamless loop)
   10. Natural-size images (app screenshot, portrait)
   11. Currency switch (services page)
   12. Two-tone borders flip on scroll-in
   13. Projects filter
   14. Contact form (WhatsApp / email)
   15. V Chess payment (M-Pesa)
   16. GSAP animations
   ========================================================= */


/* =========================================================
   01. SETTINGS
   Edit these values when something changes
   ========================================================= */

// Update the exchange rate when you like
const KES_PER_USD = 129;

// Contact details used by the contact form
const WHATSAPP = '254721156350';
const EMAIL = 'chengeseth25@gmail.com';

/* M-Pesa: the real work happens on YOUR server
   (Daraja keys must never be in this file).

   POST stkUrl    {phone:"2547XXXXXXXX", amount:500, product:"vchess"}
                  -> {checkoutRequestId}

   GET  statusUrl?id=<checkoutRequestId>
                  -> {status:"pending"|"paid"|"failed", downloadUrl?:"..."}

   The server returns downloadUrl only after Safaricom
   confirms payment on your callback. */
const MPESA = {
	stkUrl: '/api/mpesa/stkpush',
	statusUrl: '/api/mpesa/status',
	amount: 500,
	product: 'vchess'
};


/* =========================================================
   Everything below runs once the page has loaded
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {


	/* =====================================================
	   02. HELPERS
	   $  = find one element     $$ = find many elements
	   ===================================================== */

	// True when the visitor prefers less motion
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

	const $ = (s, r = document) => r.querySelector(s);
	const $$ = (s, r = document) => [...r.querySelectorAll(s)];


	/* =====================================================
	   03. TOOLTIPS AND "COMING SOON" LINKS
	   ===================================================== */

	// Bootstrap tooltips (social icons in the footer)
	$$('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

	// Links marked "soon" do nothing when clicked
	$$('a.soon').forEach(a => {
		a.addEventListener('click', e => e.preventDefault());
	});


	/* =====================================================
	   04. NAVBAR LINE AND BACK-TO-TOP BUTTON
	   - Blue line under the navbar after scrolling 10px
	   - Back-to-top button shows after scrolling 600px
	   ===================================================== */
	const nav = $('#mainNav');
	const top = $('#toTop');

	const onScroll = () => {
		nav && nav.classList.toggle('scrolled', scrollY > 10);
		top && top.classList.toggle('show', scrollY > 600);
	};

	onScroll();
	addEventListener('scroll', onScroll, { passive: true });

	top && top.addEventListener('click', () => {
		scrollTo({ top: 0, behavior: 'smooth' });
	});


	/* =====================================================
	   05. ACTIVE MENU LINK
	   Highlights the link of the page you are on
	   (desktop bar and sidebar)
	   ===================================================== */
	const page = location.pathname.split('/').pop() || 'index.html';

	$$('.nav-link').forEach(l => {

		const on = l.getAttribute('href') === page;
		l.classList.toggle('active', on);

		if (on) {
			l.setAttribute('aria-current', 'page');
		} else {
			l.removeAttribute('aria-current');
		}

	});


	/* =====================================================
	   06. MOBILE SIDEBAR
	   Services is a dropdown that stays closed until tapped
	   ===================================================== */
	const drawer = $('#navDrawer');

	if (drawer) {

		// Set up every dropdown inside the sidebar
		$$('.has-sub', drawer).forEach(li => {

			const link = $(':scope > .nav-link', li);
			const sub = $('.sub', li);

			// Add an "All services" link at the top of the dropdown
			const all = document.createElement('li');
			all.innerHTML = '<a href="services.html">All services</a>';
			sub.prepend(all);

			// Accessibility attributes
			link.setAttribute('role', 'button');
			link.setAttribute('aria-haspopup', 'true');
			link.setAttribute('aria-expanded', 'false');

			// Tap to open / close the dropdown
			link.addEventListener('click', e => {
				e.preventDefault();
				link.setAttribute('aria-expanded', li.classList.toggle('open'));
			});

		});

		// Close the sidebar when a normal link is tapped
		$$('a', drawer).forEach(a => {
			a.addEventListener('click', () => {

				// Dropdown toggle: keep the sidebar open
				if (a.parentElement.classList.contains('has-sub')) return;

				const i = bootstrap.Offcanvas.getInstance(drawer);
				i && i.hide();

			});
		});

		// Reset every dropdown when the sidebar closes
		drawer.addEventListener('hidden.bs.offcanvas', () => {
			$$('.has-sub', drawer).forEach(li => {
				li.classList.remove('open');
				$(':scope > .nav-link', li).setAttribute('aria-expanded', 'false');
			});
		});

	}


	/* =====================================================
	   07. FOOTER YEAR
	   Keeps the copyright year up to date
	   ===================================================== */
	$$('.js-year').forEach(el => {
		el.textContent = new Date().getFullYear();
	});


	/* =====================================================
	   08. NEVER ALLOW SIDEWAYS DRAGGING
	   Blocks horizontal swipes on touch screens
	   (carousel and form fields are still allowed)
	   ===================================================== */
	let sx = 0;
	let sy = 0;

	// Remember where the finger started
	addEventListener('touchstart', e => {
		sx = e.touches[0].clientX;
		sy = e.touches[0].clientY;
	}, { passive: true });

	// Cancel the move if it is mostly sideways
	addEventListener('touchmove', e => {

		if (e.touches.length > 1 || e.target.closest('.carousel,input,textarea,select')) return;

		const sideways = Math.abs(e.touches[0].clientX - sx) > Math.abs(e.touches[0].clientY - sy);

		if (sideways && e.cancelable) e.preventDefault();

	}, { passive: false });

	// If the page ever shifts sideways, snap it back
	addEventListener('scroll', () => {
		if (scrollX) scrollTo(0, scrollY);
	}, { passive: true });


	/* =====================================================
	   09. TOOLS LINE
	   Duplicates the tiles inside every .marq-track so the
	   scroll loops seamlessly (the CSS moves it by -50%).
	   Works with the single line: one track = one copy.
	   ===================================================== */
	$$('.marq-track').forEach(t => {
		t.innerHTML += t.innerHTML;
	});


	/* =====================================================
	   10. NATURAL-SIZE IMAGES
	   Adds the class "has" to the parent once the image has
	   loaded (hides the dashed placeholder box)
	   ===================================================== */
	$$('.app-shot img,.portrait img').forEach(img => {

		const ok = () => img.parentNode.classList.add('has');

		if (img.complete && img.naturalWidth) {
			ok();
		} else {
			img.addEventListener('load', ok);
		}

	});


	/* =====================================================
	   11. CURRENCY SWITCH (services page)
	   Prices are stored in KSh in data-ksh and converted
	   to USD using KES_PER_USD
	   ===================================================== */

	// Formats a number like 12,500
	const fmt = n => new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(n);

	// Shows every price in the chosen currency (KSH or USD)
	const setCur = c => {

		$$('.price').forEach(p => {
			const k = +p.dataset.ksh;
			p.textContent = c === 'USD'
				? '$' + fmt(Math.round(k / KES_PER_USD))
				: 'KSh ' + fmt(k);
		});

		$$('.cur button').forEach(b => {
			b.setAttribute('aria-pressed', b.dataset.cur === c);
		});

		// Remember the choice for next visit
		try { localStorage.setItem('avenix-cur', c); } catch (e) {}

	};

	// Load the saved choice (default KSH)
	let saved = 'KSH';
	try { saved = localStorage.getItem('avenix-cur') || 'KSH'; } catch (e) {}

	// Switch buttons
	$$('.cur button').forEach(b => {
		b.addEventListener('click', () => setCur(b.dataset.cur));
	});

	// Apply on page load (only on pages that have the switch)
	if ($('.cur')) setCur(saved);


	/* =====================================================
	   12. TWO-TONE BORDERS
	   Adds the class "in" when a .bx element scrolls into
	   view, which flips the border colours (see the CSS)
	   ===================================================== */
	const io = new IntersectionObserver(es => {
		es.forEach(e => {
			if (e.isIntersecting) {
				e.target.classList.add('in');
				io.unobserve(e.target);
			}
		});
	}, { threshold: .2 });

	$$('.bx').forEach(el => io.observe(el));


	/* =====================================================
	   13. PROJECTS FILTER
	   Filter buttons show / hide cards by data-status
	   ===================================================== */
	$$('.filters button').forEach(b => {
		b.addEventListener('click', () => {

			// Mark the clicked button as the active one
			$$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));

			// Hide cards that do not match the filter
			$$('[data-status]').forEach(c => {
				c.hidden = b.dataset.filter !== 'all' && c.dataset.status !== b.dataset.filter;
			});

		});
	});


	/* =====================================================
	   14. CONTACT FORM
	   Opens WhatsApp (or the email app) with the message
	   already filled in
	   ===================================================== */
	const form = $('#contactForm');

	if (form) {

		const sel = form.elements.service;
		const q = new URLSearchParams(location.search).get('service');

		// Pre-select the service when the page is opened with ?service=...
		if (q && $$('option', sel).some(o => o.value === q)) sel.value = q;

		// Builds the message text from the form fields
		const text = () => {
			const d = new FormData(form);
			return `Hello Avenix, my name is ${d.get('name')}.\nService: ${sel.selectedOptions[0].text}\nPhone: ${d.get('phone') || '-'}\n\n${d.get('message')}`;
		};

		// Shows a short status message under the form
		const note = t => $('#formMsg').textContent = t;

		// Send button: opens WhatsApp
		form.addEventListener('submit', e => {
			e.preventDefault();
			window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text())}`, '_blank', 'noopener');
			note('Opening WhatsApp with your message. Just press send there.');
		});

		// Email button: opens the email app
		$('#mailBtn').addEventListener('click', () => {

			if (!form.reportValidity()) return;

			location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Enquiry: ' + sel.selectedOptions[0].text)}&body=${encodeURIComponent(text())}`;
			note('Opening your email app.');

		});

	}


	/* =====================================================
	   15. V CHESS PAYMENT (M-Pesa)
	   Pay with M-Pesa, then reveal the download link
	   ===================================================== */
	const payBtn = $('#payBtn');

	if (payBtn) {

		// Shows a message in the popup (c = "err" or "ok" for colour)
		const msg = (t, c) => {
			const m = $('#payMsg');
			m.textContent = t;
			m.className = 'small mt-2 ' + (c || '');
		};

		// Cleans a phone number into 2547XXXXXXXX / 2541XXXXXXXX (or null if invalid)
		const norm = v => {
			v = v.replace(/\D/g, '');
			if (/^0[17]\d{8}$/.test(v)) return '254' + v.slice(1);
			if (/^[17]\d{8}$/.test(v)) return '254' + v;
			return /^254[17]\d{8}$/.test(v) ? v : null;
		};

		// Payment confirmed: hide the form, show the download button
		const done = url => {
			$('#payStep').classList.add('d-none');
			$('#payDone').classList.remove('d-none');
			$('#dlLink').href = url;
		};

		// Pay button
		payBtn.addEventListener('click', async () => {

			// 1. Check the phone number
			const phone = norm($('#mpPhone').value);
			if (!phone) return msg('Enter a valid Safaricom number, for example 0712 345 678.', 'err');

			payBtn.disabled = true;
			msg('Check your phone and enter your M-Pesa PIN...');

			try {

				// 2. Ask the server to send the M-Pesa prompt to the phone
				const r = await fetch(MPESA.stkUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ phone, amount: MPESA.amount, product: MPESA.product })
				});
				if (!r.ok) throw new Error('stk');

				const { checkoutRequestId } = await r.json();

				// 3. Check the payment status every 3 seconds (up to 40 times = 2 minutes)
				for (let i = 0; i < 40; i++) {

					await new Promise(s => setTimeout(s, 3000));

					const s = await (await fetch(MPESA.statusUrl + '?id=' + encodeURIComponent(checkoutRequestId))).json();

					if (s.status === 'paid' && s.downloadUrl) return done(s.downloadUrl);
					if (s.status === 'failed') throw new Error('failed');

				}

				throw new Error('timeout');

			} catch (e) {

				msg(
					e.message === 'failed'
						? 'The payment was cancelled or failed. Please try again.'
						: 'Payments are not live yet. Message us on WhatsApp and we will help you get the app.',
					'err'
				);

			}

			payBtn.disabled = false;

		});

	}


	/* =====================================================
	   16. GSAP ANIMATIONS
	   Skipped when the visitor prefers less motion or when
	   GSAP failed to load
	   ===================================================== */
	if (reduce || typeof gsap === 'undefined') return;

	gsap.registerPlugin(ScrollTrigger);

	// ----- Home page hero -----
	if ($('.hero-art')) {

		// Intro: headline, text, buttons, ribbons, chips fly in
		gsap.timeline({ defaults: { ease: 'power3.out' } })
			.from('.hero h1', { y: 28, opacity: 0, duration: .8 })
			.from('.hero .lead, .hero .hero-cta', { y: 18, opacity: 0, stagger: .12, duration: .6 }, '-=.4')
			.from('.ribbon-blue', { x: -60, y: -40, opacity: 0, duration: 1 }, .1)
			.from('.ribbon-amber', { x: 60, y: 40, opacity: 0, duration: 1 }, .3)
			.from('.chip', { scale: .7, opacity: 0, stagger: .12, duration: .5, ease: 'back.out(1.6)' }, '-=.5');

		// Gentle floating loops
		gsap.to('.ribbon-blue', { y: -12, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
		gsap.to('.ribbon-amber', { y: 12, duration: 3.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
		gsap.to('.chip', { y: -7, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .45 });

	}
	// ----- Other pages: fade the page header in -----
	else if ($('.page-hero')) {

		gsap.from('.page-hero .container > *', { y: 22, opacity: 0, stagger: .1, duration: .7, ease: 'power2.out' });

	}

	// ----- Service photos, project cards, contact cards rise into view -----
	$$('.svc .shot,.proj,.neo-card').forEach(el => {
		gsap.from(el, {
			y: 36,
			opacity: 0,
			duration: .7,
			ease: 'power2.out',
			scrollTrigger: { trigger: el, start: 'top 90%', once: true }
		});
	});


});