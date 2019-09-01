'use strict';

/**
 * 人脸识别功能：
 * 病人病历类(用于人脸识别中的存储)
 */
module.exports = app => { 
  const { STRING,UUID,INTEGER,FLOAT,BLOB} = app.Sequelize;
  const uuidv1=require("uuid/v1");

  //model of 病人
  const Figure = app.model.define('figure', {
    id: {   //设置id格式：uuid
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {  //修改id样式：去除-
        return uuidv1().replace(/-/g, "");
      } 
    }, 
    IDnumber: INTEGER(20),   //身份证号
    name: STRING(25),     //名字
    faceBitmap: BLOB('medium'),  //人脸图片
    embeddngs: FLOAT,   //人脸特征
   }, {
    timestamps: false,  //是否为表添加cteatedAt和updatadAt字段
  });  

  return Figure;
};