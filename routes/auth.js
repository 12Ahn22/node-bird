// const express = require('express');
// const passport = require('passport');
// const bcrypt = require('bcrypt');
// const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
// const User = require('../models/index').User;

// const router = express.Router();

// router.post('/join',isNotLoggedIn,async(req,res,next)=>{
//   // 클라이언트가 보낸 데이터 받아오기
//   const { email, nick, password } = req.body;
//   try {
//     const exUser = await User.findOne({where:{email}});
//     if(exUser){
//       return res.send('이미 가입된 유저입니다.');
//     }
//     const hash = await bcrypt.hash(password, 12);
//     await User.create({
//       email,
//       nick,
//       password: hash,
//     });
//     return res.redirect('/');
//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// });





module.exports = router;