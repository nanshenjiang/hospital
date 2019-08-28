'use strict';

const Controller = require('egg').Controller;
// const fs = require('fs');
// const sendToWormhole = require('stream-wormhole');
// const awaitStreamReady = require('await-stream-ready').write;
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');

/**
 * 医院信息的controller类
 */
class IntroductionController extends Controller {

  /**
   * 查找所有医院信息
   */
  async findAll(){
    const {ctx,service}=this;
    const res=await service.introduction.findAll();
    ctx.helper.success({ctx,res});
  }

  /**
   *查找某个医院信息 
   */
  async findOne(){
    const {ctx,service} = this;
    const { id } = ctx.params;
    const res = await service.introduction.findOne(id);
    ctx.helper.success({ctx,res});
  }

  /**
   * 保存医院信息
   * 除了医院简略介绍和详细信息外，还要上传图片
   */
  async save() {
    const {ctx,service,config}=this;
    //获取前端传入的json数据
    const msg=ctx.request.body;
    const introduction=await service.introduction.saveIntroduction(msg);
    //获取用户输入的上传流
    for(let file of ctx.request.files){
      //文件流操作
      //获取绝对路径的一部分
      let baseDir=config.baseDir;
      //设置相对路径的一部分
      let url = '/public/image/hosptial/message';
      // 文件扩展名称
      let extname = path.extname(file.filename).toLowerCase();
      //判断是否为图片格式
      if(extname !== '.jpg' && extname !== '.png' && extname !== '.gif' && extname!=='.jpeg') {
        ctx.throw(400,'上传的图片格式不支持!');
      }
      //判断是否存在文件，不存在生成文件夹
      let filepath=path.join(baseDir,'app',url);
      //递归生成
      fs.mkdir(filepath, { recursive: true }, (err) => {
          if (err) throw err;
      });
      // 生成文件名 ( 时间 + 10000以内的随机数 )
      let filename=Date.now() + Number.parseInt(Math.random() * 10000);
      // 组装参数 model
      let relativePath = path.join(url, `${filename}${extname}`)  //相对路径
      //设置相对路径
      // 组装参数（用于生成文件）
      let targetPath = path.join(baseDir ,'app', url , `${filename}${extname}`);   //绝对路径
      let target = fs.createWriteStream(targetPath);
      let source=fs.createReadStream(file.filepath);
      // 文件处理，上传到云存储等等
      try {
        await pump(source, target);
      }finally{
        // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
        // await ctx.cleanupRequestFiles();
        await fs.unlink(file.filepath);
      }
      await service.introduction.savePhoto(introduction.id,relativePath);
    }
    const res=await    service.introduction.findOne(introduction.id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res});
  }

  /**
   * 更新医院信息
   * 仅更新医院信息部分
   */
  async update(){
    const {ctx,service}=this;
    const {id}=ctx.params;
    //获取前端传入的json数据
    const msg=ctx.request.body;
    await service.introduction.update(id,msg);
    const res=await service.introduction.findOne(id);
    ctx.helper.success({ctx,res});
  }

  /**
   * 删除医院信息
   */
  async deleteIntroduction(){
    const {ctx,service}=this;
    const {id}=ctx.params;
    await service.introduction.deleteIntroduction(id);
    ctx.helper.success({ctx});
  }

  /**
   * 新增图片
   */
  async savePhoto(){
    const {ctx,service,config}=this;
    const {id}=ctx.params;
    //获取用户输入的上传流
    const file=ctx.request.files[0];
    //判断是否有文件流，有就进行操作
    if(file!==undefined&&file!==null){
      //文件流操作
      //获取绝对路径的一部分
      const baseDir=config.baseDir;
      //设置相对路径的一部分
      const url = '/public/image/hosptial/message';
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
      const relativePath = path.join(url, `${filename}${extname}`)  //相对路径
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
        //更新至数据库
        await service.introduction.savePhoto(id,relativePath);
      }
    }else{
      ctx.throw(400,'请先点击图片再进行上传')
    }
    //更新医生中的头像关联
    const res=await service.introduction.findOne(id); 
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res});
  }

  /**
   * 删除图片
   */
  async deletePhoto(){
    const {ctx,service}=this;
    const {id}=ctx.params;
    await service.introduction.deletePhoto(id);
    ctx.helper.success({ctx});
  }
}

module.exports = IntroductionController;
