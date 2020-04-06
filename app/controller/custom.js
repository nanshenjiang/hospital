'use strict';

const Controller = require('egg').Controller;

/**
 * 强制插播功能实现
 */
class CustomController extends Controller {
  /**
   * 强制插播功能
   */
  async forceInsert() {
    const {ctx}=this;
    const msg = ctx.request.body || {};
    const ans=JSON.stringify(msg);
    // console.log(ans);
    //发布消息,第一个参数为topic(消息主题)，第二个参数为payload(消息内容)，第三个参数为QOS(服务质量)        
    await this.app.emqtt.publish('forceInsert', ans, { qos: 0 });
    ctx.helper.success({ctx});
  }
}

module.exports = CustomController;
