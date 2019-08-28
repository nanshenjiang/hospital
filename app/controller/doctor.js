'use strict';
// const fs = require('fs');
// const sendToWormhole = require('stream-wormhole');
// const awaitStreamReady = require('await-stream-ready').write;
const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');

//用于validate验证的自定义参数
const createRule = {
  name: {
    type: 'string',
    max: 30,
    trim: true,
  }
}
//用于validate验证的分页中的参数
const pagination = {
  secondOfficeId: {
    type: 'int',
    required: true,
  },
  page: {
    type: 'int',
    convertType: 'int',
    min: 1,
    default: 1,
    required: false,
  },
  pageSize: {
    type: 'int',
    convertType: 'int',
    default: 1,
    required: false,
  },
};

class DoctorController extends Controller {
  /**
   * 获取医生列表: 使用到了分页规则
   */
  async showPartDoctor() {
    const ctx = this.ctx;
    //对query的参数进行校验
    // ctx.validate(pagination, ctx.request.query);
    const { page, pageSize, secondOfficeId } = ctx.query;
    const res = await ctx.service.doctor.queryByPage(secondOfficeId,page,pageSize);
    res = {
      list: res.result,   //医生列表
      page: page,    //当前页面数
      pageSize: pageSize,   //每一页的数量
      totalPages: res.totalPages,   //总页面数
    };
    ctx.helper.success({ctx,res}); 
  }
  /**
   * 获取部分医生列表: 根据二级科室id
   */
  async showAllDoctor() {
    const ctx = this.ctx;
    //对query的参数进行校验
    // ctx.validate(pagination, ctx.request.query);
    const { id } = ctx.params;
    const res = await ctx.service.doctor.findBySecondOfficeId(id);
    ctx.helper.success({ctx,res}); 
  }
  /**
   * 获取具体医生信息
   */
  async showOne() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res=await ctx.service.doctor.findById(id);
    ctx.helper.success({ctx,res}); 
  }
  /**
   * 新建医生信息
   * 设置默认头像
   */
  async create() {
    const { ctx ,config} = this;
    // ctx.validate(createRule, ctx.request.body);
    const doctor = ctx.request.body || {};
    //复制默认文件夹中的医生头像设置为默认初始化头像
    //初始化头像存放路径
    const oldpath=path.join(config.baseDir,'app/public/origin','doctor2.jpg');
    const url='app/public/image/doctor/face';
    //判断是否存在文件，不存在生产厂文件夹
    const filepath=path.join(config.baseDir, url);
    //递归生成
    fs.mkdir(filepath, { recursive: true }, (err) => {
        if (err) throw err;
    });
    const filename=Date.now() + Number.parseInt(Math.random() * 10000)+'.jpg';
    const newpath=path.join(url,filename);
    //doctor存入相对路径
    doctor.avatarUrl=path.join('/public/image/doctor/face',filename);
    //复制
    try{
      fs.createReadStream(oldpath).pipe(fs.createWriteStream(newpath));
    }catch(e){
      ctx.throw(400,'Upload Failed');
    }
    const res =await ctx.service.doctor.saveDoctor(doctor);
    // const res=await ctx.service.doctor.findById(doctorExp.id);
    ctx.helper.success({ctx,res});
  }
  /**
   * 更新医生信息
   */
  async update() {
    const { ctx } = this;
    // ctx.validate(createRule, ctx.request.body);
    const {id}=ctx.params;
    const doctor = ctx.request.body || {};
    const doctorExp=await ctx.service.doctor.updateDoctor(id,doctor);
    const res=await ctx.service.doctor.findById(doctorExp.id);
    ctx.helper.success({ctx,res});
  }
  /**
   * 删除医生信息
   */
  async delete() {
    const {ctx} =this;
    const {id}=ctx.params;
    await ctx.service.doctor.deleteDoctorById(id);
    ctx.helper.success({ctx});
  }
  /**
   * 上传头像
   */
  async uploadAvatar() {   
    const {ctx,service,config}=this;
    const {id}=ctx.params;
    let relativePath;
    //获取用户输入的上传流
    const file=ctx.request.files[0];
    //判断是否有文件流，有就进行操作
    if(file!==undefined&&file!==null){
      //文件流操作
      //获取绝对路径的一部分
      const baseDir=config.baseDir;
      //设置相对路径的一部分
      const url = '/public/image/doctor/face';
      // 文件扩展名称
      const extname = path.extname(file.filename).toLowerCase();
      //判断是否为图片格式
      if(extname !== '.jpg' && extname !== '.png' && extname !== '.gif' && extname!=='.jpeg') {
        ctx.throw(400,'上传的图片格式不支持!');
      }
      //判断是否存在文件，不存在生成文件夹
      const filepath=path.join(baseDir,'app',url);
      //递归生成
      fs.mkdir(filepath, { recursive: true }, (err) => {
          if (err) throw err;
      });
      // 生成文件名 ( 时间 + 10000以内的随机数 )
      const filename=Date.now() + Number.parseInt(Math.random() * 10000);
      // 相对路径
      relativePath = path.join(url, `${filename}${extname}`)  //相对路径
      // 组装参数（用于生成文件）
      const targetPath = path.join(baseDir ,'app', url , `${filename}${extname}`);   //绝对路径
      const target = fs.createWriteStream(targetPath);
      const source=fs.createReadStream(file.filepath);
      // 文件处理，上传到云存储等等
      try {
        await pump(source, target);
      }finally{
        // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
        await ctx.cleanupRequestFiles();
      }
    }else{
      ctx.throw(400,'请先点击图片再进行上传')
    }
    //更新医生中的头像关联
    const res=await service.doctor.updateDoctor(id,{avatarUrl: relativePath},true); 
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res});
  }
}
module.exports = DoctorController;