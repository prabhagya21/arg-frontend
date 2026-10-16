(function () {
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');

  // mobile menu
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // newsletter (front-end only)
  var nf = document.getElementById('newsForm');
  if (nf) nf.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('newsNote').style.display = 'block';
    nf.reset();
  });

  // image fallback: if a local copy is missing, use the arg.lk copy (data-remote) once
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.getAttribute('data-remote') && !t.getAttribute('data-tried')) {
      t.setAttribute('data-tried', '1');
      t.src = t.getAttribute('data-remote');
    }
  }, true);
  // images that already failed before this script ran (e.g. the header logo)
  function rescue() {
    document.querySelectorAll('img[data-remote]').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && !img.getAttribute('data-tried')) {
        img.setAttribute('data-tried', '1');
        img.src = img.getAttribute('data-remote');
      }
    });
  }
  rescue();
  window.addEventListener('load', rescue);

  // lightbox (achievements + gallery) with prev / next
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (triggers.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button class="x" type="button" aria-label="Close">&times;</button>' +
      '<button class="lb-nav prev" type="button" aria-label="Previous photo"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button class="lb-nav next" type="button" aria-label="Next photo"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(box);
    var bimg = box.querySelector('img'), bcap = box.querySelector('figcaption');
    var list = [], idx = 0;
    function visibleList() {
      return triggers.filter(function (t) { var f = t.closest('[hidden]'); return !f; });
    }
    function load(i) {
      idx = (i + list.length) % list.length;
      var t = list[idx];
      bimg.removeAttribute('data-tried');
      bimg.setAttribute('data-remote', t.getAttribute('data-remote') || '');
      bimg.src = t.getAttribute('data-lightbox');
      bimg.alt = t.getAttribute('data-caption') || '';
      bcap.textContent = t.getAttribute('data-caption') || '';
    }
    function open(t) {
      list = visibleList();
      box.classList.toggle('single', list.length < 2);
      load(list.indexOf(t));
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() { box.classList.remove('open'); document.body.style.overflow = ''; }
    triggers.forEach(function (t) { t.addEventListener('click', function () { open(t); }); });
    box.addEventListener('click', function (e) {
      if (e.target.closest('.lb-nav.prev')) { load(idx - 1); return; }
      if (e.target.closest('.lb-nav.next')) { load(idx + 1); return; }
      if (e.target.tagName === 'IMG') return;
      close();
    });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') load(idx - 1);
      if (e.key === 'ArrowRight') load(idx + 1);
    });
  }

  // gallery filters
  var filters = document.querySelectorAll('.g-filters button');
  if (filters.length) {
    var gitems = document.querySelectorAll('.g-item');
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        filters.forEach(function (x) { x.classList.toggle('on', x === b); });
        gitems.forEach(function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-cat') === f); });
      });
    });
  }

  // contact form (front-end only: opens the visitor's email app with the message filled in)
  var cf = document.getElementById('contactForm');
  if (cf) {
    var note = document.getElementById('formNote');
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = cf.elements, ok = true;
      ['name', 'email', 'message'].forEach(function (k) {
        var bad = !f[k].value.trim() || (k === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f[k].value.trim()));
        f[k].classList.toggle('err', bad);
        if (bad) ok = false;
      });
      if (!ok) {
        note.className = 'form-note bad';
        note.textContent = 'Please fill in your name, a valid e-mail and a message.';
        return;
      }
      var body = 'Name: ' + f.name.value.trim() + '\nEmail: ' + f.email.value.trim() +
                 '\nPhone: ' + (f.phone.value.trim() || '-') + '\n\n' + f.message.value.trim();
      window.location.href = 'mailto:' + cf.getAttribute('data-recipient') +
        '?subject=' + encodeURIComponent('Website enquiry from ' + f.name.value.trim()) +
        '&body=' + encodeURIComponent(body);
      note.className = 'form-note ok';
      note.textContent = 'Thank you! Your email app should open with your message ready to send.';
    });
  }
})();

// hero slideshow
(function () {
  var root = document.getElementById('heroSlider');
  if (!root) return;
  var slides = root.querySelectorAll('.slide');
  var dots = root.querySelectorAll('.s-dots button');
  var DUR = 6500, cur = 0, timer = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.style.setProperty('--dur', DUR + 'ms');

  function show(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      var on = i === cur;
      s.classList.toggle('active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      var img = s.querySelector('img');
      if (on && img) img.loading = 'eager';
    });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
    // restart the progress-bar animation
    root.classList.remove('playing'); void root.offsetWidth;
    if (timer) root.classList.add('playing');
  }
  function next() { show(cur + 1); }
  function play() { if (reduce || timer) return; timer = setInterval(next, DUR); root.classList.add('playing'); root.classList.remove('paused'); }
  function stop() { clearInterval(timer); timer = null; root.classList.remove('playing'); }
  function restart() { stop(); play(); }

  root.querySelector('.next').addEventListener('click', function () { show(cur + 1); restart(); });
  root.querySelector('.prev').addEventListener('click', function () { show(cur - 1); restart(); });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); restart(); }); });

  // pause while hovering / focusing, and when the tab is hidden
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', play);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });

  // keyboard + swipe
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { show(cur + 1); restart(); }
    if (e.key === 'ArrowLeft') { show(cur - 1); restart(); }
  });
  var x0 = null;
  root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) { show(cur + (dx < 0 ? 1 : -1)); restart(); }
  });

  show(0); play();
})();
