'use strict';

const Controller = require('egg').Controller;

/**
 * 安卓端需要的接口
 * 功能都是获取信息
 */
class AndroidController extends Controller {

  /*-----------------开机视频功能-------------------*/
  /**
   * 获取开机视频
   */
  async getBootUpVideo(){
    const {ctx}=this;
    let t;
    try {
      t=await ctx.model.transaction();
      const res=await ctx.model.BootUpVideo.findAll({transaction:t})
      await t.commit();
      ctx.body={
        res: res[0].videoUrl,
      }     
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  /*-----------------医生信息-------------------*/
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
  async showOneDoctor() {
    const { ctx } = this;
    const { id } = ctx.params;
    const doctor=await ctx.service.doctor.findById(id);
    ctx.body = { doctor };
  }

  /*----------------医院信息介绍--------------------*/
  /**
   * 查找所有医院信息
   */
  async findAllIntroduction(){
    const {ctx,service}=this;
    const res=await service.introduction.findAllByAndroid();
    ctx.body={res}
  }

  /**
   *查找某个医院信息 
   */
  async findOneIntroduction(){
    const {ctx,service} = this;
    const { id } = ctx.params;
    const res = await service.introduction.findOne(id);
    ctx.body={res}
  } 

  /*----------------医院导航介绍--------------------*/
  /**
   * 查询所有医院建筑信息
   */
  async findAllBuildings() {
    const {ctx,service}=this;
    const res=await service.building.findAllBuildingsByAndroid();
    ctx.body={res}
  }

  /**
   * 根据id查询某个具体医院建筑信息
   */
  async findOneBuilding(){
    const {ctx,service} = this;
    const { id } = ctx.params;
    const res = await service.building.findOneBuildingById(id);
    ctx.body={res}
  }

  /**
   * 根据id查询某个具体楼层
   */
  async findOneFloor(){
    const {ctx,service} = this;
    const { id } = ctx.params;
    const res = await service.building.findOneFloorById(id);
    ctx.body={res}
  }

}

module.exports = AndroidController;
