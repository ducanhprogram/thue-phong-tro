const response = require("@/utils/response");

function handlePagination(req, res, next) {
    const page = +req.query.page || 1;
    let limit = +req.query.limit || 10;
    let maxList = 50;
    if (limit > maxList) limit = maxList;

    req.page = page;
    req.limit = limit;

    //result : ở user.controller.js
    res.paginate = (result) => {
        response.paginate(res, result, { page, limit }); //page, limit là truyền object
    };
    next();
}

module.exports = handlePagination;
