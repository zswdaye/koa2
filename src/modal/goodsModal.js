const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

const Goods = seq.define('zd_goods', {
  goods_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品名称'
  },
  goods_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '商品价格',
  },
  goods_num: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品库存',
  },
  goods_img: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品图片url'
  }
})
/**
 * 使用该方法会创建表
 *  force: true  -即使有表也会删除表，并重新创建
 * 如无需创建表，需要注释掉
 */
// Goods.sync({ force: true })

module.exports = Goods