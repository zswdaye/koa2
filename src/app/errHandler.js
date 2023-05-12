module.exports = (errorInfo, ctx) => {
  let status = 500
  switch (errorInfo.code) {
    case '10000': status = 400
      break;
    case '10001': status = 409
      break
    case '10101': status = 401
      break
    default: status = 500
      break
  }
  ctx.status = status
  ctx.body = errorInfo
}