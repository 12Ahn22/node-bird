// page 라우터
const express = require('express');
const router = express.Router();

// 미들웨어
// 미들웨어는 use 메서드를 사용한다.
// 이 미들웨어는 localhost:5000/에 접근 했을 때,
// 항상 실행되는 미들웨어이다.
router.use((req,res,next)=>{
  console.log('미들웨어입니다.')
  // res.locals는 req가 들어왔을 때에만 살아있는 데이터이다.
  // 모든 템플릿 엔진이 사용하는 변수라서 res.locals에 선언한다.
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});


// GET 메서드
// localhost:5000/
router.get('/',(req,res,next)=>{
  // 트윗
  const twits = [];

  res.render('main',{
    title: 'NodeBird',
    twits,
  });
});

// GET 메서드
// localhost:5000/profile  
router.get('/profile',(req,res)=>{
  res.render('profile',{title: '내 정보 - NordBird'});
});

// GET 메서드
// localhost:5000/join
router.get('/join',(req,res)=>{
  res.render('join',{title : '회원 가입 - NordBird'});
});


// 라우터 내보내기
module.exports = router;