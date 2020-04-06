'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');

/**
 * 定制祝福页功能
 */
class BenedictionController extends Controller {
  /**
   * 获取祝福内容
   */
  async showAllBenediction() {
    const ctx = this.ctx;
    const res = await ctx.service.benediction.findAll();
    ctx.helper.success({ctx,res}); 
  }

  /**
   * 新增祝福信息
   */
  async create() {
    const {ctx,service,config}=this;
    //获取前端传入的json数据
    const msg=ctx.request.body||{};
    let res;
    //获取用户输入的上传流
    const file=ctx.request.files[0];
    //判断是否有文件流，有就进行操作
    if(file!==undefined&&file!==null){
      //文件流操作
      //获取绝对路径的一部分
      let baseDir=config.baseDir;
      //设置相对路径的一部分
      let url = '/public/image/bootup/bless';
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
      const exp={
        blessWord: msg.blessWord,
        hospitalName: msg.hospitalName,
        backgroundUrl: relativePath
      }
      res=await service.benediction.create(exp);
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
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res});
  }

  /**
   * 更新祝福信息
   */
  async update(){
    const {ctx,config}=this;
    const {id}=ctx.params;
    const msg=ctx.request.body || {};
    //获取用户输入的上传流
    const file=ctx.request.files[0];
    let res;
    //判断是否有文件流，有就进行操作
    if(file!==undefined&&file!==null){
      //文件流操作
      //获取绝对路径的一部分
      const baseDir=config.baseDir;
      //设置相对路径的一部分
      const url = '/public/image/bootup/bless';
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
      //组装参数
      const obj={
          id: id,
          blessWord: msg.blessWord,
          hospitalName: msg.hospitalName,
          backgroundUrl: relativePath
      }
      //更新数据库
      res=await ctx.service.benediction.update(id,obj,true);
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
      //无图片
      //更新数据库
      res=await ctx.service.benediction.update(id,msg);
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res});
  }

  /**
   * 删除祝福信息
   */
  async delete(){
    const {ctx} =this;
    const {id}=ctx.params;
    await ctx.service.benediction.delete(id);
    ctx.helper.success({ctx});
  }
}

module.exports = BenedictionController;
