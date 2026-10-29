// Works from the repository root or the legacy Python backend folder.
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');
const backend = path.resolve(__dirname, '../ingenuityx-backend');
const url = 'http://127.0.0.1:1337/admin/student-dashboard';
let checked = false;
function start(alreadyRunning) {
  if (checked) return;
  checked = true;
  if (alreadyRunning) {
    console.log('Strapi is already running. You do not need another server.');
    console.log('Open in Chrome or Edge: ' + url);
    return;
  }
  console.log('Starting Strapi from ' + backend);
  console.log('Once startup completes, open: ' + url);
  if (!process.env.npm_execpath) {
    console.error('Run this shortcut using npm run develop.');
    process.exitCode = 1;
    return;
  }
  const child = spawn(process.execPath, [process.env.npm_execpath, 'run', 'develop'], { cwd: backend, stdio: 'inherit', windowsHide: true });
  child.on('error', error => { console.error('Could not start Strapi: ' + error.message); process.exitCode = 1; });
  child.on('exit', code => { process.exitCode = code || 0; });
}
const request = http.get('http://127.0.0.1:1337/_health', { timeout: 2000 }, response => {
  response.resume();
  start(response.statusCode === 204 && Boolean(response.headers.strapi));
});
request.on('timeout', () => request.destroy());
request.on('error', () => start(false));
