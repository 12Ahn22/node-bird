const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/index').User;

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, // 카카오에서 발급해주는 아이디 = 노출되면 안된다.
        callbackURL: '/auth/kakao/callback', // 카카오로부터 인증 결과를 받을 라우터
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('============카카오 Strategy ============');
        // accessToken, refreshToken, profile => 카카오가 callbackURL로 보내준다.
        // console.log('kakao profile._json', profile._json); // 카카오는 proflie 객체에 유저 정보를 담아 보내준다.
        // console.log('kakao profile._json', profile._json.kakao_account); // 카카오는 proflie 객체에 유저 정보를 담아 보내준다.
        // console.log('kakao profile', profile); // 카카오는 proflie 객체에 유저 정보를 담아 보내준다.
        try {
          // 유저 정보 가져오기
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          // 이미 유저가 존재한다면
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account.email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
