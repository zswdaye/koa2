const Koa = require('koa')
const { koaBody } = require('koa-body')

const router = require('../router')

const app = new Koa()
// 注册中间件
app.use(koaBody())
app.use(router.routes()).use(router.allowedMethods())

const errorHandle = require('./errHandler')
app.on('error', errorHandle)

module.exports = app