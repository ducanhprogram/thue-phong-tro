const response = require("@/utils/response");

function handleErrors(error, req, res, next) {
    response.error(res, error.status ?? 500, String(error), error.errors);
}
module.exports = handleErrors;
