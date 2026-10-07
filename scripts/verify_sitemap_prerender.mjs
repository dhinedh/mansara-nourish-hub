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

console.log(`\n======================================================`);
console.log(`🔍 SITEMAP PRERENDER AUDIT: Verifying ${urls.length} URLs in dist/`);
console.log(`======================================================\n`);

let passed = 0;
let failed = 0;
const results = [];

for (const url of urls) {
  const parsed = new URL(url);
  const pathname = parsed.pathname;

  let expectedFile;
  let fileFound = false;
  let fileSize = 0;

  if (pathname === '/' || pathname === '') {
    expectedFile = path.resolve(distDir, 'index.html');
    if (fs.existsSync(expectedFile)) {
      fileFound = true;
      fileSize = fs.statSync(expectedFile).size;
    }
  } else {
    const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
    const dirHtml = path.resolve(distDir, cleanPath, 'index.html');
    const flatHtml = path.resolve(distDir, `${cleanPath}.html`);

    if (fs.existsSync(dirHtml)) {
      expectedFile = dirHtml;
      fileFound = true;
      fileSize = fs.statSync(dirHtml).size;
    } else if (fs.existsSync(flatHtml)) {
      expectedFile = flatHtml;
      fileFound = true;
      fileSize = fs.statSync(flatHtml).size;
    } else {
      expectedFile = dirHtml;
    }
  }

  if (fileFound && fileSize > 500) {
    passed++;
    results.push({
      url: pathname,
      file: path.relative(rootDir, expectedFile).replace(/\\/g, '/'),
      size: `${(fileSize / 1024).toFixed(1)} KB`,
      status: '✅ PRERENDERED'
    });
  } else {
    failed++;
    results.push({
      url: pathname,
      file: path.relative(rootDir, expectedFile).replace(/\\/g, '/'),
      size: fileFound ? `${fileSize} B (TOO SMALL)` : 'MISSING',
      status: '❌ FAILED'
    });
  }
}

// Also verify 404.html exists in dist/
const notFoundPath = path.resolve(distDir, '404.html');
const notFoundExists = fs.existsSync(notFoundPath);
const notFoundSize = notFoundExists ? fs.statSync(notFoundPath).size : 0;

console.table(results);

console.log(`\n------------------------------------------------------`);
console.log(`Audit Summary:`);
console.log(`  Sitemap URLs Checked: ${urls.length}`);
console.log(`  Prerendered Matches:  ${passed}`);
console.log(`  Missing / Failed:     ${failed}`);
console.log(`  404.html Prerendered: ${notFoundExists ? `✅ YES (${(notFoundSize / 1024).toFixed(1)} KB)` : '❌ NO'}`);
console.log(`------------------------------------------------------\n`);

if (failed > 0 || !notFoundExists) {
  console.error(`❌ Verification failed! Some sitemap URLs or 404.html do not have prerendered static files.`);
  process.exit(1);
} else {
  console.log(`🎉 100% PASS: All ${urls.length} sitemap URLs have matching, valid prerendered files in dist/!`);
  process.exit(0);
}
