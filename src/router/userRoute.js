const Router = require('koa-router')

const userRouter = new Router({ prefix: '/users' })

userRouter.get('/', (ctx, next) => {
  ctx.body = 'hello user'
})

module.exports = userRouter