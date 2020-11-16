const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const parser = require('body-parser');
require('log-timestamp');

dotenv.config();
const v1 = require('./routes/v1');

const logStr = "세지원 :";

const app = express();

app.use(parser.json({ limit: '200mb' }));
app.use(parser.urlencoded({ limit: '200mb', extended: true }));

app.set('port', process.env.PORT || 49953);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(sessionMiddleware);

app.use('/v1', v1);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
  console.error(err);
});

const server = app.listen(app.get('port'), () => {
  console.log(logStr, app.get('port'), '번 포트에서 대기중');
});
