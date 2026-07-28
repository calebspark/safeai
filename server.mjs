// SafeAI · local dev server
// Serves the portal and runs the live /api/assess endpoint against Claude.
// Loads ANTHROPIC_API_KEY from the environment, or from a fallback .env file
// (Bento Box's, by default) so you can run it without exporting the key by hand.
//
//   node server.mjs                 # http://localhost:8791
//   PORT=3000 node server.mjs
//
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8791;
const FALLBACK_ENV = process.env.SAFEAI_ENV_FILE || '/Users/caleb/event-editor/.env';

// --- load key if not already in env ---
if (!process.env.ANTHROPIC_API_KEY && fs.existsSync(FALLBACK_ENV)) {
  for (const line of fs.readFileSync(FALLBACK_ENV, 'utf8').split('\n')) {
    const m = line.match(/^\s*ANTHROPIC_API_KEY\s*=\s*(.+?)\s*$/);
    if (m) { process.env.ANTHROPIC_API_KEY = m[1].replace(/^['"]|['"]$/g, ''); break; }
  }
}
if (process.env.ANTHROPIC_API_KEY) {
  console.log('ANTHROPIC_API_KEY loaded (%d chars).', process.env.ANTHROPIC_API_KEY.length);
} else {
  console.warn('WARNING: no ANTHROPIC_API_KEY found. /api/assess will return an error.');
}

const { assess } = await import('./api/_engine.mjs');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json' };

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); } });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/assess') {
    if (req.method !== 'POST') { res.writeHead(405); return res.end('Method not allowed'); }
    const body = await readBody(req);
    const result = await assess(body.profile || {});
    res.writeHead(result.ok ? 200 : (result.status || 500), { 'content-type': 'application/json' });
    return res.end(JSON.stringify(result.ok ? result.data : { error: result.reason, detail: result.detail }));
  }

  if (url.pathname === '/api/classify') {
    if (req.method !== 'POST') { res.writeHead(405); return res.end('Method not allowed'); }
    const body = await readBody(req);
    const { classify, rateLimited, clientIp, publicError } = await import('./api/classify.mjs');
    const ip = clientIp(req);
    if (rateLimited(ip)) {
      res.writeHead(429, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(publicError('rate_limited')));
    }
    const result = await classify(body);
    if (!result.ok) console.error('classify failed:', result.reason, result.detail);
    res.writeHead(result.ok ? 200 : (result.status || 500), { 'content-type': 'application/json' });
    return res.end(JSON.stringify(result.ok ? result.data : publicError(result.reason)));
  }

  // static
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/risk-assessment.html';
  const file = path.join(__dirname, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(__dirname) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found');
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => console.log(`SafeAI risk assessment running at http://localhost:${PORT}`));
