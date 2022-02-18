const CustomError = require('../errors')

const checkPermissions = (requestUser, resourceUserId) => {
    //console.log('...Checkin permissions...')
    // console.log(requestUser)
    // console.log(resourceUserId);
    // console.log(typeof requestUser)
    //console.log(resourceUserId)
    if (requestUser.role === 'admin' || requestUser.userId === resourceUserId.toString()) {
        //console.log('...Permissions Given...')
        return
    }
    throw new CustomError.UnauthorizedError('User not authorized to access this information')
}

module.exports = checkPermissions