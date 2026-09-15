const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, '../style.css');
let styleContent = fs.readFileSync(stylePath, 'utf8');

const certCss = `

/* ====================== CERTIFICATE STYLING ====================== */
.cert-page-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 960px;
  margin: 0 auto;
  padding: 8px;
}

.cert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.cert-header-left h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--text);
}

.cert-header-left p {
  color: var(--muted);
  font-size: 14px;
}

.cert-header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.cert-card-wrapper {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow);
}

.cert-card-border {
  border: 4px double var(--primary);
  border-radius: var(--radius);
  padding: 24px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(56, 189, 248, 0.05));
  position: relative;
}

.cert-card-inner {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
}

.cert-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cert-badge-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
}

.cert-id-tag {
  font-family: monospace;
  font-size: 13px;
  color: var(--muted);
  background: var(--bg);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid var(--border);
}

.cert-main-title h2 {
  font-size: 32px;
  letter-spacing: 4px;
  color: var(--primary);
  margin-bottom: 4px;
}

.cert-subtitle {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--muted);
  font-weight: 600;
}

.cert-given-to {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 8px;
}

.cert-student-name {
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 12px;
  text-decoration: underline;
  text-decoration-color: var(--primary);
  text-underline-offset: 8px;
}

.cert-achievement-text {
  max-width: 680px;
  margin: 0 auto;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
}

.cert-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  background: var(--bg);
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.cert-meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.cert-meta-lbl {
  color: var(--muted);
}

.cert-meta-val {
  color: var(--text);
}

.cert-status-ok {
  color: var(--success);
}

.cert-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
}

.cert-qr-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--muted);
}

.cert-qr-svg {
  width: 60px;
  height: 60px;
  border-radius: 6px;
}

.cert-signature-box {
  text-align: right;
  font-size: 13px;
}

.cert-sig-line {
  font-weight: 700;
  color: var(--text);
  border-bottom: 1px solid var(--text);
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.cert-sig-title {
  color: var(--muted);
  font-size: 12px;
}

@media print {
  body * {
    visibility: hidden;
  }
  #certPrintArea, #certPrintArea * {
    visibility: visible;
  }
  #certPrintArea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
`;

if (!styleContent.includes('.cert-page-container')) {
  styleContent += certCss;
  fs.writeFileSync(stylePath, styleContent, 'utf8');
  console.log('✅ Added Certificate styles to style.css');
}

if (fs.existsSync(path.join(__dirname, '../test/style.css'))) {
  fs.copyFileSync(stylePath, path.join(__dirname, '../test/style.css'));
  console.log('✅ Synced style.css to test/style.css');
}
