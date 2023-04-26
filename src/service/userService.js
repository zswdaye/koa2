class UserService {
  async createUser(params) {
    const { user_name, password } = params || {}
    return { user_name, password }
  }
}

module.exports = new UserService()