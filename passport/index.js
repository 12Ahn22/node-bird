const passport = require('passport');

// 모듈이 아니라 Strategy(로그인 전략)를 가져온다.
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

const User = require('../models/index').User; // db.User를 User에 가져온다.

// // 세션을 이용한 로그인 인증 방식
module.exports = () => {
  // 로그인 시, 실행된다
  // req.session 객체에 어떤 데이터를 저장할지 결정하는 메서드
  // 세션에 아이디를 저장한다.
  passport.serializeUser((user, done) => {
    // done(에러, 세션에 저장하고 싶은 값)
    // 너무 많은 데이터를 세션에 저장하면 무거워지기 때문에 id만 저장한다.
    console.log('===========시리얼라이제이션 유저 ==================', user.id);
    done(null, user.id); // 유저 아이디를 어디로 전달하나요? 세션에 저장된다??
  });

  // passport.session 미들웨어가 매 요청 시마다 실행시키는 메서드
  // 세션에 저장한 id를 통해 사용자 정보 객체를 불러온다.
  // passport.deserializeUser((id,done)=>{
  //     User.findOne({where:{id}})
  //     // done(error, 유저데이터)
  //       .then(user=> done(null,user))
  //       .catch(err => done(err));
  // });
  passport.deserializeUser(async (id, done) => {
    try {
      const findUser = await User.findOne({ where: { id } });
      // done(error, 유저데이터)
      done(null, findUser);
    } catch (error) {
      done(error);
    }
  });

  // local은 local전략을 담은 익명 함수를 return 한 객체다.
  // 함수객체니까 ()를 사용할 수 있다.
  local();
  kakao();
};
