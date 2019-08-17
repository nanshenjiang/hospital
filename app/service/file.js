'use strict';

const Service = require('egg').Service;
const fs = require('fs')
const path = require('path')

/**
 * 文件流service层
 */
class FileService extends Service {

  //通过id查询文件流
  async findById(id){
    const {ctx}=this;
    const file=await ctx.model.File.findById(id);
    // if(!file) {   //暂时注释，不然在查询文件流不存在时程序无法运行
    //   ctx.throw(404, 'Not Found')
    // }
    return file;
  }

  //新建文件流
  async create(file) {
    const {ctx}=this;
    // console.log(file);
    const File = await ctx.model.File.create(file);
    if(!File){
      ctx.throw(404, 'Update Failed');
    }
    return File;
  }

  //更新文件流
  async update(file){
    const {ctx}=this;
    const fileModel=await ctx.model.File.findById(file.id);
    if(!fileModel){
        ctx.throw(404, 'Update Failed')
    }else{
      //删除原本的文件
      fs.unlinkSync(fileModel.absolutePath);
    }
    return await fileModel.update(file);
  }

  //删除文件流，需要文件id，及存储的部分路径
  async delete(id){
    const { ctx } = this
    const file = await ctx.model.File.findById(id)
    if (!file) {
      // ctx.throw(404, 'Delete Failed')
    }else{
      const target = file.absolutePath;
      //fs操作，根据路径删除文件
      fs.unlinkSync(target)
    }
    await file.destroy();
  }
}

module.exports = FileService;
