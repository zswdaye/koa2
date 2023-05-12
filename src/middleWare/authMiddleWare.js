const jwt = require('jsonwebtoken')

const { tokenExpiredError, invalidToken } = require('../constant/err.type')

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
module.exports = {
  authToken
}