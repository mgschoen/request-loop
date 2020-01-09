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
        let config = urls[index];
        if (typeof config !== 'string') {
            config = parseOptions(config);
            console.log(`Requesting ${config.url} ...`);
            for (let option in config) {
                if (option !== 'url') {
                    console.log(`  - [${option}] ${config[option]}`);
                }
            }
        } else {
            config = encodeURI(config);
            console.log(`Requesting ${config} ...`);
        }
        request(config).then(response => {
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
