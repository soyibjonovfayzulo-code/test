const fs = require('fs');

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

let mergedJs = '';
for (const file of jsFiles) {
  if (fs.existsSync(file)) {
    mergedJs += `/* --- ${file} --- */\n(() => {\n${fs.readFileSync(file, 'utf8')}\n})();\n\n`;
  }
}
fs.writeFileSync('script.js', mergedJs);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('<script type="module" src="script.js"></script>', '<script src="script.js"></script>');
fs.writeFileSync('index.html', html);

console.log('Script updated to work on file:// directly');
