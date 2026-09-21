const fs = require('fs');
const path = require('path');

function updateFile(relPath) {
  const filePath = path.resolve(__dirname, relPath);
  let s = fs.readFileSync(filePath, 'utf8');

  const oldStrCRLF = 'class="nav-label">Sozlamalar</span></a>\r\n      </nav>';
  const oldStrLF = 'class="nav-label">Sozlamalar</span></a>\n      </nav>';

  const replacementCRLF = 'class="nav-label">Sozlamalar</span></a>\r\n        <a href="/admin/" class="nav-item" id="adminPanelLink" style="display:none;color:#60a5fa;border:1px dashed rgba(96,165,250,0.3);margin-top:6px"><span class="nav-icon" aria-hidden="true">🛡️</span><span class="nav-label">Admin Panel</span></a>\r\n      </nav>';
  const replacementLF = 'class="nav-label">Sozlamalar</span></a>\n        <a href="/admin/" class="nav-item" id="adminPanelLink" style="display:none;color:#60a5fa;border:1px dashed rgba(96,165,250,0.3);margin-top:6px"><span class="nav-icon" aria-hidden="true">🛡️</span><span class="nav-label">Admin Panel</span></a>\n      </nav>';

  if (s.includes('id="adminPanelLink"')) {
    console.log(`ℹ️ Already has adminPanelLink: ${relPath}`);
    return;
  }

  if (s.includes(oldStrCRLF)) {
    s = s.replace(oldStrCRLF, replacementCRLF);
    fs.writeFileSync(filePath, s, 'utf8');
    console.log(`✅ Updated CRLF: ${relPath}`);
  } else if (s.includes(oldStrLF)) {
    s = s.replace(oldStrLF, replacementLF);
    fs.writeFileSync(filePath, s, 'utf8');
    console.log(`✅ Updated LF: ${relPath}`);
  } else {
    console.error(`❌ target not found in ${relPath}`);
  }
}

updateFile('../index.html');
updateFile('../dist/index.html');
