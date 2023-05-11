const Router = require('koa-router')

const { verifyUserInfo, userIsExist, cryptPassword, verifyLogin } = require('../middleWare/userMiddleWare')

const { register, login } = require('../controller/userController')

const userRouter = new Router({ prefix: '/users' })

userRouter.post('/register', verifyUserInfo, userIsExist, cryptPassword, register)
userRouter.post('/login', verifyUserInfo, verifyLogin, login)


module.exports = userRouter