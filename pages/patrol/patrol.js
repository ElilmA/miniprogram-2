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
    this.nfcRead()
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
  // 进行使用nfc功能
  nfcRead() {
    console.log('nfc')
    const nfc = wx.getNFCAdapter()
    this.nfc = nfc
    let _this = this
    function discoverHandler(res) {
      var buffer = res.messages[0].records[0].payload;
      //获取Uint8Array 
      var dataview = new DataView(buffer);
      console.log('dataview', dataview)
      //获取Uint8Array数组
      var ints = new Uint8Array(buffer);
      console.log('ints', ints)
      //截取数组
      var shuzu = ints.slice(3);
      console.log('shuzu', shuzu)
      // 编译Uint8Array数组
      let unit8Arr = new Uint8Array(shuzu);
      let encodedString = String.fromCharCode.apply(null, unit8Arr),
        // 处理中文乱码
        decodedString = decodeURIComponent(escape((encodedString)));
      // 赋值
      console.log(decodedString);
      wx.navigateTo({
        url: '../newPatrol/newPatrol?patrolId=' + parseInt(_this.data.patrolId) + '&patrolPointId=' + decodedString,
      })
      // console.log('discoverHandler', res)
      // const data = new Uint8Array(res.id)
      // let str = ""
      // data.forEach(e => {
      //   let item = e.toString(16)
      //   if (item.length == 1) {
      //     item = '0' + item
      //   }
      //   item = item.toUpperCase()
      //   console.log(item)
      //   str += item
      // })
      // _this.setData({
      //   newCardCode: str
      // })
      // console.log(str)
      wx.showToast({
        title: '读取成功！',
        icon: 'none'
      })
    }
    nfc.startDiscovery({
      success(res) {
        console.log(res)
        wx.showToast({
          title: 'NFC读取功能已开启！',
          icon: 'none'
        })
        nfc.onDiscovered(discoverHandler)
      },
      fail(err) {
        console.log('failed to discover:', err)
        if (!err.errCode) {
          wx.showToast({
            title: '请检查NFC功能是否正常!',
            icon: 'none'
          })
          return
        }
        switch (err.errCode) {
          case 13000:
            wx.showToast({
              title: '设备不支持NFC!',
              icon: 'none'
            })
            break;
          case 13001:
            wx.showToast({
              title: '系统NFC开关未打开!',
              icon: 'none'
            })
            break;
          case 13019:
            wx.showToast({
              title: '用户未授权!',
              icon: 'none'
            })
            break;
          case 13010:
            wx.showToast({
              title: '未知错误!',
              icon: 'none'
            })
            break;
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
              wx.navigateTo({
                url: '../newPatrol/newPatrol?patrolId=' + parseInt(that.data.patrolId) + '&patrolPointId=' + patrolPointId,
              })
              // wx.request({
              //   url: app.globalData.baseUrl +'/system/patrolOrder',
              //   method:'POST',
              //   header:headers,
              //   data:{
              //     patrolId:parseInt(that.data.patrolId),//
              //     patrolPointId:patrolPointId,//
              //     patrolResult:null,
              //     PatrolContent:null,
              //     remark:null,
              //     imgUrls:null
              //   },
              //   success:(res)=>{
              //     console.log(res);
                  
              //   }
              // })
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
