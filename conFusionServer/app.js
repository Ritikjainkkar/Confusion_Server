var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promosRouter');
var leaderRouter = require('./routes/leadersRouter');
var authenticate = require('./authenticate');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');

var mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url , { useNewUrlParser: true,
        useCreateIndex:true,
        useUnifiedTopology:true });

connect.then((db) => {
  console.log("Connected to Server Successfully");
},(err) => { console.log(err);}
);

var app = express();
// view engine setup

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    name:'session-id',
    secret:'12345-67890-09876-54321',
    saveUninitialized:false,
    resave:false,
    store:new FileStore()
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorite', favoriteRouter);


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