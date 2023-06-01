// pages/repair/repair.js
let pageSize = 10; //每页加载的数据量
let pageNum = 1; //当前页
let pageCount = 2; //总页数
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repairStatus: '',
    dataSource: [],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: '我的报修'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    pageNum = 1; //当前页
    pageCount = 2; //总页数
    this.getDataSource()
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
    // if (this.pageNum < this.totalPage) {
    pageNum += 1;
    //加载下一页
    this.getDataSource();
    // } else {
    //   wx.showToast({
    //     icon: "none",
    //     title: '没有更多数据了',
    //   })
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getDataSource() {
    let params = {}
    let that = this
    // params.repairStatus = this.data.repairStatus
    params.pageNum = pageNum
    params.pageSize = pageSize
    let token = wx.getStorageSync('token')
    let headers = {
      'content-type': 'application/json',
    }
    headers.Authorization = 'Bearer ' + token
    if (pageNum === 1) {
      that.setData({
        loading: true
      })
    }
    if (pageCount > pageNum) {
      wx.request({
        url: app.globalData.baseUrl + '/system/newRepairFrom/listByPersonnel',
        method: 'GET',
        header: headers,
        data: params,
        success: (res) => {
          this.setData({
            loading: false
          })
          pageCount = (res.data.total + pageSize - 1) / pageSize;
          if (pageNum === 1) {
            that.setData({
              dataSource: [],
            })
          }

          if (res.data.rows.length > 0) {
            res.data.rows.map(v => {
              v.imgUrl = app.globalData.baseUrl + v.imgUrl
            })
            that.setData({
              dataSource: [...that.data.dataSource, ...res.data.rows],
            })
          }
        }
      })
    }
  },
  openDetail(e) {
    let jsonStr = JSON.stringify({
      title: '报修任务',
      ...e.currentTarget.dataset.obj
    })
    wx.navigateTo({
      //repairStatus为报修任务
      url: '../newRepair/newRepair?jsonStr=' + jsonStr + '&repairStatus=5',
    })
  }
})