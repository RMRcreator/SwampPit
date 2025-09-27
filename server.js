const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve each folder under a unique URL path (so paths are unambiguous)
app.use('/logo1', express.static(path.join(__dirname, 'logo1')));
app.use('/logo2', express.static(path.join(__dirname, 'logo2')));

// Home page: show both logos + the app name
app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>SwampPit</title>
      </head>
      <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding:24px;">
        <header style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <img src="/logo1/logo.svg" alt="SwampPit logo 1" style="height:56px;width:auto;border-radius:8px;">
          <img src="/logo2/logo.svg" alt="SwampPit logo 2" style="height:56px;width:auto;border-radius:8px;">
          <strong style="font-size:28px;">SwampPit</strong>
        </header>
        <p style="margin-top:12px;color:#444;">Find friends who match your vibe.</p>
      </body>
    </html>
  `);
});

// Optional debug routes to verify files exist and are readable
app.get('/debug-list1', (req, res) => {
  fs.readdir(path.join(__dirname, 'logo1'), (err, files) =>
    res.send(err ? 'logo1 error: ' + err.message : '<pre>' + files.join('\n') + '</pre>')
  );
});
app.get('/debug-list2', (req, res) => {
  fs.readdir(path.join(__dirname, 'logo2'), (err, files) =>
    res.send(err ? 'logo2 error: ' + err.message : '<pre>' + files.join('\n') + '</pre>')
  );
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
