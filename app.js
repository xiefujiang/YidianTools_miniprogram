// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      // 已登录，验证token有效性
      this.verifyToken(token);
    } else {
      // 未登录，调用登录流程
      this.login();
    }
},

login() {
    wx.login({
      success: res => {
        if (res.code) {
          // 发送code到后端换取openid和session_key
          wx.request({
            url: 'https://w1ldptr.xyz/api/login',
            method: 'POST',
            data: { code: res.code },
            success: result => {
              if (result.data.success) {
                const { token, isNewUser } = result.data.data;
                wx.setStorageSync('token', token);
                
                if (isNewUser) {
                  // 首次登录，引导用户授权并填写信息
                  wx.navigateTo({ url: '/pages/register/register' });
                } else {
                  // 非首次登录，获取用户信息
                  this.getUserInfo(token);
                }
              } else {
                wx.showToast({ title: '登录失败', icon: 'none' });
              }
            }
          });
        } else {
          wx.showToast({ title: '登录码获取失败', icon: 'none' });
        }
      }
    });
  },

  globalData: {
    userInfo: null
  }
})
