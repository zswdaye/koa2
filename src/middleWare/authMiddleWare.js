const jwt = require('jsonwebtoken')

const { tokenExpiredError, invalidToken, notAdminPermission } = require('../constant/err.type')

const { JWT_SECRET } = require('../config/config.default')

const authToken = async (ctx, next) => {
  try {
    const { authorization } = ctx.request.header || {}
    const token = authorization.replace('Bearer ', '')
    // user是payload的内容
    const user = jwt.verify(token, JWT_SECRET);
    ctx.state.user = user
  } catch (error) {
    console.error('error', error)
    switch (error.name) {
      case 'TokenExpiredError':
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        return ctx.app.emit('error', invalidToken, ctx)
      default:
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }
  await next()
}
const hadAdminPermission = async (ctx, next) => {
  const { is_admin } = ctx.state.user
  if (!is_admin) {
    console.error('没有管理员权限', ctx.state.user)
    return ctx.app.emit('error', notAdminPermission, ctx)
  }
  await next()
}
module.exports = {
  authToken,
  hadAdminPermission
}