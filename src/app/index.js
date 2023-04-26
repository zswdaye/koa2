const Koa = require('koa')

const userRoute = require('../router/userRoute')

const app = new Koa()
// 注册中间件
app.use(userRoute.routes())

module.exports = app