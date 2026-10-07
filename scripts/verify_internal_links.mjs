import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

const sitemapPath = fs.existsSync(path.resolve(distDir, 'sitemap.xml'))
  ? path.resolve(distDir, 'sitemap.xml')
  : path.resolve(rootDir, 'public/sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error(`❌ Sitemap not found at ${sitemapPath}`);
  process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
const locMatches = [...sitemapContent.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)];
const urls = locMatches.map(m => m[1]);

// Map of canonical routes
const canonicalRoutes = urls.map(u => {
  const p = new URL(u).pathname;
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
});

// Map of inbound links: targetRoute -> Set of sourceRoutes
const inboundLinks = new Map();
canonicalRoutes.forEach(route => {
  inboundLinks.set(route, new Set());
});

// Also track raw link counts
const rawInboundCounts = new Map();
canonicalRoutes.forEach(route => {
  rawInboundCounts.set(route, 0);
});

// Helper to find raw HTML file for a route in dist/
function getHtmlForRoute(route) {
  if (route === '/' || route === '') {
    const f = path.resolve(distDir, 'index.html');
    return fs.existsSync(f) ? fs.readFileSync(f, 'utf-8') : null;
  }
  const cleanPath = route.replace(/^\/+|\/+$/g, '');
  const dirHtml = path.resolve(distDir, cleanPath, 'index.html');
  const flatHtml = path.resolve(distDir, `${cleanPath}.html`);

  if (fs.existsSync(dirHtml)) return fs.readFileSync(dirHtml, 'utf-8');
  if (fs.existsSync(flatHtml)) return fs.readFileSync(flatHtml, 'utf-8');
  return null;
}

// Normalize href to canonical route
function normalizeHref(href) {
  if (!href) return null;
  let target = href.trim();

  // Strip origin if present
  if (target.startsWith('https://www.mansarafoods.com')) {
    target = target.replace('https://www.mansarafoods.com', '');
  } else if (target.startsWith('http://www.mansarafoods.com')) {
    target = target.replace('http://www.mansarafoods.com', '');
  }

  // Ignore external links, mailto, tel, javascript, anchors
  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('#') || target.startsWith('javascript:')) {
    return null;
  }

  // Strip query params and hashes
  target = target.split('?')[0].split('#')[0];

  if (!target.startsWith('/')) {
    target = `/${target}`;
  }

  if (target.length > 1 && target.endsWith('/')) {
    target = target.slice(0, -1);
  }

  return target || '/';
}

console.log(`\n======================================================`);
console.log(`🔗 RAW HTML INTERNAL LINK AUDIT: Analyzing ${canonicalRoutes.length} pages in dist/`);
console.log(`======================================================\n`);

// Parse raw HTML of every page in dist/
for (const sourceRoute of canonicalRoutes) {
  const html = getHtmlForRoute(sourceRoute);
  if (!html) {
    console.warn(`⚠️ Warning: No raw HTML found for ${sourceRoute} in dist/`);
    continue;
  }

  // Extract all hrefs using regex
  const hrefMatches = [...html.matchAll(/<a\b[^>]*?\bhref=["']([^"']+)["'][^>]*?>/gi)];

  for (const m of hrefMatches) {
    const rawHref = m[1];
    const targetRoute = normalizeHref(rawHref);

    if (targetRoute && inboundLinks.has(targetRoute)) {
      // Record inbound link (ignore self-linking for distinct counting)
      if (targetRoute !== sourceRoute) {
        inboundLinks.get(targetRoute).add(sourceRoute);
      }
      rawInboundCounts.set(targetRoute, rawInboundCounts.get(targetRoute) + 1);
    }
  }
}

// Build report table
const report = [];
let passCount = 0;
let flagCount = 0;

for (const route of canonicalRoutes) {
  const distinctSources = inboundLinks.get(route) || new Set();
  const distinctCount = distinctSources.size;
  const rawCount = rawInboundCounts.get(route) || 0;

  const status = distinctCount >= 3 ? '✅ PASS' : '⚠️ FLAGGED (<3)';
  if (distinctCount >= 3) {
    passCount++;
  } else {
    flagCount++;
  }

  report.push({
    Page: route,
    'Inbound Links (Distinct Pages)': distinctCount,
    'Total Inbound Anchors': rawCount,
    Status: status
  });
}

// Sort by lowest inbound link count first to easily spot thin pages
report.sort((a, b) => a['Inbound Links (Distinct Pages)'] - b['Inbound Links (Distinct Pages)']);

console.table(report);

console.log(`\n------------------------------------------------------`);
console.log(`Internal Link Summary:`);
console.log(`  Total Pages Analyzed:          ${canonicalRoutes.length}`);
console.log(`  Pages with >= 3 Inbound Links: ${passCount}`);
console.log(`  Pages Flagged (< 3 Links):     ${flagCount}`);
console.log(`------------------------------------------------------\n`);

if (flagCount > 0) {
  console.error(`⚠️ Attention: ${flagCount} page(s) have fewer than 3 inbound links from other pages.`);
  process.exit(1);
} else {
  console.log(`🎉 100% PASS: Every page has at least 3 inbound links from other pages in the raw HTML!`);
  process.exit(0);
}
