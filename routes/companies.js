const express = require('express');
const {getCompanies, getCompany, createCompany, editCompany, deleteCompany} = require('../controllers/companies');
const {protect, authorize} = require('../middleware/auth');
const router = express.Router();

router.route('/').get(getCompanies).post(protect, authorize('admin'), createCompany);
router.route('/:id').get(getCompany).put(protect, authorize('admin'), editCompany).delete(protect, authorize('admin'), deleteCompany);


module.exports = router;