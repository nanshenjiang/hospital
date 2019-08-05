'use strict';

/**
 * 一级科室
 */
module.exports = app => {
  const { STRING, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  const FirstOffice = app.model.define('firstOffice', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    },
    name: STRING(25),   //一级科室总命名
  }, {
    timestamps: false,
  });

  FirstOffice.associate = function() {
    //FirstOffice表与SecondOffice表是一对多的关系
    app.model.FirstOffice.hasMany(app.model.SecondOffice, {foreignKey: 'firstOfficeId'});
  };
  return FirstOffice;
};