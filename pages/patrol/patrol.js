// pages/patrol.js
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      patrolPointList:[],
      "nowPositionLatitude":"",
      "nowPositionLongitude":"",
      "nowAddress":'',
      "scanCodeMsg":'',
      patrolId: null,
      patrolPointName: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // let optionsPatrolPointId = options.patrolPointId
    // let codeStr = options.codeMsg
    // this.setData({
    //   codeMsg : JSON.parse(codeStr).data,
    //   patrolPointName:options.patrolPointName,
    //   patrolPointId:options.patrolPointId
    // })
    this.getDataList(options.patrolPointId,options.patrolPointName)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(options){
    wx.setNavigationBarTitle({
      title: '我的巡更点'
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
   
  },
  getDataList(PatrolId,patrolPointName){
    let token = wx.getStorageSync('token')
    let headers = {
        'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token
    wx.request({
      url:app.globalData.baseUrl + '/system/point/PointListByPatrol/'+PatrolId,
      method:'GET',
      header:headers,
      success:(res)=>{
        if(res.statusCode==200){
          this.setData({
            patrolPointList:res.data.rows,
            patrolId:PatrolId,
            patrolPointName:patrolPointName
          })
        }
      }
    })
  },
  scanCode(e) {
    let token = wx.getStorageSync('token')
    let headers = {
        'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token
    let  patrolPointName = e.currentTarget.dataset.obj.patrolPointName
    let patrolPointId =  e.currentTarget.dataset.obj.patrolPointId
    let patrolId = e.currentTarget.dataset.obj.patrolId
    var that = this;
    wx.scanCode({ //扫描API
      success(res) { //扫描成功
        // console.log("RES:"+res) //输出回调信息
        let resData = JSON.parse(res.result)
        
      
         //获取位置
        wx.getLocation({
          type: 'gcj02', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
          success: (res) => {
            console.log(res)
            console.log(resData)
            // console.log(optionsPatrolPointId)
            that.nowPositionLatitude = res.latitude
            that.nowPositionLongitude = res.longitude
            let lat1 = res.latitude
            let lng1 = res.longitude
            let lat2 = resData.data.patrolPointLatitude
            let lng2 = resData.data.patrolPointLongitude
            let rad1 = lat1 * Math.PI / 180.0
            let rad2 = lat2 * Math.PI / 180.0
            let a = rad1 - rad2
            let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
            let r = 6378137
            let distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2),2)+Math.cos(rad1) * Math.cos(rad2)*Math.pow(Math.sin(b/2),2)))
            console.log(distance)
            console.log(parseInt(distance*1000)/1000)
            // console.log(patrolPointId != resData.data.patrolPointId)
            if(parseInt(distance*1000)/1000>2000){
              wx.showToast({
                title: '未在指定位置',
                duration: 1000
              })
            }else{
              wx.showToast({
                title: '成功',
                duration: 1000
              })
              that.setData({
                scanCodeMsg: res.result
              });
              wx.request({
                url: app.globalData.baseUrl +'/system/patrolOrder',
                method:'POST',
                header:headers,
                data:{
                  patrolId:parseInt(that.data.patrolId),
                  patrolPointId:patrolPointId,
                  patrolResult:null,
                  PatrolContent:null,
                  remark:null,
                  imgUrls:null
                },
                success:(res)=>{
                  console.log(res);
                  wx.navigateTo({
                    url: '../patrol/patrol?patrolPointId=' + that.data.patrolId + '&patrolPointName=' + that.data.patrolPointName,
                  })
                }
              })
            }
          },
          fail: (err) => {
            console.log(err)
          }
        })
        
      }
    })
  }
})
