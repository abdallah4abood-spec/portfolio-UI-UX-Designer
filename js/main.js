(function () {
  const doc = document;
  const root = doc.documentElement;
  const themeButton = doc.getElementById('theme');
  const menuButton = doc.getElementById('menu');
  const nav = doc.getElementById('nav');

  function setTheme(theme, save) {
    root.dataset.theme = theme;
    if (themeButton) {
      const next = theme === 'dark' ? 'light' : 'dark';
      themeButton.setAttribute('aria-label', `Switch to ${next} theme`);
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    const themeColor = doc.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#0d1618' : '#edf1ef';
    if (save) {
      try { localStorage.setItem('theme', theme); } catch (error) { /* Storage can be unavailable. */ }
    }
  }

  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  }

  function closeMenu(restoreFocus) {
    if (!nav || !menuButton) return;
    nav.removeAttribute('data-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) menuButton.focus();
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const opening = !nav.hasAttribute('data-open');
      if (opening) {
        nav.setAttribute('data-open', '');
        menuButton.setAttribute('aria-expanded', 'true');
      } else {
        closeMenu(false);
      }
    });
    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.hasAttribute('data-open')) closeMenu(true);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(false)));
    doc.addEventListener('click', (event) => {
      if (nav.hasAttribute('data-open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(false);
    });
  }

  doc.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
      const status = doc.getElementById('copy-status');
      const email = button.getAttribute('data-copy-email');
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(email);
        if (status) status.textContent = 'Email address copied.';
      } catch (error) {
        if (status) status.textContent = 'Select the email address above to copy it.';
      }
    });
  });

  const year = doc.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const localNavLinks = [...doc.querySelectorAll('.site-nav a[href^="#"]')];
  if ('IntersectionObserver' in window && localNavLinks.length) {
    const sections = localNavLinks.map((link) => doc.querySelector(link.getAttribute('href'))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        localNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => observer.observe(section));
  }
})();
