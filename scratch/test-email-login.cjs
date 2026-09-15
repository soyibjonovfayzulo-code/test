const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

const dom = new JSDOM(html, {
  url: 'http://localhost/',
  runScripts: 'dangerously',
  resources: 'usable'
});

const { window } = dom;

// Mock fetch for json files
window.fetch = async (url) => {
  if (url.includes('.json')) {
    const filename = path.basename(url);
    const filePath = path.join(__dirname, '../data', filename);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return {
        ok: true,
        json: async () => data
      };
    }
  }
  return { ok: false, status: 404 };
};

// Read script files and evaluate
const scripts = [
  'lessons-data.js',
  'lessons-app.js',
  'daily-streak.js',
  'mascot.js',
  'ai-assistant.js',
  'widget-sync.js',
  'script.js'
];

window.console.error = (...args) => console.log('[WINDOW ERROR]', ...args);
window.console.warn = (...args) => console.log('[WINDOW WARN]', ...args);

for (const s of scripts) {
  const code = fs.readFileSync(path.join(__dirname, '../', s), 'utf8');
  try {
    window.eval(code);
  } catch (e) {
    console.log(`Error evaluating ${s}:`, e);
  }
}

console.log('DOM initialized. Testing Email Login Flow...');

// Register user via window
const regEmail = 'testuser@gmail.com';
const regPass = '123456';

window.eval(`
  const u = {
    id: "u12345",
    firstname: "Test",
    lastname: "User",
    username: "testuser",
    email: "${regEmail}",
    password: "${regPass}",
    xp: 0, points: 0, level: 1,
    joinedAt: Date.now(),
    streak: 0, lastActiveDay: null, testResults: [],
    duelHistory: [], achievements: [], store: { inventory: [], equipped: {} }
  };
  if (typeof users !== 'undefined') users.push(u);
  if (typeof saveUsersAndCurrent === 'function') saveUsersAndCurrent();
`);

console.log('User registered. Now testing login with email:', regEmail);

// Set login inputs
window.document.getElementById('loginEmail').value = regEmail;
window.document.getElementById('loginPassword').value = regPass;

// Trigger login form submit
const loginForm = window.document.getElementById('loginForm');
loginForm.dispatchEvent(new window.Event('submit', { cancelable: true, bubbles: true }));

console.log('Current User after login:', window.currentUser ? window.currentUser.email : 'null');

// Try opening tests page
console.log('Opening tests page...');
window.showPage('tests');

console.log('Opening subject Python tests...');
window.openSubjectTests('Python');

const container = window.document.getElementById('testListContainer');
console.log('Test list items HTML count:', container.querySelectorAll('.test-list-item').length);

// Try starting a test
const firstBtn = container.querySelector('.start-test-btn');
if (firstBtn) {
  console.log('First test btn data-testid:', firstBtn.getAttribute('data-testid'));
  console.log('First test btn disabled?:', firstBtn.disabled);
  firstBtn.click();
} else {
  console.log('No start-test-btn found!');
}

console.log('Active page after test click:', window.document.querySelector('.page.active')?.id);
console.log('Quiz state:', window.quiz ? { finished: window.quiz.finished, currentIndex: window.quiz.currentIndex, questionsLength: window.quiz.test?.questions?.length } : 'no quiz');

// Check question render & answer click
if (window.quiz && window.quiz.test) {
  const options = window.document.querySelectorAll('#optionsContainer .option');
  console.log('Options count for question 0:', options.length);
  if (options.length > 0) {
    console.log('Clicking option 0...');
    options[0].click();
    console.log('Quiz answer for 0:', window.quiz.answers[0]);
  }
}
