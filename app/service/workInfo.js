'use strict';

const Service = require('egg').Service;

/**
 * 医生出诊信息service层
 */
class WorkInfoService extends Service {

  //根据医生id查询出诊信息
  async queryByDoctorId(doctorId) {
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();  //事务操作
      const list=await ctx.model.WorkInformation.findAll({
        where: {
          doctorId: doctorId,
        }
      },{transaction:t})
      if(!Object.getOwnPropertySymbols(list).length){  //判断对象是否为空
        ctx.throw();
      }
      await t.commit();
      return list;   
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  //保存出诊信息（需要传入医生id）
  async saveWorkInfo(workinfo){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const WorkInfo=await ctx.model.WorkInformation.create(workinfo,{transaction:t});
      if(!WorkInfo){
        ctx.throw();
      }
      await t.commit();
      return WorkInfo;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  //更新出诊信息（需要医生id）
  async updateWorkInfo(id,workinfo){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const WorkInfo=await ctx.model.WorkInformation.findById(id,{transaction:t});
      if(!WorkInfo){
        ctx.throw();
      }
      const res=await await WorkInfo.update(workinfo,{transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  //删除出诊信息
  async deleteById(id){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const WorkInfo=await ctx.model.WorkInformation.findById(id,{transaction:t});
      if(!WorkInfo){
        ctx.throw();
      }
      const res=await WorkInfo.destroy({transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Delete Failed');
    }
  }
}

module.exports = WorkInfoService;
