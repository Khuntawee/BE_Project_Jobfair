const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interview', InterviewSchema);