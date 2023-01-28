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
mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://hasbullah:Hasbullmern@cluster0.xlo5s0c.mongodb.net/staycation_db?retryWrites=true&w=majority');
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
