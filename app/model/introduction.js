'use strict';

/**
 * 医院介绍类
 */
module.exports = app => { 
  const { STRING, TEXT, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  //model of 医院介绍
  const Introduction = app.model.define('introduction', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    },
    message: STRING(25),     //要介绍的信息(简略信息)
    description: TEXT,  //具体描述
  }, { 
    timestamps: false,  //是否为表添加cteatedAt和updatadAt字段
  });  
 
  Introduction.associate = function() {
    //SecondOffice表与doctor表是一对多的关系
    app.model.Introduction.hasMany(app.model.IntroducePhoto, {foreignKey: 'introductionId'});
  };
  return Introduction;
};
