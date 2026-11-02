import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(root, 'docs', 'qa');
const screenshotDir = join(outputDir, 'screenshots');
const artworkDir = join(outputDir, 'artwork');
const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1600];
const pages = [
  'index.html',
  'projects/tabibi.html',
  'projects/sarh.html',
  'projects/khafif.html',
  'projects/masar.html',
  'projects/wusul.html',
  'projects/mizan.html',
];
const caseStudies = pages.slice(1);
const artwork = [
  'assets/projects/khafif-screens.svg',
  'assets/concepts/masar-overview.svg',
  'assets/concepts/masar-flow.svg',
  'assets/concepts/wusul-overview.svg',
  'assets/concepts/wusul-flow.svg',
  'assets/concepts/mizan-overview.svg',
  'assets/concepts/mizan-flow.svg',
];
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

await mkdir(screenshotDir, { recursive: true });
await mkdir(artworkDir, { recursive: true });

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const filePath = resolve(root, `.${pathname}`);
    if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mime[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});
await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const base = `http://127.0.0.1:${server.address().port}/`;

function chromePath() {
  const candidates = process.platform === 'win32'
    ? [process.env.CHROME_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe']
    : [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  const executable = candidates.filter(Boolean).find((candidate) => existsSync(candidate));
  if (!executable) throw new Error('Chrome was not found. Set CHROME_PATH to a local Chrome or Edge executable.');
  return executable;
}

function launchChrome(profile) {
  const chrome = spawn(chromePath(), [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  return new Promise((resolveLaunch, rejectLaunch) => {
    let stderr = '';
    const timer = setTimeout(() => rejectLaunch(new Error(`Chrome startup timed out.\n${stderr}`)), 30000);
    chrome.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (!match) return;
      clearTimeout(timer);
      resolveLaunch({ chrome, browserSocket: match[1] });
    });
    chrome.once('error', (error) => {
      clearTimeout(timer);
      rejectLaunch(error);
    });
    chrome.once('exit', (code) => {
      clearTimeout(timer);
      rejectLaunch(new Error(`Chrome exited before startup (${code}).\n${stderr}`));
    });
  });
}

class CDP {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = new Map();
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        clearTimeout(pending.timer);
        if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
        else pending.resolve(message.result);
        return;
      }
      for (const listener of this.listeners.get(message.method) || []) listener(message.params);
    });
  }

  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolveOpen, rejectOpen) => {
      socket.addEventListener('open', resolveOpen, { once: true });
      socket.addEventListener('error', () => rejectOpen(new Error(`Could not connect to ${url}`)), { once: true });
    });
    return new CDP(socket);
  }

  send(method, params = {}, timeout = 45000) {
    const id = ++this.nextId;
    return new Promise((resolveSend, rejectSend) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        rejectSend(new Error(`${method} timed out`));
      }, timeout);
      this.pending.set(id, { method, resolve: resolveSend, reject: rejectSend, timer });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || new Set();
    listeners.add(listener);
    this.listeners.set(method, listeners);
    return () => listeners.delete(listener);
  }

  waitFor(method, timeout = 45000) {
    return new Promise((resolveEvent, rejectEvent) => {
      const timer = setTimeout(() => {
        off();
        rejectEvent(new Error(`${method} event timed out`));
      }, timeout);
      const off = this.on(method, (params) => {
        clearTimeout(timer);
        off();
        resolveEvent(params);
      });
    });
  }

  close() {
    this.socket.close();
  }
}

const profile = join(tmpdir(), `portfolio-working-proof-${process.pid}-${Date.now()}`);
let chrome;
let cdp;
const requestUrls = new Map();
let activeIssues = [];
const report = {
  generatedAt: new Date().toISOString(),
  base,
  widths,
  routes: pages,
  responsive: [],
  interactions: [],
  screenshots: [],
  artwork: [],
};

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

async function evaluate(expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function ready() {
  await evaluate(`(async () => {
    const images = [...document.images];
    images.forEach((image) => { image.loading = 'eager'; });
    await Promise.all(images.map((image) => image.complete ? Promise.resolve() : new Promise((resolveImage) => {
      image.addEventListener('load', resolveImage, { once: true });
      image.addEventListener('error', resolveImage, { once: true });
    })));
    if (document.fonts) await document.fonts.ready;
  })()`);
}

async function navigate(pathname) {
  activeIssues = [];
  const loaded = cdp.waitFor('Page.loadEventFired');
  await cdp.send('Page.navigate', { url: new URL(pathname, base).href });
  await loaded;
  await ready();
}

async function viewport(width, height = 1000) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 430,
    screenWidth: width,
    screenHeight: height,
  });
}

