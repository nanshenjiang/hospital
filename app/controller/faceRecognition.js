'use strict';

const Controller = require('egg').Controller;

/**
 * 人脸识别功能：
 * 对接师兄写好的人脸，存放进数据库
 */
class FaceRecognitionController extends Controller {
  /**
   * 获取所有人脸识别所需要的信息
   */
  async getAll() {
    const {ctx}=this;
    const res=await ctx.model.Figure.findAll({
       attributes: ['id','IDnumber','name','faceBitmap','embeddngs'],
    });
    ctx.body={res};
  }
  /**
   * 仅获取id和身份证号
   */
  async getPart() {
    const {ctx}=this;
    const res=await ctx.model.Figure.findAll({
       attributes: ['id','IDnumber'],
    });
    ctx.body={res};
  }
  /**
   * 查找某个固定的人脸识别信息
   */
  async findOne(){
    const {ctx}=this;
    const {id}=ctx.params;
    const res=await ctx.model.Figure.findByPk(id);
    ctx.body={res};
  }
  /**
   * 提交一份人脸识别的信息
   */
  async create(){
    const {ctx}=this;
    const obj=ctx.request.body||{};
    const file=ctx.request.files[0];
    console.log(obj);
    console.log(file);
    // const bitmap=new Buffer(obj.faceBitmap).toString("base64");
    // const figure={
    //   name: obj.name,
    //   faceBitmap: bitmap,
    //   IDnumber: obj.IDnumber,
    //   embeddngs: obj.embeddngs,
    // }
    // const res=await ctx.model.Figure.create(figure);
    ctx.body={obj};
  }
  /**
   * 更新人脸识别信息
   */
  async update(){
    const {ctx}=this;
    const {id}=ctx.params;
    const obj=ctx.request.body||{};
    const person=await ctx.model.Figure.findByPk(id);
    const res=await person.update(obj);
    ctx.body={res};
  }
}

module.exports = FaceRecognitionController;
