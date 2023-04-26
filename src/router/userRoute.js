const Router = require('koa-router')
const { register, login } = require('../controller/userController')

const userRouter = new Router({ prefix: '/users' })

userRouter.post('/register', register)
userRouter.post('/login', login)


module.exports = userRouter