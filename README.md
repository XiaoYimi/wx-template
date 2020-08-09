# wx-template
小程序基本架构,一切从这里开始开发

## 工具库
- [x] WXHTTP: 小程序原生请求 request 的封装.

- [x] WXStore: 小程序状态管理模式(全局变量).

- [ ] Compress: 图片压缩技术的封装.

- [ ] Tools: 常用工具库的封装.



## 组件
- [x] Calendar: 日历组件(单模式).

- [ ] Language: 语言库切换(需自行添加语言映射表)



## 工具库的使用

### WXHTTP



#### 使用

- 在 app.js 中引入文件 wxhttp.js.
- 在 app.js 中 onLauch 函数中通过 new 操作进行实例化并配置,且通过 this.wxhttp = wxhttp 来实现挂在到 App 实例中,以便整个 App 中都能够使用.

```js
const WXHTTP = require('./utils/wxhttp.js');

APP({
  onLauch: function () {
  	const wxhttp = new WXHTTP({
  	  baseUrl: 'https://github.com/XiaoYimi/wx-template',
  	  /* 其它配置项,详见下方配置 */
  	})
  }
})
```



#### 配置 (config)

| 属性             | 类型         | 必填 | 默认  | 描述                                   |
| ---------------- | ------------ | ---- | ----- | -------------------------------------- |
| withBaseUrl      | Boolean      | 否   | false | 启用 config.baseUrl                    |
| baseUrl          | String       | 否   | ''    | 配置网络请求实例的请求地址公共部分     |
| header           | Object       | 否   | {}    | 配置网络请求实例的信息头               |
| timeout          | Number\|Null | 否   | null  | 配置网络请求实例的超时时间             |
| closeLoding      | Boolean      | 否   | false | 请求中是否关闭蒙层弹窗(加载中)         |
| isOpenRequestLog | Boolean      | 否   | true  | 跟踪网络请求,,由控制台打印输出请求日志 |



#### 方法 (wxhttp)

##### get(Object options)

小程序发起网络 GET 请求, options 为 Object 类型数据, 其数据结构参考 wx.request (不包含 success, fail, complite).



##### post(Object options)

小程序发起网络 POST 请求, options 为 Object 类型数据, 其数据结构参考 wx.request (不包含 success, fail, complite).



##### request(Object options)

小程序发起网络请求, options 为 Object 类型数据, 其数据结构参考 wx.request (不包含 success, fail, complite).



##### dealOptions(Object options)

在小程序发起网络请求前, 对 options 参数进行处理(合并 wxhttp 配置和小程序默认配置).



##### all(Array promises)

针对多个并发网络请求进行整合成一个 Promise 来处理; 网络请求出错,则在 catch 输出第一个错误的信息.



##### httpTip(Object tips)

跟踪小程序发起网络请求,并在控制台输入请求日志; 可通过 wxhttp.isOpenRequestLog 设置 true|false 来决定是否打开请求日志;

**建议在开发过程中开启此选项,发布上线时请记得关闭.**



##### isObject(Any any)

判断参数 any 是否为 Object 类型值, 返回 Boolean.



##### isStrJson(String strJson)

判断参数 strJson 是否为字符串类型的 json 体, 返回 Boolean.



##### json_str(Object  obj)

将参数转换成 key=value, 并返回以字符 '&' 拼接成的字符串(不包含首字符 ?).常用于网络 GET 请求中地址携带的参数字符集.



##### str_json(String str)

将参数(请求中地址携带的参数字符集)转换成 Object 对象, (参数可包含首字符 ?).常用于网络请求地址的参数解析.







