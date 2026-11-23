(function () {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const year = document.querySelector('[data-year]');
  const form = document.getElementById('operation-form');
  const copyButton = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('[data-copy-status]');
  if (year) year.textContent = new Date().getFullYear();
  function syncHeader() { if (header) header.classList.toggle('scrolled', window.scrollY > 18); }
  syncHeader(); window.addEventListener('scroll', syncHeader, { passive: true });
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); });
    nav.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', function () { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); }); });
  }
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } }); }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else { revealItems.forEach(function (item) { item.classList.add('revealed'); }); }
  if (form) {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('button[type="submit"]');
    const endpoint = (form.getAttribute('data-endpoint') || '').trim();
    const params = new URLSearchParams(window.location.search);
    ['interest', 'role'].forEach(function (name) { const value = params.get(name); const field = form.elements[name]; if (value && field && Array.prototype.some.call(field.options, function (o) { return o.value === value; })) field.value = value; });
    const attribution = { page: window.location.pathname, referrer: document.referrer ? document.referrer.slice(0, 300) : '', utm_source: params.get('utm_source') || '', utm_medium: params.get('utm_medium') || '', utm_campaign: params.get('utm_campaign') || '', ref: params.get('ref') || '' };
    const label = function (name) { const field = form.elements[name]; return field && field.options ? field.options[field.selectedIndex].text : ''; };
    const mailtoHref = function (data) { const subject = 'Good Remedy: ' + (data.get('operation') || 'one operation'); const lines = ['Name: ' + (data.get('name') || ''), 'Email: ' + (data.get('email') || ''), 'Company: ' + (data.get('company') || ''), 'I am: ' + label('role'), 'Start with: ' + label('interest'), 'Operation: ' + (data.get('operation') || ''), '', 'What is happening now:', data.get('problem') || '']; return 'mailto:hello@grmove.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n')); };
    const say = function (state, text, href) { if (!status) return; status.setAttribute('data-state', state); status.textContent = text; if (href) { const link = document.createElement('a'); link.href = href; link.textContent = 'Send it by email instead'; status.append(' ', link, '.'); } };
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if ((data.get('website') || '').trim()) { form.reset(); say('ok', 'Thank you. Your message was received.'); return; }
      if (!endpoint) { window.location.href = mailtoHref(data); return; }
      const payload = { name: data.get('name'), email: data.get('email'), company: data.get('company'), role: data.get('role'), interest: data.get('interest'), operation: data.get('operation'), problem: data.get('problem') };
      Object.keys(attribution).forEach(function (key) { payload[key] = attribution[key]; });
      if (submit) submit.disabled = true;
      say('pending', 'Sending…');
      const controller = 'AbortController' in window ? new AbortController() : null;
      const timer = controller ? window.setTimeout(function () { controller.abort(); }, 15000) : null;
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: controller ? controller.signal : undefined, redirect: 'follow' })
        .then(function (response) { return response.json(); })
        .then(function (result) { if (!result || result.ok !== true) throw new Error('not accepted'); form.reset(); say('ok', 'Received' + (result.ref ? ' (reference ' + result.ref + ')' : '') + '. Benjamin Lopez will reply by email.'); })
        .catch(function () { say('error', 'Your message could not be sent from this page.', mailtoHref(data)); })
        .finally(function () { if (timer) window.clearTimeout(timer); if (submit) submit.disabled = false; });
    });
  }
  if (copyButton) { copyButton.addEventListener('click', function () { const email = 'hello@grmove.com'; const done = function () { if (copyStatus) copyStatus.textContent = 'Copied'; window.setTimeout(function () { if (copyStatus) copyStatus.textContent = ''; }, 2200); }; if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(email).then(done).catch(function () { window.prompt('Copy this email address:', email); }); } else { window.prompt('Copy this email address:', email); } }); }
})();
