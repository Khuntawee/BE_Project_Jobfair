const Company = require('../models/Company');

exports.getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find();
        res.status(200).json({success: true, data: companies});
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
};
