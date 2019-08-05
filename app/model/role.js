'use strict';

/**
 * 权限类
 */
module.exports = app => {
  const { STRING, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  //model of 权限
  const Role = app.model.define('role', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    },
    name: {      //权限名
      type:STRING(25),
      allowNull: false,
    },    
    description: STRING(200),  //权限形容
  }, {
    timestamps: false,
  });

  return Role;
};
