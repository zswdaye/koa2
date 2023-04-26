## 安装

安装koa、nodemon、dotenv

```powershell
npm i koa --save
npm i nodemon --save
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



