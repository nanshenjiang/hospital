'use strict';

/**
 * 医院介绍功能：
 * 医院介绍图片model
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
    //绑定introduction
    app.model.IntroducePhoto.belongsTo(app.model.Introduction, { foreignKey: 'introductionId', targetKey: 'id' });    
  };
  return IntroducePhoto;
};