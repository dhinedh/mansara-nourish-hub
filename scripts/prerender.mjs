import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const serverDir = path.resolve(rootDir, 'dist-server');

async function prerender() {
  console.log('🚀 Starting static site prerendering & sitemap generation...');

  // 1. Parse product slugs from src/data/products.ts
  const productsFilePath = path.resolve(rootDir, 'src/data/products.ts');
  const productsContent = fs.readFileSync(productsFilePath, 'utf-8');
  
  const productSlugs = [];
  const slugRegex = /"slug":\s*"([^"]+)"/g;
  let match;
  while ((match = slugRegex.exec(productsContent)) !== null) {
    if (!productSlugs.includes(match[1])) {
      productSlugs.push(match[1]);
    }
  }

  console.log(`📦 Found ${productSlugs.length} products to prerender:`, productSlugs);

  // 2. Define all routes for prerendering and sitemap
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

  const productRoutes = productSlugs.map(slug => `/product/${slug}`);
  const allRoutes = [...staticRoutes, ...productRoutes];

  // 3. Generate sitemap.xml
  const domain = 'https://www.mansarafoods.com';
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const getPriority = (route) => {
    if (route === '/') return '1.0';
    if (route === '/products' || route === '/combos') return '0.9';
    if (route.startsWith('/product/')) return '0.8';
    if (route === '/offers' || route === '/new-arrivals') return '0.8';
    if (route === '/about' || route === '/contact') return '0.7';
    if (route === '/blog' || route === '/press') return '0.6';
    return '0.5';
  };

  allRoutes.forEach(route => {
    const loc = route === '/' ? `${domain}/` : `${domain}${route}`;
    sitemapXml += `  <url>\n    <loc>${loc}</loc>\n    <priority>${getPriority(route)}</priority>\n  </url>\n`;
  });
  sitemapXml += `</urlset>\n`;

  // Write sitemap.xml to public/ and dist/
  fs.writeFileSync(path.resolve(rootDir, 'public/sitemap.xml'), sitemapXml, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  }
  console.log('✅ Generated public/sitemap.xml and dist/sitemap.xml');

  // 4. Load SSR entry bundle
  const serverEntryPath = path.resolve(serverDir, 'entry-server.js');
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error(`Server entry file not found at ${serverEntryPath}. Did "vite build --ssr" run?`);
  }

  const { render } = await import(`file://${serverEntryPath}`);

  // Read index.html template
  const templatePath = path.resolve(distDir, 'index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  // 5. Prerender each route
  for (const route of allRoutes) {
    try {
      const { html, helmet } = render(route);

      const titleTag = helmet?.title?.toString() || '';
      const metaTags = helmet?.meta?.toString() || '';
      const linkTags = helmet?.link?.toString() || '';
      const scriptTags = helmet?.script?.toString() || '';

      const headInsertions = `${metaTags}\n  ${linkTags}\n  ${scriptTags}`;

      let pageHtml = template;

      // Replace existing title if helmet provided a title
      if (titleTag) {
        pageHtml = pageHtml.replace(/<title>.*?<\/title>/s, titleTag);
      }

      // Replace meta description or append head tags
      if (pageHtml.includes('<meta name="description"')) {
        pageHtml = pageHtml.replace(/<meta name="description" [^>]*\/>/s, headInsertions);
      } else {
        pageHtml = pageHtml.replace('</head>', `  ${headInsertions}\n</head>`);
      }

      // Replace root div with rendered HTML
      pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

      // Determine output directory & file paths
      if (route === '/') {
        fs.writeFileSync(templatePath, pageHtml, 'utf-8');
        console.log(`  ✓ Rendered / -> dist/index.html`);
      } else {
        const routePath = route.substring(1); // remove leading /
        const pageDir = path.resolve(distDir, routePath);
        fs.mkdirSync(pageDir, { recursive: true });

        // Write index.html inside route directory (e.g. dist/product/slug/index.html)
        fs.writeFileSync(path.resolve(pageDir, 'index.html'), pageHtml, 'utf-8');

        // Write route.html for servers that serve cleanUrls (e.g. dist/product/slug.html)
        fs.writeFileSync(path.resolve(distDir, `${routePath}.html`), pageHtml, 'utf-8');

        console.log(`  ✓ Rendered ${route} -> dist/${routePath}/index.html & dist/${routePath}.html`);
      }
    } catch (err) {
      console.error(`❌ Error prerendering route ${route}:`, err);
    }
  }

  // 6. Clean up dist-server directory
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
