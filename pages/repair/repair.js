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
      title: '我的维修'
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    pageNum = 1
    pageCount = 2
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
    params.pageNum = pageNum
    params.pageSize = pageSize
    console.log(pageCount)
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
    let requestUrl = ''
    if (this.data.repairStatus === '') {
      //全部
      requestUrl = '/system/newRepairFrom/listByRepairPersonnel'
      delete params.state
    } else if (this.data.repairStatus === '0') {
      //已处理
      requestUrl = '/system/newRepair/listByPersonnel'
      params.state = '5'
    } else if (this.data.repairStatus === '1') {
      //未处理
      requestUrl = '/system/newRepair/listByPersonnel'
      delete params.state
    }
    if (pageCount > pageNum) {

      wx.request({
        url: app.globalData.baseUrl + requestUrl,
        method: 'GET',
        header: headers,
        data: params,
        success: (res) => {
          pageCount = (res.data.total + pageSize - 1) / pageSize;
          this.setData({
            loading: false
          })
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
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'none'
      })
    }
  },
  onTabClick(event) {
    let status = event.detail.name
    // let repairStatus = ''
    switch (status) {
      case 'all':
        this.data.repairStatus = '';
        break;
      case 'sure':
        this.data.repairStatus = '0';
        break;
      case 'not':
        this.data.repairStatus = '1';
        break;
      case 'urgent':
        this.data.repairStatus = '2';
        break;
    }
    pageNum = 1
    pageCount = 2
    this.getDataSource()
  },
  openDetail(e) {
    let jsonStr = JSON.stringify({
      title: '维修任务',
      ...e.currentTarget.dataset.obj
    })
    wx.navigateTo({
      url: '../newRepair/newRepair?jsonStr=' + jsonStr + '&repairStatus=' + this.data.repairStatus,
    })
  }
})