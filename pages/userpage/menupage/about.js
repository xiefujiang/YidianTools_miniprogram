Page({
    /**
     * 页面的初始数据
     */
    data: {
      // 小程序信息
      appName: '',
      appLogo: '',
      appDesc: '',
      appVersion: '',
      
      // 作者信息
      authorName: '',
      authorEmail: '',
      githubUrl: '',
      githubRepo: '',
      
      // 备案信息
      icpRecord: '',
      currentYear: new Date().getFullYear()
    },
  
    onLoad(options) {
      this.loadAppInfo();
    },
    
    loadAppInfo() {
      const appInfo = {
        appName: "亿点Tools",
        appLogo: "/pages/res/pics/2.jpg",
        appDesc: "实用的工具合集",
        appVersion: "1.0.0",
        authorName: "野指针w1ldptr",
        authorEmail: "1094474436@qq.com",
        githubUrl: "https://github.com/xiefujiang/YidianTools_miniprogram",
        githubRepo: "YidianTools_miniprogram",
        icpRecord: "鲁ICP备2025137015号-2X"
      };
      
      this.setData({
        appName: appInfo.appName,
        appLogo: appInfo.appLogo,
        appDesc: appInfo.appDesc,
        appVersion: appInfo.appVersion,
        authorName: appInfo.authorName,
        authorEmail: appInfo.authorEmail,
        githubUrl: appInfo.githubUrl,
        githubRepo: appInfo.githubRepo,
        icpRecord: appInfo.icpRecord
      });
    },
    
    /**
     * 复制邮箱地址
     */
    copyEmail() {
      wx.setClipboardData({
        data: this.data.authorEmail,
        success(res) {
          wx.showToast({
            title: '邮箱已复制',
            icon: 'success',
            duration: 1500
          });
        }
      });
    },

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
        title: `关于${this.data.appName}`,
        path: '/pages/about/about'
      };
    }
  })
      