const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const userRoute = require('./router/userRoute')

const app = new Koa()
// 注册中间件
app.use(userRoute.routes())
app.use((ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(APP_PORT, () => {
  console.log(`打开项目链接 http://localhost:${APP_PORT}`);
})