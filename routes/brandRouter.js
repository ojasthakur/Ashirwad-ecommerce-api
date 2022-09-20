const express = require('express')
const router = express.Router()

const {createBrand, getAllBrands, updateBrand} = require('../controllers/brandController')

const { authenticateUser, authorizePermissions } = require('../middleware/authentication')

router.route('/').post(authenticateUser, authorizePermissions('admin', 'owner'), createBrand).get(getAllBrands)

router.route('/:id').patch(authenticateUser, authorizePermissions('admin','owner'), updateBrand)

module.exports = router