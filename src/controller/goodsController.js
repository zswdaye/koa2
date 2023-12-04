const path = require('path')

const { unsupportedType, publishGoodsError } = require('../constant/err.type')
const { createGoods } = require('../service/goodsService')

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
  async create(ctx) {
    try {
      const { createdAt, updatedAt, ...res } = await createGoods(ctx.request.body)
      ctx.body = {
        code: '0',
        message: '发布商品成功',
        result: res
      }
    } catch (error) {
      console.error(error);
      return ctx.app.emit('error', publishGoodsError, ctx)
    }
  }
}

module.exports = new GoodsController