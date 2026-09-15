/* admin.js — IT Test Platform Admin Panel */
'use strict';

const API = '';        // same origin (Express serves both)
let TOKEN = localStorage.getItem('admin_token') || '';
let ALL_COURSES = [];
let EDIT_COURSE_ID = null;
let EDIT_LESSON_ID = null;
let EDIT_LESSON_COURSE_ID = null;

// ────────────────────────────────────────────
// AUTH GUARD
// ────────────────────────────────────────────
if (!TOKEN) {
  window.location.href = '/admin/login.html';
}

function headers() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` };
}

function logout() {
  localStorage.removeItem('admin_token');
  window.location.href = '/admin/login.html';
}

// ────────────────────────────────────────────
// FETCH HELPERS
// ────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  try {
    const res = await fetch(API + url, { headers: headers(), ...options });
    if (res.status === 401) { logout(); return null; }
    return res;
  } catch (e) {
    toast('Server bilan aloqa yo\'q!', 'error');
    return null;
  }
}

async function loadCourses() {
  const res = await apiFetch('/api/courses');
  if (!res) return;
  ALL_COURSES = await res.json();
  renderDashboard();
  renderCoursesTable();
  renderLessonsTable();
  populateCourseSelects();
}

// ────────────────────────────────────────────
// TABS
// ────────────────────────────────────────────
function showTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('tab-' + name).classList.remove('hidden');
  if (el) el.classList.add('active');
  document.getElementById('pageTitle').textContent =
    name === 'dashboard' ? 'Dashboard' :
    name === 'courses' ? 'Kurslar' : 'Darslar';
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ────────────────────────────────────────────
// DASHBOARD
// ────────────────────────────────────────────
function renderDashboard() {
  const totalLessons = ALL_COURSES.reduce((s, c) => s + (c.topics ? c.topics.length : 0), 0);
  const totalQuizzes = ALL_COURSES.reduce((s, c) => {
    return s + (c.topics ? c.topics.filter(t => t.quiz && t.quiz.questions && t.quiz.questions.length > 0).length : 0);
  }, 0);

  document.getElementById('statCourses').textContent = ALL_COURSES.length;
  document.getElementById('statLessons').textContent = totalLessons;
  document.getElementById('statQuizzes').textContent = totalQuizzes;

  const ov = document.getElementById('coursesOverview');
  ov.innerHTML = ALL_COURSES.map(c => `
    <div class="course-chip">
      <span class="chip-icon">${c.icon || '📚'}</span>
      <span style="color:${c.color || 'inherit'}">${c.name}</span>
      <span class="chip-count">${(c.topics || []).length} dars</span>
    </div>
  `).join('');
}

// ────────────────────────────────────────────
// COURSES TABLE
// ────────────────────────────────────────────
function renderCoursesTable() {
  const tbody = document.getElementById('coursesTableBody');
  if (!ALL_COURSES.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Kurs mavjud emas</td></tr>';
    return;
  }
  tbody.innerHTML = ALL_COURSES.map(c => `
    <tr>
      <td><code style="background:var(--surface2);padding:2px 7px;border-radius:4px;font-size:12px">${c.id}</code></td>
      <td><strong>${c.name}</strong></td>
      <td style="font-size:22px">${c.icon || '—'}</td>
      <td><span class="color-dot" style="background:${c.color || '#888'}"></span>${c.color || '—'}</td>
      <td><span class="badge badge-blue">${(c.topics || []).length} ta</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="openCourseModal('${c.id}')">✏️ Tahrirlash</button>
          <button class="btn-del" onclick="deleteCourse('${c.id}', '${escHtml(c.name)}')">🗑️ O'chirish</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ────────────────────────────────────────────
// LESSONS TABLE
// ────────────────────────────────────────────
function filterLessons() { renderLessonsTable(); }

