const app = require('./app')

const { APP_PORT } = require('./config/config.default')

app.listen(APP_PORT, () => {
  console.log(`打开项目链接 http://localhost:${APP_PORT}`);
})