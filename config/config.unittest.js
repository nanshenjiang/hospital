'use strict';

/**
 * 单元测试环境
 */

exports.sequelize = {
  dialect: 'mysql',
  database: 'hospital',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '123456',
};

exports.redis = {
  client: {
    host: '127.0.0.1',
    port: '6379',
    password: '',
    db: '0',
  },
  agent: true,
};
