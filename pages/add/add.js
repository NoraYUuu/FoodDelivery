//data from selector is stored in selectedArr, and location, contact, money is stored in string location, contact
//and multiarray
const dollars = []
const cents = []
const milicents = []

for (let i = 0; i <= 50; i++) {
  dollars.push(i)
}

for (let i = 0; i <= 9; i++) {
  cents.push(i)
  milicents.push(i)
}

Page({
  data: {
    cInput: '',
    lInput: '',
    array: ['2', '3', '4', '5'],
    location: ['PGP', 'UTown', 'SOC', 'FOS'],
    index: 0,
    l: 0,
    dollars,
    dollar: 10,
    cents,
    month: 0,
    milicents,
    milicent: 0,
    multiArray: [dollars, cents, milicents],
    multiIndex: [0, 0, 0],
    contact: "",
    location: "",
    selectedArr: [],
    inputValue: '',
    // 是否隐藏模糊查询的面板
    hideScroll: false,
    // 模糊查询结果
    searchTip: [],
    groupId: '',
    resImage: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F17026bfe5d56794fff418a40195862b54c8f39ef46b2d-etk3LH_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626946341&t=f4a3beba6fc6a630f9a8eeca5b18ce03'
  },
  bindMoneyChange(e) {
    const val = e.detail.value
    this.setData({
      dollar: this.data.dollars[val[0]],
      cent: this.data.cents[val[1]],
      milicent: this.data.milicents[val[2]]
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindConfirmListener: function (e) {
    var that = this;
    const child = this.selectComponent('#selectt')
    const selected = child.data.searchParam;
    if (selected.length < 3 || selected[0] == undefined || selected[1] == undefined || selected[2] == undefined) {
      wx.showToast({
        title: '人数/地点/时间为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (this.data.contact.length == 0) {
      wx.showToast({
        title: '联系方式为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (this.data.contact.length < 8) {
      wx.showToast({
        title: '请输入正确联系方式',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (this.data.location.length == 0) {
      wx.showToast({
        title: '领餐地址为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (this.data.multiIndex[0] == 0 && this.data.multiIndex[1] == 0 && this.data.multiIndex[2] == 0) {
      wx.showToast({
        title: '外卖金额为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (this.selectComponent('#search').data.inputValue == '') {
      wx.showToast({
        title: '请选择餐厅',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      that.setData({
        selectedArr: selected
      })
      const db = wx.cloud.database()
      const myOpenId = wx.getStorageSync('info').openid;

      db.collection('tasks').add({
        data: {
          restaurant: this.selectComponent('#search').data.inputValue,
          dLocation: this.data.location,
          price: this.data.multiIndex,
          contact: this.data.contact,
          numberOfPeople: this.data.selectedArr[0],
          location: this.data.selectedArr[1],
          deadline: this.data.selectedArr[2],
          //in progress: -1, in progress: 0, complete: 1, not completed but expired: 2;
          state: -1,
          joined: [myOpenId],
          image: this.data.resImage
        }, success(res) {
          that.setData({
            groupId: res._id
          });

          const _ = db.command;
          db.collection('user_info').where({ _openid: myOpenId }).update({
            data: {
              'groupid': _.push(that.data.groupId)
            },
            success: res => { 
              console.log(res) 
              that.clear()
            },
            fail: err => { console.log(err) }
          })
          
        }
        //this.clear(); //成功之后清空数据（not working?）
      })//.then(this.clear())
      //将taskid添加到userinfo的taskid array中


    }
  },
  locationInput: function (e) {
    this.setData({
      location: e.detail.value
    })
  },
  contactInput: function (e) {
    this.setData({
      contact: e.detail.value
    })
  },
  clear: function (e) {

    this.setData({
      multiIndex: [0, 0, 0],
      contact: "",
      location: "",
      selectedArr: [],
      cInput: '',
      lInput: '',
      resImage: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F17026bfe5d56794fff418a40195862b54c8f39ef46b2d-etk3LH_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626946341&t=f4a3beba6fc6a630f9a8eeca5b18ce03'
    })
    this.selectComponent('#selectt').clear();
    this.selectComponent('#search').setData({
      inputValue: ''
    })
  },
  //search function

  getGuess() {
    const db = wx.cloud.database()

    db.collection('Restaurants').where({
      name: db.RegExp({
        regexp: this.data.inputValue,
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
    this.setData({
      inputValue: e.detail
    })
    this.getGuess()
  },
  checkHide() {
    if (this.data.inputValue === '') {
      this.setData({
        hideScroll: true
      })
    } else {
      this.setData({
        hideScroll: false
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
      resImage: e.currentTarget.dataset.img
    })
    this.setData({
      hideScroll: true
    })
  }
})