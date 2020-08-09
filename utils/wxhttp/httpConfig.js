
/* HTTP 请求基本配置 (优先级: new 实例配置 > 当前基本配置) */
const httpConfig = {
  /* 是否启用 baseUrl */
  withBaseUrl: false,
  /* 是否在控制台打印请求日志 */
  isOpenRequestLog: true,
  /* 是否关闭蒙层弹窗(加载中) */
  closeLoding: false,
  /* 请求路径的前面公共部分 */
  baseUrl: '',
  /* 请求信息头 headers */
  header: { 'content-type': 'application/json', },  
  /* 网络请求超时时间(ms) */
  timeout: null,
};

/* HTTP 状态码对应的错误信息,用于请求日志 */
const httpMsg = {
  msg_200: '请求成功',
  msg_301: '请求资源被永久移到其它URL',
  msg_302: '请求资源被临时移到其它URL',
  msg_400: '客户端语法错误',
  msg_401: '请求需要用户身份验证',
  msg_403: '服务器拒绝该请求',
  msg_404: '请求资源不存在',
  msg_500: '服务器内部发生错误',
  msg_501: '服务器网关或代理收到无效请求',
  msg_503: '请求超载或服务器维护中',
};

module.exports = {
  httpConfig,
  httpMsg
};