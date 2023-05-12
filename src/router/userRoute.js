const Router = require('koa-router')

const { verifyUserInfo, userIsExist, cryptPassword, verifyLogin } = require('../middleWare/userMiddleWare')
const { authToken } = require('../middleWare/authMiddleWare')
const { register, login, changePassword } = require('../controller/userController')

const userRouter = new Router({ prefix: '/users' })

userRouter.post('/register', verifyUserInfo, userIsExist, cryptPassword, register)
userRouter.post('/login', verifyUserInfo, verifyLogin, login)
userRouter.patch('/change-password', authToken, cryptPassword, changePassword)

module.exports = userRouter