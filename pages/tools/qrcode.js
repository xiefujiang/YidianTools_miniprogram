// pages/tools/qrcode.js
import drawQrcode from 'weapp-qrcode';

Page({
    data: {
        inputValue: '',
        qrcodeUrl: '',
        qrcodeCanvasId: 'myQrcode',
        showQrcode: false,
        canvasSize: 0,
        isLoading: false,
        errorMsg: '',
        retryCount: 0
    },

    preview() {
        // 检查是否有生成的二维码图片
        if (!this.data.qrcodeUrl) {
            wx.showToast({
                title: '请先生成二维码',
                icon: 'none'
            });
            return;
        }
        
        // 调用微信自带的图片预览API
        wx.previewImage({
            current: this.data.qrcodeUrl,  // 当前显示图片的路径
            urls: [this.data.qrcodeUrl],   // 需要预览的图片路径列表（单张图片时也需要数组形式）
            success: () => {
                console.log('图片预览预览成功');
            },
            fail: (err) => {
                console.error('图片预览失败:', err);
                wx.showToast({
                    title: '预览失败',
                    icon: 'none'
                });
            }
        });
    },

    onLoad() {
        console.log('drawQrcode 类型:', typeof drawQrcode);

        if (typeof drawQrcode !== 'function') {
            this.setData({
                errorMsg: '二维码库加载失败，请检查npm构建'
            });
            return;
        }

        const windowInfo = wx.getWindowInfo();
        this.setData({
            canvasSize: windowInfo.windowWidth * 0.7
        });
    },

    onInputChange(e) {
        const value = e.detail.value || '';
        console.log('输入内容:', value);

        this.setData({
            inputValue: value
        }, () => {
            console.log('更新后 inputValue:', this.data.inputValue);
        });
    },

    generateQrcode() {
        if (this.data.isLoading) return;

        const content = this.data.inputValue;
        const isValid = content && content.trim().length > 0;

        console.log('输入内容验证:', {
            content,
            isValid
        });

        if (!isValid) {
            wx.showToast({
                title: '请输入有效内容',
                icon: 'none'
            });
            return;
        }

        this.setData({
            isLoading: true,
            errorMsg: '',
            retryCount: 0,
            qrcodeUrl: ''
        });

        wx.showLoading({
            title: '生成中...',
            mask: true
        });

        try {
            console.log('开始生成二维码，内容长度:', content.length);

            drawQrcode({
                width: this.data.canvasSize,
                height: this.data.canvasSize,
                canvasId: this.data.qrcodeCanvasId,
                text: content
            });

            this.setData({
                showQrcode: true
            });
            this.tryConvertCanvasToImage();

        } catch (error) {
            this.handleError('生成失败', error);
        }
    },

    tryConvertCanvasToImage() {
        const {
            retryCount
        } = this.data;

        console.log(`尝试转换canvas为图片，第${retryCount + 1}次尝试`);

        wx.canvasToTempFilePath({
            canvasId: this.data.qrcodeCanvasId,
            success: (res) => {
                console.log('canvas转图片成功:', res);

                this.setData({
                    qrcodeUrl: res.tempFilePath,
                    isLoading: false
                });

                wx.hideLoading();
                wx.showToast({
                    title: '生成成功',
                    icon: 'success'
                });
            },
            fail: (err) => {
                console.error('canvas转图片失败:', err);

                if (retryCount < 3) {
                    this.setData({
                        retryCount: retryCount + 1
                    });

                    const delay = 200 * Math.pow(2, retryCount);
                    console.log(`将在${delay}ms后重试`);

                    setTimeout(() => {
                        this.tryConvertCanvasToImage();
                    }, delay);

                    return;
                }

                this.setData({
                    showQrcode: false,
                    isLoading: false,
                    errorMsg: '图片转换失败'
                });

                this.handleError('转换失败', err);
            }
        });
    },

    saveQrcode() {
        if (!this.data.qrcodeUrl) return;

        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success: this.saveImageToPhotosAlbum.bind(this),
                        fail: () => wx.showToast({
                            title: '需要相册权限',
                            icon: 'none'
                        })
                    });
                } else {
                    this.saveImageToPhotosAlbum();
                }
            }
        });
    },

    saveImageToPhotosAlbum() {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.qrcodeUrl,
            success: () => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                });
            },
            fail: (err) => {
                this.handleError('保存失败', err);
            }
        });
    },

    handleError(title, error) {
        wx.hideLoading();

        // 显示详细错误信息（开发环境）
        const errorMsg = typeof error === 'string' ?
            error :
            JSON.stringify(error, null, 2);

        this.setData({
            errorMsg
        });

        // 显示用户友好提示
        wx.showToast({
            title,
            icon: 'none',
            duration: 3000
        });

        console.error(`${title}：`, error);
    },

    onUnload() {
        // 清理资源
        this.setData({
            isLoading: false
        });
    }
});