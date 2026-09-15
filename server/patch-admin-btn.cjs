const fs = require('fs');
const path = require('path');

const scriptFile = path.resolve(__dirname, '../script.js');
let s = fs.readFileSync(scriptFile, 'utf8');

if (s.includes('checkAdminStatus()')) {
  console.log('ℹ️ Admin status check already in script.js');
  process.exit(0);
}

const snippet = `
  // Admin button visibility check
  async function checkAdminStatus() {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        const link = document.getElementById('adminPanelLink');
        if (link) link.style.display = 'flex';
      }
    } catch (_) {}
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', checkAdminStatus);
  }
`;

s += snippet;
fs.writeFileSync(scriptFile, s, 'utf8');
console.log('✅ Added admin status check to script.js');
