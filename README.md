# IPTV智慧医院管理后端系统

## 说明

基于Egg.js实现的一套用于医院统一管理安卓机顶盒的服务端系统，本项目仅实现后端部分，提供数据接口为安卓端（安卓电视）和前端调用。本套系统使用到技术：Egg.js，Sequelize，JWT，MQTT。包含了登录权限管理，文件管理，CURD管理，消息队列管理等。

## 运行及调试

下载项目代码，安装mysql数据库并**新建数据库hospital**，同时部署好一台MQTT服务器，记录好所有配置信息，至{项目路径}/config/config.default.js配置文件下修改对应配置：

```
'use strict';

//ORM配置：mysql配置
config.sequelize = {
    dialect: 'mysql',
    database: 'hospital', 
    host: 'xxx.xxx.xxx.xxx',  //mysql服务器地址
    port: 3306,
    username: 'xxx',    //账户
    password: 'xxx',   //密码
    timezone: '+08:00', // 东八时区
};

//开启mqtt消息队列
config.emqtt = {
    client: {
        host:'mqtt://xxx.xxx.xxx.xxx',  //添加mqtt服务器地址
        username:'xxx',    //账户
        password:'xxx',    //密码
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
```

在项目路径下运行命令

```bash
> npm i
> npm run dev
```

此时初始化数据库中所有信息：

- 初始化所有数据表及管理员信息: `http://127.0.0.1:7001/setup/database/init1`
- 初始化部分数据用于测试: `http://127.0.0.1:7001/setup/database/init2`

返回success证明初始化成功，此时拥有一个管理员权限的账户（账户：root   密码：123456）

## 部署

具体部署可参考：[egg.js官网部署文档](https://eggjs.org/zh-cn/core/deployment.html)

## 接口文档

具体接口文档访问路径{项目路径}/documents/下的web端接口文档和安卓端接口文档
