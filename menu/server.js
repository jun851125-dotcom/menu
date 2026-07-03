const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
// Serve from the parent directory so that w1, w2, etc. are accessible
const PUBLIC_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.ts': 'text/typescript; charset=utf-8',
  '.tsx': 'text/typescript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  // Decode URL to handle Chinese characters and spaces in filenames
  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(req.url);
  } catch (e) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  // Strip query string and hashes
  const urlPath = decodedUrl.split('?')[0].split('#')[0];

  // Redirect root to /menu/index.html
  if (urlPath === '/' || urlPath === '/index.html') {
    res.writeHead(302, { Location: '/menu/index.html' });
    res.end();
    return;
  }

  // Resolve file path
  let filePath = path.join(PUBLIC_DIR, urlPath);

  // Security check: ensure the resolved path is inside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  // If path is a directory, look for index.html inside it
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.end(`File not found: ${urlPath}`);
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error reading file: ${err.code}`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/menu/index.html`;
  console.log(`==================================================`);
  console.log(`🚀 Showcase Server is running at:`);
  console.log(`   👉 ${url}`);
  console.log(`==================================================`);

  // Open in default browser
  const startCommand = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${startCommand} ${url}`, (err) => {
    if (err) {
      console.log(`Failed to open browser automatically: ${err.message}`);
    } else {
      console.log(`Browser opened successfully.`);
    }
  });
});
