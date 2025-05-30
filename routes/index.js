const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'JzTools - Powerful Web Tools in One Place' });
});

router.get('/downloader', (req, res) => {
  res.render('downloader', { title: 'JzTools - Downloader' });
});

router.get('/searcher', (req, res) => {
  res.render('searcher', { title: 'JzTools - Searcher' });
});

router.get('/cloud', (req, res) => {
  res.render('cloud', { title: 'JzTools - Cloud Storage' });
});

// Placeholder untuk form downloader
router.post('/download', (req, res) => {
  // Logika pengunduhan akan ditambahkan di sini
  res.send('Fitur pengunduhan belum diimplementasikan.');
});

// Placeholder untuk form searcher
router.get('/search', (req, res) => {
  // Logika pencarian akan ditambahkan di sini
  res.send('Fitur pencarian belum diimplementasikan.');
});

module.exports = router;