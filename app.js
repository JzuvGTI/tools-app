const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();

// Konfigurasi view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk mem-parsing form data dan JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Layani file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan rute
app.use('/', indexRouter);

// Error handling middleware untuk debugging
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).send('Terjadi kesalahan di server!');
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});