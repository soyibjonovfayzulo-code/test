const fs = require('fs');
const path = require('path');

const mobileCssPath = path.join(__dirname, '../mobile.css');
let mobileContent = fs.readFileSync(mobileCssPath, 'utf8');

const certMobileCss = `
  /* Certificate Mobile Responsive */
  .cert-header {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
  }
  .cert-header-actions {
    flex-direction: column !important;
    width: 100% !important;
  }
  .cert-header-actions .btn {
    width: 100% !important;
  }
  .cert-card-border {
    padding: 14px !important;
  }
  .cert-top {
    flex-direction: column !important;
    gap: 8px !important;
  }
  .cert-student-name {
    font-size: 22px !important;
  }
  .cert-main-title h2 {
    font-size: 22px !important;
    letter-spacing: 2px !important;
  }
  .cert-footer {
    flex-direction: column !important;
    align-items: center !important;
    gap: 16px !important;
    text-align: center !important;
  }
  .cert-signature-box {
    text-align: center !important;
  }
`;

if (!mobileContent.includes('.cert-student-name')) {
  mobileContent = mobileContent.replace(
    '/* ------------------------------------------------------------\n     12. MODALS & DIALOGS',
    certMobileCss + '\n  /* ------------------------------------------------------------\n     12. MODALS & DIALOGS'
  );
  fs.writeFileSync(mobileCssPath, mobileContent, 'utf8');
  console.log('✅ Added Certificate mobile responsive rules to mobile.css');
}

if (fs.existsSync(path.join(__dirname, '../test/mobile.css'))) {
  fs.copyFileSync(mobileCssPath, path.join(__dirname, '../test/mobile.css'));
  console.log('✅ Synced mobile.css to test/mobile.css');
}
