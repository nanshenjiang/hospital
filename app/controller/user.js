'use strict';

const bcrypt = require('bcrypt');
const Controller = require('egg').Controller;

// Salt
const saltRounds = 10;

const indexRule = {
  page: {
    type: 'int',
    convertType: 'int',
    min: 1,
    default: 1,
    required: false,
  },
  count: {
    type: 'enum',
    convertType: 'int',
    values: [ 10, 30, 50 ],
    default: 10,
    required: false,
  },
};

const registerRule = {
  email: {
    type: 'email',
    max: 40,
  },
  phone: {
    type: 'string',
    max: 20,
    format: /1[345789][0-9][0-9]{8}/,
  },
  password: 'password',
  name: {
    type: 'string',
    max: 30,
    trim: true,
  },
};

const loginRule = {
  username: {
    type: 'string',
  },
  password: 'password',
};

const updateRule = {
  name: {
    type: 'string',
    max: 30,
    trim: true,
  },
};

const changePasswordRule = {
  old_password: 'password',
  new_password: 'password',
};

class UserController extends Controller {
  // 获取所有的成员
  async index() {
    const { ctx } = this;
    ctx.validate(indexRule, ctx.request.query);

    const { page, count } = ctx.query;

    const res = await Promise.all([
      ctx.model.User.count({}),
      ctx.model.User.findAll({
        limit: count,
        offset: (page - 1) * count,
      }),
    ]);
    ctx.body = {
      total: res[0], list: res[1], page, count,
    };
  }
  // 注册账号
  async register() {
    const { ctx } = this;
    ctx.validate(registerRule, ctx.request.body);

    const { email, phone, password, name } = ctx.request.body;

    const hash = await bcrypt.hash(password, saltRounds);
    const user = await ctx.model.User.create({
      email, phone, password: hash, name,
      role_id: 1,
      is_valid: true, // 目前默认有效
    });

    const { id } = user;

    ctx.body = { id };
  }

  // 检查邮箱和电话是否被注册
  async check() {
    const { ctx } = this;
    const { type, value } = ctx.request.body;
    if (type === 'phone') {
      const user = await ctx.model.User.findOne({
        where: {
          phone: value,
        },
        attributes: [ 'id' ],
      });
      if (user) ctx.body = { error: true };
      else ctx.body = { error: false };
    }
    if (type === 'email') {
      const user = await ctx.model.User.findOne({
        where: {
          email: value,
        },
        attributes: [ 'id' ],
      });
      if (user) ctx.body = { error: true };
      else ctx.body = { error: false };
    }
  }
  // 用户登录
  async login() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    ctx.validate(loginRule, ctx.request.body);

    const { username, password } = ctx.request.body;
    const user = await ctx.model.User.findOne({
      where: {
        [Op.or]: [{
          email: username,
        }, {
          phone: username,
        }],
      },
      include: [{
        model: ctx.model.Role,
        as: 'role',
        attributes: [ 'name', 'is_admin' ],
      }],
    });
    if (!user) throw new Error('账号或密码不正确');

    // 验证密码正确性
    const cmp = await bcrypt.compare(password, user.password);
    if (!cmp) throw new Error('账号或密码不正确');

    // 验证权限
    const { name, id, role_id, role } = user;
    if (role_id === 4) throw new Error('您的账号访问受限，请联系管理员');

    // 设置Session
    ctx.session.id = id;
    ctx.session.role_id = role_id;
    ctx.session.is_admin = role.is_admin;
    const teammate = await ctx.model.Teammate.findOne({
      where: {
        user_id: id,
      },
    });
    ctx.session.company_id = teammate.company_id;
    ctx.body = { name, id, role, company_id: ctx.session.company_id };
  }

  // 用户登录退出
  async logout() {
    const { ctx } = this;

    ctx.session = null;
    ctx.body = {};
  }

  // 查看当前用户信息
  async info() {
    const { ctx } = this;
    console.log(ctx.request);
    // 展示用户的基本信息，包括角色和公司情况
    const user = await ctx.model.User.findOne({
      where: {
        id: ctx.session.id,
      },
      attributes: [ 'phone', 'email', 'name' ],
      include: [{
        model: ctx.model.Role,
        as: 'role',
        attributes: [ 'id', 'name', 'is_admin' ],
      }],
    });
    if (!user) throw new Error('当前用户不存在');
    ctx.body = {
      phone,
      email,
      name,
      role,
    };
  }

  // 修改用户个人资料
  async update() {
    const { ctx } = this;
    ctx.validate(updateRule, ctx.request.body);

    const { name } = ctx.request.body;

    const res = await ctx.model.User.update({
      name,
    }, {
      where: { id: ctx.session.id },
    });

    if (res[0] === 0) {
      throw new Error('无法修改用户资料');
    }

    ctx.body = {};
  }

  // 修改用户密码
  async changePassword() {
    const { ctx } = this;
    ctx.validate(changePasswordRule, ctx.request.body);

    const { old_password, new_password } = ctx.request.body;
    const user = await ctx.model.User.findOne({
      where: {
        id: ctx.session.id,
      },
    });
    if (!user) throw new Error('用户不存在');

    const cmp = await bcrypt.compare(old_password, user.password);
    if (!cmp) throw new Error('原密码不正确');

    user.password = await bcrypt.hash(new_password, saltRounds);
    await user.save();

    ctx.body = {};
  }

  // TODO: 修改用户手机和邮箱

}

module.exports = UserController;