function renderLessonsTable() {
  const filter = document.getElementById('lessonCourseFilter').value;
  const tbody = document.getElementById('lessonsTableBody');
  let rows = [];
  let idx = 1;

  const coursesToShow = filter ? ALL_COURSES.filter(c => c.id === filter) : ALL_COURSES;

  coursesToShow.forEach(course => {
    (course.topics || []).forEach(topic => {
      rows.push({ course, topic, idx: idx++ });
    });
  });

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Dars mavjud emas</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(({ course, topic, idx }) => `
    <tr>
      <td style="color:var(--text-muted);font-size:12px">${idx}</td>
      <td><strong>${escHtml(topic.title)}</strong></td>
      <td><span style="color:${course.color}">${course.icon} ${escHtml(course.name)}</span></td>
      <td>${topic.duration ? topic.duration + ' min' : '—'}</td>
      <td>${topic.xp ? '<span class="badge badge-blue">+' + topic.xp + ' XP</span>' : '—'}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="openLessonModal('${course.id}', ${topic.id})">✏️ Tahrirlash</button>
          <button class="btn-del" onclick="deleteLesson(${topic.id}, '${escHtml(topic.title)}')">🗑️ O'chirish</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function populateCourseSelects() {
  const filter = document.getElementById('lessonCourseFilter');
  const sel = document.getElementById('lessonCourseId');
  const opts = ALL_COURSES.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');

  filter.innerHTML = '<option value="">Barcha kurslar</option>' + opts;
  sel.innerHTML = '<option value="">— tanlang —</option>' + opts;
}

// ────────────────────────────────────────────
// COURSE MODAL
// ────────────────────────────────────────────
function openCourseModal(courseId = null) {
  EDIT_COURSE_ID = courseId;
  const modal = document.getElementById('courseModal');
  const title = document.getElementById('courseModalTitle');

  if (courseId) {
    const c = ALL_COURSES.find(x => x.id === courseId);
    if (!c) return;
    title.textContent = 'Kursni tahrirlash';
    document.getElementById('courseId').value = c.id;
    document.getElementById('courseId').disabled = true;
    document.getElementById('courseIcon').value = c.icon || '';
    document.getElementById('courseName').value = c.name || '';
    document.getElementById('courseColor').value = c.color || '';
    document.getElementById('courseColorPicker').value = c.color || '#2563eb';
    document.getElementById('courseTagline').value = c.tagline || '';
    document.getElementById('courseDescription').value = c.description || '';
  } else {
    title.textContent = 'Yangi Kurs';
    document.getElementById('courseId').value = '';
    document.getElementById('courseId').disabled = false;
    document.getElementById('courseIcon').value = '';
    document.getElementById('courseName').value = '';
    document.getElementById('courseColor').value = '';
    document.getElementById('courseColorPicker').value = '#2563eb';
    document.getElementById('courseTagline').value = '';
    document.getElementById('courseDescription').value = '';
  }

  modal.classList.add('show');
}

function closeCourseModal() {
  document.getElementById('courseModal').classList.remove('show');
  EDIT_COURSE_ID = null;
}

async function saveCourse() {
  const id = document.getElementById('courseId').value.trim();
  const name = document.getElementById('courseName').value.trim();
  const icon = document.getElementById('courseIcon').value.trim();
  const color = document.getElementById('courseColor').value.trim();
  const tagline = document.getElementById('courseTagline').value.trim();
  const description = document.getElementById('courseDescription').value.trim();

  if (!name) return toast('Kurs nomini kiriting!', 'error');
  if (!EDIT_COURSE_ID && !id) return toast('Kurs ID kiriting!', 'error');

  const body = { id: EDIT_COURSE_ID || id, name, icon, color, tagline, description };
  const btn = document.getElementById('saveCourseBtn');
  btn.textContent = 'Saqlanmoqda...'; btn.disabled = true;

  let res;
  if (EDIT_COURSE_ID) {
    res = await apiFetch(`/api/courses/${EDIT_COURSE_ID}`, { method: 'PUT', body: JSON.stringify(body) });
  } else {
    res = await apiFetch('/api/courses', { method: 'POST', body: JSON.stringify(body) });
  }

  btn.textContent = 'Saqlash'; btn.disabled = false;

  if (res && res.ok) {
    toast(EDIT_COURSE_ID ? 'Kurs yangilandi!' : 'Kurs qo\'shildi!', 'success');
    closeCourseModal();
    await loadCourses();
  } else {
    const err = res ? await res.json() : {};
    toast('Xato: ' + (err.error || 'Noma\'lum'), 'error');
  }
}

async function deleteCourse(id, name) {
  if (!confirm(`"${name}" kursini o'chirasizmi? Uning barcha darslari ham o'chadi!`)) return;
  const res = await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
  if (res && res.ok) {
    toast('Kurs o\'chirildi', 'success');
    await loadCourses();
  } else {
    toast('O\'chirishda xato!', 'error');
  }
}

// ────────────────────────────────────────────
// LESSON MODAL
// ────────────────────────────────────────────
function openLessonModal(courseId = null, topicId = null) {
  EDIT_LESSON_ID = topicId;
  EDIT_LESSON_COURSE_ID = courseId;
  const modal = document.getElementById('lessonModal');
  const title = document.getElementById('lessonModalTitle');

  // Reset quiz panel
  document.getElementById('quizQuestions').innerHTML = '';

  if (courseId && topicId) {
    const course = ALL_COURSES.find(c => c.id === courseId);
    const topic = course && course.topics ? course.topics.find(t => t.id === topicId) : null;
    if (!topic) return;

    title.textContent = 'Darsni tahrirlash';
    document.getElementById('lessonTitle').value = topic.title || '';
    document.getElementById('lessonCourseId').value = courseId;
    document.getElementById('lessonDuration').value = topic.duration || '';
    document.getElementById('lessonXp').value = topic.xp || '';

    const content = topic.content || {};
    document.getElementById('lessonIntro').value = content.intro || '';
    document.getElementById('lessonSections').value = JSON.stringify(content.sections || [], null, 2);
    document.getElementById('lessonKeyPoints').value = JSON.stringify(content.keyPoints || [], null, 2);

    // Quiz
    const quiz = topic.quiz || {};
    document.getElementById('quizPassingScore').value = quiz.passingScore || 80;
    (quiz.questions || []).forEach(q => addQuizQuestion(q));
  } else {
    title.textContent = 'Yangi Dars';
    ['lessonTitle','lessonIntro','lessonSections','lessonKeyPoints'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('lessonDuration').value = '';
    document.getElementById('lessonXp').value = '';
    document.getElementById('quizPassingScore').value = '80';
    if (courseId) document.getElementById('lessonCourseId').value = courseId;
  }

  // Reset to content tab
  switchLessonTab('content', document.querySelector('.tab-mini-btn'));
  modal.classList.add('show');
}

function closeLessonModal() {
  document.getElementById('lessonModal').classList.remove('show');
  EDIT_LESSON_ID = null;
  EDIT_LESSON_COURSE_ID = null;
}

function switchLessonTab(tab, btn) {
  document.querySelectorAll('.lesson-tab-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.tab-mini-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('lessonTab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.remove('hidden');
  if (btn) btn.classList.add('active');
}

async function saveLesson() {
  const title = document.getElementById('lessonTitle').value.trim();
  const courseId = document.getElementById('lessonCourseId').value;
  const duration = parseInt(document.getElementById('lessonDuration').value) || null;
  const xp = parseInt(document.getElementById('lessonXp').value) || null;
  const intro = document.getElementById('lessonIntro').value.trim();

  if (!title) return toast('Dars nomini kiriting!', 'error');
  if (!courseId) return toast('Kursni tanlang!', 'error');

  let sections = [], keyPoints = [];
  try {
    const sv = document.getElementById('lessonSections').value.trim();
    sections = sv ? JSON.parse(sv) : [];
  } catch { return toast('Sections JSON formati xato!', 'error'); }

  try {
    const kv = document.getElementById('lessonKeyPoints').value.trim();
    keyPoints = kv ? JSON.parse(kv) : [];
  } catch { return toast('Key Points JSON formati xato!', 'error'); }

  const content = { intro, sections, keyPoints };

  // Collect quiz
  const quizPassingScore = parseInt(document.getElementById('quizPassingScore').value) || 80;
  const questionBlocks = document.querySelectorAll('.quiz-question-block');
  const questions = [];
  let quizOk = true;

  questionBlocks.forEach((block, i) => {
    const q = block.querySelector('.q-text').value.trim();
    const explanation = block.querySelector('.q-explanation').value.trim();
    const options = Array.from(block.querySelectorAll('.opt-input')).map(inp => inp.value.trim());
    const answerRadio = block.querySelector('input[type=radio]:checked');
    const answer = answerRadio ? parseInt(answerRadio.value) : 0;

    if (!q) { toast(`${i+1}-savol matni bo'sh!`, 'error'); quizOk = false; return; }
    questions.push({ question: q, options, answer, explanation });
  });

  if (!quizOk) return;
  const quiz = { passingScore: quizPassingScore, questions };

  const body = { course_id: courseId, title, duration, xp, content, quiz };
  const btn = document.getElementById('saveLessonBtn');
  btn.textContent = 'Saqlanmoqda...'; btn.disabled = true;

  let res;
  if (EDIT_LESSON_ID) {
    res = await apiFetch(`/api/topics/${EDIT_LESSON_ID}`, { method: 'PUT', body: JSON.stringify(body) });
  } else {
    res = await apiFetch('/api/topics', { method: 'POST', body: JSON.stringify(body) });
  }

  btn.textContent = 'Saqlash'; btn.disabled = false;

  if (res && res.ok) {
    toast(EDIT_LESSON_ID ? 'Dars yangilandi!' : 'Dars qo\'shildi!', 'success');
    closeLessonModal();
    await loadCourses();
  } else {
    const err = res ? await res.json() : {};
    toast('Xato: ' + (err.error || 'Noma\'lum'), 'error');
  }
}

