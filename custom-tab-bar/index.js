Component({
  data: { 
    selected: 0,
    list: [
      {
        pagePath: "/pages/home/index",
        text: "首页",
        icon: "wap-home",
      },
      {
        pagePath: "/pages/personal/personal",
        text: "个人中心",
        icon:"user-o",

      },

    ]
  },
  methods: {
    onChange(e) {
       console.log(e,'e')
       this.setData({ active: e.detail });
       wx.switchTab({
         url: this.data.list[e.detail].pagePath
       });
    },
    init() {
        const page = getCurrentPages().pop();
        this.setData({
       　  active: this.data.list.findIndex(item => item.pagePath === `/${page.route}`)
        });
       }
    }
})
