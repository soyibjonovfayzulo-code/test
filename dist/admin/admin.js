/* admin.js — IT Test Platform Admin Panel */
'use strict';

const API = '';        // same origin (Express serves both)
let TOKEN = localStorage.getItem('admin_token') || '';
let ALL_COURSES = [];
let ALL_TEST_QUESTIONS = [];
let EDIT_COURSE_ID = null;
let EDIT_LESSON_ID = null;
let EDIT_LESSON_COURSE_ID = null;
let EDIT_TQ_ID = null;

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

async function loadInitialData() {
  // Check who am I
  const meRes = await apiFetch('/api/auth/me');
  if (meRes && meRes.ok) {
    const me = await meRes.json();
    const badge = document.getElementById('adminUserBadge');
    if (badge && me.username) badge.textContent = '👤 ' + me.username;
  }

  await Promise.all([loadCourses(), loadTestQuestions(), loadStats()]);
}

async function loadStats() {
  const res = await apiFetch('/api/admin/stats');
  if (!res || !res.ok) return;
  const s = await res.json();
  const statC = document.getElementById('statCourses');
  const statL = document.getElementById('statLessons');
  const statQ = document.getElementById('statQuestions');
  const statP = document.getElementById('statPublished');

  if (statC) statC.textContent = s.totalCourses || 0;
  if (statL) statL.textContent = s.totalTopics || 0;
  if (statQ) statQ.textContent = s.totalQuestions || 0;
  if (statP) statP.textContent = `${s.publishedCourses || 0} k / ${s.publishedTopics || 0} d`;
}

async function loadCourses() {
  const res = await apiFetch('/api/courses?all=1');
  if (!res || !res.ok) return;
  ALL_COURSES = await res.json();
  renderDashboard();
  renderCoursesTable();
  renderLessonsTable();
  populateCourseSelects();
}

async function loadTestQuestions() {
  const res = await apiFetch('/api/admin/test-questions');
  if (!res || !res.ok) return;
  ALL_TEST_QUESTIONS = await res.json();
  renderTestsTable();
}

// ────────────────────────────────────────────
// TABS
// ────────────────────────────────────────────
function showTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('tab-' + name);
  if (target) target.classList.remove('hidden');
  if (el) el.classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    courses: 'Kurslar',
    lessons: 'Darslar',
    tests: 'Test Savollari',
    settings: 'Xavfsizlik'
  };
  document.getElementById('pageTitle').textContent = titles[name] || 'Admin Panel';

  if (name === 'dashboard') loadStats();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ────────────────────────────────────────────
// DASHBOARD
// ────────────────────────────────────────────
function renderDashboard() {
  const ov = document.getElementById('coursesOverview');
  if (!ov) return;
  ov.innerHTML = ALL_COURSES.map(c => `
    <div class="course-chip">
      <span class="chip-icon">${c.icon || '📚'}</span>
      <span style="color:${c.color || 'inherit'};font-weight:600">${escHtml(c.name)}</span>
      <span class="chip-count">${(c.topics || []).length} dars</span>
      ${c.published ? '<span class="badge badge-green">faol</span>' : '<span class="badge badge-yellow">qoralama</span>'}
    </div>
  `).join('');
}

// ────────────────────────────────────────────
// COURSES TABLE
// ────────────────────────────────────────────
function renderCoursesTable() {
  const tbody = document.getElementById('coursesTableBody');
  if (!tbody) return;
  if (!ALL_COURSES.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Kurs mavjud emas</td></tr>';
    return;
  }
  tbody.innerHTML = ALL_COURSES.map(c => `
    <tr>
      <td><code style="background:var(--surface2);padding:2px 7px;border-radius:4px;font-size:12px">${escHtml(c.id)}</code></td>
      <td><strong>${escHtml(c.name)}</strong></td>
      <td style="font-size:22px">${c.icon || '—'}</td>
      <td><span class="color-dot" style="background:${c.color || '#888'}"></span>${escHtml(c.color || '—')}</td>
      <td><span class="badge badge-blue">${(c.topics || []).length} ta</span></td>
      <td>
        ${c.published ? '<span class="badge badge-green">Published</span>' : '<span class="badge badge-yellow">Unpublished</span>'}
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-pub" onclick="toggleCoursePublish('${c.id}', ${!c.published})">
            ${c.published ? '👁️ Yashirish' : '🚀 Publish'}
          </button>
          <button class="btn-edit" onclick="openCourseModal('${c.id}')">✏️ Tahrirlash</button>
          <button class="btn-del" onclick="deleteCourse('${c.id}', '${escHtml(c.name)}')">🗑️ O'chirish</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function toggleCoursePublish(courseId, newStatus) {
  const res = await apiFetch(`/api/courses/${courseId}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ published: newStatus })
  });
  if (res && res.ok) {
    toast(newStatus ? 'Kurs chop etildi (Published)!' : 'Kurs yashirildi (Unpublished)!', 'success');
    await loadCourses();
    loadStats();
  } else {
    toast('Holatni o\'zgartirishda xatolik', 'error');
  }
}

