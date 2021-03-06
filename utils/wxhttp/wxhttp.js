/*
  作者: 晨风不可依米(chenfengbukeyimi)
  Github: https://github.com/xiaoyimi
  邮箱: 2590856083@qq.com
  手机: 13250309350

  使用建议: 
    在 app.js 中进行 new 实例操作(const wxhttp = new WXHTTP());
    并赋值给 App 实例(this.wxhttp = wxhttp)

  使用注意:
    如有问题,欢迎交流;
    请求信息头 header 一次配置,实例共享

  待优化事项
    使用 abort 方法,可对 Promise 进行控制(暂未实现)
*/

const { httpConfig, httpMsg } = require('./httpConfig');

class WXHTTP {
  /* 初始化 HTTP 配置 (config 为 Object) */
  constructor (config) {
    
    config = !Array.isArray(config) && typeof config === 'object' ? config : {};

    /* wxhttp 实例配置,用实例未进行配置,则使用默认配置 */
    if (config.withBaseUrl === undefined) { config.withBaseUrl = httpConfig.withBaseUrl; }
    if (config.baseUrl === undefined) { config.baseUrl = httpConfig.baseUrl; }
    if (config.header === undefined) { config.header = httpConfig.header; }
    if (config.isOpenRequestLog === undefined) { config.isOpenRequestLog = httpConfig.isOpenRequestLog; }
    if (config.timeout === undefined) { config.timeout = httpConfig.timeout; }
    if (config.closeLoding === undefined) { config.closeLoding = httpConfig.closeLoding; }

    /* 初始化 wxhttp 配置 */
    this.withBaseUrl = config.withBaseUrl;
    this.baseUrl = config.baseUrl;
    this.header = config.header;
    this.isOpenRequestLog = config.isOpenRequestLog;
    this.timeout = config.timeout;
    this.closeLoding = config.closeLoding;
  }

  /* GET 请求 (options 为 Object) */
  get (options) {
    options.method = 'GET';
    return this.request(options);
  }

  /* POST 请求 (options 为 Object) */
  post (options) {
    options.method = 'POST';
    return this.request(options);
  }

  /* 处理请求参数集合 */
  dealOptions (options) {
    /* 合并 wxhttp 实例配置项 */
    const { withBaseUrl, baseUrl, header, isOpenRequestLog, timeout, closeLoding } = this;

    if (withBaseUrl) { options.url = baseUrl + options.url; }
    options.header = Object.assign(header, options.header);
    options.timeout = timeout;
    options.closeLoding = closeLoding;
    options.isOpenRequestLog = isOpenRequestLog;

    /* 小程序请求的默认参数 */
    const defOptions = {
      url: '',
      method: 'GET',
      header: {},
      data: {},
      dataType: 'json',
      timeout: null,
      responseType: 'text',
      enableHttp2: false,
      enableQuic: false,
      enableCache: false,

      /* 自定义属性,用于请求时是否关闭蒙层弹窗(加载中) */
      closeLoding: false,
    };
    
    options = Object.assign(defOptions, options);
    return options;
  }

  /* 通用请求 (options 为 Object) */
  request (options) {
    options = this.dealOptions(options);
    let {
      url, method, header, data,
      timeout, dataType, responseType,
      enableHttp2, enableQuic, enableCache,
      closeLoding, isOpenRequestLog
    } = options;

    /* 根据当前请求配置是否显示加载蒙层 */
    if (!closeLoding) { wx.showLoading({  title: '加载中...' }); }

    return new Promise((res, rej) => {
      /* 请求前的日志记录 */
      const tips = { url, method, params: data, req_header: header, closeLoding };

      /* 校对请求网址是否输入正确格式 */
      let httpLen = url.match(/http(s)?:/g);
      httpLen = httpLen ? httpLen.length : 0;

      if (httpLen < 1) {
        /* 返回的数据结构同后端返回的数据结构一致 */
        if (!options.closeLoding) { wx.hideLoading(); }
        if (isOpenRequestLog) { this.httpTip(tips); }
        rej({ code: -1, data: null,  msg: '缺少请求网址 http(s)://' });
      }
      if (httpLen > 1) {
        if (!options.closeLoding) { wx.hideLoading(); }
        if (isOpenRequestLog) { this.httpTip(tips); }
        rej({ code: -1, data: null,  msg: '请求网址 http(s):// 填写错误' });
      }
      
      /* 发送请求 */
      wx.request({
        url,
        method,
        data,
        header,
        timeout,
        success: result => {
          if (!options.closeLoding) { wx.hideLoading(); }
          
          const { statusCode, data, errMsg, cookies, header } = result;

          /* 后台数据返回的日志记录 */
          tips.statusCode = statusCode;
          tips.data = data;
          tips.errMsg = errMsg;
          tips.cookies = cookies;
          tips.res_header = header;

          /* 控制台中输出请求日志 */
          if (isOpenRequestLog) { this.httpTip(tips); }
          
          res(result.data);
        },
        fail: error => {
          if (!options.closeLoding) { wx.hideLoading(); }

          /* 控制台中输出请求日志 */
          if (isOpenRequestLog) { this.httpTip(tips); }
          /* 根据项目需求,请自行更改为后台返回同等数据结构的字段属性 */
          /* 例如后台返回: { code, data, msg } 等字段 */
          rej({ code: -1, data: null, msg: '网络异常或请求超时' });
        }
      });
    });
  }

  /* 对所有 Promise 对象进行处理; 若请求出错,则在 catch 返回第一个出错的结果 */
  all (promises) {
    return Promise.all(promises)
  }

  /* 请求日志 */
  httpTip (tips) {
    tips.httpMsg = httpMsg['msg_' + tips.statusCode];
    console.log(tips);
  }

  /* 是否为 Object 类型值 */
  isObject (any) {
    return !Array.isArray(any) && typeof any === 'object';
  }

  /* 是否为字符串格式的 json 对象*/
  isStrJson (strJson) {
    if (this.isObject(strJson)) { return false; }
    const startState = strJson.startsWith('{');
    const endingState = strJson.endsWith('}');
    const isObject = this.isObject(JSON.parse(strJson));
    return startState && endingState && isObject;
  }

  /* 将 json 对象转换为以字符 & 拼接的字符串 */
  json_str (json) {
    let str = '';
    const isStrJson = this.isStrJson(json);
    if (isStrJson) { json = JSON.parse(json); }
    const isObject = this.isObject(json);
    if (isObject) {
      Object.entries(json).forEach(item => {
        const [key, val] = item;
        str += key + '=' + val + '&';
      })
      str = str.slice(0, -1);
    }
    return str;
  }

  /* 将 以字符 & 拼接的字符串转换为json 对象 */
  str_json (str) {
    const json = {};
    let arr = str.split('?');
    arr = arr.length > 1 ? arr[1] : arr[0];
    arr = arr.split('&');
    arr.forEach(item => {
      const [key, val] = item.split('=');
      if (key && val) { json[key] = val; }
    })
    return json;
  }
}

module.exports = WXHTTP;