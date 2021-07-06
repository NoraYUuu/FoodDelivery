// components/newCollection.js
const db = wx.cloud.database()
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
    time2: '12:01',
    inputValue: '',
    // 是否隐藏模糊查询的面板
    hideScroll: false,
    // 模糊查询结果
    searchTip: [],
    earlier: false,
    array: ['不限', 'PGP', 'UTown', 'SOC', 'FOS'],
    objectArray: [
      { 'id': 0, 'text': '不限' },
      {'id': 1, 'text': "PGP" },
      {'id': 2, 'text': "UTown" },
      {'id': 3, 'text': "SOC" },
      {'id': 4, 'text': "FOS" }
    ],
    index: 0,
    show: false,
    resImage:''
  },

  /**
   * Component methods
   */
  methods: {
    getGuess() {
      const db = wx.cloud.database()
    
      db.collection('Restaurants').where({
        name: db.RegExp({
          regexp:this.data.inputValue,
          options: 'i'
        }),
      }).get()
      .then(res => {
        console.log('success guess')
        this.setData({
          searchTip: res.data
        })
        this.checkHide()
      })
      .catch(res => {
        console.log('failed guess', res)
      })
    },
    handleItemChange(e) {
      this.getGuess()
      this.setData({
        inputValue: e.detail
      })
    },
    checkHide() {
      if (this.data.inputValue === '') {
        this.setData({
          hideScroll:true
        })
      } else {
        this.setData({
          hideScroll:false
        })
      }
    },
    itemTap(e) {
      const child = this.selectComponent("#search")
      console.log(e.currentTarget.dataset)
      child.setData({
        inputValue: e.currentTarget.dataset.name,
      })
      
      this.setData({
        // inputValue: e.currentTarget.dataset.name,
        resImage: e.currentTarget.dataset.img
      })
      console.log(this.data.inputValue)
      this.setData({
        hideScroll:true
      })
    },
    bindTimeChange: function(e) {
      this.setData({
        time: e.detail.value,
      })
    },
    bindTimeChange2: function(e) {
      this.setData({
        time2: e.detail.value,
      })
      const smaller = parseInt(this.data.time2.substring(0, 2)) < parseInt(this.data.time.substring(0, 2))
        ? true
        : parseInt(this.data.time2.substring(0, 2)) == parseInt(this.data.time.substring(0, 2))
          ? parseInt(this.data.time2.substring(3, 5)) < parseInt(this.data.time.substring(3, 5))
          : false

      if (smaller) {
        this.setData({
          earlier: true
        })
        wx.showToast({
          title: '结束时间不可以早于开始时间',
          icon: 'none',
          duration: 1000,
          mask:true
      })
      } else {
        this.setData({
          earlier: false
        })
      }
    },
    locationChange(e) {
      const pos = e.detail.value;
      this.setData({
        index: pos
      })
    },
    close(){
      this.setData({
        show: false
      })
    },
    confirm(e){
      if (this.data.earlier) {
        wx.showToast({
          title: '结束时间不可以早于开始时间',
          icon: 'none',
          duration: 1000,
          mask:true
      })
      } else {
        if (this.data.inputValue = '') {
          wx.showToast({
            title: '请选择餐厅',
            icon: 'none',
            duration: 1000,
            mask:true
        })
        } else {
          const that = this;
  
          db.collection('collections').add({
            data:{
              restaurant: this.selectComponent('#search').data.inputValue,
              location: this.data.array[this.data.index],
              imageURL: this.data.resImage,
              startTime: this.data.time,
              endTime: this.data.time2
            }
          }).then(
            that.clear()
            )
      
        }
      }
    },
    clear() {
      this.setData({
        inputValue: '',
        time:'12:01',
        time2:'12:01',
        index: 0,
        earlier: false,
        show: false,
        resImage: ''
      })
    }

  }
})
