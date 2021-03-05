exports.setLocationHeader = function (res, url) {
    // console.log("Redirecting to " + redirectLocation);
    res.writeHead(302 , {
        'Location' : url
    });

    return res
  };
