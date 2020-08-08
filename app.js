//app.js

/* 开始时间锚点 */
const stime = +new Date();

/* 引入请求对象 */
const WXHTTP = require('./utils/wxhttp');

App({
  /* 仅首次加载 */
  onLaunch: function () {

    /* 挂载 wxhttp */
    if (WXHTTP) {
      const wxhttp = new WXHTTP({
        // baseUrl: 'https://github.com/xiaoyimi',
        isOpenRequestLog: true, /* 输出请求日志(true|false) */
        baseUrl: 'http://appnew.gzonline.gov.cn:83'
      });
      this.wxhttp = wxhttp;
      console.log('加载 WXHTTP 耗时::', +new Date() - stime);
    }

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
    })
    
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
    })
  },

  onShow: function () {
    /* 获取网络类型和网络状态 */
    wx.onNetworkStatusChange(res => {
      console.log(this, res)
    })
  },

  globalData: {
    userInfo: null
  }
})