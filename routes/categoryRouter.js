const express = require('express')
const router = express.Router()

const {createCategory, getAllCategories, updateCategory} = require('../controllers/categoryController')

const { authenticateUser, authorizePermissions } = require('../middleware/authentication')

router.route('/').post(authenticateUser, authorizePermissions('admin', 'owner'), createCategory).get(getAllCategories)

router.route('/:id').patch(authenticateUser, authorizePermissions('admin','owner'), updateCategory)

module.exports = router