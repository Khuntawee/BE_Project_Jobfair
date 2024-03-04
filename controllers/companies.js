const Company = require('../models/Company');

exports.getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find();
        res.status(200).json({success: true, data: companies});
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
};

exports.getCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(400).json({success: false, message: 'Company does not exist'});
        }
        res.status(200).json({success: true, data: company});
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
};

exports.createCompany = async (req, res, next) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json({success: true, data: company});
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
};

exports.editCompany = async (req, res, next) => {
    try {
        const company = await Company.findByIdAndUpdate
        (req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({success: true, data: company});
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
};

exports.deleteCompany = async (req, res, next) => {
    try {
        await Company.findByIdAndDelete(req.params.id);
        res.status(200).json({success: true, data: {}});
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
};
