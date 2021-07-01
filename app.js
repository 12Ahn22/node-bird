const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// view 엔진
const nunjucks = require('nunjucks');
// 로그인 인증을 위한 passport 모듈
const passport = require('passport');

// create application
const app = express();

console.log('---------------------------------------------');

// dotenv - 우선순위 가장 위로 올리기
dotenv.config();

// config들
const passportConfig = require('./passport'); // passport 폴더를 만들어야한다. ./passport/index.js == ./passport
// './passport'는 익명 함수 객체를 내보내기 때문에 passportConfig(); 사용 가능
passportConfig(); // 패스포트 설정

// router
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');

// setting port
app.set('port', process.env.PORT || 8500);
// setting view engines
app.set('view engine', 'html');
// app.set('views', path.join(__dirname, 'views')); // views의 기본 경로를 지정해준다
nunjucks.configure('views', {
  express: app,
  watch: true,
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
// passport 미들웨어 사용하기
// req 객체에 passport 설정을 심는 미들웨어
app.use(passport.initialize());
// req.session 객체에 passport 정보를 저장하는 미들웨어
app.use(passport.session()); // req.session 객체는 express-session이 생성한다.

// 시퀄라이즈 모듈 가져오기
// MVC(모델영역) - 시퀄라이즈 ORM 객체 참조하기
const sequelize = require('./models/index').sequelize; // db안에 있는 시퀄라이저객체
// // 시퀄라이즈 ORM 객체를 이용해 지정한 데이터베이스(MySQL)와 연결하기
sequelize
  .sync()
  .then(() => {
    console.log('MySQL 연결 성공!');
  })
  .catch((err) => {
    console.error(err);
  });

// 라우터 경로
app.use('/', pageRouter); // 루트는 pageRouter
app.use('/auth', authRouter);

// 잠시 세션 테스트하는 라우터 미들웨어
app.get('/session', (req, res) => {
  return res.json({
    'req.session': req.session, // 세션 데이터
    'req.user': req.user, // 유저 데이터(뒷 부분에서 설명)
    'req._passport': req._passport, // 패스포트 데이터(뒷 부분에서 설명)
  });
});

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
