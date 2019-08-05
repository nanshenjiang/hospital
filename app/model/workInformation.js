'use strict';

/**
 * 医生出诊信息类
 */
module.exports = app => {
  const { STRING, INTEGER, DATE, UUID} = app.Sequelize;  
  const uuidv1=require("uuid/v1");

  //医生出诊信息
  const WorkInformation = app.model.define('workInformation', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      }
    },
    department: STRING(25),   //科室名称
    registerType: STRING(25),   //号源类别
    date: DATE,   //出诊日期
    classes: STRING(25),   //班次
    remaining: INTEGER,  //剩余号数
    doctorId: {
      type: UUID,
      allowNull: false,
    }
  }, {
    timestamps: false, 
  });
  WorkInformation.associate = function() {
    //关系数据库中doctor表的主键--doctor.id
    app.model.WorkInformation.belongsTo(app.model.Doctor, { foreignKey: 'doctorId', targetKey: 'id' });    
  };
  return WorkInformation;
};