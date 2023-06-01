// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    bannerList:[
      {
        imgurl:'./img/img.webp'
      },
      {
        imgurl:'./img/img.webp'
      },
      {
        imgurl:'./img/img.webp'
      },
      {
        imgurl:'./img/img.webp'
      },
      {
        imgurl:'./img/img.webp'
      }
    ],
    personnelName:''
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    this.setData({
      personnelName:userInfo.personnelName,
      deptName:userInfo.dept.deptName
    })
  },
  onShow:function() {
    this.getTabBar().init();
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  logout(){
    let that = this
    let token = wx.getStorageSync('token')
    let headers = {
        'content-type': '',
        'client_id': 'webApp',
        'client_secret': '123456',
    }
    headers.Authorization = 'Bearer ' + token
    wx.request({
      url: app.globalData.baseUrl +'/logout',
      method:'POST',
      header:headers,
      success:(res)=>{
        if(res.statusCode==200){
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('personnelLoginName')
          wx.removeStorageSync('personnelPassword')
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    })
  }
})
