// pages/request/index.js

const { wxhttp } = getApp();

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzNDYxIiwic3ViIjoie1wiY3JlYXRlVGltZVwiOjE1OTI5MDgzMTEwMDAsXCJkb2N1bWVudGF0aW9uSWRcIjoxLFwiZ2VuZGVyXCI6MCxcImlkXCI6MzQ2MSxcImlkQ2FyZFwiOlwiNTEwNzIyMTk5MDAxMDE2ODcwXCIsXCJpc0FjdGl2ZVwiOjEsXCJpc0NlcnRpZnlcIjoxLFwiaXNGaW5nZXJwcmludFwiOjAsXCJuYW1lXCI6XCJER0Q1MTA3MjIxOTkwMDEwMTY4NzBcIixcInBob25lXCI6XCIxODc4MDEwNjI2OVwiLFwicmVhbE5hbWVcIjpcIumZiOayu-i-vlwifSIsImlzcyI6InpldGlhbl96d3QiLCJpYXQiOjE1OTcwMjQ3NzN9.Gf-QOLxW8kS82835P-boEhQrW0VdQ1xTN_CoA1tYdgg';


Page({
  /**
   * 页面的初始数据
   */
  data: {
    requestList: [
      {
        desc: '社保卡挂失核查',
        url: '/insurance/reduction/preLossReportVerification',
        params: {
          countryCode: 'CHN',
          idType: '1',
          name: '莫健峰',
          idNum: '441521199503073619',
          inlandPass: '',
        }
     }
    ]
  },

  sendRequest (e) {
    const { url, params } = e.currentTarget.dataset;

    const p = '{"a":"bb", "b":12 }';

    console.log('转换', wxhttp.json_str(p))
    
    wxhttp.post({
      url,
      data: params,
      header: {
        'accessToken': accessToken
      }
    }).then(res => {
      console.log('okk::', res)
    }).catch(err => {
      console.log('err::', err)
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wxhttp.request({
    //   url: '/user/signin',
    //   method: 'POST',
    //   header: {},
    //   data: {
    //     "signId": '512023124839',
    //     "signTime": '1596957709933',
    //     "signCode": '37CA7D9A713FC0330B1259AB0137C193',
    //     "body": {
    //         "phone": '13250309350',
    //         "realName": '莫健峰',
    //         "idCard": '441521199503073619'
    //     }
    //   }
    // })
    // .then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // })

    wxhttp.post({
      url: '/house/judicature/getJudicatureType'
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