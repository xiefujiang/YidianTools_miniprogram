Page({
    data: {
        // 正则表达式
        regexPattern: '',
        // 测试文本
        testText: '',
        // 匹配选项
        options: {
            ignoreCase: false, // i
            global: true, // g
            multiline: false, // m
            dotAll: false // s
        },
        // 匹配结果
        showResult: false,
        isValid: false,
        matches: [],
        errorMessage: '',

        showMoreModal: false,
        moreTemplates: [{
                name: 'URL地址',
                regex: '^(((ht|f)tps?):\\/\\/)?([^!@#$%^&*?.\\s-]([^!@#$%^&*?.\\s]{0,63}[^!@#$%^&*?.\\s])?\\.)+[a-z]{2,6}\\/?'
            },
            {
                name: 'IP地址',
                regex: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b'
            },
            {
                name: '中文汉字',
                regex: '^[\u4e00-\u9fa5]+$'
            },
            {
                name: '数字',
                regex: '^\\d+$'
            },
            {
                name: '字母',
                regex: '^[A-Za-z]+$'
            },
            {
                name: '火车车次',
                regex: '^[GCDZTSPKXLY1-9]\\d{1,4}$'
            },
            {
                name: '手机机身码(IMEI)',
                regex: '^\\d{15,17}$'
            },
            {
                name: '带端口号的网址(或ip)',
                regex: '^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$'
            },
            {
                name: '统一社会信用代码',
                regex: '^[0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}$'
            },
            {
                name: '统一社会信用代码(宽松匹配)(15位/18位/20位数字/字母)',
                regex: '^(([0-9A-Za-z]{15})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$'
            },
            {
                name: '迅雷链接',
                regex: '^thunderx?:\\/\\/[a-zA-Z\\d]+=$'
            },
            {
                name: 'ed2k链接(宽松匹配)',
                regex: '^ed2k:\\/\\/\\|file\\|.+\\|\\/$'
            },
            {
                name: '磁力链接(宽松匹配)',
                regex: '^magnet:\\?xt=urn:btih:[0-9a-fA-F]{40,}.*$'
            },
            {
                name: '子网掩码(不包含 0.0.0.0)',
                regex: '^(254|252|248|240|224|192|128)\\.0\\.0\\.0|255\\.(254|252|248|240|224|192|128|0)\\.0\\.0|255\\.255\\.(254|252|248|240|224|192|128|0)\\.0|255\\.255\\.255\\.(255|254|252|248|240|224|192|128|0)$'
            },
            {
                name: 'linux"隐藏文件"路径',
                regex: '^\\/(?:[^/]+\\/)*\\.[^/]*'
            },
            {
                name: 'linux文件夹路径',
                regex: '^\\/(?:[^/]+\\/)*$'
            },
            {
                name: 'window"文件夹"路径',
                regex: '^[a-zA-Z]:\\\\(?:\\w+\\\\?)*$'
            },
            {
                name: 'window下"文件"路径',
                regex: '^[a-zA-Z]:\\\\(?:\\w+\\\\)*\\w+\\.\\w+$'
            },
            {
                name: '股票代码(A股)',
                regex: '^(s[hz]|S[HZ])(000[\\d]{3}|002[\\d]{3}|300[\\d]{3}|600[\\d]{3}|60[\\d]{4})$'
            },
            {
                name: '考卷分数(0~150，支持小数0.5)',
                regex: '^150$|^(?:\\d|[1-9]\\d|1[0-4]\\d)(?:\\.5)?$'
            },
            {
                name: 'html注释',
                regex: '<!--[\\s\\S]*?-->'
            },
            {
                name: 'md5格式(32位)',
                regex: '^[a-fA-F0-9]{32}$'
            },
            {
                name: 'GUID/UUID',
                regex: '^[a-f\\d]{4}(?:[a-f\\d]{4}-){4}[a-f\\d]{12}$'
            },
            {
                name: '版本号(X.Y.Z格式)',
                regex: '^\\d+(?:\\.\\d+){2}$'
            },
            {
                name: '视频链接地址（视频格式可按需增删）',
                regex: '^https?:\\/\\/(.+\\/)+.+(\\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$'
            },
            {
                name: '图片链接地址（图片格式可按需增删）',
                regex: '^https?:\\/\\/(.+\\/)+.+(\\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$'
            },
            {
                name: '24小时制时间（HH:mm:ss）',
                regex: '^(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$'
            },
            {
                name: '12小时制时间（hh:mm:ss）',
                regex: '^(?:1[0-2]|0?[1-9]):[0-5]\\d:[0-5]\\d$'
            },
            {
                name: 'base64格式',
                regex: "^\\s*data:(?:[a-z]+\\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\\-._~:@/?%\\s]*?)\\s*$"
            },
            {
                name: '数字/货币金额（支持负数、千分位分隔符）',
                regex: '^-?\\d{1,3}(,\\d{3})*(\\.\\d{1,2})?$'
            },
            {
                name: '银行卡号（10到30位, 覆盖对公/私账户）',
                regex: '^[1-9]\\d{9,29}$'
            },
            {
                name: '中文姓名',
                regex: '^(?:[\u4e00-\u9fa5·]{2,16})$'
            },
            {
                name: '英文姓名',
                regex: '(^[a-zA-Z][a-zA-Z\\s]{0,20}[a-zA-Z]$)'
            },
            {
                name: '车牌号(新能源)',
                regex: '^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))$'
            },
            {
                name: '车牌号(非新能源)',
                regex: '^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]$'
            },
            {
                name: '中国手机号(严谨), 根据工信部最新公布的手机号段',
                regex: '^(?:(?:\\+|00)86)?1(?:(?:3[\\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\\d])|(?:9[01256789]))\\d{8}$'
            },
            {
                name: '中国手机号(宽松), 13,14,15,16,17,18,19开头',
                regex: '^(?:(?:\\+|00)86)?1[3-9]\\d{9}$'
            },
            {
                name: '中国手机号(最宽松), 1开头即可, 适合匹配用来接收短信的手机号',
                regex: '^(?:(?:\\+|00)86)?1\\d{10}$'
            },
            {
                name: '日期(宽松)',
                regex: '^\\d{1,4}(-)(1[0-2]|0?[1-9])\\1(0?[1-9]|[1-2]\\d|30|31)$'
            },
            {
                name: '日期(严谨, 支持闰年判断)',
                regex: '^\\d{1,4}(-)(1[0-2]|0?[1-9])\\1(0?[1-9]|[1-2]\\d|30|31)$'
            },
            {
                name: '中国省份名称',
                regex: '^浙江|上海|北京|天津|重庆|黑龙江|吉林|辽宁|内蒙古|河北|新疆|甘肃|青海|陕西|宁夏|河南|山东|山西|安徽|湖北|湖南|江苏|四川|贵州|云南|广西|西藏|江西|广东|福建|台湾|海南|香港|澳门$'
            },
            {
                name: '可以被moment转化成功的时间(YYYYMMDD HH:mm:ss)',
                regex: '^\\d{4}([/:-\\S])(1[0-2]|0?[1-9])\\1(0?[1-9]|[1-2]\\d|30|31) (?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$'
            },
            {
                name: '电子邮箱地址',
                regex: '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
            },
            {
                name: '座机电话(国内),如: 0123-12345678',
                regex: '^(?:(?:\\d{3}-)?\\d{8}|^(?:\\d{4}-)?\\d{7,8})(?:-\\d+)?$'
            },
            {
                name: '身份证号(1代,15位数字)',
                regex: '^[1-9]\\d{7}(?:0\\d|10|11|12)(?:0[1-9]|[1-2][\\d]|30|31)\\d{3}$'
            },
            {
                name: '身份证号(2代,18位数字),支持校验末位X',
                regex: '^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$'
            },
            {
                name: '身份证号, 支持1/2代(15位/18位数字)',
                regex: '^\\d{6}((((((19|20)\\d{2})(0[13-9]|1[012])(0[1-9]|[12]\\d|30))|(((19|20)\\d{2})(0[13578]|1[02])31)|((19|20)\\d{2})02(0[1-9]|1\\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\\d{3})|((((\\d{2})(0[13-9]|1[012])(0[1-9]|[12]\\d|30))|((\\d{2})(0[13578]|1[02])31)|((\\d{2})02(0[1-9]|1\\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\\d{2}))(\\d|X|x)$'
            },
            {
                name: '护照（包含香港、澳门）',
                regex: '(^[EeKkGgDdSsPpHh]\\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\\d{7}$)'
            },
            {
                name: '帐号是否合法(字母开头，5-16字节，允许字母数字下划线)',
                regex: '^[a-zA-Z]\\w{4,15}$'
            },
            {
                name: '小数(支持科学计数)',
                regex: '^[+-]?(\\d+([.]\\d*)?([eE][+-]?\\d+)?|[.]\\d+([eE][+-]?\\d+)?)$'
            },
            {
                name: '只包含数字',
                regex: '^\\d+$'
            },
            {
                name: 'html标签(宽松匹配)',
                regex: '<(\\w+)[^>]*>(.*?<\\/\\1>)?'
            },
            {
                name: '匹配中文汉字和中文标点',
                regex: '[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]'
            },
            {
                name: 'qq号格式正确',
                regex: '^[1-9][0-9]{4,10}$'
            },
            {
                name: '全小写英文字母',
                regex: '^[a-z]+$'
            },
            {
                name: '大写英文字母',
                regex: '^[A-Z]+$'
            },
            {
                name: '密码强度校验，最少6位，大写字母+小写字母+数字+特殊字符',
                regex: '^\\S*(?=\\S{6,})(?=\\S*\\d)(?=\\S*[A-Z])(?=\\S*[a-z])(?=\\S*[!@#$%^&*? ])\\S*$'
            },
            {
                name: '用户名校验，4到16位（字母，数字，下划线，减号）',
                regex: '^[\\w-]{4,16}$'
            },
            {
                name: '带端口号的ipv4',
                regex: '^((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$'
            },
            {
                name: '带端口号的ipv6',
                regex: '(^(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$)|(^\\[(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b)\\.){3}(\\b((25[0-5])|(1\\d{2})|(2[0-4]\\d)|(\\d{1,2}))\\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))\\](?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$)'
            },
            {
                name: '16进制颜色',
                regex: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3}|[a-fA-F0-9]{8}|[a-fA-F0-9]{4})$'
            },
            {
                name: '微信号，6~20位，以字母开头，字母+数字可减号可下划线',
                regex: '^[a-zA-Z][-_a-zA-Z0-9]{5,19}$'
            },
            {
                name: '邮政编码(中国)',
                regex: '^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\\d{4}$'
            },
            {
                name: '中文和数字',
                regex: '^((?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])|(\\d))+$'
            },
            {
                name: '不能包含字母',
                regex: '^[^A-Za-z]*$'
            },
            {
                name: 'java包名',
                regex: '^([a-zA-Z_]\\w*)+([.][a-zA-Z_]\\w*)+$'
            },
            {
                name: 'mac地址',
                regex: '^(([a-f0-9][0,2,4,6,8,a,c,e]:([a-f0-9]{2}:){4})|([a-f0-9][0,2,4,6,8,a,c,e]-([a-f0-9]{2}-){4}))[a-f0-9]{2}$'
            },
            {
                name: '匹配连续重复的字符',
                regex: '(.)\\1+'
            },
            {
                name: '同时含有数字和英文字母',
                regex: '^(?=.*[a-zA-Z])(?=.*\\d).+$'
            },
            {
                name: '香港身份证',
                regex: '^[a-zA-Z]\\d{6}\\([\\dA]\\)$'
            },
            {
                name: '澳门身份证',
                regex: '^[1|5|7]\\d{6}\\(\\d\\)$'
            },
            {
                name: '台湾身份证',
                regex: '^[a-zA-Z][0-9]{9}$'
            },
            {
                name: '密码,包含大写字母，小写字母，数字，特殊符号中任意3项',
                regex: '^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]'
            },
            {
                name: 'ASCII码表中的全部的特殊字符',
                regex: '[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]+'
            }, /*徐修改！！！！！！！！！！！！！！！！！ */
            {
                name: '正整数，不包含0',
                regex: '^\\+?[1-9]\\d*$'
            },
            {
                name: '负整数，不包含0',
                regex: '^-[1-9]\\d*$'
            },
            {
                name: '整数',
                regex: '^(?:0|(?:-?[1-9]\\d*))$'
            },
            {
                name: '浮点数',
                regex: '^(-?[1-9]\\d*\\.\\d+|-?0\\.\\d*[1-9]\\d*|0\\.0+)$'
            },
            {
                name: '浮点数(严格)',
                regex: '浮点数(严格)'
            },
            {
                name: 'email(支持中文邮箱)',
                regex: '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$'
            },
            {
                name: '域名(非网址, 不包含协议)',
                regex: '^([0-9a-zA-Z-]{1,}\\.)+([a-zA-Z]{2,})$'
            },
            {
                name: '军官/士兵证',
                regex: '^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$'
            },
            {
                name: '户口薄',
                regex: '(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)'
            },
        ],

        pageScrollToBottom: function() {
            wx.createSelectorQuery().select('#scrollTarget').boundingClientRect(function(rect) {
              if (rect) {
                wx.pageScrollTo({
                  scrollTop: rect.height,
                  duration: 300 // 可设置滚动动画时长，单位毫秒
                });
              }
            }).exec();
          }
    },

    // 选择常用正则模板
    selectTemplate(e) {
        if (this.data.showMoreModal) {
            const index = e.currentTarget.dataset.index;
            const selectedRegex = this.data.moreTemplates[index].regex;
            console.log({index,selectedRegex});
            this.setData({
                regexPattern: selectedRegex,
                showMoreModal: false
            });
        } else {
            const pattern = e.currentTarget.dataset.pattern;
            this.setData({
                regexPattern: pattern
            });
        }
    },

    copyregex(){
        wx.setClipboardData({
            data:this.data.regexPattern,
            success(res){
                wx.showToast({
                  title: '已复制',
                  icon:'success',
                  duration:1500
                })
            }
        });
    },

    // 正则表达式输入变化
    onRegexInput(e) {
        this.setData({
            regexPattern: e.detail.value
        });
    },

    // 测试文本输入变化
    onTextInput(e) {
        this.setData({
            testText: e.detail.value
        });
    },

    // 匹配选项变化
    onOptionChange(e) {
        const option = e.currentTarget.dataset.option;
        const newOptions = {
            ...this.data.options
        };
        newOptions[option] = e.detail.value[0] === option;
        this.setData({
            options: newOptions
        });
    },

    // 测试正则表达式
    testRegex() {
        const {
            regexPattern,
            testText,
            options
        } = this.data;

        // 检查输入
        if (!regexPattern) {
            wx.showToast({
                title: '请输入正则表达式',
                icon: 'none'
            });
            return;
        }

        if (!testText) {
            wx.showToast({
                title: '请输入测试文本',
                icon: 'none'
            });
            return;
        }

        try {
            // 构建正则表达式标志
            let flags = '';
            if (options.ignoreCase) flags += 'i';
            if (options.global) flags += 'g';
            if (options.multiline) flags += 'm';
            if (options.dotAll) flags += 's';

            // 创建正则表达式对象
            const regex = new RegExp(regexPattern, flags);

            // 执行匹配
            let matches;
            const result = [];

            // 如果是全局匹配，获取所有匹配项
            if (options.global) {
                while ((matches = regex.exec(testText)) !== null) {
                    result.push(matches[0]);
                    // 防止无限循环
                    if (matches.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                }
            } else {
                // 非全局匹配，只获取第一个匹配项
                matches = regex.exec(testText);
                if (matches) {
                    result.push(matches[0]);
                }
            }

            // 更新结果
            this.setData({
                showResult: true,
                isValid: result.length > 0,
                matches: result,
                errorMessage: ''
            });
            this.data.pageScrollToBottom();
        } catch (error) {
            // 处理正则表达式语法错误
            this.setData({
                showResult: true,
                isValid: false,
                matches: [],
                errorMessage: error.message
            });
        }
    },

    // 清空所有输入和结果
    clearAll() {
        this.setData({
            regexPattern: '',
            testText: '',
            options: {
                ignoreCase: false,
                global: true,
                multiline: false,
                dotAll: false
            },
            showResult: false,
            isValid: false,
            matches: [],
            errorMessage: ''
        });
    },
    showMoreTemplatesModals() {
        this.setData({
            showMoreModal: true
        });
    },
    hideMoreTemplatesModal() {
        this.setData({
            showMoreModal: false
        });
    },

    onLoad(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    onShareTimeline() {
        return {
            title: '邀请你一起使用"正则表达式工具"',
            query: "from=pyq"
        }
    },

    onShareAppMessage() {
        return {
            title: '邀请你一起使用"正则表达式工具"',
            path: '/pages/tools/regex',
        };
    },

});