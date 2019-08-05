'use strict';
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const awaitStreamReady = require('await-stream-ready').write;
const Controller = require('egg').Controller;

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
   */
  async create() {
    const { ctx } = this;
    // ctx.validate(createRule, ctx.request.body);
    const doctor = ctx.request.body || {};
    console.log("==================");
    console.log(doctor);
    const doctorExp =await ctx.service.doctor.saveDoctor(doctor);
    const res=await ctx.service.doctor.findById(doctorExp.id);
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
    const { ctx, service, config } = this;
    //获取要上传头像的医生的id
    const {id}=ctx.params;
    //获取绝对路径的一部分
    const baseDir=config.baseDir;
    //设置相对路径的一部分
    const url = 'app/public/image/doctor/face';
    // 要通过 ctx.getFileStream 便捷的获取到用户上传的文件，需要满足两个条件：
    //   1.只支持上传一个文件。
    //   2.上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
    const stream = await ctx.getFileStream()
    // 所有表单字段都能通过 `stream.fields` 获取到
    // 文件扩展名称
    const extname = path.extname(stream.filename).toLowerCase() 
    //判断是否为图片格式
    if(extname !== '.jpg' && extname !== '.png' && extname !== '.gif' && extname!=='.jpeg') {
      ctx.throw(400,'头像支持的图片格式为 .jpg .gif .png!');
    }

    //判断是否存在文件，不存在生产厂文件夹
    const filepath=path.join(baseDir, url);
    //递归生成
    fs.mkdir(filepath, { recursive: true }, (err) => {
        if (err) throw err;
    });
    // 生成文件名 ( 时间 + 10000以内的随机数 )
    const filename=Date.now() + Number.parseInt(Math.random() * 10000);
    // 组装参数 model
    let fileModel = {}
    fileModel.extname = extname;
    fileModel.filename = filename+extname;
    fileModel.relativePath = path.join('/public/image/doctor/face', `${filename}${extname}`)  //相对路径
    console.log('===========================');
    // 组装参数 stream
    const target = path.join(baseDir , url , `${filename}${extname}`);   //绝对路径
    fileModel.absolutePath = target;
    const writeStream = fs.createWriteStream(target)
    // 文件处理，上传到云存储等等
    try {
        await awaitStreamReady(stream.pipe(writeStream))
    } catch (err) {
        // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
        await sendToWormhole(stream)
        ctx.throw(400, 'upload failed！！');
    }
    // 调用 Service 进行业务处理
    const file = await service.file.create(fileModel);
    //更新医生中的头像关联
    const doctorExp=await ctx.service.doctor.updateDoctor(id , {avatarId: file.id});
    
    //搜索最新医生信息
    const res=await ctx.service.doctor.findById(doctorExp.id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res});
  }
}
module.exports = DoctorController;