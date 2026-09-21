// ============================================================
// ecosystem.config.js — PM2 variant (Windows'da pm2-installer bilan)
//
// Ishlatish:
//   npm install -g pm2
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup      (yoki pm2-installer: https://github.com/jessety/pm2-installer)
//
// PM2 o'zi: crash auto-restart + duplicate instance himoyasi (nom bo'yicha)
// ============================================================
module.exports = {
  apps: [{
    name: 'orzutalim-dev-bot',
    cwd: __dirname,
    script: 'src/index.js',
    autorestart: true,
    max_restarts: 200,
    restart_delay: 5000,
    max_memory_restart: '300M',
    env: { NODE_ENV: 'production' },
    out_file: 'logs/pm2-out.log',
    error_file: 'logs/pm2-err.log',
    time: true,
  }],
};
