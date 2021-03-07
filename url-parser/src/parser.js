const { URL } = require('url');

exports.isUrlValid = function (relUrl) {

    console.log("Handling: " + relUrl)

    var re = new RegExp("^(\/[a-zA-Z0-9]+){0,}$");

    if (re.test(relUrl)) {
      return true
    } else {
      return false
    }
  };

exports.handleAbsoluteUrl = function () {
      var url = 'https://user:pass@sub.host.com:8080\\\\p/a/t/h?query=string#has'
      var newUrl = new URL(url);
      console.log(newUrl);
      return newUrl;
    };
  
  
exports.handleRelativeUrl = function () {
    var url = 'https://user:pass@sub.host.com:8080\\\\p/a/t/h?query=string#has'
    var newUrl = new URL(url);
    console.log(newUrl);
    return newUrl;
  };