const e = require('express');
const Interview = require('../models/Interview');

exports.getInterviews = async (req, res, next) => {
    let query;

    if(req.user.role !== 'admin') {
        query = Interview.find({user: req.user.id}).populate(
            {
                path: 'company',
                select: 'name address telephone_number '
            }
        );
    }else {
        query = Interview.find().populate(
            {
                path: 'company',
                select: 'name address telephone_number '
            }
        );
    }

    try {
        const interviews = await query;
        res.status(200).json({success: true, data: interviews});
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
};

exports.createInterview = async (req, res, next) => {
    try {
        const interview = await Interview.create(req.body);
        res.status(201).json({success: true, data: interview});
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
}

exports.editInterview = async (req, res, next) => {
    if(req.user.role === 'admin') {
        try {
            const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            res.status(200).json({success: true, data: interview});
        } catch (err) {
            res.status(400).json({success: false, message: err.message});
        }   
    }else {
        //check if the interview belongs to the user
        const interview = await Interview.findById(req.params.id);
        if(interview.user.toString() !== req.user.id) {
            return res.status(401).json({success: false, message: 'Not authorized to update this interview'});
        }
        try {
            const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            res.status(200).json({success: true, data: interview});
        } catch (err) {
            res.status(400).json({success: false, message: err.message});
        }
    }
}

exports.deleteInterview = async (req, res, next) => {
    if(req.user.role === 'admin') {
        try {
            await Interview.findByIdAndDelete(req.params.id);
            res.status(200).json({success: true, data: {}});
        } catch (err) {
            res.status(400).json({success: false, message: err.message});
        }
    } else {
        //check if the interview belongs to the user
        const interview = await Interview.findById(req.params.id);
        if(interview.user.toString() !== req.user.id) {
            return res.status(401).json({success: false, message: 'Not authorized to delete this interview'});
        }
        try {
            await Interview.findByIdAndDelete(req.params.id);
            res.status(200).json({success: true, data: {}});
        } catch (err) {
            res.status(400).json({success: false, message: err.message});
        }
    }
}