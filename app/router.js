'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const loggedIn = app.middleware.limit({ type: 'logged_in' });
  const loggedOut = app.middleware.limit({ type: 'logged_out' });
  const onlyAdmin = app.middleware.limit({ type: 'only_admin' });

  /* *
   * router使用：router.verb('router-name', 'path-match', middleware1, ..., middlewareN, app.controller.action);
   * resources: RESTful风格
   */

  /*------------------------安卓端所需接口-----------------------------------*/
  //获取所有医生信息（使用了分页，需传入所需页数和数量）
  router.get('/android/doctor/all',controller.android.showPartDoctor);
  //获取所有医生信息（不使用分页）
  router.get('/android/doctor/all/:id',controller.android.showAllDoctorByNeedOfAndroid);
  //获取某个医生具体信息（根据医生id）
  router.get('/android/doctor/one/:id',controller.android.showOne);
  //获取所有一级科室信息
  router.get('/android/office/first',controller.android.getAllFirstOffice);
  //获取二级科室信息（根据一级科室的id）
  router.get('/android/office/second/:id',controller.android.getAllSecondOffice);


  /*------------------------web前端端所需接口--------------------------------*/
               /*-----------科室中所包含接口-------------*/
  //查询所有一级科室信息
  router.get('/web/office/first/all',loggedOut,controller.office.getAllFirstOffice);
  //通过一级科室id查询所有二级科室信息
  router.get('/web/office/second/all/:id',loggedOut,controller.office.getAllSecondOffice);
  //保存一级科室信息
  router.post('/web/office/first/save',loggedOut,controller.office.saveFirstOffice);
  //保存二级科室信息
  router.post('/web/office/second/save',loggedOut,controller.office.saveSecondOffice);
  //更新一级科室信息（需传入相关id）
  router.put('/web/office/first/update/:id',loggedOut,controller.office.updateFirstOffice);
  //更新二级科室信息（需传入相关id）
  router.put('/web/office/second/update/:id',loggedOut,controller.office.updateSecondOffice);
  //删除一级科室信息（传入相关id）
  router.delete('/web/office/first/delete/:id',loggedOut,controller.office.deleteFirstOffice);
  //删除二级科室信息（传入相关id）
  router.delete('/web/office/second/delete/:id',loggedOut,controller.office.deleteSecondOffice);
               /*-----------医生中所包含接口-------------*/
  //根据二级科室id查询所有医生信息
  router.get('/web/doctor/all/:id',loggedOut,controller.doctor.showAllDoctor);
  //查询具体医生信息（根据id）
  router.get('/web/doctor/one/:id',loggedOut,controller.doctor.showOne);
  //新增医生信息
  router.post('/web/doctor/save',loggedOut,controller.doctor.create);
  //修改医生信息
  router.put('/web/doctor/update/:id',loggedOut,controller.doctor.update);
  //删除医生信息（根据id）
  router.delete('/web/doctor/delete/:id',loggedOut,controller.doctor.delete);
  //上传和修改医生头像图片
  router.post('/web/doctor/uploadAvatar/:id', loggedOut, controller.doctor.uploadAvatar);
             /*-----------出诊信息中所包含接口-------------*/
  //查询所有出诊信息
  router.get('/web/workinfo/all/:id',loggedOut,controller.workInfo.getAllWorkInfo);
  //保存医生出诊信息
  router.post('/web/workinfo/save',loggedOut,controller.workInfo.save);
  //更新医生出诊信息（需传入对应出诊信息的id）
  router.put('/web/workinfo/update/:id',loggedOut,controller.workInfo.update);
  //删除医生出诊信息（需传入对应出诊信息的id）
  router.delete('/web/workinfo/delete/:id',loggedOut,controller.workInfo.delete);
  

  /*------------------------初始化数据库的部分接口---------------------------*/
  //初始化数据库，及设置中的role类：包括超级管理员，管理员，普通用户
  router.get('/setup/database/init', controller.setup.initDatabase);
  //初始数据库：包括一个超级管理员账户，一个管理员账户和一个普通账户
  router.get('/setup/dev/init', controller.setup.initDevDatabase);
  //初始化数据库，初始化一些数据进行测试
  router.get ('/setup/database/init2',controller.setup.initOtherDatabase);

};
