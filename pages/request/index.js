// pages/request/index.js

const { wxhttp } = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxhttp.request({
      url: '/user/signin',
      method: 'POST',
      header: {},
      data: {
        "signId": '512023124839',
        "signTime": '1596957709933',
        "signCode": '37CA7D9A713FC0330B1259AB0137C193',
        "body": {
            "phone": '13250309350',
            "realName": '莫健峰',
            "idCard": '441521199503073619'
        }
      }
    })
    .then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})