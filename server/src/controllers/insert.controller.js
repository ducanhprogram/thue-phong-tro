const insertService = require("@/services/insert.service");

exports.insert = async (req, res) => {
    try {
        const response = await insertService.createPricesAndAreas();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: "Fail at auth controller: " + error,
        });
    }
};
