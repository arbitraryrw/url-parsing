exports.isUrlValid = function (relUrl) {

    console.log("Handling: " + relUrl)

    var re = new RegExp("^(\/[a-zA-Z0-9]+){0,}$");

    if (re.test(relUrl)) {
      return true
    } else {
      return false
    }
  };

  exports.isParamValid = function (param) {
    var re = new RegExp("^([a-zA-Z0-9]+){0,}$");
    return Boolean(re.test(param));
  };
