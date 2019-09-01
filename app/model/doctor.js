'use strict';

/**
 * 医生信息功能：
 * 医生类
 */
module.exports = app => { 
  const { STRING, TEXT, INTEGER, UUID} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  //model of 医生
  const Doctor = app.model.define('doctor', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, ""); 
      }
    },
    name: STRING(25),     //医生名字
    avatarUrl: STRING(256),   //建筑图片地址urlS
    gender: INTEGER,    //性别：1.表示男性  2.表示女性 3.表示未知
    post: STRING(25),   //职务
    title: STRING(25),   //职称
    resume: TEXT,   //医生个人简历
    concurrent: TEXT,   //医生兼职
    achievement: TEXT,  //学术成果
    speciality: TEXT,    //医生专业特长
    secondOfficeId: {   //二级科室关联id
      type: UUID,
      allowNull: false, 
    }
  }, {
    timestamps: false,  //是否为表添加cteatedAt和updatadAt字段
  });  

  Doctor.associate = function() {
    //doctor表与workInformation表是一对多的关系
    app.model.Doctor.hasMany(app.model.WorkInformation, {foreignKey: 'doctorId'});
    //关系数据库中SecondOffice表的主键--secondOffice.id
    app.model.Doctor.belongsTo(app.model.SecondOffice, { foreignKey: 'secondOfficeId', targetKey: 'id' });     
  };
  return Doctor;
};
