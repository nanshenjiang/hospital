'use strict';

/**
 * 自定义开机视频功能：
 * 存储开机视频
 */
module.exports = app => { 
  const { STRING,UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  //model of 视频
  const BootUpVideo = app.model.define('bootUpVideo', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      } 
    }, 
    videoUrl: STRING(256),   //视频存储的url
  }, {
    timestamps: true,  //是否为表添加cteatedAt和updatadAt字段
  });  

  return BootUpVideo;
};
