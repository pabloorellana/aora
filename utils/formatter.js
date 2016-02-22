'use strict';

function excludeProperties (obj, params) {
    obj = JSON.parse(JSON.stringify(obj));

    for (var key in params) {
        if (params[key] === 0 && obj.hasOwnProperty(key)) {
            delete obj[key];
        }
    }

    return obj;
}

module.exports = { excludeProperties };