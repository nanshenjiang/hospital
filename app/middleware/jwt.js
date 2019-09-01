'use strict';

/**
 * 中间件：在用户发起请求之后，匹配路由之前做的一系列操作
 * 对需要用户登录之后才可以进行的操作进行用户登录判断
 * 使用jwt令牌进行判断：
 * （1）是否登录
 * （2）登录是否超时或者其他错误
 * （3）是否为管理员权限
 */
module.exports = options => {
  const jwt = require('jsonwebtoken');
  return async function (ctx, next) {
    const token=ctx.cookies.get('token',{ 
      // httpOnly: true, 
      signed: true,
      encrypt: true,
    });
    // console.log(token);
    if (token!==undefined&&token!==null&&token!=="") {
      // let token = ctx.request.header['authorization'].split(' ')[1];
      let decoded;
      //解码token
      try {
        //封装解密后结果
        decoded = jwt.verify(token, 'scnu-xie');
      } catch (error) {
        //有错
        if (error.name == 'TokenExpiredError') {
          //时间到期，报时间过期错误
          ctx.throw(403,'登录超时，请重新登录！')
        } else {
          //其他错误导致令牌失效，报错
          ctx.throw(403,'登录失效，请重新登录！')
        }
      }
      //检查权限
      if(options.type==='admin'){
        //需要管理员权限
        if(!decoded.isAdmin){
          //该用户没有管理员权限，报错
          ctx.throw(401,'请联系管理员获取权限后再进行操作！');
        }
      }
      //重置cookie时间
      ctx.cookies.set('token', token, {
        maxAge: 60 * 1000 * 60,  //重置一小时
        httpOnly: true,
        overwrite: true,
        signed: true,
        encrypt: true,
      });
      await next();
    } else {
      //没有token，即未登录用户
      ctx.throw(401,'请先登录！');
      return;
    }
  }
};