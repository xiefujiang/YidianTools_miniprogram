
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 表单数据
        nickname: '',
        email: '',
        content: '',

        // 作者联系方式
        authorEmail: '1094474436@qq.com',
        authorPhone: 'none',
        githubUrl: 'https://github.com/xiefujiang/YidianTools_miniprogram',
        githubRepo: 'xiefujiang',
        showPhone: false // 是否显示电话联系方式
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 可以从全局数据或缓存中获取用户昵称
        const userInfo = wx.getStorageSync('userInfo') || {};
        if (userInfo.nickName) {
            this.setData({
                nickname: userInfo.nickName
            });
        }
    },

    /**
     * 昵称输入变化
     */
    onNicknameChange(e) {
        this.setData({
            nickname: e.detail.value
        });
    },

    /**
     * 邮箱输入变化
     */
    onEmailChange(e) {
        this.setData({
            email: e.detail.value
        });
    },

    /**
     * 内容输入变化
     */
    onContentChange(e) {
        this.setData({
          content: e.detail.value
        });
      },

    /**
     * 提交表单
     */
    submitForm() {
        const { nickname, email, content } = this.data;
        var regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;
        if(email.length>0){
            if(!regex.test(email.trim())){
                wx.showToast({
                  title: '请输入正确的邮箱地址',
                  duration:1000,
                  icon:'none'
                });
                //console.log('长度大于0，匹配失败');
                return;
            }
        }
        // 简单验证
        if (!content.trim()) {
          wx.showToast({
            title: '请输入消息内容',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        
        // 显示加载中
        wx.showLoading({
          title: '发送中...',
          mask: true
        });
        
        // 调用后端API提交数据（替换模拟提交逻辑）
        wx.request({
          url: 'https://api.w1ldptr.xyz/api/submit-bugs', // 目标API地址
          method: 'POST',
          data: { 
            nickname: nickname || '匿名用户',  // 处理未填写昵称的情况
            email: email, 
            content: content.trim() 
          },
          header: {
            'Content-Type': 'application/json' // 明确指定JSON格式
          },
          success: (res) => {
            wx.hideLoading();
            
            // 根据API返回结果处理
            if (res.data && res.data.success) {
              wx.showToast({
                title: '发送成功，感谢反馈',
                icon: 'success',
                duration: 2000
              });
              // 清空表单
              this.setData({ content: '' });
            } else {
              // 显示API返回的错误信息
              wx.showToast({
                title: res.data?.message || '提交失败，请重试',
                icon: 'none',
                duration: 2000
              });
            }
          },
          fail: (err) => {
            wx.hideLoading();
            console.error('提交失败：', err);
            wx.showToast({
              title: '网络错误，请稍后重试',
              icon: 'none',
              duration: 2000
            });
          }
        });
      },

    /**
     * 复制邮箱
     */
    copyEmail() {
        wx.setClipboardData({
            data: this.data.authorEmail,
            success() {
                wx.showToast({
                    title: '邮箱已复制',
                    icon: 'success',
                    duration: 1500
                });
            }
        });
    },

    /**
     * 打开GitHub链接
     */
    openGithub() {
        wx.openUrl({
            url: this.data.githubUrl,
            success() {
                console.log('打开链接成功');
            },
            fail(err) {
                console.log('打开链接失败', err);
                wx.setClipboardData({
                    data: this.url,
                    success(res) {
                        wx.showToast({
                            title: '链接已复制',
                            icon: 'success',
                            duration: 1500
                        });
                    }
                });
            }
        })
    },

    /**
     * 拨打电话
     */
    makePhoneCall() {
        wx.makePhoneCall({
            phoneNumber: this.data.authorPhone,
            fail(err) {
                console.log('拨打电话失败', err);
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '联系我们',
            path: '/pages/contact/contact'
        };
    }
})