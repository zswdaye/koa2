module.exports = {
  userErrorNameOrPwdNull: {
    code: '10000',
    message: '用户名或密码不能为空',
    result: ''
  },
  userErrorExistHad: {
    code: '10001',
    message: '用户已存在，请勿重复注册',
    result: ''
  },
  userErrorRegisterErr: {
    code: '10002',
    message: "用户注册错误",
    result: ""
  },
  userDoesNotExist: {
    code: '10003',
    message: "用户不存在",
    result: ""
  },
  invalidPassword: {
    code: '10004',
    message: "用户名或密码错误",
    result: ""
  },
  userLoginErr: {
    code: '10005',
    message: "用户登录错误",
    result: ""
  },
  tokenExpiredError: {
    code: '10101',
    message: 'token已过期',
    result: ''
  },
  invalidToken: {
    code: '10101',
    message: 'token已失效',
    result: ''
  },
  changePasswordErr: {
    code: '10007',
    message: '修改密码失败',
    result: ''
  },
  notAdminPermission: {
    code: '10102',
    message: '没有管理员权限',
    result: ''
  },
  unsupportedType: {
    code: '10103',
    message: '不支持该类型文件上传',
    result: ''
  },
  goodsFormatErr: {
    code: '10201',
    message: '参数不正确',
    result: ''
  },
  publishGoodsError: {
    code: '10202',
    message: '发布商品失败',
    result: ''
  }
}