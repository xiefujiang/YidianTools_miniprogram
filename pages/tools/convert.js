Page({
    data: {
      // 支持的进制类型
      bases: ['二进制', '八进制', '十进制', '十六进制'],
      // 当前选中的进制索引
      base1Index: 2,  // 默认第一个为十进制
      base2Index: 0,  // 默认第二个为二进制
      // 输入框的值
      value1: '',
      value2: '',
      isRotated: false
    },
  
    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    onShareTimeline() {
        return {
            title: '邀请你一起使用"进制转换器"',
            query: "from=pyq"
        }
    },

    onShareAppMessage() {
        return {
            title: '邀请你一起使用"进制转换器"',
            path: '/pages/tools/convert',
        };
    },
  
    // 第一个进制选择器变化
    onBase1Change(e) {
      const index = e.detail.value;
      this.setData({ base1Index: index });
      // 如果有值，重新转换
      if (this.data.value1) {
        this.convertValue1ToValue2();
      }
    },
  
    // 第二个进制选择器变化
    onBase2Change(e) {
      const index = e.detail.value;
      this.setData({ base2Index: index });
      // 如果有值，重新转换
      if (this.data.value1) {
        this.convertValue1ToValue2();
      }
    },
  
    // 第一个输入框内容变化
    onValue1Change(e) {
      const value = e.detail.value.trim();
      this.setData({ value1: value });
      this.convertValue1ToValue2();
    },
  
    // 第二个输入框内容变化
    onValue2Change(e) {
      const value = e.detail.value.trim();
      this.setData({ value2: value });
      this.convertValue2ToValue1();
    },
  
    // 将第一个输入框的值转换到第二个
    convertValue1ToValue2() {
      const { value1, base1Index, base2Index } = this.data;
      
      // 空值处理
      if (!value1) {
        this.setData({ value2: '' });
        return;
      }
      
      // 获取源进制和目标进制的基数
      const fromBase = this.getBaseNumber(base1Index);
      const toBase = this.getBaseNumber(base2Index);
      
      // 验证输入是否符合源进制规则
      if (!this.validateInput(value1, fromBase)) {
        this.setData({ value2: '输入格式错误' });
        return;
      }
      
      // 执行转换
      try {
        // 先转换为十进制，再转换为目标进制
        const decimalValue = parseInt(value1, fromBase);
        let result;
        
        if (toBase === 16) {
          result = decimalValue.toString(toBase).toUpperCase();
        } else {
          result = decimalValue.toString(toBase);
        }
        
        this.setData({ value2: result });
      } catch (error) {
        this.setData({ value2: '转换失败' });
      }
    },
  
    // 将第二个输入框的值转换到第一个
    convertValue2ToValue1() {
      const { value2, base1Index, base2Index } = this.data;
      
      // 空值处理
      if (!value2) {
        this.setData({ value1: '' });
        return;
      }
      
      // 获取源进制和目标进制的基数
      const fromBase = this.getBaseNumber(base2Index);
      const toBase = this.getBaseNumber(base1Index);
      
      // 验证输入是否符合源进制规则
      if (!this.validateInput(value2, fromBase)) {
        this.setData({ value1: '输入格式错误' });
        return;
      }
      
      // 执行转换
      try {
        // 先转换为十进制，再转换为目标进制
        const decimalValue = parseInt(value2, fromBase);
        let result;
        
        if (toBase === 16) {
          result = decimalValue.toString(toBase).toUpperCase();
        } else {
          result = decimalValue.toString(toBase);
        }
        
        this.setData({ value1: result });
      } catch (error) {
        this.setData({ value1: '转换失败' });
      }
    },
  
    // 根据索引获取进制基数
    getBaseNumber(index) {
      const bases = [2, 8, 10, 16];
      return bases[index];
    },
  
    // 验证输入是否符合指定进制的规则
    validateInput(value, base) {
      if (base === 2) {
        // 二进制只能包含0和1
        return /^[01]+$/.test(value);
      } else if (base === 8) {
        // 八进制只能包含0-7
        return /^[0-7]+$/.test(value);
      } else if (base === 10) {
        // 十进制只能包含0-9
        return /^[0-9]+$/.test(value);
      } else if (base === 16) {
        // 十六进制可以包含0-9和A-F（不区分大小写）
        return /^[0-9A-Fa-f]+$/.test(value);
      }
      return false;
    },
  
    // 复制第一个输入框的值
    copyValue1() {
      const { value1 } = this.data;
      if (!value1) {
        this.showToast('没有可复制的内容');
        return;
      }
      
      wx.setClipboardData({
        data: value1,
        success: () => {
          this.showToast('复制成功');
        },
        fail: () => {
          this.showToast('复制失败');
        }
      });
    },
  
    // 复制第二个输入框的值
    copyValue2() {
      const { value2 } = this.data;
      if (!value2) {
        this.showToast('没有可复制的内容');
        return;
      }
      
      wx.setClipboardData({
        data: value2,
        success: () => {
          this.showToast('复制成功');
        },
        fail: () => {
          this.showToast('复制失败');
        }
      });
    },
  
    // 收藏结果（功能暂未实现）
    saveResult() {
      wx.showToast({
        title: '收藏功能待开发',
        icon:'none',
        duration:1500
      })
    },
    
    onSwapBases() {
        this.setData({
            isRotated: !this.data.isRotated
          });

        // 获取当前的进制选择状态
        const { base1, base2, value1, value2 } = this.data;
        
        // 保存当前输入值
        const tempValue1 = value1;
        const tempValue2 = value2;
        
        // 交换进制选择
        this.setData({
          // 交换进制选择
          base1: base2,
          base2: base1,
          // 先清空值避免转换冲突
          value1: '',
          value2: ''
        }, () => {
          // 在setData回调中设置交换后的值并触发转换
          // 这里使用setTimeout确保UI更新完成
          setTimeout(() => {
            // 如果原第二个输入框有值，赋值给第一个并触发转换
            if (tempValue2) {
              this.setData({ value1: tempValue2 }, () => {
                this.onValue1Change({ detail: { value: tempValue2 } });
              });
            } else if (tempValue1) {
              // 如果原第一个输入框有值，赋值给第二个并触发转换
              this.setData({ value2: tempValue1 }, () => {
                this.onValue2Change({ detail: { value: tempValue1 } });
              });
            }
          }, 0);
        });
      }


  });


  