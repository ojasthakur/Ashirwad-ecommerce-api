const CustomError = require('../errors')
const UserModel = require('../models/UserModel')
const { isTokenValid } = require('../utils/jwt')
const User = require('../models/UserModel')

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError("No authentication")
    }
    try {
        const { name, userId, role } = isTokenValid({ token })
        req.user = { name, userId, role }
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
}
//we are returning a controller, cause in the authRoutes authorizePermissions
//is being invoked as a function at the start of the programme irrespective 
//of whether the route is being hit or not
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError(
               'Unauthorized to access this route'
           )
        }
        next() 
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions
};