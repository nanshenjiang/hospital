'use strict';

/**
 * 二级科室
 */
module.exports = app => {
  const { STRING, UUID} = app.Sequelize; 
  const uuidv1=require("uuid/v1");

  const SecondOffice = app.model.define('secondOffice', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    },
    name: STRING(25),   //二级科室命名
    firstOfficeId: {
      type: UUID,
      allowNull: false,
    }
  }, {
    timestamps: false,
  });
  SecondOffice.associate = function() {
    //SecondOffice表与doctor表是一对多的关系
    app.model.SecondOffice.hasMany(app.model.Doctor, {foreignKey: 'secondOfficeId'});
    //关系数据库中firstOffice表的主键--firstOffice.id
    app.model.SecondOffice.belongsTo(app.model.FirstOffice, { foreignKey: 'firstOfficeId', targetKey: 'id' });    
  };
  return SecondOffice;
};