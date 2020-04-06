'use strict';

const Controller = require('egg').Controller;

/**
 * 医生信息功能
 * 其中的科室控制层
 */
class OfficeController extends Controller {
  /**
   * 获取全部一级科室信息
   */
  async getAllFirstOffice() {
    const ctx=this.ctx;
    const res=await ctx.service.office.findAllFirstOffice();
    ctx.helper.success({ctx,res}); 
  }

  /**
   * 根据传入的一级科室id获取所有二级科室信息
   */
  async getAllSecondOffice(){
    const ctx=this.ctx;
    const {id}=ctx.params;
    const res=await ctx.service.office.findSecondOffice(id);
    ctx.helper.success({ctx,res}); 
  }

  /**
   * 上传一级科室
   */
  async saveFirstOffice(){
    const {ctx}=this;
    const office = ctx.request.body || {};
    const res =await ctx.service.office.saveFirstOffice(office);
    ctx.helper.success({ctx,res}); 
  }
  /**
   * 上传二级科室
   */
  async saveSecondOffice(){
    const {ctx}=this;
    const office = ctx.request.body || {};
    const res =await ctx.service.office.saveSecondOffice(office);
    ctx.helper.success({ctx,res}); 
  }

  /**
   * 更新一级科室
   */
  async updateFirstOffice() {
    const { ctx } = this;
    const {id}=ctx.params;
    const office = ctx.request.body || {};
    const res=await ctx.service.office.updateFirstOffice(id,office);
    ctx.helper.success({ctx,res}); 
  }
  /**
   * 更新二级科室
   */
  async updateSecondOffice() {
    const { ctx } = this;
    const {id}=ctx.params;
    const office = ctx.request.body || {};
    const res=await ctx.service.office.updateSecondOffice(id,office);
    ctx.helper.success({ctx,res}); 
  }
  /**
   * 删除一级科室
   */
  async deleteFirstOffice() {
    const {ctx} =this;
    const {id}=ctx.params;
    await ctx.service.office.deleteFirstOffice(id);
    ctx.helper.success({ctx}); 
  }
  /**
   * 删除二级科室
   */
  async deleteSecondOffice() {
    const {ctx} =this;
    const {id}=ctx.params;
    await ctx.service.office.deleteSecondOffice(id);
    ctx.helper.success({ctx}); 
  }
}

module.exports = OfficeController;
