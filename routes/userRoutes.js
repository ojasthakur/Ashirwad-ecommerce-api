const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController')
const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')

const express = require('express')
const router = express.Router()

router.route('/').get(authenticateUser,authorizePermissions('admin','owner'), getAllUsers)

router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUser').patch(authenticateUser,updateUser)
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)

//....'/showMe' route should be placed before the get single user route
//....otherwise 'showme' will be treated as id in getSingleUser
router.route('/:id').get(authenticateUser, getSingleUser)


module.exports = router