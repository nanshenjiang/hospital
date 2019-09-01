'use strict';

const Service = require('egg').Service;

/**
 * 账号密码service接口
 */
class UserService extends Service {
  /**
   * 登录功能：验证用户账号密码是否正确
   */
  async login(login) {
    const {ctx} = this;
    //在数据库中获取该账户信息
    const list = await ctx.model.User.findAll({
      where: {
        username: login.username
      }
    });
    const query=list[0];
    //验证账号是否存在
    if (!query) {
      ctx.throw(401,'账号不存在');
    } else {
      //比较密码是否正确
      const checked=await ctx.compare(login.password,query.password);
      if (!checked) {
        ctx.throw(401,'用户密码错误');
      } 
    }
    return query;
  }

  /**
   * 注册：即管理员注册账号
   */
  async save(user){
    const {ctx}=this;
    let t;
    user.password=await ctx.genHash(user.password);  //对密码hash
    try{
        t=await ctx.model.transaction();
        //检验账号是否存在
        const exist=await ctx.model.User.findAll({
          where: {
            username: user.username,
          }
        })
        if(Object.keys(exist).length!==0){
          ctx.throw(400,'账号不能重复');
        }
        const ans=await ctx.model.User.create(user,{transaction:t});
        if(!ans){
            ctx.throw(400,'Update Failed');
        }
        const res={   //结果不返回用户密码
            id: ans.id,
            username: ans.username,
            password: 'xxxxxxxx',
            isAdmin: ans.isAdmin,
        }
        await t.commit();
        return res;
    }catch(e){
        await t.rollback();
        ctx.throw(400,e.message);
    }
  }

  /**
   * 查询所有账号密码
   * 其中密码设置为‘xxxxxxxx’
   */
  async findAll(){
    const {ctx}=this;
    let t;
    try {
      t=await ctx.model.transaction();
      const list=await ctx.model.User.findAll({
        attributes: ['id','username','password','isAdmin'],
      },{transaction:t})
      if(Object.keys(list).length===0){
        ctx.throw();
      }
      //修改所有密码为‘xxxxxxxx’
      for(let obj of list){
        obj.password='xxxxxxxx';
      }
      // console.log(list);
      await t.commit();
      return list;
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  /**
   * 查询某个账户信息
   */
  async findOne(id){
    const { ctx }=this;
    let t;
    try {
      t=await ctx.model.transaction();
      console.log(id);
      let user=await ctx.model.User.findByPk(id,{
        attributes: ['id','username','password','isAdmin'],
      },{transaction:t});
      if(!user){
        ctx.throw();
      }
      user.password='xxxxxxxx';
      await t.commit();
      return user;
    }catch(e){
      await t.rollback();
      ctx.throw(404,'Not Found');
    }
  }

  /**
   * 修改账户信息
   */
  async update(id,user){
    const {ctx}=this;
    let t;
    try{
        t=await ctx.model.transaction();
        const userModel=await ctx.model.User.findByPk(id,{transaction:t});
        if(!userModel){
            ctx.throw(400,'Update Failed');
        }
        if(user.username!==userModel.username){
          //检验账号是否存在
          const exist=await ctx.model.User.findAll({
            where: {
              username: user.username,
            }
          })
          if(Object.keys(exist).length!==0){
            ctx.throw(400,'账号不能重复');
          }
        }
        user.password=await ctx.genHash(user.password);  //对密码hash
        const ans=await userModel.update(user,{transaction:t});
        const res={   //结果不返回用户密码
            id: ans.id,
            username: ans.username,
            password: 'xxxxxxxx',
            isAdmin: ans.isAdmin,
        }
        await t.commit();
        return res;
    }catch(e){
        await t.rollback();
        ctx.throw(400,e.message);
    }
  }

  /**
   * 删除某个账号
   */
  async delete(id){
    const {ctx}=this;
    let t;
    try{
        t=await ctx.model.transaction();
        const user=await ctx.model.User.findByPk(id,{transaction:t});
        if(!user){
            ctx.throw();
        }
        await user.destroy({transaction:t});
        await t.commit();
        return;
    }catch(e){
        await t.rollback();
        ctx.throw(400,'Delete Failed');
    }
  }
}

module.exports = UserService;
