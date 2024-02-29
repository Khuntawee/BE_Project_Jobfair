const express = require('express');
const {getInterviews, createInterview, editInterview, deleteInterview} = require('../controllers/interviews');
const {protect} = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getInterviews).post(protect, createInterview);
router.route('/:id').put(protect, editInterview).delete(protect, deleteInterview);

module.exports = router;