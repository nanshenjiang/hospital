'use strict';

/**
 * 文件流
 */
module.exports = app => {
  const { STRING, DATE, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  const IntroducePhoto = app.model.define('introducePhoto', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    },
    photoUrl: STRING(256),    //文件存储的相对地址
    introductionId: {   //图片的关联id
      type: UUID,
      allowNull: false,
    },
  }, { 
    timestamps: false,  
  });

  IntroducePhoto.associate = function() {
    //关系数据库中医院介绍表的主键--photo.id
    app.model.IntroducePhoto.belongsTo(app.model.Introduction, { foreignKey: 'introductionId', targetKey: 'id' });    
  };
  return IntroducePhoto;
};