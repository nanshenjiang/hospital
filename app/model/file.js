'use strict';

/**
 * 文件流
 */
module.exports = app => {
  const { STRING, DATE, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  const File = app.model.define('file', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    },
    filename: STRING(64),   //文件名
    extname: STRING(64),   //文件扩展名
    relativePath: STRING(256),    //文件存储的相对地址
    absolutePath: STRING(256),   //文件存储的绝对路径
    photoId: {   //图片的关联id
      type: UUID,
      allowNull: false,
    },
    createdAt: {   //文件创立时间
      type: DATE, 
      defaultValue: Date.now,
    }
  }, { 
    timestamps: false,  
  });

  File.associate = function() {
    //关系数据库中医院介绍表的主键--photo.id
    app.model.File.belongsTo(app.model.Introduction, { foreignKey: 'photoId', targetKey: 'id' });    
  };
  return File;
};