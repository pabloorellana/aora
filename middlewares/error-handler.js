'use strict';


function buildErrorMessage (errors) {
    return {
        'errors': [errors]
    }
};

const statusCodesHandlers = {
    500: function (params) {
        return buildErrorMessage({
            'status': '500',
            'title' : params.title || 'Internal Server Error',
            'detail': params.detail || ''
        });
    },
    404: function (params) {
        return buildErrorMessage({
            'status': '404',
            'title':  params.title || 'Not Found',
            'detail': params.detail || ''
        });
    },
    409: function (params) {
        return buildErrorMessage({
            'status': '409',
            'title' : params.title || 'Conflict',
            'detail': params.detail || ''
        });
    }
};

exports.sendErrorResponse = function (err, req, res, next) {

    const handler = statusCodesHandlers[err.status];
    
    if (err.stack || !handler) {
        return res.status(500).send(statusCodesHandlers[500]({}));    
    }
    
    return res.status(err.status).send(handler(err));
}