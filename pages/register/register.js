// pages/register/register.js
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "username": "",
    "phoneNumber": "",
    "password": "",
    "confirmPassword": "",
    loginFlag:false
  },
  register(){
    //提交注册
    if(!this.data.username){
      wx.showToast({
        title: '请填写账号！',
        icon:'none'
      })
      return
    }
    if(!this.data.password){
      wx.showToast({
        title: '请填写密码！',
        icon:'none'
      })
      return
    }
    if(!this.data.confirmPassword){
      wx.showToast({
        title: '请填写密码！',
        icon:'none'
      })
      return
    }
    if(!this.data.phoneNumber){
      wx.showToast({
        title: '请填写手机号！',
        icon:'none'
      })
      return
    }
    if(this.data.confirmPassword!==this.data.password){
      wx.showToast({
        title: '密码输入不一致！',
        icon:'none'

      })
      return
    }
    let params={
      ...this.data
    }
    let token = wx.getStorageSync('token')
    let headers = {
        'content-type': 'application/json',
    }
    // headers.Authorization = 'Bearer ' + token
    wx.request({
      url:app.globalData.baseUrl + '/app/register',
      method:"POST",
      header:headers,
      data:params,
      success:(res)=>{
          if(res.data.code=='200'){
            wx.showToast({
              title: res.data.msg,
              icon:'success'
            })
            wx.navigateBack({
              delta: 1 //返回上一级页面
            })
          }else{
            wx.showToast({
              title: res.data.msg,
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
    wx.setNavigationBarTitle({
      title: '注册'
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