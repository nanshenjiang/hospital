'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');

class BuildingController extends Controller {
  /**
   * 查询所有医院建筑信息
   */
  async findAllBuildings() {
    const {ctx,service}=this;
    const res=await service.building.findAllBuildings();
    ctx.helper.success({ctx,res});
  }

  /**
   * 根据id查询某个具体医院建筑信息
   */
  async findOneBuilding(){
    const {ctx,service} = this;
    const { id } = ctx.params;
    const res = await service.building.findOneBuildingById(id);
    ctx.helper.success({ctx,res});
  }

  /**
   * 保存某个具体医院建筑信息
   */
  async saveBuilding(){
    const {ctx,service,config}=this;
    //获取用户输入的上传流
    const file=ctx.request.files[0];
    //设置参数
    let building={};
    //判断是否有文件流，有就进行操作
    if(file!==undefined&&file!==null){
      //文件流操作
      //获取绝对路径的一部分
      const baseDir=config.baseDir;
      //设置相对路径的一部分
      const url = '/public/image/hosptial/building';
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
      // 组装参数 model
      const relativePath = path.join(url, `${filename}${extname}`)  //相对路径
      //设置相对路径
      building.photoUrl=relativePath;
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
    }
    //获取前端传入的json数据
    const buildingmsg=ctx.request.body;
    building.name=buildingmsg.name;
    const res=await service.building.saveBuilding(building);
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res});
  }

  /**
   * 更新某个医院建筑的信息
   */
  async updateBuilding(){
      const {ctx,service,config}=this;
      const {id}=ctx.params;
      //获取用户输入的上传流
      const file=ctx.request.files[0];
      //设置参数
      let building={};
      //判断是否有文件流，有就进行操作
      if(file!==undefined&&file!==null){
        //文件流操作
        //获取绝对路径的一部分
        const baseDir=config.baseDir;
        //设置相对路径的一部分
        const url = '/public/image/hosptial/building';
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
        // 组装参数 model
        const relativePath = path.join(url, `${filename}${extname}`)  //相对路径
        //设置相对路径
        building.photoUrl=relativePath;
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
      }
      //获取前端传入的json数据
      const buildingmsg=ctx.request.body;
      building.name=buildingmsg.name;
      console.log(building);
      const res=await service.building.updateBuilding(id,building);
      // 设置响应内容和响应状态码
      ctx.helper.success({ctx,res});
  }

  /**
   * 删除某个医院建筑信息
   */
  async deleteBuilding(){
    const {ctx} =this;
    const {id}=ctx.params;
    await ctx.service.building.deleteBuilding(id);
    ctx.helper.success({ctx});
  }

  /**
   * 根据建筑id查询所有楼层信息
   */
  async findAllFloors(){
    const {ctx,service} = this;
    const { id } = ctx.params;
    const res = await service.building.findAllFloors(id);
    ctx.helper.success({ctx,res});
  }

  /**
   * 根据id查询某个具体楼层
   */
  async findOneFloor(){
    const {ctx,service} = this;
    const { id } = ctx.params;
    const res = await service.building.findOneFloorById(id);
    ctx.helper.success({ctx,res});
  }

  /**
   * 保存某个具体楼层信息
   */
  async saveFloor(){
    const {ctx,service,config}=this;
    //获取用户输入的上传流
    const file=ctx.request.files[0];
    //设置参数
    let floor={};
    //判断是否有文件流，有就进行操作
    if(file!==undefined&&file!==null){
      //文件流操作
      //获取绝对路径的一部分
      const baseDir=config.baseDir;
      //设置相对路径的一部分
      const url = '/public/image/hosptial/building/floors';
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
      // 组装参数 model
      const relativePath = path.join(url, `${filename}${extname}`)  //相对路径
      //设置相对路径
      floor.photoUrl=relativePath;
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
    }
    //获取前端传入的json数据
    const floormsg=ctx.request.body;
    floor.name=floormsg.name;
    floor.buildingId=floormsg.buildingId;
    const res=await service.building.saveFloor(floor);
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res});
  }

  /**
   * 更新某个具体楼层的信息
   */
  async updateFloor(){
      const {ctx,service,config}=this;
      const {id}=ctx.params;
      //获取用户输入的上传流
      const file=ctx.request.files[0];
      //设置参数
      let floor={};
      //判断是否有文件流，有就进行操作
      if(file!==undefined&&file!==null){
        //文件流操作
        //获取绝对路径的一部分
        const baseDir=config.baseDir;
        //设置相对路径的一部分
        const url = '/public/image/hosptial/building/floors';
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
        // 组装参数 model
        const relativePath = path.join(url, `${filename}${extname}`)  //相对路径
        //设置相对路径
        floor.photoUrl=relativePath;
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
      }
      //获取前端传入的json数据
      const floormsg=ctx.request.body;
      floor.name=floormsg.name;
      floor.buildingId=floormsg.buildingId;
      const res=await service.building.updateFloor(id,floor);
      // 设置响应内容和响应状态码
      ctx.helper.success({ctx,res});
  }

  /**
   * 删除某个具体楼层信息
   */
  async deleteFloor(){
    const {ctx} =this;
    const {id}=ctx.params;
    await ctx.service.building.deleteFloor(id);
    ctx.helper.success({ctx});
  }
}

module.exports = BuildingController;
