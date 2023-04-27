const { createUser } = require('../service/userService')
const { userErrorRegisterErr } = require('../constant/err.type')
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
    ctx.body = '登录成功'
  }
}
module.exports = new UserController()