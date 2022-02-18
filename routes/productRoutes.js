const express = require('express')
const router = express.Router()

const {
    getAllProducts,
    getSingleProduct,
    createProduct,
    uploadImage,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')
const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')

router
    .route('/')
    .post(authenticateUser, authorizePermissions('admin', 'owner'), createProduct)
    .get(getAllProducts)
router
    .route('/uploadImage/:id')
    .post(authenticateUser, authorizePermissions('admin', 'owner'), uploadImage)
router
    .route('/:id')
    .get(getSingleProduct)
    .patch(authenticateUser, authorizePermissions('admin', 'owner'), updateProduct)
    .delete(authenticateUser, authorizePermissions('admin', 'owner'), deleteProduct)



module.exports = router