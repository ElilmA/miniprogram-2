// pages/newPatrol/newPatrol.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    show: false,
    codeMsg: '',
    patrolResult: '',
    patrolVal: '',
    patrolDescript: '',
    columns: [{
        text: '正常',
        value: '0'
      },
      {
        text: '异常',
        value: '1'
      },
    ],
    topicColumns: [], //题目列表
    radioAnswer:"",//单选答案
    multipleAnswer:[],//多选答案

    // topicName: "", //题目名称
    // topicId: "", //题目ID
    // topic: false,
    // topicVal: "", //题目类型
    // optionColumns: [], //选项列表
    // option: false,
    // optionName: "", //选项内容
    // optionId: "", //选项ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let codeStr = options.codeMsg
    if (codeStr) {
      this.setData({
        codeMsg: JSON.parse(codeStr).data,
        patrolPointName: options.patrolPointName,
        patrolPointId: options.patrolPointId,
        patrolId: options.patrolId
      })
    } else {
      this.setData({
        // codeMsg : JSON.parse(codeStr).data,
        patrolPointName: options.patrolPointName,
        patrolPointId: options.patrolPointId,
        patrolId: options.patrolId
      })
    }
    this.isTopic(options.patrolPointId);
  },

  radioAnswerInfo(e){
    console.log(e);
  },
  toggle(index) {
    this.$refs.checkboxes[index].toggle();
  },

  //获取选项
  isOption() {
    for (let i = 0; i < this.data.topicColumns.length; i++) {
      if (this.data.topicId == this.data.topicColumns[i].titleId) {
        this.setData({
          topicVal: this.data.topicColumns[i].titleType,
          optionColumns: this.data.topicColumns[i].inspectionItemTitleValue
        })
      }
    }
  },
  optionChange(event) {
    console.log(event);
    this.setData({
      optionName: event.detail.value.itemValue,
      optionId: event.detail.value.valueId,
    });
  },
  optionConfirm(event) {
    console.log(event);
    // optionName
    this.setData({
      optionName: event.detail.value.itemValue,
      optionId: event.detail.value.valueId,
    });
    this.closeOption()
  },
  showOption() {
    this.setData({
      option: true
    });
  },
  closeOption() {
    this.setData({
      option: false
    });
  },
  //获取题目
  isTopic(patrolPointId) {
    let token = wx.getStorageSync('token');
    let headers = {
      'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token;
    wx.request({
      url: app.globalData.baseUrl + '/system/point/' + patrolPointId,
      method: 'GET',
      header: headers,
      success: (res) => {
        console.log(res)
        this.setData({
          topicColumns: res.data.inspectionItemTitles
        })
      }
    })
  },
  topicChange(event) {
    console.log(event);
    this.setData({
      topicName: event.detail.value.itemTitle,
      topicId: event.detail.value.titleId,
    });
  },
  topicConfirm(event) {
    console.log(event);
    // topicName
    this.setData({
      topicName: event.detail.value.itemTitle,
      topicId: event.detail.value.titleId,
    });
    this.closeTopic()
    this.isOption()
  },
  showTopic() {
    this.setData({
      topic: true
    });
  },
  closeTopic() {
    this.setData({
      topic: false
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: '巡更工单'
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
      url: app.globalData.baseUrl + '/common/upload', // 仅为示例，非真实的接口地址
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

  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  pickerConfirm(event) {
    // patrolResult
    this.setData({
      patrolResult: event.detail.value.text,
      patrolVal: event.detail.value.value,
    });
    this.onClose()
  },
  pickerChange(event) {
    this.setData({
      patrolResult: event.detail.value.text,
      patrolVal: event.detail.value.value,
    });
  },
  submit() {
    let params = {}
    params.imgUrls = []
    let imgUrls = []
    params.patrolId = this.data.patrolId
    console.log(params.patrolId);
    params.patrolPointId = this.data.patrolPointId
    params.patrolResults = this.data.patrolVal
    params.patrolContent = this.data.patrolDescript
    params.Remark = ''
    let token = wx.getStorageSync('token')
    let headers = {
      'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token
    this.data.fileList.forEach((item, index) => {
      imgUrls.push(item.url)
      if (index >= this.data.fileList.length - 1) {
        params.imgUrls = imgUrls
        wx.request({
          url: app.globalData.baseUrl + '/system/patrolOrder',
          method: 'POST',
          header: headers,
          data: {
            patrolId: params.patrolId,
            patrolPointId: params.patrolPointId,
            patrolResult: params.patrolResults,
            PatrolContent: params.PatrolContent,
            remark: params.Remark,
            imgUrls: params.imgUrls
          },
          success: (res) => {
            wx.navigateTo({
              url: '../patrol/patrol',
            })
          }
        })
      }
    })
  }
})