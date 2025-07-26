Page({
    data: {
      // 更新日志数据 - 按版本从新到旧排序
      //type: new/optimize/fix
      /*    template:
            {
            version: "1.0.0",
            date: "2025-07-26",
            isLatest: true,
            isMajor: true,
            updates:[
                {type:"new",content:""},
            ]
          },
      */
      updateLogs: [
          {
            version: "1.1.0",
            date: "2025-07-26",
            isLatest: true,
            isMajor: true,
            updates:[
                {type:"new",content:"xml/json格式化工具上线"},
                { type: "fix", content: "修复了随机数生成器中，手动修改生成结果时自定义字符集异常变化的bug" },
            ]
          },
        {
          version: "1.0.0",
          date: "2025-07-26",
          isLatest: false,
          isMajor: true,
          updates: [
            { type: "new", content: "进制转换功能上线，支持二、十、八、十六进制互相转换，支持复制结果" },
            { type: "new", content: "颜色选择器上线，支持滑动/输入选择RGB值，支持HEX输入及复制" },
            { type: "new", content: "正则表达式工具上线，内置近百种常用的表达式，支持忽略大小写、全局匹配、多行匹配、点匹配所有匹配选项，支持复制结果" },
            { type: "new", content: "编码转换工具上线，支持URL、BASE64、HTML实体、Unicode、十六进制、ASCII等编码解码方式，支持由TXT文件导入，支持复制结果" },
            { type: "new", content: "哈希加密工具上线，支持MD5、SHA1、SHA256、SHA512、RIPEMD160等加密算法" },
            { type: "new", content: "更新用户协议与隐私政策，联系作者、关于小程序、更新日志功能上线" },
            { type: "optimize", content: "移除了多余的两个工具，首页更加简洁" },
            { type: "new", content: "首页及工具页面现支持分享到好友及朋友圈" },
          ]
        },
        {
          version: "0.1.0b",
          date: "2025-07-22",
          isLatest: false,
          isMajor: true,
          updates: [
            { type: "new", content: "生成二维码功能上线，支持输入生成，保存，扫描二维码" },
            { type: "new", content: "随机数生成功能上线，支持选择字符集，自定义字符集，控制长度" },
            { type: "new", content: "小程序上线🎉🎉🎉" },
          ]
        }
      ]
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    onShareTimeline() {
        return {
            title: '邀请你一起使用"亿点Tools"',
            query: "from=pyq"
        }
    },

    onShareAppMessage() {
        return {
            title: '邀请你一起使用"亿点Tools"',
            path: '/pages/userpage/menupage/updatelog',
        };
    },
  
    /**
     * 复制版本号
     */
    copyVersion(e) {
      const version = e.currentTarget.dataset.version;
      wx.setClipboardData({
        data: version,
        success: () => {
          wx.showToast({
            title: `已复制 v${version}`,
            icon: 'success',
            duration: 1500
          });
        },
        fail: () => {
          wx.showToast({
            title: '复制失败',
            icon: 'none',
            duration: 1500
          });
        }
      });
    },
  
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      // 下拉刷新获取最新日志
      setTimeout(() => {
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '已是最新日志',
          icon: 'none',
          duration: 1500
        });
      }, 1000);
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
      return {
        title: '小程序更新日志',
        path: '/pages/updateLog/updateLog',
        imageUrl: '/images/update-share.jpg'
      };
    }
  });
  