async function media(colorScheme = 'light', reducedMotion = 'no-preference') {
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-color-scheme', value: colorScheme },
      { name: 'prefers-reduced-motion', value: reducedMotion },
    ],
  });
}

async function setTheme(theme) {
  await evaluate(`(() => {
    if (document.documentElement.dataset.theme !== '${theme}') document.getElementById('theme')?.click();
    return document.documentElement.dataset.theme;
  })()`);
  await delay(250);
}

async function key(key, code, virtualKey) {
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key,
    code,
    windowsVirtualKeyCode: virtualKey,
    nativeVirtualKeyCode: virtualKey,
    ...(key === 'Enter' ? { text: '\r' } : {}),
  });
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: virtualKey, nativeVirtualKeyCode: virtualKey });
  await delay(80);
}

async function interaction(name, run) {
  try {
    await run();
    report.interactions.push({ name, pass: true });
  } catch (error) {
    report.interactions.push({ name, pass: false, error: error.message });
  }
}

async function capture(name, pathname, width, theme = 'light', selector = null) {
  await viewport(width);
  await media(theme);
  await navigate(pathname);
  await setTheme(theme);
  const layout = await cdp.send('Page.getLayoutMetrics');
  const content = layout.cssContentSize || layout.contentSize;
  let clip = { x: 0, y: 0, width: content.width, height: content.height, scale: 1 };
  if (selector) {
    const bounds = await evaluate(`(() => {
      const element = document.querySelector('${selector}');
      const rect = element.getBoundingClientRect();
      return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height };
    })()`);
    clip = { ...bounds, scale: 1 };
  }
  const screenshot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
    clip,
  }, 90000);
  const filename = `${name}.png`;
  await writeFile(join(screenshotDir, filename), Buffer.from(screenshot.data, 'base64'));
  report.screenshots.push({ filename, pathname, width, theme, selector, height: Math.round(clip.height) });
}

async function captureArtwork(pathname) {
  await viewport(1440, 960);
  await navigate(pathname);
  const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true }, 90000);
  const filename = `${pathname.split('/').pop().replace('.svg', '')}.png`;
  await writeFile(join(artworkDir, filename), Buffer.from(screenshot.data, 'base64'));
  report.artwork.push({ filename, pathname, width: 1440, height: 960 });
}

