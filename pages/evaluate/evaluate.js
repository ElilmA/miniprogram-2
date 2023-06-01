// pages/evaluate/evaluate.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //星级
    value: 5,
    //评价内容
    evaluate: ''
  },
  onChange(e) {
    this.setData({
      value: e.detail
    })
  },
  //提交
  submit(e) {
    let params = {}
    params.evaluate = this.data.value
    params.remark = this.data.evaluate
    params.state = e.currentTarget.dataset.btnId
    params.newRepairId = this.data.newRepairId
    console.log(params)
    let token = wx.getStorageSync('token')
    let headers = {
      'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token
    wx.request({
      url: app.globalData.baseUrl + '/system/evaluate',
      method: "post",
      header: headers,
      data: params,
      success: (res) => {
        if (res.data.code == 200) {

          wx.showToast({
            title: '提交成功',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 2 //返回上2级页面
            })
          }, 1000)
        }else{
          wx.showToast({
            title: '提交失败，请稍后重试',
            icon:'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      newRepairId: options.newRepairId
    })
    console.log(this.data.newRepairId)
    wx.setNavigationBarTitle({
      title: '评价'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})