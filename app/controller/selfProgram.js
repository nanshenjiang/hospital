'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');

/**
 * 自办节目功能
 * 无service层，直接在controller完成
 */
class SelfProgramController extends Controller {
  
  /**
   * 查询全部节目
   */
  async getAll() {
    const {ctx}=this;
    let t;
    try {
      t=await ctx.model.transaction();
      const res=await ctx.model.SelfProgram.findAll({
        attributes: ['id','name','videoUrl'],  
      },{transaction:t})
      await t.commit();
      ctx.helper.success({ctx,res});      
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

   /**
   * 通过id查询某个节目
   */
  async getOne() {
    const {ctx}=this;
    const {id}=ctx.params;
    let t;
    try {
      t=await ctx.model.transaction();
      const res=await ctx.model.SelfProgram.findById(id,{
        attributes: ['id','name','videoUrl'],  
      },{transaction:t})
      await t.commit();
      ctx.helper.success({ctx,res});      
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  /**
   * 新增自办节目
   */
  async save(){
    const {ctx,config}=this;
    const msg = ctx.request.body || {};   //获取节目名

    let relativePath;  //视频的相对路径
    //获取用户输入的上传流
    const file=ctx.request.files[0];
    //判断是否有文件流，有就进行操作
    if(file!==undefined&&file!==null){
      //文件流操作
      //获取绝对路径的一部分
      const baseDir=config.baseDir;
      //设置相对路径的一部分
      const url = '/public/video/program/';
      // 文件扩展名称
      const extname = path.extname(file.filename).toLowerCase();
      //判断是否为视频格式
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

      //先添加进数据库
      let t,ans;
      try {
        t=await ctx.model.transaction();
        //新增视频信息
        const video={
            name: msg.name,
            videoUrl: relativePath,
        };
        ans=await ctx.model.SelfProgram.create(video,{transaction:t});
        if(!ans){
            ctx.throw();
        }
        await t.commit();
      }catch(e){
        await t.rollback();
        ctx.throw(400,'Updated Failed');
      }

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
      const res={  //重新封装
        id: ans.id,
        name: ans.name,
        videoUrl: ans.videoUrl
      }
      // 设置响应内容和响应状态码
      ctx.helper.success({ctx,res});
    }else{
      ctx.throw(400,'请先点击视频再进行上传')
    }
  }

  /**
   * 删除旧视频
   */
  async delete(){
    const {ctx}=this;
    const {id}=ctx.params;
    //查找数据库相对路径
    //删除旧视频
    let t;
    try {
      t=await ctx.model.transaction();
      const program=await ctx.model.SelfProgram.findById(id,{transaction:t});
      if(!program){
        ctx.throw();
      }
      //删除原本的旧视频
      const oldpath=path.join(this.config.baseDir,'app',program.videoUrl);
      fs.unlinkSync(oldpath);
      //删除数据库信息
      await program.destroy({transaction:t});
      await t.commit();
      // 响应
      ctx.helper.success({ctx});
    }catch(e){
      await t.rollback();
      ctx.throw(400,'Delete Failed');
    } 
  }

}

module.exports = SelfProgramController;
