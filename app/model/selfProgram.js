'use strict';

/**
 * 自办节目功能：
 * 存储自办节目视频
 */
module.exports = app => { 
  const { STRING,UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  //model of 视频
  const SelfProgram = app.model.define('selfProgram', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      } 
    }, 
    name: STRING(25),        //节目名 
    videoUrl: STRING(256),   //视频存储的url
  }, {
    timestamps: true,  //是否为表添加cteatedAt和updatadAt字段
  });  

  return SelfProgram;
};
