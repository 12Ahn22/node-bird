const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// view 엔진
const nunjucks = require('nunjucks');

dotenv.config();

// router
const pageRouter = require('./routes/page');

// create application
const app = express();
// setting port
app.set('port', process.env.PORT || 5000);
// setting view engines
app.set('view engine', 'html');
// app.set('views', path.join(__dirname, 'views')); // views의 기본 경로를 지정해준다
nunjucks.configure('views',{
  express:app,
  watch:true,
});

// use morgan
app.use(morgan('dev')); // 로그를 찍음
// 루트(/)의 경로를 public 폴더로 설정한다
app.use(express.static(path.join(__dirname, 'public')));
// express.json() 사용하기 - 데이터를 json 형식으로 사용할 수 있게 해준다.
app.use(express.json());
// url을 인코딩해주는 미들웨어. extended: false는 내장 모듈을 사용하겠다는 의미이다.
app.use(express.urlencoded({ extended: false }));
// 쿠키 파서 사용하기
app.use(cookieParser(process.env.COOKIE_SECRET));
// 세션 사용하기
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// 라우터 경로
app.use('/', pageRouter); // 루트는 pageRouter

// 404 응답을 하는 미들웨어
app.use((req, res, next) => {
  console.log('404 에러 응답 미들웨어입니다.');
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
  error.status = 404;
  next(error); // 에러를 다음으로 전달해준다.
});
// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  // err는 위의 미들웨어가 만들어서 보내는 error이다.
  // err에는 message에 에러 메세지가 들어있고 그냥 err에는 404가 들어있다.

  // res.locals는 request의 라이프 사이클동안만 사용할 수 있다.
  res.locals.message = err.message;
  res.locals.error = process.env.NOED_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.send(res.locals.message);
});

// listen
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번에 포트에서 대기 중입니다.');
});
