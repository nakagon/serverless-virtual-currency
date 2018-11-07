'use strict';
let options = {};

module.exports = {
  parse: function(data) {
    let result = {};
    
    if (data.charAt(0) === '{') {
      result = JSON.parse(data);
    }
    let parts = data.split('&');
    for (var i = 0, len = parts.length; i < len; i++) {
      var keyVal = parts[i].split('=');
      // replace the + space then decode
      var key = decodeURIComponent(keyVal[0].replace(/\+/g, ' '));
      var value = decodeURIComponent(keyVal[1].replace(/\+/g, ' '));
      result[key] = value;
    }
    return result;
  }
}