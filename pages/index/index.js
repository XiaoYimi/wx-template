//index.js
//获取应用实例
const app = getApp()

console.log(app, 'index-app')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    /* 开发列表(tag 英文名, name 中文译, state 开发状态, url 跳转路径) */
    developList: [
      { tag: 'calendar', name: '日历组件的封装', state: true, url: '../calendar/index' },
      { tag: 'request', name: '小程序请求二次封装', state: true, url: '../request/index' },
      { tag: 'language', name: '多语言切换组件的封装', state: false, url: '../language/index' }
    ]
  },

  hrefTo(e) {
    const { url } = e.currentTarget.dataset
    if (url) { wx.navigateTo({ url }); }
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.setData({ [`$wxstate.author`]: 'xiaoyimi' })

    console.log('index data::', this)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow: function () {
    console.log('index onshow')
  }
})
