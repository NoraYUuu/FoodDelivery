// components/Select.js
Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    time: '12:01',
    tabTxt: [
        {
            'index': 0,
            'text': '人数',
            'originalText': '人数',
            'active': false,
            'child': [
                { 'id': 0, 'text': '不限' },
                { 'id': 1, 'text': '2' },
                { 'id': 2, 'text': '3' },
                { 'id': 3, 'text': '4' },
                { 'id': 4, 'text': '5' },
                { 'id': 5, 'text': '6' }
            ],
            'type': 0
        },
        {
            'text': '地点',
            'index': 1,
            'originalText': '地点',
            'active': false,
            'child': [
                { 'id': 0, 'text': '不限' },
                {'id': 1, 'text': "PGP" },
                {'id': 2, 'text': "UTown" },
                {'id': 3, 'text': "SOC" },
                {'id': 4, 'text': "FOS" }
            ], 'type': 0
        }
    ],
    searchParam: []
},

  /**
   * Component methods
   */
  methods: {
    bindViewTap: function () {
      wx.navigateTo({
          url: '../../pages/index'
      })
  },
  onLoad: function () {
      console.log('onLoad')
      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
          //更新数据
          that.setData({
              userInfo: userInfo
          })
      })
  },
  filterTab: function (e) {
      var that = this;
      var data = JSON.parse(JSON.stringify(that.data.tabTxt));
      var index = e.currentTarget.dataset.index;
      var newTabTxt = data.map(function (e) {
          e.active = false;
          return e;
      });
      newTabTxt[index].active = !that.data.tabTxt[index].active;
      this.setData({
          tabTxt: data
      })

  },
  filterTabChild: function (e) {

      //我需要切换选中项 修改展示文字 并收回抽屉  
      var that = this;
    
      var index = e.currentTarget.dataset.index;
      var data = JSON.parse(JSON.stringify(that.data.tabTxt));
      if (typeof (e.target.dataset.id) == 'undefined' || e.target.dataset.id == '') {
          data[index].active = !that.data.tabTxt[index].active;
          if (index == 0) {
          data[index].text = e.target.dataset.txt + "人数";
          } else {
            data[index].text = e.target.dataset.txt + "地点";
          }
          that.data.searchParam[index] = "All";
      }
      else {
          data[index].type = e.target.dataset.id;
          data[index].active = !that.data.tabTxt[index].active;
          if (e.target.dataset.id=='0'){
              data[index].text = that.data.tabTxt[index].originalText;
              
              //不限删除条件
              delete that.data.searchParam[index];
          }
          else{
              data[index].text = e.target.dataset.txt;
              //更改删除条件
              that.data.searchParam[index] = data[index].text;
          }
          
          
      };

      that.setData({
          tabTxt: data
      });
      console.log(that.data.searchParam);


  },

  bindTimeChange: function(e) {
    this.data.searchParam[2] = e.detail.value;
    console.log(this.data.searchParam);
    this.setData({
      time: e.detail.value,
    })
  },

  clear: function(){
      this.setData({
          time: '12:01',
          tabTxt: [
            {
                'index': 0,
                'text': '人数',
                'originalText': '人数',
                'active': false,
                'child': [
                    { 'id': 0, 'text': '不限' },
                    { 'id': 1, 'text': '2' },
                    { 'id': 2, 'text': '3' },
                    { 'id': 3, 'text': '4' },
                    { 'id': 4, 'text': '5' },
                    { 'id': 5, 'text': '6' }
                ],
                'type': 0
            },
            {
                'text': '地点',
                'index': 1,
                'originalText': '地点',
                'active': false,
                'child': [
                    { 'id': 0, 'text': '不限' },
                    {'id': 1, 'text': "PGP" },
                    {'id': 2, 'text': "UTown" },
                    {'id': 3, 'text': "SOC" },
                    {'id': 4, 'text': "FOS" }
                ], 'type': 0
            }
        ],
        searchParam: []
      })
  }

  }
})
