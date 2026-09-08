import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

// The original, image-embedded template is kept intact. Only named content
// regions are replaced, preserving the existing artwork and design tokens.
const original = readFileSync(new URL('../src/template.html', import.meta.url), 'utf8');
const sections = JSON.parse(readFileSync(new URL('../src/sections.json', import.meta.url), 'utf8'));
let html = original;
function replaceOne(pattern, content, label) {
  const matches = [...html.matchAll(new RegExp(pattern.source, 'g'))];
  assert.equal(matches.length, 1, `Expected one ${label}, found ${matches.length}`);
  html = html.replace(pattern, () => content);
}
function replaceSection(id, content) {
  replaceOne(new RegExp(`<section id="${id}">[\\s\\S]*?<\\/section>`), content, id);
}
replaceOne(/<title>[\s\S]*?<\/title>/, '<title>NEXT CHAPTER FILMS｜30秒アニメ制作・配信支援</title>', 'title');
replaceOne(/<meta name="description"[^>]*>/, '<meta name="description" content="企業の想いを、見てもらえる物語に。30秒アニメーション制作20万円（税別）から。YouTube Shorts向けの企画・縦型制作、広告配信、効果測定まで。制作のみ・配信込み・継続スポンサーの3つのプランをご案内します。">', 'description');
replaceOne(/<meta property="og:title"[^>]*>/, '<meta property="og:title" content="NEXT CHAPTER FILMS｜企業の想いを、見てもらえる物語に。">', 'OG title');
replaceOne(/<meta property="og:description"[^>]*>/, '<meta property="og:description" content="30秒のアニメーションから、その先の認知へ。企画・制作・配信・効果測定を、目的に合わせて。30秒制作20万円（税別）から。">', 'OG description');
replaceOne(/<header class="site-head">[\s\S]*?<\/header>/, sections.header, 'header');
const heroImage = original.match(/<img class="hero-img"[^>]*>/)?.[0];
assert.ok(heroImage, 'Original hero image is missing');
replaceOne(/<section class="hero">[\s\S]*?<\/section>/, sections.hero.replace('<!-- ORIGINAL_HERO_IMAGE -->', heroImage), 'hero');
replaceSection('problem', '');
replaceSection('why', sections.why + '\n' + sections.distribution);
replaceSection('flow', '');
replaceSection('price', sections.price + '\n' + sections.flow);
replaceSection('faq', sections.faq);
replaceSection('contact', sections.contact);
replaceOne(/<footer>[\s\S]*?<\/footer>/, sections.footer, 'footer');
replaceOne(/<div class="dock">[\s\S]*?<\/div>/, '<div class="dock"><a class="btn btn-primary" href="#contact">制作・配信を相談する（無料）</a></div>', 'mobile CTA');
replaceOne(/<p class="eyebrow">制作実績<\/p>/, '<p class="eyebrow">制作事例 / Story in 30 seconds</p>', 'work heading');
replaceOne(/<div class="work-foot">/, '<p class="work-disclosure">掲載画像は制作作品のカットです。配信成果・視聴データは、制作内容とは分けて案件ごとにご報告します。</p>\n<div class="work-foot">', 'work disclosure');
replaceOne(/<\/head>/, '<link rel="stylesheet" href="/strategy.css">\n<script src="/consultation.js" defer></script>\n</head>', 'head end');
replaceOne(/<body>/, '<body>\n<a class="skip-link" href="#top">本文へ移動</a>', 'body start');

const imageSources = s => [...s.matchAll(/src="(data:image\/[^"]+)"/g)].map(m => m[1]);
assert.deepEqual(imageSources(html), imageSources(original), 'Embedded artwork must remain unchanged');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Broken anchor: ${match[1]}`);
for (const id of ['work','why','distribution','price','flow','faq','contact']) assert.ok(ids.includes(id), `Missing ${id}`);
assert.ok(html.includes('https://cpa-hara.com/contact/'), 'Keep existing contact destination');
assert.ok(html.includes('https://cpa-hara.com/privacy/'), 'Keep existing privacy destination');
assert.ok(!html.includes('<!-- ORIGINAL_HERO_IMAGE -->'), 'Unresolved image placeholder');
assert.ok(!html.includes('利用権は貴社に帰属'), 'Unqualified rights claim must be replaced');
new Function(readFileSync(new URL('../src/consultation.js', import.meta.url), 'utf8'));
const out = new URL('../dist/', import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL('index.html', out), html);
for (const file of ['strategy.css','consultation.js']) copyFileSync(new URL(`../src/${file}`, import.meta.url), new URL(file, out));
const checks = { revision: 'strategy-2026-09', sections: ids.filter(id => ['work','why','distribution','price','flow','faq','contact'].includes(id)), embeddedImages: imageSources(html).length, artworkPreserved: true, uniqueIds: true, internalLinksValid: true, htmlSha256: createHash('sha256').update(html).digest('hex') };
writeFileSync(new URL('site-version.json', out), JSON.stringify(checks, null, 2));
console.log('NCF build checks passed:', JSON.stringify(checks));
