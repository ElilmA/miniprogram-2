// pages/newPatrol/newPatrol.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaName: '',
    pointName: '',
    repairDescribe: '',
    typeName: '',
    patrolDescript: '',
    fileList: [],
    //我的维修任务状态
    repairStatus: '',
    //当前任务状态
    repairFromState: '',
    //用户评价列表
    evaluateList: [],


    show: false,
    repairId: '',
    Patrolid: '',
    repairReason: '',
    repairContent: '',
    Remark: '',
    columns: [{
        text: '故障',
        value: '0'
      },
      {
        text: '其他',
        value: '1'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let jsonStr = JSON.parse(options.jsonStr)
    this.setData({
      repairStatus: options.repairStatus,
      repairId: jsonStr.repairFromId || jsonStr.newRepairId,
      pointName: jsonStr.location,
    })
    wx.setNavigationBarTitle({
      title: jsonStr.title || '任务详情'
    })
    let requestUrl = ''
    if (options.repairStatus === '' || options.repairStatus === '5') {
      //全部tab进来的或者从我的保修进来的
      requestUrl = '/system/newRepairFrom/' + jsonStr.repairFromId
    } else if (options.repairStatus === '0' || options.repairStatus === '1') {
      //未处理和已处理tab进来的 
      requestUrl = '/system/newRepair/' + jsonStr.newRepairId
    }
    let token = wx.getStorageSync('token')
    let headers = {
      'content-type': 'application/json',
    }
    let that = this
    headers.Authorization = 'Bearer ' + token
    wx.request({
      url: app.globalData.baseUrl + requestUrl,
      method: 'get',
      header: headers,
      success: (res) => {
        if (res.data.code == 200) {
          that.setData({
            newRepairId:res.data.data.newRepairId,
            pointName: jsonStr.location,
            areaName: res.data.data.regionalClassification,
            typeName: res.data.data.maintenanceClassification,
            patrolDescript: res.data.data.describe,
            repairStatus: options.repairStatus,
            repairFromState: jsonStr?.repairFromState || null,
            state: res.data.data.state,
            fileList: res.data.imgUrls.map(v => app.globalData.baseUrl + v),
            state: res.data.data.state || null,
            evaluateList:res.data.data.evaluateList||[]
            // repairReason: options.repairDescribe,
          })
        }else{
          wx.showToast({
            title: '操作失败，请稍后再试',
            icon:'none'
          })
        }
      }
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

  },

  showPopup() {
    this.setData({
      show: true
    });
  },

  // onClose() {
  //   this.setData({ show: false });
  // },
  // pickerConfirm(event){
  //   // patrolResult
  //   this.setData({ 
  //     reason: event.detail.value.text ,
  //     repairReason: event.detail.value.value,
  //   });
  //   this.onClose()
  // },
  pickerChange(event) {
    this.setData({
      reason: event.detail.value.text,
      repairReason: event.detail.value.value,
    });
  },
  checkmap: function (e) {
    const idx = e.target.dataset.index
    let that = this
    wx.previewImage({
      // urls: [idx],
      urls: that.data.fileList,
      current: that.data.fileList[idx], //当前预览的图片
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  submit(e) {
    let that = this
    let params = {}
    let btnType = e.currentTarget.dataset.btnId
    let requestUrl = ''
    if (btnType === '5-1') {
      //评价
      wx.navigateTo({
        url: '../evaluate/evaluate?newRepairId=' + that.data.newRepairId,
      })
      return
    } else if (btnType === '5-3') {
      //撤回
      requestUrl = '/system/newRepair/rollback/' + that.data.repairId
    } else if (btnType === '4') {
      //接单
      requestUrl = '/system/newRepairFrom/pickUpRepairFrom/' + that.data.repairId+'/0'
    } else if (btnType === '1') {
      //开始维修
      requestUrl = '/system/newRepair/editNewRepair'
      params.newRepairId = that.data.repairId
      params.state = '0'
    } else if (btnType === '1-1') {
      //维修完成
      requestUrl = '/system/newRepair/editNewRepair'
      params.newRepairId = that.data.repairId
      params.state = '5'
    } else if (btnType === '2') {
      //待料维修
      requestUrl = '/system/newRepair/editNewRepair'
      params.newRepairId = that.data.repairId
      params.state = '1'
    } else if (btnType === '3') {
      //上报无法处理
      requestUrl = '/system/newRepair/editNewRepair'
      params.newRepairId = that.data.repairId
      params.state = '2'
    }
    let token = wx.getStorageSync('token')
    let headers = {
      'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token
    wx.request({
      url: app.globalData.baseUrl + requestUrl,
      method: 'POST',
      header: headers,
      data: params,
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1 //返回上一级页面
            })
          }, 1000)

        }
      }
    })
  }
})