'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');

/**
 * 医院导航类
 * 包括医院建筑和医院楼层的所有service层均存放在此处
 */
class BuildingService extends Service {

    //查询所有医院建筑信息
    async findAllBuildings() {
      const {ctx}=this;
      let t;
      try {
        t=await ctx.model.transaction();
        const list= await ctx.model.Building.findAll({transaction:t});
        if(!Object.getOwnPropertyNames(list).length){
          ctx.throw();
        }
        await t.commit()
        return list;
      }catch(e){
        await t.rollback()
        ctx.throw(404,'Not Found');
      }
    }

    //在查找全部信息的基础上
    //查找数量
    async findAllBuildingsByAndroid(){
      const {ctx}=this;
      let t;
      try {
        t=await ctx.model.transaction();
        const list= await ctx.model.Building.findAndCountAll({transaction:t});
        if(!Object.getOwnPropertyNames(list).length){
          ctx.throw();
        }
        await t.commit()
        return list;
      }catch(e){
        await t.rollback()
        ctx.throw(404,'Not Found');
      }
    }

    //查询某个具体医院建筑信息及其楼层信息
    async findOneBuildingById(uid){
        const { app , ctx }=this;
        let t;
        try {
          t=await ctx.model.transaction();
          let building=await ctx.model.Building.findAll({
            where: {
              id: uid,
            },
            include: {
              model: app.model.Floor
            }
          },{transaction:t});
          if(!building){
            ctx.throw();
          }
          await t.commit();
          return building;
        }catch(e){
          await t.rollback();
          ctx.throw(404,'Not Found');
        }
    }

    //查询某个具体医院建筑信息及其楼层信息
    async findOneFloorById(id){
      const { ctx }=this;
      let t;
      try {
        t=await ctx.model.transaction();
        let floor=await ctx.model.Floor.findByPk(id,{transaction:t});
        if(!floor){
          ctx.throw();
        }
        await t.commit();
        return floor;
      }catch(e){
        await t.rollback();
        ctx.throw(404,'Not Found');
      }
    }

    //保存医院建筑信息 
    async saveBuilding(building){
        const ctx=this.ctx;
        let t;
        try {
          t=await ctx.model.transaction();
          const res=await ctx.model.Building.create(building,{transaction:t});
          if(!res){
            ctx.throw();
          }
          await t.commit();
          return res;
        }catch(e){
          await t.rollback();
          ctx.throw(400,'Update Failed');
        }
    }

    //更新某个医院建筑信息
    async updateBuilding(id,building){
        const ctx=this.ctx;
        let t;
        try {
          t=await ctx.model.transaction();
          const buildingExp=await ctx.model.Building.findByPk(id,{transaction:t});
          if(!buildingExp){
            ctx.throw();
          }
          //图片地址存在则要删除
          if(buildingExp.photoUrl!==""&&buildingExp.photoUrl!==null&&buildingExp.photoUrl!==undefined){
            //同时要有更新文件
            if(building.photoUrl!==undefined&&building.photoUrl!=null){
              //删除原本的旧图片
              const oldpath=path.join(this.config.baseDir,'app',buildingExp.photoUrl);
              fs.unlinkSync(oldpath);
            }
          }
          //更新信息
          const res=await buildingExp.update(building,{transaction:t});
          await t.commit();
          return res;
        }catch(e){
          await t.rollback();
          ctx.throw(400,'Update Failed');
        }
    }
    
    /**
     *  删除某个医院建筑信息
     *  及其所有楼层信息
     */
    async deleteBuilding(id){
        const {ctx,app}=this;
        let t;
        try{
          t=await ctx.model.transaction();
          const building=await ctx.model.Building.findById(id,{
            include: {
              model: app.model.Floor
            }
          },{transaction:t});
          if(!building){
            ctx.throw(400,'Delete Failed');
          }
          //如果是医院总览图，则无法删除
          if(building.isMain){
            ctx.throw(400,'医院总览图无法删除');
          }
          //删除图片
          if(building.photoUrl!==""&&building.photoUrl!==null&&building.photoUrl!==undefined){
            const oldpath=path.join(this.config.baseDir,'app',building.photoUrl);
            fs.unlinkSync(oldpath);
          }
          //删除所有楼层(同时也要删除相关的图片数据，如果单纯使用自带删除无法删除图片)
          for(let obj of building.floors){
            console.log("-----");
            //删除图片
            if(obj.photoUrl!==""&&obj.photoUrl!==null&&obj.photoUrl!==undefined){
              const oldpath=path.join(this.config.baseDir,'app',obj.photoUrl);
              fs.unlinkSync(oldpath);
            }
            await obj.destroy({transaction:t});
          }
          const res=await building.destroy({transaction:t});
          await t.commit();
          return res;
       }catch(e){
          await t.rollback();
          ctx.throw(400,e.message);
       }
    }

    //查找某栋楼的所有楼层信息信息
    async findAllFloors(id) {
      const {ctx}=this;
      let t;
      try {
        t=await ctx.model.transaction();
        const list= await ctx.model.Floor.findAll({
          where :{
            buildingId: id,
          },
          order: [
            ['name','ASC']
          ],
        },{transaction:t});
        if(!Object.getOwnPropertyNames(list).length){
          ctx.throw();
        }
        await t.commit();
        return list;
      }catch(e){
        await t.rollback()
        ctx.throw(404,'Not Found');
      }
    }

    //保存楼层信息
    async saveFloor(floor){
      const ctx=this.ctx;
      let t;
      try {
        t=await ctx.model.transaction();
        const res=await ctx.model.Floor.create(floor,{transaction:t});
        if(!res){
          ctx.throw();
        }
        await t.commit();
        return res;
      }catch(e){
        await t.rollback();
        ctx.throw(400,'Update Failed');
      }
    }

    //修改楼层信息
    async updateFloor(id,floor){
      const ctx=this.ctx;
      let t;
      try {
        t=await ctx.model.transaction();
        console.log(id);
        const floorExp=await ctx.model.Floor.findByPk(id,{transaction:t});
        if(!floorExp){
          ctx.throw();
        }
        //图片地址若存在则要删除
        if(floorExp.photoUrl!==""&&floorExp.photoUrl!==null&&floorExp.photoUrl!==undefined){
          //如果存在更新文件
          if(floor.photoUrl!==undefined&&floor.photoUrl!=null){
            //删除原本的旧图片
            const oldpath=path.join(this.config.baseDir,'app',floorExp.photoUrl);
            fs.unlinkSync(oldpath);
          }
        }
        //更新信息
        const res=await floorExp.update(floor,{transaction:t});
        await t.commit();
        return res;
      }catch(e){
        await t.rollback();
        ctx.throw(400,'Update Failed');
      }
    } 

    //删除楼层信息
    async deleteFloor(id){
      const ctx=this.ctx;
      let t;
      try {
        t=await ctx.model.transaction();
        const floor=await ctx.model.Floor.findById(id,{transaction:t});
        if(!floor){
          ctx.throw(400,'Delete Failed');
        }
        //删除图片
        if(floor.photoUrl!==""&&floor.photoUrl!==null&&floor.photoUrl!==undefined){
          const oldpath=path.join(this.config.baseDir,'app',floor.photoUrl);
          fs.unlinkSync(oldpath);
        }
        const res=await floor.destroy({transaction:t});
        await t.commit();
        return res;
      }catch(e){
        await t.rollback();
        ctx.throw(400,'Delete Failed');
      }
    }
}

module.exports = BuildingService;