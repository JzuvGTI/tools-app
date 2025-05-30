// app.js
const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();

// Konfigurasi view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Layani file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan rute
app.use('/', indexRouter);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});