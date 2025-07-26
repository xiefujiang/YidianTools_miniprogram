Page({
    data: {
      rValue: 128,
      gValue: 128,
      bValue: 128,
      colorHex: '#808080',
      isHexValid: true
    },
  
    onLoad: function() {
      this.updateColor();
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    },

    onShareTimeline() {
        return {
            title: '邀请你一起使用"RGB颜色选择器"',
            query: "from=pyq"
        }
    },

    onShareAppMessage() {
        return {
            title: '邀请你一起使用"RGB颜色选择器"',
            path: '/pages/tools/colorring',
        };
    },
  
    // RGB值改变事件（拖动结束）
    rChange: function(e) {
      this.setData({
        rValue: e.detail.value
      });
      this.updateColor();
    },
  
    gChange: function(e) {
      this.setData({
        gValue: e.detail.value
      });
      this.updateColor();
    },
  
    bChange: function(e) {
      this.setData({
        bValue: e.detail.value
      });
      this.updateColor();
    },
  
    // RGB值正在改变事件（拖动过程中）
    rChanging: function(e) {
      this.setData({
        rValue: e.detail.value
      });
      this.updateColorPreview();
    },
  
    gChanging: function(e) {
      this.setData({
        gValue: e.detail.value
      });
      this.updateColorPreview();
    },
  
    bChanging: function(e) {
      this.setData({
        bValue: e.detail.value
      });
      this.updateColorPreview();
    },
  
    // R值输入变化
    rInputChange: function(e) {
      this.setData({
        rValue: e.detail.value
      });
    },
  
    // R值输入完成
    rInputBlur: function(e) {
      let value = this.validateRgbValue(e.detail.value, this.data.rValue);
      this.setData({
        rValue: value
      });
      this.updateColor();
    },
  
    // G值输入变化
    gInputChange: function(e) {
      this.setData({
        gValue: e.detail.value
      });
    },
  
    // G值输入完成
    gInputBlur: function(e) {
      let value = this.validateRgbValue(e.detail.value, this.data.gValue);
      this.setData({
        gValue: value
      });
      this.updateColor();
    },
  
    // B值输入变化
    bInputChange: function(e) {
      this.setData({
        bValue: e.detail.value
      });
    },
  
    // B值输入完成
    bInputBlur: function(e) {
      let value = this.validateRgbValue(e.detail.value, this.data.bValue);
      this.setData({
        bValue: value
      });
      this.updateColor();
    },
  
    // 验证RGB输入值
    validateRgbValue: function(inputValue, defaultValue) {
      let value = parseInt(inputValue);
      if (isNaN(value)) {
        return defaultValue;
      }
      value = Math.max(0, Math.min(255, value));
      return value;
    },
  
    // HEX输入变化
    hexInputChange: function(e) {
      let hex = e.detail.value;
      if (hex && !hex.startsWith('#')) {
        hex = '#' + hex;
      }
      
      this.setData({
        colorHex: hex.toLowerCase(),
        isHexValid: this.validateHex(hex)
      });
    },
  
    // HEX输入框失去焦点时处理
    handleHexBlur: function() {
      if (this.data.isHexValid && this.data.colorHex.length === 7) {
        this.updateRgbFromHex();
      } else {
        wx.showToast({
          title: '请输入有效的HEX颜色代码',
          icon: 'none'
        });
        this.setData({
          colorHex: this.rgbToHex(this.data.rValue, this.data.gValue, this.data.bValue)
        });
      }
    },
  
    // 验证HEX格式
    validateHex: function(hex) {
      if (!hex) return false;
      return /^#[0-9a-fA-F]{6}$/.test(hex) || /^#[0-9a-fA-F]{3}$/.test(hex);
    },
  
    // 从HEX更新RGB值
    updateRgbFromHex: function() {
      const hex = this.data.colorHex;
      if (!this.validateHex(hex)) return;
      
      const fullHex = hex.length === 4 ? 
        '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : 
        hex;
      
      const r = parseInt(fullHex.substr(1, 2), 16);
      const g = parseInt(fullHex.substr(3, 2), 16);
      const b = parseInt(fullHex.substr(5, 2), 16);
      
      this.setData({
        rValue: r,
        gValue: g,
        bValue: b
      });
      this.updateColor();
    },
  
    // 更新颜色（完整更新，包括HEX显示）
    updateColor: function() {
      const r = parseInt(this.data.rValue);
      const g = parseInt(this.data.gValue);
      const b = parseInt(this.data.bValue);
      
      const hex = this.rgbToHex(r, g, b);
      
      this.setData({
        colorHex: hex,
        isHexValid: true
      });
    },
  
    // 仅更新颜色预览（不更新HEX显示，用于拖动过程中）
    updateColorPreview: function() {
      const r = parseInt(this.data.rValue);
      const g = parseInt(this.data.gValue);
      const b = parseInt(this.data.bValue);
      
      const hex = this.rgbToHex(r, g, b);
      
      this.setData({
        colorHex: hex
      });
    },
  
    // RGB转十六进制
    rgbToHex: function(r, g, b) {
      const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      };
      
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    },
  
    // 生成随机颜色
    generateRandomColor: function() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      
      this.setData({
        rValue: r,
        gValue: g,
        bValue: b
      });
      
      this.updateColor();
    },
  
    // 复制十六进制代码
    copyHexCode: function() {
      wx.setClipboardData({
        data: this.data.colorHex,
        success: function() {
          wx.showToast({
            title: '已复制',
            icon: 'success'
          });
        }
      });
    },

    savecolor: function(){
        wx.showToast({
          title: '收藏功能待开发',
          duration:1500,
          icon:'none'
        })
    }
  });