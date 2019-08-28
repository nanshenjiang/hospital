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
                 /*-----------医院信息-------------*/
  //获取所有医生信息（使用了分页，需传入所需页数和数量）
  router.get('/android/doctor/all',controller.android.showPartDoctor);
  //获取所有医生信息（不使用分页）
  router.get('/android/doctor/all/:id',controller.android.showAllDoctor);
  //获取某个医生具体信息（根据医生id）
  router.get('/android/doctor/one/:id',controller.android.showOneDoctor);
  //获取所有一级科室信息
  router.get('/android/office/first',controller.android.getAllFirstOffice);
  //获取二级科室信息（根据一级科室的id）
  router.get('/android/office/second/:id',controller.android.getAllSecondOffice);
                 /*-----------医院介绍-------------*/  
  //查找所有医院介绍
  router.get('/android/introduction/all',controller.android.findAllIntroduction);
  //查找某个医院介绍
  router.get('/android/introduction/one/:id',controller.android.findOneIntroduction);
                 /*-----------医院导航-------------*/  
  //查找所有医院建筑信息
  router.get('/android/building/all',controller.android.findAllBuildings);
  //查找某个医院建筑信息
  router.get('/android/building/one/:id',controller.android.findOneBuilding);
  //查找某个楼层信息
  router.get('/android/building/floor/one/:id',controller.android.findOneFloor);


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
  router.put('/web/doctor/uploadAvatar/:id', loggedOut, controller.doctor.uploadAvatar);
             /*-----------出诊信息中所包含接口-------------*/
  //查询所有出诊信息
  router.get('/web/workinfo/all/:id',loggedOut,controller.workInfo.getAllWorkInfo);
  //保存医生出诊信息
  router.post('/web/workinfo/save',loggedOut,controller.workInfo.save);
  //更新医生出诊信息（需传入对应出诊信息的id）
  router.put('/web/workinfo/update/:id',loggedOut,controller.workInfo.update);
  //删除医生出诊信息（需传入对应出诊信息的id）
  router.delete('/web/workinfo/delete/:id',loggedOut,controller.workInfo.delete);
             /*-----------医院介绍信息中所包含接口-------------*/
  //查找所有医院信息
  router.get('/web/introduction/all',loggedOut,controller.introduction.findAll);
  //查找某个医院信息
  router.get('/web/introduction/one/:id',loggedOut,controller.introduction.findOne);
  //保存医院信息(同时上传图片)
  router.post('/web/introduction/save',loggedOut,controller.introduction.save);
  //更新医院信息（仅更新医院信息，不包含图片）
  router.put('/web/introduction/update/:id',loggedOut,controller.introduction.update);
  //删除医院信息
  router.delete('/web/introduction/delete/:id',loggedOut,controller.introduction.deleteIntroduction);
  //新增一张医院信息图片
  router.post('/web/introduction/photo/upload/:id',loggedOut,controller.introduction.savePhoto);
  //删除一张医院信息图片
  router.delete('/web/introduction/photo/delete/:id',loggedOut,controller.introduction.deletePhoto);
             /*-----------医院建筑（包括楼层）中所包含接口-------------*/
  //查询医院所有建筑
  router.get('/web/building/all',loggedOut,controller.building.findAllBuildings);
  //查询医院某个具体建筑（包括其每个楼层的信息）
  router.get('/web/building/one/:id',loggedOut,controller.building.findOneBuilding);
  //根据某个医院建筑查询所有楼层
  router.get('/web/building/floor/all/:id',loggedOut,controller.building.findAllFloors);
  //根据id查询某个具体楼层
  router.get('/web/building/floor/one/:id',controller.building.findOneFloor);
  //保存医院建筑信息
  router.post('/web/building/save',loggedOut,controller.building.saveBuilding);
  //保存楼层信息
  router.post('/web/building/floor/save',loggedOut,controller.building.saveFloor);
  //更新医院建筑信息
  router.put('/web/building/update/:id',loggedOut,controller.building.updateBuilding);
  //更新楼层信息
  router.put('/web/building/floor/update/:id',loggedOut,controller.building.updateFloor);
  //删除某个楼层信息
  router.delete('/web/building/floor/delete/:id',loggedOut,controller.building.deleteFloor);
  //删除某个医院建筑信息
  router.delete('/web/building/delete/:id',loggedOut,controller.building.deleteBuilding);


  /*------------------------初始化数据库的部分接口---------------------------*/
  //初始化数据库，及设置中的role类：包括超级管理员，管理员，普通用户
  router.get('/setup/database/init1', controller.setup.initDatabase);
  //初始数据库：初始化一些数据进行测试
  router.get('/setup/database/init2', controller.setup.initDevDatabase);
};
