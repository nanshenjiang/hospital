'use strict';

/**
 * 安全key
 */
module.exports = app => {
  const { STRING, BOOLEAN, DATE, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  const Appkey = app.model.define('appkey', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    },
    code: STRING(64),
    expire_at: DATE,
    is_auth: {
      type: BOOLEAN,
      defaultValue: false,
    },
  });
  return Appkey;
};
