const bcrypt = require('bcryptjs')

const { getUserInfo } = require('../service/userService')
const { userErrorNameOrPwdNull, userErrorExistHad } = require('../constant/err.type')

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
  }
}