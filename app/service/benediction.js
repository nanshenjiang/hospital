'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');

/**
 * 定制祝福信息功能：
 * 
 */
class BenedictionService extends Service { 
  /**
   * 查询所有祝福信息
   */
  async findAll(){
    const {ctx}=this;
    let t;
    try {
      t=await ctx.model.transaction();
      const list=await ctx.model.Benediction.findAll({transaction:t})
      await t.commit();
      return list;
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found')
    }
  }

  /**
   * 新建祝福信息功能
   */
  async create(obj){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const all=await ctx.model.Benediction.findAll({transaction:t});
      if(Object.keys(all).length!==0){
        ctx.throw();
      }
      const exp=await ctx.model.Benediction.create(obj,{transaction:t});
      if(!exp){
        ctx.throw();
      } 
      await t.commit();
      return exp;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  /**
   * 更新祝福信息
   * 同时将图片删除
   */
  async update(id,obj,flag=false){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const exp=await ctx.model.Benediction.findById(id,{transaction:t});
      if(!exp){
        ctx.throw();
      }
      //如果要修改图片就要删除旧图片
      if(flag){
        //删除原本的旧图片
        const oldpath=path.join(this.config.baseDir,'app',exp.backgroundUrl);
        fs.unlinkSync(oldpath);
      }
      //更新信息
      const res=await exp.update(obj,{transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  /**
   * 通过id删除祝福信息 
   * 同时删除图片
   */
  async delete(id){
    const ctx=this.ctx;
    const exp=await ctx.model.Benediction.findById(id);
    if(!exp){
      ctx.throw(400,'Delete Failed');
    }
    //删除图片
    const oldpath=path.join(this.config.baseDir,'app',exp.backgroundUrl);
    fs.unlinkSync(oldpath);
    const res=await exp.destroy();
    return res;
  }
  
}

module.exports = BenedictionService;