import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const serverDir = path.resolve(rootDir, 'dist-server');

const API_BASE =
  process.env.VITE_API_URL ||
  'https://mansara-backend.onrender.com/api';

/** Fetch JSON from a URL; returns [] on any error so the build never fails. */
async function safeFetch(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      console.warn(`⚠️  ${url} returned ${res.status} – skipping dynamic routes for this endpoint.`);
      return [];
    }
    const json = await res.json();
    // APIs return either { items: [...] } or [...] directly
    return Array.isArray(json) ? json : (json.items || []);
  } catch (err) {
    console.warn(`⚠️  Could not fetch ${url}: ${err.message} – skipping.`);
    return [];
  }
}

async function prerender() {
  console.log('🚀 Starting static site prerendering & sitemap generation...');

  // ── 1. Parse product slugs from src/data/products.ts ──────────────────────
  // Scope the regex to only the `products` array section (after "export const products")
  const productsFilePath = path.resolve(rootDir, 'src/data/products.ts');
  const productsContent = fs.readFileSync(productsFilePath, 'utf-8');

  // Slice to only the text that follows "export const products: Product[] = ["
  const productsArrayStart = productsContent.indexOf('export const products');
  const productsSection =
    productsArrayStart >= 0 ? productsContent.slice(productsArrayStart) : productsContent;

  const productSlugs = [];
  const slugRegex = /"slug":\s*"([^"]+)"/g;
  let match;
  while ((match = slugRegex.exec(productsSection)) !== null) {
    const slug = match[1];
    if (slug && !['urad-porridge-mix', 'black-rice-mix', 'millet-fusion-mix', 'combos', 'idly-podi', 'rice-mixes'].includes(slug)) {
      if (!productSlugs.includes(slug)) {
        productSlugs.push(slug);
      }
    }
  }

  console.log(`📦 Found ${productSlugs.length} products:`, productSlugs);

  // ── 2. Fetch dynamic slugs / IDs from the live API (with local fallback) ────
  console.log(`🌐 Fetching dynamic content from ${API_BASE} …`);

  let [blogPosts, pressReleases, careers] = await Promise.all([
    safeFetch(`${API_BASE}/blog`),
    safeFetch(`${API_BASE}/press`),
    safeFetch(`${API_BASE}/careers`),
  ]);

  // Fallback for blog posts if live API is unavailable during build
  if (!blogPosts || blogPosts.length === 0) {
    const blogFilePath = path.resolve(rootDir, 'src/data/blogPosts.ts');
    if (fs.existsSync(blogFilePath)) {
      const content = fs.readFileSync(blogFilePath, 'utf-8');
      const postRegex = /_id:\s*["'][^"']+["'][\s\S]*?slug:\s*["']([^"']+)["'][\s\S]*?createdAt:\s*["']([^"']+)["']/g;
      let match;
      blogPosts = [];
      while ((match = postRegex.exec(content)) !== null) {
        const slug = match[1];
        const dateStr = match[2];
        if (slug && !blogPosts.some(b => b.slug === slug)) {
          blogPosts.push({
            slug: slug,
            createdAt: dateStr
          });
        }
      }
    }
  }

  // Blog uses slug or _id as route param (BlogDetail uses :slug param)
  const blogItems = blogPosts
    .map(p => ({
      slug: p.slug || p._id,
      lastmod: (p.updatedAt || p.createdAt || p.publishedAt || '2026-08-10').split('T')[0]
    }))
    .filter(p => Boolean(p.slug));

  const blogSlugs = blogItems.map(b => b.slug);

  // Press uses slug or _id as route param (PressDetail uses :slug param)
  const pressSlugs = pressReleases
    .map(p => p.slug || p._id)
    .filter(Boolean);

  // Career uses _id as route param (CareerDetail uses :id param)
  const careerIds = careers
    .map(c => c._id || c.id)
    .filter(Boolean);

  console.log(`📝 Blog posts: ${blogSlugs.length}, Press releases: ${pressSlugs.length}, Careers: ${careerIds.length}`);

  // ── 3. Build full route list ───────────────────────────────────────────────
  const staticRoutes = [
    '/',
    '/products',
    '/combos',
    '/offers',
    '/new-arrivals',
    '/about',
    '/contact',
    '/blog',
    '/press',
    '/careers',
    '/terms-and-conditions',
    '/privacy-policy',
    '/delivery-shipping-policy',
    '/refund-return-policy',
  ];

  const productRoutes  = productSlugs.map(s  => `/product/${s}`);
  const blogRoutes     = blogSlugs.map(s     => `/blog/${s}`);
  const pressRoutes    = pressSlugs.map(s    => `/press/${s}`);
  const careerRoutes   = careerIds.map(id    => `/careers/${id}`);

  const allRoutes = [
    ...staticRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...pressRoutes,
    ...careerRoutes,
  ];

  // ── 4. Generate sitemap.xml ────────────────────────────────────────────────
  const domain = 'https://www.mansarafoods.com';

  const getPriority = (route) => {
    if (route === '/') return '1.0';
    if (route === '/products' || route === '/combos') return '0.9';
    if (route.startsWith('/product/')) return '0.8';
    if (route === '/offers' || route === '/new-arrivals') return '0.8';
    if (route === '/about' || route === '/contact') return '0.7';
    if (route === '/blog' || route === '/press' || route === '/careers') return '0.6';
    if (route.startsWith('/blog/') || route.startsWith('/press/')) return '0.6';
    if (route.startsWith('/careers/')) return '0.5';
    return '0.5';
  };

  const getChangeFreq = (route) => {
    if (route === '/' || route === '/products') return 'daily';
    if (route.startsWith('/product/') || route.startsWith('/blog/')) return 'weekly';
    if (route === '/combos' || route === '/offers' || route === '/new-arrivals' || route === '/blog') return 'weekly';
    if (route === '/about' || route === '/contact' || route === '/press' || route === '/careers') return 'monthly';
    return 'yearly';
  };

  const getRouteLastmod = (route) => {
    if (route.startsWith('/blog/')) {
      const slug = route.replace('/blog/', '');
      const item = blogItems.find(b => b.slug === slug);
      if (item) return item.lastmod;
    }
    return '2026-08-12';
  };

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  allRoutes.forEach(route => {
    const loc = route === '/' ? `${domain}/` : `${domain}${route}`;
    sitemapXml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${getRouteLastmod(route)}</lastmod>\n    <changefreq>${getChangeFreq(route)}</changefreq>\n    <priority>${getPriority(route)}</priority>\n  </url>\n`;
  });
  sitemapXml += `</urlset>\n`;

  fs.writeFileSync(path.resolve(rootDir, 'public/sitemap.xml'), sitemapXml, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  }
  console.log(`✅ Generated sitemap with ${allRoutes.length} URLs`);

  // ── 5. Load SSR entry bundle ───────────────────────────────────────────────
  const serverEntryPath = path.resolve(serverDir, 'entry-server.js');
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error(`Server entry file not found at ${serverEntryPath}. Did "vite build --ssr" run?`);
  }
  const { render } = await import(`file://${serverEntryPath}`);

  const templatePath = path.resolve(distDir, 'index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  // ── 6. Prerender each route ────────────────────────────────────────────────
  for (const route of allRoutes) {
    try {
      const { html, helmet } = render(route);

      const titleTag   = helmet?.title?.toString()  || '';
      const metaTags   = helmet?.meta?.toString()   || '';
      const linkTags   = helmet?.link?.toString()   || '';
      const scriptTags = helmet?.script?.toString() || '';

      const headInsertions = `${metaTags}\n  ${linkTags}\n  ${scriptTags}`;

      let pageHtml = template;

      if (titleTag) {
        pageHtml = pageHtml.replace(/<title>.*?<\/title>/s, titleTag);
      }

      if (pageHtml.includes('<meta name="description"')) {
        pageHtml = pageHtml.replace(/<meta name="description" [^>]*\/>/s, headInsertions);
      } else {
        pageHtml = pageHtml.replace('</head>', `  ${headInsertions}\n</head>`);
      }

      pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

      if (route === '/') {
        fs.writeFileSync(templatePath, pageHtml, 'utf-8');
        console.log(`  ✓ Rendered / -> dist/index.html`);
      } else {
        const routePath = route.substring(1); // remove leading /
        const pageDir   = path.resolve(distDir, routePath);
        fs.mkdirSync(pageDir, { recursive: true });
        fs.writeFileSync(path.resolve(pageDir, 'index.html'), pageHtml, 'utf-8');
        fs.writeFileSync(path.resolve(distDir, `${routePath}.html`), pageHtml, 'utf-8');
        console.log(`  ✓ Rendered ${route}`);
      }
    } catch (err) {
      console.error(`❌ Error prerendering route ${route}:`, err.message);
    }
  }

  // ── 7. Clean up dist-server directory ─────────────────────────────────────
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true, force: true });
    console.log('🧹 Cleaned up temporary dist-server directory.');
  }

  console.log('🎉 Static pre-rendering completed successfully!');
}

prerender().catch((err) => {
  console.error('Fatal error during prerendering:', err);
  process.exit(1);
});
