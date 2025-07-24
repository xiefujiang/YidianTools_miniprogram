/**
 * 编码转换工具类
 * 包含各种编码/解码方法
 */
module.exports = {
    /**
     * URL编码
     * @param {string} str - 要编码的字符串
     * @returns {string} 编码后的字符串
     */
    urlEncode(str) {
      return encodeURIComponent(str);
    },
    
    /**
     * URL解码
     * @param {string} str - 要解码的字符串
     * @returns {string} 解码后的字符串
     */
    urlDecode(str) {
      try {
        return decodeURIComponent(str);
      } catch (e) {
        throw new Error('URL解码失败：输入包含无效的编码字符');
      }
    },
    
    /**
     * Base64编码
     * @param {string} str - 要编码的字符串
     * @returns {string} 编码后的Base64字符串
     */
    base64Encode(str) {
      return wx.arrayBufferToBase64(wx.base64ToArrayBuffer(str));
    },
    
    /**
     * Base64解码
     * @param {string} str - 要解码的Base64字符串
     * @returns {string} 解码后的字符串
     */
    base64Decode(str) {
      try {
        return wx.base64ToArrayBuffer(str).toString();
      } catch (e) {
        throw new Error('Base64解码失败：输入包含无效字符');
      }
    },
    
    /**
     * HTML实体编码
     * @param {string} str - 要编码的字符串
     * @returns {string} 编码后的HTML实体字符串
     */
    htmlEncode(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/ /g, '&nbsp;');
    },
    
    /**
     * HTML实体解码
     * @param {string} str - 要解码的HTML实体字符串
     * @returns {string} 解码后的字符串
     */
    htmlDecode(str) {
      return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ');
    },
    
    /**
     * Unicode编码
     * @param {string} str - 要编码的字符串
     * @returns {string} 编码后的Unicode字符串
     */
    unicodeEncode(str) {
      return str.split('').map(char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')).join('');
    },
    
    /**
     * Unicode解码
     * @param {string} str - 要解码的Unicode字符串
     * @returns {string} 解码后的字符串
     */
    unicodeDecode(str) {
      return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    },
    
    /**
     * 字符集转换（简化版）
     * 实际应用中可能需要引入更复杂的编码转换库
     * @param {string} str - 要转换的字符串
     * @param {string} fromCharset - 源字符集
     * @param {string} toCharset - 目标字符集
     * @returns {string} 转换后的字符串
     */
    convertCharset(str, fromCharset, toCharset) {
      // 这里只是模拟实现，实际需要更复杂的处理
      if (fromCharset === toCharset) return str;
      
      try {
        // 实际应用中应使用专门的编码转换库
        return str;
      } catch (e) {
        throw new Error(`字符集转换失败：无法将${fromCharset}转换为${toCharset}`);
      }
    },
    
    /**
     * 十六进制编码
     * @param {string} str - 要编码的字符串
     * @returns {string} 编码后的十六进制字符串
     */
    hexEncode(str) {
      let hex = '';
      for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2, '0');
      }
      return hex;
    },
    
    /**
     * 十六进制解码
     * @param {string} str - 要解码的十六进制字符串
     * @returns {string} 解码后的字符串
     */
    hexDecode(str) {
      if (str.length % 2 !== 0) {
        throw new Error('十六进制解码失败：输入长度必须为偶数');
      }
      
      let result = '';
      for (let i = 0; i < str.length; i += 2) {
        const hex = str.substr(i, 2);
        const charCode = parseInt(hex, 16);
        if (isNaN(charCode)) {
          throw new Error(`十六进制解码失败：无效的十六进制字符 ${hex}`);
        }
        result += String.fromCharCode(charCode);
      }
      return result;
    },
    
    /**
     * ASCII编码
     * @param {string} str - 要编码的字符串
     * @returns {string} 编码后的ASCII码字符串
     */
    asciiEncode(str) {
      return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code > 127) {
          throw new Error(`ASCII编码失败：包含非ASCII字符 ${char}`);
        }
        return code;
      }).join(' ');
    },
    
    /**
     * ASCII解码
     * @param {string} str - 要解码的ASCII码字符串
     * @returns {string} 解码后的字符串
     */
    asciiDecode(str) {
      return str.split(/\s+/).map(codeStr => {
        const code = parseInt(codeStr, 10);
        if (isNaN(code) || code < 0 || code > 127) {
          throw new Error(`ASCII解码失败：无效的ASCII码 ${codeStr}`);
        }
        return String.fromCharCode(code);
      }).join('');
    },
    
    /**
     * Quoted-Printable编码
     * @param {string} str - 要编码的字符串
     * @returns {string} 编码后的字符串
     */
    quotedPrintableEncode(str) {
      // 简化实现
      let result = '';
      for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode >= 33 && charCode <= 60 && charCode !== 61 || 
            charCode >= 62 && charCode <= 126) {
          result += str.charAt(i);
        } else {
          result += '=' + charCode.toString(16).toUpperCase().padStart(2, '0');
        }
      }
      return result;
    },
    
    /**
     * Quoted-Printable解码
     * @param {string} str - 要解码的字符串
     * @returns {string} 解码后的字符串
     */
    quotedPrintableDecode(str) {
      // 简化实现
      return str.replace(/=([0-9A-Fa-f]{2})/g, (match, hex) => {
        const charCode = parseInt(hex, 16);
        return String.fromCharCode(charCode);
      });
    },
    
    /**
     * Base32编码
     * @param {string} str - 要编码的字符串
     * @returns {string} 编码后的Base32字符串
     */
    base32Encode(str) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      let bits = '';
      let result = '';
      
      // 将字符串转换为二进制位
      for (let i = 0; i < str.length; i++) {
        bits += str.charCodeAt(i).toString(2).padStart(8, '0');
      }
      
      // 按5位一组进行编码
      for (let i = 0; i < bits.length; i += 5) {
        const chunk = bits.substr(i, 5).padEnd(5, '0');
        const index = parseInt(chunk, 2);
        result += alphabet[index];
      }
      
      // 添加填充
      while (result.length % 8 !== 0) {
        result += '=';
      }
      
      return result;
    },
    
    /**
     * Base32解码
     * @param {string} str - 要解码的Base32字符串
     * @returns {string} 解码后的字符串
     */
    base32Decode(str) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      let bits = '';
      let result = '';
      
      // 移除填充
      str = str.replace(/=/g, '');
      
      // 将Base32字符转换为二进制位
      for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i).toUpperCase();
        const index = alphabet.indexOf(char);
        if (index === -1) {
          throw new Error(`Base32解码失败：无效字符 ${char}`);
        }
        bits += index.toString(2).padStart(5, '0');
      }
      
      // 按8位一组转换为字符
      for (let i = 0; i < bits.length; i += 8) {
        const chunk = bits.substr(i, 8);
        if (chunk.length === 8) {
          const charCode = parseInt(chunk, 2);
          result += String.fromCharCode(charCode);
        }
      }
      
      return result;
    },
    
    /**
     * Base64URL编码
     * @param {string} str - 要编码的字符串
     * @returns {string} 编码后的Base64URL字符串
     */
    base64UrlEncode(str) {
      return this.base64Encode(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    },
    
    /**
     * Base64URL解码
     * @param {string} str - 要解码的Base64URL字符串
     * @returns {string} 解码后的字符串
     */
    base64UrlDecode(str) {
      // 恢复填充
      let padding = str.length % 4;
      if (padding) {
        padding = 4 - padding;
        str += '='.repeat(padding);
      }
      
      // 恢复Base64字符
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      
      return this.base64Decode(str);
    },
    
  };
  