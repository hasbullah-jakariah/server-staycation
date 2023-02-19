const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require("connect-flash");
const multer = require('multer');
const fs = require("fs-extra");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const apiRouter = require("./routes/api");
const mongoose = require('mongoose')
// mongoose

// mongoose.connect('mongodb+srv://hasbullah:Hasbullmern@cluster0.xlo5s0c.mongodb.net/staycation_db?retryWrites=true&w=majority');
mongoose.set("strictQuery", true);
mongoose.connect('mongodb+srv://hasbullah:dbstay@cluster0.ah0pld1.mongodb.net/?retryWrites=true&w=majority');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge : 60000 }
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/sb-admin", express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2")));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use("/admin", adminRouter);
app.use("/api/v1/member", apiRouter)
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use((req, res, next) => {
  // menyentuh session setiap kali pengguna melakukan aktivitas dalam aplikasi
  req.session.touch();
  next();
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
