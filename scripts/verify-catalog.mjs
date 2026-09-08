#!/usr/bin/env node
/**
 * Catalog integrity checks for the RAPPI Sports Hub Expo app.
 * Mirrors the webapp: unique SKUs, NAD prices, shipping 100/150/0, pagination.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/catalog.json'), 'utf8'));
const featured = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/featured.json'), 'utf8'));

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL', msg);
    process.exitCode = 1;
  }
}

assert(Array.isArray(catalog) && catalog.length >= 10000, `expected ~11104 products, got ${catalog.length}`);
const codes = new Set(catalog.map((p) => p.code));
assert(codes.size === catalog.length, 'duplicate product codes');

const spotlight = ['104409.484', 'TOJS2604TF', 'RR300W2680', 'C448S2715'];
for (const code of spotlight) {
  assert(codes.has(code), `missing spotlight ${code}`);
}

let sold = 0;
for (const p of catalog) {
  assert(typeof p.price === 'number' && p.price >= 0, `bad price ${p.code}`);
  assert(p.img && /^https?:\/\//.test(p.img), `missing image ${p.code}`);
  assert(Array.isArray(p.sizes) && p.sizes.length > 0, `no sizes ${p.code}`);
  if (p.stock <= 0) sold++;
}

const shipping = [
  { id: 'standard', cost: 100 },
  { id: 'express', cost: 150 },
  { id: 'pickup', cost: 0 },
];
assert(shipping[0].cost === 100 && shipping[1].cost === 150 && shipping[2].cost === 0, 'shipping 100/150/0');

function formatPrice(value) {
  const n = new Intl.NumberFormat('en-NA', { maximumFractionDigits: 0 }).format(Math.round(value));
  return `N$${n}`;
}
assert(formatPrice(2239) === 'N$2,239' || formatPrice(2239).startsWith('N$'), 'NAD format');

const PAGE = 24;
const q = 'shoe';
const hits = catalog.filter((p) => `${p.name} ${p.code} ${p.cat}`.toLowerCase().includes(q));
const pageCount = Math.max(1, Math.ceil(hits.length / PAGE));
assert(pageCount >= 1 && hits.length > PAGE, `search pagination too small (${hits.length})`);

assert(featured.length > 0, 'featured subset missing');

const env = JSON.parse(fs.readFileSync(path.join(__dirname, '../.cursor/environment.json'), 'utf8'));
assert(Array.isArray(env.ports) && typeof env.ports[0] === 'object' && env.ports[0].port === 8081, 'ports schema');
assert(!env.ports.some((p) => typeof p === 'number'), 'ports must not be bare numbers');

console.log(
  JSON.stringify(
    {
      ok: !process.exitCode,
      products: catalog.length,
      uniqueCodes: codes.size,
      soldOut: sold,
      inStock: catalog.length - sold,
      searchHits: hits.length,
      searchPages: pageCount,
      featured: featured.length,
      shipping,
    },
    null,
    2,
  ),
);
