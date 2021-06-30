const Sequelize = require('sequelize');
// 시퀄라이즈에서 모델을 만드는 방법이 두가지가 있다.
// 센터 방식 - Using sequelize.define
// 노드 책 방식 - Extending Model

// 인수인 sequelize는 시퀄라이즈 옵션이다. index.js에서 설정해서 보내준다.
module.exports = (sequelize,DataTypes) => {
  return sequelize.define(
    // 테이블 이름
    'user', // 자동으로 복수형이 된다.
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true, // 유니크 키 - 중복불가
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue:'local', // 디폴트 값을 선정한다.
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    // 옵션을 설정할 수 있다.
    {
      timestamps: true, // createdAt, updatedAt 넣을지 말지
      paranoid: true, // true면 바로 삭제 안됨
      modelName:'User',
      charset: 'utf8',
      collate:'utf8_general_ci',
      underscored: false, // 카멜케이스가 아닌 - 를 사용하는 방식 x
    }
  );
};