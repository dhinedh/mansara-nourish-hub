import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('🧪 Starting SEO & Canonical Audit Verification Test...\n');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory not found. Please run "npm run build" first.');
  process.exit(1);
}

const routesToTest = [
  { route: '/', expectedCanonical: 'https://www.mansarafoods.com/', file: 'index.html' },
  { route: '/about', expectedCanonical: 'https://www.mansarafoods.com/about', file: 'about/index.html' },
  { route: '/contact', expectedCanonical: 'https://www.mansarafoods.com/contact', file: 'contact/index.html' },
  { route: '/careers', expectedCanonical: 'https://www.mansarafoods.com/careers', file: 'careers/index.html' },
  { route: '/press', expectedCanonical: 'https://www.mansarafoods.com/press', file: 'press/index.html' },
  { route: '/blog', expectedCanonical: 'https://www.mansarafoods.com/blog', file: 'blog/index.html' },
  { route: '/products', expectedCanonical: 'https://www.mansarafoods.com/products', file: 'products/index.html' },
  { route: '/offers', expectedCanonical: 'https://www.mansarafoods.com/offers', file: 'offers/index.html' },
  { route: '/combos', expectedCanonical: 'https://www.mansarafoods.com/combos', file: 'combos/index.html' },
  { route: '/new-arrivals', expectedCanonical: 'https://www.mansarafoods.com/new-arrivals', file: 'new-arrivals/index.html' },
];

let failed = false;

routesToTest.forEach(({ route, expectedCanonical, file }) => {
  const filePath = path.resolve(distDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File for route ${route} not found at ${filePath}.`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf-8');

  // Check Canonical (handling data-rh="true" and attribute ordering)
  const canonicalMatch = html.match(/<link\b[^>]*?\brel="canonical"[^>]*?\bhref="([^"]+)"/i) ||
                         html.match(/<link\b[^>]*?\bhref="([^"]+)"[^>]*?\brel="canonical"/i);
  if (!canonicalMatch) {
    console.error(`❌ [${route}] Missing canonical tag!`);
    failed = true;
  } else {
    const canonical = canonicalMatch[1];
    if (canonical === expectedCanonical) {
      console.log(`✅ [${route}] Canonical correct: ${canonical}`);
    } else {
      console.error(`❌ [${route}] Canonical mismatch! Expected: ${expectedCanonical}, Got: ${canonical}`);
      failed = true;
    }
  }

  // Check Keywords for ObjectId Leaks
  const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="([^"]+)"/i);
  if (keywordsMatch) {
    const keywords = keywordsMatch[1];
    const objectIdRegex = /\b[0-9a-fA-F]{24}\b/g;
    const leakedIds = keywords.match(objectIdRegex);
    if (leakedIds && leakedIds.length > 0) {
      console.error(`❌ [${route}] Leaked MongoDB ObjectId in keywords tag: ${leakedIds.join(', ')}`);
      failed = true;
    } else {
      console.log(`  └─ Keywords clean (no raw ObjectIds detected)`);
    }
  }

  // Check Organization Schema
  if (html.includes('"@type":"Organization"') || html.includes('"@type": "Organization"')) {
    console.log(`  └─ Organization JSON-LD schema present`);
  } else {
    console.error(`❌ [${route}] Missing Organization JSON-LD schema!`);
    failed = true;
  }
});

if (failed) {
  console.error('\n❌ SEO Audit Test FAILED.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL CANONICAL & SEO AUDIT TESTS PASSED SUCCESSFULLY!');
}
