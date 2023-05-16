## 安装

安装koa、nodemon、dotenv

```powershell
npm i koa --save
npm i nodemon --D
npm i dotenv --save
```

1. nodemon

   自动更新服务

2. dotenv

   读取配置文件。会读取根目录中的`.env`文件，并将配置写入`process.env`中

   ```js
   // 创建.env文件
   APP_PORT = 8000
   ```

   在`src/config/config.default.js`文件中，引用dotev，并将`process.env`导出

   ```js
   const dotenv = require('dotenv')
   
   dotenv.config()
   
   module.exports = process.env
   ```

   使用

   ```js
   const { APP_PORT } = require('./config/config.default')
   ```

## 书写demo

```js
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(APP_PORT, () => {
  console.log(`打开项目链接 http://localhost:${APP_PORT}`);
})
```

## 添加路由

### 安装koa-router包

```powershell
npm i koa-router
```

### 使用

1. 实例化对象

```js
const Router = require('koa-router')
const userRoute = new Router()
// 可以使用 prefix 来给该实例化的路由添加前缀 '/users'
const userRouter = new Router({ prefix: '/users' })
```

2. 编写路由

```js
userRoute.get('/user', (ctx, next) => {
  ctx.body = 'hello user'
})
```

3. 注册中间件

```js
app.use(userRoute.routes())
```

## 目录结构优化

### http服务和app业务拆分

新建app文件夹，将koa相关代码迁移

```js
const Koa = require('koa')

const userRoute = require('./router/userRoute')

const app = new Koa()
// 注册中间件
app.use(userRoute.routes())

module.exports = app
```

改写main.js

```js
const app = require('./app')

const { APP_PORT } = require('./config/config.default')

app.listen(APP_PORT, () => {
  console.log(`打开项目链接 http://localhost:${APP_PORT}`);
})
```

### 路由和控制器拆分

路由：解析URL，分发给控制器对应的方法

控制器：处理不同的业务

新建controller文件夹，新建处理用户相关的控制器`userController.js`

```JS
class UserController {
  async register(ctx, next) {
    ctx.body = '注册成功'
  }
  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}
module.exports = new UserController()
```

用户路由文件中引入用户控制器，并将对应的方法写入对应的方法中

```js
const { register, login } = require('../controller/userController')

userRouter.post('/register', register)
userRouter.post('/login', login)
```

## 解析body

### 安装`koa-body`

```powershell
npm i koa-body
```

### 使用`koa-body`

```js
// app.js
const { koaBody } = require('koa-body')
// 注册中间件
app.use(koaBody())
```

### 解析请求数据

新建service文件夹，新建userService文件，用来处理操作数据库相关操作

```js
// userService.js
class UserService {
  async createUser(params) {
    const { user_name, password } = params || {}
    return { user_name, password }
  }
}

module.exports = new UserService()
```

controll文件中引入service文件

```js
// userController.js
const { createUser } = require('../service/userService')
class UserController {
  async register(ctx, next) {
    const params = ctx.request.body || {}
    ctx.body = await createUser(params)
  }
  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}
module.exports = new UserController()
```

## 数据库操作

sequelize：ORM数据库工具

ORM：对象关系映射

- 数据表映射（对应）一个类
- 数据表中的数据行（记录）对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

### 安装

需要安装两个包`mysql2`、`sequelize`

sequelize最低支持`MySQL` 5.7版本

```powershell
npm i mysql2 sequelize
```

### 编写配置文件

```js
// .env
MYSQL_HOST = 'localhost'
MYSQL_PORT = '3306'
MYSQL_USER = 'root'
MYSQL_PASSWORD = '236183'
MYSQL_DB = 'zdsc'
```

### 连接数据库

新建db文件夹，新建seq.js文件

```js
// seq.js
const { Sequelize } = require('sequelize')
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = require('../config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: 'mysql'
})
// 测试数据的连接，需要注释掉
seq.authenticate().then(() => {
  console.log('数据库连接成功');
}).catch((err) => {
  console.log('数据库连接失败', err);
})

module.exports = seq
```

## 创建User模型

创建modal文件夹，新建userModal.js文件

```js
const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

