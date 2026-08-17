import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to compute word overlap (Jaccard similarity)
function jaccardSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  const words1 = new Set(text1.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  const words2 = new Set(text2.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  if (words1.size === 0 && words2.size === 0) return 1;
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

function parseProductsFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract JSON-like product objects from TS/JS file
  const products = [];
  const regex = /\{[\s\S]*?"id":\s*"([^"]+)"[\s\S]*?"slug":\s*"([^"]+)"[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"description":\s*"([^"]+)"[\s\S]*?\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    products.push({
      id: match[1],
      slug: match[2],
      name: match[3],
      description: match[4]
    });
  }
  return products;
}

const fallbackPath = path.resolve(rootDir, 'src/data/fallbackProducts.ts');
const productsPath = path.resolve(rootDir, 'src/data/products.ts');

const fallbackProducts = parseProductsFromFile(fallbackPath);
const products = parseProductsFromFile(productsPath);

const allProducts = [...products, ...fallbackProducts];

// Deduplicate list by id
const uniqueProducts = [];
const seenIds = new Set();
for (const p of allProducts) {
  if (!seenIds.has(p.id)) {
    seenIds.add(p.id);
    uniqueProducts.push(p);
  }
}

console.log(`Analyzing ${uniqueProducts.length} unique product entries for duplicate descriptions...\n`);

const duplicateGroups = [];
const processed = new Set();

for (let i = 0; i < uniqueProducts.length; i++) {
  if (processed.has(i)) continue;
  const group = [uniqueProducts[i]];
  for (let j = i + 1; j < uniqueProducts.length; j++) {
    if (processed.has(j)) continue;
    const sim = jaccardSimilarity(uniqueProducts[i].description, uniqueProducts[j].description);
    if (sim >= 0.8) {
      group.push(uniqueProducts[j]);
      processed.add(j);
    }
  }
  if (group.length > 1) {
    duplicateGroups.push(group);
    processed.add(i);
  }
}

console.log(`=================================================================`);
console.log(`DUPLICATE PRODUCT DESCRIPTIONS DETECTED (${duplicateGroups.length} GROUPS FLAGGED)`);
console.log(`=================================================================\n`);

duplicateGroups.forEach((group, groupIdx) => {
  console.log(`--- GROUP ${groupIdx + 1} (${group.length} Products with Duplicate/Near-Duplicate Descriptions) ---`);
  group.forEach(p => {
    console.log(`ID: ${p.id}`);
    console.log(`Slug: ${p.slug}`);
    console.log(`Name: ${p.name}`);
  });
  console.log(`Current Description:`);
  console.log(`"${group[0].description}"\n`);
});
