Page({
	data: {
		search_btn: true,
		search_chats: false,
		show_mask: false,
		yourname: "",
		unReadSpotNum: 0,
		unReadNoticeNum: 0,
		messageNum: 0,
		unReadTotalNotNum: 0,
		arr: [],
		show_clear: false,
		groupName: {}
	},

	openSearch: function () {
		this.setData({
			search_btn: false,
			search_chats: true,
			gotop: true
		});
	},


	cancel: function () {
		/* this.getChatList() */
		this.setData({
			search_btn: true,
			search_chats: false,
			//arr: this.getChatList(),
			/* unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum, */
			gotop: false
		});
	},

	clearInput: function () {
		this.setData({
			input_code: '',
			show_clear: false
		})
	},

	close_mask: function () {
		this.setData({
			search_btn: true,
			search_chats: false,
			show_mask: false
		});
	}
})
