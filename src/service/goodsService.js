const Goods = require('../modal/goodsModal')

class GoodsService {
  async createGoods(goods) {
    const res = await Goods.create(goods)
    return res.dataValues
  }
}

module.exports = new GoodsService()