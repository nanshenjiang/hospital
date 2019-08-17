'use strict';

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

//开启跨域
exports.cors = {
  enable: true,
  package: 'egg-cors',
};

//开启文件支持
exports.multipart = {
  mode: 'file', 
};

//validate：对参数进行校验（含ctx.request.body，cxt.query，ctx.params）
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

