// index.js
// 获取应用实例
const app = getApp()
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    phoneNo: '',
    passWord:'',
    loginFlag:false,
    userInfo: {},
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  //注册
  register(){
    wx.navigateTo({
      url: '../register/register',
    })
  },
  onReady(options){
    wx.setNavigationBarTitle({
      title: '登录'
    })
    this.setData({
      phoneNo:wx.getStorageSync('personnelLoginName')||'',
      passWord:wx.getStorageSync('personnelPassword')||''
    })
  },
//   getUserProfile(e) {
//     // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
//     wx.getUserProfile({
//       desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
//       success: (res) => {
//         console.log(res)
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     })
//   },
//   getUserInfo(e) {
//     // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
//     console.log(e)
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
doLogin(){
  this.data.loginFlag = true
  wx.request({
    url:  app.globalData.baseUrl+'/app/login',
    method:'POST',
    data:{
      personnelLoginName:this.data.phoneNo,
      personnelPassword:this.data.passWord
    },
    success:(res)=>{
      if(res.data.code==200){
        wx.setStorage({
          key:'personnelLoginName',
          data:this.data.phoneNo
        })
        wx.setStorage({
          key:'personnelPassword',
          data:this.data.passWord
        })
        this.data.loginFlag = false
        let userToken = res.data.token
        let headers = {
          'content-type': 'application/json',
      }
      headers.Authorization = 'Bearer ' + userToken
        wx.request({
          url: app.globalData.baseUrl+ '/app/info',
          method:'GET',
          header:headers,
          success:(resUser)=>{
            wx.setStorage(
              {
                key:"userInfo",
                data:JSON.stringify(resUser.data.data)
              }
            )
            wx.switchTab({
              url: '../home/index',
            })
          }

        })
        wx.setStorage(
          {
            key:"token",
            data:res.data.token
          }
        )
       
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'error'
        })
        // Toast.fail(res.data.msg);
      }
   
    }
  })
}
})
