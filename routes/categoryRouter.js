const express = require('express')
const router = express.Router()

const {createCategory} = require('../controllers/categoryController')

const { authenticateUser, authorizePermissions } = require('../middleware/authentication')

router.route('/').post(authenticateUser, authorizePermissions('admin', 'owner'), createCategory)

module.exports = router