var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json') ;

const resError = require('./service/resErrorMessage');

require('./connections');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var uploadRouter = require('./routes/upload');
var chatRouter = require('./routes/chat');

var app = express();

// 程式錯誤
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
	console.error(err);
	process.exit(1);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/', indexRouter);
app.use(usersRouter);
app.use(postsRouter);
app.use(uploadRouter);
app.use(chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.name === 'ValidationError'){
    err.statusCode = 400;
    err.isOperational = true;
  }

  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'dev') {
    return resError.dev(err, res);
  };
  
  resError.prod(err, res);
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
