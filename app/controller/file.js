'use strict';

const Controller = require('egg').Controller;
const fs = require('fs')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')

class FileController extends Controller {
    /**
     * 工具类：单个文件上传
     * 存储文件流并创建文件对象
     * 返回：文件存储的相对路径
     */
    async singleFileStream() {
        const { ctx, service, config } = this;
        //从config中获取绝对存储路径的头
        const baseDir = config.baseDir;
        //設置相對路徑
        const url = '/app/upload';
        // 要通过 ctx.getFileStream 便捷的获取到用户上传的文件，需要满足两个条件：
        // 只支持上传一个文件。
        // 上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
        const stream = await ctx.getFileStream()
        // 所有表单字段都能通过 `stream.fields` 获取到
        const filename = path.basename(stream.filename) // 文件名称
        const extname = path.extname(stream.filename).toLowerCase() // 文件扩展名称
        //判断是否存在文件，不存在生产厂文件夹
        if (!fs.existsSync())
            fs.mkdirSync(paht.join(baseDir, url));
        // 组装参数 model
        const fileModel = new ctx.model.File
        fileModel.extname = extname
        fileModel.filename = filename
        fileModel.relativePath = path.join(url, `${filename.id.toString()}${extname}`)
        // 组装参数 stream
        const target = path.join(baseDir, url, `${fileModel.id.toString()}${fileModel.extname}`)
        fileModel.absolutePath = target;
        const writeStream = fs.createWriteStream(target)
        // 文件处理，上传到云存储等等
        try {
            await awaitWriteStream(stream.pipe(writeStream))
        } catch (err) {
            // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            await sendToWormhole(stream)
            ctx.throw('400', 'upload failed！！');
        }
        // 调用 Service 进行业务处理
        const res = await service.file.create(fileModel)
        // 设置响应内容和响应状态码
        ctx.body= res;
    }

    /**
     * 工具类：上传多个文件
     * 上传方式：multipart/form-data
     * 可以实现多文件上传
     * 返回：文件存储的相对路径
     */
    async multpartFile(){
        const {ctx,service,config}=this;
        //从config中获取绝对存储路径的头
        const baseDir=config.baseDir;
        //設置相對路徑
        const url = '/app/upload';
        const parts = ctx.multipart()
        const files = []
        const result=[]
        //判断是否存在文件，不存在生产厂文件夹
        if(!fs.existsSync())
          fs.mkdirSync(paht.join(baseDir,url));
        let part // parts() return a promise
        while ((part = await parts()) != null) {
          if (part.length) {
            // 如果是数组的话是 filed
            // console.log('field: ' + part[0])
            // console.log('value: ' + part[1])
            // console.log('valueTruncated: ' + part[2])
            // console.log('fieldnameTruncated: ' + part[3])
          } else {
            if (!part.filename) {
              // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
              // 需要做出处理，例如给出错误提示消息
              return
            }
            // part 是上传的文件流
            const filename = part.filename.toLowerCase() // 文件名称
            const extname = path.extname(part.filename).toLowerCase() // 文件扩展名称
            
            // 组装参数
            const fileModel = new ctx.model.File
            fileModel.extname = extname
            fileModel.filename = filename
            fileModel.relativePath = path.join(url,`${filename.id.toString()}${extname}`)
            // 组装参数 stream
            const target = path.join(baseDir, url , `${fileModel.id.toString()}${fileModel.extname}`)
            fileModel.absolutePath=target;
            const writeStream = fs.createWriteStream(target)
            let res;
            // 文件处理，上传到云存储等等
            try {
              // result = await ctx.oss.put('egg-multipart-test/' + part.filename, part)
              await awaitWriteStream(part.pipe(writeStream))
              // 调用Service
              res = await service.file.create(attachment)
            } catch (err) {
              // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
              await sendToWormhole(part)
              ctx.throw('400','upload failed！！');
            }
            files.push(`${attachment._id}`) // console.log(result)
            // 调用 Service 进行业务处理
            result.push({
              model: res
            });
          }
        }
        //返回相对路径集
        ctx.body=res;
    }

    /**
     * 工具类：更新文件流
     * 返回：文件存储的相对路径
     */
    async updateFileStream(){
        const {ctx,service,config}=this;
        //从config中获取绝对存储路径的头
        const baseDir=config.baseDir;
        //設置相對路徑
        const url = '/app/upload';
        // 要通过 ctx.getFileStream 便捷的获取到用户上传的文件，需要满足两个条件：
         // 只支持上传一个文件。
         // 上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
         const stream = await ctx.getFileStream() 
         // 所有表单字段都能通过 `stream.fields` 获取到
         const filename = path.basename(stream.filename) // 文件名称
         const extname = path.extname(stream.filename).toLowerCase() // 文件扩展名称
        //判断是否存在文件，不存在生产厂文件夹
        if(!fs.existsSync())
          fs.mkdirSync(paht.join(baseDir,url));
        // 组装参数 model
        const fileModel = {}
        fileModel.id=id;
        fileModel.extname = extname
        fileModel.filename = filename
        fileModel.relativePath = path.join(url,`${filename.id.toString()}${extname}`)
        // 组装参数 stream
        const target = path.join(baseDir, url , `${fileModel.id.toString()}${fileModel.extname}`)
        fileModel.absolutePath=target;
        const writeStream = fs.createWriteStream(target)
        // 文件处理，上传到云存储等等
        try {
          await awaitWriteStream(stream.pipe(writeStream))
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(stream)
          ctx.throw('400','upload failed！！');
        }
        // 调用 Service 进行业务处理
        const res = await service.file.update(fileModel)
        // 设置响应内容和响应状态码
        ctx.body=res;
    }
}

module.exports = FileController;
