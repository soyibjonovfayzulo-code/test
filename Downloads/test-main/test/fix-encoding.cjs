/* ==========================================================
   UTF-8 MOJIBAKE FIXER (root-cause: double encoding)
   ==========================================================
   Ba'zi fayllar NOTO'G'RI saqlangan: asl UTF-8 baytlar
   CP1251 sifatida talqin qilinib, yana UTF-8 ga yozilgan.
   Natijada: — -> вЂ” , o‘ -> oвЂ , 🌐 -> рџЊђ ko'rinishida.

   Bu skript teskari transformatsiyani bajaradi:
     1. Faylni UTF-8 string sifatida o'qiydi.
     2. CP1251 kartasidagi belgilarni (0x80-0xFF) baytlarga
        qaytaradi — LEKIN faqat hosil bo'lgan bayt ketma-ketligi
        to'g'ri UTF-8 bo'lib decode bo'lsa (validatsiya bilan).
     3. Dekodlanmasa — belgi o'zgarichsa saqlanadi (xavfsiz).
   ========================================================== */
'use strict';
const fs = require('fs');

/* CP1251: byte 0x80-0xFF -> char */
const CP1251_HIGH = [
  '\u0402','\u0403','\u201A','\u0453','\u201E','\u2026','\u2020','\u2021',
  '\u20AC','\u2030','\u0409','\u2039','\u040A','\u040C','\u040B','\u040F',
  '\u0452','\u2018','\u2019','\u201C','\u201D','\u2022','\u2013','\u2014',
  '\u0098','\u2122','\u0459','\u203A','\u045A','\u045C','\u045B','\u045F',
  '\u00A0','\u040E','\u045E','\u0408','\u00A4','\u0490','\u00A6','\u00A7',
  '\u0401','\u00A9','\u0404','\u00AB','\u00AC','\u00AD','\u00AE','\u0407',
  '\u00B0','\u00B1','\u0406','\u0456','\u0491','\u00B5','\u00B6','\u00B7',
  '\u0451','\u2116','\u0454','\u00BB','\u0458','\u0405','\u0455','\u0457'
];
for (let b = 0xC0; b <= 0xFF; b++) CP1251_HIGH[b - 0x80] = String.fromCharCode(0x0410 + (b - 0xC0)); // А-я
/* char -> byte teskari karta */
const REV = {};
CP1251_HIGH.forEach((ch, i) => { if (REV[ch] === undefined) REV[ch] = 0x80 + i; });

/** Run'ni baytlarga aylantirib UTF-8 sifatida decode qilish.
 *  Muvaffaqiyatsiz bo'lsa null qaytaradi. */
function tryDecodeRun(chars) {
  const bytes = Buffer.allocUnsafe(chars.length);
  for (let i = 0; i < chars.length; i++) bytes[i] = REV[chars[i]];
  const decoded = bytes.toString('utf8');
  if (decoded.indexOf('\uFFFD') !== -1) return null;      // buzilgan decode
  // Round-trip tekshiruv: decoded yana cp1251-baytlarga aylansa o'ziga qaytishi kerak
  return decoded;
}

function fixString(str) {
  let out = '', i = 0;
  while (i < str.length) {
    if (REV[str[i]] === undefined) { out += str[i]; i++; continue; }
    // Mappable run topamiz (maksimal uzunligi)
    let j = i;
    while (j < str.length && REV[str[j]] !== undefined) j++;
    const runLen = j - i;
    let consumed = 0;
    // Eng uzun run'dan boshlab qisqarib tekshiramiz — valid UTF-8 bo'lsa olamiz
    for (let len = runLen; len >= 1; len--) {
      const decoded = tryDecodeRun(str.substr(i, len));
      if (decoded !== null) { out += decoded; consumed = len; break; }
    }
    if (consumed === 0) { out += str[i]; i++; }            // xavfsiz fallback
    else i += consumed;
  }
  return out;
}

const MOJIBAKE_RE = /[\u0402\u0403\u0409\u040A\u040C\u040B\u040F\u0452\u0459\u045A\u045C\u045B\u045F\u040E\u045E\u0408\u0401\u0404\u0406\u0405\u0407\u0451\u0454\u0456\u0455\u0457\u0490\u0491\u040E\u2116\u20AC]/;

const files = process.argv.slice(2);
files.forEach(function (f) {
  const raw = fs.readFileSync(f);
  const hadBOM = raw[0] === 0xEF && raw[1] === 0xBB && raw[2] === 0xBF;
  const text = raw.toString('utf8');
  const fixed = fixString(text);
  const changed = fixed !== text;
  if (changed) {
    fs.writeFileSync(f, fixed, 'utf8'); // UTF-8, BOM'siz — html/js uchun standart
  }
  const remaining = (fixed.match(new RegExp(MOJIBAKE_RE.source, 'g')) || []).length;
  console.log(f + ': ' + (changed ? 'TUZATILDI' : 'ozgarishsiz') +
    ' | qolgan shubhali belgi: ' + remaining + ' | BOM: ' + (hadBOM ? 'bor (olib tashlandi)' : 'yo\'q'));
});
