const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';

// db 설정을 가져온다.
const config = require('../config/config.json')[env];


// MySQL 스키마와 매핑된다.
const db ={};
// 시퀄라이즈 ORM 객체를 생성한다.
const sequelize = new Sequelize(
  // db명, 계정명, 비밀번호, 설정
  config.database, config.username, config.password, config
);

// db 객체에 시퀄라이즈 객체를 바인딩한다.
db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// db.Config = config;


// 만든 모델 가져오기
// 모델들은 param을 받는다.
//  - define 메서드를 쓰기위한 sequelize 객체와
//  - Sequelize.DataType을 사용하기 위해서 Sequelize 객체를 보내준다.
db.User = require('./user')(sequelize , Sequelize);
db.Post = require('./post')(sequelize , Sequelize);
db.Hashtag = require('./hashtag')(sequelize , Sequelize);

// 모델 관계를 정의하기
// User 모델은 많은 포스트를 가지고 있다. User hasMany Post
db.User.hasMany(db.Post);
// 유저는 많은 다른 유저에 속해있다 => 둘 다 같은 테이블이다.
// 같은 테이블 간의 이름 겹침 방지를 위해 through를 사용한다.
// 누가 어떤 역할의 누구인지 구분하기 위해서 외래키로
// followingId와 followerId를 사용한다.
// 같은 테이블간의 as 옵션은 필수이다. as는 외래키와 반대되는 모델을 가리킨다.
db.User.belongsToMany(db.User,{
  foreignKey: 'followingId', // 사용될 외래키
  as:'Followers', //
  through:'Follow', // 같은 테이블 간의 관계를 나타낼 모델(테이블)이름
});
db.User.belongsToMany(db.User,{
  foreignKey: 'followerId',
  as:'Followings',
  through:'Follow',
});

// POST는 USER에 속해있다.
db.Post.belongsTo(db.User);
// POST는 여러개의 Hashtag에 속한다.
db.Post.belongsToMany(db.Hashtag,{ through: 'PostHashtag'});

// 해시태그는 많은 Post에 속해있다.
db.Hashtag.belongsToMany(db.Post,{through: 'PostHashtag'});

// db를 내보낸다.
module.exports = db;