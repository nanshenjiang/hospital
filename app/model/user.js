'use strict';

/**
 * 用户类（登录用户类）
 */
module.exports = app => {
  const { STRING, BOOLEAN, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");
  
  //登录用户类
  const User = app.model.define('user', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    },
    username: {   //用户名
      type: STRING(30),
      unique: true,
      allowNull: false,
    },  
    password: {   //用户密码
      type: STRING(60),
      allowNull: false,
    },  
  }, {
    paranoid: true,  //只在启用时间戳时工作
  });

  User.associate = function() {
    app.model.User.belongsTo(app.model.Role, { as: 'role' });   //关系数据库中role表的主键--role.id
  };

  return User;
};
