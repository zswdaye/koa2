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









