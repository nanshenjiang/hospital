'use strict';

/**
 * 医院建筑类
 */
module.exports = app => { 
  const { STRING, BOOLEAN, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  //model of 建筑 
  const Building = app.model.define('building', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      } 
    }, 
    name: STRING(25),     //建筑名
    photoUrl: STRING(256),   //建筑图片地址url
    isMain: {   //是否为主建筑：即建筑全局展览图，默认为不是，而且唯一的全局展示图也是在建立数据库时候建立，用户没法进行操作
        type: BOOLEAN,
        defaultValue: false,  //默认为false
    },
  }, {
    timestamps: false,  //是否为表添加cteatedAt和updatadAt字段
  });  

  Building.associate = function() {
    //Building表与Floor表是一对多的关系
    app.model.Building.hasMany(app.model.Floor, {foreignKey: 'buildingId'});
  };
  return Building;
};
