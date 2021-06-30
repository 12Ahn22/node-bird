const Sequelize = require('sequelize');
// 시퀄라이즈에서 모델을 만드는 방법이 두가지가 있다.
// 센터 방식 - Using sequelize.define
// 노드 책 방식 - Extending Model

// 인수인 sequelize는 시퀄라이즈 옵션이다. index.js에서 설정해서 보내준다.
module.exports = (sequelize,DataTypes) => {
  return sequelize.define(
    // 테이블 이름
    'hashtag', // 자동으로 복수형이 된다.
    {
      title: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
    },
    // 옵션을 설정할 수 있다.
    {
      timestamps: true, // createdAt, updatedAt 넣을지 말지
      paranoid: false, // true면 바로 삭제 안됨
      modelName:'Hashtag',
      charset: 'utf8mb4',
      collate:'utf8mb4_general_ci',
      underscored: false, // 카멜케이스가 아닌 - 를 사용하는 방식 x
    }
  );
};