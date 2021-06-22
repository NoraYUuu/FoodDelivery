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
    searchContent:""
  },

  /**
   * Component methods
   */
  methods: {
  
    
    
  }
})
