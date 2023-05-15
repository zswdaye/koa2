const Router = require('koa-router')

const { authToken, hadAdminPermission } = require('../middleWare/authMiddleWare')

const { upload } = require('../controller/goodsController')

const router = new Router({ prefix: '/goods' })

router.post('/upload', authToken, hadAdminPermission, upload)

module.exports = router