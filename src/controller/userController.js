const jwt = require('jsonwebtoken')

const { createUser, getUserInfo } = require('../service/userService')
const { userErrorRegisterErr, userLoginErr } = require('../constant/err.type')

const { JWT_SECRET } = require('../config/config.default')
class UserController {
  async register(ctx, next) {
    const params = ctx.request.body || {}
    try {
      const res = await createUser(params)
      ctx.body = {
        code: '0',
        message: '用户注册成功',
        result: {
          id: res.id,
          user_name: res.user_name
        }
      }
    } catch (error) {
      console.error('注册用户报错', error)
      ctx.app.emit('error', userErrorRegisterErr, ctx)
      return
    }
  }
  async login(ctx, next) {
    const { user_name } = ctx.request.body || {}
    try {
      const { password, ...resUser } = await getUserInfo({ user_name })
      ctx.body = {
        code: '0',
        message: '用户登录成功',
        result: {
          token: jwt.sign(resUser, JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (error) {
      console.error('error', error)
      return ctx.app.emit('error', userLoginErr, ctx)
    }
  }
}
module.exports = new UserController()