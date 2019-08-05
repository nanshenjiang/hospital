'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {
  // 展示角色清单
  async index() {
    const { ctx } = this;

    ctx.body = await ctx.model.Role.findAll({});
  }
}

module.exports = RoleController;
