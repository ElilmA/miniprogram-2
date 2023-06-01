// pages/patrol.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      patrolPointList:[],
      "nowPositionLatitude":"",
      "nowPositionLongitude":"",
      "nowAddress":'',
      "scanCodeMsg":''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDataList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(options){
    wx.setNavigationBarTitle({
      title: '我的巡更'
    })
    // this.handleGetLocation();

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

  },
  handleGetLocation () {
    //获取位置
    wx.getLocation({
      type: 'gcj02', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
      success: (res) => {
        console.log(res)
        this.nowPositionLatitude = res.latitude
        this.nowPositionLongitude = res.longitude
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  getDataList(){
    let token = wx.getStorageSync('token')
    let headers = {
        'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token
    wx.request({
      url: app.globalData.baseUrl +'/system/patrol/ListByPersonnel',
      method:'GET',
      header:headers,
      success:(res)=>{
        if(res.statusCode==200){
          this.setData({
            patrolPointList:res.data.rows
          })
        }
      }
    })
  },
  toDetail(e) {
    console.log()
    let  patrolPointName = e.currentTarget.dataset.obj.patrolName
    let patrolPointId =  e.currentTarget.dataset.obj.patrolId
    var that = this;
    wx.navigateTo({
      url: '../patrol/patrol?patrolPointId='+patrolPointId+'&patrolPointName='+patrolPointName,
    })
  }
})