// 创建模型(Modal zd_user -> 表 zd_users)
const User = seq.define('zd_user', {
  // id 会被sequelize自动创建、管理
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名，唯一'
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码'
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员，0：不是管理员；1：是管理员'
  }
}, {
  // sequelize创建表的时候会自动创建时间戳字段，使用timestamps配置可以禁用此操作
  timestamps: false
})
/**
 * 使用该方法会创建表
 *  force: true  -即使有表也会删除表，并重新创建
 * 如无需创建表，需要注释掉
 */
// User.sync({ force: true })

module.exports = User
```

## 添加用户入库

service层操作数据库

```js
// userService.js
const User = require('../modal/userModal')
class UserService {
  async createUser(params) {
    const { user_name, password } = params || {}
    // 使用create来执行数据库的inset操作
    const res = await User.create({ user_name, password })
    // 返回执行结果
    return res.dataValues
  }
}
...
```

controller层返回执行结果

```js
// userController.js
...
const res = await createUser(params)
ctx.body = {
    code: '0',
    message: '用户注册成功',
    result: {
        id: res.id,
        user_name: res.user_name
    }
}
...
```

## 错误处理

### 合法性

验证用户输入的合法性

```js
// userController.js
...
if (!user_name || !password) {
    ctx.status = 400
    ctx.body = {
        code: '10000',
        message: '用户名或密码不能为空',
        result: ''
    }
    return
}
...
```

### 合理性

验证数据库里是否存在

```js
// userService.js
...
async getUserInfo(params) {
    const res = await User.findOne({
        attributes: ['id', 'user_name', 'password', 'is_admin'],
        where: params
    })
    return res ? res.dataValues : null
}
...
```

```js
// userController.js
...
if (await getUserInfo({ user_name })) {
    ctx.status = 409
    ctx.body = {
        code: '10001',
        message: '用户已存在，请勿重复注册',
        result: ''
    }
    return
}
...
```

## 拆分中间件

### 错误处理拆分成中间件

新建middleWare文件夹，新增userMiddleWare.js

```js
// userMiddleWare.js
module.exports = {
  async verifyUserInfo(ctx, next) {
    const { user_name, password } = ctx.request.body || {}
    if (!user_name || !password) {
      ctx.status = 400
      ctx.body = {
        code: '10000',
        message: '用户名或密码不能为空',
        result: ''
      }
      return
    }
    await next()
  },
  async userExist(ctx, next) {
    const { user_name } = ctx.request.body || {}
    if (await getUserInfo({ user_name })) {
      ctx.status = 409
      ctx.body = {
        code: '10001',
        message: '用户已存在，请勿重复注册',
        result: ''
      }
      return
    }
    await next()
  }
}
```

改写`userRoute.js`和`userController.js`文件

```js
/* userController.js */
// 删除合法性和合理性的判断条件，因为都封装到了中间件上去了
/* userRoute.js */
const { verifyUserInfo, userIsExist } = require('../middleWare/userMiddleWare')
...
userRouter.post('/register', verifyUserInfo, userIsExist, register)
...
```

### 将错误处理返回值拆分

新建常量文件夹constant，新建`err.type.js`文件，放置错误返回值

```js
// err.type.js
module.exports = {
  userErrorNameOrPwdNull: {
    code: '10000',
    message: '用户名或密码不能为空',
    result: ''
  },
  userErrorExistHad: {
    code: '10001',
    message: '用户已存在，请勿重复注册',
    result: ''
  },
}
```

改写`userMiddleWare.js`文件

```js
// userMiddleWare.js
const { userErrorNameOrPwdNull, userErrorExistHad } = require('../constant/err.type')
...
async verifyUserInfo(ctx, next) {
    const { user_name, password } = ctx.request.body || {}
    if (!user_name || !password) {
        // 使用emit方法将错误抛出
        ctx.app.emit('error', userErrorNameOrPwdNull, ctx)
        return
    }
    await next()
},
async userIsExist(ctx, next) {
    const { user_name } = ctx.request.body || {}
    if (await getUserInfo({ user_name })) {
        ctx.app.emit('error', userErrorExistHad, ctx)
        return
    }
    await next()
}
...
```

改写`app/index.js`文件

```js
// app/index.js
...
// 接受'error'抛出的参数
app.on('error', (errInfo, ctx) => {
  // errorINfo，ctx是emit方法抛出的参数
  ctx.status = 500
  ctx.body = errInfo
})
...
```

### 将错误类型进行拆分

新建`app/errHandle.js`文件

```js
// app/errHandle.js
module.exports = (errorInfo, ctx) => {
  let status = 500
  switch (errorInfo.code) {
    case '10000': status = 400
      break;
    case '10001': status = 409
      break
    default: status = 500
      break
  }
  ctx.status = status
  ctx.body = errorInfo
}
```

改写`index.js`文件

```js
// index.js
...
const errorHandle = require('./errHandler')
app.on('error', errorHandle)
...
```

### 对代码进行错误处理

对操作数据库的代码进行`try catch`处理，增加代码的健壮性

改写`userMiddleWare.js`文件

```js
// userMiddleWare.js
...
async userIsExist(ctx, next) {
    const { user_name } = ctx.request.body || {}
    try {
        const res = await getUserInfo({ user_name })
        if (res) {
            ctx.app.emit('error', userErrorExistHad, ctx)
            return
        }
    } catch (error) {
        console.error('查询用户报错', error)
        ctx.app.emit('error', userErrorExistHad, ctx)
        return
    }
    await next()
}
...
```

改写`userController.js`文件

```js
// userController.js
...
try {
    const res = await createUser(params)
    ctx.body = {
        code: '0',
        message: '用户注册成功',
        result: {
            id: res.id,
            user_name: res.user_name
        }
    }
} catch (error) {
    console.error('注册用户报错', error)
    ctx.app.emit('error', userErrorRegisterErr, ctx)
    return
}
...
```

## 密码加密

### 安装`bcryptjs`

```powershell
npm i bcryptjs
```

### 编写中间件

在`middleWare/userMiddleWare.js`文件中书写新的中间件

```js
// userMiddleWare.js
const bcrypt = require('bcryptjs')
...
async cryptPassword(ctx, next) {
    const { password } = ctx.request.body || {}
    // 加盐加密
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    ctx.request.body.password = hash
    await next()
}
...
```

### 注册中间件

在`router/userRoute.js`中注册中间件

```js
// userRoute.js
const { cryptPassword } = require('../middleWare/userMiddleWare')
...
userRouter.post('/register', verifyUserInfo, userIsExist, cryptPassword, register)
...
```

## 用户登录

### 添加验证中间件

1. 使用之前写过的 验证用户输入是否正确的中间件

2. 新写一个验证登录的中间件

定义错误类型 

```js
// constant/err.type.js
module.exports = {
    ...
    userDoesNotExist: {
        code: '10003',
        message: "用户不存在",
        result: ""
    },
    invalidPassword: {
        code: '10004',
        message: "用户名或密码错误",
        result: ""
    },
    userLoginErr: {
        code: '10005',
        message: "用户登录错误",
        result: ""
    },
}
```

书写中间件

```js
// middleWare/userMiddleWare.js
const { userDoesNotExist, invalidPassword, userLoginErr } = require('../constant/err.type')
...
async verifyLogin(ctx, next) {
    const { user_name, password } = ctx.request.body || {}
    try {
      // 1.验证用户是否存在
      const res = await getUserInfo({ user_name })
      if (!res) {
        console.error('用户不存在')
        return ctx.app.emit('error', userDoesNotExist, ctx)
      }
      // 2.验证密码是否正确
      const passwordIsTrue = bcrypt.compareSync(password, res.password);
      if (!passwordIsTrue) {
        console.error('用户名或密码错误')
        return ctx.app.emit('error', invalidPassword, ctx)
      }
    } catch (error) {
      console.error('用户登录报错', error)
      return ctx.app.emit('error', userLoginErr, ctx)
    }
    await next()
}
...
```

注册中间件

```js
// router/userRoute.js
const { verifyUserInfo, verifyLogin } = require('../middleWare/userMiddleWare')
...
userRouter.post('/login', verifyUserInfo, verifyLogin, login)
...
```

### 颁发token

使用jwt来颁发token

jwt：json web token

- header: 头部
- payload：json对象
- signature：签名

安装jsonwebtoken

```powershell
npm i jsonwebtoken
```

新增签名

```powershell
JWT_SECRET = 'xzd'
```

引入使用

```js
// controller/userController.js
const jwt = require('jsonwebtoken')
const { getUserInfo } = require('../service/userService')
const { userLoginErr } = require('../constant/err.type')
const { JWT_SECRET } = require('../config/config.default')
...
async login(ctx, next) {
    const { user_name } = ctx.request.body || {}
    try {
      // 获取id,user_name,is_admin数据当作payload
      const { password, ...resUser } = await getUserInfo({ user_name })
      ctx.body = {
        code: '0',
        message: '用户登录成功',
        result: {
          // { expiresIn: '1d' } 设置过期时间1天
          token: jwt.sign(resUser, JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (error) {
      console.error('error', error)
      return ctx.app.emit('error', userLoginErr, ctx)
    }
}
...
```

### 验证token

定义错误类型

```js
// constant/err.type.js
...
tokenExpiredError: {
    code: '10101',
    message: 'token已过期',
    result: ''
  },
  invalidToken: {
    code: '10101',
    message: 'token已失效',
    result: ''
},
...
```

错误回调处理

```js
// app/errHandler.js
...
case '10101': status = 401
  break
...
```

书写新的中间件

```js
// middleWare/authMiddleWare.js
const jwt = require('jsonwebtoken')

const { tokenExpiredError, invalidToken } = require('../constant/err.type')

const { JWT_SECRET } = require('../config/config.default')

const authToken = async (ctx, next) => {
  try {
    const { authorization } = ctx.request.header || {}
    const token = authorization.replace('Bearer ', '')
    // user是payload的内容
    const user = jwt.verify(token, JWT_SECRET);
    console.log('user', user);
    ctx.state.user = user
  } catch (error) {
    console.error('error', error)
    switch (error.name) {
      case 'TokenExpiredError':
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        return ctx.app.emit('error', invalidToken, ctx)
      default:
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }
  await next()
}
module.exports = {
  authToken
}
```

引入中间件

```js
// router/userRoute.js
const { authToken } = require('../middleWare/authMiddleWare')
...
userRouter.patch('/', authToken, (ctx, next) => {
  ctx.body = '修改密码'
})
...
```

## 修改密码

### 书写错误类型

```js
// constant/err.type.js
...
changePasswordErr: {
    code: '10007',
    message: '修改密码失败',
    result: ''
}
...
```

### 编写service层

```js
// service/userService.js
...
async updateUserInfo(params) {
    const { id, ...newUser } = params
    const res = await User.update(newUser, { where: { id } })
    return res[0] > 0 ? true : false
}
...
```

### 编写控制层

```js
// controller/useController.js
const { updateUserInfo } = require('../service/userService')
const { changePasswordErr } = require('../constant/err.type')
...
async changePassword(ctx, next) {
    // 获取数据
    const { id } = ctx.state.user || {}
    const { password } = ctx.request.body || {}
    try {
      // 更新数据库
      if (await updateUserInfo({ id, password })) {
        ctx.body = {
          code: '0',
          message: '修改密码成功',
          result: ''
        }
      } else {
        return ctx.app.emit('error', changePasswordErr, ctx)
      }
    } catch (error) {
      console.error('error', error)
      return ctx.app.emit('error', changePasswordErr, ctx)
    }
}
...
```

### 编写路由层

```js
// router/userRoute.js
const { cryptPassword } = require('../middleWare/userMiddleWare')
const { authToken } = require('../middleWare/authMiddleWare')
const { changePassword } = require('../controller/userController')
...
userRouter.patch('/change-password', authToken, cryptPassword, changePassword)
...
```

## 路由自动加载

新建路由`index.js`文件

```js
// router/index.js
const fs = require('fs')
const Router = require('koa-router')

const router = new Router()

fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'index.js') {
    let route = require('./' + file)
    router.use(route.routes())
  }
})

module.exports = router
```

在`app/index.js`中注册

```js
const router = require('../router')
...
// 第一个use是注册路由，第二个use是在没有符合路由类型(Method)的情况下抛出错误
app.use(router.routes()).use(router.allowedMethods())
...
```

## 上传图片

### 验证是否登录

新建商品路由文件`goodsRoute.js`

```js
// router/goodsRoute.js
const Router = require('koa-router')

const { authToken } = require('../middleWare/authMiddleWare')

const router = new Router({ prefix: '/goods' })

router.post('/upload', authToken, (ctx, next) => {
  ctx.body = '上传商品图片成功'
})

module.exports = router
```

### 验证是否有管理员权限

书写错误类型

```js
// constant/err.type.js
...
notAdminPermission: {
    code: '10102',
    message: '没有管理员权限',
    result: ''
}
...
```

编写中间件

```js
// middleWare/authMiddleWare.js
const { notAdminPermission } = require('../constant/err.type')
...
const hadAdminPermission = async (ctx, next) => {
  const { is_admin } = ctx.state.user
  if (!is_admin) {
    console.error('没有管理员权限', ctx.state.user)
    return ctx.app.emit('error', notAdminPermission, ctx)
  }
  await next()
}
...
```

编写路由层

```js
// router/goodsRoute.js
const { authToken, hadAdminPermission } = require('../middleWare/authMiddleWare')
...
router.post('/upload', authToken, hadAdminPermission, (ctx, next) => {
  ctx.body = '上传商品图片成功'
})
...
```

### 完成上传接口

#### 安装插件

`koa-static`插件可以使得本地资源能够被访问，让上传的接口可以通过`localhost:8000/d5726cd9bb96c7a888ae7bd00.png`来访问上传图片

```js
npm i koa-static
```

#### 插件配置

```js
// app/index.js
const path = require('path')
const KoaStatic = require('koa-static')
...
app.use(koaBody({
  multipart: true, formidable: {
    // 这里不推荐使用相对路径，因为该属性指向的路径是项目路径，而非该文件路径
    uploadDir: path.join(__dirname, '../upload'),
    keepExtensions: true
  }
}))
// 配置本地资源的访问路径
app.use(KoaStatic(path.join(__dirname, '../upload')))
...
```

#### 编写错误类型

```js
// constant/err.type.js
...
unsupportedType: {
    code: '10103',
    message: '不支持该类型文件上传',
    result: ''
}
...
```

#### 编写控制层

新建`goodsController.js`文件

```js
// controller/goodsController.js
const path = require('path')

const { unsupportedType } = require('../constant/err.type')

class GoodsController {
  async upload(ctx, next) {
    const { file } = ctx.request.files || {}
    const fileType = ['image/jpeg', 'image/png']
    console.log(file);
    if (file && fileType.includes(file.mimetype)) {
      ctx.body = {
        code: '0',
        message: '图片上传成功',
        result: {
          goods_img: path.basename(file.filepath)
        }
      }
    } else {
      console.error('上传类型不符合')
      return ctx.app.emit('error', unsupportedType, ctx)
    }
  }
}

module.exports = new GoodsController
```

#### 编写路由层

```js
// router/goodsRoute.js
const { upload } = require('../controller/goodsController')
...
router.post('/upload', authToken, hadAdminPermission, upload)
...
```

## 统一参数格式校验

### 安装插件

```powershell
npm i koa-parameter
```

### 使用

在`app/index.js`中引入使用

```js
// app/index.js
const parameter = require('koa-parameter')
...
// 需要注册在路由之前
app.use(parameter(app))
...
```

### 编写错误类型

```js
// constant/err.type.js
...
goodsFormatErr: {
    code: '10201',
    message: '参数不正确',
    result: ''
}
...
```

### 编写中间件

新建`goodsMiddleWare.js`文件

```js
// middleWare/goodsMiddleWare.js
const { goodsFormatErr } = require('../constant/err.type')
const validator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      goods_name: { type: 'string', required: true },
      goods_price: { type: 'number', required: true },
      goods_num: { type: 'number', required: true },
      goods_img: { type: 'string', required: true }
    })
  } catch (error) {
    console.error(error)
    goodsFormatErr.result = error
    return ctx.app.emit('error', goodsFormatErr, ctx)
  }
  await next()
}

module.exports = {
  validator
}
```

### 编写路由

```js
const { validator } = require('../middleWare/goodsMiddleWare')
...
// 发布商品
router.post('/publish-product', authToken, hadAdminPermission, validator, (ctx, next) => {
  ctx.body = '发布商品成功'
})
...
```





