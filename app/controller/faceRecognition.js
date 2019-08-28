'use strict';

const Controller = require('egg').Controller;

class FaceRecognitionController extends Controller {
  //获取所有人脸识别所需要的信息
  async getAll() {
    const {ctx}=this;
    const res=await ctx.model.Figure.findAll({
       attributes: ['id','IDnumber','name','faceBitmap','embeddngs'],
    });
    ctx.body={res};
  }
  //查找某个固定的人脸识别信息
  async findOne(){
    const {ctx}=this;
    const {id}=ctx.params;
    const res=await ctx.model.Figure.findByPk(id);
    ctx.body={res};
  }
  //提交一份人脸识别的信息
  async create(){
    const {ctx}=this;
    const obj=ctx.request.body||{};
    const res=await ctx.model.Figure.create(obj);
    ctx.body={res};
  }
  //更新人脸识别信息
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
