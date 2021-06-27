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
    cInput:'',
    lInput:'',
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
    contact:"",
    location:"",
    selectedArr:[]
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
  bindConfirmListener: function(e) {
    var that = this;
    const child = this.selectComponent('#selectt')
    const selected = child.data.searchParam;
    if (selected.length < 3 || selected[0] == undefined || selected[1] == undefined || selected[2] == undefined) {
      wx.showToast({
        title: '人数/地点/时间为空',
        icon: 'none',
        duration: 1000,
        mask:true
    })
    } else if (this.data.contact.length==0){
      wx.showToast({
        title: '联系方式为空',
        icon: 'none',
        duration: 1000,
        mask:true
    })
  } else if (this.data.contact.length<8) {
    wx.showToast({
      title: '请输入正确联系方式',
      icon: 'none',
      duration: 1000,
      mask:true
  })
  } else if (this.data.location.length == 0) {
    wx.showToast({
      title: '领餐地址为空',
      icon: 'none',
      duration: 1000,
      mask:true
  })
  } else if (this.data.multiIndex[0] == 0 && this.data.multiIndex[1] == 0 && this.data.multiIndex[2] == 0) {
    wx.showToast({
      title: '外卖金额为空',
      icon: 'none',
      duration: 1000,
      mask:true
  })
  } else {
      that.setData({
        selectedArr: selected
      })
      const db = wx.cloud.database()
      db.collection('tasks').add({
        data:{
          restaurant: '餐厅名字',
          dLocation: this.data.location,
          price: this.data.multiIndex,
          contact: this.data.contact,
          numberOfPeople: this.data.selectedArr[0],
          location: this.data.selectedArr[1],
          deadline: this.data.selectedArr[2],
          //in progress: -1, in progress: 0, complete: 1, not completed but expired: 2;
          state: -1,
          joined:[]
        }
      }).then(
        this.clear()
        )
  }
  },
  locationInput: function(e) {
    this.setData({
      location: e.detail.value
    })
  },
  contactInput: function(e) {
    this.setData({
      contact: e.detail.value
    })
  },
  clear: function(e) {
    
    this.setData({
      multiIndex: [0, 0, 0],
      contact:"",
      location:"",
      selectedArr:[],
      cInput:'',
      lInput:''
    })
    this.selectComponent('#selectt').clear();
  }
})