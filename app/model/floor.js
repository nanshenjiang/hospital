'use strict';

/**
 * 医院楼层类
 */
module.exports = app => { 
  const { STRING, INTEGER, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  //model of 楼层 
  const Floor = app.model.define('floor', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    }, 
    name: INTEGER,     //楼层名
    photoUrl: STRING(256),   //楼层图片地址url
    buildingId: {   //与建筑关联id
      type: UUID,
      allowNull: false,
    }
  }, {
    timestamps: false,  //是否为表添加cteatedAt和updatadAt字段
  });  

  Floor.associate = function() {
    //Floor表关联Building表
    app.model.Floor.belongsTo(app.model.Building, { foreignKey: 'buildingId', targetKey: 'id' });
  };
  return Floor;
};
