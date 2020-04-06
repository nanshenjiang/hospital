'use strict';

/**
 * 可定制化祝福功能：
 * 定制化祝福语类
 */
module.exports = app => { 
  const { STRING, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  //model of 定制化祝福语
  const Benediction = app.model.define('benediction', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, ""); 
      }
    },
    blessWord: STRING(256),     //祝福语
    hospitalName: STRING(25),   //医院名字
    backgroundUrl: STRING(256),   //背景图片url
    //日期和时间都是实时获取的
  }, {
    timestamps: false,  //是否为表添加cteatedAt和updatadAt字段
  });  

  return Benediction;
};