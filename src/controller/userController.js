const jwt = require('jsonwebtoken')

const { createUser, getUserInfo, updateUserInfo } = require('../service/userService')
const { userErrorRegisterErr, userLoginErr, changePasswordErr } = require('../constant/err.type')

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
  async changePassword(ctx, next) {
    // 获取数据
    const { id } = ctx.state.user || {}
    const { password } = ctx.request.body || {}
    try {
      // 更新数据库
      if (await updateUserInfo({ id, password })) {
        ctx.body = {
          code: '0',
          message: '修改密码成功',
          result: ''
        }
      } else {
        return ctx.app.emit('error', changePasswordErr, ctx)
      }
    } catch (error) {
      console.error('error', error)
      return ctx.app.emit('error', changePasswordErr, ctx)
    }
  }
}
module.exports = new UserController()