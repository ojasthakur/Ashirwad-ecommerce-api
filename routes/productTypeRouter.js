const express = require('express')
const router = express.Router()

const {createProductType, getAllProductTypesOfCategory, updateProductType} = require('../controllers/productTypeController')

const { authenticateUser, authorizePermissions } = require('../middleware/authentication')

router.route('/').post(authenticateUser, authorizePermissions('admin', 'owner'), createProductType)
router.route('/').get(getAllProductTypesOfCategory)

router.route('/:id').patch(authenticateUser, authorizePermissions('admin', 'owner'), updateProductType)

module.exports = router