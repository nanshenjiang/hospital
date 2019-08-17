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
    /**
     * 插入一级科室
     */
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

    /**
     * 插入二级科室
     */
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

    /**
     * 插入医生信息
     */
    await ctx.model.Doctor.create({
      id: 1,
      name: '曾康华',
      gender: 2,
      post: '副院长',
      title: '主任医师 、教授',
      avatarUrl: '\\public\\image\\doctor\\face\\doctor1.jpg',
      resume: `南昌大学硕士生导师、心脏康复学科带头人、江西省政府特殊津贴专家、赣州市政府特殊津贴专家、赣南医学院兼职教授、全国“五一”劳动奖章获得者、江西省人大代表、赣州市“十佳”医务工作者。`,
      speciality: '在冠心病、高血压、心衰的诊断治疗上积累了丰富经验，率先在市级医院开展心脏康复，创建赣州市人民医院心脏康复亚专业。',
      concurrent: '中国心脏联盟委员、江西省康复医学会常委、赣州市康复医学会会长、赣州市康复医学会心血管专业委员会主委、赣州市医学会心血管专业委员会副主委。',
      achievement: '完成省市级课题多项，多项成果获市科技进步奖。',
      secondOfficeId: 1,
    })
    await ctx.model.Doctor.create({
      id: 2,
      name: '罗骏',
      gender: 1,
      post: '党委委员、副院长、心血管内一科主任',
      title: '主任医师 、教授',
      avatarUrl: '\\public\\image\\doctor\\face\\doctor2.jpg',
      resume: '博士后，硕士研究生导师，曾在南京医科大学附属南京市第一医院和江西省人民医院长期工作并担任科室主任助理和副主任。曾在美国杜克大学和UCLA大学研修，从事心内科临床工作近三十年在心血管疑难危重病人抢救上积累了丰富的经验。',
      speciality: '硕士生导师、江西省百千万人才工程人选、江西省卫生计生系统有突出贡献中青年专家、江西省卫生系统学术和技术带头人培养对象、中国老年医学会心血管分会委员、江西省生物医学工程学会起博与电生理分会常委兼副秘书长、江西省心血管分会房颤工作组副组长、赣州医学会心血管分会副主任委员。',
      concurrent: '从事心血管临床工作三十余年，在心脏介入和心血管疑难危重病人诊治上积累了丰富的经验。擅长各种心脏病介入治疗，特别是在复杂冠心病支架术，复杂心律失常射频消融术，三腔起搏器植入及主动脉夹层经皮腔内隔绝等心脏介入治疗上积累丰富经验，年介入量千余台。较早开展房颤射频消融、经桡动脉冠脉介入、主动脉夹层介入治疗，指导省内外数十家医院开展心脏介入治疗。率先在赣州地区独立开展房颤的射频消融治疗、房颤的冷冻消融、左心耳封堵、零X线射频消融、无内腔起搏电极植入、FFR等介入技术。',
      achievement: '主持国家自然基金、省自然基金等课题十余项，发表国家级论文数十篇，获市级科技成果奖多项，指导硕士研究生十余人。',
      secondOfficeId: 1,
    })
    await ctx.model.Doctor.create({
      id: 3,
      name: '汤建华',
      gender: 1,
      post: '主任',
      title: '主任医师',
      avatarUrl: '\\public\\image\\doctor\\face\\doctor3.jpg',
      resume: '1986年参加工作，消化专业研究生毕业，获医学硕士学位。一直从事消化内科临床及内镜工作。',
      speciality: '长期从事临床消化及内镜工作，理论扎实，经验丰富，擅长于消化系危、急、重症及疑难病例诊治，对消化系统常见病、多发病如食管疾病、胃肠疾病、胰腺病、慢性肝病的诊治有独到之处，熟练掌握上消化道内窥镜诊断及治疗操作，尤其是胆、胰疾病内镜下诊疗如胆管结石、胆管肿瘤、梗阻性黄疸、急慢性胰腺炎、胰腺囊肿、胰腺肿瘤、胰管结石等。',
      concurrent: '江西省肝病学会委员、江西省胃癌学会委员、赣州市消化病学会常委。',
      secondOfficeId: 2,
    })
    await ctx.model.Doctor.create({
      name: '陈友佳',
      gender: 1,
      post: '党委委员、工会主席',
      title: '主任医师',
      avatarUrl: '\\public\\image\\doctor\\face\\doctor4.jpg',
      resume: '心脏重症学科带头人，中共党员，现任赣州市人民医院党委委员、工会主席。1993年7月毕业于赣南医学院；历任赣州市人民医院介入导管科副主任、放射介入科主任、心血管内科副主任（正科级）、门诊部主任兼心血管内科副主任、医务部主任兼心血管内科副主任；2017年9月起任赣州市人民医院工会主席。',
      speciality: '完成省市级课题多项。',
      concurrent: '较早在赣州开展介入治疗，在介入和心脏重症救治上积累了丰富经验，特别擅长外周血管和冠心病的介入治疗及危重患者的抢救。',
      achievement: '江西省研究性医学会医疗分会副主任委员、江西省心血管专业委员会高血压学组成员、江西省介入心脏病学会第一届理事、赣州市医学会心血管分会常委。',
      secondOfficeId: 2,
    })
    await ctx.model.Doctor.create({
      name: '陈仁华',
      gender: 1,
      title: '副主任医师',
      avatarUrl: '\\public\\image\\doctor\\face\\doctor5.jpg',
      resume: '医学博士，心血管病专业，毕业于上海交通大学，副主任医师，从事心血管专业临床工作近20年，从事心血管介入诊疗10余年。先后在河北医科大学第一附属医院、南昌大学第一附属医院、首都医科大学附属安贞医院、上海交通大学附属新华医院、上海复旦大学附属中山医院进修、访问或学习，发表SCI论文多篇，理论知识扎实，临床经验丰富',
      speciality: '主持江西省卫生与计划委员课题一项，完成赣州市科技局课题二项。近年来发表SCI论文多篇。',
      concurrent: '擅长心血管系统危、急、重症抢救(如急性心肌梗死的急诊介入治疗和恶性心律失常的治疗)及疑难病例诊治；对心脏介入治疗如冠心病的支架植入治疗，大动脉夹层的覆膜支架腔内隔绝术等有很高的造诣，尤其擅长心律失常的诊治，如阵发性室上性心动过速、房性心动过速、心房颤动、室性早搏、室性心动速的射频消融治疗，心动过缓，病态窦房结综合征的起搏器植入治疗等。',
      achievement: '赣州市心血管专业委员会委员。',
      secondOfficeId: 1,
    })
    await ctx.model.Doctor.create({
      name: '袁文金',
      avatarID: null,
      gender: 1,
      title: '主任医师',
      avatarUrl: '\\public\\image\\doctor\\face\\doctor6.jpg',
      resume: '冠心病学科带头人，西部之光访问学者。1990年9月—1995年7月就读于江西赣南医学院临床医学系，获医学学士； 2000年9月—2003年7月就读于广东汕头大学医学院，获医学硕士（内科学）；2005年11月在北京大学人民医院参加第16届高级心脏电生理学习班',
      concurrent: '曾赴意大利进修学习，从事临床工作二十余年，在各种心脏介入治疗和危重病人抢救上积累了丰富的经验，擅长冠心病的介入治疗，特别是复杂冠心病的介入治疗。',
      achievement: '赣州市心血管专业委员会委员。',
      secondOfficeId: 1,
    })
    await ctx.model.Doctor.create({
      name: '王诚高',
      gender: 1,
      title: '副主任医师',
      avatarUrl: '\\public\\image\\doctor\\face\\doctor7.jpg',
      concurrent: '临床规培医师导师，从事冠心病、高血压病、高脂血症、心肌病、心律失常、先心病等心血管疾病诊断及治疗，在冠心病、高血压病、高脂血症、心肌病方面拥有丰富经验，擅长冠心病的介入手术治疗',
      secondOfficeId: 1,
    })
    await ctx.model.Doctor.create({
      name: '谢绍峰',
      gender: 1,
      avatarUrl: '\\public\\image\\doctor\\face\\doctor8.jpg',
      title: '副主任医师',
      secondOfficeId: 1,
    })

    /**
     * 插入医生出诊信息
     */
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
