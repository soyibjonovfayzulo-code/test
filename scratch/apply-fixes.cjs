const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '../script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

console.log('Original script.js size:', scriptContent.length);

// 1. Fix loadQuestionBank & ALL_TESTS
const oldLoadBankRegex = /async function loadQuestionBank\(\) \{[\s\S]*?loadQuestionBank\(\);/;

const newLoadBank = `let ALL_TESTS = {};

async function loadQuestionBank() {
  try {
    const subjects = ['python', 'javascript', 'java', 'cpp', 'csharp', 'html', 'css', 'sql', 'ai'];

    for (const subject of subjects) {
      try {
        let response = null;
        const candidatePaths = [
          \`./data/\${subject}.json\`,
          \`data/\${subject}.json\`,
          \`/data/\${subject}.json\`,
          \`./public/data/\${subject}.json\`,
          \`public/data/\${subject}.json\`
        ];
        for (const p of candidatePaths) {
          try {
            const res = await fetch(p);
            if (res && res.ok) { response = res; break; }
          } catch (_) {}
        }
        if (!response) continue;

        const data = await response.json();

        const keyMap = {
          'python': 'Python',
          'javascript': 'JavaScript',
          'java': 'Java',
          'cpp': 'C++',
          'csharp': 'C#',
          'html': 'HTML',
          'css': 'CSS',
          'sql': 'SQL',
          'ai': 'AI'
        };

        const key = keyMap[subject];
        if (key && data) {
          const merged = {
            beginner: data.beginner || [],
            intermediate: data.intermediate || [],
            advanced: data.advanced || []
          };
          const current = Q_BANK[key] || { beginner: [], intermediate: [], advanced: [] };
          const seen = new Set();
          const mergeLevel = (fallbackArr, jsonArr) => {
            const out = [];
            for (const q of [...(jsonArr || []), ...(fallbackArr || [])]) {
              const k = normalizeQuestionText(q && q.q);
              if (!k || seen.has(k)) continue;
              seen.add(k);
              out.push(q);
            }
            return out;
          };
          Q_BANK[key] = {
            beginner: mergeLevel(current.beginner, merged.beginner),
            intermediate: mergeLevel(current.intermediate, merged.intermediate),
            advanced: mergeLevel(current.advanced, merged.advanced)
          };
          if (key === 'C++') Q_BANK['CPlusPlus'] = Q_BANK['C++'];
          if (key === 'C#') Q_BANK['CSharp'] = Q_BANK['C#'];
        }
      } catch (e) {
        console.debug(\`Failed to load \${subject}.json (using fallback):\`, e.message);
      }
    }

    Q_BANK['C++'] = Q_BANK['C++'] || Q_BANK['CPlusPlus'] || { beginner: [], intermediate: [], advanced: [] };
    Q_BANK['C#'] = Q_BANK['C#'] || Q_BANK['CSharp'] || { beginner: [], intermediate: [], advanced: [] };
    Q_BANK['CPlusPlus'] = Q_BANK['CPlusPlus'] || Q_BANK['C++'];
    Q_BANK['CSharp'] = Q_BANK['CSharp'] || Q_BANK['C#'];

    console.log('Question bank loaded:', Object.keys(Q_BANK));

    const rebuilt = rebuildAllTests();
    for (const k of Object.keys(rebuilt)) ALL_TESTS[k] = rebuilt[k];
    console.log('ALL_TESTS rebuilt after JSON load.');
  } catch (error) {
    console.error('Error loading question bank:', error);
  }
}

loadQuestionBank();`;

if (oldLoadBankRegex.test(scriptContent)) {
  scriptContent = scriptContent.replace(oldLoadBankRegex, newLoadBank);
  console.log('✅ loadQuestionBank & ALL_TESTS replaced successfully.');
} else {
  console.error('❌ Could not match old loadQuestionBank regex');
}

// Replace bottom const ALL_TESTS = {}; Object.assign(ALL_TESTS, rebuildAllTests()); to avoid duplication
scriptContent = scriptContent.replace(
  /const ALL_TESTS = \{\};\s*Object\.assign\(ALL_TESTS, rebuildAllTests\(\)\);/g,
  'Object.assign(ALL_TESTS, rebuildAllTests());'
);

// 2. Fix renderQuestion nextBtn disabled bug & clear timeout on navigation
scriptContent = scriptContent.replace(
  '  $("#nextBtn").disabled = hasAnswer;',
  '  $("#nextBtn").disabled = false;'
);

scriptContent = scriptContent.replace(
  '    btn.addEventListener("click", () => { quiz.currentIndex = i; renderQuestion(); renderProgress(); });',
  '    btn.addEventListener("click", () => { if (quiz.autoNavTimeout) { clearTimeout(quiz.autoNavTimeout); quiz.autoNavTimeout = null; } quiz.currentIndex = i; renderQuestion(); renderProgress(); });'
);

// 3. Fix showApp state sync
const oldShowApp = `function showApp() {
  if (!currentUser) {
    console.warn("⚠️ showApp called without currentUser - redirecting to auth");
    showAuthScreen();
    return;
  }
  $("#authScreen").classList.add("hidden");
  $("#app").classList.remove("hidden");
  refreshUserChip();
  showPage("dashboard");
  if (window.ITOnboarding) {
    try { window.ITOnboarding.maybeStart(currentUser); }
    catch (e) { console.warn("Onboarding start xatosi:", e); }
  }
}`;

const newShowApp = `function showApp() {
  if (!currentUser) {
    console.warn("⚠️ showApp called without currentUser - redirecting to auth");
    showAuthScreen();
    return;
  }
  ensureUserTestProgress(currentUser);
  refreshUserChip();
  refreshUserMenu();
  if (window.Lessons && typeof window.Lessons.init === 'function') {
    try { window.Lessons.init(); } catch (_) {}
  }
  $("#authScreen").classList.add("hidden");
  $("#app").classList.remove("hidden");
  showPage("dashboard");
  if (window.ITOnboarding) {
    try { window.ITOnboarding.maybeStart(currentUser); }
    catch (e) { console.warn("Onboarding start xatosi:", e); }
  }
}`;

scriptContent = scriptContent.replace(oldShowApp, newShowApp);

// 4. Add Certificate page logic & showPage handling
if (!scriptContent.includes('function renderCertificatePage()')) {
  const certLogic = `
/* ====================== CERTIFICATE PAGE ====================== */
function renderCertificatePage() {
  const u = currentUser;
  const studentNameEl = $("#certStudentName");
  const courseTitleEl = $("#certCourseTitle");
  const certDateEl = $("#certDate");
  const certScoreEl = $("#certScore");
  const certXpEl = $("#certXp");
  const certIdEl = $("#certId");

  const fullName = u ? (u.certName || \`\${u.firstname || ''} \${u.lastname || ''}\`.trim() || u.username) : "Foydalanuvchi Ismi";
  if (studentNameEl) studentNameEl.textContent = fullName;

  // Find best test or completed course
  const results = u?.testResults || [];
  const bestScore = results.length ? Math.max(...results.map(r => r.percent || 0)) : 100;
  if (certScoreEl) certScoreEl.textContent = \`\${bestScore}% (\${bestScore >= 90 ? 'A+' : bestScore >= 80 ? 'A' : 'B'})\`;
  if (certXpEl) certXpEl.textContent = \`+\${u?.xp || 350} XP\`;

  if (certDateEl) {
    const d = new Date(u?.joinedAt || Date.now());
    certDateEl.textContent = \`\${String(d.getDate()).padStart(2, '0')}.\${String(d.getMonth() + 1).padStart(2, '0')}.\${d.getFullYear()}\`;
  }

  if (certIdEl) {
    const seed = (u?.id || "u123").replace(/\\D/g, '').slice(0, 6) || "202688";
    certIdEl.textContent = \`ITT-2026-\${seed.padStart(4, '0')}\`;
  }
}

function bindCertificateActions() {
  const editBtn = $("#certEditNameBtn");
  const editModal = $("#certEditNameModal");
  const saveBtn = $("#certSaveNameBtn");
  const nameInput = $("#certFullNameInput");
  const downloadBtn = $("#certDownloadBtn");
  const shareBtn = $("#certShareBtn");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      if (nameInput) {
        nameInput.value = currentUser ? (currentUser.certName || \`\${currentUser.firstname || ''} \${currentUser.lastname || ''}\`.trim()) : "";
      }
      openModal("#certEditNameModal");
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const val = nameInput ? nameInput.value.trim() : "";
      if (!val) return showToast("Iltimos, ism va familiyangizni kiriting", "warning");
      if (currentUser) {
        currentUser.certName = val;
        saveUsersAndCurrent();
      }
      closeModal("#certEditNameModal");
      renderCertificatePage();
      showToast("Sertifikatdagi ism saqlandi! 🎉", "success");
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      showToast("📜 Sertifikat bosmaga tayyorlanmoqda...", "info");
      setTimeout(() => { window.print(); }, 400);
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const certId = $("#certId")?.textContent || "ITT-2026";
      const shareData = {
        title: 'ITTest Sertifikati',
        text: \`Men ITTest platformasida IT & AI sertifikatini qo'lga kiritdim! ID: \${certId}\`,
        url: window.location.href
      };
      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        try {
          navigator.clipboard.writeText(shareData.text);
          showToast("🔗 Sertifikat havolasi nusxalandi!", "success");
        } catch (_) {
          showToast("Sertifikat ID: " + certId, "info");
        }
      }
    });
  }
}
`;

  scriptContent += certLogic;
}

// Update showPage to include certificate
scriptContent = scriptContent.replace(
  'else if (name === "projects") { if (typeof renderProjectsPage === "function") renderProjectsPage(); }',
  'else if (name === "projects") { if (typeof renderProjectsPage === "function") renderProjectsPage(); }\n  else if (name === "certificate") renderCertificatePage();'
);

// Update init/bind setup to call bindCertificateActions
scriptContent = scriptContent.replace(
  'bindNav();',
  'bindNav(); bindCertificateActions();'
);

fs.writeFileSync(scriptPath, scriptContent, 'utf8');
console.log('✅ script.js updated successfully. New size:', scriptContent.length);
