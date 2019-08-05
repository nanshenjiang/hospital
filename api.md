# 平台接口

## 通用

### 错误捕获

```
{
    "message": "Validation error"
}
```

- message: 错误信息

> 响应码为 `422` 时代表输入的内容检验不通过
>
> 错误消息为 `Validation error` 代表数据库校验不通过

## 用户接口

### 注册

- 方法: `POST`
- URL: `/user/register`
- 权限: 未登录
- Body参数:
- - email: 邮箱地址
- - phone: 手机号码
- - password: 密码
- - name: 昵称

成功响应: 

```
{
    "id": 3
}
```

- id: 用户ID

### 登录

- 方法: `POST`
- URL: `/user/login`
- 权限: 未登录
- Body参数:
- - username: 邮箱地址/手机号码
- - password: 密码

成功响应: 

```
{
    "name": "管理员",
    "id": 1,
    "role": {
        "name": "超级管理员",
        "is_admin": true
    }
}
```

- id: 用户ID
- name: 昵称
- role: 角色信息
- - name: 角色名称
- - is_admin: 是否为管理员

### 退出登录

- 方法: `GET`
- URL: `/user/logout`
- 权限: 已登录

成功响应: 

```
{}
```

### 查询当前用户信息

- 方法: `GET`
- URL: `/user`
- 权限: 已登录

成功响应: 

```
{
    "phone": "15219218279",
    "email": "123@qq.com",
    "name": "1231daefd",
    "role": {
        "id": 1,
        "name": "普通用户",
        "is_admin": false
    },
    "company": [
        {
            "company_id": 13,
            "name": "测试12"
        },
        {
            "company_id": 14,
            "name": "测试13"
        },
        {
            "company_id": 15,
            "name": "测试14"
        }
    ]
}
```

- email: 邮箱地址
- phone: 手机号码
- name: 昵称
- role: 角色信息
- - id: 角色ID
- - name: 角色名称
- - is_admin: 是否为管理员
- company: 公司信息，若不存在则为 `null`
- - name: 公司名称

### 管理员获取所有用户的信息

- 方法: `GET`
- URL: `/user/getAllUser`
- 权限: 已登录，系统管理员

成功响应: 

```
{
    "total": {
        "list": [
            {
                "id": 1,
                "phone": "13800138000",
                "email": "master@sample.com",
                "password": "$2b$10$rDfqjUnCnvyWidAN0UfWr.wxGbK27PARLz.4M7WBlaKMy5H2u3Gm2",
                "name": "平台管理员",
                "is_valid": true,
                "created_at": "2019-04-24T02:23:27.000Z",
                "updated_at": "2019-04-24T02:23:27.000Z",
                "deleted_at": null,
                "role_id": 3
            },
            {
                "id": 2,
                "phone": "13800138001",
                "email": "admin@sample.com",
                "password": "$2b$10$rDfqjUnCnvyWidAN0UfWr.wxGbK27PARLz.4M7WBlaKMy5H2u3Gm2",
                "name": "管理员",
                "is_valid": true,
                "created_at": "2019-04-24T02:23:27.000Z",
                "updated_at": "2019-04-24T02:23:27.000Z",
                "deleted_at": null,
                "role_id": 2
            },
            {
                "id": 3,
                "phone": "13800138002",
                "email": "user1@sample.com",
                "password": "$2b$10$rDfqjUnCnvyWidAN0UfWr.wxGbK27PARLz.4M7WBlaKMy5H2u3Gm2",
                "name": "张三",
                "is_valid": true,
                "created_at": "2019-04-24T02:23:27.000Z",
                "updated_at": "2019-04-24T02:23:27.000Z",
                "deleted_at": null,
                "role_id": 1
            }
        ],
        "page": 1,
        "count": 10
    }
}
```

- email: 邮箱地址
- phone: 手机号码
- name: 昵称
- role: 角色信息
- - id: 角色ID
- - name: 角色名称
- - is_admin: 是否为管理员
- company: 公司信息，若不存在则为 `null`
- - name: 公司名称

### 修改当前用户个人信息

- 方法: `POST`
- URL: `/user`
- 权限: 已登录
- Body参数:
- - name: 昵称

成功响应: 

```
{}
```

### 修改当前用户密码

- 方法: `POST`
- URL: `/user`
- Body参数:
- - old_password: 旧的密码
- - new_password: 新的密码

成功响应: 

```
{}
```
> 前端必须让用户输入两次新的密码做一次重复校验，确保用户记得新的密码！

### 注册时校验邮箱与电话是否已被注册

- 方法: `POST`
- URL: `/user/register/check`
- Body参数:
- - type: 注册类型phone或者email
- - value: 对应的值

成功响应: 

```
{
    "error": true 
}
```
- true是已注册 ，flase是未注册



## 角色接口

### 查看角色列表

- 方法: `GET`
- URL: `/role`
- 权限: 管理员权限

成功响应: 

```
[
    {
        "id": 1,
        "name": "普通用户",
        "description": "客户",
        "is_admin": false
    },
    {
        "id": 2,
        "name": "管理员",
        "description": "普通管理员",
        "is_admin": true
    },
    {
        "id": 3,
        "name": "超级管理员",
        "description": "超级管理员, 最高管理权限",
        "is_admin": true
    },
    {
        "id": 4,
        "name": "受限用户",
        "description": "暂停访问权限",
        "is_admin": false
    }
]
```

- id: 角色ID
- name: 角色名
- description: 角色描述
- is_admin: 是否为管理员