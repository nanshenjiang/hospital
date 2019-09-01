/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 * 默认配置文件
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1554464047950_6708';

  // 添加中间件
  config.middleware = ['errorHandler'];  

  //ORM配置：mysql配置
  config.sequelize = {
    dialect: 'mysql',
    database: 'hospital', 
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    timezone: '+08:00', // 东八时区
  };

  // // redis配置
  // config.redis = {
  //   client: {
  //     host: '127.0.0.1',
  //     port: '6379',
  //     password: '',
  //     db: '0',
  //   },
  //   agent: true,
  // };

  // 传输文件大小设置
  config.multipart = {
    fileSize: '50mb',
  };

  //安全配置：关闭csrf
  config.security = {
    csrf: {
      enable: false,   //在node_modules中egg-security中config中修改为false了，记得修改回
    },
  };
  
  //跨域防护
  config.cors = {
    origin:'*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  //指定jwt配置
  config.jwt = {
    secret: 'egg-xie-jwt',  //设置任意属性
  };

  //修改传输body的大小
  config.bodyParser = {
    jsonLimit: '5mb',
    formLimit: '6mb',
  };

  //bcrypt加密
  config.bcrypt = {
    saltRounds: 10 // default 10
  };

  //开启上传文件
  config.multipart = {
    fileSize: '50mb',
    mode: 'file',
  };

  return config;
};
