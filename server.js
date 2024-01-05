const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Konfigurasi URI MongoDB
const MongoDBURI = process.env.MONGO_URI || 'mongodb://localhost/ManualAuth';

// Menghubungkan ke MongoDB menggunakan Mongoose
mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Mengecek koneksi MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});

// Menggunakan sesi untuk menyimpan data pengguna
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db // Menyimpan sesi dalam database MongoDB
  })
}));

// Pengaturan template EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware untuk meng-handle body dari request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Menyajikan file statis dari folder 'views'
app.use(express.static(__dirname + '/views'));

// Menggunakan route dari file index.js
const index = require('./routes/index');
app.use('/', index);

// Menangkap 404 dan meneruskannya ke middleware error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Express app listening on port 3000');
});