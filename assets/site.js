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
  if (form) { form.addEventListener('submit', function (event) { event.preventDefault(); const data = new FormData(form); const subject = 'Good Remedy: ' + (data.get('operation') || 'one operation'); const lines = ['Name: ' + (data.get('name') || ''),'Email: ' + (data.get('email') || ''),'Company: ' + (data.get('company') || ''),'Operation: ' + (data.get('operation') || ''),'','What is happening now:',data.get('problem') || '']; window.location.href = 'mailto:hello@grmove.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n')); }); }
  if (copyButton) { copyButton.addEventListener('click', function () { const email = 'hello@grmove.com'; const done = function () { if (copyStatus) copyStatus.textContent = 'Copied'; window.setTimeout(function () { if (copyStatus) copyStatus.textContent = ''; }, 2200); }; if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(email).then(done).catch(function () { window.prompt('Copy this email address:', email); }); } else { window.prompt('Copy this email address:', email); } }); }
})();
