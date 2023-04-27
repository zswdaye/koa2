const Koa = require('koa')
const { koaBody } = require('koa-body')

const userRoute = require('../router/userRoute')

const app = new Koa()
// 注册中间件
app.use(koaBody())
app.use(userRoute.routes())

const errorHandle = require('./errHandler')
app.on('error', errorHandle)

module.exports = app