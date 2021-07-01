// components/Search/Search.js

Component({

    attached: function() {
      const c = this.dataset.content;
      this.setData({
        searchContent: c
      });
    },
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    searchContent:"",
    inputValue:''
  },

  /**
   * Component methods
   */
  methods: {
  
    sendTxt(e) {
      this.setData({
        inputValue: e.detail.value
      })
      this.triggerEvent("inputGet", this.data.inputValue)
    }
    
  }
})
