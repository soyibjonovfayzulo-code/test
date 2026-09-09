// jsdom smoke test for mobile.js rendering
const fs = require('fs');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body>' +
  '<div id="app"><main class="main"><section id="page-dashboard" class="page">' +
  '<div class="m-dash" id="mDash"><div class="m-hero"><h2 id="mHeroCourse"></h2><p id="mHeroLesson"></p>' +
  '<div class="m-hero-progress"><div id="mHeroFill"></div></div><span id="mHeroPct"></span>' +
  '<button id="mHeroBtn"></button></div>' +
  '<span id="mStatLessons"></span><span id="mStatDone"></span><span id="mStatStreak"></span>' +
  '<span id="mStatXp">0</span><div id="mChips"></div><div id="mCourses"></div></div>' +
  '</section></main></div></body></html>', { url: 'http://localhost/' });

dom.window.CoursesAPI = {
  listCourses: function () {
    return [
      { id: 'html', name: 'HTML', icon: 'G', tagline: 'Web sahifalar', lessons: [{ id: 'l1' }, { id: 'l2' }] },
      { id: 'python', name: 'Python', icon: 'P', tagline: 'Dasturlash', lessons: [{ id: 'p1' }] }
    ];
  }
};

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

// IIFE darhol ishga tushmasligi uchun readyState loading holatini soxta qilmaymiz —
// module require bilan yuklaymiz, init DOMContentLoaded'siz ham ishlaydi
global.document.readyState = 'complete';
require('./mobile.js');

setTimeout(() => {
  const d = dom.window.document;
  dom.window.MobileUI.renderDashboard();
  const cards = d.querySelectorAll('.m-course-card');
  const htmlCard = d.querySelector('.m-course-card[data-course="html"]');
  const checks = [
    ['cards rendered (2)', cards.length === 2],
    ['html card exists', !!htmlCard],
    ['hero title HTML', d.getElementById('mHeroCourse').textContent === 'HTML'],
    ['stats total lessons = 3', d.getElementById('mStatLessons').textContent === '3'],
    ['hero pct 0%', d.getElementById('mHeroPct').textContent.indexOf('0%') === 0],
    ['MobileUI exported', !!dom.window.MobileUI]
  ];
  let fail = 0;
  checks.forEach(([n, ok]) => { if (!ok) fail++; console.log((ok ? 'OK  ' : 'FAIL') + ' ' + n); });
  if (fail) process.exit(1);
  console.log('SMOKE TEST PASSED');
}, 700);
