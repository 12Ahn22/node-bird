const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// User db객체 가져오기
const User = require('../models/index').User;

// 로컬 로그인의 전략 = 로그인 방법을 내보낸다.
module.exports = () => {
  // passport.use({전략에 관한 설정}, async(전략을 실행하는 함수)=>{})
  passport.use(
    // 전략을 새로 만들어서 설정을 넣는다
    // usernameField와 passowrdField에 req.body에서 아이디와 비밀번호 값을 가진 속성명을 넣는다.
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      // 실제 전략을 수행하는 async 함수
      // 위에서 받은 email과 passowrd가 인수로 들어간다.
      // done은 passport.authenticate의 콜백함수이다!
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              console.log('=====Local Storategy======');
              done(null, exUser);
            } else {
              done(null, false, { message: '비밀번호 오류' });
            }
          } else {
            done(null, false, { message: '가입되지않은 사용자' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
