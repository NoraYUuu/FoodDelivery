const app = getApp()
const db = wx.cloud.database()

Page({
	data: {
		search_btn: true,
		search_chats: false,
		show_mask: false,
		yourname: "",
		openId: "",
		//unReadSpotNum: 0,
		//unReadNoticeNum: 0,
		//messageNum: 0,
		//unReadTotalNotNum: 0,
		groupId: [],
		show_clear: false,
		groups: [], //store groupId, groupname, groupphoto
		search: [],
		groups2: []
	},

	onShow() {
		let self = this;
		let userInfo = wx.getStorageSync('userinfo');
		if (userInfo) {
			let openid = wx.getStorageSync('info').openid;
			db.collection("user_info").where({ _openid: openid }).get({
				success: async res => {
					let groupid = res.data[0].groupid;
					this.setData({
						groupId: groupid
					})
					var group = [];
					var group2 = [];
					for (var i = 0, len = groupid.length; i < len; i++) {
						const p = await new Promise((resolve, reject) => {
							db.collection("tasks").doc(groupid[i]).get({
								success: res => {
									//console.log(res);
									/* let info = res.data;
									group.push({
										groupId: info._id,
										restaurant: info.restaurant,
										photo: info.image
									}) */
									resolve(res)
								},
								fail(res) {
									reject(res)
								}
							})
						})

						const msg = await new Promise((resolve, reject) => {
							db.collection("messages").where({ groupid: groupid[i] }).get({
								success: res => {
									//console.log(res)
									resolve(res)
								},
								fail(res) {
									reject(res)
								}
							})
						})
						//console.log(p.data)
						let info = p.data;
						let message = msg.data[0].messageList;
						message = message[message.length - 1];
						let last = {};
						var content = '';
						var time = '';
						let now = app.formatDate(new Date());
						let date = now.substr(0, 5);

						if (message) {
							if (message.type == "text") {
								content = message.value;
							} else if (message.type == "emoji") {
								content = "[动画表情]"
							} else {
								content = "[图片]"
							}
							time = message.time
						} else {
							time = msg.data[0].time
						}

						if (time.substr(0, 5) < date) {
							time = time.substr(0, 5)
						} else {
							time = time.substr(6)
						}

						last = { time: time, message: content }
						console.log(last)
						group.push({
							groupId: info._id,
							restaurant: info.restaurant,
							photo: info.image,
							managerId: info._openid,
							joined: info.joined,
							lastMsg: last
						})
						group2.push({
							groupId: info._id,
							restaurant: info.restaurant,
							photo: info.image,
							managerId: info._openid,
							joined: info.joined,
							lastMsg: last
						})
						//console.log(group)
						//console.log(self.data.groups)
					}

					self.setData({
						groups: group,
						groups2: group2
					})
					console.log(self.data.groups)
				},
				fail: res => {
					console.log(res)
				}
			})
			self.setData({
				yourname: userInfo.nickName,
				openId: openid,
			})
		}

		//let groupid = wx.getStorageSync('userDetails').groupid;
		//console.log(groupid);
		if (!userInfo) {
			wx.showToast({
				title: '请先登录',
				duration: 1000,
			})
		}
	},


	openSearch: function () {
		this.setData({
			search_btn: false,
			search_chats: true,
			gotop: true
		});
	},

	onSearch: function (val) {
		let searchValue = val.detail.value.toLowerCase();
		const that = this;
		let arr = [];
		let groups = that.data.groups2;
		for (var j = 0; j < groups.length; j++) {
			//console.log(groups[j].restaurant)
			if (groups[j].restaurant.toLowerCase().indexOf(searchValue) != -1) {
				arr.push(groups[j])
			}
		}
		that.setData({
			groups: arr
		})
		//console.log(arr);
	},

	onInput: function (e) {
		let inputValue = e.detail.value
		if (inputValue) {
			this.setData({
				show_clear: true
			})
		} else {
			this.setData({
				show_clear: false
			})
		}
	},

	cancel: function () {
		/* this.getChatList() */
		let allChat = this.data.groups2;
		this.setData({
			search_btn: true,
			search_chats: false,
			groups: allChat,
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

	del_chat: function (event) {
		let detail = event.currentTarget.dataset.item;
		console.log(detail)
		//let nameList = { your: detail.info };
		let me = this;
		let toDelete = detail.groupId;
		let allChat = me.data.groups;
		for (var i = 0; i < allChat.length; i++) {
			if (allChat[i].groupId == toDelete) {
				allChat.splice(i, 1)
			}
		}
		console.log(allChat);
		me.setData({
			groups: allChat
		})
	},

	/*
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
	}, */

	//跳转到聊天室
	toChat: function (event) {

		let detail = event.currentTarget.dataset.item;//.groupId;
		console.log(event.currentTarget.dataset.item);
		wx.navigateTo({
			url: '../chatgroup/chatgroup?groupInfo=' + JSON.stringify(detail), //need to stringify or not?
		})
	}
})
