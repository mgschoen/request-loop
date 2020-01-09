const request = require('request-promise-native');

function parseOptions (requestConfig) {
    
    if (!requestConfig.url || typeof requestConfig.url !== 'string') {
        throw new Error('option `url` must be of type \'string\'');
    }
    
    return {
        url: encodeURI(requestConfig.url),
        method: requestConfig.method || 'GET',
        body: requestConfig.body || ''
    };
}

function requestLoop (urls, index, operation, callback) {

    let next = function () {
        if (index < urls.length - 1) {
            requestLoop(urls, index+1, operation, callback);
        } else {
            callback();
        }
    }
    
    if (urls.length) {
        let url = urls[index];
        if (typeof url !== 'string') {
            url = parseOptions(url);
            console.log(`Requesting ${url.url} ...`);
        } else {
            url = encodeURI(url);
            console.log(`Requesting ${url} ...`);
        }
        request(url).then(response => {
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
