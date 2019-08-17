'use strict';

const Controller = require('egg').Controller;
const path = require('path');
// const fs = require('fs');
const fs = require('mz/fs');
const sendToWormhole = require('stream-wormhole');
const awaitStreamReady = require('await-stream-ready').write;

/**
 * 医院信息的controller类
 */
class IntroductionController extends Controller {

  /**
   * 保存医院信息
   * 除了医院简略介绍和详细信息外，还要上传图片
   */
  async save() {
    const {ctx,service,config}=this;
    //获取用户输入的上传流
    const file=await ctx.getFileStream();
    console.log("====================")
    console.log(file);    //流数据
    console.log(file.fields);   //json数据
    //获取上传的json数据
    const hospitalmsg=file.fields;

    //文件流操作
    //获取绝对路径的一部分
    const baseDir=config.baseDir;
    //设置相对路径的一部分
    const url = 'app/public/image/hosptial/message';
    // 文件扩展名称
    const extname = path.extname(file.filename).toLowerCase() 
    //判断是否为图片格式
    if(extname !== '.jpg' && extname !== '.png' && extname !== '.gif' && extname!=='.jpeg') {
      ctx.throw(400,'上传的图片格式不支持!');
    }

    //判断是否存在文件，不存在生成文件夹
    const filepath=path.join(baseDir, url);
    //递归生成
    fs.mkdir(filepath, { recursive: true }, (err) => {
        if (err) throw err;
    });
    // 生成文件名 ( 时间 + 10000以内的随机数 )
    const filename=Date.now() + Number.parseInt(Math.random() * 10000);
    // 组装参数 model
    let hospital = {
      message: hospitalmsg.message,
      description: hospitalmsg.description,
    }
    const relativePath = path.join('/public/image/hosptial/message', `${filename}${extname}`)  //相对路径
    //设置hospital的相对路径
    hospital.avatarUrl=relativePath;
    // 组装参数（用于生成文件）
    const target = path.join(baseDir , url , `${filename}${extname}`);   //绝对路径
    const writeStream = fs.createWriteStream(target)
    // 文件处理，上传到云存储等等
    try {
        await awaitStreamReady(file.pipe(writeStream))
    } catch (err) {
        // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
        await sendToWormhole(file)
        // ctx.throw(400, 'upload failed！！');
    }
    //搜索最新医生信息
    const res=await service.introduction.save(hospital);
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res});
  }

  /**
   * 更新医院信息
   */
  async update(){
    const ctx = this.ctx;
    const parts = ctx.multipart();
    let part;
    // parts() 返回 promise 对象
    while ((part = await parts()) != null) {
      if (part.length) {
        // 这是 busboy 的字段
        console.log('field: ' + part[0]);
        console.log('value: ' + part[1]);
        console.log('valueTruncated: ' + part[2]);
        console.log('fieldnameTruncated: ' + part[3]);
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }
        // part 是上传的文件流
        console.log('field: ' + part.fieldname);
        console.log('filename: ' + part.filename);
        console.log('encoding: ' + part.encoding);
        console.log('mime: ' + part.mime);
        // 文件处理，上传到云存储等等
        let result;
        try {
          result = await ctx.oss.put('egg-multipart-test/' + part.filename, part);
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          throw err;
        }
        console.log(result);
      }
    }
  }
}

module.exports = IntroductionController;
