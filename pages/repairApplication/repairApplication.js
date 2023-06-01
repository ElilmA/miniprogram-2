// pages/repairApplication/repairApplication.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    showReason: false,
    showPoint: false,
    showArea: false,
    showTypePopup: false,
    showType: false,
    Patrolid: '',
    patrolPointName: '',
    reason: '',
    repairReason: '',
    //保修区域
    repairArea: '',
    areaId: '',
    //保修类型
    typeId: '',
    typeName: '',
    //报修地点
    location: '',



    repairContent: '',
    Remark: '',
    imgUrls: [],
    reasonOptions: [{
        name: '故障',
        id: '0'
      },
      {
        name: '其他',
        id: '1'
      },
    ],
    areOptions: [{
        name: '地点A',
        id: '0'
      },
      {
        name: '地点B',
        id: '1'
      },
    ],
    typeOptions: [{
        name: '类型A',
        id: '0'
      },
      {
        name: '类型B',
        id: '1'
      },
    ],
    pointList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPointList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: '报修'
    })

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
  onUnload() {},

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
  getPointList() {
    let that = this
    let token = wx.getStorageSync('token')
    let headers = {
      'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token
    wx.request({
      url: app.globalData.baseUrl + '/system/dict/data/type/' + 'maintenance_classification',
      method: "GET",
      header: headers,
      success: (res) => {
        that.setData({
          typeOptions: res.data.data.map(v => {
            return {
              name: v.dictLabel,
              value: v.dictValue
            }
          })
        })
      }
    })
    wx.request({
      url: app.globalData.baseUrl + '/system/area/list',
      method: "GET",
      header: headers,
      success: (res) => {
        that.setData({
          areOptions: res.data.rows.map(v => {
            return {
              name: v.areaName,
              value: v.areaValue
            }
          })
        })
      }
    })
  },
  afterRead(event) {
    const {
      file
    } = event.detail;
    let that = this
    let token = wx.getStorageSync('token')
    let headers = {
      'content-type': '',
      'client_id': 'webApp',
      'client_secret': '123456',
    }
    headers.Authorization = 'Bearer ' + token
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl+'/common/upload', // 仅为示例，非真实的接口地址
      method: 'POST',
      header: headers,
      filePath: file.url,
      name: 'file',
      formData: {
        user: 'test'
      },
      success(res) {
        let resData = JSON.parse(res.data)
        // 上传完成需要更新 fileList
        const fileList = that.data.fileList;
        fileList.push({
          ...file,
          url: resData.fileName
        });
        that.setData({
          fileList: fileList
        });
      },
    });
  },
  submit() {
    let params = {}
    let that = this
    if (!that.data.location) {
      wx.showToast({
        title: '请填写报修地点！',
        icon: 'none'
      })
      return
    }
    if (!that.data.areaId) {
      wx.showToast({
        title: '请选择报修区域！',
        icon: 'none'
      })
      return
    }
    if (!that.data.typeId) {
      wx.showToast({
        title: '请选择报修类型！',
        icon: 'none'
      })
      return
    }
    params.location = this.data.location
    params.describe = this.data.repairContent
    params.regionalClassification = this.data.areaId
    params.maintenanceClassification = this.data.typeId
    params.imgUrls = this.data.fileList.map(v=>v.url)
    let token = wx.getStorageSync('token')
    let headers = {
      'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token
    if (this.data.fileList.length === 0) {
      wx.showToast({
        title: '请最少上传一张照片！',
        icon: 'none'
      })
      return
    }
    wx.request({
      url:app.globalData.baseUrl+'/system/newRepairFrom/add',
      method: "POST",
      header: headers,
      data: params,
      success: (res) => {
        if (res.data.code == '200') {
          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          })
          setTimeout(()=>{
            wx.navigateBack()
          },1000)
        }
      }
    })

  },
  showPointPopup() {
    this.setData({
      showPoint: true
    });
  },
  showTypePopup() {
    this.setData({
      showType: true
    });
  },
  onPointClose() {
    this.setData({
      showPoint: false
    });
  },
  onTypeClose() {
    this.setData({
      showType: false
    });
  },
  showReasonPopup() {
    this.setData({
      showReason: true
    });
  },

  onReasonClose() {
    this.setData({
      showReason: false
    });
  },
  showAreaPopup() {
    this.setData({
      showArea: true
    });
  },
  onAreaClose() {
    this.setData({
      showArea: false
    });
  },
  pickerConfirmPoint(event) {
    // patrolResult
    this.setData({
      patrolPointName: event.detail.value.patrolPointName,
      Patrolid: event.detail.value.patrolPointId,
    });
    this.onPointClose()
  },
  pickerConfirmType(event) {
    // patrolResult
    this.setData({
      typeName: event.detail.value.name,
      typeId: event.detail.value.value,
    });
    this.onTypeClose()
  },
  pickerConfirmReason(event) {
    // patrolResult
    this.setData({
      reason: event.detail.value.name,
      repairReason: event.detail.value.name,
    });
    this.onReasonClose()
  },
  pickerConfirmArea(event) {
    // patrolResult
    this.setData({
      repairArea: event.detail.value.name,
      areaId: event.detail.value.value,
    });
    this.onAreaClose()
  },
  pickerPointChange(event) {
    this.setData({
      patrolPointName: event.detail.value.text,
      Patrolid: event.detail.value.value,
    });
  },
  pickerReasonChange(event) {
    this.setData({
      reason: event.detail.value.text,
      repairReason: event.detail.value.value,
    });
  }
})