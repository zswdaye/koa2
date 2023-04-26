const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

// 创建模型(Modal zd_user -> 表 zd_users)
const User = seq.define('zd_user', {
  // id 会被sequelize自动创建、管理
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名，唯一'
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码'
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员，0：不是管理员；1：是管理员'
  }
}, {
  // sequelize创建表的时候会自动创建时间戳字段，使用timestamps配置可以禁用此操作
  timestamps: false
})
/**
 * 使用该方法会创建表
 *  force: true  -即使有表也会删除表，并重新创建
 * 如无需创建表，需要注释掉
 */
// User.sync({ force: true })

module.exports = User