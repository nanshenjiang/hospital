# 云加固平台部署文档

## 基础软件

必要的软件：

- `node`: Node.js
- `mysql`: 核心数据库
- `redis`: Session数据库

## 安装依赖

`npm i`

## 配置数据库

`config/config.prod.js` 生产环境配置

配置参考:

```js
'use strict';

exports.sequelize = {
  dialect: 'mysql',
  database: 'cloud-reinforce', // 数据库名称
  host: 'localhost', // 数据库主机名
  port: 3306, // 数据库端口
  username: 'root', // 数据库用户名
  password: 'root', // 数据库密码
};

exports.redis = {
  client: {
    host: '127.0.0.1', // Redis主机名
    port: '6379', // Redis端口
    password: '', // Redis密码
    db: '0',
  },
  agent: true,
};

```

## 运行服务器

- 生产环境运行: `npm run start` (使用 `config.prod.js` 的配置)
- 测试环境运行: `npm run dev` (使用 `config.local.js` 的配置)

## 初始化数据

- 重置数据库: `http://127.0.0.1:7001/setup/database/init`
- 灌入默认数据: `http://127.0.0.1:7001/setup/dev/init`

## mysql 数据库编码设置
- ALTER DATABASE ganzhou_hospital  CHARACTER SET = utf8mb4      COLLATE = utf8mb4_unicode_ci;