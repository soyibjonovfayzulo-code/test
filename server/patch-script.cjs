const fs = require('fs');
const path = require('path');

const scriptFile = path.resolve(__dirname, '../script.js');
let s = fs.readFileSync(scriptFile, 'utf8');

// 1. Kurslarni backenddan sinxronlash
const target1 = "raw: COURSES\r\n    };\r\n  })();";
const target1Unix = "raw: COURSES\n    };\n  })();";

const replace1 = `raw: COURSES,
      loadFromBackend: async function() {
        try {
          const res = await fetch('/api/courses');
          if (!res.ok) return false;
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            COURSES = data;
            window.CoursesAPI.raw = COURSES;
            window.CoursesAPI.refresh();
            if (typeof renderCoursesPage === 'function') { try { renderCoursesPage(); } catch (_) {} }
            return true;
          }
        } catch (_) {}
        return false;
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() { window.CoursesAPI.loadFromBackend(); }, 80);
      });
    }
  })();`;

if (s.includes(target1)) {
  s = s.replace(target1, replace1);
  console.log('✅ Injected CoursesAPI.loadFromBackend (CRLF)');
} else if (s.includes(target1Unix)) {
  s = s.replace(target1Unix, replace1);
  console.log('✅ Injected CoursesAPI.loadFromBackend (LF)');
} else {
  console.error('❌ target1 not found in script.js');
}

// 2. Test savollarini backenddan yuklash
const target2 = `  loadQuestionBank();`;
const replace2 = `  async function loadQuestionBankFromBackend() {
    try {
      const res = await fetch('/api/tests/questions');
      if (!res.ok) return;
      const questions = await res.json();
      if (!Array.isArray(questions) || !questions.length) return;

      for (const item of questions) {
        const sbj = item.subject;
        const diff = item.difficulty || 'beginner';
        if (!Q_BANK[sbj]) {
          Q_BANK[sbj] = { beginner: [], intermediate: [], advanced: [] };
        }
        if (!Q_BANK[sbj][diff]) Q_BANK[sbj][diff] = [];
        
        // Dublikat bo'lmasa qo'shamiz
        const exists = Q_BANK[sbj][diff].some(x => (x.q || x.question) === (item.q || item.question));
        if (!exists) {
          Q_BANK[sbj][diff].push({
            q: item.q || item.question,
            o: item.o || item.options,
            c: item.c !== undefined ? item.c : item.answer,
            e: item.e || item.explanation
          });
        }
      }

      if (typeof rebuildAllTests === 'function' && typeof ALL_TESTS !== 'undefined') {
        const rebuilt = rebuildAllTests();
        for (const k of Object.keys(rebuilt)) ALL_TESTS[k] = rebuilt[k];
        console.log('ALL_TESTS rebuilt after backend test questions sync.');
      }
    } catch (_) {}
  }

  loadQuestionBank();
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(loadQuestionBankFromBackend, 120);
    });
  }`;

if (s.includes(target2)) {
  s = s.replace(target2, replace2);
  console.log('✅ Injected loadQuestionBankFromBackend');
} else {
  console.error('❌ target2 not found in script.js');
}

fs.writeFileSync(scriptFile, s, 'utf8');
console.log('script.js updated successfully.');