try {
  const launched = await launchChrome(profile);
  chrome = launched.chrome;
  const port = new URL(launched.browserSocket).port;
  let pageSocket;
  for (let attempt = 0; attempt < 50 && !pageSocket; attempt += 1) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      pageSocket = targets.find((target) => target.type === 'page')?.webSocketDebuggerUrl;
    } catch {
      await delay(100);
    }
  }
  if (!pageSocket) throw new Error('No debuggable Chrome page was available.');
  cdp = await CDP.connect(pageSocket);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');
  cdp.on('Runtime.exceptionThrown', (params) => activeIssues.push(`JavaScript: ${params.exceptionDetails.exception?.description || params.exceptionDetails.text}`));
  cdp.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') activeIssues.push(`Console: ${params.args.map((arg) => arg.value || arg.description).join(' ')}`);
  });
  cdp.on('Network.requestWillBeSent', (params) => requestUrls.set(params.requestId, params.request.url));
  cdp.on('Network.responseReceived', (params) => {
    if (params.response.url.startsWith(base) && params.response.status >= 400) activeIssues.push(`HTTP ${params.response.status}: ${params.response.url}`);
  });
  cdp.on('Network.loadingFailed', (params) => {
    const url = requestUrls.get(params.requestId);
    if (url?.startsWith(base) && !params.canceled) activeIssues.push(`Request failed: ${url} (${params.errorText})`);
  });

  for (const pathname of pages) {
    for (const width of widths) {
      await viewport(width);
      await media('light');
      await navigate(pathname);
      const inspection = await evaluate(`(() => {
        const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
        const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
        const badImages = [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.getAttribute('src'));
        const unnamedControls = [...document.querySelectorAll('a, button')].filter((element) => {
          const name = element.getAttribute('aria-label') || element.textContent.trim() || element.querySelector('img')?.alt;
          return !name;
        }).map((element) => element.outerHTML.slice(0, 120));
        const heading = document.querySelector('h1');
        const headingStyle = heading ? getComputedStyle(heading) : null;
        return {
          innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          h1Count: document.querySelectorAll('h1').length,
          h1Visible: Boolean(heading && heading.getBoundingClientRect().height > 0 && headingStyle.visibility !== 'hidden' && headingStyle.display !== 'none'),
          mainVisible: Boolean(document.querySelector('main')?.getBoundingClientRect().height),
          duplicateIds: [...new Set(duplicateIds)],
          badImages,
          unnamedControls,
        };
      })()`);
      const issues = [...activeIssues];
      if (inspection.innerWidth !== width) issues.push(`Expected viewport ${width}, received ${inspection.innerWidth}`);
      if (inspection.documentWidth > width || inspection.bodyWidth > width) issues.push(`Horizontal overflow: document ${inspection.documentWidth}, body ${inspection.bodyWidth}, viewport ${width}`);
      if (inspection.h1Count !== 1 || !inspection.h1Visible) issues.push(`Expected one visible h1, found ${inspection.h1Count}`);
      if (!inspection.mainVisible) issues.push('Main content is not visible');
      if (inspection.duplicateIds.length) issues.push(`Duplicate IDs: ${inspection.duplicateIds.join(', ')}`);
      if (inspection.badImages.length) issues.push(`Images failed: ${inspection.badImages.join(', ')}`);
      if (inspection.unnamedControls.length) issues.push(`Unnamed controls: ${inspection.unnamedControls.join(', ')}`);
      report.responsive.push({ pathname, width, pass: issues.length === 0, issues });
      console.log(`${issues.length ? 'FAIL' : 'PASS'} ${pathname} @ ${width}px${issues.length ? ` — ${issues.join(' | ')}` : ''}`);
    }
  }

  for (const theme of ['light', 'dark']) {
    for (const width of [1440, 390]) await capture(`homepage-${theme}-${width}`, 'index.html', width, theme);
  }
  for (const width of [1440, 390]) await capture(`concept-gallery-${width}`, 'index.html', width, 'light', '#concepts');
  for (const pathname of caseStudies) {
    const name = pathname.split('/').pop().replace('.html', '');
    for (const width of [1440, 390]) await capture(`${name}-light-${width}`, pathname, width, 'light');
  }
  for (const pathname of ['projects/tabibi.html', 'projects/masar.html']) {
    const name = pathname.split('/').pop().replace('.html', '');
    for (const width of [1440, 390]) await capture(`${name}-dark-${width}`, pathname, width, 'dark');
  }
  for (const pathname of artwork) await captureArtwork(pathname);

  await viewport(390);
  await media('light');
  await navigate('index.html');
  await setTheme('light');
  await interaction('skip link receives the first Tab and navigates to main', async () => {
    await evaluate(`(() => { history.replaceState(null, '', location.pathname); scrollTo(0, 0); document.activeElement?.blur(); })()`);
    await key('Tab', 'Tab', 9);
    const focused = await evaluate(`document.activeElement?.classList.contains('skip-link')`);
    assert.equal(focused, true, 'First Tab did not focus the skip link');
    await key('Enter', 'Enter', 13);
    assert.equal(await evaluate('location.hash'), '#main');
  });

  await navigate('index.html');
  await interaction('mobile menu opens by keyboard and Escape restores focus', async () => {
    await evaluate(`(() => {
      window.__menuEvents = [];
      const button = document.getElementById('menu');
      for (const type of ['keydown', 'keyup', 'click']) button.addEventListener(type, (event) => window.__menuEvents.push({ type, key: event.key, defaultPrevented: event.defaultPrevented }));
      button.focus();
    })()`);
    await key('Enter', 'Enter', 13);
    const menuState = await evaluate(`({ expanded: document.getElementById('menu').getAttribute('aria-expanded'), open: document.getElementById('nav').hasAttribute('data-open'), focus: document.activeElement?.id, display: getComputedStyle(document.getElementById('menu')).display, events: window.__menuEvents })`);
    assert.equal(menuState.expanded, 'true', JSON.stringify(menuState));
    assert.equal(menuState.open, true, JSON.stringify(menuState));
    await key('Escape', 'Escape', 27);
    assert.equal(await evaluate(`document.getElementById('menu').getAttribute('aria-expanded')`), 'false');
    assert.equal(await evaluate(`document.activeElement?.id`), 'menu');
  });

  await interaction('mobile menu closes after navigation and outside click', async () => {
    await evaluate(`document.getElementById('menu').click()`);
    await evaluate(`document.querySelector('#nav a[href="#work"]').click()`);
    assert.equal(await evaluate(`document.getElementById('menu').getAttribute('aria-expanded')`), 'false');
    assert.equal(await evaluate('location.hash'), '#work');
    await evaluate(`document.getElementById('menu').click()`);
    await evaluate(`document.querySelector('h1').click()`);
    assert.equal(await evaluate(`document.getElementById('menu').getAttribute('aria-expanded')`), 'false');
  });

  await interaction('theme control updates semantics and survives reload', async () => {
    await evaluate(`document.getElementById('theme').click()`);
    const state = await evaluate(`({ theme: document.documentElement.dataset.theme, pressed: document.getElementById('theme').getAttribute('aria-pressed'), label: document.getElementById('theme').getAttribute('aria-label'), color: document.querySelector('meta[name="theme-color"]').content, stored: localStorage.getItem('theme') })`);
    assert.deepEqual(state, { theme: 'dark', pressed: 'true', label: 'Switch to light theme', color: '#0d1618', stored: 'dark' });
    await navigate('index.html');
    assert.equal(await evaluate(`document.documentElement.dataset.theme`), 'dark');
    await evaluate(`document.getElementById('theme').click()`);
  });

  await interaction('system color scheme is respected without a saved preference', async () => {
    await evaluate(`localStorage.removeItem('theme')`);
    await media('dark');
    await navigate('index.html');
    assert.equal(await evaluate(`document.documentElement.dataset.theme`), 'dark');
    await media('light');
    await navigate('index.html');
    assert.equal(await evaluate(`document.documentElement.dataset.theme`), 'light');
  });

  await interaction('copy email reports a useful status', async () => {
    try {
      await cdp.send('Browser.grantPermissions', { origin: base.slice(0, -1), permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] });
    } catch {}
    await evaluate(`document.querySelector('[data-copy-email]').click()`);
    await delay(250);
    const status = await evaluate(`document.getElementById('copy-status').textContent`);
    assert.ok(status === 'Email address copied.' || status === 'Select the email address above to copy it.', `Unexpected status: ${status}`);
  });

  await interaction('reduced motion disables animation and smooth scrolling', async () => {
    await media('light', 'reduce');
    const state = await evaluate(`({ matches: matchMedia('(prefers-reduced-motion: reduce)').matches, scroll: getComputedStyle(document.documentElement).scrollBehavior, animation: getComputedStyle(document.querySelector('.proof-sheet--main')).animationName })`);
    assert.equal(state.matches, true);
    assert.equal(state.scroll, 'auto');
    assert.equal(state.animation, 'none');
  });
} catch (error) {
  report.fatalError = error.stack || error.message;
  console.error(error);
} finally {
  if (cdp) {
    try { await cdp.send('Browser.close', {}, 5000); } catch {}
    cdp.close();
  }
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    await Promise.race([once(chrome, 'exit'), delay(10000)]);
  }
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    chrome.kill();
    await Promise.race([once(chrome, 'exit'), delay(5000)]);
  }
  await new Promise((resolveClose) => server.close(resolveClose));
  try {
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  } catch (error) {
    report.cleanupWarning = `Temporary Chrome profile could not be removed: ${error.message}`;
  }
  report.summary = {
    responsiveChecks: report.responsive.length,
    responsiveFailures: report.responsive.filter((item) => !item.pass).length,
    interactionChecks: report.interactions.length,
    interactionFailures: report.interactions.filter((item) => !item.pass).length,
    screenshots: report.screenshots.length,
    artwork: report.artwork.length,
    fatal: Boolean(report.fatalError),
  };
  await writeFile(join(outputDir, 'results.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.summary, null, 2));
}

if (report.fatalError || report.responsive.some((item) => !item.pass) || report.interactions.some((item) => !item.pass)) process.exitCode = 1;
