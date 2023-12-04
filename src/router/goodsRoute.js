const Router = require('koa-router')

const { authToken, hadAdminPermission } = require('../middleWare/authMiddleWare')
const { validator } = require('../middleWare/goodsMiddleWare')

const { upload, create } = require('../controller/goodsController')

const router = new Router({ prefix: '/goods' })
// 上传图片
router.post('/upload', authToken, hadAdminPermission, upload)
// 发布商品
router.post('/publish-product', authToken, hadAdminPermission, validator, create)

module.exports = router