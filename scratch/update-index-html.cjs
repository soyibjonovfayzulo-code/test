const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add Certificate Nav Item if not present
if (!html.includes('data-page="certificate"')) {
  html = html.replace(
    '<a href="#achievements" class="nav-item"',
    '<a href="#certificate" class="nav-item" data-page="certificate"><span class="nav-icon" aria-hidden="true">📜</span><span class="nav-label">Sertifikat</span></a>\n        <a href="#achievements" class="nav-item"'
  );
  console.log('✅ Added Sertifikat to sidebar nav');
}

// 2. Add page-certificate section
if (!html.includes('id="page-certificate"')) {
  const certPageSection = `
        <!-- ====================== CERTIFICATE PAGE ====================== -->
        <section id="page-certificate" class="page">
          <div class="cert-page-container">
            <div class="cert-header">
              <div class="cert-header-left">
                <h3>📜 ITTest Sertifikati</h3>
                <p>O'quv kursi va testlarini muvaffaqiyatli tamomlaganlik haqidagi rasmiy sertifikat.</p>
              </div>
              <div class="cert-header-actions">
                <button type="button" class="btn btn-secondary" id="certEditNameBtn">✍️ Ismni o'zgartirish</button>
                <button type="button" class="btn btn-primary" id="certDownloadBtn">📥 Yuklab olish</button>
                <button type="button" class="btn btn-ghost" id="certShareBtn">🔗 Ulashish</button>
              </div>
            </div>

            <div class="cert-card-wrapper" id="certPrintArea">
              <div class="cert-card-border">
                <div class="cert-card-inner">
                  <div class="cert-top">
                    <div class="cert-badge-brand">
                      <span class="cert-logo-icon">🧠</span>
                      <span class="cert-logo-text">IT<b>Test</b></span>
                    </div>
                    <div class="cert-id-tag">ID: <span id="certId">ITT-2026-8941</span></div>
                  </div>

                  <div class="cert-main-title">
                    <h2>SERTIFIKAT</h2>
                    <p class="cert-subtitle">CERTIFICATE OF COMPLETION</p>
                  </div>

                  <div class="cert-body-text">
                    <p class="cert-given-to">Ushbu sertifikat tantanali ravishda topshiriladi:</p>
                    <h1 class="cert-student-name" id="certStudentName">Foydalanuvchi Ismi</h1>
                    <p class="cert-achievement-text">
                      <span id="certCourseTitle">Full-Stack Web Development & AI Mastery</span> kursining barcha darslari, amaliy topshiriqlari hamda yakuniy testlarini muvaffaqiyatli bajarib, yuqori natijaga erishgani uchun.
                    </p>
                  </div>

                  <div class="cert-meta-grid">
                    <div class="cert-meta-item">
                      <span class="cert-meta-lbl">Berilgan sana:</span>
                      <strong class="cert-meta-val" id="certDate">14.09.2026</strong>
                    </div>
                    <div class="cert-meta-item">
                      <span class="cert-meta-lbl">Natija:</span>
                      <strong class="cert-meta-val" id="certScore">100% (A+)</strong>
                    </div>
                    <div class="cert-meta-item">
                      <span class="cert-meta-lbl">To'plangan XP:</span>
                      <strong class="cert-meta-val" id="certXp">+500 XP</strong>
                    </div>
                    <div class="cert-meta-item">
                      <span class="cert-meta-lbl">Status:</span>
                      <strong class="cert-meta-val cert-status-ok">✅ Tasdiqlangan</strong>
                    </div>
                  </div>

                  <div class="cert-footer">
                    <div class="cert-qr-box">
                      <svg viewBox="0 0 100 100" class="cert-qr-svg">
                        <rect width="100" height="100" fill="#ffffff"/>
                        <path d="M10 10h30v30H10zM15 15v20h20V15zM20 20h10v10H20zM60 10h30v30H60zM65 15v20h20V15zM70 20h10v10H70zM10 60h30v30H10zM15 65v20h20V15zM20 70h10v10H20zM50 50h10v10H50zM70 50h20v10H70zM50 70h10v20H50zM70 70h20v20H70zM60 80h10v10H60z" fill="#0f172a"/>
                      </svg>
                      <span>Tekshirish QR</span>
                    </div>

                    <div class="cert-signature-box">
                      <div class="cert-sig-line">ITTest Platform Directorate</div>
                      <div class="cert-sig-title">Rasmiy O'quv Markazi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
`;
  html = html.replace('</section>\n\n      </div>\n    </main>', certPageSection + '\n        </section>\n\n      </div>\n    </main>');
  console.log('✅ Added page-certificate to index.html');
}

// 3. Add certEditNameModal if not present
if (!html.includes('id="certEditNameModal"')) {
  const certModalHtml = `
  <!-- Certificate Name Edit Modal -->
  <div class="modal-overlay" id="certEditNameModal" role="dialog" aria-modal="true" aria-labelledby="certModalTitle">
    <div class="modal">
      <div class="modal-header">
        <h3 id="certModalTitle">📜 Sertifikatsiyadagi ism</h3>
        <button class="modal-close" data-close aria-label="Yopish" type="button">✕</button>
      </div>
      <div class="modal-body">
        <p class="muted" style="margin-bottom:12px;">Sertifikatingizda ko'rsatiladigan to'liq ism va familiyangizni kiriting:</p>
        <div class="form-group">
          <label for="certFullNameInput">To'liq ism-familiya</label>
          <input type="text" id="certFullNameInput" class="input" placeholder="Ism Familiya (masalan, Sardor Rahimov)" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" data-close type="button">Bekor qilish</button>
        <button class="btn btn-primary" id="certSaveNameBtn" type="button">Saqlash</button>
      </div>
    </div>
  </div>
`;
  html = html.replace('<!-- Start Test Modal -->', certModalHtml + '\n  <!-- Start Test Modal -->');
  console.log('✅ Added certEditNameModal to index.html');
}

fs.writeFileSync(indexPath, html, 'utf8');

// Copy index.html to test/index.html if test/ exists
if (fs.existsSync(path.join(__dirname, '../test/index.html'))) {
  fs.copyFileSync(indexPath, path.join(__dirname, '../test/index.html'));
  console.log('✅ Synced index.html to test/index.html');
}
