'use strict';
const path = require('path');

/** 
 * 本地开发环境
 */

 //全局变量设置：path路径设置
module.exports = appInfo => {
  const config = exports = {
    //基础路径设置
    data_dir: path.join(appInfo.HOME, 'hospital/'),
    system: {
      //医生头像路径
      avatar_root: path.join(appInfo.HOME, 'hospital/doctor_avatar/'),
      //音频路径
      attachment_root: path.join(appInfo.HOME, 'hospital/video/'),
    },
  };
  return config;
};
//ORM配置：mysql配置
exports.sequelize = {
  dialect: 'mysql',
  database: 'hospital',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '123456',
};
//redis配置
exports.redis = {
  client: {
    host: '127.0.0.1',
    port: '6379',
    password: '',
    db: '0',
  },
  agent: true,
};
// 传输文件大小设置
exports.multipart = {
  fileSize: '50mb',
};
//安全配置：关闭csrf
exports.security = {
  csrf: {
    enable: false,   //在node_modules中egg-security中config中修改为false了，记得修改回
    // ingnoreJSON: true,    
  },
  domainWhiteList: '*'
};
exports.cors = {
  origin:'*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
};
