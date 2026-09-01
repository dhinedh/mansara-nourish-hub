import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const sitemapPath = path.resolve(rootDir, 'public/sitemap.xml');
const csvOutputPath = path.resolve(rootDir, 'seo_audit_33_pages.csv');

console.log('🧪 Starting 33-Page SEO, Title, Meta & Canonical Audit...\n');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory not found. Please run "npm run build" first.');
  process.exit(1);
}

if (!fs.existsSync(sitemapPath)) {
  console.error('❌ sitemap.xml not found.');
  process.exit(1);
}

const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8');
const locRegex = /<loc>(https:\/\/www\.mansarafoods\.com(\/[^<]*)?)<\/loc>/g;
const urls = [];
let match;
while ((match = locRegex.exec(sitemapXml)) !== null) {
  urls.push(match[1]);
}

console.log(`📌 Found ${urls.length} URLs in sitemap.xml\n`);

const csvRows = [
  ['URL', 'Path', 'Title', 'Meta Description', 'Canonical URL', 'Schemas Present', 'Status'].map(s => `"${s}"`).join(',')
];

let failed = false;
const seenTitles = new Map();

urls.forEach(url => {
  const urlObj = new URL(url);
  const routePath = urlObj.pathname;
  
  let htmlFile;
  if (routePath === '/' || routePath === '') {
    htmlFile = path.resolve(distDir, 'index.html');
  } else {
    const relPath = routePath.substring(1);
    htmlFile = path.resolve(distDir, `${relPath}/index.html`);
    if (!fs.existsSync(htmlFile)) {
      htmlFile = path.resolve(distDir, `${relPath}.html`);
    }
  }

  if (!fs.existsSync(htmlFile)) {
    console.error(`❌ [${routePath}] HTML file missing at ${htmlFile}`);
    failed = true;
    csvRows.push([url, routePath, 'MISSING FILE', '', '', '', 'FAIL'].map(s => `"${s.replace(/"/g, '""')}"`).join(','));
    return;
  }

  const html = fs.readFileSync(htmlFile, 'utf-8');

  // Extract <title ...>
  const titleMatch = html.match(/<title\b[^>]*>(.*?)<\/title>/is);
  const title = titleMatch ? titleMatch[1].trim() : 'MISSING TITLE';

  // Extract <meta ... name="description" ... content="...">
  const descMatch = html.match(/<meta\b[^>]*?\bname="description"[^>]*?\bcontent="([^"]*)"/is) ||
                    html.match(/<meta\b[^>]*?\bcontent="([^"]*)"[^>]*?\bname="description"/is);
  const description = descMatch ? descMatch[1].trim() : 'MISSING DESCRIPTION';

  // Extract <link ... rel="canonical" ... href="...">
  const canonicalMatch = html.match(/<link\b[^>]*?\brel="canonical"[^>]*?\bhref="([^"]*)"/is) ||
                         html.match(/<link\b[^>]*?\bhref="([^"]*)"[^>]*?\brel="canonical"/is);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : 'MISSING CANONICAL';

  // Extract Schemas
  const schemas = [];
  if (html.includes('"@type":"Organization"') || html.includes('"@type": "Organization"')) schemas.push('Organization');
  if (html.includes('"@type":"LocalBusiness"') || html.includes('"@type": "LocalBusiness"')) schemas.push('LocalBusiness');
  if (html.includes('"@type":"Product"') || html.includes('"@type": "Product"')) schemas.push('Product');
  if (html.includes('"@type":"WebSite"') || html.includes('"@type": "WebSite"')) schemas.push('WebSite');
  if (html.includes('"@type":"BreadcrumbList"') || html.includes('"@type": "BreadcrumbList"')) schemas.push('BreadcrumbList');

  // Check for stale placeholders
  if (title.toLowerCase().includes('zechsoft') || description.toLowerCase().includes('zechsoft')) {
    console.error(`❌ [${routePath}] STALE PLACEHOLDER 'zechsoft' DETECTED IN TITLE OR DESCRIPTION!`);
    failed = true;
  }

  // Check for expected canonical
  const expectedCanonical = url.endsWith('/') && url !== 'https://www.mansarafoods.com/' ? url.slice(0, -1) : url;
  if (canonical !== expectedCanonical) {
    console.error(`❌ [${routePath}] Canonical mismatch! Expected ${expectedCanonical}, got ${canonical}`);
    failed = true;
  }

  // Track title uniqueness (except policy pages which may intentionally share policy branding if applicable)
  if (seenTitles.has(title) && !routePath.startsWith('/terms') && !routePath.startsWith('/privacy')) {
    console.warn(`⚠️ [${routePath}] Duplicate title found: "${title}" (previously seen on ${seenTitles.get(title)})`);
  } else {
    seenTitles.set(title, routePath);
  }

  const status = (title !== 'MISSING TITLE' && description !== 'MISSING DESCRIPTION' && canonical === expectedCanonical) ? 'PASS' : 'FAIL';
  if (status === 'FAIL') failed = true;

  csvRows.push([
    url,
    routePath,
    title,
    description,
    canonical,
    schemas.join('; '),
    status
  ].map(s => `"${String(s).replace(/"/g, '""')}"`).join(','));
});

fs.writeFileSync(csvOutputPath, csvRows.join('\n'), 'utf-8');
console.log(`\n📊 Generated CSV Audit at: ${csvOutputPath}\n`);
console.log(csvRows.join('\n'));

if (failed) {
  console.error('\n❌ SEO Audit Test FAILED.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL 33 PAGES PASSED SEO, TITLE, META & CANONICAL AUDIT!');
}
