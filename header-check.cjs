// ============================================================
//  HEADER / TOPBAR LAYER AUDIT
//  Header (topbar) geometry, scroll, layer hierarchy va click
//  auditini tekshiruvchi smoke test.
//  Run: node header-check.cjs
// ============================================================
const fs = require('fs');

let pass = 0, fail = 0;
function ok(cond, label) {
  if (cond) { pass++; console.log('  OK  ' + label); }
  else { fail++; console.log('  FAIL ' + label); }
}
function section(t) { console.log('\n' + t + '\n' + '-'.repeat(50)); }

const style = fs.readFileSync('style.css', 'utf8').replace(/\r\n/g, '\n');
const mobile = fs.readFileSync('mobile.css', 'utf8').replace(/\r\n/g, '\n');
const lessons = fs.readFileSync('lessons.css', 'utf8').replace(/\r\n/g, '\n');
const html = fs.readFileSync('index.html', 'utf8');

// Extract the main .topbar rule block from style.css
const topbarMatch = style.match(/\/\* TOPBAR \*\/[\s\S]*?\.topbar\s*\{([\s\S]*?)\n\}/);
const topbarBody = topbarMatch ? topbarMatch[1] : '';

section('1. DESKTOP TOPBAR GEOMETRY (style.css)');
ok(topbarBody.includes('position: sticky'), '.topbar -> position: sticky (fixed emas)');
ok(!/position:\s*fixed/.test(topbarBody), '.topbar rule ichida position: fixed YO\'Q');
ok(/top:\s*0/.test(topbarBody), '.topbar -> top: 0');
ok(/width:\s*100%/.test(topbarBody), '.topbar -> width: 100% (shrink-to-fit emas)');
ok(/z-index:\s*90/.test(topbarBody), '.topbar -> z-index: 90 (content ustida, sidebar ostida)');
ok(topbarBody.includes('isolation: isolate'), '.topbar -> isolation: isolate (stack context)');
ok(/color-mix\(in srgb,\s*var\(--bg\)\s*92%/.test(topbarBody), '.topbar background ~92% opaque (content yozuvlari ko\'rinmaydi)');
ok(/min-height:\s*64px/.test(topbarBody), '.topbar -> min-height: 64px');

section('2. MOBILE TOPBAR (mobile.css)');
const mobTop = mobile.match(/\.topbar\s*\{[^}]*\}/);
ok(!!mobTop && /position:\s*sticky\s*!important/.test(mobTop[0]), 'mobile .topbar -> sticky !important (fixed emas)');
ok(!!mobTop && /safe-area-inset-top/.test(mobTop[0]) || /safe-area-inset-top/.test(mobile), 'mobile .topbar safe-area inset saqlangan');
ok(!/\.topbar\s*\{[^}]*position:\s*fixed/.test(mobile), 'mobile .topbar fixed emas (content ostiga yashirinmaydi)');

section('3. SCROLL / OFFSET HACK YO\'QLIGI');
ok(!/\.main\s+\.content\s*\{[^}]*padding-top:\s*\d{2,}px/.test(style), '.content ga header kompensatsiya padding-top hack YO\'Q (sticky oqimda)');
ok(!/\.content\s*\{[^}]*margin-top:\s*\d{2,}px/.test(style), '.content margin-top hack YO\'Q');
ok(!/\.topbar\s*\{[^}]*left:\s*260|\.topbar\s*\{[^}]*margin-left/.test(style), '.topbar oldingi fixed sidebar-offset hacki YO\'Q');

section('4. DECORATIVE CLICK AUDIT (pointer-events)');
const decorSelectors = [
  '.auth-bg::after', '.welcome-banner::before', '.btn::after',
  '.xp-bar-fill::after', '.progress-fill::after', '.subject-card::before',
  '.store-item::before', '.hero-code-badge', '.sidebar .nav-item.active::before'
];
for (const sel of decorSelectors) {
  const auditBlock = style.match(/LAYER HIERARCHY & CLICK AUDIT[\s\S]*$/);
  const decl = new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]{0,600}?pointer-events:\\s*none');
  ok(decl.test(auditBlock ? auditBlock[0] : style), sel + ' -> pointer-events: none');
}
ok(style.includes('.hero-code-badge {\n  pointer-events: none;'), '.hero-code-badge dekorativ: click ushlab qolmaydi');

section('5. FUNCTIONAL Z-INDEX HIERARCHY');
const zOf = (sel, src) => {
  const escaped = sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped + '\\s*\\{[^}]*?z-index:\\s*(\\d+)');
  const m = (src || style).match(re);
  return m ? parseInt(m[1], 10) : null;
};
const zTopbar = zOf('.topbar');
const zSidebar = zOf('.sidebar');
const zOverlay = zOf('.sidebar-overlay');
const zDropdown = zOf('.ux-user-dropdown', lessons);
ok(zTopbar === 90, 'topbar z=90');
ok(zSidebar === 100, 'sidebar (drawer) z=100 > topbar');
ok(zOverlay === 99 || zOverlay === 94, 'overlay z=99/94 > topbar');
ok(zDropdown === 240, 'profil dropdown z=240 (header ustida)');

section('6. HTML: topbar elementlari');
ok((html.match(/class="topbar"/g) || []).length === 1, 'faqat 1 ta .topbar element (dublikat YO\'Q)');
ok(html.includes('id="topbarUsername"') && html.includes('id="topbarAvatar"'), 'topbar username/avatar mavjud');
ok(html.includes('notifDropdown'), 'notification dropdown markup mavjud');

console.log('\n' + '='.repeat(50));
console.log('  NATIJA: ' + pass + ' otdi, ' + fail + ' xato');
console.log('='.repeat(50));
process.exit(fail ? 1 : 0);
