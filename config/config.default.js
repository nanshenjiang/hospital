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
    host: 'xx.xx.xx.xx',
    port: 3306,
    username: 'xxx',
    password: 'xxxx',
    timezone: '+08:00', // 东八时区
  };

  // // redis配置
  // config.redis = {
  //   client: {
  //     host: 'xx.xx.xx.xx',
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

  //开启mqtt消息队列
  config.emqtt = {
    client: {
      host:'mqtt://xxx.xxx.xxx.xxx',  //添加mqtt服务器地址
      username:'xxx',
      password:'xxx',
      clientId:'xxx',  //自己命名
      options: {
        keepalive: 60,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        rejectUnauthorized: false,
      },
      // msgMiddleware: [ 'mqtt' ],
    },
  }

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
    secret: 'egg-jwt',  //设置任意属性
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
