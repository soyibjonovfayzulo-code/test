const fs = require('fs');
const path = require('path');

const cssFiles = [
  'style.css',
  'dashboard.css',
  'lessons.css',
  'ai-assistant.css',
  'mascot.css',
  'mobile.css',
  'onboarding.css',
  'auth-premium.css'
];

const jsFiles = [
  'lessons-data.js',
  'mascot.js',
  'lessons-app.js',
  'dashboard.js',
  'mobile.js',
  'ai-assistant.js',
  'onboarding.js',
  'script.js',
  'auth-fx.js'
];

let mergedCss = '';
for (const file of cssFiles) {
  if (fs.existsSync(file)) {
    mergedCss += `/* --- ${file} --- */\n` + fs.readFileSync(file, 'utf8') + '\n\n';
  }
}
fs.writeFileSync('style.css', mergedCss);

let mergedJs = '';
for (const file of jsFiles) {
  if (fs.existsSync(file)) {
    mergedJs += `/* --- ${file} --- */\n` + fs.readFileSync(file, 'utf8') + '\n\n';
  }
}
fs.writeFileSync('script.js', mergedJs);

// Delete the old files (except style.css and script.js)
const cssToDelete = cssFiles.filter(f => f !== 'style.css');
const jsToDelete = jsFiles.filter(f => f !== 'script.js');

for (const file of [...cssToDelete, ...jsToDelete]) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

// Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// Remove old css links
for (const file of cssToDelete) {
  const regex = new RegExp(`\\s*<link rel="stylesheet" href="${file}"\\s*/>`, 'g');
  html = html.replace(regex, '');
}

// Remove old js scripts
for (const file of jsToDelete) {
  const regex = new RegExp(`\\s*<script type="module" src="${file}"></script>`, 'g');
  html = html.replace(regex, '');
}

// Keep only style.css and script.js in html (which are already there, we just need to ensure they are the only ones left)
fs.writeFileSync('index.html', html);

console.log('Concatenation complete!');
