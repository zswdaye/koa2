const Router = require('koa-router')

const { verifyUserInfo, userIsExist } = require('../middleWare/userMiddleWare')

const { register, login } = require('../controller/userController')

const userRouter = new Router({ prefix: '/users' })

userRouter.post('/register', verifyUserInfo, userIsExist, register)
userRouter.post('/login', login)


module.exports = userRouter