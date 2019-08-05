'use strict';

/**
 * 中间件：在用户发起请求之后，匹配路由之前做的一系列操作
 * 判断登录转态
 */
module.exports = options => {
  return async function limit(ctx, next) {

    switch (options.type) {
      // 需要已经登录
      case 'logged_in':
        if (!ctx.session.id) {
          throw new Error('现在您未登录，请登录后操作');
        }
        break;
      // 需要未登录
      case 'logged_out':
        if (ctx.session.id) {
          throw new Error('现在您已登录，请退出登录后操作');
        }
        break;
      // 需要管理员权限
      case 'only_admin':
        if (!ctx.session.is_admin) {
          throw new Error('您的权限不足，无法继续访问！');
        }
        break;
      default:
    }
    
    await next();
  };
};
