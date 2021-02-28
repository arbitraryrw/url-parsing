const { URL } = require('url');



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


exports.constructUrl = function () {
    var base = 'http://127.0.0.1'
    var relative = '/p/a/t/h?query=string#has'
    var newUrl = new URL(relative, base);
    console.log(newUrl);
    return newUrl;
  };
