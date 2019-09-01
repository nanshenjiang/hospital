'use strict';

const Service = require('egg').Service;

/**
 * 医生信息功能中：
 * 科室的service层
 */
class OfficeService extends Service {

  //获取所有一级科室
  async findAllFirstOffice() {
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();  //事务操作
      const list=await ctx.model.FirstOffice.findAll({transaction:t});
      // console.log(list);
      if(Object.keys(list).length===0){  //判断对象是否为空
        ctx.throw();
      }
      await t.commit();
      return list;   
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  //根据当前一级科室的id获取所有二级科室的信息
  async findSecondOffice(firstOfficeId){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const list= await ctx.model.SecondOffice.findAll({
        where: {
          firstOfficeId: firstOfficeId,
        }
      },{transaction:t});
      if(Object.keys(list).length===0){
        ctx.throw();
      }
      await t.commit();
      return list;
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  //新建一级科室
  async saveFirstOffice(office){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const Office = await ctx.model.FirstOffice.create(office,{transaction:t});
      if(!office){
        ctx.throw();
      }
      await t.commit();
      return Office;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  //新建二级科室，绑定一级科室id
  async saveSecondOffice(office){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const Office = await this.ctx.model.SecondOffice.create(office,{transaction:t});
      if(!office){
        ctx.throw();
      }
      await t.commit();
      return Office;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  //更改一级科室
  async updateFirstOffice(id,office){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const firstOffice=await ctx.model.FirstOffice.findById(id,{transaction:t});
      if(!firstOffice){
        ctx.throw();
      }
      const res=await firstOffice.update(office,{transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }
  
  //更改二级科室
  async updateSecondOffice(id,office){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const secondOffice=await ctx.model.SecondOffice.findById(id,{transaction:t});
      if(!secondOffice){
        ctx.throw();
      }
      const res=await secondOffice.update(office,{transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  //删除一级科室
  async deleteFirstOffice(id){
    const ctx=this.ctx;
    const firstOffice=await ctx.model.FirstOffice.findById(id);
    if(!firstOffice){
      ctx.throw(400,'Delete Failed');
    }
    await ctx.service.office.deleteByFirstOfficeId(id);
    const res=await firstOffice.destroy();
    return res;
  }

  //删除二级科室
  async deleteSecondOffice(id){
    const ctx=this.ctx;
    const secondOffice=await ctx.model.SecondOffice.findById(id);
    if(!secondOffice){
      ctx.throw(400,'Delete Failed');
    }
    await ctx.service.doctor.deleteByOfficeId(id);
    const res=await secondOffice.destroy();
    return res;
  }

  /**
   * 辅助函数：用于根据一级科室id删除相关二级科室信息
   */
  async deleteByFirstOfficeId(id){
    const ctx=this.ctx;
    const offices=await ctx.model.SecondOffice.findAll({
      attributes: ['id'],
      where: {
        firstOfficeId: id,
      }
    });
    for(let obj of offices){
      await ctx.service.office.deleteSecondOffice(obj.id);
    }
  }
}

module.exports = OfficeService;
