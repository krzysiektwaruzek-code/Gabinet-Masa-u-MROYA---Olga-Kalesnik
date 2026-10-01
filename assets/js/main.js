/* ==========================================================================
   Gabinet Masażu Mroya — skrypt strony
   Zero zależności. Każdy moduł działa niezależnie i bezpiecznie pomija się,
   gdy odpowiedniego elementu nie ma w DOM.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nagłówek: tło po przewinięciu ---------- */
  var header = document.querySelector('[data-header]');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobilne ---------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  var mobileQuery = window.matchMedia('(max-width: 860px)');

  function setMenu(open) {
    if (!toggle || !nav || !header) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-open', open);
    document.body.style.overflow = open && mobileQuery.matches ? 'hidden' : '';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    // Kliknięcie w przyciemnione tło (pseudo-element nagłówka) zamyka menu
    header.addEventListener('click', function (e) {
      if (e.target === header) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    var closeOnDesktop = function () {
      if (!mobileQuery.matches) setMenu(false);
    };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', closeOnDesktop);
    else mobileQuery.addListener(closeOnDesktop);
  }

  /* ---------- Reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------- Podświetlanie aktywnej sekcji w menu ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav .nav-link'));

  if (navLinks.length && 'IntersectionObserver' in window) {
    var sections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + entry.target.id;
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Mapa ładowana po kliknięciu (prywatność + szybkość) ---------- */
  var mapBtn = document.querySelector('[data-map-load]');

  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var card = mapBtn.closest('[data-map]');
      var facade = card.querySelector('[data-map-facade]');
      var frame = document.createElement('iframe');

      frame.src = mapBtn.getAttribute('data-src');
      frame.title = 'Mapa Google: Gabinet Masażu Mroya, ul. Jaworowa 6, Gdańsk';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;

      card.appendChild(frame);
      facade.hidden = true;
      frame.focus();
    });
  }

  /* ---------- Formularz kontaktowy ---------- */
  var form = document.getElementById('contact-form');

  if (form) {
    var status = form.querySelector('[data-form-status]');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var phoneRe = /^[+()\d\s-]{6,20}$/;

    var rules = [
      { id: 'f-name', err: 'e-name', test: function (v) { return v.trim().length >= 2; }, msg: 'Podaj imię.' },
      { id: 'f-email', err: 'e-email', test: function (v) { return emailRe.test(v.trim()); }, msg: 'Podaj poprawny adres e-mail.' },
      { id: 'f-phone', err: 'e-phone', test: function (v) { return !v.trim() || phoneRe.test(v.trim()); }, msg: 'Numer telefonu wygląda niepoprawnie.' },
      { id: 'f-msg', err: 'e-msg', test: function (v) { return v.trim().length >= 10; }, msg: 'Napisz kilka słów (minimum 10 znaków).' },
      { id: 'f-consent', err: 'e-consent', checkbox: true, test: function (v, el) { return el.checked; }, msg: 'Zaznacz zgodę, aby wysłać wiadomość.' }
    ];

    var setStatus = function (state, text) {
      status.textContent = text;
      if (text) status.setAttribute('data-state', state);
      else status.removeAttribute('data-state');
    };

    var validate = function (rule) {
      var el = document.getElementById(rule.id);
      var err = document.getElementById(rule.err);
      var ok = rule.test(el.value, el);
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      err.textContent = ok ? '' : rule.msg;
      return ok;
    };

    rules.forEach(function (rule) {
      var el = document.getElementById(rule.id);
      el.addEventListener('blur', function () { if (el.value || rule.checkbox) validate(rule); });
      el.addEventListener('input', function () {
        if (el.getAttribute('aria-invalid') === 'true') validate(rule);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('', '');

      var firstInvalid = null;
      rules.forEach(function (rule) {
        if (!validate(rule) && !firstInvalid) firstInvalid = document.getElementById(rule.id);
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // Pole-pułapka: boty je wypełniają, ludzie nie widzą. Udajemy sukces, nic nie wysyłamy.
      if (form.elements.website && form.elements.website.value) {
        setStatus('success', 'Dziękujemy! Wiadomość została wysłana.');
        form.reset();
        return;
      }

      var endpoint = form.getAttribute('data-endpoint');

      // Integracja jeszcze niepodpięta — nie udajemy, że wiadomość wyszła.
      if (!endpoint) {
        setStatus('info', 'Formularz nie jest jeszcze aktywny, a wiadomość nie została wysłana. Spróbuj ponownie wkrótce.');
        return;
      }

      var submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      setStatus('info', 'Wysyłanie…');

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          setStatus('success', 'Dziękujemy! Wiadomość została wysłana.');
          form.reset();
        })
        .catch(function () {
          setStatus('error', 'Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.');
        })
        .finally(function () {
          submit.disabled = false;
        });
    });
  }

  /* ---------- Rok w stopce ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
