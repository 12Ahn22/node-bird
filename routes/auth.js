const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
// User 모델 가져오기
const User = require('../models/index').User;

const router = express.Router();

// 인증을 진행하는 라우터

// 회원 가입 폼을 클라이언에서 받아 데이터베이스에 저장시키는 라우터
// isNotLoggedIn 미들웨어를 사용해서, 로그인이 안된 경우에만 next를 진행해 아래 메서드가 진행될 수 있도록 한다.
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  // 클라이언트가 보낸 데이터 받아오기
  const { email, nick, password } = req.body;
  // 에러처리구문
  try {
    // 입력받은 email값으로 이미 db에 데이터가 존재하는지 판단한다.
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      // exUser에 값이 있다면 해당 email값은 사용되었다. => 회원가입 불가
      return res.send('이미 가입된 유저입니다.');
    }
    // 그렇지 않다면 입력받은 비밀번호를 암호화시킨다.
    const hash = await bcrypt.hash(password, 12); // hash(평문,salt);
    // 데이터베이스에 계정 정보를 저장한다.
    await User.create({
      email,
      nick,
      password: hash,
    });
    // 메인 화면 페이지로 리다이렉트한다.
    return res.redirect('/');
    // return res.json({ msg: 'ok' });
  } catch (error) {
    // 에러가 발생하면 에러 처리 미들웨어로 보낸다.
    // next(error); - next 메서드안에 인수를 넣으면 에러처리 미들웨어로 빠진다.
    console.error(error);
    return next(error);
  }
});

// Login을 하는 라우터
// 로그인은 POST라우터를 사용한다 - 계정명과 비밀번호를 받아야하기때문
router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 라우터 미들웨어 안에 들어있는 미들웨어 passport.authenticate ('로직 선택', done콜백 )
  // localStrategy에 있는 걸 실행하나?
  // 전략이 성공하거나 실패하면 authenticate 메서드의 콜백함수가 실행된다.
  // 얘도 미들웨어임 - 도대체 저 user는 어디서 오는거지? =>
  passport.authenticate('local', (authError, user, info) => {
    // 로그인 라우터에 접근하면
    // 1. 일단 로컬 스토리티지에서 작동하는가?

    // 2. 콘솔찍어보기
    console.log('=============로그인 라우터의 auth안=============');
    console.log(user);
    if (authError) {
      console.error(authError);
      return next(authError); // 에러 처리
    }
    // user에 값이 있다면 전략 성공 -> req.login 메서드를 호출한다.
    // Passport는 req에 login메서드와 logout 메서드를 추가한다.
    if (!user) {
      return res.send('유저가 없음');
    }

    // req.login()은 패스포트가 제공하는 객체
    // 리턴을 req.login을하는데 login이 뭘까?
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 안의 미들웨어를 사용하는 방법
});

// 로그아웃을 하는 라우터
router.get('/logout', (req, res, next) => {
  // req.user 객체를 삭제한다.
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

// 카카오 로그인 라우터
router.get('/kakao', passport.authenticate('kakao'));
// 카카오 콜백 로그인 라우터 - 여기로 카카오가 accessToken, refreshToken, profile를 보내준다.
router.get(
  '/kakao/callback',
  //
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
