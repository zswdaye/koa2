const Router = require('koa-router')

const { authToken, hadAdminPermission } = require('../middleWare/authMiddleWare')

const router = new Router({ prefix: '/goods' })

router.post('/upload', authToken, hadAdminPermission, (ctx, next) => {
  ctx.body = '上传商品图片成功'
})

module.exports = router