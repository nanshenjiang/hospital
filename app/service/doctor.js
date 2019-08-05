'use strict';

const Service = require('egg').Service;

/**
 * 医生service层
 */
class DoctorService extends Service { 

  /**
   * 前端传入的页数
   * page（页数）和pageSize（每一页大小）实现分页功能
   * 读取相应数据
   */
  async queryByPage(secondOfficeId, page = 1, pageSize = 1) {
    const {ctx,app}=this;
    //查询当前总数量
    let totalNum=await ctx.model.Doctor.count();
    //根据页面和需要的数量读取对应的数据
    let result=await ctx.model.Doctor.findAll({
      where: {
        secondOfficeId: secondOfficeId,
      },
      limit: Number(pageSize),    //返回数据量
      offset: ( page - 1 ) * pageSize,  //数据偏移量
      include: {
        model: app.model.WorkInformation
      }
    })
    if(!result){
      this.ctx.throw(404,'Not Found');
    }
    //返回结果及页数
    return {
        result: result,
        totalPages: Math.ceil(totalNum/pageSize),   //总页数
    };
  }

  //web需求：根据二级科室id查询部分医生
  async findBySecondOfficeId(id){
    const {ctx,app}=this;
    const list=await ctx.model.Doctor.findAll({
      where: {
        secondOfficeId: id,
      },
      include: {
        model: app.model.WorkInformation
      }
    })
    if(!list){
      ctx.throw(404,'Not Found');
    }
    let listAll=[];
    for(let obj of list){
      // console.log(item);
      let avatarId=obj.avatarId;
      let file=await ctx.service.file.findById(avatarId);
      let relativePath;
      if(file===null||file===undefined||file===''){
        relativePath=null;
      }else{
        relativePath=file.relativePath;
      }
      // console.log('================================');
      //由于node.js的机制,不可以直接对生成的对象进行操作
      //所以需要先将js对象转换为json字符串
      //再将json字符串转换为json对象，才可以操作
      let str=JSON.stringify(obj);
      let doctorExp=JSON.parse(str);
      // console.log(doctorExp);
      delete doctorExp.avatarId;
      doctorExp.avatarUrl=relativePath;
      listAll.push(doctorExp);
    }
    // console.log(listAll);
    return listAll;
  }

  //根据二级科室查询下存在的医生数量
  async countBySecondOffcieId(id){
    const {ctx}=this;
    const count = await ctx.model.Doctor.count({
      where: {
        secondOfficeId: id,
      }
    })
    return count;
  }

  //安卓需求：根据二级科室查询所有医生数量
  async findBySecondOfficeIdNeedOfAndroid(id){
    const {ctx,app}=this;
    const list=await ctx.model.Doctor.findAll({
      attributes: ['id','name','post','avatarId','title','secondOfficeId'],
      where: {
        secondOfficeId: id,
      },
    })
    if(!list){
      ctx.throw(404,'Not Found');
    }
    let listAll=[];
    for(let obj of list){
      // console.log(item);
      let avatarId=obj.avatarId;
      let file=await ctx.service.file.findById(avatarId);
      let relativePath;
      if(file===null||file===undefined||file===''){
        relativePath=null;
      }else{
        relativePath=file.relativePath;
      }
      console.log('================================');
      //由于node.js的机制,不可以直接对生成的对象进行操作
      //所以需要先将js对象转换为json字符串
      //再将json字符串转换为json对象，才可以操作
      let str=JSON.stringify(obj);
      let doctorExp=JSON.parse(str);
      // console.log(doctorExp);
      delete doctorExp.avatarId;
      doctorExp.avatarUrl=relativePath;
      listAll.push(doctorExp);
    }
    // console.log(listAll);
    return listAll;
  }

  //查询所有医生数据
  async findAll(){
    const {ctx,app}=this;
    const list= await ctx.model.Doctor.findAll({
      include: {
        model: app.model.WorkInformation
      }
    });
    if(!list){
      ctx.throw(404,'Not Found');
    }
    return list;
  }

  /**
   * 通过id查询某个医生具体信息
   * 含有医生七天出诊信息
   */
  async findById(uid){
    const { app , ctx }=this;
    let t;
    try {
      t=await ctx.model.transaction();
      let doctor=await ctx.model.Doctor.findAll({
        where: {
          id: uid,
        },
        include: {
          model: app.model.WorkInformation
        }
      },{transaction:t});
      if(!doctor){
        ctx.throw();
      }
      const avatarId=doctor[0].avatarId;
      let file=await ctx.service.file.findById(avatarId);
      let relativePath;
      if(file===null||file===undefined||file===''){
        relativePath=null;
      }else{
        relativePath=file.relativePath;
      }
      //由于node.js的机制,不可以直接对生成的对象进行操作
      //所以需要先将js对象转换为json字符串
      //再将json字符串转换为json对象，才可以操作
      let str=JSON.stringify(doctor);
      let doctorExp=JSON.parse(str);
      delete doctorExp[0].avatarId;
      doctorExp[0].avatarUrl=relativePath;
      // console.log(doctorExp[0])
      await t.commit();
      return doctorExp;
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  /**
   * 上传医生信息，包含医生关联的二级科室的id
   */
  async saveDoctor(doctor){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const doctorExp=await ctx.model.Doctor.create(doctor,{transaction:t});
      if(!doctorExp){
        ctx.throw();
      }
      await t.commit();
      return doctorExp;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  /**
   * 更新医生信息
   */
  async updateDoctor(id,doctor){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const doctorExp=await ctx.model.Doctor.findById(id,{transaction:t});
      if(!doctorExp){
        ctx.throw();
      }
      const res=await await doctorExp.update(doctor,{transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }

  /**
   * 通过id删除医生信息
   */
  async deleteDoctorById(id){
    const ctx=this.ctx;
    let t;
    try {
      t=await ctx.model.transaction();
      const doctor=await ctx.model.Doctor.findById(id,{transaction:t});
      if(!doctor){
        ctx.throw();
      }
      const res=await doctor.destroy({transaction:t});
      await t.commit();
      return res;
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Delete Failed');
    }
  }
}

module.exports = DoctorService;
