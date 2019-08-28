'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');

/**
 * 医院介绍类的service层
 */
class IntroductionService extends Service {
  //查找全部信息
  async findAll() {
    const {app,ctx}=this;
    let t;
    try {
      t=await ctx.model.transaction();  //事务操作
      const list=await ctx.model.Introduction.findAll({
        include: {
          model: app.model.IntroducePhoto
        }
      },{transaction:t});
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

  //在查找全部信息的基础上
  //查找数量
  async findAllByAndroid(){
    const {app,ctx}=this;
    let t;
    try {
      t=await ctx.model.transaction();  //事务操作
      const list=await ctx.model.Introduction.findAndCountAll({
        include: {
          model: app.model.IntroducePhoto
        }
      },{transaction:t});
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
  async findOne(id){
    const {ctx,app}=this;
    let t;
    try {
      t=await ctx.model.transaction();  
      console.log(id);
      const obj=await ctx.model.Introduction.findById(id,{
        include: {
          model: app.model.IntroducePhoto
        }
      },{transaction:t})
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

  //上传医院介绍
  async saveIntroduction(obj){
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

  //上传医院介绍的图片
  async savePhoto(id,photoUrl){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const photo=await ctx.model.IntroducePhoto.create({
        introductionId: id,
        photoUrl,
      },{transaction:t});
      if(!photo){
        ctx.throw();
      }
      await t.commit();
      return photo;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  //更新医院介绍信息
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
  
  //删除医院介绍信息
  //及以下所属图片
  async deleteIntroduction(id){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const intro=await ctx.model.Introduction.findById(id,{transaction:t});
      if(!intro){
        ctx.throw();
      }
      //删除所有所属图片
      const photoes=await ctx.model.IntroducePhoto.findAll({
        where: {
          introductionId: id,
        }
      },{transaction:t})
      for(let obj of photoes){
        const pathUrl=path.join(this.config.baseDir,'app',obj.photoUrl);
        fs.unlinkSync(pathUrl);
        await obj.destroy({transaction:t});
      }
      const res=await intro.destroy({transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Delete Failed');
    }
  }

  //删除图片
  async deletePhoto(id){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const photo=await ctx.model.IntroducePhoto.findById(id,{transaction:t});
      if(!photo){
        ctx.throw();
      }
      const pathUrl=path.join(this.config.baseDir,'app',photo.photoUrl);
      fs.unlinkSync(pathUrl);
      const res=await photo.destroy({transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Delete Failed');
    }
  }
}

module.exports = IntroductionService;
