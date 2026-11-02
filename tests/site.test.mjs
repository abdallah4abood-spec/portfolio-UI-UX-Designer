import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const base = 'https://abdallah4abood-spec.github.io/portfolio-UI-UX-Designer/';
const pages = [
  'index.html',
  'projects/tabibi.html',
  'projects/sarh.html',
  'projects/khafif.html',
  'projects/masar.html',
  'projects/wusul.html',
  'projects/mizan.html',
];
const concepts = new Set(['projects/masar.html', 'projects/wusul.html', 'projects/mizan.html']);

function readPage(page) {
  return readFileSync(resolve(root, page), 'utf8');
}

for (const page of pages) {
  test(`${page} provides a complete, identifiable document`, () => {
    assert.ok(existsSync(resolve(root, page)), `${page} is missing`);
    const html = readPage(page);
    assert.match(html, /<html\s+lang="en"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, 'page must have exactly one h1');
    assert.match(html, /<main\b/);
    assert.match(html, /<meta\s+name="description"\s+content="[^"]+"/);
    assert.ok(html.includes(`<link rel="canonical" href="${base}${page === 'index.html' ? '' : page}"`), 'canonical URL must match the GitHub Pages route');
  });

  test(`${page} keeps local assets and routes resolvable`, () => {
    if (!existsSync(resolve(root, page))) assert.fail(`${page} is missing`);
    const html = readPage(page);
    const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    for (const reference of references) {
      if (/^(?:https?:|mailto:|tel:|data:|#)/.test(reference)) continue;
      assert.ok(!reference.startsWith('/'), `${reference} is root-relative and breaks repository-subpath hosting`);
      const target = reference.split(/[?#]/)[0];
      if (!target) continue;
      assert.ok(existsSync(resolve(root, dirname(page), target)), `${reference} does not resolve from ${page}`);
    }
  });

  test(`${page} gives every raster image meaningful alternative text and dimensions`, () => {
    if (!existsSync(resolve(root, page))) assert.fail(`${page} is missing`);
    const images = readPage(page).match(/<img\b[^>]*>/g) || [];
    for (const image of images) {
      assert.match(image, /\salt="[^"]+"/, `${image} needs alt text`);
      assert.match(image, /\swidth="\d+"/, `${image} needs an intrinsic width`);
      assert.match(image, /\sheight="\d+"/, `${image} needs an intrinsic height`);
    }
  });

  if (concepts.has(page)) {
    test(`${page} cannot be mistaken for commissioned or validated work`, () => {
      if (!existsSync(resolve(root, page))) assert.fail(`${page} is missing`);
      const html = readPage(page);
      assert.match(html, /Concept Project/);
      assert.match(html, /Research &amp; Design References/);
      assert.match(html, /Assumptions/);
      assert.doesNotMatch(html, /(?:user testing|usability testing) (?:showed|proved|validated)/i);
    });
  }
}

test('Tabibi technology boundaries stay accurate', () => {
  const html = readPage('projects/tabibi.html');
  assert.doesNotMatch(html, /Node\.js|MongoDB/i);
  for (const technology of ['React', 'C#', '.NET', 'PostgreSQL']) assert.ok(html.includes(technology), `${technology} is missing`);
});

test('external new-tab links protect opener context', () => {
  for (const page of pages) {
    if (!existsSync(resolve(root, page))) continue;
    const links = readPage(page).match(/<a\b[^>]*target="_blank"[^>]*>/g) || [];
    for (const link of links) assert.match(link, /rel="[^"]*noopener[^"]*"/, `${page}: ${link}`);
  }
});

test('sitemap publishes exactly the seven canonical public routes', () => {
  const sitemapPath = resolve(root, 'sitemap.xml');
  assert.ok(existsSync(sitemapPath), 'sitemap.xml is missing');
  const urls = [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expected = pages.map((page) => `${base}${page === 'index.html' ? '' : page}`);
  assert.deepEqual(urls.sort(), expected.sort());
});

test('robots.txt advertises the deployed sitemap', () => {
  const robots = readFileSync(resolve(root, 'robots.txt'), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${base}sitemap.xml`));
});

test('social sharing image exists as a substantive PNG', () => {
  const imagePath = resolve(root, 'assets/og-image.png');
  assert.ok(existsSync(imagePath), 'assets/og-image.png is missing');
  const image = readFileSync(imagePath);
  assert.equal(image.subarray(1, 4).toString(), 'PNG');
  assert.ok(image.byteLength > 10000, 'social image appears empty or trivial');
});

test('404 page offers a useful route home without requesting indexing', () => {
  const notFoundPath = resolve(root, '404.html');
  assert.ok(existsSync(notFoundPath), '404.html is missing');
  const html = readFileSync(notFoundPath, 'utf8');
  assert.match(html, /<meta\s+name="robots"\s+content="noindex"/);
  assert.match(html, /href="index.html"/);
  assert.match(html, /<h1\b/);
});
