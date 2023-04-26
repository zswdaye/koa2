const User = require('../modal/userModal')
class UserService {
  async createUser(params) {
    const { user_name, password } = params || {}
    // 使用create来执行数据库的inset操作
    const res = await User.create({ user_name, password })
    // 返回执行结果
    return res.dataValues
  }
}

module.exports = new UserService()