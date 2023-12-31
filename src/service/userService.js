const User = require('../modal/userModal')
class UserService {
  async createUser(params) {
    const { user_name, password } = params || {}
    // 使用create来执行数据库的inset操作
    const res = await User.create({ user_name, password })
    // 返回执行结果
    return res.dataValues
  }
  async getUserInfo(params) {
    const res = await User.findOne({
      attributes: ['id', 'user_name', 'password', 'is_admin'],
      where: params
    })
    return res ? res.dataValues : null
  }
  async updateUserInfo(params) {
    const { id, ...newUser } = params
    const res = await User.update(newUser, { where: { id } })
    return res[0] > 0 ? true : false
  }
}

module.exports = new UserService()