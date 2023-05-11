const bcrypt = require('bcryptjs')

const { getUserInfo } = require('../service/userService')
const { userErrorNameOrPwdNull, userErrorExistHad, userDoesNotExist, invalidPassword, userLoginErr } = require('../constant/err.type')

module.exports = {
  async verifyUserInfo(ctx, next) {
    const { user_name, password } = ctx.request.body || {}
    if (!user_name || !password) {
      ctx.app.emit('error', userErrorNameOrPwdNull, ctx)
      return
    }
    await next()
  },
  async userIsExist(ctx, next) {
    const { user_name } = ctx.request.body || {}
    try {
      const res = await getUserInfo({ user_name })
      if (res) {
        console.log('userInfo', res);
        ctx.app.emit('error', userErrorExistHad, ctx)
        return
      }
    } catch (error) {
      console.error('查询用户报错', error)
      ctx.app.emit('error', userErrorExistHad, ctx)
      return
    }
    await next()
  },
  async cryptPassword(ctx, next) {
    const { password } = ctx.request.body || {}
    // 加盐加密
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    ctx.request.body.password = hash
    await next()
  },
  async verifyLogin(ctx, next) {
    const { user_name, password } = ctx.request.body || {}
    try {
      // 1.验证用户是否存在
      const res = await getUserInfo({ user_name })
      if (!res) {
        console.error('用户不存在')
        return ctx.app.emit('error', userDoesNotExist, ctx)
      }
      // 2.验证密码是否正确
      const passwordIsTrue = bcrypt.compareSync(password, res.password);
      if (!passwordIsTrue) {
        console.error('用户名或密码错误')
        return ctx.app.emit('error', invalidPassword, ctx)
      }
    } catch (error) {
      console.error('用户登录报错', error)
      return ctx.app.emit('error', userLoginErr, ctx)
    }
    await next()
  }
}