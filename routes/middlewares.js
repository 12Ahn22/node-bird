// 접근 권한을 제어하는 미들웨어

// 로그인이여만 접근가능하게 하는 미들웨어 - isLoggedIn
exports.isLoggedIn = (req,res,next)=>{
  // req.isAuthenticated()는 passport가 req에 추가하는 객체이다.

  if(req.isAuthenticated()){
    next();
  }
  else{
    res.status(403).send('로그인 필요');
  }
};

// 로그인이 아닌 상태에만 접근가능하게 하는 미들웨어 - isNotLoggedIn
exports.isNotLoggedIn = (req,res,next)=>{
  if(!req.isAuthenticated()){
    next();
  }
  else{
    const message = encodeURIComponent('로그인한 상태입니다');
    res.redirect('/');
  }
}