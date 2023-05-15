const path = require('path')
const Koa = require('koa')
const { koaBody } = require('koa-body')
const KoaStatic = require('koa-static')

const router = require('../router')

const app = new Koa()
// 注册中间件
app.use(koaBody({
  multipart: true, formidable: {
    // 这里不推荐使用相对路径，因为该属性指向的路径是项目路径，而非该文件路径
    uploadDir: path.join(__dirname, '../upload'),
    keepExtensions: true
  }
}))
app.use(KoaStatic(path.join(__dirname, '../upload')))
app.use(router.routes()).use(router.allowedMethods())

const errorHandle = require('./errHandler')
app.on('error', errorHandle)

module.exports = app