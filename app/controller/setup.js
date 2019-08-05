'use strict';

const bcrypt = require('bcrypt');  //egg封装的加密器
const Controller = require('egg').Controller;


/**
 * 登录-控制层
 */
class SetupController extends Controller {
  //初始化数据库中的role类：包括超级管理员，管理员，普通用户
  async initDatabase() {
    const { ctx } = this;

    console.log('initDatabase!');

    // 初始化数据表
    await this.app.model.sync({ force: true });

    console.log('finish sync!');

    // 初始化角色
    await this.app.model.Role.create({
      id: 1,
      name: '超级管理员',
      description: '超级管理员, 最高管理权限',
      is_admin: true,
    });
    await this.app.model.Role.create({
      id: 2,
      name: '管理员',
      description: '普通管理员',
      is_admin: true,
    });
    await this.app.model.Role.create({
      id: 3,
      name: '普通用户',
      description: '普通用户',
      is_admin: false,
    });
    ctx.body = 'success';
  }

  //初始数据库：包括一个超级管理员，一个管理员和一个普通账户
  async initDevDatabase() {
    const { ctx } = this;

    // 初始化测试管理员、一般管理员、一般用户账号若干
    const hash = await bcrypt.hash('123456', 10);   //对123456进行hash至10位
    await ctx.model.User.create({
      id: 1,
      email: 'master@sample.com',
      phone: '13800138000',
      password: hash,
      name: '平台管理员',
      role_id: 1,
      is_valid: true,
    });

    await ctx.model.User.create({
      id: 2,
      email: 'admin@sample.com',
      phone: '13800138001',
      password: hash,
      name: '管理员',
      role_id: 2,
      is_valid: true,
    });

    await ctx.model.User.create({
      id: 3,
      email: 'user1@sample.com',
      phone: '13800138002',
      password: hash,
      name: '张三',
      role_id: 3,
      is_valid: true,
    });

    ctx.body = 'success';
  }

  async initOtherDatabase(){
    const ctx=this.ctx;
    await ctx.model.FirstOffice.create({
      id: 1,
      name: '内科'
    })
    await ctx.model.FirstOffice.create({
      id: 2,
      name: '外科'
    })
    await ctx.model.FirstOffice.create({
      id: 3,
      name: '医技科室'
    })

    await ctx.model.SecondOffice.create({
      id: 1,
      name: '心血管内一科',
      firstOfficeId: 1
    })
    await ctx.model.SecondOffice.create({
      id: 2,
      name: '消化内科',
      firstOfficeId: 1
    })
    await ctx.model.SecondOffice.create({
      id: 3,
      name: '胃肠疝外科',
      firstOfficeId: 2
    })
    await ctx.model.SecondOffice.create({
      id: 4,
      name: '康复医学科',
      firstOfficeId: 3
    })

    await ctx.model.Doctor.create({
      id: 1,
      name: '曾康华',
      // description: 'test',
      avatarId: null,
      gender: 2,
      post: '副院长',
      title: '主任医师 、教授',
      resume: `南昌大学硕士生导师、心脏康复学科带头人、江西省政府特殊津贴专家、赣州市政府特殊津贴专家、赣南医学院兼职教授、全国“五一”劳动奖章获得者、江西省人大代表、赣州市“十佳”医务工作者。`,
      speciality: '在冠心病、高血压、心衰的诊断治疗上积累了丰富经验，率先在市级医院开展心脏康复，创建赣州市人民医院心脏康复亚专业。',
      concurrent: '中国心脏联盟委员、江西省康复医学会常委、赣州市康复医学会会长、赣州市康复医学会心血管专业委员会主委、赣州市医学会心血管专业委员会副主委。',
      achievement: '完成省市级课题多项，多项成果获市科技进步奖。',
      secondOfficeId: 1,
    })
    await ctx.model.Doctor.create({
      id: 2,
      name: '罗骏',
      // description: 'test',
      avatarID: null,
      gender: 1,
      post: '党委委员、副院长、心血管内一科主任',
      title: '主任医师 、教授',
      resume: '博士后，硕士研究生导师，曾在南京医科大学附属南京市第一医院和江西省人民医院长期工作并担任科室主任助理和副主任。曾在美国杜克大学和UCLA大学研修，从事心内科临床工作近三十年在心血管疑难危重病人抢救上积累了丰富的经验。',
      speciality: '硕士生导师、江西省百千万人才工程人选、江西省卫生计生系统有突出贡献中青年专家、江西省卫生系统学术和技术带头人培养对象、中国老年医学会心血管分会委员、江西省生物医学工程学会起博与电生理分会常委兼副秘书长、江西省心血管分会房颤工作组副组长、赣州医学会心血管分会副主任委员。',
      concurrent: '从事心血管临床工作三十余年，在心脏介入和心血管疑难危重病人诊治上积累了丰富的经验。擅长各种心脏病介入治疗，特别是在复杂冠心病支架术，复杂心律失常射频消融术，三腔起搏器植入及主动脉夹层经皮腔内隔绝等心脏介入治疗上积累丰富经验，年介入量千余台。较早开展房颤射频消融、经桡动脉冠脉介入、主动脉夹层介入治疗，指导省内外数十家医院开展心脏介入治疗。率先在赣州地区独立开展房颤的射频消融治疗、房颤的冷冻消融、左心耳封堵、零X线射频消融、无内腔起搏电极植入、FFR等介入技术。',
      achievement: '主持国家自然基金、省自然基金等课题十余项，发表国家级论文数十篇，获市级科技成果奖多项，指导硕士研究生十余人。',
      secondOfficeId: 1,
    })
    await ctx.model.Doctor.create({
      id: 3,
      name: '汤建华',
      // description: 'test',
      avatarID: null,
      gender: 1,
      post: '主任',
      title: '主任医师',
      resume: '1986年参加工作，消化专业研究生毕业，获医学硕士学位。一直从事消化内科临床及内镜工作。',
      speciality: '长期从事临床消化及内镜工作，理论扎实，经验丰富，擅长于消化系危、急、重症及疑难病例诊治，对消化系统常见病、多发病如食管疾病、胃肠疾病、胰腺病、慢性肝病的诊治有独到之处，熟练掌握上消化道内窥镜诊断及治疗操作，尤其是胆、胰疾病内镜下诊疗如胆管结石、胆管肿瘤、梗阻性黄疸、急慢性胰腺炎、胰腺囊肿、胰腺肿瘤、胰管结石等。',
      concurrent: '江西省肝病学会委员、江西省胃癌学会委员、赣州市消化病学会常委。',
      secondOfficeId: 2,
    })

    await ctx.model.WorkInformation.create({
      id: 1,
      department: '心血管内一科门诊（南院）',
      registerType: '正高号',
      date: null,
      classes: '上午',
      remaining: 20,
      doctorId: 1,
    })
    await ctx.model.WorkInformation.create({
      id: 2,
      department: '心血管内一科门诊（南院）',
      registerType: '正高号',
      date: null,
      classes: '下午',
      remaining: 19,
      doctorId: 1,
    })
    await ctx.model.WorkInformation.create({
      id: 3,
      department: '心血管内一科门诊（南院）',
      registerType: '正高号',
      date: null,
      classes: '上午',
      remaining: 20,
      doctorId: 2,
    })

    ctx.body='success';
  }
}

module.exports = SetupController;
