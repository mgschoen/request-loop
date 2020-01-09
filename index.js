const request = require('request-promise-native');

function requestLoop (urls, index, operation, callback) {

    let next = function () {
        if (index < urls.length - 1) {
            requestLoop(urls, index+1, operation, callback);
        } else {
            callback();
        }
    }
    
    if (urls.length) {
        console.log(`Requesting ${urls[index]} ...`);
        request(encodeURI(urls[index])).then(response => {
            return operation(response);
        }).then(() => {
            next();
        }).catch(error => {
            console.warn(error.message);
        });
    } else {
        next();
    }
}


module.exports = function (urls, operation) {
    return new Promise((resolve, reject) => {
        requestLoop(urls, 0, operation, function () {
            resolve();
        });
    });
}
