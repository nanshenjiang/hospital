'use strict';

const Service = require('egg').Service;

/**
 * 医院介绍类的service层
 */
class IntroductionService extends Service {
  //查找全部信息
  async findAll() {
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();  //事务操作
      const list=await ctx.model.Introduction.findAll({transaction:t});
      if(!Object.getOwnPropertyNames(list).length){  //判断对象是否为空
        ctx.throw();
      }
      await t.commit();
      return list;   
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  //根据id查询某个医院介绍
  async findById(id){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();  //事务操作
      const obj=await ctx.model.Introduction.findById(id,{transaction:t})
      if(!obj){  
        ctx.throw();
      }
      await t.commit();
      return obj;   
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  //上传
  async save(obj){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const intro=await ctx.model.Introduction.create(obj,{transaction:t});
      if(!intro){
        ctx.throw();
      }
      await t.commit();
      return intro;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  //更新
  async update(id,obj){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const intro=await ctx.model.Introduction.findById(id,{transaction:t});
      if(!intro){
        ctx.throw();
      }
      const res=await await intro.update(obj,{transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }
  
  //删除
  async delete(id){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const intro=await ctx.model.Introduction.findById(id,{transaction:t});
      if(!intro){
        ctx.throw();
      }
      const res=await intro.destroy({transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Delete Failed');
    }
  }
}

module.exports = IntroductionService;