async function deleteLesson(topicId, title) {
  if (!confirm(`"${title}" darsini o'chirasizmi?`)) return;
  const res = await apiFetch(`/api/topics/${topicId}`, { method: 'DELETE' });
  if (res && res.ok) {
    toast('Dars o\'chirildi', 'success');
    await loadCourses();
  } else {
    toast('O\'chirishda xato!', 'error');
  }
}

// ────────────────────────────────────────────
// QUIZ EDITOR
// ────────────────────────────────────────────
let quizQCount = 0;

function addQuizQuestion(data = null) {
  quizQCount++;
  const container = document.getElementById('quizQuestions');
  const id = 'qq_' + quizQCount;

  const options = data ? data.options : ['', '', '', ''];
  const answer = data ? data.answer : 0;

  const optionsHtml = options.map((opt, i) => `
    <div class="quiz-option-row">
      <input type="radio" name="answer_${id}" value="${i}" ${i === answer ? 'checked' : ''}>
      <span class="opt-label">Variant ${String.fromCharCode(65+i)}:</span>
      <input type="text" class="opt-input" placeholder="Variant matni..." value="${escHtml(opt)}">
    </div>
  `).join('');

  const block = document.createElement('div');
  block.className = 'quiz-question-block';
  block.id = id;
  block.innerHTML = `
    <div class="q-head">
      <span class="q-num">Savol ${quizQCount}</span>
      <button class="btn-del btn-sm" style="padding:4px 10px;font-size:11px" onclick="this.closest('.quiz-question-block').remove()">✕ O'chirish</button>
    </div>
    <textarea class="q-text" rows="2" placeholder="Savol matni..." style="width:100%;margin-bottom:10px">${data ? escHtml(data.question) : ''}</textarea>
    <div class="quiz-options">${optionsHtml}</div>
    <button class="add-option-btn" onclick="addOption(this, '${id}')">➕ Variant qo'shish</button>
    <div class="form-group" style="margin-top:12px;margin-bottom:0">
      <label>Izoh (explanation)</label>
      <textarea class="q-explanation" rows="2" placeholder="To'g'ri javobni izohlang...">${data ? escHtml(data.explanation || '') : ''}</textarea>
    </div>
  `;
  container.appendChild(block);
}

function addOption(btn, qId) {
  const block = document.getElementById(qId);
  const container = block.querySelector('.quiz-options');
  const optCount = container.querySelectorAll('.quiz-option-row').length;
  const row = document.createElement('div');
  row.className = 'quiz-option-row';
  row.innerHTML = `
    <input type="radio" name="answer_${qId}" value="${optCount}">
    <span class="opt-label">Variant ${String.fromCharCode(65+optCount)}:</span>
    <input type="text" class="opt-input" placeholder="Variant matni...">
  `;
  container.appendChild(row);
}

// ────────────────────────────────────────────
// TOAST
// ────────────────────────────────────────────
function toast(message, type = 'info') {
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => {
    el.classList.add('removing');
    setTimeout(() => el.remove(), 260);
  }, 3500);
}

// ────────────────────────────────────────────
// UTILS
// ────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────
loadCourses();
