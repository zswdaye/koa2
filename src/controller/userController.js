const { createUser, getUserInfo } = require('../service/userService')
class UserController {
  async register(ctx, next) {
    const params = ctx.request.body || {}
    const { user_name, password } = params || {}
    // 合法性
    if (!user_name || !password) {
      ctx.status = 400
      ctx.body = {
        code: '10000',
        message: '用户名或密码不能为空',
        result: ''
      }
      return
    }
    // 合理性
    if (await getUserInfo(params)) {
      ctx.status = 409
      ctx.body = {
        code: '10001',
        message: '用户已存在，请勿重复注册',
        result: ''
      }
      return
    }
    const res = await createUser(params)
    ctx.body = {
      code: '0',
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name
      }
    }
  }
  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}
module.exports = new UserController()