// ────────────────────────────────────────────
// LESSONS TABLE
// ────────────────────────────────────────────
function filterLessons() { renderLessonsTable(); }

function renderLessonsTable() {
  const filter = document.getElementById('lessonCourseFilter').value;
  const tbody = document.getElementById('lessonsTableBody');
  if (!tbody) return;
  let rows = [];
  let idx = 1;

  const coursesToShow = filter ? ALL_COURSES.filter(c => c.id === filter) : ALL_COURSES;

  coursesToShow.forEach(course => {
    (course.topics || []).forEach(topic => {
      rows.push({ course, topic, idx: idx++ });
    });
  });

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Dars mavjud emas</td></tr>';
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
        ${topic.published ? '<span class="badge badge-green">Published</span>' : '<span class="badge badge-yellow">Unpublished</span>'}
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-pub" onclick="toggleLessonPublish(${topic.id}, ${!topic.published})">
            ${topic.published ? '👁️ Yashirish' : '🚀 Publish'}
          </button>
          <button class="btn-edit" onclick="openLessonModal('${course.id}', ${topic.id})">✏️ Tahrirlash</button>
          <button class="btn-del" onclick="deleteLesson(${topic.id}, '${escHtml(topic.title)}')">🗑️ O'chirish</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function toggleLessonPublish(topicId, newStatus) {
  const res = await apiFetch(`/api/topics/${topicId}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ published: newStatus })
  });
  if (res && res.ok) {
    toast(newStatus ? 'Dars chop etildi!' : 'Dars yashirildi!', 'success');
    await loadCourses();
    loadStats();
  } else {
    toast('Holatni o\'zgartirishda xatolik', 'error');
  }
}

function populateCourseSelects() {
  const filter = document.getElementById('lessonCourseFilter');
  const sel = document.getElementById('lessonCourseId');
  if (!filter || !sel) return;
  const opts = ALL_COURSES.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');

  const curFilter = filter.value;
  filter.innerHTML = '<option value="">Barcha kurslar</option>' + opts;
  filter.value = curFilter;
  sel.innerHTML = '<option value="">— tanlang —</option>' + opts;
}

// ────────────────────────────────────────────
// TEST QUESTIONS TABLE & CRUD
// ────────────────────────────────────────────
function filterTestQuestions() {
  renderTestsTable();
}

function renderTestsTable() {
  const sbjFilter = document.getElementById('testSubjectFilter')?.value || '';
  const diffFilter = document.getElementById('testDiffFilter')?.value || '';
  const tbody = document.getElementById('testsTableBody');
  if (!tbody) return;

  const filtered = ALL_TEST_QUESTIONS.filter(q => {
    if (sbjFilter && q.subject !== sbjFilter) return false;
    if (diffFilter && q.difficulty !== diffFilter) return false;
    return true;
  });

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="loading">Savollar topilmadi</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.slice(0, 150).map(q => {
    const opts = q.options || [];
    const correctOpt = opts[q.correct_index] !== undefined ? opts[q.correct_index] : '—';
    const diffBadge = q.difficulty === 'beginner' ? 'badge-green' : q.difficulty === 'intermediate' ? 'badge-blue' : 'badge-yellow';

    return `
      <tr>
        <td style="font-size:12px;color:var(--text-muted)">${q.id}</td>
        <td><strong>${escHtml(q.subject)}</strong></td>
        <td><span class="badge ${diffBadge}">${escHtml(q.difficulty)}</span></td>
        <td style="max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(q.question)}">
          ${escHtml(q.question)}
        </td>
        <td style="font-size:12px;color:var(--text-muted)">${opts.length} ta variant</td>
        <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(correctOpt)}">
          <span style="color:#86efac">✓ ${escHtml(correctOpt)}</span>
        </td>
        <td>
          ${q.published ? '<span class="badge badge-green">Published</span>' : '<span class="badge badge-yellow">Unpublished</span>'}
        </td>
        <td>
          <div class="action-btns">
            <button class="btn-pub" onclick="toggleTestQuestionPublish(${q.id}, ${!q.published})">
              ${q.published ? '👁️' : '🚀'}
            </button>
            <button class="btn-edit" onclick="openTestQuestionModal(${q.id})">✏️</button>
            <button class="btn-del" onclick="deleteTestQuestion(${q.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function toggleTestQuestionPublish(id, newStatus) {
  const res = await apiFetch(`/api/admin/test-questions/${id}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ published: newStatus })
  });
  if (res && res.ok) {
    toast(newStatus ? 'Savol faollashtirildi!' : 'Savol yashirildi!', 'success');
    await loadTestQuestions();
    loadStats();
  } else {
    toast('Holatni o\'zgartirishda xato!', 'error');
  }
}

function openTestQuestionModal(id = null) {
  EDIT_TQ_ID = id;
  const modal = document.getElementById('testQuestionModal');
  const title = document.getElementById('testQuestionModalTitle');
  const cont = document.getElementById('tqOptionsContainer');
  cont.innerHTML = '';

  if (id) {
    const q = ALL_TEST_QUESTIONS.find(x => x.id === id);
    if (!q) return;
    title.textContent = 'Test Savolini tahrirlash';
    document.getElementById('tqSubject').value = q.subject;
    document.getElementById('tqDifficulty').value = q.difficulty;
    document.getElementById('tqPublished').checked = !!q.published;
    document.getElementById('tqQuestion').value = q.question || '';
    document.getElementById('tqExplanation').value = q.explanation || '';

    const opts = q.options && q.options.length ? q.options : ['', '', '', ''];
    opts.forEach((opt, idx) => {
      addTqOptionRow(opt, idx === q.correct_index);
    });
  } else {
    title.textContent = 'Yangi Test Savoli';
    document.getElementById('tqQuestion').value = '';
    document.getElementById('tqExplanation').value = '';
    document.getElementById('tqPublished').checked = true;
    for (let i = 0; i < 4; i++) {
      addTqOptionRow('', i === 0);
    }
  }

  modal.classList.add('show');
}

function closeTestQuestionModal() {
  document.getElementById('testQuestionModal').classList.remove('show');
  EDIT_TQ_ID = null;
}

function addTqOptionRow(val = '', checked = false) {
  const cont = document.getElementById('tqOptionsContainer');
  const count = cont.querySelectorAll('.quiz-option-row').length;
  const row = document.createElement('div');
  row.className = 'quiz-option-row';
  row.innerHTML = `
    <input type="radio" name="tqAnswer" value="${count}" ${checked ? 'checked' : ''}>
    <span class="opt-label">Variant ${String.fromCharCode(65 + count)}:</span>
    <input type="text" class="opt-input" placeholder="Variant matni..." value="${escHtml(val)}">
    <button class="btn-del btn-sm" style="padding:4px 8px;font-size:11px" onclick="this.closest('.quiz-option-row').remove()">✕</button>
  `;
  cont.appendChild(row);
}

async function saveTestQuestion() {
  const subject = document.getElementById('tqSubject').value;
  const difficulty = document.getElementById('tqDifficulty').value;
  const question = document.getElementById('tqQuestion').value.trim();
  const explanation = document.getElementById('tqExplanation').value.trim();
  const published = document.getElementById('tqPublished').checked ? 1 : 0;

  if (!question) return toast('Savol matnini kiriting!', 'error');

  const rows = document.querySelectorAll('#tqOptionsContainer .quiz-option-row');
  const options = [];
  let correct_index = 0;

  rows.forEach((r, idx) => {
    const inp = r.querySelector('.opt-input');
    options.push(inp ? inp.value.trim() : '');
    const radio = r.querySelector('input[type=radio]');
    if (radio && radio.checked) correct_index = idx;
  });

  if (options.length < 2) return toast('Kamida 2 ta variant kiriting!', 'error');

  const body = { subject, difficulty, question, options, correct_index, explanation, published };
  const btn = document.getElementById('saveTqBtn');
  btn.textContent = 'Saqlanmoqda...'; btn.disabled = true;

  let res;
  if (EDIT_TQ_ID) {
    res = await apiFetch(`/api/admin/test-questions/${EDIT_TQ_ID}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  } else {
    res = await apiFetch('/api/admin/test-questions', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  btn.textContent = 'Saqlash'; btn.disabled = false;

  if (res && res.ok) {
    toast(EDIT_TQ_ID ? 'Savol yangilandi!' : 'Savol qo\'shildi!', 'success');
    closeTestQuestionModal();
    await loadTestQuestions();
    loadStats();
  } else {
    const err = res ? await res.json() : {};
    toast('Xatolik: ' + (err.error || 'Noma\'lum'), 'error');
  }
}

async function deleteTestQuestion(id) {
  if (!confirm('Ushbu test savolini o\'chirasizmi?')) return;
  const res = await apiFetch(`/api/admin/test-questions/${id}`, { method: 'DELETE' });
  if (res && res.ok) {
    toast('Savol o\'chirildi', 'success');
    await loadTestQuestions();
    loadStats();
  } else {
    toast('O\'chirishda xatolik', 'error');
  }
}

// ────────────────────────────────────────────
// PASSWORD CHANGE
// ────────────────────────────────────────────
async function changeAdminPassword() {
  const oldPassword = document.getElementById('oldPasswordInput').value;
  const newPassword = document.getElementById('newPasswordInput').value;
  const confirmPassword = document.getElementById('confirmPasswordInput').value;

  if (!oldPassword || !newPassword) {
    return toast('Barcha maydonlarni to\'ldiring!', 'error');
  }
  if (newPassword !== confirmPassword) {
    return toast('Yangi parollar mos kelmadi!', 'error');
  }
  if (newPassword.length < 6) {
    return toast('Parol kamida 6 ta belgidan iborat bo\'lsin!', 'error');
  }

  const btn = document.getElementById('changePasswordBtn');
  btn.textContent = 'Yangilanmoqda...'; btn.disabled = true;

  const res = await apiFetch('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword })
  });

  btn.textContent = 'Parolni yangilash'; btn.disabled = false;

  if (res && res.ok) {
    toast('Parol muvaffaqiyatli o\'zgartirildi!', 'success');
    document.getElementById('oldPasswordInput').value = '';
    document.getElementById('newPasswordInput').value = '';
    document.getElementById('confirmPasswordInput').value = '';
  } else {
    const data = res ? await res.json() : {};
    toast(data.error || 'Parolni o\'zgartirish muvaffaqiyatsiz', 'error');
  }
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
    document.getElementById('coursePublished').checked = !!c.published;
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
    document.getElementById('coursePublished').checked = true;
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
  const published = document.getElementById('coursePublished').checked ? 1 : 0;

  if (!name) return toast('Kurs nomini kiriting!', 'error');
  if (!EDIT_COURSE_ID && !id) return toast('Kurs ID kiriting!', 'error');

  const body = { id: EDIT_COURSE_ID || id, name, icon, color, tagline, description, published };
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
    loadStats();
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
    loadStats();
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
    document.getElementById('lessonPublished').checked = topic.published !== false;

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
    document.getElementById('lessonPublished').checked = true;
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
  const published = document.getElementById('lessonPublished').checked ? 1 : 0;

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
  const quiz = questions.length ? { passingScore: quizPassingScore, questions } : null;

  const body = { course_id: courseId, title, duration, xp, content, quiz, published };
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
    loadStats();
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
    loadStats();
  } else {
    toast('O\'chirishda xato!', 'error');
  }
}

// ────────────────────────────────────────────
// QUIZ EDITOR (INSIDE LESSON)
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
loadInitialData();
