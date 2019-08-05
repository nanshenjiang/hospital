'use strict';

const Controller = require('egg').Controller;

class WorkInfoController extends Controller {
  /**
   * 获取全部出诊信息
   */
  async getAllWorkInfo() {
    const ctx=this.ctx;
    const {id}=ctx.params;
    const res=await ctx.service.workInfo.queryByDoctorId(id); 
    ctx.helper.success({ctx,res}); 
  }

  /**
   * 上传出诊信息
   */
  async save(){
    const {ctx}=this;
    const workinformation = ctx.request.body || {};
    const res =await ctx.service.workInfo.saveWorkInfo(workinformation);
    ctx.helper.success({ctx,res}); 
  }

  /**
   * 更新出诊信息
   */
  async update() {
    const { ctx } = this;
    const {id}=ctx.params;
    const workinformation = ctx.request.body || {};
    const res=await ctx.service.workInfo.updateWorkInfo(id,workinformation);
    ctx.helper.success({ctx,res}); 
  }

  /**
   * 删除出诊信息
   */
  async delete() {
    const {ctx} =this;
    const {id}=ctx.params;
    await ctx.service.workInfo.deleteById(id);
    ctx.helper.success({ctx}); 
  }

}

module.exports = WorkInfoController;
