'use strict';

const Controller = require('egg').Controller;

/**
 * 安卓端需要的接口
 */
class AndroidController extends Controller {

  /**
   * 获取全部一级科室信息
   */
  async getAllFirstOffice() {
    const ctx=this.ctx;
    ctx.body=await ctx.service.office.findAllFirstOffice(); 
  }

  /**
   * 根据传入的一级科室id获取所有二级科室信息
   */
  async getAllSecondOffice(){
    const ctx=this.ctx;
    const {id}=ctx.params;
    ctx.body=await ctx.service.office.findSecondOffice(id);
  }

  /**
   * 获取医生列表: 使用到了分页规则
   */
  async showPartDoctor() {
    const ctx = this.ctx;
    //对query的参数进行校验
    // ctx.validate(pagination, ctx.request.query);
    const { page, pageSize, secondOfficeId } = ctx.query;
    const res = await ctx.service.doctor.queryByPage(secondOfficeId,page,pageSize);
    ctx.body = {
      list: res.result,   //医生列表
      page: page,    //当前页面数
      pageSize: pageSize,   //每一页的数量
      totalPages: res.totalPages,   //总页面数
    };
  }
  /**
   *根据二级科室id查询下所有医生
   *同时查询医生总数（安卓要求） 
   */
  async showAllDoctor(){
    const ctx = this.ctx;
    const { id } = ctx.params;
    const doctors = await ctx.service.doctor.findBySecondOfficeIdNeedByAndroid(id);
    ctx.body=doctors; 
  }
  /**
   * 获取具体医生信息
   */
  async showOne() {
    const { ctx } = this;
    const { id } = ctx.params;
    const doctor=await ctx.service.doctor.findById(id);
    ctx.body = { doctor };
  }

}

module.exports = AndroidController;
