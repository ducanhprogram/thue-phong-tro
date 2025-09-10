const response = require("@/utils/response");
function responseEnhancer(req, res, next) {
    res.success = (status, data, message) => {
        response.success(res, status, data, message);
    };

    res.error = (status, message) => {
        if (status === 500) {
            console.error("Internal Server Error:", message);
        }
        response.error(res, status, message);
    };
    res.paginate = (data, pagination) => {
        response.paginate(res, data, pagination);
    };
    next();
}

module.exports = responseEnhancer;
