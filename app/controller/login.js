'use strict';

const Controller = require('egg').Controller;
const jwt=require('jsonwebtoken');
/**
 * 登录控制层
 */
class LoginController extends Controller {
  /**
   * 登进操作：
   * 进行验证用户账号密码操作
   * 同时生成jwt，设置进cookie
   */ 
  async loginIn() {
    const {ctx} = this;
    const rule = {  //校验规则
      username: { type: 'string', required: true},
      password: { type: 'string', required: true},
    };
    const msg=ctx.request.body;
    try{   //校验规则时报错
      await ctx.validate(rule,msg);
    }catch(e){
      ctx.throw(401,'请输入正确的账号密码');
    }
    const user=await ctx.service.user.login(msg);  //检查账号密码是否正确
    let token = jwt.sign({
      id: user.id,
      isAdmin: user.isAdmin,
    }, 'scnu-xie', {
      expiresIn: '1h' //token有效期设置为1小时
    });
    ctx.cookies.set('token', token, {
      maxAge:1000*60*60,  //设置cookie存放时间为1小时
      httpOnly:true,   //不允许被js访问
      // secure:true,      //只在https连接上传输
      overwrite:true,   //设置为true会覆盖之前设置的cookie
      signed:true,   //是否做签名，防止前端篡改
      encrypt:true,   //是否做加密，设置为true
    })
    const res={
      username: user.username,
      isAdmin: user.isAdmin,
    }
    ctx.helper.success({ctx,res});
  }
 
  /**
   * 登出操作：
   * 删除当前token，用户登出
   */
  async loginOut(){
    const {ctx}=this;
    //删除用户cookie中的token字段，实现登出操作
    ctx.cookies.set('token',null,{
      signed: true,
      encrypt: true,
    });
    //无法使用ctx.throw，会发生错误
    //因为errorHandler也是中间件，在使用jwt中间件时会先验证
    ctx.body={
      code: 401,
      error: '请登录',
    };
  }

  /**
   * 注册账号密码
   */
  async save(){
    const {ctx}=this;
    const msg=ctx.request.body;
    if(msg.password.length<6){   //用户密码不能短于6位
      ctx.throw(400,'密码长度不能短于6位');
    }
    const res=await ctx.service.user.save(msg);
    ctx.helper.success({ctx,res});
  }

  /**
   * 获取所有账号密码
   */
  async getAll(){
    const {ctx}=this;
    const res=await ctx.service.user.findAll();
    ctx.helper.success({ctx,res}); 
  }

  /**
   * 查询某个账号密码
   */
  async getOne(){
    const {ctx}=this;
    const {id}=ctx.params;
    const res=await ctx.service.user.findOne(id);
    ctx.helper.success({ctx,res}); 
  }

  /**
   * 修改某个账号
   * 当用户修改自己账号时，要让用户进行登出操作
   */
  async update(){
    const {ctx}=this;
    const {id}=ctx.params;
    const msg=ctx.request.body;
    if(msg.password.length<6){   //用户密码不能短于6位
      ctx.throw(400,'密码长度不能短于6位');
    }
    //查询当前用户修改的是否为自己的账号密码
    const token=ctx.cookies.get('token',{ 
      signed: true,
      encrypt: true,
    });
    let decoded;
    try {
      //封装解密后结果
      decoded = jwt.verify(token, 'scnu-xie');
    }catch (error) {
      //有错
      ctx.throw(400,'Update Error');
    }
    const res=await ctx.service.user.update(id,msg);
    if(decoded.id==id){
      //当前修改的自己的账号密码
      ctx.cookies.set('token',null,{
        signed: true,
        encrypt: true,
      });
      ctx.body={
        code: 401,
        error: '修改成功！！请重新登录',
      };
    }else{
      ctx.helper.success({ctx,res}); 
    }
  }

  /**
   * 删除某个账号
   * 当用户删除自己账号时，要让用户进行登出操作
   */
  async delete(){
    const {ctx}=this;
    const {id}=ctx.params;
    //查询当前用户删除的是否为自己的账号密码
    const token=ctx.cookies.get('token',{ 
      signed: true,
      encrypt: true,
    });
    let decoded;
    try {
      //封装解密后结果
      decoded = jwt.verify(token, 'scnu-xie');
    }catch (error) {
      //有错
      ctx.throw(400,'Update Error');
    }
    await ctx.service.user.delete(id);
    if(decoded.id==id){
      //当前删除的自己的账号密码
      ctx.cookies.set('token',null,{
        signed: true,
        encrypt: true,
      });
      ctx.body={
        code: 401,
        error: '删除成功！！请登录其他账号',
      };
    }else{
      ctx.helper.success({ctx}); 
    }
  }
}

module.exports = LoginController;
