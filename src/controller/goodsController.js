const path = require('path')

const { unsupportedType } = require('../constant/err.type')

class GoodsController {
  async upload(ctx, next) {
    const { file } = ctx.request.files || {}
    const fileType = ['image/jpeg', 'image/png']
    console.log(file);
    if (file && fileType.includes(file.mimetype)) {
      ctx.body = {
        code: '0',
        message: '图片上传成功',
        result: {
          goods_img: path.basename(file.filepath)
        }
      }
    } else {
      console.error('上传类型不符合')
      return ctx.app.emit('error', unsupportedType, ctx)
    }
  }
}

module.exports = new GoodsController