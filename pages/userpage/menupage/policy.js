Page({
    /**
     * 页面的初始数据
     */
    data: {
      // 小程序信息，从JS加载
      appName: '亿点Tools',
      appVersion: '1.0.0',
      contactEmail: '1094474436@qq.com',
      contactPhone: ''
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 从JS加载小程序信息
      this.loadAppInfo();
    },
    
    /**
     * 加载小程序信息
     */
    loadAppInfo() {
      // 实际应用中，这些信息可能从服务器接口获取
      const appInfo = {
        appName: "亿点Tools",
        appVersion: "1.0.0",
        contactEmail: "1094474436@qq.com",
        contactPhone: "400-123-4567"
      };
      
      this.setData({
        appName: appInfo.appName,
        appVersion: appInfo.appVersion,
        contactEmail: appInfo.contactEmail,
        contactPhone: appInfo.contactPhone
      });
    },
    
    /**
     * 用户同意协议
     */
    agreeAgreement() {
      // 记录用户已同意协议
      wx.setStorageSync('agreedAgreement', true);
      
      // 延时返回上一页或跳转到首页
      setTimeout(() => {
        // 如果有上一页则返回，否则跳转到首页
        const pages = getCurrentPages();
        if (pages.length > 1) {
          wx.navigateBack({
            delta: 1
          });
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }, 0);
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
  
    }
  })
      