'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');

/**
 * 自定义开机视频功能
 * 不需要service层，直接在controller层进行逻辑编写
 */
class BootUpVideoController extends Controller {
  
  /**
   * 查询开机视频:开机视频只有一个
   */
  async getOne() {
    const {ctx}=this;
    let t;
    try {
      t=await ctx.model.transaction();
      const res=await ctx.model.BootUpVideo.findAll({
        attributes: ['id','videoUrl'],  
      },{transaction:t})
      await t.commit();
      ctx.helper.success({ctx,res});      
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  /**
   * 更新开机视频
   */
  async update(){
    const {ctx,config}=this;
    const {id}=ctx.params;
    let relativePath;  //视频的相对路径
    //获取用户输入的上传流
    const file=ctx.request.files[0];
    //判断是否有文件流，有就进行操作
    if(file!==undefined&&file!==null){
      //文件流操作
      //获取绝对路径的一部分
      const baseDir=config.baseDir;
      //设置相对路径的一部分
      const url = '/public/video/bootup/';
      // 文件扩展名称
      const extname = path.extname(file.filename).toLowerCase();
      //判断是否为图片格式
      if(extname !== '.mp4' && extname !== '.avi') {
        ctx.throw(400,'上传的视频格式不支持!请上传mp4或avi格式视频！');
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
      ctx.throw(400,'请先点击视频再进行上传')
    }
    //更新数据库中的视频
    //删除旧视频
    let t;
    try {
      t=await ctx.model.transaction();
      const bootup=await ctx.model.BootUpVideo.findById(id,{transaction:t});
      if(!bootup){
        ctx.throw();
      }
      //删除原本的旧视频
      const oldpath=path.join(this.config.baseDir,'app',bootup.videoUrl);
      fs.unlinkSync(oldpath);
      //更新新视频的相对路径
      const video=await bootup.update({videoUrl:relativePath},{transaction:t});
      const res={
        id: video.id,
        videoUrl: video.videoUrl,
      }
      await t.commit();
      // 设置响应内容和响应状态码
      ctx.helper.success({ctx,res});
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Update Failed');
    }
  }
}

module.exports = BootUpVideoController;
