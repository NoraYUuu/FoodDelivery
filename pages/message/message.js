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
	},

	chooseExcel() {
		let that = this
		wx.chooseMessageFile({
			count: 1,
			type: 'file',
			success(res) {
				let path = res.tempFiles[0].path;
				console.log("成功" + path)
				that.uploadExcel(path);
			}
		})
	},

	uploadExcel(path) {
		let that = thiswx.cloudwx.uploadFile({
			cloudPath: new Date().getTime() + '.xls',
			filePath: path,
			success: res => {
				console.log("uploaded", res.fileID)
				that.jiexi(res.fileID)
			},
			fail: err => {
				console.log("failed", err)
			},
			jiexi(fileId) {
				wx.cloud.callFunction({
					name: "excel",
					data: {
						fileID: fileId
					},
					success(res) {
						console.log("jiexi", res)
					},
					fail(res) {
						console.log("jiexi failed", res)
					}
				})
			}
		})
	},

	//跳转到聊天室
	toSay() {
		wx.navigateTo({
			url: '../chatgroup/chatgroup',
		})
	}
})
