//app.js

/* App 启动时间锚点 */
const stime = +new Date();

/* 引入小程序状态管理 */
const {
  WXStore,
  pageList,
  setWXState
} = require('./utils/wxstore/wxstore');

/* 引入小程序请求对象 */
const WXHTTP = require('./utils/wxhttp/wxhttp');
const Language = require('./utils/language/index'); 

App({
  /* 仅首次加载 */
  onLaunch: function () {
    
    /* 挂载 wxhttp */
    if (WXHTTP) {
      const wxhttp = new WXHTTP({
        withBaseUrl: true,
        // baseUrl: 'https://github.com/xiaoyimi',
        isOpenRequestLog: true, /* 输出请求日志(true|false) */
        baseUrl: 'http://appnew.gzonline.gov.cn:83'
      });
      this.wxhttp = wxhttp;
      console.log('加载 WXHTTP 耗时::', +new Date() - stime);
    }

    /* 挂载语言包 Language */
    if (Language) { this.Language = Language; }

    setWXState({ name: '筱依米' })

    /* 小程序更新对象 */
    const updateManager = wx.getUpdateManager();
    /* 小程序在冷启动时自动检查更新 */
    updateManager.onCheckForUpdate(res => {
      const { hasUpdate } = res;
      console.log('自动检查更新中', '当前小程序版本为' + (hasUpdate ? '新版本' : '原版本'));
    });
    /* 小程序更新(客户端自动触发) */
    updateManager.onUpdateReady(() => {
      /* 小程序新版本提示 */
      wx.showModal({
        title: '更新提示',
        content: '小程序新版已准备好,请重启应用',
        confirmText: '重启',
        cancelText: '拒绝',
        success: res => {
          /* 强制重启小程序,并使用最新版 */
          updateManager.applyUpdate();
        },
        fail: err => { }
      })
    });

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });

    /* 获取设备信息, 根据缓存决定小程序语种显示 */
    console.log('get language')
    const new_deviceInfo = wx.getSystemInfoSync();
    let deviceInfo = wx.getStorageSync('deviceInfo');
    deviceInfo = deviceInfo ? deviceInfo : {};
    deviceInfo = Object.assign(new_deviceInfo, deviceInfo);
    wx.setStorageSync('deviceInfo', deviceInfo);
  },

  onShow: function () {
    /* 切换后台再进入页面时触发 */
    if (this.Language) {
      const deviceLanguage = wx.getStorageSync('deviceInfo').language;
      console.log('设备语言::', deviceLanguage)
      console.log('set language')
    }


    /* 获取网络类型和网络状态 */
    wx.onNetworkStatusChange(res => {
      console.log(this, res)
    })
  },

  globalData: {
    userInfo: null
  }
})