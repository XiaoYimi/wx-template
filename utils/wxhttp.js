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
*/

const { httpConfig, httpMsg } = require('./config');

class WXHTTP {
  /* 初始化 HTTP 配置 (config 为 Object) */
  constructor (config) {
    
    config = !Array.isArray(config) && typeof config === 'object' ? config : {};

    /* 是否启用 baseUrl */
    if (config.withBaseUrl === undefined) { config.withBaseUrl = true; }

    /* 初始化实例配置 */
    if (!config.baseUrl) { config.baseUrl = ''; }
    if (config.header === undefined) { config.header = {}; }

    config.isOpenRequestLog = config.isOpenRequestLog === undefined ? httpConfig.isOpenRequestLog : config.isOpenRequestLog;

    /* 将实例配置保存到实例 */
    if (config.timeout) { this.timeout = config.timeout; }
    this.withBaseUrl = config.withBaseUrl;
    this.baseUrl = config.withBaseUrl ? (
      config.baseUrl ? config.baseUrl : (httpConfig.baseUrl ? httpConfig.baseUrl : '')
    ) : '';
    this.header = Object.assign(config.header, httpConfig.header);
    /* 是否开启控制台输出请求日志 */
    this.isOpenRequestLog = config.isOpenRequestLog;
  }

  /* GET 请求 */
  get (url, data = {}, header = {}) {
    url = this.baseUrl + url;
    Object.assign(this.header, header);
    return this.request(url, data, header, 'GET');
  }

  /* POST 请求 */
  post (url, data = {}, header = {}) {
    url = this.baseUrl + url;
    header = Object.assign(this.header, header);
    return this.request(url, data, header, 'POST');
  }

  /* 通用 请求 */
  request (url, data, header, method = 'GET') {
    wx.showLoading({  title: '加载中...' });
    return new Promise((res, rej) => {
      /* 请求中是否包含网址 */
      const hasPreHttp = /^http(s)?:/.test(url);

      /* 请求前的日志记录 */
      const tips = { url, method, params: data, req_header: header };

      if (!hasPreHttp) {
        if (this.withBaseUrl) {
          url = this.baseUrl + url;
        } else {
          rej({
            code: -1,
            data: null,
            msg: '请求中 URL 缺少请求网址'
          });
        }
      }
      wx.request({
        url,
        method,
        data,
        header,
        timeout: this.timeout ? this.timeout : null,
        success: result => {
          wx.hideLoading();
          const { statusCode, data, errMsg, cookies, header } = result;

          /* 请求后的日志记录 */
          tips.statusCode = statusCode;
          tips.data = data;
          tips.errMsg = errMsg;
          tips.cookies = cookies;
          tips.res_header = header;

          /* 控制台中输出请求日志 */
          if (this.isOpenRequestLog) { this.httpTip(tips); }
          
          res(result.data);
        },
        fail: error => {
          wx.hideLoading();
          /* 根据项目需求,请自行更改为后台返回同等数据结构的字段属性 */
          /* 例如后台返回: { code, data, msg } 等字段 */
          rej({
            code: -1,
            data: null,
            msg: '网络异常或请求超时'
          });
        }
      });
    });
  }

  /* 对所有 Promise 对象进行处理; 若出错,则在 catch 返回第一个出错的结果 */
  all (promises) {
    return Promise.all(promises)
  }

  /* 请求日志 */
  httpTip (tips) {
    tips.httpMsg = httpMsg['msg_' + tips.statusCode];
    console.log(tips);
  }

  /* 是否为 Object 类型值 */
  isObject (obj) {
    return !Array.isArray(obj) && typeof obj === 'object';
  }

  /* 是否为字符串格式的 json 对象*/
  isStrJson (strJson) {
    const startState = strJson.startsWith('{');
    const endingState = strJson.endsWith('}');
    const isObject = this.isObject(JSON.parse(strJson));
    return startState && endingState && isObject;
  }

  /* 将 json 对象转换为以字符 & 拼接的字符串 */
  json_str (json) {
    let str = '';
    const isObject = this.isObject(json);
    if (isStrJson) { json = JSON.parse(json); }
    const isStrJson = this.isStrJson(json);

    if (isObject) {
      Object.entries(json).forEach(item => {
        const [key, val] = item;
        str += key + '=' + val;
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