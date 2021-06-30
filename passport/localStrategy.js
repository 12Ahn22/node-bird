const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/index').User;

// 로컬 로그인의 전략 = 로그인 방법을 내보낸다.
module.exports = ()=>{
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email , password , done)=>{
    try {
      const exUser = await User.findOne({where:{email}});
      if(exUser){
        const result = await bcrypt.compare(password, exUser.password);
        if(result){
          done(null,exUser);
        }else{
          done(null, false, {message:'비밀번호 오류'});
        }
      }else{
        done(null,false,{message:'가입되지않은 사용자'});
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
}